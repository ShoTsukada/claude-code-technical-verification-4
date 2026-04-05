export type NavItem = {
  label: string;
  href: string;
  iconName: string; // Heroicons アイコン名（コンポーネントで解決する）
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: '研究機関',
    href: '/institutions',
    iconName: 'BuildingOffice2Icon',
  },
  {
    label: '研究テーマ',
    href: '/themes',
    iconName: 'BeakerIcon',
  },
  {
    label: '投資家',
    href: '/investors',
    iconName: 'UserGroupIcon',
  },
  {
    label: 'コメント集計',
    href: '/dashboard',
    iconName: 'ChartBarIcon',
  },
];
