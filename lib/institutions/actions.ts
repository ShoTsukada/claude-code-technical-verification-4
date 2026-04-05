'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { institutionSchema } from '@/lib/validations/schemas';
import { extractInstitutionData } from './form-utils';
import type { ActionResult, InstitutionFormState } from '@/lib/types';

// ----------------------------------------------------------------
// 登録
// ----------------------------------------------------------------

/**
 * 研究機関を新規登録する。
 * useActionState 用シグネチャ: (prevState, formData) => Promise<InstitutionFormState>
 */
export async function createInstitution(
  _prevState: InstitutionFormState,
  formData: FormData,
): Promise<InstitutionFormState> {
  const raw = extractInstitutionData(formData);
  const parsed = institutionSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return { errors: fieldErrors };
  }

  const client = createServerClient();
  const { error } = await client
    .from('institutions')
    .insert({
      name: parsed.data.name,
      location: parsed.data.location ?? null,
      description: parsed.data.description ?? null,
      contact: parsed.data.contact ?? null,
    });

  if (error) {
    return {
      errors: {},
      message: `登録に失敗しました: ${error.message}`,
    };
  }

  revalidatePath('/institutions');
  return { success: true };
}

// ----------------------------------------------------------------
// 更新
// ----------------------------------------------------------------

/**
 * 研究機関を更新する。
 * bind で id を束縛してから useActionState に渡す:
 *   const action = updateInstitution.bind(null, id);
 */
export async function updateInstitution(
  id: string,
  _prevState: InstitutionFormState,
  formData: FormData,
): Promise<InstitutionFormState> {
  const raw = extractInstitutionData(formData);
  const parsed = institutionSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return { errors: fieldErrors };
  }

  const client = createServerClient();
  const { error } = await client
    .from('institutions')
    .update({
      name: parsed.data.name,
      location: parsed.data.location ?? null,
      description: parsed.data.description ?? null,
      contact: parsed.data.contact ?? null,
    })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    return {
      errors: {},
      message: `更新に失敗しました: ${error.message}`,
    };
  }

  revalidatePath('/institutions');
  revalidatePath(`/institutions/${id}`);
  return { success: true };
}

// ----------------------------------------------------------------
// 削除
// ----------------------------------------------------------------

/**
 * 研究機関を論理削除する。
 */
export async function deleteInstitution(
  id: string,
): Promise<ActionResult<void>> {
  const client = createServerClient();
  const { error } = await client
    .from('institutions')
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

  revalidatePath('/institutions');
  redirect('/institutions');
}

