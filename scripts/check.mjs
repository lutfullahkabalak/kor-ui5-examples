// Opens every built app in Chrome (en + tr, desktop + phone) and runs a short interaction. --shots also refreshes site/shots.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { apps } from "./apps.mjs";

const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".xml": "application/xml", ".properties": "text/plain" };
// Served under a sub path, like GitHub Pages
const server = http.createServer((q, r) => {
	const p = decodeURIComponent(new URL(q.url, "http://x").pathname);
	let f = path.join("dist", p.replace(/^\/kor-ui5-examples/, ""));
	if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
	if (!p.startsWith("/kor-ui5-examples/") || !fs.existsSync(f)) return r.writeHead(404).end();
	r.writeHead(200, { "content-type": (mime[path.extname(f)] ?? "application/octet-stream") });
	fs.createReadStream(f).pipe(r);
}).listen(0);
const origin = `http://localhost:${server.address().port}/kor-ui5-examples/`;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const click = (p, label) => p.evaluate((l) => {
	const el = [...document.querySelectorAll("button, a, [role=radio], [role=button], [role=link]")].find((e) => e.innerText.trim() === l || e.getAttribute("aria-label") === l);
	if (!el) throw new Error(`not found: ${l}`);
	el.click();
}, label);
const see = async (p, text) => {
	await p.waitForFunction((t) => document.body.innerText.includes(t) || [...document.querySelectorAll("input")].some((i) => i.value.includes(t)), { timeout: 8000 }, text).catch(() => { throw new Error(`expected text: ${text}`); });
};
const byText = (p, text) => p.evaluateHandle((t) => [...document.querySelectorAll("*")].filter((e) => e.innerText?.trim() === t).at(-1), text);
const flows = {
	"typescript-starter": async (p) => {
		await click(p, "Customers"); await see(p, "Nordlicht");
		await p.goto(origin + "typescript-starter/#/customers/C-11"); await p.reload(); await see(p, "Mira");
		await click(p, "Save"); await see(p, "C-11 saved");
		await click(p, "Back"); await see(p, "Nordlicht");
	},
	"odata-products": async (p) => {
		await see(p, "Ball valve");
		const cell = await byText(p, "Ball valve");
		await cell.click({ count: 2 }); await wait(300);
		await p.keyboard.down(process.platform === "darwin" ? "Meta" : "Control"); await p.keyboard.press("a"); await p.keyboard.up(process.platform === "darwin" ? "Meta" : "Control");
		await p.keyboard.type("Steel valve"); await p.keyboard.press("Enter"); await wait(400);
		await click(p, "Save changes"); await see(p, "Changes saved"); await see(p, "Steel valve");
		await p.evaluate(() => document.querySelector(".korFilter input, .korFilterBar input, [id$=filter] input").focus());
		await p.keyboard.type("pump"); await p.keyboard.press("Enter"); await wait(900);
		if (await p.evaluate(() => document.body.innerText.includes("Flange gasket"))) throw new Error("filter had no effect");
		await see(p, "Gear pump");
	},
	approvals: async (p) => {
		await see(p, "PR-2041");
		const b = await byText(p, "Hold to approve"); const box = await b.boundingBox();
		await p.mouse.move(box.x + 10, box.y + 8); await p.mouse.down(); await wait(1300); await p.mouse.up();
		await see(p, "PR-2041 approved");
		await (await byText(p, "PR-2042")).click(); await see(p, "Forklift battery");
		await see(p, "Supplier: Voltra");
		await click(p, "Reject"); await see(p, "Reject PR-2042"); await wait(400);
		await p.evaluate(() => document.querySelector("textarea").focus()); await p.keyboard.type("Too expensive");
		// A real click, so the text area loses focus and reports its value
		await (await p.evaluateHandle(() => [...document.querySelectorAll("button")].filter((e) => e.innerText.trim() === "Reject" && e.closest("#sap-ui-static")).at(-1))).asElement().click();
		await see(p, "rejected the request: Too expensive");
	},
	"production-plan": async (p) => {
		await see(p, "WO-81"); await click(p, "Shop floor"); await see(p, "Valve assembly");
		await p.evaluate(() => [...document.querySelectorAll(".korCard, [class*=korBoardCard]")].find((e) => e.innerText.includes("WO-82")).focus());
		await (await byText(p, "Pump assembly")).click(); await see(p, "Progress");
	},
	"cash-dashboard": async (p) => {
		await see(p, "SO-300"); await see(p, "Cash collected");
		if ((await p.evaluate(() => document.querySelectorAll(".korSlice").length)) < 3) throw new Error("pie chart has no slices");
		if ((await p.evaluate(() => document.querySelectorAll(".korBars .korCol").length)) !== 4) throw new Error("bar chart has no bars");
		const rows = () => p.evaluate(() => document.querySelector("[aria-rowcount]")?.getAttribute("aria-rowcount"));
		const all = await rows();
		await p.evaluate(() => document.querySelectorAll(".korPieRow")[3].click()); await wait(300);
		if (!all || (await rows()) === all) throw new Error("pie slice did not filter the list");
		await click(p, "Green"); await wait(200);
		if (!(await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--kor-accent"))).includes("0B7A5B")) throw new Error("accent did not change");
		await p.evaluate(() => document.querySelector("[role=switch]").click()); await wait(200);
		if ((await p.evaluate(() => document.documentElement.dataset.korMode)) !== "dark") throw new Error("dark mode did not start");
	},
	"no-build": async (p) => { await see(p, "Call the carrier"); await click(p, "Add task"); await see(p, "New task"); }
};
let failed = 0;
const browser = await puppeteer.launch({ ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" }), args: process.env.CI ? ["--no-sandbox"] : [] });
async function open(url, where, width, fn) {
	const context = await browser.createBrowserContext(), p = await context.newPage();
	const bad = (m) => { failed++; console.log(`FAIL ${where}: ${m}`); };
	p.on("pageerror", (e) => bad(e.message));
	p.on("response", (r) => r.status() >= 400 && !/favicon|messagebundle|i18n_/.test(r.url()) && bad(`${r.status()} ${r.url()}`));
	p.on("console", (m) => m.type() === "error" && !/Failed to load resource|favicon|unload is not allowed/.test(m.text()) && bad(m.text().slice(0, 300)));
	await p.setViewport({ width, height: 800 });
	await p.goto(origin + url, { waitUntil: "networkidle0" });
	await wait(800);
	const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
	if (over > 1) bad(`horizontal overflow ${over}px`);
	try { await fn(p); } catch (e) { bad(e.message); await p.screenshot({ path: `dist/fail-${where.replace(/\W+/g, "-")}.png` }); }
	await context.close();
}
const shots = process.argv.includes("--shots");
for (const { name } of apps) {
	for (const lang of ["en", "tr"]) for (const width of [1280, 390]) await open(`${name}/?lang=${lang}`, `${name} ${lang} ${width}`, width, async (p) => {
		if ((await p.evaluate(() => document.body.innerText.trim().length)) < 40) throw new Error("page is empty");
		if (await p.evaluate(() => !!document.querySelector("#sap-ui-static [aria-modal=true], .korDialog")?.getClientRects().length)) throw new Error("a dialog is open at start");
		if (shots && width === 1280) await p.screenshot({ path: `site/shots/${name}-${lang}.jpg`, type: "jpeg", quality: 82 });
	});
	await open(`${name}/`, `${name} flow`, 1280, flows[name]);
}
for (const u of ["", "tr/"]) for (const width of [1280, 390]) await open(u, `gallery ${u} ${width}`, width, async () => {});
await browser.close();
server.close();
console.log(`${apps.length} apps checked, ${failed} failures`);
process.exit(failed ? 1 : 0);
