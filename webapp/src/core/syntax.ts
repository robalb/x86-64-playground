import "prism-code-editor/prism/languages/nasm";
import { languages } from "prism-code-editor/prism";
import { extend } from "prism-code-editor/prism/utils";

languages.gas = extend("nasm", {
	comment: [
		/\/\*[\s\S]*?\*\//,
		/;?#.*/,
		{ pattern: /(^[\t ]*)\/\/.*/m, lookbehind: true },
	],
});

export type Syntax = "nasm" | "gas";
