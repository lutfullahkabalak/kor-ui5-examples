# Kor örnekleri

[English](README.md) · [Canlı](https://lutfullahkabalak.github.io/kor-ui5-examples/tr/) · [Kor dokümantasyonu](https://lutfullahkabalak.github.io/kor-ui5/tr/)

Yayımlanmış [kor-ui5](https://github.com/lutfullahkabalak/kor-ui5) paketiyle yazılmış küçük, eksiksiz OpenUI5 uygulamaları. Hepsi UI5 1.108 üzerinde, İngilizce ve Türkçe (`?lang=tr`) çalışır. Veriler uydurmadır.

| Uygulama | Gösterdiği |
| --- | --- |
| [typescript-starter](apps/typescript-starter) | Shell, yönlendirme, derin bağlantı, komut paleti, tipli denetleyiciler |
| [odata-products](apps/odata-products) | OData V2: süzme, yerinde düzenleme, toplu kayıt, oluşturma, değer yardımı, kayıtlı görünüm |
| [approvals](apps/approvals) | Talep listesi, geçmiş, basılı tutarak onay, gerekçeli ret |
| [production-plan](apps/production-plan) | Aynı veri üzerinde Schedule ve Board |
| [cash-dashboard](apps/cash-dashboard) | Stat, PieChart, BarChart, Trend, listeyi süzen Flow, çalışırken tema |
| [no-build](apps/no-build) | Her şeyi CDN'den alan tek HTML dosyası |

Her klasör tek başına çalışır:

```bash
npx degit lutfullahkabalak/kor-ui5-examples/apps/typescript-starter my-app
cd my-app && npm install && npm start
```

OData örneği istekleri UI5 MockServer ile yanıtlar; gerçek SAP Gateway ile denenmedi.
