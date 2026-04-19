import React from 'react';
import type { Contact } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Mail, Phone, MapPin, Edit, Trash2, Star } from 'lucide-react';
import { clsx } from 'clsx';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit, onDelete }) => {
  const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx('w-12 h-12 rounded-full flex items-center justify-center text-white font-bold', contact.avatarColor)}>
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
              {contact.name}
              {contact.isFavorite && <Star size={16} className="fill-yellow-400 text-yellow-400" />}
            </h3>
            {contact.categoryName && (
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                {contact.categoryName}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(contact)}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(contact.id)}>
            <Trash2 size={16} className="text-red-500" />
          </Button>
        </div>
      </div>
      <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
        {contact.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} /> {contact.phone}
          </div>
        )}
        {contact.email && (
          <div className="flex items-center gap-2">
            <Mail size={14} /> {contact.email}
          </div>
        )}
        {contact.address && (
          <div className="flex items-center gap-2">
            <MapPin size={14} /> {contact.address}
          </div>
        )}
      </div>
    </Card>
  );
};