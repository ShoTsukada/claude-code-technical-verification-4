'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/components/feedback/Toast';
import type { EntityType } from '@/lib/types';
import type { ActionResult } from '@/lib/types';

interface Entity {
  id: string;
  name: string;
}

interface AssociationPanelProps {
  /** 関連付け元のエンティティタイプ */
  sourceType: EntityType;
  /** 関連付け元のエンティティID */
  sourceId: string;
  /** 関連付け先のエンティティタイプ */
  targetType: EntityType;
  /** パネルの見出しラベル */
  title: string;
  /** 関連付け済みエンティティ一覧 */
  associated: Entity[];
  /** 未関連エンティティ一覧（追加候補） */
  available: Entity[];
  /** 詳細ページへのベースパス（例: "/themes"） */
  targetBasePath: string;
  /** 関連付けServer Action（targetIdを受け取る） */
  onAssociate: (targetId: string) => Promise<ActionResult<void>>;
  /** 解除Server Action（targetIdを受け取る） */
  onDissociate: (targetId: string) => Promise<ActionResult<void>>;
}

export function AssociationPanel({
  title,
  associated,
  available,
  targetBasePath,
  onAssociate,
  onDissociate,
}: AssociationPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const filteredAvailable = available.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAssociate = (targetId: string, targetName: string) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await onAssociate(targetId);
      if (result.success) {
        showToast('success', `「${targetName}」を関連付けました`);
        setSearchQuery('');
      } else {
        setErrorMessage(result.message ?? '関連付けに失敗しました');
      }
    });
  };

  const handleDissociate = (targetId: string, targetName: string) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await onDissociate(targetId);
      if (result.success) {
        showToast('success', `「${targetName}」の関連付けを解除しました`);
      } else {
        setErrorMessage(result.message ?? '解除に失敗しました');
      }
    });
  };

  return (
    <section
      aria-labelledby={`panel-${title}`}
      className="space-y-4 rounded-lg border border-border bg-surface p-4"
    >
      <h3
        id={`panel-${title}`}
        className="text-base font-bold leading-[1.6] text-text-body"
      >
        {title}
      </h3>

      {/* エラーメッセージ */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded border border-error/30 bg-error/5 px-3 py-2
                     text-sm leading-[1.7] text-error"
        >
          {errorMessage}
        </div>
      )}

      {/* 関連付け済み一覧 */}
      {associated.length === 0 ? (
        <p className="text-sm leading-[1.7] text-text-secondary">
          関連付けられたエンティティはありません
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {associated.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 px-3 py-2"
            >
              <Link
                href={`${targetBasePath}/${item.id}`}
                className="text-sm font-medium text-primary hover:underline
                           focus-visible:outline-2 focus-visible:outline-[#0877d7] rounded"
              >
                {item.name}
              </Link>
              <button
                type="button"
                onClick={() => handleDissociate(item.id, item.name)}
                disabled={isPending}
                aria-label={`「${item.name}」の関連付けを解除`}
                className="shrink-0 rounded p-1 text-text-secondary
                           hover:bg-error/10 hover:text-error
                           disabled:cursor-not-allowed disabled:opacity-50
                           focus-visible:outline-2 focus-visible:outline-[#0877d7]"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 追加セクション */}
      {available.length > 0 && (
        <div className="space-y-2">
          <label
            htmlFor={`search-${title}`}
            className="block text-sm font-medium leading-[1.7] text-text-body"
          >
            追加する
          </label>
          <input
            id={`search-${title}`}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="名称で検索..."
            className="block w-full rounded-[6px] border border-border px-3 py-1.5
                       text-sm leading-[1.7] text-text-body
                       focus:outline-none focus:ring-2 focus:ring-[#0877d7]"
          />
          {filteredAvailable.length === 0 ? (
            <p className="text-sm leading-[1.7] text-text-secondary">
              該当するエンティティが見つかりません
            </p>
          ) : (
            <ul className="max-h-48 overflow-y-auto divide-y divide-border rounded-md border border-border">
              {filteredAvailable.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 px-3 py-2"
                >
                  <span className="text-sm text-text-body">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => handleAssociate(item.id, item.name)}
                    disabled={isPending}
                    aria-label={`「${item.name}」を関連付け`}
                    className="inline-flex shrink-0 items-center gap-1 rounded px-2 py-1
                               text-xs font-medium text-primary
                               hover:bg-primary/10
                               disabled:cursor-not-allowed disabled:opacity-50
                               focus-visible:outline-2 focus-visible:outline-[#0877d7]"
                  >
                    <PlusIcon className="h-3 w-3" aria-hidden="true" />
                    追加
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
