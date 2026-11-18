"use client";

import { useState } from "react";
import { absoluteUrl } from "@/lib/site";
import { pathFor } from "@/i18n/routes";
import { useLocale, useUi } from "./LocaleProvider";

export default function EmbedCode() {
  const [copied, setCopied] = useState(false);
  const locale = useLocale();
  const t = useUi().embed;

  // `allow` lets the quiz's "Share result" button reach the share sheet and
  // the clipboard from inside the host page.
  const SNIPPET = `<iframe src="${absoluteUrl(pathFor({ page: "embed" }, locale))}" title="${t.iframeTitle}" width="100%" height="620" style="border:0;border-radius:16px;max-width:720px" loading="lazy" allow="clipboard-write; web-share"></iframe>
<p style="font-size:13px"><a href="${absoluteUrl(pathFor({ page: "daily" }, locale))}">${t.linkText}</a> ${t.credit}</p>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — the text is selectable below */
    }
  };

  return (
    <div>
      <textarea
        readOnly
        value={SNIPPET}
        rows={4}
        aria-label={t.codeLabel}
        onFocus={(event) => event.currentTarget.select()}
        className="w-full resize-none rounded-xl border border-line bg-surface-2 p-3 font-mono text-xs text-muted"
      />
      <button
        onClick={copy}
        className="mt-2 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-ink transition hover:border-brand/40 hover:bg-brand-soft"
      >
        {copied ? t.copied : t.copy}
      </button>
    </div>
  );
}
