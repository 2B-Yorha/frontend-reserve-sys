import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { bookingApi, type CreateBookingRequest } from '../api/bookingApi';
import type { ApiError } from '../types';

export function useMyBookings() {
  return useQuery({
    queryKey: ['myBookings'],
    queryFn: bookingApi.mine,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBookingRequest) => bookingApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bookingApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
}



export function getApiErrorCode(err: unknown): string | null {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiError | undefined;
    return data?.error ?? null;
  }
  return null;
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiError | undefined;
    return data?.message ?? fallback;
  }
  return fallback;
}