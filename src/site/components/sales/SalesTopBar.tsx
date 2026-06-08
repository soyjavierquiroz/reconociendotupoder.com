import type { ReactNode } from 'react';

type SalesTopBarProps = {
  children?: ReactNode;
  text?: string;
};

export function SalesTopBar({ children, text }: SalesTopBarProps) {
  return (
    <div className="nle-announcement">
      <span>{children ?? text}</span>
    </div>
  );
}
