import { Check } from 'lucide-react';

type SalesValueStackItem = {
  name: string;
  value: string;
};

type SalesValueStackProps = {
  items: readonly SalesValueStackItem[];
  priceLabel: string;
  regularPriceLabel: string;
  valueTotalLabel: string;
};

export function SalesValueStack({
  items,
  priceLabel,
  regularPriceLabel,
  valueTotalLabel,
}: SalesValueStackProps) {
  return (
    <div className="nle-value-stack">
      <ul className="nle-value-stack__items">
        {items.map((item) => (
          <li key={item.name}>
            <Check aria-hidden="true" />
            <span>{item.name}</span>
            <strong>Valor: {item.value}</strong>
          </li>
        ))}
      </ul>
      <div className="nle-value-stack__summary">
        <p>
          Valor total: <s>{valueTotalLabel}</s>
        </p>
        <p>
          Precio regular: <strong>{regularPriceLabel}</strong>
        </p>
        <p>
          Hoy lanzamiento Bolivia: <strong>{priceLabel}</strong>
        </p>
      </div>
    </div>
  );
}
