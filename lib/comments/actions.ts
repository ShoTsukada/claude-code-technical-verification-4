'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { commentSchema } from '@/lib/validations/schemas';
import { extractCommentData } from './form-utils';
import type { ActionResult, CommentFormState } from '@/lib/types';

// ----------------------------------------------------------------
// 登録
// ----------------------------------------------------------------

/**
 * コメントを新規投稿する。
 * useActionState 用シグネチャ: (prevState, formData) => Promise<CommentFormState>
 */
export async function createComment(
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const raw = extractCommentData(formData);
  const parsed = commentSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return { errors: fieldErrors };
  }

  const client = createServerClient();
  const { error } = await client.from('comments').insert({
    page_id: parsed.data.pageId,
    page_label: parsed.data.pageLabel,
    body: parsed.data.body,
    category: parsed.data.category,
    score: parsed.data.score ?? null,
  });

  if (error) {
    return {
      errors: {},
      message: `投稿に失敗しました: ${error.message}`,
    };
  }

  revalidatePath('/comments');
  return { success: true };
}

// ----------------------------------------------------------------
// 更新
// ----------------------------------------------------------------

/**
 * コメントを更新する。
 * bind で id を束縛してから useActionState に渡す:
 *   const action = updateComment.bind(null, id);
 */
export async function updateComment(
  id: string,
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const raw = extractCommentData(formData);
  const parsed = commentSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return { errors: fieldErrors };
  }

  const client = createServerClient();
  const { error } = await client
    .from('comments')
    .update({
      body: parsed.data.body,
      category: parsed.data.category,
      score: parsed.data.score ?? null,
    })
    .eq('id', id);

  if (error) {
    return {
      errors: {},
      message: `更新に失敗しました: ${error.message}`,
    };
  }

  revalidatePath('/comments');
  return { success: true };
}

// ----------------------------------------------------------------
// 削除
// ----------------------------------------------------------------

/**
 * コメントを削除する。
 */
export async function deleteComment(id: string): Promise<ActionResult<void>> {
  const client = createServerClient();
  const { error } = await client.from('comments').delete().eq('id', id);

  if (error) {
    return {
      success: false,
      errors: {},
      message: `削除に失敗しました: ${error.message}`,
    };
  }

  revalidatePath('/comments');
  return { success: true, data: undefined };
}
