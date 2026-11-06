import "prism-code-editor/prism/languages/nasm";
import { languages } from "prism-code-editor/prism";
import { extend, insertBefore } from "prism-code-editor/prism/utils";

insertBefore(languages.nasm, "register", {
	instruction: {
		pattern: /(^[\t ]*(?:[A-Za-z._?$][\w.?$@~#]*:[\t ]*)?)[a-z][a-z\d]*\b(?![\t ]*[:=])/gim,
		lookbehind: true,
	},
});

languages.gas = extend("nasm", {
	comment: [
		/\/\*[\s\S]*?\*\//,
		/;?#.*/,
		{ pattern: /(^[\t ]*)\/\/.*/m, lookbehind: true },
	],
});

export type Syntax = "nasm" | "gas";
