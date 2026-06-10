import type { ReactNode } from 'react';

type SalesTopBarProps = {
  children?: ReactNode;
  mobileText?: string;
  text?: string;
};

export function SalesTopBar({ children, mobileText, text }: SalesTopBarProps) {
  return (
    <div className="nle-announcement">
      {children ?? (
        <>
          <span className="nle-announcement-mobile">{mobileText ?? text}</span>
          <span className="nle-announcement-desktop">{text}</span>
        </>
      )}
    </div>
  );
}
