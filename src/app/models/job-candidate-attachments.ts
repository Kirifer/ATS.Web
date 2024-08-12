export interface JCAttachment{
    id: string; // UUID
    jobCandidateId: string; // UUID
    fileName: string; // Attachment FileName
    filePath: string; // Attachment FilePath
    size: number; // Attachment Size
    extension: string; // Attachment Extension
    savedFileName: string; // Saved File Name
    createdOn: Date; // Timestamp with time zone
}
