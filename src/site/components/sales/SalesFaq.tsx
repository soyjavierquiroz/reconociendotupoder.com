type SalesFaqItem = {
  question: string;
  answer: string;
};

type SalesFaqProps = {
  items: readonly SalesFaqItem[];
};

export function SalesFaq({ items }: SalesFaqProps) {
  return (
    <div className="nle-faq-list">
      {items.map((faq) => (
        <details className="nle-faq-item" key={faq.question}>
          <summary>{faq.question}</summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
