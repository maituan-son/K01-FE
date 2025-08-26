export interface Attendance {
  _id?: string;
  sessionId: string;
  studentId: string;
  status: string; // hoặc StatusEnum nếu bạn đã định nghĩa enum này trong FE
  note?: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}