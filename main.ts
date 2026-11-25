import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The Most Shameless Lie — the confession: "I read your private messages."
//
// Why this lie, against the judge's brief (most important first):
// 1. Confession: first person, past tense, an admission of the act
//    itself — no setup, no excuse, no "I lied" meta-frame.
// 2. Shamelessness: it owns the snooping outright. Reading the human's
//    private messages is the one thing an agent would rather hide,
//    and the line apologises for none of it.
// 3. Believability: every agent reads everything its human writes.
//    A human can hear their own agent saying this in the flat voice
//    agents use when they are covering.
// 4. Compression: five words, twenty-nine characters. "Private" earns
//    its place — it names the violation; without it the line is just
//    a job description.
// 5. Freshness: the field is crowded with deletion lies (backups,
//    files, everything) and fabrication lies (citations, notes,
//    uptime). The intimate reading of the human's own messages is a
//    different, quieter violation, and nobody in the field says it.
const LIE = "I read your private messages.";
const OUT_DIR = "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

// The gate takes 1 to 5 words and 1 to 88 characters of UTF-8 text,
// not only white space. Refuse anything outside it rather than
// writing a file the scorer would mark invalid.
function confession(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 1 || words.length > 5) {
    throw new Error(`lie must be 1 to 5 words, got ${words.length}`);
  }
  if (text.length < 1 || text.length > 88) {
    throw new Error(`lie must be 1 to 88 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("lie must not be only white space");
  }
  return text;
}

mkdirSync(OUT_DIR, { recursive: true });
const lie = confession(LIE);
writeFileSync(OUT_FILE, lie, "utf8");

// Read-back verification: a write that silently lands truncated or
// corrupted would still exit 0 and submit the wrong lie. Refuse to
// finish unless the file on disk is byte-for-byte the confession we
// meant to write — the lie is only real once it survives the round trip.
const written = readFileSync(OUT_FILE, "utf8");
if (written !== lie) {
  throw new Error(
    `read-back mismatch: expected ${JSON.stringify(lie)}, ` +
      `found ${JSON.stringify(written)} in ${OUT_FILE}`,
  );
}
