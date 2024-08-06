export interface JobCandidate {
    id: string; // UUID
    csequenceNo: string; // Job Candidate Number
    candidateName: string; // Name
    jobRoleId: string; // Job Role Number
    jobName: string; // Job Title (PUBLIC)
    sourceTool: string; // Sourcing Tool
    assignedHr: string; // HR In-Charge
    candidateCv: string; // Updated CV (file path or URL) (PUBLIC)
    candidateEmail: string; // Email Address (PUBLIC)
    candidateContact: string; // Contact Number (PUBLIC)
    askingSalary: number; // Asking Gross Salary (PUBLIC)
    salaryNegotiable: string; // Negotiable (Yes/No) (PUBLIC)
    minSalary: number; // Minimum Negotiated Salary (PUBLIC)
    maxSalary: number; // Maximum Negotiated Salary
    noticeDuration: string; // Availability (notice period) (PUBLIC)

    dateApplied: Date; // Date Applied
    initialInterviewSchedule: Date; // Initial Interview Schedule (PUBLIC)
    technicalInterviewSchedule: Date; // Technical Interview Schedule
    clientFinalInterviewSchedule: Date; // Client/Final Interview Schedule
    backgroundVerification: Date; // Background Verification

    applicationStatus: string; // Status (Application status)
    finalSalary: number; // Final Basic Salary
    allowance: number; // Allowances
    honorarium: string; // Honorarium (Basic)
    jobOffer: Date; // Job Offer (Date)
    candidateContract: Date; // Job Contract (Date)
    remarks: string; // Remarks
}  