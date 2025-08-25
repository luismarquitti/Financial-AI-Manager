
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashIcon, EditIcon, PlusIcon, CheckIcon } from './Icons';

interface Item {
    id: string;
    name: string;
}

interface SettingsListProps {
  title: string;
  items: Item[];
  onAddItem: (name: string) => Promise<void>;
  onUpdateItem: (id: string, newName: string) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  itemName: string;
}

export const SettingsList: React.FC<SettingsListProps> = ({ title, items, onAddItem, onUpdateItem, onDeleteItem, itemName }) => {
  const { t } = useTranslation();
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState<{ id: string, oldName: string; newName: string } | null>(null);
  const [error, setError] = useState('');

  const translatedItemName = t(`common.${itemName}`);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    if (items.some(i => i.name.toLowerCase() === newItem.trim().toLowerCase())) {
      setError(t('settingsList.errorExists', { itemName: translatedItemName }));
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
    if (items.some(i => i.name.toLowerCase() === editingItem.newName.trim().toLowerCase() && i.id !== editingItem.id)) {
      setError(t('settingsList.errorExists', { itemName: translatedItemName }));
      return;
    }
    setError('');
    await onUpdateItem(editingItem.id, editingItem.newName.trim());
    setEditingItem(null);
  };
  
  const handleDeleteItem = (id: string) => {
    if(window.confirm(t('settingsList.deleteConfirm', { itemName: translatedItemName }))) {
        onDeleteItem(id);
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
          placeholder={t('settingsList.addPlaceholder', { itemName: translatedItemName })}
          className="flex-grow block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-1">
          <PlusIcon /> {t('settingsList.add')}
        </button>
      </form>

      {error && <p className="text-sm text-danger mb-2">{error}</p>}

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
            {editingItem?.id === item.id ? (
              <input
                type="text"
                value={editingItem.newName}
                onChange={(e) => setEditingItem({ ...editingItem, newName: e.target.value })}
                className="flex-grow mr-2 px-2 py-1 border border-primary rounded-md"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateItem()}
              />
            ) : (
              <span className="text-text-primary">{item.name}</span>
            )}
            <div className="flex items-center gap-3">
              {editingItem?.id === item.id ? (
                 <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700" aria-label="Cancel edit">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
              ) : (
                <button onClick={() => setEditingItem({ id: item.id, oldName: item.name, newName: item.name })} className="text-indigo-600 hover:text-indigo-900" aria-label={`Edit ${item.name}`}>
                  <EditIcon />
                </button>
              )}
               {editingItem?.id === item.id ? (
                <button onClick={handleUpdateItem} className="text-secondary hover:text-emerald-700" aria-label="Save changes">
                    <CheckIcon />
                </button>
              ) : (
                <button onClick={() => handleDeleteItem(item.id)} className="text-danger hover:text-red-700" aria-label={`Delete ${item.name}`}>
                  <TrashIcon />
                </button>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
            <p className="text-center text-gray-500 py-4">{t('settingsList.noItems', { itemName: t(`common.${itemName}s`) })}</p>
        )}
      </div>
    </div>
  );
};
