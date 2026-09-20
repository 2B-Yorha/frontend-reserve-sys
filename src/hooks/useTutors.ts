import { useQuery } from '@tanstack/react-query';
import { tutorApi } from '../api/tutorApi';

export function useTutors(subject?: string) {
  return useQuery({
    queryKey: ['tutors', subject ?? 'all'],
    queryFn: () => tutorApi.list(subject),
  });
}

export function useTutor(id: number) {
  return useQuery({
    queryKey: ['tutor', id],
    queryFn: () => tutorApi.getById(id),
    enabled: !!id,
  });
}

export function useTutorSlots(id: number, from: string, to: string) {
  return useQuery({
    queryKey: ['tutorSlots', id, from, to],
    queryFn: () => tutorApi.getSlots(id, from, to),
    enabled: !!id && !!from && !!to,
  });
}