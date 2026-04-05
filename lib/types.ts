// ============================================================
// ドメイン型定義
// ============================================================

export type ThemeStatus = 'active' | 'completed' | 'pending';
export type InvestorType = 'individual' | 'corporate';
export type CommentCategory = 'improvement' | 'bug' | 'other';
export type EntityType = 'institution' | 'theme' | 'investor';

export interface Institution {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  contact: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  id: string;
  name: string;
  description: string | null;
  status: ThemeStatus;
  startDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Investor {
  id: string;
  name: string;
  investorType: InvestorType;
  contact: string | null;
  investmentField: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  pageId: string;
  pageLabel: string;
  body: string;
  category: CommentCategory;
  score: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentFilters {
  pageId?: string;
  category?: CommentCategory;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// ============================================================
// Server Action 共通戻り値型
// ============================================================

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]>; message?: string };

// ============================================================
// フォーム状態型（useActionState 用）
// ============================================================

export type InstitutionFormState = {
  errors?: {
    name?: string[];
    location?: string[];
    description?: string[];
    contact?: string[];
  };
  message?: string;
  success?: boolean;
};

export type ThemeFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    status?: string[];
    startDate?: string[];
  };
  message?: string;
  success?: boolean;
};

export type InvestorFormState = {
  errors?: {
    name?: string[];
    investorType?: string[];
    contact?: string[];
    investmentField?: string[];
  };
  message?: string;
  success?: boolean;
};

export type CommentFormState = {
  errors?: {
    body?: string[];
    category?: string[];
    score?: string[];
    pageId?: string[];
    pageLabel?: string[];
  };
  message?: string;
  success?: boolean;
};
