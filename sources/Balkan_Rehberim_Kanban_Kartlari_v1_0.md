# Balkan Rehberim — Kanban Çalışma Sistemi ve MVP Kartları

- **Belge sürümü:** 1.0
- **Hazırlanma tarihi:** 5 Eylül 2026
- **Durum:** Codex uygulamasına hazır başlangıç backlog'u
- **Kapasite:** Tek geliştirici + AI/Codex, haftada 20–25 saat
- **Bütçe:** Altyapı + AI toplamı en fazla 10 USD/ay; AI uygulama bütçesi başlangıçta 7 USD/ay
- **Pilot:** Arnavutluk + Karadağ, 4–6 gün, çift + kiralık araç

## 1. Kaynak ve karar hiyerarşisi

Bu Kanban sistemi aşağıdaki kabul edilmiş baseline'a dayanır:

1. `Balkan_Rehberim_bfr_canban.docx`, Bölüm 07: Kanban çalışma kuralları.
2. `technical-plan_bfr_canban.md`: sistem bileşenleri, veri akışı, güvenlik, test ve deployment sınırları.
3. `decision-log_bfr_cnbn.md`: ADR-001–ADR-023 kararları ve yeniden değerlendirme koşulları.
4. `data-contracts_bfr_canban.md`: domain, API, AI, snapshot, hata ve saklama sözleşmeleri.

Not: İstekte “Vision Log” olarak anılan kaynak, yüklenen teknik karar günlüğü `decision-log_bfr_cnbn.md` olarak yorumlanmıştır.

Codex repository ile bu kaynaklar arasında çelişki görürse kod yazmayı durdurur; seçenekleri ve etkilerini bildirir. Önemli teknoloji veya mimari değişiklik ancak ilgili ADR yeniden açılıp üç teknik belge birlikte güncellendikten sonra uygulanabilir.

## 2. Panonun çalışma kuralları

| Sütun | Anlam | WIP sınırı |
| --- | --- | ---: |
| Fikir Havuzu | Öncelik sırası belli, henüz aktif sıraya alınmamış kartlar | Sınırsız |
| Hazır | Bağımlılıkları tamamlanmış, kapsamı ve kabul ölçütü net sıradaki kartlar | 5 |
| Yapılıyor | Şu anda uygulanan tek ana kart | 1 |
| Test / İnceleme | Test, diff ve öğrenme kontrolü bekleyen kartlar | Bitene kadar burada kalır |
| Tamamlandı | Ürün çıktısı, test ve öğrenme kanıtı bulunan kartlar | Sınırsız |
| Ertelendi / İptal | Şu an değer üretmeyen veya kapsamdan çıkarılan kartlar | Gerekçe zorunlu |

Ek kurallar:

- Bir kart birkaç saat ile en fazla birkaç günlük büyüklükte tutulur. Üç iş gününü aşacağı anlaşılırsa çalışmaya devam etmeden bölünür.
- Aynı anda yalnız bir kart `Yapılıyor` olabilir. Codex bir sonraki karta kendiliğinden geçmez.
- Her kart kısa ömürlü ayrı bir feature branch üzerinde uygulanır; teknoloji katmanları için kalıcı frontend/backend branch'leri açılmaz.
- Her kart mümkün olduğunca frontend + backend + veri + test boyunca çalışan dikey bir sonuç üretir. İlk iskelet ve sözleşme kartları bunun kabul edilmiş istisnasıdır.
- Test edilmemiş, diff'i incelenmemiş veya öğrenme hedefi açıklanamayan kart `Tamamlandı` sayılmaz.
- Yeni fikir aktif kartın kapsamına eklenmez; Fikir Havuzu'na ayrı kayıt olarak girer.
- Haftalık değerlendirmede backlog sırası kanıta göre değişebilir; ancak baseline mimari kanıtsız değiştirilmez.

## 3. Definition of Ready

Bir kart yalnız şu koşullarda `Hazır` sütununa taşınır:

- Bağımlılıklar ve uygulanma sırası bellidir; önceki kart tamamlanmadan bağımlı karta başlanmayacağı açıktır.
- Tek görünür sonuç ve kullanıcı/ürün değeri yazılıdır.
- Kapsam içi ve kapsam dışı maddeler nettir.
- İlgili contract bölümleri ve ADR'ler belirtilmiştir.
- Ana senaryo, en az bir hata senaryosu ve çalıştırılacak testler bellidir.
- Gerekli dış erişimler ve secret'lar tanımlıdır; gerçek değerler karta veya repository'ye yazılmaz.
- Kart üç iş gününü aşmayacak büyüklüktedir; aşıyorsa bölünmüştür.

## 4. Definition of Done

Bir kart yalnız şu koşulların tamamıyla `Tamamlandı` olur:

- Kartın görünür ürün sonucu yerelde veya hedef ortamda çalışır.
- Kabul ölçütlerinin tamamı karşılanır; ana ve hata senaryoları denenir.
- İlgili typecheck, lint, unit, integration, RLS, component veya E2E testleri geçer.
- Test çıktısı, ekran görüntüsü, URL veya tekrarlanabilir komut kart kanıtına eklenir.
- Diff yalnız kart kapsamındaki değişiklikleri içerir; gizli anahtar ve kişisel veri içermez.
- Kritik kod, veri akışı ve hata halinde ilk bakılacak yer geliştirici tarafından kendi cümleleriyle açıklanabilir.
- Mimari karar değişmediyse “ADR değişikliği yok” kaydı düşülür; değiştiyse ilgili belgeler önce güncellenir.
- Branch/commit/PR kararı kullanıcı tarafından verilir; Codex bir sonraki kartı başlatmaz.

## 5. Başlangıç panosu

`Yapılıyor` sütunu bilinçli olarak boştur. İlk uygulama oturumunda yalnız KBN-001 seçilmelidir.

| Sıra | Kart | Durum | Zaman kutusu | Bağımlılık |
| ---: | --- | --- | --- | --- |
| 1 | KBN-001 — Repository'yi kur ve yerel başlangıç ekranını aç | Hazır | 0,5–1 gün | Yok |
| 2 | KBN-002 — MVP sözleşmelerini çalışan TypeScript şemalarına dönüştür | Fikir Havuzu | 1–2 gün | KBN-001 |
| 3 | KBN-003 — Doğrulanmış pilot içerik çekirdeğini denetle ve kapsamı göster | Fikir Havuzu | 1–2 gün | KBN-002 |
| 4 | KBN-004 — E-posta koduyla giriş yap ve oturumu koru | Fikir Havuzu | 1–2 gün | KBN-001 |
| 5 | KBN-005 — Giriş yapan kullanıcıya taslak plan oluştur, listele ve yeniden aç | Fikir Havuzu | 1–2 gün | KBN-002, KBN-004 |
| 6 | KBN-006 — Koşullu planlama sorularını ortak catalog'dan çalıştır | Fikir Havuzu | 2–3 gün | KBN-003, KBN-005 |
| 7 | KBN-007 — Cevapları revision korumalı otomatik kaydet | Fikir Havuzu | 1–2 gün | KBN-006 |
| 8 | KBN-008 — Profili onayla veya kapsam dışı senaryoyu AI'dan önce durdur | Fikir Havuzu | 1–2 gün | KBN-007 |
| 9 | KBN-009 — Mock AI ile rota seçeneklerini üret ve karşılaştır | Fikir Havuzu | 2–3 gün | KBN-003, KBN-008 |
| 10 | KBN-010 — Rota üretimini kota, rezervasyon ve idempotency ile koru | Fikir Havuzu | 2–3 gün | KBN-009 |
| 11 | KBN-011 — Gerçek AI ile güvenli rota önerisi göster | Fikir Havuzu | 1–2 gün | KBN-010 |
| 12 | KBN-012 — Kullanıcının rota seçimini doğrula ve sakla | Fikir Havuzu | 0,5–1 gün | KBN-011 |
| 13 | KBN-013 — Mock AI ile ayrıntılı planı üret ve üç bölümde göster | Fikir Havuzu | 2–3 gün | KBN-012 |
| 14 | KBN-014 — Gerçek AI ile doğrulanmış ayrıntılı planı oluştur | Fikir Havuzu | 2–3 gün | KBN-013 |
| 15 | KBN-015 — Planı AI çağrısı yapmadan yeniden aç | Fikir Havuzu | 1–2 gün | KBN-014 |
| 16 | KBN-016 — Profil sonrası cevap değişikliğini etkisine göre güvenle uygula | Fikir Havuzu | 1–2 gün | KBN-015 |
| 17 | KBN-017 — Plan geri bildirimini oluştur ve güncelle | Fikir Havuzu | 0,5–1 gün | KBN-014 |
| 18 | KBN-018 — Planı veya hesabı güvenli biçimde sil | Fikir Havuzu | 1–2 gün | KBN-005, KBN-017 |
| 19 | KBN-019 — Ana akışın yüklenme, boş sonuç ve hata kurtarmalarını tamamla | Fikir Havuzu | 1–2 gün | KBN-016, KBN-018 |
| 20 | KBN-020 — Üretim kayıtlarını 35 gün sonunda temizle ve log gizliliğini doğrula | Fikir Havuzu | 1 gün | KBN-010, KBN-018 |
| 21 | KBN-021 — Public MVP güvenlik sınırlarını uçtan uca sertleştir | Fikir Havuzu | 1–2 gün | KBN-019, KBN-020 |
| 22 | KBN-022 — 4–6 günlük pilot içerik kapsamını release'e hazırla | Fikir Havuzu | 2–3 gün; gerekirse süre başına böl | KBN-003, KBN-014 |
| 23 | KBN-023 — Ana akışı mobil ve masaüstünde otomatik doğrula | Fikir Havuzu | 1–2 gün | KBN-019, KBN-021, KBN-022 |
| 24 | KBN-024 — Preview ortamını production verisinden ayırarak yayınla | Fikir Havuzu | 1 gün | KBN-023 |
| 25 | KBN-025 — Gerçek AI eval'ini, maliyeti ve production-benzeri ortamı doğrula | Fikir Havuzu | 1–2 gün | KBN-022, KBN-024 |
| 26 | KBN-026 — Public MVP'yi yayınla ve ilk gerçek kullanım kanıtını topla | Fikir Havuzu | 1–2 gün | KBN-025 |

> **Sıra notu:** KBN-003 ile KBN-004 birbirinden bağımsızdır; fakat WIP=1 olduğu için paralel uygulanmaz. KBN-003, ilk dikey rota diliminin gerçek içerik bağımlılığını erken görünür kılmak amacıyla öne alınmıştır.

## 6. Kanban kartları

### KBN-001 — Repository'yi kur ve yerel başlangıç ekranını aç

- **Durum:** Hazır
- **Zaman kutusu:** 0,5–1 gün
- **Branch önerisi:** `feat/kbn-001-repo-shell`
- **Görünür çıktı:** Next.js uygulaması yerelde açılır; Balkan Rehberim başlangıç ekranı pilot kapsamı ve “Plan oluşturmaya başla” çağrısını gösterir.
- **Kullanıcı / ürün değeri:** Ürün fikri çalıştırılabilir bir web uygulamasına dönüşür; sonraki kartların tek repository ve tek deployment sınırı oluşur.
- **Kapsam:** Next.js App Router + React + TypeScript; package lock; lint, typecheck ve Vitest temel komutları; basit responsive açılış ekranı; README'de kurulum; kabul edilmiş üç teknik belgenin repository içinde referanslanması.
- **Kapsam dışı:** Auth, database, gerçek form, AI, tasarım sistemi, CMS, ayrı backend, monorepo.
- **Tamamlanma ölçütleri:** Temiz kurulumdan sonra uygulama tek komutla açılır; başlangıç ekranı masaüstü ve mobil genişlikte okunur; server/client sınırı gereksiz client component oluşturmadan korunur; `.env.example` yalnız değişken adlarını içerir ve secret içermez.
- **Test / kanıt:** `lint`, `typecheck`, temel unit testi ve production build geçer; yerel ekran görüntüsü; README adımları temiz bir kurulumda doğrulanır.
- **Öğrenme hedefi:** Next.js App Router'ın sayfa, server component, client component ve Route Handler rollerini açıklayabilmek.
- **Kaynaklar:** Technical Plan §2–4, §11–12, §14–15; ADR-001, ADR-011, ADR-012.

### KBN-002 — MVP sözleşmelerini çalışan TypeScript şemalarına dönüştür

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-002-domain-contracts`
- **Görünür çıktı:** Örnek geçerli ve geçersiz fixture'lar tek test komutunda kabul/reddedilir; contract sürümleri test çıktısında görünür.
- **Kullanıcı / ürün değeri:** Form, API, database ve AI aynı kavramları kullanır; ileride sessiz veri uyuşmazlığı oluşmaz.
- **Kapsam:** Paylaşılan `QuestionCatalog`, `PlanAnswers`, `TravelProfileSnapshot`, `Feedback` ve `ApiError` şemaları; ortak sürüm sabitleri; unknown-field reddi; temel contract fixture testleri. Route/detail AI ve hydrated snapshot şemaları ilgili dikey üretim kartlarında eklenir.
- **Kapsam dışı:** UI, database migration, gerçek içerik, OpenAI çağrısı, ikinci `question-catalog.md`, frontend/backend için ayrı enum listeleri.
- **Tamamlanma ölçütleri:** Bu kartın kapsadığı Data Contracts required/conditional/enum/uzunluk/dizi sınırları machine-readable'dır; `Plan.status` içinde `failed` yoktur; frontend ve backend ikinci enum/soru listesi oluşturmaz.
- **Test / kanıt:** Kapsanan her ana contract için en az bir geçerli ve bir geçersiz fixture; unknown field, yanlış enum ve 7 günlük süre reddedilir; typecheck ve unit test geçer.
- **Öğrenme hedefi:** TypeScript tipi ile runtime validation arasındaki farkı ve tek kaynaklı contract'ın veri akışındaki rolünü açıklayabilmek.
- **Kaynaklar:** Data Contracts §3, §6–10, §12, §15; ADR-004, ADR-004.1, ADR-015–ADR-019, ADR-022–ADR-023.

### KBN-003 — Doğrulanmış pilot içerik çekirdeğini denetle ve kapsamı göster

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-003-verified-content-core`
- **Görünür çıktı:** Başlangıç ekranı server-only doğrulanmış kayıtlardan “Arnavutluk + Karadağ / 4–6 gün / kiralık araç” destek kapsamını gösterir; build içerik bozuksa durur.
- **Kullanıcı / ürün değeri:** Ürünün gerçek kaynağının AI hafızası değil, insan kontrolündeki içerik olduğu ilk çalışan dilimde kanıtlanır.
- **Kapsam:** Server-only JSON dizin yapısı; discriminated content şemaları; stable location kayıtları; en az bir 5 günlük golden-path test paketi; ID/referans, koordinat, HTTPS Maps URL hostu, kaynak URL, tarih, safety-critical ve content version kontrolü; server tarafında güvenli özet üretimi.
- **Kapsam dışı:** Bütün 4 ve 6 günlük production içeriğini tamamlama, CMS, veritabanı içerik tabloları, vector DB, Maps API, canlı fiyat/saat/doluluk.
- **Tamamlanma ölçütleri:** İçerik client bundle'a girmez; her referans doğru türde stable ID'ye bağlanır; safety-critical kayıt uyarısız geçemez; bozuk link/tarih/ID build'i kırar; kaynak URL'leri kullanıcıya veya AI input'una aktarılmaz.
- **Test / kanıt:** Geçerli golden-path bundle geçer; duplicate ID, yanlış type ref, bozuk Maps URL, gelecek tarih ve eksik safety warning fixture'ları reddedilir; production build geçer.
- **Öğrenme hedefi:** Verified source, AI seçimi ve hydrate edilmiş kullanıcı çıktısı arasındaki güven sınırını açıklayabilmek.
- **Kaynaklar:** Technical Plan §7–8, §10–11; Data Contracts §3 `VerifiedContentRecord`, §4, §9–10; ADR-005, ADR-008, ADR-019.

### KBN-004 — E-posta koduyla giriş yap ve oturumu koru

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-004-email-otp`
- **Görünür çıktı:** Kullanıcı e-postasına gelen altı haneli kodu girerek oturum açar; sayfa yenilendiğinde oturumu korunur ve çıkış yapabilir.
- **Kullanıcı / ürün değeri:** Taslak ve planlar doğrulanmış kullanıcıya bağlanabilir.
- **Kapsam:** Supabase Auth OTP; SSR cookie oturumu; e-posta ve kod ekranları; gönderim bekleme/hata/cooldown durumları; route koruması; local/development SMTP yapılandırması.
- **Kapsam dışı:** Sosyal giriş, parola, gelişmiş profil, rol sistemi, ilk günden zorunlu CAPTCHA, public Resend domain kurulumu.
- **Tamamlanma ölçütleri:** Auth olmayan kullanıcı korumalı alana erişemez; `user_id` yalnız oturumdan gelir; e-posta plan JSON'una veya loga yazılmaz; service-role ve OpenAI anahtarları browser bundle'a girmez.
- **Test / kanıt:** Auth UI component testleri; oturumsuz korumalı rota testi; giriş/yenileme/çıkış smoke testi; secret scan.
- **Öğrenme hedefi:** Authentication, session ve authorization farkını açıklayabilmek.
- **Kaynaklar:** Technical Plan §5, §10, §12; ADR-002, ADR-010, ADR-012.

### KBN-005 — Giriş yapan kullanıcıya taslak plan oluştur, listele ve yeniden aç

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-005-plan-drafts`
- **Görünür çıktı:** Kullanıcı yeni boş plan oluşturur, kendi taslaklarını listeler ve sayfayı kapatıp açtıktan sonra taslağı yeniden görür.
- **Kullanıcı / ürün değeri:** Plan cihaz oturumuna bağlı geçici veri olmaktan çıkar; kullanıcı kaldığı yerden devam edebilir.
- **Kapsam:** `plans` migration'ı; başlangıç `status=draft`, `answers.revision=0`; RLS; `POST /api/plans`, `GET /api/plans`, `GET /api/plans/:id`; sahiplik kontrolü; kullanıcı başına en fazla 3 silinmemiş planın transaction içinde korunması; boş liste ve limit UI'ı.
- **Kapsam dışı:** Sorular, AI snapshot'ları, feedback, arşiv durumu, production deployment.
- **Tamamlanma ölçütleri:** Kullanıcı yalnız kendi planını görür; olmayan ve başka kullanıcı planı aynı `404 PLAN_NOT_FOUND` döndürür; eşzamanlı oluşturma denemeleri 3 plan sınırını aşmaz; yeniden açma AI çağrısı yapmaz.
- **Test / kanıt:** Boş database migration testi; iki kullanıcılı SELECT/UPDATE/DELETE negatif RLS testleri; plan limiti concurrency testi; create/list/reopen integration testi.
- **Öğrenme hedefi:** API sahiplik kontrolü ile RLS'nin neden birlikte kullanıldığını açıklayabilmek.
- **Kaynaklar:** Technical Plan §4 API, §6, §9–11; Data Contracts §2–5, §10–11; ADR-003, ADR-004, ADR-010, ADR-014.

### KBN-006 — Koşullu planlama sorularını ortak catalog'dan çalıştır

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 2–3 gün
- **Branch önerisi:** `feat/kbn-006-question-flow`
- **Görünür çıktı:** Kullanıcı `QuestionCatalog v1.0.0` envanterindeki MVP akışında yalnız kendisi için aktif soruları ve izinli seçenekleri görür; 7–8 gün seçemez.
- **Kullanıcı / ürün değeri:** Gereksiz sorular azaltılır ve planı değiştiren bilgiler anlaşılır bir akışta toplanır.
- **Kapsam:** `QuestionCatalog v1.0.0`; sınırlı `visible_if` grammar'ı; ortak catalog'dan UI render ve backend validation; tüm object alt sözleşmeleri; alan düzeyi güvenli hata mesajları; mobile form davranışı.
- **Kapsam dışı:** Autosave, profil onayı, AI, serbest deneyim metni, ayrı FE/BE enum listeleri.
- **Tamamlanma ölçütleri:** Conditional alanlar doğru açılır/kapanır; dormant cevap UI state'inde kaybolmaz; unknown question/value reddedilir; kesin tarihte süre backend mantığıyla 4–6 gün hesaplanır; esnek ayda duration zorunludur.
- **Test / kanıt:** Görünürlük grammar unit testleri; catalog bütünlük testleri; kritik conditional UI testleri; exact/flexible/unsupported örnekleri.
- **Öğrenme hedefi:** Tek catalog'un UI görünürlüğü ve backend doğrulamasını nasıl aynı tuttuğunu açıklayabilmek.
- **Kaynaklar:** Data Contracts §3 `QuestionCatalog` ve `PlanAnswers`, §10, §12; ADR-016, ADR-017, ADR-020.

### KBN-007 — Cevapları revision korumalı otomatik kaydet

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-007-autosave-revision`
- **Görünür çıktı:** Form cevapları debounce ve adım geçişinde kaydedilir; kullanıcı “Kaydediliyor / Kaydedildi / Kaydedilmedi” durumunu görür.
- **Kullanıcı / ürün değeri:** Ağ hatası veya sekme kapanması cevapları kaybettirmez; eski istek yeni cevabı ezmez.
- **Kapsam:** `PATCH /api/plans/:id/answers`; canonicalization; `expected_revision` compare-and-swap; active/dormant ayrımı; conflict uzlaştırma UI'ı; retry.
- **Kapsam dışı:** Profil sonrası invalidation, AI, offline sync/PWA.
- **Tamamlanma ölçütleri:** Her başarılı yazım revision'ı atomik 1 artırır; gecikmiş istek `409 ANSWERS_VERSION_CONFLICT` ile son canonical snapshot'ı döndürür; validation/ağ hatası bellekteki ve son başarılı DB cevabını korur; dormant cevap hash/profile'a giremez.
- **Test / kanıt:** Sırası ters tamamlanan iki PATCH testi; invalid field testi; save-failure UI testi; reload sonrası son başarılı cevapların görünmesi.
- **Öğrenme hedefi:** Optimistic concurrency ve debounce yarışının veri kaybını nasıl oluşturduğunu açıklayabilmek.
- **Kaynaklar:** Technical Plan §6 veri koruma, §9 hata akışı; Data Contracts §3 `PlanAnswers`, §10–11; ADR-017, ADR-022.

### KBN-008 — Profili onayla veya kapsam dışı senaryoyu AI'dan önce durdur

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-008-profile-confirmation`
- **Görünür çıktı:** Kullanıcı canonical cevaplarından oluşan profil özetini görür ve onaylar; uygun değilse açıklayıcı kapsam mesajıyla cevaplarını düzenleyebilir.
- **Kullanıcı / ürün değeri:** Rota üretilmeden önce sistemin kullanıcıyı doğru anladığı doğrulanır; gereksiz AI maliyeti oluşmaz.
- **Kapsam:** `POST /api/plans/:id/profile/confirm`; tamlık/uygunluk kontrolü; backend-only `TravelProfileSnapshot` builder; `answers_revision`; varış/dönüş saat kesinliğinin kayıpsız taşınması; `status=profile_confirmed`.
- **Kapsam dışı:** Rota üretimi, AI ile profil özeti, 7–8 gün veya çift/kiralık araç dışı akış.
- **Tamamlanma ölçütleri:** Yalnız couple + rental car (ve açık kabul edilmiş undecided varsayımı) geçer; unknown travel time ve 4–6 dışı süre durur; çelişkili konaklama/tarih reddedilir; e-posta/serbest alerji notu AI profiline girmez; uygun olmayan istekte AI çağrısı/run yoktur.
- **Test / kanıt:** Desteklenen 5 günlük profil; solo, own-car, 7 günlük ve çelişkili konaklama negatif testleri; bilinen/bilinmeyen saat snapshot testleri.
- **Öğrenme hedefi:** Form cevabı, canonical cevap ve değişmez profil snapshot'ı ayrımını açıklayabilmek.
- **Kaynaklar:** Technical Plan §1, §4, §9; Data Contracts §3 `TravelProfileSnapshot`, §10–11; ADR-006, ADR-020, ADR-023.

### KBN-009 — Mock AI ile rota seçeneklerini üret ve karşılaştır

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 2–3 gün
- **Branch önerisi:** `feat/kbn-009-mock-route-options`
- **Görünür çıktı:** Golden-path kullanıcı profili için bir ana ve en fazla iki rota seçeneği ortak ölçütlerle karşılaştırılır.
- **Kullanıcı / ürün değeri:** Kullanıcı uzun seçenek listesi yerine gerekçeli rota karar desteği alır.
- **Kapsam:** Deterministik route candidate filter; `RouteRecommendationInput`; mock provider; output schema/domain validator; allowlist; server-side hydration; `RouteOptionsSnapshot`; `POST /routes/generate`; route comparison UI; `NO_SUPPORTED_ROUTE`.
- **Kapsam dışı:** Gerçek OpenAI çağrısı, production kota sistemi, rota seçimi, detay planı.
- **Tamamlanma ölçütleri:** 1–3 benzersiz seçenek ve tam bir recommended/rank=1 vardır; AI output yalnız input route template ID ve izinli reason code kullanır; isim, rota gerçekleri, deneyim özeti ve Maps alanları verified içerikten hydrate edilir; başarısız output önceki snapshot'ı silmez.
- **Test / kanıt:** Bilinmeyen ID, duplicate route, yanlış rank, uygunsuz code ve sıfır aday testleri; route UI component testi; mock integration smoke.
- **Öğrenme hedefi:** Schema validation, domain validation ve hydration'ın neden üç ayrı kontrol olduğunu açıklayabilmek.
- **Kaynaklar:** Technical Plan §7–9; Data Contracts §3 `RouteCandidate`/`RouteOptionsSnapshot`, §6–10; ADR-005–ADR-006, ADR-015, ADR-019.

### KBN-010 — Rota üretimini kota, rezervasyon ve idempotency ile koru

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 2–3 gün
- **Branch önerisi:** `feat/kbn-010-generation-guardrails`
- **Görünür çıktı:** Tekrarlanan üretim isteği mevcut rota sonucunu döndürür; eşzamanlı istek, kota veya bütçe durumu kullanıcıya güvenli mesajla açıklanır.
- **Kullanıcı / ürün değeri:** Çift kayıt ve gereksiz bekleme azalır; public MVP 10 USD sınırı içinde korunur.
- **Kapsam:** `generation_runs` migration; partial unique active-reservation index; canonical input hash; dar transaction içinde kullanıcı/plan-stage/global budget kontrolü; 4/24s, 2/plan-stage/24s, token ve tek retry sınırları; cache-hit; stale-result write guard; güvenli error codes.
- **Kapsam dışı:** Queue, worker, websocket, Redis/cache servisi, çok sağlayıcı failover.
- **Tamamlanma ölçütleri:** Güncel snapshot hash eşleşmesinde yeni run/kota/AI yoktur; aynı active reservation ikinci çağrıya `409 GENERATION_IN_PROGRESS` verir; farklı hash'li concurrency de sınırı aşamaz; stale sonuç snapshot'ı ezmez; run prompt/ham cevap/e-posta içermez.
- **Test / kanıt:** Canonical set-order hash testi; cache-hit testi; aynı/farklı hash concurrency testleri; expired reservation; historical succeeded-not-cache; retry toplam usage; `STALE_GENERATION_INPUT`; bütçe sınırı testleri.
- **Öğrenme hedefi:** Idempotency, cache, reservation ve rate limit kavramlarının farkını açıklayabilmek.
- **Kaynaklar:** Technical Plan §6–7, §9, §13; Data Contracts §3 `GenerationRun`, §10–11; ADR-009, ADR-013, ADR-014.

### KBN-011 — Gerçek AI ile güvenli rota önerisi göster

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-011-live-route-ai`
- **Görünür çıktı:** Giriş yapmış kullanıcı, doğrulanmış adaylardan GPT-5.6 Luna'nın seçtiği ve gerekçelendirdiği rota karşılaştırmasını görür.
- **Kullanıcı / ürün değeri:** Kişiselleştirilmiş rota seçimi gerçek modelle çalışır; gerçekler doğrulanmış içerikten gelmeye devam eder.
- **Kapsam:** Tek `plan-generator` provider modülü; OpenAI Responses API; Structured Outputs; `AI_MODEL_ID`, `service_tier=standard`; prompt version; route token limitleri; bir controlled repair/retry; usage/cost/latency run güncellemesi.
- **Kapsam dışı:** Web/file search, streaming, çoklu sağlayıcı soyutlaması, deterministic fallback, gerçek detail AI.
- **Tamamlanma ölçütleri:** Anahtar yalnız server'dadır; input kişisel veri ve source URL içermez; model URL/koordinat/gerçek üretemez; output KBN-009 validator/hydrator'dan geçmeden kaydedilmez; hata önceki sonuç ve profili korur.
- **Test / kanıt:** Mock CI contract testleri; kontrollü development smoke; run token/maliyet/latency kaydı; prompt/response'un loglarda bulunmadığının kontrolü.
- **Öğrenme hedefi:** Model çağrısı ile ürün güvenilirlik sınırının neden aynı şey olmadığını açıklayabilmek.
- **Kaynaklar:** Technical Plan §7, §10, §13; Data Contracts §6–11; ADR-006, ADR-007, ADR-009, ADR-013–ADR-014.

### KBN-012 — Kullanıcının rota seçimini doğrula ve sakla

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 0,5–1 gün
- **Branch önerisi:** `feat/kbn-012-route-selection`
- **Görünür çıktı:** Kullanıcı bir rota kartını seçer, onaylar ve sayfa yenilendiğinde aynı seçim görünür.
- **Kullanıcı / ürün değeri:** Sistem yalnız kullanıcının seçtiği rota için maliyetli ayrıntı üretimine geçer.
- **Kapsam:** `POST /routes/select`; `route_option_id` doğrulaması; `selected_route_option_id`; `status=route_selected`; onay UI'ı; selected option'dan `route_template_id` çözümü.
- **Kapsam dışı:** Manuel rota düzenleme, şehir sürükleme, doğrudan `route_template_id` seçimi, detail üretimi.
- **Tamamlanma ölçütleri:** ID mevcut plan snapshot'ındaki option'lardan biri değilse reddedilir; başka plana ait option sızmaz; seçim atomik saklanır; route option ID ile template ID karıştırılmaz.
- **Test / kanıt:** Geçerli seçim, bilinmeyen option, başka plan option'ı ve reload testleri.
- **Öğrenme hedefi:** Plan içi seçim kimliği ile doğrulanmış içerik kimliğinin farkını açıklayabilmek.
- **Kaynaklar:** Technical Plan §4, §9; Data Contracts §3 `RouteOptionsSnapshot`, §10; ADR-015.

### KBN-013 — Mock AI ile ayrıntılı planı üret ve üç bölümde göster

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 2–3 gün
- **Branch önerisi:** `feat/kbn-013-mock-detailed-plan`
- **Görünür çıktı:** Seçilen 5 günlük golden-path rota, “Genel Bakış”, “Seyahate Çıkmadan Önce” ve “Gün Gün Plan” bölümlerinde; park, yemek, deneyim, kritik bilgi, Maps bağlantısı ve Plan B ile gösterilir.
- **Kullanıcı / ürün değeri:** Ürün vaadinin ana çıktısı gerçek AI maliyeti olmadan uçtan uca görülebilir ve test edilebilir.
- **Kapsam:** Detail candidate filter/day frames; `DetailedTripPlanInput`; mock output; JSON/domain validator; gün/sürüş/gece/varış-dönüş/required-content kuralları; full hydration; `DetailedPlanSnapshot`; responsive plan UI; Maps dış bağlantıları.
- **Kapsam dışı:** Gerçek AI, canlı Maps/traffic/price/hour, rezervasyon, manuel plan editörü.
- **Tamamlanma ölçütleri:** Gün sayısı tamdır; konum değiştiren gün kesintisiz drive chain taşır; gece dağılımı template ile uyumludur; bilinen saatler ihlal edilmez, bilinmeyen saat kesinleştirilmez; Maps URL/tarih/gerçek yalnız hydration'dan gelir; source URL client'a çıkmaz.
- **Test / kanıt:** Unknown/wrong-day ID, eksik safety item, yanlış overnight, kopuk drive chain, time-boundary ve invalid Plan B testleri; plan UI component testi; 5 günlük mock E2E.
- **Öğrenme hedefi:** ID-only AI çıktısının render-complete snapshot'a nasıl dönüştüğünü çizebilmek.
- **Kaynaklar:** Technical Plan §7–9, §11; Data Contracts §3 `DetailedPlanSnapshot`, §7.2, §8.2, §9–11; ADR-006, ADR-008, ADR-019, ADR-023.

### KBN-014 — Gerçek AI ile doğrulanmış ayrıntılı planı oluştur

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 2–3 gün
- **Branch önerisi:** `feat/kbn-014-live-detail-ai`
- **Görünür çıktı:** Kullanıcı seçtiği rota için gerçek AI tarafından düzenlenmiş, server tarafından doğrulanmış ve hydrate edilmiş ayrıntılı planı görür.
- **Kullanıcı / ürün değeri:** Kişiye göre gün sırası, gerekçe ve Plan B üretilirken uydurma yer/URL/gerçek plana giremez.
- **Kapsam:** `POST /detail/generate`; detail prompt/input/output sürümleri; 24k/8k token limitleri; KBN-010 kota/idempotency; bir repair/retry; `generation` provenance; atomik snapshot write.
- **Kapsam dışı:** Seçilmemiş rota detayı, sınırsız regenerate, deterministic fallback, web search, async queue.
- **Tamamlanma ölçütleri:** Yalnız seçili route option/template kullanılır; output KBN-013 domain validator'ı geçmeden kaydedilmez; tam AI ham cevabı saklanmaz; başarısızlık `Plan.status` değerini değiştirmez ve önceki detay varsa silmez; aynı hash ikinci çağrı yapmaz.
- **Test / kanıt:** Mock provider CI integration; development gerçek-model smoke; invalid-then-repair senaryosu; timeout ve persistence failure testleri; snapshot-run provenance eşleşmesi.
- **Öğrenme hedefi:** İki aşamalı üretimin kalite, maliyet ve veri koruma avantajını açıklayabilmek.
- **Kaynaklar:** Technical Plan §7–9, §13; Data Contracts §6–11; ADR-004.1, ADR-006–ADR-007, ADR-009, ADR-014.

### KBN-015 — Planı AI çağrısı yapmadan yeniden aç

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-015-reopen-plan`
- **Görünür çıktı:** Kullanıcı plan listesinden tamamlanmış planını açar ve aynı rota/ayrıntı görünümünü yeni AI çağrısı olmadan görür.
- **Kullanıcı / ürün değeri:** Kaydedilen plan gerçek seyahatte tekrar kullanılabilir; her açılış maliyet üretmez.
- **Kapsam:** Plan status'üne göre devam/okuma yönlendirmesi; render-complete JSONB snapshot okuma; stale schema için güvenli davranış; mevcut başarılı snapshot'ı koruma kontrolleri.
- **Kapsam dışı:** Public paylaşım linki, offline/PWA, manuel gün düzenleme.
- **Tamamlanma ölçütleri:** Reopen sırasında generation run veya provider çağrısı yoktur; aynı doğrulanmış isim/Maps/tarih görünür; taslak doğru adımdan devam eder; başka kullanıcı planı `404` kalır.
- **Test / kanıt:** Provider call-count=0 reopen integration; draft/profile/routes/selected/detail status yönlendirme testleri; iki kullanıcılı E2E.
- **Öğrenme hedefi:** Snapshot saklamanın yeniden üretimden farkını ve JSONB trade-off'unu açıklayabilmek.
- **Kaynaklar:** Technical Plan §6, §9; Data Contracts §2–5; ADR-004, ADR-019.

### KBN-016 — Profil sonrası cevap değişikliğini etkisine göre güvenle uygula

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-016-answer-invalidation`
- **Görünür çıktı:** Kullanıcı onaylı profilindeki cevabı değiştirmek istediğinde hangi sonuçların yenileneceğini görür; açık onaydan sonra doğru aşamaya döner.
- **Kullanıcı / ürün değeri:** Eski cevaplara dayanan rota veya plan yanlışlıkla güncel görünmez; kullanıcı verisi sessizce silinmez.
- **Kapsam:** Staged change UI; impact preview; `acknowledge_invalidation=true`; backend impact recompute; eligibility/route/detail transaction'ları; revision conflict davranışı.
- **Kapsam dışı:** Manual route editor, geçmiş snapshot sürümlerine geri dönüş.
- **Tamamlanma ölçütleri:** Onaysız değişiklik hiçbir snapshot'ı temizlemez; eligibility/route değişikliği draft'a döndürür ve tüm downstream'i temizler; detail değişikliği profile'ı yeniler, rota/seçimi korur, detayı temizler; failure atomik olarak eski başarılı state'i korur.
- **Test / kanıt:** Her impact için integration testi; onaysız ve stale revision negatif testi; UI kayıp etkisi component testi.
- **Öğrenme hedefi:** State transition ile veri invalidation arasındaki ilişkiyi açıklayabilmek.
- **Kaynaklar:** Technical Plan §6; Data Contracts §3 `PlanAnswers`, §10–11; ADR-017, ADR-022.

### KBN-017 — Plan geri bildirimini oluştur ve güncelle

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 0,5–1 gün
- **Branch önerisi:** `feat/kbn-017-plan-feedback`
- **Görünür çıktı:** Ayrıntılı planı gören kullanıcı fayda, güven, uygulanabilirlik, karar yükü ve harici arama ihtiyacı için kısa feedback verir; daha sonra cevabını günceller.
- **Kullanıcı / ürün değeri:** MVP'nin gerçekten karar yükünü azaltıp azaltmadığı ölçülebilir.
- **Kapsam:** `feedback` migration; composite ownership FK; unique `(user_id, plan_id)`; `PUT /feedback` upsert; 1–5 validation; 1000 karakter yorum; form durumları.
- **Kapsam dışı:** Gün/içerik bazlı yorum, sosyal yorum, analytics warehouse.
- **Tamamlanma ölçütleri:** Form yalnız `detail_ready` planda açılır; tekrar gönderim ikinci satır oluşturmaz; `created_at` korunur, `updated_at` değişir; başka kullanıcı planına feedback database düzeyinde reddedilir; comment HTML olarak render edilmez.
- **Test / kanıt:** Create/update upsert testi; rating/comment sınır testleri; composite ownership negatif RLS testi; UI test.
- **Öğrenme hedefi:** Unique constraint, upsert ve composite ownership'ın neden birlikte kullanıldığını açıklayabilmek.
- **Kaynaklar:** Technical Plan §4, §6, §9; Data Contracts §3 `Feedback`, §10; ADR-003, ADR-018.

### KBN-018 — Planı veya hesabı güvenli biçimde sil

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-018-data-deletion`
- **Görünür çıktı:** Kullanıcı kendi planını silebilir; ayrı açık onayla hesabını ve ürün verisini kaldırabilir.
- **Kullanıcı / ürün değeri:** Kullanıcı saklanan kişisel verisi üzerinde kontrol sahibi olur.
- **Kapsam:** `DELETE /api/plans/:id`; feedback cascade; run `plan_id` null; `DELETE /api/account`; sabit confirmation; plan/feedback silme; run `user_id` null; dar service-role auth delete; logout; idempotent güvenli hata.
- **Kapsam dışı:** Soft-delete/arşiv, admin silme, kullanıcı verisi export'u.
- **Tamamlanma ölçütleri:** Kullanıcı başka planı silemez; plan silmek 24 saatlik kota ledger'ını sıfırlamaz; hesap silme tamamlandığında auth session kapanır; service-role normal CRUD'a yayılmaz; kısmi hata `ACCOUNT_DELETION_FAILED` ve kişisel verisiz iz bırakır.
- **Test / kanıt:** Plan+feedback cascade; run nulling; başka kullanıcı negatif testi; account deletion entegrasyonu; tekrar gönderim/idempotency testi.
- **Öğrenme hedefi:** Ürün verisi silme ile operasyonel, kimliksiz maliyet kaydını kısa süre tutma dengesini açıklayabilmek.
- **Kaynaklar:** Technical Plan §4, §6, §10–11; Data Contracts §3 `AccountDeletionRequest`, §10–11; ADR-010, ADR-021.

### KBN-019 — Ana akışın yüklenme, boş sonuç ve hata kurtarmalarını tamamla

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-019-recovery-states`
- **Görünür çıktı:** Kullanıcı her adımda ne olduğunu, verisinin korunup korunmadığını ve güvenle ne yapabileceğini anlar.
- **Kullanıcı / ürün değeri:** Ağ, AI veya veri hatası planı kaybettirmez ve teknik hata metniyle kullanıcıyı yalnız bırakmaz.
- **Kapsam:** Ortak `ApiError`; 401/400/404/409/429/503; loading/empty/unsaved/retry UI; `NO_SUPPORTED_ROUTE`, `INSUFFICIENT_VERIFIED_CONTENT`, schema/ID/day/persistence/timeout durumları; request ID gösterimi gerektiğinde.
- **Kapsam dışı:** Deterministic fallback plan, queue/polling, Sentry.
- **Tamamlanma ölçütleri:** Stack/provider/prompt bilgisi client'a çıkmaz; retryable ayrımı doğru uygulanır; hata hiçbir başarılı answer/snapshot'ı silmez; kayıtlı planlar bütçe durduğunda okunur; teknik olmayan yönlendirici metinler vardır.
- **Test / kanıt:** Her hata ailesi için UI testleri; API error contract testleri; network/timeout/persistence E2E senaryoları.
- **Öğrenme hedefi:** Domain hatası, transport hatası ve kullanıcı kurtarma davranışını ayırabilmek.
- **Kaynaklar:** Technical Plan §1, §9; Data Contracts §10–11; ADR-004.1, ADR-009.

### KBN-020 — Üretim kayıtlarını 35 gün sonunda temizle ve log gizliliğini doğrula

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1 gün
- **Branch önerisi:** `feat/kbn-020-run-retention`
- **Görünür çıktı:** Operasyon kontrolünde yalnız kişisel verisiz run metadatası görülür; süresi dolan kayıtlar tekrarlanabilir görevle silinir.
- **Kullanıcı / ürün değeri:** Maliyet ve hata takibi yapılırken gereksiz kişisel veri uzun süre tutulmaz.
- **Kapsam:** `expires_at=created_at+35 gün`; dar scheduled retention endpoint/function; yetkili server-only erişim; request ID ve güvenli error code log formatı; silme sonucu sayacı.
- **Kapsam dışı:** Genel cron pipeline, background worker, dashboard/admin paneli, Sentry, prompt/response saklama.
- **Tamamlanma ölçütleri:** Browser generation_runs okuyamaz; e-posta, prompt, serbest metin ve plan anlatımı loglarda yoktur; yalnız süresi dolan run'lar silinir; görev tekrar çalıştırılabilir ve production secret ile korunur.
- **Test / kanıt:** 34/35/36 günlük kayıt fixture testi; yetkisiz çağrı testi; log privacy assertion; retention dry-run/real-run smoke.
- **Öğrenme hedefi:** Observability için gerekli minimum veri ile kişisel veri minimizasyonu arasındaki sınırı açıklayabilmek.
- **Kaynaklar:** Technical Plan §4, §6, §12; Data Contracts §3 `GenerationRun`, §4; ADR-009, ADR-013, ADR-021.

### KBN-021 — Public MVP güvenlik sınırlarını uçtan uca sertleştir

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `feat/kbn-021-security-hardening`
- **Görünür çıktı:** Güvenlik kontrolleri altında ana kullanıcı akışı değişmeden çalışır; saldırgan/yanlış istemci çağrıları güvenli biçimde reddedilir.
- **Kullanıcı / ürün değeri:** Public uygulamada plan gizliliği, bütçe ve doğrulanmış içerik güveni korunur.
- **Kapsam:** Origin kontrolü; yalnız JSON state-changing requests; SameSite cookie; CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors; XSS-safe text; strict unknown fields; secret scan; service-role kullanım denetimi; iki kullanıcı negatif senaryoları.
- **Kapsam dışı:** Ödeme güvenliği, dosya tarama, rol/admin sistemi, CAPTCHA'yı kanıt olmadan zorunlu açma.
- **Tamamlanma ölçütleri:** OpenAI/service-role secret client'a ve git'e girmez; başka kullanıcı plan/feedback'i API+RLS ile erişilemez; model HTML'i render edilmez; farklı Origin mutasyonları reddedilir; 404 varlık sızdırmaz.
- **Test / kanıt:** Security header testi; Origin/CSRF negatif testleri; iki kullanıcı CRUD/feedback testleri; build bundle ve git secret scan.
- **Öğrenme hedefi:** Auth, authorization, RLS, CSRF, XSS ve secret yönetiminin farklı riskleri nasıl kapattığını açıklayabilmek.
- **Kaynaklar:** Technical Plan §10–11; Data Contracts §10–11; ADR-003, ADR-010–ADR-011.

### KBN-022 — 4–6 günlük pilot içerik kapsamını release'e hazırla

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 2–3 gün; doğrulama hacmi aşarsa `4 gün`, `5 gün`, `6 gün` olarak üç ayrı içerik kartına bölünür.
- **Branch önerisi:** `content/kbn-022-pilot-coverage`
- **Görünür çıktı:** Uygulamanın desteklediğini söylediği her Arnavutluk + Karadağ 4–6 günlük kombinasyon için en az bir geçerli rota ve yeterli detail paketi vardır; kapsam dışı kombinasyon açıkça durur.
- **Kullanıcı / ürün değeri:** Kullanıcı “destekleniyor” denilen bir profilde sonradan içerik eksikliğiyle karşılaşmaz; yer, park, yemek, deneyim, kritik bilgi ve Plan B güvenilir kaynaktan gelir.
- **Kapsam:** Destek matrisi; her yayınlanan route template için locations, bases, car option, experiences, parking, food, photo, critical info ve gerektiğinde Plan B; source audit; type-specific freshness threshold; safety-critical yeniden doğrulama süresi; golden fixtures.
- **Kapsam dışı:** Bütün olası giriş/çıkış kombinasyonları, canlı bilgi, otomatik scraping, CMS, yeni ülke, 7–8 gün.
- **Tamamlanma ölçütleri:** Destek matrisi ile actual JSON coverage eşleşir; eksik candidate paketinde AI çağrılmaz; her kayıt en az bir source URL ve geçerli `last_verified_at` taşır; safety-critical kayıt release öncesi eşik içinde yeniden doğrulanmıştır; kullanıcıya variability note görünür.
- **Test / kanıt:** 4/5/6 gün için en az bir route+detail fixture; unsupported matrix negatif testleri; tüm content schema/link/ref testleri; editoryal doğrulama checklist'i.
- **Öğrenme hedefi:** Teknik olarak geçerli içerik ile editoryal olarak güvenilir içerik arasındaki farkı açıklayabilmek.
- **Kaynaklar:** Technical Plan §1, §7–8, §11, §16; Data Contracts §3 `VerifiedContentRecord`, §7–11, §14; ADR-005, ADR-008, ADR-019–ADR-020, ADR-023; Decision Log açık karar 2.

### KBN-023 — Ana akışı mobil ve masaüstünde otomatik doğrula

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `test/kbn-023-main-flow-e2e`
- **Görünür çıktı:** Kullanıcı girişten feedback'e kadar ana akışı mobil ve masaüstünde tamamlayabilir; sayfayı kapatıp açınca planı görür.
- **Kullanıcı / ürün değeri:** Birbirinden ayrı çalışan parçaların birlikte gerçek MVP akışını oluşturduğu kanıtlanır.
- **Kapsam:** Playwright mock-AI E2E; OTP test helper; create → questions → autosave → confirm → routes → select → detail → reopen → feedback; mobile viewport; Chromium zorunlu, Firefox/WebKit smoke; kritik accessibility isimleri.
- **Kapsam dışı:** Görsel pixel-perfect test, bütün browser/cihaz matrisi, gerçek AI'yı normal CI'da çağırma.
- **Tamamlanma ölçütleri:** Ana E2E deterministik geçer; reload AI çağırmaz; hata/retry ve başka kullanıcı erişimi en az bir E2E ile doğrulanır; mobilde yatay taşma veya kapalı aksiyon yoktur.
- **Test / kanıt:** CI run bağlantısı/çıktısı; Playwright trace yalnız hata halinde; mobile ve desktop ekran görüntüleri; typecheck/lint/unit/RLS tam geçişi.
- **Öğrenme hedefi:** Unit, integration, RLS ve E2E testlerinin hangi farklı güveni sağladığını açıklayabilmek.
- **Kaynaklar:** Technical Plan §11; ADR-011.

### KBN-024 — Preview ortamını production verisinden ayırarak yayınla

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1 gün
- **Branch önerisi:** `ops/kbn-024-preview-deploy`
- **Görünür çıktı:** Her PR için erişilebilir Vercel preview oluşur; development Supabase ile ana smoke akışı çalışır.
- **Kullanıcı / ürün değeri:** MVP farklı cihazdan incelenebilir ve production verisini riske atmadan test edilebilir.
- **Kapsam:** Vercel Hobby preview; development Supabase; environment ayrımı; migration uygulama adımı; non-production secret'lar; preview smoke; README runbook.
- **Kapsam dışı:** Production database bağlantısı, public release, ticari kullanım, custom observability.
- **Tamamlanma ölçütleri:** Preview production Supabase'e bağlanamaz; env değerleri source control'de değildir; build/test gate başarısızsa deploy geçmez; preview URL'de mock/dev ana akış çalışır.
- **Test / kanıt:** Preview URL; environment mapping checklist; migration smoke; secret scan; deploy log özeti.
- **Öğrenme hedefi:** Local, preview ve production ortamlarının neden ayrı veri ve secret kullandığını açıklayabilmek.
- **Kaynaklar:** Technical Plan §11–12; ADR-011–ADR-012.

### KBN-025 — Gerçek AI eval'ini, maliyeti ve production-benzeri ortamı doğrula

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `test/kbn-025-release-eval`
- **Görünür çıktı:** En az 10 sabit profil senaryosunun kalite, güvenlik, maliyet ve latency raporu; release için açık geçer/kalır kararı.
- **Kullanıcı / ürün değeri:** Public release, modelin şema üretmesinden öte gerçekten uygulanabilir ve güvenli plan verdiğine dair kanıta dayanır.
- **Kapsam:** Küçük versioned eval seti; route çeşitliliği/gerekçe; must-have coverage; gün/süre uygulanabilirliği; invalid ID %0; safety-critical yanlış %0; ortalama maliyet/latency; development Supabase production-benzeri RLS/migration smoke; OpenAI spend alert.
- **Kapsam dışı:** Her commit'te live AI, model sağlayıcı kıyaslaması kanıt olmadan, production kullanıcı verisi.
- **Tamamlanma ölçütleri:** Release eşikleri geçer; plan başı maliyet hedefi izlenir ve 0,05 USD üstü düzenliyse release durur/ADR açılır; tüm run usage alanları doludur; başarısız senaryo ve kalan riskler yazılıdır.
- **Test / kanıt:** Tarihli eval çıktısı; model/prompt/content/contract versions; development smoke sonucu; bütçe uyarısı ekran kanıtı.
- **Öğrenme hedefi:** Deterministik contract testi ile olasılıksal model eval'inin farkını açıklayabilmek.
- **Kaynaklar:** Technical Plan §7, §11, §13, §16; ADR-006–ADR-007, ADR-011, ADR-014.

### KBN-026 — Public MVP'yi yayınla ve ilk gerçek kullanım kanıtını topla

- **Durum:** Fikir Havuzu
- **Zaman kutusu:** 1–2 gün
- **Branch önerisi:** `release/kbn-026-public-mvp`
- **Görünür çıktı:** Balkan Rehberim public HTTPS adresinde açılır; gerçek kullanıcı giriş → plan → feedback ana akışını tamamlar.
- **Kullanıcı / ürün değeri:** Teknik ürün gerçek kullanım ve öğrenme döngüsüne girer.
- **Kapsam:** Production Vercel + production Supabase; Resend Free ve sahip olunan doğrulanmış sender domain; production secrets; privacy/retention açıklaması; migration/export kontrolü; content freshness gate; release checklist; post-deploy smoke; ilk hedef kullanıcı oturumu ve bulgu kaydı.
- **Kapsam dışı:** Reklam/affiliate/ödeme, SLA, paid scale, yeni ülkeler, 7–8 gün, public plan paylaşımı.
- **Tamamlanma ölçütleri:** Typecheck/lint/unit/RLS/mock E2E/live AI smoke/content validation/secret scan geçer; OTP gerçek e-postaya ulaşır; başka kullanıcı erişim testi geçer; kayıtlı plan AI çağrısız açılır; feedback kaydedilir; aylık toplam hedef 10 USD içinde izlenir.
- **Test / kanıt:** Public URL; release commit; production smoke checklist; ilk gerçek kullanıcı akış sonucu; hata ve maliyet kontrol notu.
- **Öğrenme hedefi:** Bir özelliğin kodda bitmesi ile güvenli, gözlemlenebilir ve kullanıcı tarafından denenmiş release olması arasındaki farkı açıklayabilmek.
- **Kaynaklar:** Technical Plan §11–13; Decision Log açık kararlar; ADR-002, ADR-005, ADR-010–ADR-014, ADR-020–ADR-021.

## 7. Release kapıları

KBN-026 başlamadan önce aşağıdakilerin tamamı kanıtlı olmalıdır:

- Typecheck, lint ve unit testler başarılıdır.
- Local Supabase migration ve RLS testleri başarılıdır.
- Kullanıcı A'nın Kullanıcı B verisine erişemediği iki kullanıcılı negatif testle kanıtlanmıştır.
- Mock AI ile girişten feedback'e ana E2E akışı başarılıdır.
- Production-benzeri ortamda en az bir gerçek route + detail AI smoke testi başarılıdır.
- En az 10 sabit profil eval'i kalite sınırlarını karşılar; invalid ID ve safety-critical yanlış oranı %0'dır.
- Tüm verified content dosyaları schema, referans, link ve freshness kontrolünden geçer.
- Resend sender domaini doğrulanmış, production OTP teslimi test edilmiştir.
- Preview ortamı production database'e bağlı değildir.
- Secret taraması temizdir; service-role yalnız dar sunucu modüllerindedir.
- Kullanıcı, plan, stage ve global bütçe kotaları; cache, concurrency, retry ve stale-result senaryoları geçer.
- Hesap silme, run kimliksizleştirme ve 35 günlük retention davranışı doğrulanmıştır.
- Sade gizlilik ve veri saklama açıklaması yayındadır.

## 8. Her kart için Codex çalışma döngüsü

1. Yalnız seçilen kart için kısa ömürlü branch/worktree aç.
2. Repository durumunu üç teknik baseline dosyasıyla karşılaştır.
3. Kartın sistemdeki yerini, değişecek dosyaları, veri akışını, riskleri ve testleri planla.
4. Kullanıcı planı onayladıktan sonra yalnız kart kapsamını uygula.
5. Karttaki testleri, ardından ilgili ortak kalite komutlarını çalıştır.
6. Diff'i kapsam, güvenlik, kişisel veri, gereksiz dependency ve mimari sapma açısından incele.
7. Sonuç, test kanıtı, kalan risk ve öğrenme açıklamasını sun.
8. Kullanıcının commit/push/PR kararını bekle; sonraki karta geçme.

### Codex'e verilecek kopyalanabilir istek

```text
Yalnız KBN-[ID] kartını uygula.

Ana kaynaklar:
- technical-plan_bfr_canban.md
- decision-log_bfr_cnbn.md
- data-contracts_bfr_canban.md
- Balkan_Rehberim_Kanban_Kartlari_v1_0.md içindeki KBN-[ID]

Önce repository ile teknik baseline'ı karşılaştır. Çelişki veya önemli mimari değişiklik ihtiyacı varsa kod yazmadan bildir ve alternatifleri gerekçeleriyle sun.

Sonra kartın sistemdeki yerini; değiştireceğin dosyaları, veri akışını, riskleri ve testleri içeren küçük bir uygulama planı çıkar. Onayladığım kapsamı uygula. Kartın kapsam dışı maddelerini ekleme.

İlgili testleri çalıştır; ana senaryoyu ve en az bir hata senaryosunu doğrula. Sonunda diff özetini, test kanıtını, kalan riskleri ve benim öğrenme hedefim için kısa teknik açıklamayı sun.

Bir sonraki karta geçme. Commit, push veya PR işlemi için benden açık talimat bekle.
```

## 9. MVP sonrası ayrı Fikir Havuzu

Aşağıdakiler mevcut 26 karttan hiçbirine eklenmez ve ilk release'ten önce başlatılmaz:

- 7–8 günlük planlar veya yeni ülkeler
- Çift dışındaki gruplar; kendi araç/toplu taşıma
- Canlı trafik, fiyat, çalışma saati veya doluluk
- Google Maps API veya gömülü harita
- Rezervasyon, ödeme, affiliate veya tur satışı
- Manuel rota/gün editörü
- Public plan paylaşımı
- Offline/PWA senkronizasyonu
- CMS/admin paneli, vector DB, embeddings/RAG
- Queue, websocket, genel background worker veya ayrı cache
- Sentry ya da başka observability ürünü
- Çoklu LLM sağlayıcı failover'ı veya fine-tuning

Bu maddeler yalnız kullanıcı kanıtı veya Decision Log'daki yeniden değerlendirme koşulu oluştuğunda ayrı kart ve gerekiyorsa yeni ADR ile ele alınır.

## 10. Haftalık 15–20 dakikalık kontrol

- Bu hafta kullanıcı açısından çalışan hangi görünür sonuç oluştu?
- Hangi test veya kullanıcı davranışı bunu kanıtlıyor?
- Hangi teknik parçayı artık kendi cümlelerimle açıklayabiliyorum?
- En çok zamanı ne tüketti; sonraki kart küçültülmeli mi?
- Yeni kanıt hangi varsayımı destekledi veya zayıflattı?
- Gelecek haftanın tek görünür sonucu hangi karttır?
- Karar: `DEVAM` / `KAPSAMI KÜÇÜLT` / `YAKLAŞIMI DEĞİŞTİR` / `DURDUR-BEKLET`.
