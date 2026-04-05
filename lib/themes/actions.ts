'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { themeSchema } from '@/lib/validations/schemas';
import { isValidStatus } from './status-utils';
import { extractThemeData } from './form-utils';
import type { ActionResult, ThemeFormState } from '@/lib/types';

// ----------------------------------------------------------------
// 登録
// ----------------------------------------------------------------

export async function createTheme(
  _prevState: ThemeFormState,
  formData: FormData,
): Promise<ThemeFormState> {
  const raw = extractThemeData(formData);
  const parsed = themeSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const client = createServerClient();
  const { error } = await client.from('themes').insert({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    status: parsed.data.status,
    start_date: parsed.data.startDate ?? null,
  });

  if (error) {
    return { errors: {}, message: `登録に失敗しました: ${error.message}` };
  }

  revalidatePath('/themes');
  return { success: true };
}

// ----------------------------------------------------------------
// 更新
// ----------------------------------------------------------------

export async function updateTheme(
  id: string,
  _prevState: ThemeFormState,
  formData: FormData,
): Promise<ThemeFormState> {
  const raw = extractThemeData(formData);
  const parsed = themeSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const client = createServerClient();
  const { error } = await client
    .from('themes')
    .update({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      status: parsed.data.status,
      start_date: parsed.data.startDate ?? null,
    })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    return { errors: {}, message: `更新に失敗しました: ${error.message}` };
  }

  revalidatePath('/themes');
  revalidatePath(`/themes/${id}`);
  return { success: true };
}

// ----------------------------------------------------------------
// ステータス変更
// ----------------------------------------------------------------

export async function updateThemeStatus(
  id: string,
  newStatus: string,
): Promise<ActionResult<void>> {
  if (!isValidStatus(newStatus)) {
    return { success: false, errors: { status: ['無効なステータスです'] } };
  }

  const client = createServerClient();
  const { error } = await client
    .from('themes')
    .update({ status: newStatus })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    return {
      success: false,
      errors: {},
      message: `ステータスの更新に失敗しました: ${error.message}`,
    };
  }

  revalidatePath(`/themes/${id}`);
  revalidatePath('/themes');
  return { success: true, data: undefined };
}

// ----------------------------------------------------------------
// 削除
// ----------------------------------------------------------------

export async function deleteTheme(id: string): Promise<ActionResult<void>> {
  const client = createServerClient();
  const { error } = await client
    .from('themes')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    return {
      success: false,
      errors: {},
      message: `削除に失敗しました: ${error.message}`,
    };
  }

  revalidatePath('/themes');
  redirect('/themes');
}
