export type Role = 'STUDENT' | 'TUTOR' | 'ADMIN';

export interface User {
    id : number;
    email : string;
    fullName: string;
    role: Role;
}

export interface JwtPayLoad {
    sub: string;
    role: Role;
    exp: number;
    iat: number;
}

export interface Subject{
    id: number;
    name: string;
}

export interface TutorSummary{
    id: number;
    fullName: string;
    bio: string;
    hourlyRate: number;
    subjects: Subject[];
}

export interface TutorDetail extends TutorSummary{}

export interface Slot{
    date: string;
    startTime: string;
    endTime: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking{
    id: number;
    tutorProfileId: number;
    tutorName?: string;
    subjectId: number;
    subjectName?: string;
    sessionStart: string;
    sessionEnd: string;
    status: BookingStatus;
}

export interface ApiError{
    timestamp: string;
    status: number;
    error: string;
    message: string;
}