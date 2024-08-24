export interface User {
    id: string; // UUID
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    isApplicant: boolean;
    createdOn: Date;
    creatorId?: string; // Optional because it might be null
    updatedOn?: Date; // Optional because it might be null
    updaterId?: string; // Optional because it might be null
    // token?: string;
}