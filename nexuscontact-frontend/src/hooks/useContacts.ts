import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../services/api';
import type { Contact } from '../types';

export const useContacts = (search?: string, categoryId?: string, page = 0, size = 20, sort = 'name,asc') => {
  return useQuery({
    queryKey: ['contacts', search, categoryId, page, size, sort],
    queryFn: () => contactsApi.getAll({ search, categoryId, page, size, sort }).then(res => res.data),
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Contact>) => contactsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contact> }) => contactsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
  });
};