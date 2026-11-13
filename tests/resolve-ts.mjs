/**
 * Lets `node --test` run the app's TypeScript as-is: Node strips the types,
 * this hook resolves what the bundler normally would — the `@/` alias and
 * imports without a file extension.
 */
import { registerHooks } from "node:module";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SRC = new URL("../src/", import.meta.url);

function isFile(url) {
  const path = fileURLToPath(url);
  return existsSync(path) && statSync(path).isFile();
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    let url = null;
    if (specifier.startsWith("@/")) url = new URL(specifier.slice(2), SRC);
    else if (/^\.\.?\//.test(specifier) && context.parentURL) {
      url = new URL(specifier, context.parentURL);
    }
    if (url && url.protocol === "file:") {
      for (const candidate of [url.href, `${url.href}.ts`, `${url.href}.tsx`, `${url.href}/index.ts`]) {
        if (isFile(new URL(candidate))) return nextResolve(candidate, context);
      }
    }
    return nextResolve(specifier, context);
  },
});
