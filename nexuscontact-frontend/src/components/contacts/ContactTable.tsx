import React from 'react';
import type { Contact } from '../../types';
import { Button } from '../ui/Button';
import { Edit, Trash2, Star } from 'lucide-react';
import { clsx } from 'clsx';

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export const ContactTable: React.FC<ContactTableProps> = ({ contacts, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {contacts.map(contact => {
            const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            return (
              <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold', contact.avatarColor)}>
                      {initials}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</span>
                      {contact.isFavorite && <Star size={14} className="fill-yellow-400 text-yellow-400" />}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contact.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contact.email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {contact.categoryName ? (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">{contact.categoryName}</span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(contact)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(contact.id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};