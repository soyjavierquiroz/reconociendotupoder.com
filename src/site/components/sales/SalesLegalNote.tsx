import type { ReactNode } from 'react';

type SalesLegalNoteProps = {
  children: ReactNode;
  title: string;
};

export function SalesLegalNote({ children, title }: SalesLegalNoteProps) {
  return (
    <div className="nle-legal-note">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
