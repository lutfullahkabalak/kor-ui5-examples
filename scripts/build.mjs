// Builds every app and the gallery page into dist/
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { apps } from "./apps.mjs";

const REPO = "https://github.com/lutfullahkabalak/kor-ui5-examples", DOCS = "https://lutfullahkabalak.github.io/kor-ui5";
const ORIGIN = "https://lutfullahkabalak.github.io/kor-ui5-examples";
fs.rmSync("dist", { recursive: true, force: true });
for (const { name } of apps) {
	const dir = path.join("apps", name);
	if (fs.existsSync(path.join(dir, "ui5.yaml"))) execFileSync("npm", ["run", "build"], { cwd: dir, stdio: "inherit" });
	fs.cpSync(fs.existsSync(path.join(dir, "ui5.yaml")) ? path.join(dir, "dist") : dir, path.join("dist", name), {
		recursive: true, filter: (f) => !/\.map$|-dbg(\.\w+)*\.js$|\.d\.ts$|README\.md$/.test(f)
	});
}
fs.cpSync("site", "dist", { recursive: true });
fs.cpSync("node_modules/kor-ui5/src", "dist/kor", { recursive: true, filter: (f) => !/\.(js|ts)$/.test(f) });

const T = {
	en: { title: "Kor examples", h: "Complete apps, ready to copy.", lead: "Small UI5 applications built with the published kor-ui5 package. Open one, read its source, take the folder.", live: "Open", source: "Source", docs: "Documentation", components: "Components", examples: "Examples", theme: "Switch light or dark", other: "Türkçe", run: "Run one locally", foot: "Not affiliated with SAP. SAP, SAP Fiori and SAPUI5 are trademarks of SAP SE." },
	tr: { title: "Kor örnekleri", h: "Kopyalanmaya hazır, eksiksiz uygulamalar.", lead: "Yayımlanmış kor-ui5 paketiyle yazılmış küçük UI5 uygulamaları. Birini açın, kaynağını okuyun, klasörünü alın.", live: "Aç", source: "Kaynak kod", docs: "Dokümantasyon", components: "Bileşenler", examples: "Örnekler", theme: "Açık veya koyu görünüme geç", other: "English", run: "Yerelde çalıştırın", foot: "SAP ile bağlantılı değildir. SAP, SAP Fiori ve SAPUI5, SAP SE'nin ticari markalarıdır." }
};
for (const lang of ["en", "tr"]) {
	const t = T[lang], up = lang === "en" ? "./" : "../", d = `${DOCS}/${lang === "en" ? "" : "tr/"}`, q = lang === "en" ? "" : "?lang=tr";
	const html = `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.title}</title><meta name="description" content="${t.lead}"><link rel="canonical" href="${ORIGIN}/${lang === "en" ? "" : "tr/"}">
<link rel="alternate" hreflang="en" href="${ORIGIN}/"><link rel="alternate" hreflang="tr" href="${ORIGIN}/tr/">
<link rel="icon" href="${up}icon.svg"><link rel="stylesheet" href="${up}kor/kor.css"><link rel="stylesheet" href="${up}gallery.css">
<script>try{var m=localStorage.getItem("kor-mode")}catch(e){}document.documentElement.dataset.korMode=m||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")</script></head>
<body class="kor"><header class="top"><a class="brand" href="${d}">kor</a><nav><a href="${d}guides/getting-started/">${t.docs}</a><a href="${d}components/">${t.components}</a><a href="" aria-current="page">${t.examples}</a></nav>
<a class="lang" href="${lang === "en" ? "tr/" : "../"}" lang="${lang === "en" ? "tr" : "en"}">${t.other}</a><button type="button" aria-label="${t.theme}" title="${t.theme}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg></button><a class="git" href="${REPO}">GitHub</a></header>
<main><h1>${t.h}</h1><p class="lead">${t.lead}</p>
<div class="apps">${apps.map((a) => `<article><a class="shot" href="${up}${a.name}/${q}" tabindex="-1" aria-hidden="true"><img src="${up}shots/${a.name}-${lang}.jpg" width="1280" height="800" alt="" loading="lazy"></a><h2><a href="${up}${a.name}/${q}">${a.title[lang]}</a></h2><p>${a.text[lang]}</p><p class="uses">${a.uses.map((u) => `<a href="${d}components/${u.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}/">${u}</a>`).join("")}</p><p class="go"><a href="${up}${a.name}/${q}">${t.live}</a><a href="${REPO}/tree/main/apps/${a.name}">${t.source}</a></p></article>`).join("")}</div>
<h2>${t.run}</h2><pre><code>npx degit lutfullahkabalak/kor-ui5-examples/apps/typescript-starter my-app
cd my-app
npm install
npm start</code></pre></main>
<footer><span>Apache-2.0</span><a href="${REPO}">GitHub</a><a href="https://www.npmjs.com/package/kor-ui5">npm</a><span>${t.foot}</span></footer>
<script>document.querySelector("header button").onclick=()=>{const r=document.documentElement,m=r.dataset.korMode==="dark"?"light":"dark";r.dataset.korMode=m;try{localStorage.setItem("kor-mode",m)}catch(e){}}</script></body></html>`;
	const out = lang === "en" ? "dist" : "dist/tr";
	fs.mkdirSync(out, { recursive: true });
	fs.writeFileSync(path.join(out, "index.html"), html);
}
console.log(`${apps.length} apps built`);
