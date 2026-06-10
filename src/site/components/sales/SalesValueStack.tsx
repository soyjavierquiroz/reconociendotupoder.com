import { Check } from 'lucide-react';

type SalesValueStackProps = {
  items: readonly string[];
};

export function SalesValueStack({ items }: SalesValueStackProps) {
  return (
    <div className="nle-value-stack">
      <ul className="nle-value-stack__items">
        {items.map((item) => (
          <li key={item}>
            <Check aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
