export interface JobRoles {
    id: any;
    sequenceNo: string;
    jobName: string;
    clientShortcodes: string;
    minSalary: number;
    maxSalary: number;
    hiringType: string;
    roleLevel: string;
    jobLocation: string;
    shiftSched: string;
    jobDescription: string;
    salesManager: string;
    hiringManager: string;
    jobStatus: string;
    openDate?: Date;
    closedDate?: Date;
    aging?: string;
    daysCovered?: number;
}
