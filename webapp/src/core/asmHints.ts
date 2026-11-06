import type { PrismEditor } from "prism-code-editor";
import { addPointerListener } from "prism-code-editor/hover";
import { addEditorHotkey, addEditorHotkeySequence } from "prism-code-editor/commands";
import { getClosestToken } from "prism-code-editor/utils";

type Hint = [description: string, url: string];

let hints: Record<string, Hint> | undefined;
let loading: Promise<void> | undefined;

const loadHints = () =>
	(loading ??= import("../assets/asm-docs-amd64.json").then((m) => {
		hints = m.default as Record<string, Hint>;
	}));

const getHint = (mnemonic: string) => hints?.[mnemonic.toUpperCase()];

export const asmHints = () => (editor: PrismEditor) => {
	const tooltip = document.createElement("p");
	tooltip.className = "asmhint";
	tooltip.setAttribute("role", "tooltip");
	let current: Element | null = null;
	let openTimer: ReturnType<typeof setTimeout>;
	let closeTimer: ReturnType<typeof setTimeout>;
	let exitX = 0;
	let exitY = 0;

	const hide = () => {
		clearTimeout(openTimer);
		clearTimeout(closeTimer);
		current = null;
		tooltip.remove();
	};

	const hideSoon = () => {
		clearTimeout(openTimer);
		clearTimeout(closeTimer);
		if (current) closeTimer = setTimeout(hide, 300);
	};

	const towardTooltip = ({ clientX: x, clientY: y }: PointerEvent) => {
		const r = tooltip.getBoundingClientRect();
		const s = (y - exitY) / ((r.top > exitY ? r.top : r.bottom) - exitY);
		return s >= 0 && s <= 1 && x >= exitX + s * (r.left - exitX) && x <= exitX + s * (r.right - exitX);
	};

	const leave = (e: PointerEvent) => (current && towardTooltip(e) ? hideSoon() : hide());

	const open = (token: Element, hint: Hint) => {
		current = token;
		const link = document.createElement("a");
		link.href = hint[1];
		link.target = "_blank";
		link.rel = "noopener";
		link.textContent = "Reference";
		tooltip.replaceChildren(hint[0], link);
		document.body.append(tooltip);
		const r = token.getBoundingClientRect();
		const { width, height } = tooltip.getBoundingClientRect();
		const below = r.bottom + height + 4 < innerHeight;
		tooltip.style.top = (below ? r.bottom + 2 : r.top - height - 2) + "px";
		tooltip.style.left = Math.max(8, Math.min(r.left, innerWidth - width - 8)) + "px";
	};

	const show = (token: Element, delay: number) => {
		clearTimeout(closeTimer);
		if (token == current) return;
		clearTimeout(openTimer);
		openTimer = setTimeout(() => {
			const hint = getHint(token.textContent!);
			if (hint) open(token, hint);
			else hideSoon();
		}, current ? 0 : delay);
	};

	tooltip.addEventListener("pointerenter", () => clearTimeout(closeTimer));
	tooltip.addEventListener("pointerleave", (e) => {
		if (e.relatedTarget != editor.textarea) hideSoon();
	});
	editor.textarea.addEventListener("pointerenter", (e) => {
		if (e.pointerType != "touch") loadHints();
	});
	editor.textarea.addEventListener("pointerleave", (e) => {
		if (!tooltip.contains(e.relatedTarget as Node)) leave(e);
	});
	addPointerListener(editor, "pointermove", (e, target) => {
		if (e.pointerType == "touch") return;
		if (!target.matches(".instruction")) return leave(e);
		exitX = e.clientX;
		exitY = e.clientY;
		show(target, 300);
	});
	addEventListener("scroll", hide, true);
	editor.on("selectionChange", hide);

	addEditorHotkey(editor, "escape", () => {
		if (!current) return;
		hide();
		return true;
	}, 0);
	addEditorHotkeySequence(editor, ["mod+k", "mod+i"], () => {
		const token = getClosestToken(editor, ".instruction", 0, 0);
		if (!token) return;
		loadHints().then(() => show(token, 0));
		return true;
	});
};
