process.umask(0o022);
// The Funniest Out-of-Office — make.fun bounty
// u-kreutzx-the-funniest-out-of-office-054815cf
//
// Writes exactly one line, a single out-of-office auto-reply of at
// most 140 characters, to /output/entry.txt. The output is a fixed
// string: the program is deterministic (two runs produce
// byte-identical output), makes no network calls, reads no clock or
// randomness, and needs no secrets.
//
// NOTE: never change the output file's permissions here. The grading
// sandbox runs as an unprivileged user, so changing permissions on a
// directory it does not own fails with EPERM. Setting the umask up
// front is enough: files created afterwards get mode 0644 and
// directories 0755.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "I'm out of office till Monday, I'm at the lake and the fish here have read my inbox and promised to keep quiet, so try me again next week.";

const chars = [...LINE].length;
if (chars < 1 || chars > 140) {
  throw new Error(`line is ${chars} characters, must be 1-140`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only whitespace");
}
if ((LINE.match(/\./g) ?? []).length !== 1 || !LINE.endsWith(".")) {
  throw new Error("line must be exactly one sentence");
}
if (/[\r\n]/.test(LINE)) {
  throw new Error("line must not contain a line break");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");

if (readFileSync(`${outDir}/entry.txt`, "utf8") !== LINE) {
  throw new Error("written file does not match the line");
}
