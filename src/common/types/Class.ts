export interface Class {
  _id: string;
  subjectId: string;
  majorId: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  startDate: string;
  totalSessions: number;
  shift: string;
  room?: string | null;
  description?: string | null;
  maxStudents?: number;
  deletedAt?: string | null;
  createdAt: string;
}