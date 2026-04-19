import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from '../hooks/useContacts';
import { useDebounce } from '../hooks/useDebounce';
import { ContactCard } from '../components/contacts/ContactCard';
import { ContactTable } from '../components/contacts/ContactTable';
import { ContactForm } from '../components/contacts/ContactForm';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import type { Contact, Category } from '../types';
import { contactsApi, categoriesApi } from '../services/api';
import toast from 'react-hot-toast';
import {
  Search, Plus, LayoutGrid, List, Download, LogOut, Moon, Sun,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);

  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading } = useContacts(
    debouncedSearch,
    selectedCategory || undefined,
    page,
    20,
    'name,asc'
  );

  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();

  React.useEffect(() => {
    categoriesApi.getAll().then(res => setCategories(res.data));
  }, []);

  const handleCreateOrUpdate = async (formData: Partial<Contact>) => {
    try {
      if (editingContact) {
        await updateMutation.mutateAsync({ id: editingContact.id, data: formData });
        toast.success('Contact updated');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Contact created');
      }
      setIsModalOpen(false);
      setEditingContact(undefined);
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Contact deleted');
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleExport = async () => {
    try {
      const res = await contactsApi.export();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contacts.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openCreateModal = () => {
    setEditingContact(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NexusContact</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user?.fullName}</span>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Button variant="secondary" onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}>
              {viewMode === 'card' ? <List size={18} /> : <LayoutGrid size={18} />}
            </Button>
            <Button variant="secondary" onClick={handleExport}>
              <Download size={18} />
            </Button>
            <Button onClick={openCreateModal}>
              <Plus size={18} className="mr-1" /> New
            </Button>
          </div>
        </div>

        {/* Contacts Display */}
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : data?.content.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No contacts found. Create your first contact!
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.content.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <ContactTable
            contacts={data?.content || []}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page + 1} of {data.totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft size={18} />
              </Button>
              <Button variant="secondary" size="sm" disabled={page >= data.totalPages - 1} onClick={() => setPage(p => p + 1)}>
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Contact Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingContact(undefined); }}
        title={editingContact ? 'Edit Contact' : 'New Contact'}
      >
        <ContactForm
          initialData={editingContact}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => { setIsModalOpen(false); setEditingContact(undefined); }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};