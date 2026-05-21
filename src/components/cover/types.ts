export type CoverCategory = 'individual' | 'group';

export interface CoverTemplate {
  id: string;
  title: string;
  description: string;
  file: string;
  category: CoverCategory;
  accent: string; // tailwind gradient classes (legacy)
  themeColor?: string; // hex
}

export interface GroupMember {
  id: string;
  name: string;
  regNumber: string;
}

export interface CoverData {
  templateId: string;
  category: CoverCategory;
  layout: 'classic' | 'modern' | 'minimal';
  themeColor: string;
  fontScale: number; // 0.85 - 1.2
  logo?: string | null;
  university: string;
  faculty: string;
  courseName: string;
  courseCode: string;
  assignmentTitle: string;
  // individual
  studentName?: string;
  registrationNumber?: string;
  // group
  groupName?: string;
  members?: GroupMember[];
  // shared
  lecturerName: string;
  submissionDate: string;
  academicYear: string;
  updatedAt?: number;
}

export const defaultCoverData = (
  templateId: string,
  category: CoverCategory,
  themeColor: string,
): CoverData => ({
  templateId,
  category,
  layout: 'classic',
  themeColor,
  fontScale: 1,
  logo: null,
  university: '',
  faculty: '',
  courseName: '',
  courseCode: '',
  assignmentTitle: '',
  studentName: category === 'individual' ? '' : undefined,
  registrationNumber: category === 'individual' ? '' : undefined,
  groupName: category === 'group' ? '' : undefined,
  members:
    category === 'group'
      ? [{ id: crypto.randomUUID(), name: '', regNumber: '' }]
      : undefined,
  lecturerName: '',
  submissionDate: '',
  academicYear: '',
});
