export interface JobCandidate {
    csequence_no: number;
    job_role_id: string;
    job_name: string;
    candidate_name: string;
    candidate_cv: string;
    candidate_email: string;
    candidate_contact: number;
    source_tool: string;
    assigned_hr: string;
    asking_salary: number;
    salary_negotiable: string;
    min_salary: number;
    max_salary: number;
    notice_duration: string;
    application_status: string;
    final_salary: number;
    allowance: number;
    honorarium: string;
    job_offer: string;
    candidate_contract: string;
    remarks: string;
}