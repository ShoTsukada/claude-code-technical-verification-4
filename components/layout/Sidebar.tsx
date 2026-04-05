'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BuildingOffice2Icon,
  BeakerIcon,
  UserGroupIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { NAV_ITEMS } from '@/lib/navigation/nav-items';
import { isActivePath } from '@/lib/navigation/is-active-path';

const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  BuildingOffice2Icon,
  BeakerIcon,
  UserGroupIcon,
  ChartBarIcon,
};

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* モバイル ハンバーガーボタン */}
      <button
        type="button"
        className="desktop:hidden fixed top-4 left-4 z-50 p-2 rounded-md
                   bg-surface border border-border shadow-card
                   focus-visible:outline-2 focus-visible:outline-[#0877d7]"
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={isOpen}
        aria-controls="sidebar-nav"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-text-body" aria-hidden="true" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-text-body" aria-hidden="true" />
        )}
      </button>

      {/* モバイル オーバーレイ */}
      {isOpen && (
        <div
          className="desktop:hidden fixed inset-0 z-40 bg-opacity-gray-500"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー本体 */}
      <nav
        id="sidebar-nav"
        aria-label="メインナビゲーション"
        className={[
          'fixed top-0 left-0 z-40 h-full w-60 bg-surface border-r border-border',
          'flex flex-col pt-16 pb-4',
          'transition-transform duration-200',
          'desktop:translate-x-0 desktop:static desktop:h-auto desktop:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full desktop:translate-x-0',
        ].join(' ')}
      >
        <div className="px-4 mb-6">
          <span className="text-xl font-bold text-primary leading-none tracking-[0.01em]">
            研究管理
          </span>
        </div>

        <ul className="flex flex-col gap-1 px-2">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = ICON_MAP[item.iconName];

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-md',
                    'text-base font-bold leading-none tracking-[0.02em]',
                    'transition-colors focus-visible:outline-2 focus-visible:outline-[#0877d7]',
                    active
                      ? 'bg-primary-bg text-primary'
                      : 'text-text-body hover:bg-surface-hover',
                  ].join(' ')}
                >
                  {Icon && (
                    <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
