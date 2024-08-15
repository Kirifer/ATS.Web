export interface JobCandidate {
    id: string; // UUID
    csequenceNo: string; // Job Candidate Number
    candidateName: string; // Name
    jobRoleId: string; // Job Role Number
    jobName: string; // Job Title (PUBLIC)
    sourceTool: SourcingTool; // Sourcing Tool
    assignedHr: HRInCharge; // HR In-Charge
    candidateCv: string; // Updated CV (file path or URL) (PUBLIC)
    candidateEmail: string; // Email Address (PUBLIC)
    candidateContact: string; // Contact Number (PUBLIC)
    askingSalary: number; // Asking Gross Salary (PUBLIC)
    salaryNegotiable: string; // Negotiable (Yes/No) (PUBLIC)
    minSalary: number; // Minimum Negotiated Salary (PUBLIC)
    maxSalary: number; // Maximum Negotiated Salary
    noticeDuration: NoticeDuration; // Availability (notice period) (PUBLIC)

    dateApplied: Date; // Date Applied
    initialInterviewSchedule: Date; // Initial Interview Schedule (PUBLIC)
    technicalInterviewSchedule: Date; // Technical Interview Schedule
    clientFinalInterviewSchedule: Date; // Client/Final Interview Schedule
    backgroundVerification: Date; // Background Verification

    applicationStatus: ApplicationStatus; // Status (Application status)
    finalSalary: number; // Final Basic Salary
    allowance: number; // Allowances
    honorarium: string; // Honorarium (Basic)
    jobOffer: Date; // Job Offer (Date)
    candidateContract: Date; // Job Contract (Date)
    remarks: string; // Remarks

    attachments: JobCandidateAttachment[]; // Attachments
}

export interface JobCandidateAttachment {
    id: string | null; // Allow null
    fileName: string;
    path: string;
    size: number;
    extension: string;
    savedFileName: string;
    createdOn: Date;
    content: string; // Base64 Encoded string
}


export enum ApplicationStatus {
    InitialInterview = 'InitialInterview',
    TechnicalInterview = 'TechnicalInterview',
    ClientInterview = 'ClientInterview',
    NoShow = 'NoShow',
    NotShortlisted = 'NotShortlisted',
    RetractedApplication = 'RetractedApplication',
    WaitingForSuitableClient = 'WaitingForSuitableClient',
    Blacklisted = 'Blacklisted',
    SalesAdvice = 'SalesAdvice',
    CongratulatoryEmail = 'CongratulatoryEmail',
    JobOffer = 'JobOffer',
    ContractPreparation = 'ContractPreparation',
    Onboarded = 'Onboarded'
}

export const ApplicationStatusDisplay = {
    [ApplicationStatus.InitialInterview]: 'Initial Interview',
    [ApplicationStatus.TechnicalInterview]: 'Technical Interview',
    [ApplicationStatus.ClientInterview]: 'Client Interview',
    [ApplicationStatus.NoShow]: 'No Show',
    [ApplicationStatus.NotShortlisted]: 'Not Shortlisted',
    [ApplicationStatus.RetractedApplication]: 'Retracted Application',
    [ApplicationStatus.WaitingForSuitableClient]: 'Waiting for Suitable Client',
    [ApplicationStatus.Blacklisted]: 'Blacklisted',
    [ApplicationStatus.SalesAdvice]: 'Sales Advice',
    [ApplicationStatus.CongratulatoryEmail]: 'Congratulatory Email',
    [ApplicationStatus.JobOffer]: 'Job Offer',
    [ApplicationStatus.ContractPreparation]: 'Contract Preparation',
    [ApplicationStatus.Onboarded]: 'Onboarded'
};

export enum SourcingTool {
    JobStreet = 'JobStreet',
    Referral = 'Referral',
    LinkedIn = 'LinkedIn',
    Indeed = 'Indeed',
    Facebook = 'Facebook',
    Jora = 'Jora',
    Email = 'Email',
    OJT = 'OJT',
    Others = 'Others'
}

export const SourcingToolDisplay = {
    [SourcingTool.JobStreet]: 'JobStreet',
    [SourcingTool.Referral]: 'Referral',
    [SourcingTool.LinkedIn]: 'LinkedIn',
    [SourcingTool.Indeed]: 'Indeed',
    [SourcingTool.Facebook]: 'Facebook',
    [SourcingTool.Jora]: 'Jora',
    [SourcingTool.Email]: 'Email',
    [SourcingTool.OJT]: 'OJT',
    [SourcingTool.Others]: 'Others'
};

export enum HRInCharge {
    Jam = 'Jam',
    Khel = 'Khel',
    Sherlyn = 'Sherlyn',
    Others = 'Others'
}

export const HRInChargeDisplay = {
    [HRInCharge.Jam]: 'Jam',
    [HRInCharge.Khel]: 'Khel',
    [HRInCharge.Sherlyn]: 'Sherlyn',
    [HRInCharge.Others]: 'Others'
};

export enum NoticeDuration {
    OneWeekNotice = 'OneWeekNotice',
    TwoWeeksNotice = 'TwoWeeksNotice',
    ThreeWeeksNotice = 'ThreeWeeksNotice',
    FourWeeksOrMoreNotice = 'FourWeeksOrMoreNotice'
}

export const NoticeDurationDisplay = {
    [NoticeDuration.OneWeekNotice]: 'One week notice',
    [NoticeDuration.TwoWeeksNotice]: 'Two weeks notice',
    [NoticeDuration.ThreeWeeksNotice]: 'Three weeks notice',
    [NoticeDuration.FourWeeksOrMoreNotice]: 'Four weeks or more notice'
};
