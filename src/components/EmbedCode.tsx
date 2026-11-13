"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/site";

// `allow` lets the quiz's "Share result" button reach the share sheet and the
// clipboard from inside the host page.
const SNIPPET = `<iframe src="${SITE_URL}/embed/daily" title="Daily trivia quiz" width="100%" height="620" style="border:0;border-radius:16px;max-width:720px" loading="lazy" allow="clipboard-write; web-share"></iframe>
<p style="font-size:13px"><a href="${SITE_URL}/daily">Daily trivia quiz</a> by Quizzy</p>`;

export default function EmbedCode() {
  const [copied, setCopied] = useState(false);

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
        aria-label="Embed code"
        onFocus={(event) => event.currentTarget.select()}
        className="w-full resize-none rounded-xl border border-line bg-surface-2 p-3 font-mono text-xs text-muted"
      />
      <button
        onClick={copy}
        className="mt-2 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-ink transition hover:border-brand/40 hover:bg-brand-soft"
      >
        {copied ? "Copied ✓" : "Copy embed code"}
      </button>
    </div>
  );
}
