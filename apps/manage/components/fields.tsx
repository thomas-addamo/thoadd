import type { Localized } from "@thoadd/db";
import type { Field } from "@/lib/sections";

const input =
  "w-full rounded-2xl border border-haze bg-cloud px-4 py-3 text-[15px] text-ink outline-none transition focus:border-iris focus:ring-3 focus:ring-aura/30";

function Label({ field, htmlFor, suffix }: { field: Field; htmlFor: string; suffix?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-2 text-[13px] font-medium text-ink">
      {field.label}
      {suffix && <span className="font-normal text-slate">{suffix}</span>}
      {field.required && <span className="text-iris" aria-hidden="true">*</span>}
    </label>
  );
}

export function FieldInput({ field, value, idPrefix }: { field: Field; value: unknown; idPrefix: string }) {
  const id = `${idPrefix}-${field.name}`;
  const hint = field.hint && <p className="mt-1.5 mb-0 text-[12px] text-slate">{field.hint}</p>;

  if (field.kind === "localized") {
    const v = (value as Localized | null) ?? { it: "" };
    const Tag = field.long ? "textarea" : "input";
    return (
      <div className="col-span-full grid gap-3 md:grid-cols-2">
        {(["it", "en"] as const).map((lang) => (
          <div key={lang}>
            <Label field={lang === "it" ? field : { ...field, required: false }} htmlFor={`${id}-${lang}`} suffix={lang === "it" ? "Italiano" : "English"} />
            <Tag
              id={`${id}-${lang}`}
              name={`${field.name}.${lang}`}
              defaultValue={v[lang] ?? ""}
              required={field.required && lang === "it"}
              rows={field.long ? 4 : undefined}
              placeholder={lang === "en" ? "Se vuoto, si usa l'italiano" : undefined}
              className={`${input} ${field.long ? "resize-y" : ""}`}
            />
          </div>
        ))}
        {hint && <div className="col-span-full -mt-1">{hint}</div>}
      </div>
    );
  }

  if (field.kind === "image") {
    const current = typeof value === "string" && value ? value : null;
    return (
      <div className="col-span-full">
        <Label field={field} htmlFor={id} />
        <div className="flex flex-wrap items-center gap-4">
          {current && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current} alt="" className="size-20 rounded-2xl object-cover shadow-[inset_0_0_0_1px_var(--color-haze)]" />
          )}
          <input type="hidden" name={field.name} value={current ?? ""} />
          <input
            id={id}
            type="file"
            name={`${field.name}__file`}
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="text-[14px] file:mr-3 file:h-10 file:rounded-full file:border file:border-haze file:bg-cloud file:px-4 file:text-ink"
          />
          {current && (
            <label className="flex items-center gap-2 text-[14px] text-slate">
              <input type="checkbox" name={`${field.name}__remove`} className="size-4 accent-iris" /> Rimuovi
            </label>
          )}
        </div>
        {hint}
      </div>
    );
  }

  if (field.kind === "gallery" || field.kind === "files") {
    const items = (value as { url: string; name?: string; size?: number }[] | null) ?? [];
    const gallery = field.kind === "gallery";
    return (
      <div className="col-span-full">
        <Label field={field} htmlFor={id} />
        {items.length > 0 && (
          <ul className={`m-0 mb-3 list-none p-0 ${gallery ? "grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3" : "flex flex-col gap-2"}`}>
            {items.map((item) => (
              <li key={item.url} className={gallery ? "" : "flex items-center justify-between gap-3 rounded-2xl border border-haze px-4 py-2.5"}>
                <input type="hidden" name={`${field.name}__keep`} value={JSON.stringify(item)} />
                {gallery ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt="" className="aspect-square w-full rounded-2xl object-cover shadow-[inset_0_0_0_1px_var(--color-haze)]" />
                ) : (
                  <a href={item.url} target="_blank" rel="noopener" className="truncate text-[14px]">
                    {item.name}
                  </a>
                )}
                <label className={`flex items-center gap-2 text-[13px] text-slate ${gallery ? "mt-1.5" : "flex-none"}`}>
                  <input type="checkbox" name={`${field.name}__remove`} value={item.url} className="size-4 accent-iris" /> Rimuovi
                </label>
              </li>
            ))}
          </ul>
        )}
        <input
          id={id}
          type="file"
          multiple
          name={`${field.name}__files`}
          accept={gallery ? "image/jpeg,image/png,image/webp,image/avif" : undefined}
          className="text-[14px] file:mr-3 file:h-10 file:rounded-full file:border file:border-haze file:bg-cloud file:px-4 file:text-ink"
        />
        {hint}
      </div>
    );
  }

  if (field.kind === "links") {
    const list = (value as { label: string; url: string }[] | null) ?? [];
    return (
      <div className="col-span-full">
        <Label field={field} htmlFor={id} />
        <textarea
          id={id}
          name={field.name}
          rows={3}
          defaultValue={list.map((l) => `${l.label} | ${l.url}`).join("\n")}
          placeholder="Demo | https://…"
          className={`${input} resize-y font-mono text-[14px]`}
        />
        {hint}
      </div>
    );
  }

  if (field.kind === "boolean") {
    return (
      <label htmlFor={id} className="flex min-h-11 items-center gap-3 self-end text-[15px]">
        <input id={id} type="checkbox" name={field.name} defaultChecked={Boolean(value)} className="size-5 accent-iris" />
        {field.label}
      </label>
    );
  }

  if (field.kind === "select") {
    return (
      <div>
        <Label field={field} htmlFor={id} />
        <select id={id} name={field.name} defaultValue={value == null ? undefined : String(value)} className={input}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {hint}
      </div>
    );
  }

  const type = { text: "text", url: "url", email: "email", number: "number", date: "date", tags: "text", slug: "text" }[field.kind as "text"];
  const text = field.kind === "tags" ? ((value as string[] | null) ?? []).join(", ") : value == null ? "" : String(value);
  return (
    <div className={field.kind === "url" ? "md:col-span-2" : undefined}>
      <Label field={field} htmlFor={id} />
      <input id={id} type={type} name={field.name} defaultValue={text} required={field.required} className={input} />
      {hint}
    </div>
  );
}

export function Fields({ fields, values, idPrefix }: { fields: Field[]; values: Record<string, unknown>; idPrefix: string }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {fields.map((f) => (
        <FieldInput key={f.name} field={f} value={values[f.name]} idPrefix={idPrefix} />
      ))}
    </div>
  );
}

export function SaveButton({ children = "Salva" }: { children?: React.ReactNode }) {
  return (
    <button type="submit" className="inline-flex h-12 items-center rounded-full bg-pill px-6 font-medium text-pill-ink transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-pill)]">
      {children}
    </button>
  );
}

export function Notice({ ok, error }: { ok?: string; error?: string }) {
  if (!ok && !error) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={`mb-6 rounded-2xl px-5 py-3 text-[15px] ${error ? "bg-dawn text-ink" : "bg-cloud text-ink shadow-[var(--shadow-sheet)]"}`}
    >
      {error ?? `✓ ${ok}`}
    </p>
  );
}
