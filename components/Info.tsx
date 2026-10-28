// Native <details>: an accessible toggle with zero JavaScript.
export function Info({ title, text }: { title: string; text: string }) {
  return (
    <details className="info">
      <summary aria-label={`About ${title}`}>i</summary>
      <span className="info-pop" role="tooltip">{text}</span>
    </details>
  );
}
