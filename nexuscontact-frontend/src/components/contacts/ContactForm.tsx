import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Contact, Category } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { categoriesApi } from '../../services/api';
import { User, Phone, Mail, MapPin, Tag } from 'lucide-react';

interface ContactFormProps {
  initialData?: Contact;
  onSubmit: (data: Partial<Contact>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Contact>>({
    defaultValues: initialData || { avatarColor: 'bg-blue-500' }
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApi.getAll().then(res => setCategories(res.data));
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="John Doe"
        icon={<User size={18} />}
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />
      <Input
        label="Phone"
        placeholder="+1 (555) 000-0000"
        icon={<Phone size={18} />}
        {...register('phone')}
      />
      <Input
        label="Email"
        placeholder="john@example.com"
        type="email"
        icon={<Mail size={18} />}
        error={errors.email?.message}
        {...register('email', { pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
      />
      <Input
        label="Address"
        placeholder="123 Main St"
        icon={<MapPin size={18} />}
        {...register('address')}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            {...register('categoryId')}
          >
            <option value="">None</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar Color</label>
        <select
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          {...register('avatarColor')}
        >
          <option value="bg-blue-500">Blue</option>
          <option value="bg-green-500">Green</option>
          <option value="bg-red-500">Red</option>
          <option value="bg-yellow-500">Yellow</option>
          <option value="bg-purple-500">Purple</option>
          <option value="bg-pink-500">Pink</option>
        </select>
      </div>
      <div className="flex items-center">
        <input type="checkbox" id="favorite" {...register('isFavorite')} className="rounded border-gray-300" />
        <label htmlFor="favorite" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Mark as Favorite</label>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : (initialData ? 'Update' : 'Create')}</Button>
      </div>
    </form>
  );
};