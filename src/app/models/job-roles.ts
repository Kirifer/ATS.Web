import { JobCandidate } from "./job-candidate";
export interface JobRoles {
    id: any; //UUID
    sequenceNo: string; //Job Role No.
    jobName: string; // Job Title
    clientShortcodes: string; // Client Shortcodes
    minSalary: number; // Minimum Salary
    maxSalary: number; // Maximum Salary
    hiringType: HiringType; //Type of Hiring
    roleLevel: RoleLevel; // Role Level
    jobLocation: JobLocation; //Location
    shiftSched: ShiftSchedule; //Schedule
    jobDescription: string; // Job Description
    salesManager: string; //Sales Manager
    hiringManager: HiringManager; //Hiring Manager
    jobStatus: JobStatus; //Status
    openDate?: Date; // Date Requested
    closedDate?: Date; //Closed Date
    aging?: string; //Days Covered
    daysCovered?: number; //Aging
    candidates?: JobCandidate[];
}

export enum HiringType {
    Additional = 'Additional',
    Replacement = 'Replacement'
}

export const HiringTypeDisplay = {
    [HiringType.Additional]: 'Additional',
    [HiringType.Replacement]: 'Replacement'
};

export enum RoleLevel {
    Junior = 'Junior',
    Mid = 'Mid',
    Senior = 'Senior',
    Supervisor = 'Supervisor',
    AssistantManager = 'AssistantManager',
    Manager = 'Manager',
    Director= 'Director',
    Executive = 'Executive'
}

export const RoleLevelDisplay = {
    [RoleLevel.Junior]: 'Junior',
    [RoleLevel.Mid]: 'Mid',
    [RoleLevel.Senior]: 'Senior',
    [RoleLevel.Supervisor]: 'Supervisor',
    [RoleLevel.AssistantManager]: 'Assistant Manager',
    [RoleLevel.Manager]: 'Manager',
    [RoleLevel.Director]: 'Director',
    [RoleLevel.Executive]: 'Executive'
};

export enum JobLocation {
    OfficeBased = 'OfficeBased',
    WorkFromHome = 'WorkFromHome',
    Hybrid = 'Hybrid'
}

export const JobLocationDisplay = {
    [JobLocation.OfficeBased]: 'Office Based',
    [JobLocation.WorkFromHome]: 'Work From Home',
    [JobLocation.Hybrid]: 'Hybrid'
};

export enum ShiftSchedule {
    MorningShift6AMto3PM = 'MorningShift6AMto3PM',
    MorningShift7AMto4PM = 'MorningShift7AMto4PM',
    RegularShift8AMto5PM = 'RegularShift8AMto5PM',
    RegularShift9AMto6PM = 'RegularShift9AMto6PM',
    MidShift3PMto12MN = 'MidShift3PMto12MN',
    NightShift9PMto6AM = 'NightShift9PMto6AM',
    NightShift10PMto7AM = 'NightShift10PMto7AM'
}

export const ShiftScheduleDisplay = {
    [ShiftSchedule.MorningShift6AMto3PM]: 'Morning Shift (6 AM to 3 PM)',
    [ShiftSchedule.MorningShift7AMto4PM]: 'Morning Shift (7 AM to 4 PM)',
    [ShiftSchedule.RegularShift8AMto5PM]: 'Regular Shift (8 AM to 5 PM)',
    [ShiftSchedule.RegularShift9AMto6PM]: 'Regular Shift (9 AM to 6 PM)',
    [ShiftSchedule.MidShift3PMto12MN]: 'Mid Shift (3 PM to 12 MN)',
    [ShiftSchedule.NightShift9PMto6AM]: 'Night Shift (9 PM to 6 AM)',
    [ShiftSchedule.NightShift10PMto7AM]: 'Night Shift (10 PM to 7 AM)'
};

export enum HiringManager {
    Client = 'Client',
    Partner = 'Partner'
}

export const HiringManagerDisplay = {
    [HiringManager.Client]: 'Client',
    [HiringManager.Partner]: 'Partner'
};

export enum JobStatus {
    SourcingCandidates = 'SourcingCandidates',
    ForClientPresentation = 'ForClientPresentation',
    ClientInterview = 'ClientInterview',
    FilledPosition = 'FilledPosition',
    Cancelled = 'Cancelled',
    OnHold = 'OnHold'
}

export const JobStatusDisplay = {
    [JobStatus.SourcingCandidates]: 'Sourcing Candidates',
    [JobStatus.ForClientPresentation]: 'For Client Presentation',
    [JobStatus.ClientInterview]: 'Client Interview',
    [JobStatus.FilledPosition]: 'Filled Position',
    [JobStatus.Cancelled]: 'Cancelled',
    [JobStatus.OnHold]: 'On Hold'
};


