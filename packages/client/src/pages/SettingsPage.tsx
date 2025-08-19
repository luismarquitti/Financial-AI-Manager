
import React from 'react';
import { SettingsList } from '../components/SettingsList';
import type { Category, Account } from '../types';

interface SettingsPageProps {
  categories: Category[];
  accounts: Account[];
  onAddCategory: (name: string) => Promise<void>;
  onUpdateCategory: (id: string, newName: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onAddAccount: (name: string) => Promise<void>;
  onUpdateAccount: (id: string, newName: string) => Promise<void>;
  onDeleteAccount: (id: string) => Promise<void>;
}

export const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const {
    categories,
    accounts,
    onAddCategory,
    onUpdateCategory,
    onDeleteCategory,
    onAddAccount,
    onUpdateAccount,
    onDeleteAccount,
  } = props;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
        <p className="text-text-secondary mt-1">Manage your transaction categories and accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SettingsList
          title="Categories"
          items={categories}
          onAddItem={onAddCategory}
          onUpdateItem={onUpdateCategory}
          onDeleteItem={onDeleteCategory}
          itemName="category"
        />
        <SettingsList
          title="Accounts"
          items={accounts}
          onAddItem={onAddAccount}
          onUpdateItem={onUpdateAccount}
          onDeleteItem={onDeleteAccount}
          itemName="account"
        />
      </div>
    </div>
  );
};