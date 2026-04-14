import * as LucideIcons from 'lucide-react';
import { iconMap, IconMappingKey } from '@/lib/icon-mapping';

export type IconName = IconMappingKey | keyof typeof LucideIcons;

interface IconProps {
  name: IconName | string;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 18, color, className, style }: IconProps) {
  // First try iconMap (semantic lowercase names), then try direct lucide name
  const lucideName = (
    iconMap[name as IconMappingKey] || name
  ) as keyof typeof LucideIcons;

  const LucideIcon = LucideIcons[lucideName] as React.ComponentType<{
    size?: number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }> | undefined;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <LucideIcon
      size={size}
      color={color}
      className={className}
      style={style}
    />
  );
}
