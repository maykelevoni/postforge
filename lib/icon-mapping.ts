/**
 * Icon Mapping Reference
 * Maps semantic names to specific lucide-react icon names (PascalCase)
 */

export const iconMap = {
  // Navigation icons
  home: 'Home',
  trending: 'TrendingUp',
  sparkles: 'Sparkles',
  fileText: 'FileText',
  megaphone: 'Megaphone',
  briefcase: 'Briefcase',
  settings: 'Settings',
  calendar: 'Calendar',
  clock: 'Clock',
  layout: 'Layout',

  // Action icons
  edit: 'Edit',
  edit2: 'Edit2',
  edit3: 'Edit3',
  delete: 'Trash2',
  trash: 'Trash',
  trash2: 'Trash2',
  add: 'Plus',
  plus: 'Plus',
  remove: 'Minus',
  minus: 'Minus',
  check: 'Check',
  check2: 'CheckCircle',
  x: 'X',
  xCircle: 'XCircle',

  // Status icons
  success: 'CheckCircle',
  error: 'XCircle',
  warning: 'AlertTriangle',
  info: 'Info',
  loading: 'Loader2',

  // Service icons
  film: 'Film',
  social: 'Share2',
  share: 'Share',
  share2: 'Share2',
  newsletter: 'Mail',
  mail: 'Mail',
  landing: 'Globe',
  globe: 'Globe',
  strategy: 'Lightbulb',
  lightbulb: 'Lightbulb',

  // Content icons
  file: 'File',
  image: 'Image',
  imagePlus: 'ImagePlus',
  video: 'Video',
  music: 'Music',
  code: 'Code',
  fileCode: 'FileCode',

  // Communication icons
  message: 'MessageCircle',
  messageSquare: 'MessageSquare',
  send: 'Send',
  atSign: 'AtSign',

  // User icons
  user: 'User',
  userPlus: 'UserPlus',
  userMinus: 'UserMinus',
  users: 'Users',
  userCheck: 'UserCheck',

  // Discovery icons
  search: 'Search',
  discover: 'Compass',
  compass: 'Compass',
  target: 'Target',

  // Research icons
  chart: 'BarChart',
  barChart: 'BarChart',
  lineChart: 'LineChart',
  pieChart: 'PieChart',

  // Platform icons
  twitter: 'Twitter',
  linkedin: 'Linkedin',
  reddit: 'MessageSquare',
  instagram: 'Instagram',
  youtube: 'Youtube',
  tiktok: 'Music',

  // UI elements
  arrowRight: 'ArrowRight',
  arrowLeft: 'ArrowLeft',
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  chevronDown: 'ChevronDown',
  chevronUp: 'ChevronUp',
  chevronLeft: 'ChevronLeft',
  chevronRight: 'ChevronRight',

  // Misc
  more: 'MoreVertical',
  moreVertical: 'MoreVertical',
  moreHorizontal: 'MoreHorizontal',
  menu: 'Menu',
  list: 'List',
  grid: 'Grid',
  external: 'ExternalLink',
} as const;

export type IconMappingKey = keyof typeof iconMap;
export type IconMappingValue = typeof iconMap[IconMappingKey];
