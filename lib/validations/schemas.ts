import { z } from 'zod';

// ============================================================
// 研究機関スキーマ
// ============================================================

export const institutionSchema = z.object({
  name: z
    .string()
    .min(1, '機関名は必須です')
    .max(200, '機関名は200文字以内で入力してください'),
  location: z
    .string()
    .max(200, '所在地は200文字以内で入力してください')
    .optional(),
  description: z
    .string()
    .max(2000, '説明は2000文字以内で入力してください')
    .optional(),
  contact: z
    .string()
    .max(200, '連絡先は200文字以内で入力してください')
    .optional(),
});

export type InstitutionInput = z.infer<typeof institutionSchema>;

// ============================================================
// 研究テーマスキーマ
// ============================================================

export const themeSchema = z.object({
  name: z
    .string()
    .min(1, 'テーマ名は必須です')
    .max(200, 'テーマ名は200文字以内で入力してください'),
  description: z
    .string()
    .max(2000, '説明は2000文字以内で入力してください')
    .optional(),
  status: z.enum(['active', 'completed', 'pending'], {
    error: 'ステータスは「進行中」「完了」「保留」のいずれかを選択してください',
  }),
  startDate: z.string().optional(),
});

export type ThemeInput = z.infer<typeof themeSchema>;

// ============================================================
// 投資家スキーマ
// ============================================================

export const investorSchema = z.object({
  name: z
    .string()
    .min(1, '投資家名は必須です')
    .max(200, '投資家名は200文字以内で入力してください'),
  investorType: z.enum(['individual', 'corporate'], {
    error: '種別は「個人」または「法人」を選択してください',
  }),
  contact: z
    .string()
    .max(200, '連絡先は200文字以内で入力してください')
    .optional(),
  investmentField: z
    .string()
    .max(200, '投資分野は200文字以内で入力してください')
    .optional(),
});

export type InvestorInput = z.infer<typeof investorSchema>;

// ============================================================
// コメント・レビュースキーマ
// ============================================================

export const commentSchema = z.object({
  pageId: z.string().min(1, '対象画面IDは必須です'),
  pageLabel: z.string().min(1, '対象画面名は必須です'),
  body: z
    .string()
    .min(1, 'コメントを入力してください')
    .max(1000, 'コメントは1000文字以内で入力してください'),
  category: z.enum(['improvement', 'bug', 'other'], {
    error: '種別は「改善要望」「不具合」「その他」のいずれかを選択してください',
  }),
  score: z.coerce.number().int().min(1).max(5).optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;
