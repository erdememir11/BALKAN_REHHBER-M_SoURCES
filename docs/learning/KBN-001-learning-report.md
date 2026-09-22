# KBN-001 — Repository'yi kur ve yerel başlangıç ekranını aç

## Kartın büyük resimdeki yeri

**Önce:** Repository'de proje kararları ve Kanban belgeleri vardı; çalıştırılabilir web uygulaması yoktu.

**Bu kart:** Next.js App Router + React + TypeScript tabanını, responsive başlangıç ekranını, tekrarlanabilir kurulum komutlarını ve temel doğrulama katmanlarını ekledi.

**Sonra:** Yeni sayfalar ve gerektiğinde aynı repository içindeki Route Handler'lar güvenli bir temel üzerinde geliştirilebilir. Auth, database, AI, gerçek form ve deployment ise bu kartta özellikle yapılmadı.

`Kullanıcı → app/page.tsx → statik başlangıç ekranı`

Bu kartta API veya database akışı yoktur.

## MUTLAKA BİLMELİYİM

### 1. App Router'da `page`, `layout` ve Route Handler farklı işler yapar

**Bu nedir?** App Router, dosya konumundan uygulama rotaları üretir. `app/page.tsx` kök URL'yi (`/`), `app/layout.tsx` bütün sayfaların ortak HTML iskeletini oluşturur. Route Handler ise `app/api/.../route.ts` altında HTTP isteklerini karşılayan sunucu API'sidir.

**Neden önemli?** Kullanıcı arayüzü ile güvenilir sunucu işlemini aynı şey sanmamayı sağlar. Sayfa eklemek için ayrı backend gerekmez; fakat secret, doğrulama veya kayıt işlemi gerektiğinde yalnız tarayıcı koduna güvenilmez.

**Balkan Rehberim'de nerede?** `HomePage`, `app/page.tsx` içinde pilot kapsamını gösterir. `RootLayout`, `app/layout.tsx` içinde `lang="tr"`, metadata ve ortak `body` yapısını sağlar. KBN-001'de Route Handler yoktur; çünkü veri alan, kaydeden veya dış servis çağıran işlem yoktur.

**Anlamazsam neyi yanlış yaparım?** Basit bir sayfa için gereksiz API kurabilir veya gelecekte gizli anahtar gerektiren işi yanlışlıkla client tarafına koyabilirim.

### 2. Server Component varsayılandır; Client Component yalnız tarayıcı etkileşimi gerektiğinde eklenir

**Bu nedir?** `app/page.tsx` ve `app/layout.tsx`, başlarında `"use client"` bulunmadığı için Server Component'tir. Client Component; state, event handler veya browser API gibi tarayıcıda çalışması gereken davranışlarda kullanılır.

**Neden önemli?** Server Component gereksiz JavaScript'i tarayıcıya göndermez ve ileride server-only verilerin istemci paketine sızmasını önleyen doğru sınırı kurar.

**Balkan Rehberim'de nerede?** Sayfa yalnız JSX üretir. Başlama çağrısı gerçek bir form açmaz; normal HTML bağlantısıyla mevcut bölüme gider:

~~~tsx
<a href="#pilot-kapsami">Plan oluşturmaya başla</a>
~~~

Bu nedenle state, click handler veya `"use client"` gerekmemiştir. Production build'in `/` rotasını statik üretmesi de bu sade yapıyla uyumludur.

**Anlamazsam neyi yanlış yaparım?** “Ekranda görünüyor, öyleyse client component olmalı” diyerek gereksiz client bundle oluşturabilir veya server-only kodu yanlış katmana taşıyabilirim.

### 3. Tek repository kararı, bütün özelliklerin tek dosyada olması demek değildir

**Bu nedir?** ADR-001, frontend ve ince backend'in tek Next.js + TypeScript projesinde bulunmasını seçer. Gelecekte Route Handler'lar aynı repository'de olacak; iş kuralları ise framework dosyalarına gömülmeden bağımsız TypeScript modüllerinde tutulacaktır.

**Neden önemli?** Ayrı FastAPI/Express servisi, ikinci deployment ve CORS yükü oluşturmadan gerçek frontend–backend sınırı kurulabilir.

**Balkan Rehberim'de nerede?** KBN-001 yalnız proje kabuğunu oluşturdu. `package.json` tek geliştirme, test ve build akışını tanımlar. Ayrı backend, monorepo veya ikinci uygulama eklenmedi.

**Anlamazsam neyi yanlış yaparım?** “Backend lazım” deyip hemen ikinci servis kurabilir veya tersine “tek repo” diyerek bütün güvenlik ve iş kurallarını `page.tsx` içine yazabilirim.

### 4. Kurulumun çalışması ile davranışın doğru olması farklı kanıtlar ister

**Bu nedir?** Lockfile ve `npm ci` aynı bağımlılık ağacını kurmaya; lint kod kurallarını, typecheck tipleri, unit/component testi görünür davranışı, production build ise uygulamanın üretim için derlenebildiğini kontrol etmeye yarar.

**Neden önemli?** Tek bir başarılı komut diğer kontrollerin yerini tutmaz. Örneğin build geçebilir ama çağrı yanlış bölüme bağlanmış olabilir.

**Balkan Rehberim'de nerede?** `tests/home.test.tsx` iki davranışı kontrol eder: dört pilot sınırının görünmesi ve çağrının `#pilot-kapsami` bölümüne bağlanırken gerçek planlama akışı varmış gibi davranmaması.

**Anlamazsam neyi yanlış yaparım?** “Sayfa açıldı, kart tamamdır” diyerek tip, davranış, responsive görünüm veya temiz kurulum hatalarını kaçırabilirim.

## Testler neyi kanıtlıyor?

| Kontrol | Bu kartta verdiği güven |
| --- | --- |
| `npm run lint` | Uygulama, test ve config dosyaları tanımlı kod kurallarını ihlal etmiyor. |
| `npm run typecheck` | Next.js rota tipleri ve TypeScript kullanımı derleme öncesinde tutarlı. |
| `npm test` | Başlangıç ekranının temel kullanıcı sözleşmesi korunuyor; 1 dosyada 2 test var. |
| `npm run build` | Production çıktısı üretilebiliyor; `/` ve `/_not-found` statik oluşturulmuş. |
| Masaüstü/mobil kontrolleri | 1440, 390 ve 320 piksel genişliklerde okunabilirlik ve yatay taşma kontrol edilmiş. |

Bu sonuçlar `docs/kbn-001-verification.md` içindeki kayıtlı kanıta dayanıyor. Raporda temiz `npm ci`, lint, typecheck, test ve build için PASS yazıyor. Ancak repository'de bağımsız CI çalışma bağlantısı veya ham terminal logu bulunmadığından, bu Learning Report hazırlanırken testlerin yeniden çalıştırıldığını söyleyemem.

## En çok karıştırabileceğim noktalar

1. **Server Component ile Route Handler aynı şey değildir.** İlki UI üretebilir; ikincisi bir HTTP endpoint'idir.
2. **Başlama çağrısı plan oluşturmuyor.** Yalnızca aynı sayfadaki pilot kapsamına gidiyor; test özellikle form bulunmadığını doğruluyor.
3. **`.env.example` içindeki değişken adları entegrasyonların yapıldığı anlamına gelmez.** Değerler boştur; Auth, Supabase ve OpenAI bu kartta kullanılmıyor.

## Bozulursa ilk nereye bakacağım?

- Sayfa içeriği veya bağlantı yanlışsa → `app/page.tsx` ve `tests/home.test.tsx`
- Ortak başlık, dil veya metadata yanlışsa → `app/layout.tsx`
- Mobilde taşma veya görünüm sorunu varsa → `app/globals.css` içindeki 760 px ve 360 px media query'leri
- Kurulum, tip veya build bozulursa → `package.json` script'leri, `package-lock.json` ve ilgili komutun ilk hata çıktısı

## Bilgi kontrolü

1. `HomePage` neden `"use client"` kullanmıyor? Hangi değişiklik bunu gerekli hale getirebilirdi?
2. “Plan oluşturmaya başla” bağlantısının testte bir forma değil `#pilot-kapsami` bölümüne gitmesi neden kapsam disiplini açısından önemlidir?
3. Gelecekte OpenAI çağrısı eklendiğinde neden doğrudan `app/page.tsx` içindeki tarayıcı kodundan yapılmamalıdır? Hangi Next.js parçası HTTP sınırını kurabilir?
4. `npm run build` başarılıyken `tests/home.test.tsx` neden yine de gereklidir?

## Cevap Anahtarı

1. Sayfa state, event handler veya browser API kullanmıyor; statik JSX üretiyor. Örneğin client-side state veya bir click handler gerekse ilgili etkileşimli parça Client Component olabilirdi.
2. KBN-001 gerçek planlama formunu kapsam dışı bırakıyor. Bağlantının mevcut bilgi bölümüne gitmesi, yapılmamış özelliği yapılmış gibi göstermeden çalışan bir çağrı sunuyor.
3. Gizli anahtar client bundle'da açığa çıkar ve sunucu doğrulaması atlanabilir. HTTP sınırı aynı projedeki `app/api/.../route.ts` Route Handler ile kurulabilir; iş mantığı bağımsız modülde tutulmalıdır.
4. Build derlenebilirliği gösterir; kullanıcıya doğru pilot bilgisinin verildiğini, bağlantının doğru hedefe gittiğini ve sahte form olmadığını tek başına kanıtlamaz.

## Bu kartı öğrenme açısından kapatabilmem için...

- [ ] `page`, `layout`, Server Component, Client Component ve Route Handler rollerini kendi cümlelerimle açıklayabiliyorum.
- [ ] `HomePage` için neden `"use client"` gerekmediğini açıklayabiliyorum.
- [ ] Tek repository ile “bütün kodu tek katmana koymak” arasındaki farkı biliyorum.
- [ ] Test, typecheck ve build'in farklı hangi hataları yakaladığını açıklayabiliyorum.
- [ ] Temel bir sorun çıktığında ilk bakacağım dosyayı seçebiliyorum.

## Bu karttan yanımda götürmem gerekenler

- App Router'da dosyanın rolü, kodun hangi katmanda çalışacağını belirler.
- Client Component ihtiyaç halinde kullanılır; her görünür ekran client olmak zorunda değildir.
- Tek repo, frontend ve ince backend'i birleştirir ama sorumluluk sınırlarını kaldırmaz.
- “Çalışıyor” kanıtı; temiz kurulum, tip, davranış, build ve görünüm kontrollerinin birlikte değerlendirilmesidir.
