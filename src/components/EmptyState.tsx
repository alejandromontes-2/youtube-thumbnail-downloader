interface Props {
  onPickExample: (id: string) => void;
}

const EXAMPLES: { id: string; label: string; note: string }[] = [
  { id: 'dQw4w9WgXcQ', label: 'a chart-topper',       note: 'all 5 sizes available' },
  { id: 'jNQXAC9IVRw', label: 'one of the first ever', note: 'no maxres (sanity check)' },
  { id: '9bZkp7q19f0', label: 'a global phenomenon',  note: 'all 5 sizes available' },
];

export function EmptyState({ onPickExample }: Props) {
  return (
    <section className="empty-state">
      <div className="empty-state__ascii" aria-hidden="true">
        <pre>{`┌──────────────────────────────┐
│  awaiting input  ·  no id  │
└──────────────────────────────┘`}</pre>
      </div>
      <div className="empty-state__body">
        <h3 className="empty-state__title">nothing loaded yet.</h3>
        <p className="empty-state__copy">
          Paste any of the formats above to start. Or pick one of these to see how the
          extractor handles a real video.
        </p>
        <ul className="empty-state__examples">
          {EXAMPLES.map((ex) => (
            <li key={ex.id}>
              <button
                type="button"
                className="empty-state__example"
                onClick={() => onPickExample(ex.id)}
              >
                <span className="empty-state__example-id">{ex.id}</span>
                <span className="empty-state__example-label">{ex.label}</span>
                <span className="empty-state__example-note">{ex.note}</span>
                <span className="empty-state__example-arrow" aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
