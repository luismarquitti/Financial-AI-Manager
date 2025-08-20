import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SettingsList } from './SettingsList';

// Mock Icon components
jest.mock('../../components/Icons', () => ({
  PlusIcon: () => 'Add',
  EditIcon: () => 'Edit',
  TrashIcon: () => 'Delete',
  CheckIcon: () => 'Save',
}));

// Mock window.confirm
global.window.confirm = jest.fn(() => true);

describe('SettingsList', () => {
  const mockItems = ['Category 1', 'Category 2'];
  const onAddItem = jest.fn().mockResolvedValue(undefined);
  const onUpdateItem = jest.fn().mockResolvedValue(undefined);
  const onDeleteItem = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    onAddItem.mockClear();
    onUpdateItem.mockClear();
    onDeleteItem.mockClear();
    (global.window.confirm as jest.Mock).mockClear();
  });

  const renderComponent = () =>
    render(
      <SettingsList
        title="Test Categories"
        items={mockItems}
        onAddItem={onAddItem}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
        itemName="category"
      />
    );

  it('should render the list of items', () => {
    renderComponent();
    expect(screen.getByText('Test Categories')).toBeInTheDocument();
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('should call onAddItem when adding a new valid item', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Add new category...');
    const addButton = screen.getByRole('button', { name: /Add/i });

    fireEvent.change(input, { target: { value: 'New Category' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(onAddItem).toHaveBeenCalledWith('New Category');
    });
  });

  it('should show an error when adding a duplicate item', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Add new category...');
    const addButton = screen.getByRole('button', { name: /Add/i });

    fireEvent.change(input, { target: { value: 'Category 1' } });
    fireEvent.click(addButton);

    expect(await screen.findByText('This category already exists.')).toBeInTheDocument();
    expect(onAddItem).not.toHaveBeenCalled();
  });

  it('should switch to edit mode and call onUpdateItem', async () => {
    renderComponent();
    const editButtons = screen.getAllByLabelText(/Edit/i);
    fireEvent.click(editButtons[0]); // Edit "Category 1"

    const editInput = screen.getByDisplayValue('Category 1');
    fireEvent.change(editInput, { target: { value: 'Updated Category 1' } });

    const saveButton = screen.getByLabelText('Save changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onUpdateItem).toHaveBeenCalledWith('Category 1', 'Updated Category 1');
    });
  });

  it('should call onDeleteItem after confirmation', async () => {
    renderComponent();
    const deleteButtons = screen.getAllByLabelText(/Delete/i);
    fireEvent.click(deleteButtons[0]); // Delete "Category 1"

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this category? This may affect existing transactions.');

    await waitFor(() => {
      expect(onDeleteItem).toHaveBeenCalledWith('Category 1');
    });
  });

   it('should NOT call onDeleteItem if confirmation is cancelled', async () => {
    (global.window.confirm as jest.Mock).mockReturnValueOnce(false);
    renderComponent();

    const deleteButtons = screen.getAllByLabelText(/Delete/i);
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(onDeleteItem).not.toHaveBeenCalled();
  });
});
