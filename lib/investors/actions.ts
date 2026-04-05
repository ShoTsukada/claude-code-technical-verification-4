'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { investorSchema } from '@/lib/validations/schemas';
import { extractInvestorData } from './form-utils';
import type { ActionResult, InvestorFormState } from '@/lib/types';

// ----------------------------------------------------------------
// 登録
// ----------------------------------------------------------------

/**
 * 投資家を新規登録する。
 * useActionState 用シグネチャ: (prevState, formData) => Promise<InvestorFormState>
 */
export async function createInvestor(
  _prevState: InvestorFormState,
  formData: FormData,
): Promise<InvestorFormState> {
  const raw = extractInvestorData(formData);
  const parsed = investorSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return { errors: fieldErrors };
  }

  const client = createServerClient();
  const { error } = await client.from('investors').insert({
    name: parsed.data.name,
    investor_type: parsed.data.investorType,
    contact: parsed.data.contact ?? null,
    investment_field: parsed.data.investmentField ?? null,
  });

  if (error) {
    return {
      errors: {},
      message: `登録に失敗しました: ${error.message}`,
    };
  }

  revalidatePath('/investors');
  return { success: true };
}

// ----------------------------------------------------------------
// 更新
// ----------------------------------------------------------------

/**
 * 投資家を更新する。
 * bind で id を束縛してから useActionState に渡す:
 *   const action = updateInvestor.bind(null, id);
 */
export async function updateInvestor(
  id: string,
  _prevState: InvestorFormState,
  formData: FormData,
): Promise<InvestorFormState> {
  const raw = extractInvestorData(formData);
  const parsed = investorSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return { errors: fieldErrors };
  }

  const client = createServerClient();
  const { error } = await client
    .from('investors')
    .update({
      name: parsed.data.name,
      investor_type: parsed.data.investorType,
      contact: parsed.data.contact ?? null,
      investment_field: parsed.data.investmentField ?? null,
    })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    return {
      errors: {},
      message: `更新に失敗しました: ${error.message}`,
    };
  }

  revalidatePath('/investors');
  revalidatePath(`/investors/${id}`);
  return { success: true };
}

// ----------------------------------------------------------------
// 削除
// ----------------------------------------------------------------

/**
 * 投資家を論理削除する。
 */
export async function deleteInvestor(
  id: string,
): Promise<ActionResult<void>> {
  const client = createServerClient();
  const { error } = await client
    .from('investors')
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

  revalidatePath('/investors');
  redirect('/investors');
}
