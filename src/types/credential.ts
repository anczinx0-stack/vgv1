export interface Credential {
  tokenId: string;
  ipfsHash: string;
  degree: string;
  institution: string;
  student: string;
  issueDate: number;
  revoked: boolean;
}

export interface IssuanceFormData {
  studentName: string;
  studentAddress: string;
  degree: string;
  institution: string;
  graduationYear: string;
  document: File | null;
}

export type PageView = 'landing' | 'selection' | 'admin' | 'institution' | 'student' | 'verify' | 'operations';
