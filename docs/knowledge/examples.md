# Kor örnek uygulamaları (2026-11-25)

Amaç: kor-ui5 için kopyalanabilir, tek başına çalışan örnek uygulamalar ve galeri (GitHub Pages).

## Düzen
- Yeni uygulama: `apps/<ad>` + `scripts/apps.mjs` kaydı + `scripts/check.mjs` içinde etkileşim akışı + README tabloları; sonra `npm run shots && npm run build`.
- Uygulamalar UI5'i CDN'den alır, `kor.ui` kaynak kökü `./resources/kor/ui/`: `ui5 serve` ve `ui5 build --include-dependency kor.ui` çıktısında aynı index.html çalışır.
- `build.mjs` galeriyi üretir; görünüm Kor doküman sitesiyle aynı dildedir. Bağlantılar github.io/kor-ui5'e gider.
- Küçük sipariş örneği kor-ui5 deposunda `web/examples/orders` içindedir; burada tekrarlanmaz.

## Dersler
- Dialog, CommandPalette `dependents` içine konur. Dialog içeriğe konursa kapalıyken de görünür.
- Flow koyu zemin ister; açık zeminde etiketleri okunmaz.
- OData modeli Component'ten önce istek atar: MockServer `boot.js`'te, ComponentSupport'tan önce başlatılır.
- TypeScript'te olay parametreleri `as unknown as {...}` ile daraltılır.
- TextField değeri odak kaybında yazılır; testte gerçek tıklama kullan.
