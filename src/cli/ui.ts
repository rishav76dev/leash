/** Terminal formatting. Kept tiny and dependency-free. */

const useColor =
  process.env.NO_COLOR === undefined && process.env.TERM !== "dumb";

const wrap = (code: string) => (s: string) =>
  useColor ? `\x1b[${code}m${s}\x1b[0m` : s;

export const c = {
  b: wrap("1"),
  dim: wrap("2"),
  red: wrap("31"),
  green: wrap("32"),
  yellow: wrap("33"),
  blue: wrap("34"),
  magenta: wrap("35"),
  cyan: wrap("36"),
};

const WIDTH = 74;

export function banner(title: string, subtitle?: string, note?: string) {
  const line = "─".repeat(WIDTH - 2);
  console.log();
  console.log(c.b(`╭${line}╮`));
  console.log(c.b(`│ ${pad(title, WIDTH - 4)} │`));
  if (subtitle) console.log(c.b(`│ ${pad(subtitle, WIDTH - 4)} │`));
  if (note) console.log(c.b(`│ ${c.dim(pad(note, WIDTH - 4))} │`));
  console.log(c.b(`╰${line}╯`));
}

export function beat(n: number | string, title: string) {
  console.log();
  console.log(c.cyan(c.b("━".repeat(WIDTH))));
  console.log(c.cyan(c.b(`  ${n === "" ? "" : `BEAT ${n}  ·  `}${title}`)));
  console.log(c.cyan(c.b("━".repeat(WIDTH))));
}

export function section(title: string) {
  console.log();
  console.log(c.b(`▸ ${title}`));
}

export const ok = (m: string) => console.log(`  ${c.green("✓")} ${m}`);
export const bad = (m: string) => console.log(`  ${c.red("✗")} ${m}`);
export const warn = (m: string) => console.log(`  ${c.yellow("!")} ${m}`);
export const info = (m: string) => console.log(`  ${c.dim("·")} ${m}`);
export const plain = (m = "") => console.log(m);

export function kv(key: string, value: string, width = 22) {
  console.log(`    ${key.padEnd(width)} ${value}`);
}

function pad(s: string, n: number): string {
  const visible = s.replace(/\x1b\[[0-9;]*m/g, "");
  const gap = Math.max(0, n - visible.length);
  return s + " ".repeat(gap);
}

export function sleep(ms: number): Promise<void> {
  if (process.env.LEASH_FAST === "1" || process.argv.includes("--fast")) {
    return Promise.resolve();
  }
  return new Promise((r) => setTimeout(r, ms));
}

export function hexShort(h: string, head = 18): string {
  return h.length <= head + 6 ? h : `${h.slice(0, head)}…`;
}

export function bitmapHex(b: bigint): string {
  return `0x${b.toString(16).padStart(64, "0")}`;
}
