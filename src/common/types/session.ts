export interface Session {
  _id: string;
  classId: string;
  sessionDate: string;
  shift: number;
  room?: string;
  status: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
