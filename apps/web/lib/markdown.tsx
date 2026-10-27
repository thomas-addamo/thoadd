import { Fragment, type ReactNode } from "react";

// Markdown minimo per le descrizioni dei progetti: ## e ### titoletti, elenchi con - o 1.,
// **grassetto**, *corsivo serif*, [link](https://…). Niente HTML: tutto passa da React.
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index} className="font-medium">{m[1]}</strong>);
    else if (m[2]) out.push(<em key={m.index} className="accent text-iris">{m[2]}</em>);
    else out.push(<a key={m.index} href={m[4]} className="plain text-iris" target="_blank" rel="noopener">{m[3]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.replace(/\r\n?/g, "\n").trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (block.startsWith("### ")) return <h3 key={i} className="title-m mt-10 mb-0">{inline(block.slice(4))}</h3>;
        if (block.startsWith("## ")) return <h2 key={i} className="title-l mt-14 mb-0 text-[clamp(28px,3vw,40px)]">{inline(block.slice(3))}</h2>;
        if (lines.every((l) => /^[-*] /.test(l)))
          return (
            <ul key={i} className="mt-6 mb-0 flex flex-col gap-2 pl-5">
              {lines.map((l, k) => <li key={k}>{inline(l.slice(2))}</li>)}
            </ul>
          );
        if (lines.every((l) => /^\d+\. /.test(l)))
          return (
            <ol key={i} className="mt-6 mb-0 flex flex-col gap-2 pl-5">
              {lines.map((l, k) => <li key={k}>{inline(l.replace(/^\d+\. /, ""))}</li>)}
            </ol>
          );
        return (
          <p key={i} className="mt-6 mb-0">
            {lines.map((l, k) => (
              <Fragment key={k}>
                {k > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
