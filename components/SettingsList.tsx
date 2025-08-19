
import React, { useState } from 'react';
import { TrashIcon, EditIcon, PlusIcon, CheckIcon } from './Icons';

interface SettingsListProps {
  title: string;
  items: string[];
  onAddItem: (name: string) => Promise<void>;
  onUpdateItem: (oldName: string, newName: string) => Promise<void>;
  onDeleteItem: (name: string) => Promise<void>;
  itemName: string;
}

export const SettingsList: React.FC<SettingsListProps> = ({ title, items, onAddItem, onUpdateItem, onDeleteItem, itemName }) => {
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState<{ oldName: string; newName: string } | null>(null);
  const [error, setError] = useState('');

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    if (items.includes(newItem.trim())) {
      setError(`This ${itemName} already exists.`);
      return;
    }
    setError('');
    await onAddItem(newItem.trim());
    setNewItem('');
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !editingItem.newName.trim()) return;
    if (editingItem.newName.trim() === editingItem.oldName) {
        setEditingItem(null);
        return;
    }
    if (items.includes(editingItem.newName.trim())) {
      setError(`This ${itemName} already exists.`);
      return;
    }
    setError('');
    await onUpdateItem(editingItem.oldName, editingItem.newName.trim());
    setEditingItem(null);
  };
  
  const handleDeleteItem = (name: string) => {
    if(window.confirm(`Are you sure you want to delete this ${itemName}? This may affect existing transactions.`)) {
        onDeleteItem(name);
    }
  }

  return (
    <div className="bg-card shadow-lg rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => { setNewItem(e.target.value); setError(''); }}
          placeholder={`Add new ${itemName}...`}
          className="flex-grow block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-1">
          <PlusIcon /> Add
        </button>
      </form>

      {error && <p className="text-sm text-danger mb-2">{error}</p>}

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
            {editingItem?.oldName === item ? (
              <input
                type="text"
                value={editingItem.newName}
                onChange={(e) => setEditingItem({ ...editingItem, newName: e.target.value })}
                className="flex-grow mr-2 px-2 py-1 border border-primary rounded-md"
                autoFocus
              />
            ) : (
              <span className="text-text-primary">{item}</span>
            )}
            <div className="flex items-center gap-3">
              {editingItem?.oldName === item ? (
                <button onClick={handleUpdateItem} className="text-secondary hover:text-emerald-700" aria-label="Save changes">
                    <CheckIcon />
                </button>
              ) : (
                <button onClick={() => setEditingItem({ oldName: item, newName: item })} className="text-indigo-600 hover:text-indigo-900" aria-label={`Edit ${item}`}>
                  <EditIcon />
                </button>
              )}
              <button onClick={() => handleDeleteItem(item)} className="text-danger hover:text-red-700" aria-label={`Delete ${item}`}>
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
            <p className="text-center text-gray-500 py-4">No {itemName}s found.</p>
        )}
      </div>
    </div>
  );
};
