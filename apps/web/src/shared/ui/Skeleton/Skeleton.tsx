import { cn } from '@/shared/utils';
import styles from './Skeleton.module.css';

type SkeletonProps = {
  height?: number | string;
  width?: number | string;
  radius?: number;
  className?: string;
};

export function Skeleton({ height = 16, width = '100%', radius = 8, className }: SkeletonProps) {
  return (
    <div
      className={cn(styles.skeleton, className)}
      style={{ height, width, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
