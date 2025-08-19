import type { Transaction } from '../types';
import * as XLSX from 'xlsx';

// A simple in-memory cache to avoid re-parsing the same file content if needed
const fileCache = new Map<string, Transaction[]>();

// Heuristics to identify columns, handling case-insensitivity and common variations
const headerMapping: Record<keyof Omit<Transaction, 'id'>, string[]> = {
  date: ['date'],
  description: ['description', 'desc', 'details'],
  amount: ['amount', 'value', 'total'],
  category: ['category', 'group'],
  account: ['account', 'source'],
};

const findHeaderIndex = (headers: string[], possibleNames: string[]): number => {
  for (const name of possibleNames) {
    const index = headers.findIndex(h => h.trim().toLowerCase() === name);
    if (index !== -1) return index;
  }
  return -1;
};


const processRows = (rows: any[]): Transaction[] => {
    if (rows.length < 2) {
        throw new Error("File must contain a header row and at least one transaction.");
    }

    const headerRow = rows[0] as string[];
    const headers = headerRow.map(h => String(h).trim().toLowerCase());
    
    const dateIndex = findHeaderIndex(headers, headerMapping.date);
    const descriptionIndex = findHeaderIndex(headers, headerMapping.description);
    const amountIndex = findHeaderIndex(headers, headerMapping.amount);
    const categoryIndex = findHeaderIndex(headers, headerMapping.category);
    const accountIndex = findHeaderIndex(headers, headerMapping.account);

    if (dateIndex === -1 || amountIndex === -1) {
      throw new Error("File header must contain at least 'Date' and 'Amount' columns.");
    }
    
    const transactions: Transaction[] = [];
    const dataRows = rows.slice(1);

    for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i] as any[];
        
        try {
            let dateValue = row[dateIndex];
            let date: Date;
            
            if (dateValue instanceof Date) {
                date = dateValue;
            } else if (typeof dateValue === 'number') {
                // Formula from sheetjs to convert Excel date
                date = new Date(Date.UTC(0, 0, dateValue - 1));
            } else {
                const dateString = String(dateValue).trim();
                // Take only the date part and append T00:00:00 to parse as local time
                date = new Date(dateString.split('T')[0] + 'T00:00:00');
            }

            const amount = parseFloat(String(row[amountIndex]).trim());

            if (isNaN(date.getTime()) || isNaN(amount)) {
                console.warn(`Skipping invalid row ${i + 2}:`, row);
                continue;
            }

            const transaction: Transaction = {
                id: `import-${Date.now()}-${i}`,
                date,
                amount,
                description: descriptionIndex > -1 ? String(row[descriptionIndex] || '').trim() : 'N/A',
                category: categoryIndex > -1 ? String(row[categoryIndex] || '').trim() : undefined,
                account: accountIndex > -1 ? String(row[accountIndex] || '').trim() : undefined,
            };
            transactions.push(transaction);
        } catch (e) {
            console.warn(`Could not parse row ${i + 2}:`, row, e);
        }
    }
    
    return transactions;
}

export const parseFile = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          return reject(new Error("Failed to read file."));
        }
        
        // Cache key based on file name, size, and last modified date
        const cacheKey = `${file.name}-${file.size}-${file.lastModified}`;
        if (fileCache.has(cacheKey)) {
          console.log("Serving parsed data from cache.");
          return resolve(fileCache.get(cacheKey)!);
        }

        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        
        const transactions = processRows(rows);
        fileCache.set(cacheKey, transactions); // Cache the result
        resolve(transactions);

      } catch (error) {
        console.error("Error parsing file:", error);
        reject(error instanceof Error ? error : new Error("An unexpected error occurred during file parsing."));
      }
    };
    
    reader.onerror = (error) => {
        reject(new Error("Error reading file."));
    }

    reader.readAsBinaryString(file);
  });
};
