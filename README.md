# Balkan Rehberim

KBN-001: Next.js App Router + React + TypeScript ile yerel başlangıç ekranı.
Pilot: **Arnavutluk + Karadağ, 4–6 gün, çift + kiralık araç**.

## Temiz kurulum ve çalıştırma

Gereksinimler: **Node.js 24.x**, **npm 11.x** ve Git. Node sürümü `.nvmrc` içinde de belirtilir.
Repository'yi edinin ve `package.json` dosyasının bulunduğu kök klasörde terminal açın.

```sh
npm ci
npm run dev
```

Uygulamayı [http://127.0.0.1:3000](http://127.0.0.1:3000) adresinde açın.
Kurulumdan sonra tek başlatma komutu `npm run dev`'dir. Durdurmak için `Ctrl+C` kullanın.
Port doluysa `npm run dev -- --port 3001` çalıştırıp terminalin verdiği adresi açın.

Windows PowerShell `npm.ps1` için execution policy hatası verirse aynı komutları
`npm.cmd ci` ve `npm.cmd run dev` olarak çalıştırın; sistem güvenlik ayarlarını değiştirmeniz gerekmez.
Diğer npm komutları için de aynı `npm.cmd` karşılığı geçerlidir.

Bu kart için `.env.local` oluşturmak veya dış servis hesabı açmak gerekmez.
`.env.example`, Technical Plan §12'de kabul edilmiş değişkenlerin yalnızca adlarını ve
boş değerlerini içerir. Bunlar henüz uygulamada okunmaz; gerçek değerler ilgili kartlarda
yerel `.env.local` veya hosting ayarlarına girilir. `.env.local` ve diğer secret dosyaları
Git dışında tutulur. `NEXT_PUBLIC_` öneki olan değişkenler tarayıcıya açılabilir;
secret değişkenlere bu önek verilmez.

## Doğrulama komutları

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

| Komut | Görevi |
| --- | --- |
| `npm run dev` | Değişiklikleri geliştirme sırasında yeniden derleyen yerel sunucuyu açar. |
| `npm run lint` | Next.js/React/TypeScript kurallarını ESLint ile denetler; uyarıda da başarısız olur. |
| `npm run typecheck` | Next.js rota tiplerini üretir ve TypeScript tiplerini çıktı dosyası oluşturmadan denetler; ilk build'den önce de çalışır. |
| `npm test` / `npm run test` | Vitest testlerini bir kez çalıştırır ve çıkar. |
| `npm run build` | Production için optimize edilmiş uygulamayı `.next` altında üretir. |
| `npm start` | Önceden başarılı build alınmış uygulamayı yerelde production modunda açar. |

Production denemesi için geliştirme sunucusunu durdurduktan sonra:

```sh
npm run build
npm start
```

Testler, başlangıç ekranındaki pilot sınırlarını, başlama bağlantısının mevcut bir bölüme
gitmesini ve henüz plan üretilemediği bilgisini kontrol eder. Henüz async olmayan sayfa
bileşeni Vitest + React Testing Library ile test edilir; bu test gerçek Next.js sunucusunun
veya gelecekteki async Server Component davranışının yerine geçmez.

Tarayıcı kontrolü: ana sayfayı masaüstünde ve mobil genişlikte açın; başlık, dört pilot
sınırı ve çağrının okunabildiğini, yatay taşma olmadığını kontrol edin. Çağrıya tıklayın:
aynı sayfadaki pilot bölümüne gitmelidir. Var olmayan bir URL'nin 404 vermesi beklenir.
KBN-001 kanıtları [docs/kbn-001-verification.md](docs/kbn-001-verification.md) içinde tutulur.

## Dosyalar ve sınırlar

- `app/page.tsx`: `/` sayfası, pilot metni ve aynı sayfadaki pilot bölümüne giden başlama bağlantısı.
- `app/layout.tsx`: ortak HTML iskeleti, Türkçe dil bildirimi ve sayfa metadata'sı.
- `app/globals.css`: yalnız bu başlangıç ekranının responsive görünümü ve klavye odak stilleri.
- `tests/home.test.tsx`: pilot kapsamı ve çağrı davranışının temel testleri.
- `vitest.config.mts`: test ortamı ve test dosyalarının konumu.
- `eslint.config.mjs`, `tsconfig.json`: kod ve tip denetimi.
- `package.json`, `package-lock.json`: komutlar, bağımlılıklar ve `npm ci` için kilitli sürümler.
- `AGENTS.md`, `CLAUDE.md`:
AGENTS.md: Balkan Rehberim'e özel Codex çalışma kuralları + Next.js tarafından yönetilen agent notları.( Next.js geliştirme sunucusunun otomatik ürettiği, kurulu sürümün yerel belgelerine yönlendiren araç notları.)
CLAUDE.md: AGENTS.md'ye yönlendirme. Next.js geliştirme sunucusunun otomatik ürettiği, kurulu sürümün yerel belgelerine yönlendiren araç notları.


Sürüm uyumluluğu: Next.js 16.3.5, React 19.3.0, TypeScript 6.0.3 ve Vitest 5.0.1
kilitlenmiştir. Mevcut Next.js lint eklentilerinin peer aralığı nedeniyle ESLint 9.39.5
kullanılır; npm bu sürüm için destek sonu uyarısı verir. ESLint 10 bu bağımlılık ağacıyla
uyumlu değildir. TypeScript 7 de mevcut TypeScript lint parser'ı tarafından desteklenmez.
`lint` uygulama, test ve kökteki yapılandırma dosyalarını açıkça tarar; bağımlılıkları
ve üretilmiş dosyaları taramaz.

`app/page.tsx` ve `app/layout.tsx` varsayılan Server Component'tir. State, event handler
ve browser API kullanmadıkları için `"use client"` gerekmez. Bu statik sayfa production
build sırasında önceden üretilebilir. Aynı sayfaya bağlantı için normal `<a>` yeterlidir.

KBN-001'de Route Handler yoktur: veri alan, kaydeden veya dış servis çağıran bir işlem
bulunmaz. İlgili sonraki kartlarda HTTP uçları aynı repository'de `app/api/.../route.ts`
dosyalarında yer alabilir; bağımsız TypeScript modülleri iş kurallarını barındırır.
Bu, ayrı Express/FastAPI servisi veya ikinci deployment gerektirmez (ADR-001).

Auth, database/Supabase, AI, gerçek form, CMS, monorepo, tasarım sistemi ve veri
sözleşmelerinin kod karşılıkları bu karta dahil değildir. Başlama bağlantısı plan üretmez;
bu durum arayüzde açıkça belirtilir. Hosting/preview/production kurulumu yapılmamıştır;
ADR-012'deki kabul edilmiş hedef korunur.

## Kabul edilmiş kaynaklar

Kaynaklar repository içinde "sources" dosyasında  asıl dosya adlarıyla korunur; ikinci bir kopya veya yeni
bir mimari baseline oluşturulmaz.

- [Kanban kartları — KBN-001](sources/Balkan_Rehberim_Kanban_Kartlari_v1_0.md): kapsam, kabul ölçütleri ve öğrenme hedefi.
- [Technical Plan](sources/technical-plan_bfr_canban.md): özellikle §2–4 mimari, §11 test, §12 deployment, §14 gerekçe ve §15 kapsam dışı işler.
- [Decision Log](sources/decision-log_bfr_cnbn.md): özellikle ADR-001 tek repo, ADR-011 test stratejisi ve ADR-012 ortam/deployment sınırları.
- [Data Contracts](sources/data-contracts_bfr_canban.md): kabul edilmiş baseline'ın parçası; bu kartta kod şemalarına dönüştürülmez.

Eski belge gövdelerinde geçen `technical-plan(6).md`, `decision-log(4).md` ve
`data-contracts(4).md` gibi tarihsel dosya adları yukarıdaki mevcut kaynaklara karşılık
gelir; bu eski adlarla yeni dosya oluşturulmaz. KBN-001'i engelleyen mimari çelişki
saptanmadı. **ADR değişikliği yok. KBN-002 başlatılmadı.**
