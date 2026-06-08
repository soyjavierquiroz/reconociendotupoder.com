type SalesTimelineItem = {
  letter: string;
  title: string;
  text: string;
};

type SalesTimelineProps = {
  items: readonly SalesTimelineItem[];
};

export function SalesTimeline({ items }: SalesTimelineProps) {
  return (
    <ol className="nle-timeline">
      {items.map((item) => (
        <li className="nle-timeline-item" key={`${item.letter}-${item.title}`}>
          <span aria-hidden="true">{item.letter}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
