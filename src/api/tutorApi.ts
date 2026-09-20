import type { Slot, TutorDetail, TutorSummary } from '../types';
import { api } from './axiosInstance';

export const tutorApi = {
  list: (subject?: string) =>
    api
      .get<TutorSummary[]>('/tutors', { params: subject ? { subject } : {} })
      .then((r) => r.data),

  getById: (id: number) =>
    api.get<TutorDetail>(`/tutors/${id}`).then((r) => r.data),

  getSlots: (id: number, from: string, to: string) =>
    api
      .get<Slot[]>(`/tutors/${id}/slots`, { params: { from, to } })
      .then((r) => r.data),
};