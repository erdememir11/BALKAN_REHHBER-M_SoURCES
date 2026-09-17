# KBN-001 — Doğrulama kanıtı

- Tarih: 18 Eylül 2026.
- Mevcut branch: `feat/kbn-001-repo-shell`.
- Ortam: Windows, Node.js 24.16.0, npm 11.13.0.
- Kapsam: repository başlangıcı ve responsive açılış ekranı.
- ADR değişikliği yok. KBN-002 başlatılmadı; veri sözleşmeleri uygulanmadı.
- Commit/push/PR yapılmadı. Öğrenme kontrolünün kullanıcı cevapları henüz alınmadı;
  kaynak Kanban belgesindeki pano durumu değiştirilmedi.

## Tekrarlanabilir kontroller

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run dev
```

README adımları ayrı, yeni bir geçici klasörde doğrulandı: repository dosyaları
kopyalandı; `node_modules`, `.next`, `.env.local` veya önceden üretilmiş tipler taşınmadı.
`npm ci`, lint, typecheck, test ve build bu klasörde sırasıyla başarılı oldu.
Ana repository'de geliştirme sunucusu tek komutla açıldı; güncel kaynakla typecheck
ve build ayrıca geçti. Temiz kopyanın production çıktısı `npm start -- --port 3101`
ile açılıp HTTP 200, pilot metni ve çağrı bağlantısı kontrol edildi.

| Kontrol | Sonuç |
| --- | --- |
| Temiz `npm ci` | PASS — lock ile kurulum, 0 bilinen npm audit açığı |
| `npm run lint` | PASS — çıkış kodu 0, lint hatası/uyarısı yok |
| `npm run typecheck` | PASS — build öncesinde de çalışıyor |
| `npm test` | PASS — 1 dosyada 2 test |
| `npm run build` | PASS — `/` ve varsayılan `/_not-found` statik üretildi |
| Development `/` | PASS — HTTP 200 |
| Production `/` | PASS — HTTP 200, pilot ve çağrı mevcut |
| Olmayan URL | PASS — HTTP 404 |
| Masaüstü 1440 × 1000 | PASS — okunur, yatay taşma yok |
| Mobil 390 × 844 | PASS — tek sütun, okunur, yatay taşma yok |
| Dar mobil 320 × 720 | PASS — okunur, yatay taşma yok |
| Başlama çağrısı | PASS — `#pilot-kapsami` bölümüne gidiyor |
| JavaScript kapalı | PASS — içerik ve aynı sayfa bağlantısı çalışıyor |
| Tarayıcı runtime hatası | PASS — 0 |
| Server/client sınırı | PASS — uygulama kodunda `use client`, state veya event handler yok |
| `.env.example` | PASS — yalnız boş değerli değişken adları; secret yok |
| Kaynak belgeler | PASS — dört kaynak README'den bağlı, asılları değiştirilmedi |
| Diff/kapsam | PASS — yalnız KBN-001 başlangıcı, testler, kurulum ve kanıt dosyaları |

Kurulum notu: npm, uyumlu peer bağımlılıkları için sabitlenen ESLint 9.39.5'e
destek sonu uyarısı verir; bu bir lint hatası değildir. Detay README'dedir.

## Tarayıcı kanıtı

Kurulu Microsoft Edge üzerinde geçici Playwright kontrolü çalıştırıldı. Bu kontrol
repository'ye Playwright bağımlılığı, E2E test altyapısı veya sonraki kartların
akışlarını eklemez. Ekran görüntüleri ayrıca görsel olarak incelendi.

- [Masaüstü](evidence/kbn-001-desktop.png)
- [Mobil](evidence/kbn-001-mobile.png)
- [Dar mobil](evidence/kbn-001-narrow.png)

Görünür kullanıcı sekmesini otomatik açma adımı tamamlanamadı: `Start-Process` ile
adres açma otomatik onay denetimince `blocked by policy` gerekçesiyle reddedildi;
browser aracı kullanılabilir tarayıcı bulamadı, Computer Use ise native pipe'a
bağlanamadı. Headless tarayıcı testi ve ekran görüntüleri başarılıdır.
Kullanıcı [yerel başlangıç ekranını](http://127.0.0.1:3000) tarayıcısında açabilir.

## Kabul edilmiş mimari

Sayfa ve ortak layout Server Component'tir. Başlama çağrısı normal HTML anchor'dır;
gerçek plan üretimi veya form varmış gibi davranmaz. Pilot bilgisi bu kartta sabit
tanıtım metnidir; doğrulanmış içerik deposu veya contract değildir. Harici font,
API, auth, database, AI, CMS, ayrı backend, monorepo ve tasarım sistemi eklenmedi.

KBN-001'i engelleyen mimari çelişki saptanmadı. Kaynaklarda kalan tarihsel belge
adları README'de mevcut dosyalara eşlendi; kabul edilmiş kaynak metinler değiştirilmedi.
