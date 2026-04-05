'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { getJunctionTable, TYPE_TO_COL } from './junction';
import type { EntityType, ActionResult } from '@/lib/types';

const ENTITY_PATH: Record<EntityType, string> = {
  institution: '/institutions',
  theme: '/themes',
  investor: '/investors',
};

/**
 * 2つのエンティティを中間テーブルで関連付ける。
 * DB UNIQUE 制約違反時は「この関連付けはすでに存在します」を返す。
 */
export async function associateEntities(
  sourceType: EntityType,
  sourceId: string,
  targetType: EntityType,
  targetId: string,
): Promise<ActionResult<void>> {
  const table = getJunctionTable(sourceType, targetType);
  if (!table) {
    return {
      success: false,
      errors: {},
      message: '不正なエンティティの組み合わせです',
    };
  }

  const client = createServerClient();
  const { error } = await client.from(table).insert({
    [TYPE_TO_COL[sourceType]]: sourceId,
    [TYPE_TO_COL[targetType]]: targetId,
  });

  if (error) {
    // PostgreSQL unique violation code
    if (error.code === '23505') {
      return {
        success: false,
        errors: {},
        message: 'この関連付けはすでに存在します',
      };
    }
    return {
      success: false,
      errors: {},
      message: `関連付けに失敗しました: ${error.message}`,
    };
  }

  revalidatePath(`${ENTITY_PATH[sourceType]}/${sourceId}`);
  revalidatePath(`${ENTITY_PATH[targetType]}/${targetId}`);
  return { success: true, data: undefined };
}

/**
 * 2つのエンティティの関連付けを解除する。
 */
export async function dissociateEntities(
  sourceType: EntityType,
  sourceId: string,
  targetType: EntityType,
  targetId: string,
): Promise<ActionResult<void>> {
  const table = getJunctionTable(sourceType, targetType);
  if (!table) {
    return {
      success: false,
      errors: {},
      message: '不正なエンティティの組み合わせです',
    };
  }

  const client = createServerClient();
  const { error } = await client
    .from(table)
    .delete()
    .eq(TYPE_TO_COL[sourceType], sourceId)
    .eq(TYPE_TO_COL[targetType], targetId);

  if (error) {
    return {
      success: false,
      errors: {},
      message: `関連付けの解除に失敗しました: ${error.message}`,
    };
  }

  revalidatePath(`${ENTITY_PATH[sourceType]}/${sourceId}`);
  revalidatePath(`${ENTITY_PATH[targetType]}/${targetId}`);
  return { success: true, data: undefined };
}
