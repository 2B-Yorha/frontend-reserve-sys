import type { Booking } from '../types';
import { api } from './axiosInstance';

export interface CreateBookingRequest {
  tutorProfileId: number;
  subjectId: number;
  sessionStart: string; 
  sessionEnd: string;   
}

export const bookingApi = {
  create: (body: CreateBookingRequest) =>
    api.post<Booking>('/bookings', body).then((r) => r.data),

  mine: () => api.get<Booking[]>('/bookings/me').then((r) => r.data),

  cancel: (id: number) =>
    api.post<Booking>(`/bookings/${id}/cancel`).then((r) => r.data),
};