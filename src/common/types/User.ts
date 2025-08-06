import { RoleEnum } from ".";

export default interface User {
	_id: string;
	role: RoleEnum;
	fullname: string;
	username: string;
	email: string;
	schoolYear?: string;
	majorId?: string;
	studentId?: string;
}
