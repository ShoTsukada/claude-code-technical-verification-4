type EntityType = 'institution' | 'theme' | 'investor';
type ViewType = 'list' | 'detail';

/**
 * ページIDを生成する。
 * 形式: "{entity_type}/{list|detail}" または "{entity_type}/detail/{id}"
 */
export function buildPageId(
  entityType: EntityType,
  view: ViewType,
  id?: string,
): string {
  if (view === 'detail' && id) {
    return `${entityType}/detail/${id}`;
  }
  return `${entityType}/${view}`;
}

const PAGE_LABELS: Record<EntityType, Record<ViewType, string>> = {
  institution: { list: '研究機関一覧', detail: '研究機関詳細' },
  theme: { list: '研究テーマ一覧', detail: '研究テーマ詳細' },
  investor: { list: '投資家一覧', detail: '投資家詳細' },
};

/**
 * ページの表示ラベルを返す。
 */
export function buildPageLabel(entityType: EntityType, view: ViewType): string {
  return PAGE_LABELS[entityType][view];
}
