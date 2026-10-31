export interface SurveyRow {
  description: string;
  size: string;
  qty: number;
  unit: string;
  floss: number;
  remark?: string;
}

export interface SurveyRecord {
  id?: string | number;
  surveyno: number;
  customer: string;
  village: string;
  discharge?: string | number;
  staticheight?: string | number;
  staticHeight?: string | number;
  rows: SurveyRow[];
  totalHead: number | string;
  userid?: string;
  created_at?: string;
}

export interface SurveyFormData {
  surveyno?: number;
  customer: string;
  village: string;
  discharge?: string | number;
  staticHeight?: string | number;
  staticheight?: string | number;
  rows: SurveyRow[];
  totalHead: number;
  userid?: string | null;
}
