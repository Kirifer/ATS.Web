import { JobCandidate } from "./job-candidate";
export interface User {
    userId: string; // UUID
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
    candidates?: JobCandidate[];
}