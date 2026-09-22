# Balkan Rehberim — Teknik Karar Günlüğü

- **Kaynaklar:** `technical-plan(6).md`, `data-contracts(4).md` ve güncel ürün/bilgi mimarisi belgeleri
- **Kaynak plandaki karar tarihi:** 12 Ağustos 2026
- **Son teknik uzlaştırma ve belge temizliği:** 4 Eylül 2026

Bu günlük, kabul edilmiş `technical-plan(6).md` belgesindeki temel kararları ve 4 Eylül 2026'da `technical-plan(6).md`, `data-contracts(4).md` ve bilgi mimarisi arasında kullanıcı tarafından topluca onaylanan teknik uzlaştırmaları kaydeder. Kaynaklarda veya açık kullanıcı onayında bulunmayan yeni mimari varsayımlar eklenmez.

## Bu dosya nasıl kullanılacak?

- Bu dosya `technical-plan(6).md` yerine geçmez; onunla birlikte kullanılır.
- Kanban kartları oluşturulurken kartlar burada kayıtlı kabul edilmiş teknik kararlarla çelişmemelidir.
- Codex, uygulama sırasında kabul edilmiş bir kararla çelişen daha büyük bir mimari değişiklik gerekli görürse bu değişikliği sessizce uygulamamalıdır.
- Böyle bir durumda kodlama durmalı, önerilen değişiklik ve gerekçesi açıklanmalı, ilgili teknik karar yeniden değerlendirilmelidir.
- Karar değişirse `technical-plan(6).md`, `data-contracts(4).md` ve `decision-log(4).md` birlikte kontrol edilip gereken dosyalar güncellenmelidir.
- ADR durumlarının anlamı:

  - **Kabul edildi:** MVP için kabul edilmiş ve değiştirilmesi için yeni karar gereken seçim.
  - **Koşullu kabul edildi:** MVP baseline'ının parçası olarak kabul edilmiş, ancak yazılı yeniden değerlendirme koşulları bulunan seçim.

---

### ADR-001 — Dengeli tek repo ve ince full-stack monolit

**Durum:** Kabul edildi

**Karar:**

Frontend ve ince backend, tek bir Next.js App Router + React + TypeScript projesinde kurulacaktır. Sunucu API sınırı Next.js Route Handlers ile sağlanacak; ayrı ve sürekli çalışan bir backend servisi kurulmayacaktır. İş kuralları ve AI planlama mantığı framework dosyalarına gömülmeyip bağımsız TypeScript modüllerinde tutulacaktır.

**Bağlam / Problem:**

MVP; kullanıcı arayüzünün yanında gizli AI anahtarını koruyan, sunucu doğrulaması yapan, iş kurallarını ve kotaları uygulayan gerçek bir backend sınırına ihtiyaç duyar. Proje tek geliştiriciyle, haftada 20–25 saat ve en fazla 10 USD aylık bütçeyle yürütülecektir.

**Neden bu yaklaşım seçildi?**

Frontend ve ince API'nin aynı dil, repository ve deployment içinde olması bakım yükünü azaltır. Ayrı backend işletmeden frontend, backend ve API sınırlarını öğrenme imkânı verir. Next.js, Supabase ve OpenAI için yaygın TypeScript örnekleri bulunur.

**Değerlendirilen alternatifler:**

- React + Vite + Supabase Edge Functions ile Supabase ağırlıklı mimari
- React + Vite + ayrı FastAPI servisi
- Frontend-only uygulama

**Alternatifleri neden seçmedik?**

- Supabase ağırlıklı seçenek iki deployment yüzeyi, Edge/Deno runtime öğrenimi ve bölünmüş loglar oluşturur.
- FastAPI iki uygulama, iki deployment, CORS, iki bağımlılık ve test akışı ile yaklaşık 5 USD sürekli backend maliyeti riski getirir.
- Frontend-only yaklaşım gizli anahtarı, güvenilir sunucu doğrulamasını, sahiplik kontrolünü ve kotaları güvenli biçimde sağlayamaz.

**Avantajı:**

Tek repository, tek deployment, daha düşük operasyon yükü ve yönetilebilir bir full-stack öğrenme alanı sağlar.

**Bedeli / Trade-off:**

Next.js server/client sınırı ve framework routing öğrenilmelidir. Backend runtime'ı Next.js'e bağlanır ve bir miktar deployment bağımlılığı oluşur.

**MVP ile ilişkisi:**

Tek geliştirici, düşük bütçe ve hızlı public MVP koşullarını desteklerken gerekli güvenilir sunucu sınırını korur.

**Kanban / uygulama etkisi:**

Kartlar ayrı Express/FastAPI servisi veya ikinci frontend projesi kurmamalıdır. Sayfalar ve Route Handlers aynı projede olmalı; domain mantığı bağımsız TypeScript modüllerinde tutulmalıdır. Next.js'in kapsam dışı gelişmiş özellikleri eklenmemelidir.

**Yeniden değerlendirme koşulu:**

Python öğrenme hedefi açıkça ürün tesliminden daha yüksek öncelik kazanırsa FastAPI seçeneği yeniden açılır.

---

### ADR-002 — Supabase Auth OTP, SSR cookie oturumu ve Resend SMTP

**Durum:** Kabul edildi

**Karar:**

Authentication için Supabase Auth e-posta OTP, cookie tabanlı SSR oturumu ve public kullanımda Resend SMTP kullanılacaktır. Public launch öncesinde doğrulanmış bir gönderici alan adı bağlanacaktır.

**Bağlam / Problem:**

Planların kullanıcı hesabına bağlanması, daha sonra yeniden açılması ve kullanıcılar arasında veri izolasyonu için kimlik doğrulama ve kalıcı oturum gereklidir. Supabase'in yerleşik e-posta göndericisinin public MVP limiti yetersizdir.

**Neden bu yaklaşım seçildi?**

Supabase Auth, PostgreSQL RLS ile aynı kimlik sistemini kullanır ve e-posta koduyla giriş şartını karşılar. Resend, public OTP e-postalarının teslimi için gerekli custom SMTP katmanını sağlar.

**Değerlendirilen alternatifler:**

- Clerk e-posta OTP
- Firebase e-posta bağlantısı

**Alternatifleri neden seçmedik?**

- Clerk, Supabase veritabanının yanında ikinci kimlik sağlayıcısı, ek JWT/RLS ayarı ve daha güçlü auth vendor bağımlılığı oluşturur.
- Firebase'in e-posta bağlantısı akışı, kabul edilen altı haneli OTP deneyimiyle aynı değildir; ayrıca Supabase PostgreSQL/RLS yanında ikinci bir kimlik ve platform entegrasyonu gerektirir.

**Avantajı:**

Kimlik, oturum ve veritabanı satır yetkisi aynı kullanıcı kimliği etrafında bütünleşir.

**Bedeli / Trade-off:**

Public e-posta için Resend kurulumu ve sahip olunan, doğrulanmış bir alan adı gerekir.

**MVP ile ilişkisi:**

Kullanıcının taslağını ve kaydedilmiş planını güvenli biçimde yeniden açmasını sağlar.

**Kanban / uygulama etkisi:**

OTP akışı altı haneli token şablonunu, SSR cookie oturumunu ve resend cooldown davranışını içermelidir. Service-role anahtarı tarayıcıya verilmemeli ve normal plan CRUD işlemlerinde kullanılmamalıdır. Public launch kartında Resend ve doğrulanmış alan adı zorunlu kontrol olmalıdır.

**Yeniden değerlendirme koşulu:**

Alan adı edinmek istenmezse yalnız authentication bileşeni Clerk olarak yeniden değerlendirilebilir.

---

### ADR-003 — Supabase PostgreSQL, RLS ve hafif veri erişimi

**Durum:** Kabul edildi

**Karar:**

Kalıcı veri için Supabase tarafından yönetilen PostgreSQL kullanılacaktır. `plans` ve `feedback` tablolarında RLS zorunlu olacaktır. `feedback(plan_id, user_id)`, `plans(id, user_id)` kaydına composite foreign key ile bağlanarak başka kullanıcının planına feedback iliştirilmesini database düzeyinde engelleyecektir. Ağır bir ORM yerine SQL migration dosyaları, Supabase JavaScript istemcisi ve üretilmiş TypeScript tipleri kullanılacaktır.

**Bağlam / Problem:**

Taslaklar, profil ve plan snapshot'ları, feedback ile AI kullanım metadatası kullanıcıya bağlı ve kalıcı saklanmalıdır. Kullanıcı A'nın Kullanıcı B'nin verisine erişmesi hem API hem veritabanı düzeyinde engellenmelidir.

**Neden bu yaklaşım seçildi?**

Supabase; standart PostgreSQL, yönetilen veri, Auth ve RLS'yi aynı platformda birleştirir. Bu, ayrı authentication ve authorization katmanı kurma yükünü azaltır.

**Değerlendirilen alternatifler:**

- Neon PostgreSQL + ayrı authentication
- Firebase Firestore

**Alternatifleri neden seçmedik?**

- Neon, authentication ve kullanıcı yetkisi için Clerk veya özel JWT katmanı gerektirir.
- Firestore, seçilen Supabase Auth + PostgreSQL + RLS bütünlüğünü ve SQL migration yaklaşımını karşılamaz; farklı veri ve yetkilendirme modeli ekler.

**Avantajı:**

SQL, Auth ve satır güvenliği tek yerde yönetilir; plan ve feedback verisi standart PostgreSQL olduğu için dışarı aktarılabilir.

**Bedeli / Trade-off:**

Supabase'e platform bağımlılığı, Free planda pause ve otomatik backup olmaması riski kabul edilir.

**MVP ile ilişkisi:**

Kalıcı plan, otomatik kayıt, feedback, maliyet takibi ve kullanıcı izolasyonu ihtiyaçlarını düşük işletim yüküyle karşılar.

**Kanban / uygulama etkisi:**

Migration'lar, RLS politikaları, composite feedback sahiplik foreign key'i ve iki kullanıcılı negatif erişim testleri zorunludur. `generation_runs` tarayıcıdan doğrudan erişilememeli; service-role istemcisi yalnız dar kota/log ve auth kullanıcısını kaldıran hesap-silme modüllerinde kullanılmalıdır.

**Yeniden değerlendirme koşulu:**

Free pause kabul edilemez hâle gelir, backup/SLA gerekir veya gerçek veritabanı ve egress limitlerine yaklaşılırsa ücretli Supabase ya da başka bir PostgreSQL hostu değerlendirilir.

---

### ADR-004 — Plan aşamalarını JSONB snapshot olarak saklama

**Durum:** Koşullu kabul edildi

**Karar:**

MVP'de cevaplar, onaylanmış profil, rota seçenekleri ve ayrıntılı plan, `plans` tablosunda doğrulanmış JSONB snapshot'ları olarak saklanacaktır. Plan aşamaları ayrı onlarca normalize tabloya bölünmeyecektir. `RouteOptionsSnapshot` ve `DetailedPlanSnapshot`, kendi `GenerationProvenance` nesnesinde başarılı `generation_run_id` ile içerik, prompt, model ve input-hash sürüm izini taşıyacaktır; plan düzeyinde son üretimi temsil eden ortak provenance kolonları tutulmayacaktır.

**Bağlam / Problem:**

Kaydedilen bir plan yeniden açıldığında aynı sonucu yeni AI çağrısı olmadan göstermeli; başarısız AI veya ağ işlemleri önceki başarılı aşamayı bozmamalıdır.

**Neden bu yaklaşım seçildi?**

Snapshot yaklaşımı planın aynı hâliyle yeniden gösterilmesini kolaylaştırır ve MVP veri modelini basit tutar.

**Değerlendirilen alternatifler:**

- Plan aşamalarını çok sayıda normalize tabloya ayırmak

**Alternatifleri neden seçmedik?**

MVP'de şehir veya deneyim bazında raporlama ve çapraz sorgu ihtiyacı henüz yoktur; ek şema karmaşıklığı gerekli görülmemiştir.

**Avantajı:**

Yeniden açma, atomik sonuç kaydı, sürüm izi ve başarısızlıkta önceki planı koruma kolaylaşır.

**Bedeli / Trade-off:**

JSONB içindeki alanlar üzerinden raporlama, çapraz sorgu ve kısmi güncelleme ihtiyaçları büyüdüğünde model yetersiz kalabilir.

**MVP ile ilişkisi:**

Az tabloyla çalışan, kaydedilebilir ve hata karşısında veri kaybetmeyen bir plan akışını destekler.

**Kanban / uygulama etkisi:**

AI sonucu yalnız doğrulandıktan sonra plan snapshot'ına yazılmalıdır. Başarısız üretim mevcut `route_options` veya `detailed_plan` değerini temizlememelidir. `generation_run_id`, `content_version`, `prompt_version`, `model_id` ve `input_hash`, ilgili stage snapshot'ının kendi `GenerationProvenance` alanında saklanmalıdır.

**Yeniden değerlendirme koşulu:**

JSONB alanları üzerinden raporlama ve çapraz sorgu ihtiyacı doğarsa plan şeması normalize edilmelidir.

---
### ADR-004.1 — Plan durumu ile üretim hata durumunu ayırma

**Durum:** Kabul edildi

**Karar:**

`Plan.status`, planın son başarılı iş aşamasını temsil edecek ve `failed` değeri içermeyecektir. AI rota veya detay üretiminin başarısızlığı `GenerationRun.status=failed` ve güvenli hata koduyla kaydedilecektir. Başarısız bir üretim `Plan.status` değerini değiştirmeyecektir.

**Bağlam / Problem:**

Teknik planın önceki minimum tablo modeli `Plan.status` içinde `failed` değeri içerirken veri koruma kuralları başarısız üretimde önceki başarılı plan aşamasının korunmasını şart koşuyordu. `failed`, planın hangi başarılı aşamada kaldığını tek başına ifade etmiyordu.

**Değerlendirilen alternatifler:**

- `failed` değerini `Plan.status` içinden çıkarmak.
- `failed` değerini koruyup ayrıca `last_successful_status` eklemek.

**Neden seçildi?**

İlk seçenek daha küçük veri modeli oluşturur ve mevcut `GenerationRun` hata kaydı zaten operasyon başarısızlığını temsil eder. Aynı bilgiyi ikinci plan state'i ile tekrar tutmaya gerek yoktur.

**Avantajı:**

Planın kaldığı aşama her zaman tek alandan anlaşılır; başarısız AI çağrısı önceki başarılı plan durumunu bozmaz.

**Bedeli / Trade-off:**

Plan satırına tek başına bakılarak son üretim girişiminin başarısız olduğu anlaşılmaz; bunun için `GenerationRun` okunur.

**Kanban / uygulama etkisi:**

`plans.status` enum'unda `failed` bulunmaz. Başarısız üretimde generation run `failed` olur, uygun `error_code` kaydedilir ve planın status/snapshot alanları değiştirilmez.

Bu karar ADR-004'ü değiştirmez; ADR-004'teki “başarısızlıkta önceki planı koru” ilkesinin state modelinde nasıl uygulanacağını netleştirir.

---

### ADR-005 — Doğrulanmış içeriği server-only, sürüm kontrollü JSON'da yönetme

**Durum:** Koşullu kabul edildi

**Karar:**

İnsan tarafından doğrulanmış pilot seyahat içeriği repository içindeki yalnız sunucu tarafında erişilen JSON dosyalarında tutulacak; Zod ile build-time doğrulanacak ve `content_version` ile sürümlenecektir. Giriş/çıkış, destinasyon ve gün başlangıç/bitiş noktaları için ortak stable `location` türü aynı arşivde tutulacaktır; ayrı konum tablosu kurulmayacaktır. CMS, içerik admin paneli, vector database ve embedding eklenmeyecektir.

**Bağlam / Problem:**

Ürünün güvenilirlik vaadi, AI model hafızasına değil insan kontrolünden geçmiş yer, URL, tarih ve kritik bilgi kayıtlarına dayanır. Pilot veri küçüktür ve tek editör vardır.

**Neden bu yaklaşım seçildi?**

Dosyalar ücretsizdir; değişiklikleri Git diff ile görünür kılar, geri almayı kolaylaştırır ve eksik alanlarla bozuk URL'leri build sırasında yakalamaya imkân verir. Küçük, yapılandırılmış veride kodla filtreleme daha ucuz ve test edilebilirdir.

**Değerlendirilen alternatifler:**

- Supabase içerik tabloları
- Headless CMS
- Vector database / embedding tabanlı erişim

**Alternatifleri neden seçmedik?**

- Supabase içerik tabloları mevcut pilotta gereksiz şema ve edit iş akışı oluşturur.
- Headless CMS küçük, tek editörlü pilot için ek sistem ve maliyet/bakım yüzeyi getirir.
- Vector search küçük ve yapılandırılmış veri için kodla filtrelemeye göre daha pahalı, daha az anlaşılır ve daha zor test edilir.

**Avantajı:**

İçerik değişiklikleri incelenebilir, doğrulanabilir, sürümlenebilir ve kolayca geri alınabilir.

**Bedeli / Trade-off:**

Her içerik güncellemesi yeni deployment gerektirir; kayıt ve filtre sayısı büyüdükçe dosya ve kod yaklaşımı zorlaşır.

**MVP ile ilişkisi:**

Gelişmiş editoryal sistem kurmadan güvenilir içerik havuzu sağlar ve AI'ın gerçek kaynağına dönüşmesini engeller.

**Kanban / uygulama etkisi:**

İçerik dosyaları client bundle'a girmemelidir. Her kayıt stable `id`, kaynak URL, `last_verified_at`, değişkenlik notu ve gerekli güvenlik alanlarını taşımalıdır. Referans alanları bu kimliği `*_id` / `*_ids` biçiminde kullanmalıdır. Şema ve link doğrulaması release gate'e eklenmelidir.

**Yeniden değerlendirme koşulu:**

İçerik birkaç pilot destinasyonu veya yüzlerce sık güncellenen kaydı aşarsa, haftalık sık edit gerekirse ya da içeriği geliştirici olmayan ikinci kişi yönetecekse içerik tabloları, basit admin veya CMS yeniden değerlendirilir.

---

### ADR-006 — AI ile deterministik kurallar arasında güven sınırı

**Durum:** Kabul edildi

**Karar:**

AI, yalnız doğrulanmış aday kimlikleri arasından kullanıcı profiline göre seçim, sıralama ve gerekçe/anlatım üretmek için kullanılacaktır. Uygunluk, aday filtreleme, kapsam, gün/süre, kimlik whitelist'i ve gerçek alanların eklenmesi deterministik sunucu kodunda kalacaktır. AI çıktısı iki aşamada üretilecek: rota seçenekleri, ardından yalnız seçilen rota için ayrıntılı plan.

**Bağlam / Problem:**

Ürün kişiselleştirme ister; ancak modelin yeni yer, restoran, park, koordinat, çalışma saati, fiyat, URL veya doğrulama tarihi uydurması güvenilirlik vaadini bozar.

**Neden bu yaklaşım seçildi?**

Sınırlandırılmış dinamik üretim, serbest üretime göre yüksek güvenilirlik ve test edilebilirlik sağlarken tamamen deterministik sürüme göre daha güçlü kişiselleştirme sunar. Yalnız seçilen rota için detay üretmek maliyeti de sınırlar.

**Değerlendirilen alternatifler:**

- Serbest dinamik üretim
- Kuralların planı kurduğu, AI'ın yalnız metni düzenlediği deterministik yaklaşım

**Alternatifleri neden seçmedik?**

- Serbest üretim yeni gerçekler uydurabilir, daha az test edilebilir ve maliyeti daha değişkendir.
- Deterministik yaklaşım kişiselleştirmeyi azaltır ve ilk release kapsamında değildir; seçilen MVP davranışı dinamik seçim ve sıralama ister.

**Avantajı:**

Kişiselleştirme ile gerçek doğruluğu arasında kontrollü bir sınır kurar; hatalı kimliklerin ve uydurma gerçeklerin kayda girmesini önler.

**Bedeli / Trade-off:**

Sunucu tarafında aday seçimi, schema doğrulama, whitelist kontrolü ve gerçek alanları hydrate eden ek kod gerekir. AI üretimi içerik havuzuyla sınırlıdır.

**MVP ile ilişkisi:**

Doğrulanmış içerikle sınırlı dinamik LLM üretimi ürünün seçilen MVP davranışıdır.

**Kanban / uygulama etkisi:**

AI web veya tool erişimi kullanmamalı, URL üretmemeli ve yalnız stable `content_id` döndürmelidir. Structured Output sonrasında ayrıca domain/whitelist doğrulaması yapılmalı; gerçek alanlar sunucuda kaynaktan eklenmelidir. Bir doğrulama hatasında en fazla bir kontrollü düzeltme denemesi yapılmalıdır.

**Yeniden değerlendirme koşulu:**

AI maliyeti aylık 7 USD veya plan başına 0,05 USD eşiğini düzenli aşarsa ya da tekrarlayan model/schema hataları kalite eval eşiklerini engellerse prompt daraltma, model değişimi veya deterministik fallback ayrı kararla yeniden değerlendirilir. İlk release güvenli hata ve veri koruma davranışıyla çıkar.

---

### ADR-007 — OpenAI Responses API, GPT-5.6 Luna ve tek sağlayıcı entegrasyonu

**Durum:** Koşullu kabul edildi

**Karar:**

AI sağlayıcısı olarak OpenAI Responses API, model olarak GPT-5.6 Luna, işleme modu olarak `service_tier=standard` ve çıktı biçimi için Structured Outputs kullanılacaktır. Çok sağlayıcılı soyutlama veya otomatik failover kurulmayacak; entegrasyon tek bir `plan-generator` modülünde tutulacak ve model adı/environment değerleri config ile ayrılacaktır.

**Bağlam / Problem:**

MVP düşük maliyetli, TypeScript backend ile kolay bütünleşen ve yapılandırılmış çıktı verebilen bir model ister. Aynı zamanda sağlayıcı bağımlılığının gereksiz bir çoklu sağlayıcı mimarisine dönüşmemesi gerekir.

**Neden bu yaklaşım seçildi?**

4 Eylül 2026'da doğrulanan standart işleme fiyat karşılaştırmasında Luna en düşük fiyatlı seçenektir; Structured Outputs ve resmi JavaScript SDK entegrasyonu sunar.

**Değerlendirilen alternatifler:**

- Gemini 3.5 Flash-Lite
- Claude Haiku 4.5
- Birden fazla sağlayıcıya otomatik failover

**Alternatifleri neden seçmedik?**

- Gemini benzer özellikler sunsa da kaynak plandaki fiyatla daha pahalıdır.
- Claude karşılaştırılan seçenekler içinde daha yüksek maliyetlidir.
- Çok sağlayıcılı failover MVP için ek soyutlama ve bakım yüzeyi oluşturur; gerçek kalite veya fiyat kanıtı olmadan kurulmaz.

**Avantajı:**

Düşük tahmini çağrı maliyeti, doğrudan TypeScript entegrasyonu ve schema tabanlı çıktı sağlar.

**Bedeli / Trade-off:**

Model sağlayıcısına bağımlılık ve model davranışı/fiyatı değişikliği riski kabul edilir.

**MVP ile ilişkisi:**

10 USD sert aylık hedef içinde dinamik kişiselleştirmeyi mümkün kılar.

**Kanban / uygulama etkisi:**

Kod çoklu sağlayıcı framework'ü kurmamalıdır. Model adı ve service tier sabit kodlanmamalı; model, prompt ve içerik sürümleri ilgili snapshot provenance'ına ve gerekli run metadatasına yazılmalıdır. Gerçek kalite model eval setiyle doğrulanmalıdır.

**Yeniden değerlendirme koşulu:**

Luna kalite eval eşiklerini karşılamazsa Terra/Gemini/Claude karşılaştırmalı eval yapılır. Model kaldırılırsa, fiyatı anlamlı değişirse veya maliyet sınırları aşılırsa model kararı yeniden açılır.

---

### ADR-008 — Harita için doğrulanmış Google Maps URL'leri

**Durum:** Kabul edildi

**Karar:**

Konum açmak için doğrulanmış Google Maps URL'leri kullanılacaktır. Gömülü harita, Google Maps JavaScript/Places/Routes API'leri ve canlı trafik, süre, fiyat veya doluluk sorguları eklenmeyecektir. Koordinatlar sağlayıcıdan bağımsız veri olarak ayrıca tutulacaktır.

**Bağlam / Problem:**

Kullanıcı yer ve rota kartlarından konumu doğrudan açabilmelidir; ancak MVP ücretli/canlı harita özelliklerine ihtiyaç duymaz.

**Neden bu yaklaşım seçildi?**

Hedef kullanıcılar Google Maps kullanmaktadır ve Maps URLs API anahtarı istemeden mobil uygulama veya tarayıcıyı açar. Koordinatların ayrıca tutulması veri modelini Google'a kilitlemez.

**Değerlendirilen alternatifler:**

- Google Maps JS + Places/Routes API
- OpenStreetMap dış bağlantıları

**Alternatifleri neden seçmedik?**

- Google Maps API seçenekleri maliyet, anahtar yönetimi, güvenlik ve geliştirme yükü getirir; canlı özellikler MVP gereksinimi değildir.
- OpenStreetMap maliyet ve taşınabilirlik açısından güçlüdür; ancak hedef kullanıcıların mevcut Google Maps kullanımı nedeniyle seçilmemiştir.

**Avantajı:**

Anahtarsız, ücretsiz ve cihazlar arası doğrudan konum açma sağlar.

**Bedeli / Trade-off:**

Gömülü harita, canlı rota, trafik, süre, fiyat ve doluluk özellikleri sunulmaz.

**MVP ile ilişkisi:**

Kullanıcının yeniden arama yapma ihtiyacını düşük teknik ve maliyet yüküyle azaltır.

**Kanban / uygulama etkisi:**

Modelden URL istenmemeli; URL, Place ID ve koordinat doğrulanmış içerikten gelmelidir. İzin verilen HTTPS host ve URL şeması build testinde doğrulanmalıdır.

**Yeniden değerlendirme koşulu:**

Gerçek zamanlı trafik veya fiyatın ürün değerinin kanıtlanmış bir parçası olması hâlinde dış veri sağlayıcısı ve cache politikası yeniden değerlendirilir.

---

### ADR-009 — Senkron üretim ve kayıt tabanlı idempotency

**Durum:** Koşullu kabul edildi

**Karar:**

Rota ve ayrıntılı plan üretimi senkron HTTP isteği içinde tamamlanacaktır. Queue, background worker, websocket, üretim cron'u, event bus ve ayrı cache katmanı kurulmayacaktır. Tekrarlı maliyet ve kayıtlar canonical `input_hash`, güncel snapshot provenance kontrolü, yalnız aktif rezervasyonlara uygulanan `(plan_id, stage, input_hash)` partial unique index'i ve atomik generation-run rezervasyonu ile önlenecektir. Tek zamanlanmış istisna, 35 günü dolan operasyonel run kayıtlarının dar retention temizliğidir.

**Bağlam / Problem:**

MVP'de üretim bir istek içinde tamamlanabilir. Tekrarlı gönderimler ikinci AI çağrısına ve çift kayda yol açmamalı; önceki başarılı sonuçlar yeniden kullanılmalıdır.

**Neden bu yaklaşım seçildi?**

Queue/worker ihtiyacı kanıtlanmamıştır. Kaydedilmiş sonuç ve idempotency, ayrıca cache servisi kurmadan tekrar çağrılarını önler.

**Değerlendirilen alternatifler:**

- Async job/queue + polling
- Ayrı cache servisi
- Websocket veya background worker tabanlı üretim

**Alternatifleri neden seçmedik?**

- Gerçek zaman aşımı veya yüksek trafik kanıtı olmadan bu parçalar ek geliştirme ve işletim yükü oluşturur.
- Sonuç zaten plan snapshot'ında saklandığı için ayrı cache gerekli değildir.

**Avantajı:**

Daha az altyapı, daha basit hata ayıklama ve daha düşük sabit maliyet sağlar.

**Bedeli / Trade-off:**

Uzun model çağrılarında kullanıcı istek boyunca bekler; host zaman aşımı ve eşzamanlı kota yarışları ileride sorun olabilir.

**MVP ile ilişkisi:**

Kanıtlanmamış ölçek sorunları için altyapı kurmadan ana üretim akışını tamamlamayı sağlar.

**Kanban / uygulama etkisi:**

UI bekleme, zaman aşımı ve kontrollü yeniden deneme durumlarını göstermelidir. Planın ilgili alanındaki güncel snapshot aynı `input_hash` değerini taşıyorsa snapshot yeni run/AI/kota tüketmeden dönmelidir. Eşleşen snapshot yoksa kullanıcı, plan-stage ve aylık global bütçe anahtarlarını database düzeyinde serialize eden dar transaction içinde kota/bütçe kontrolü ile `reserved` insert yapılmalı; süresi dolmamış eşleşen rezervasyon `409 GENERATION_IN_PROGRESS` döndürmelidir. Süresi dolmuş rezervasyon `failed` yapılır ve açık kullanıcı yeniden denemesi yeni run oluşturur. Tarihsel `succeeded` run, güncel eşleşen snapshot yoksa cache hit değildir. Yalnız aynı kullanıcı işlemi içindeki bir repair/sağlayıcı retry mevcut run'ın `attempt_count` ve toplam token/maliyet/latency değerlerini artırır. Hash; stage, ilgili normalize aktif profil/cevap alt kümesi, detail için seçili rota ve contract/catalog/content/prompt/model sürümlerini kapsamalıdır. Nesne anahtarları ile sırasız seçim kümeleri canonical sıralanmalı, anlamlı rota/gün/adım sırası korunmalıdır. Sonuç yazma transaction'ında stage hash'i güncel plandan yeniden hesaplanmalı; cevap/state/seçim değişmişse eski sonuç snapshot'ı ezmemeli ve run `STALE_GENERATION_INPUT` ile `failed` kapanmalıdır. Yalnız doğrulanmış ve güncel girdiye ait sonuç plana yazılmalıdır.

**Yeniden değerlendirme koşulu:**

Üretim sık sık host zaman aşımına uğrar veya 60 saniyeyi aşarsa async queue/polling açılır. Transaction + partial unique index tabanlı rezervasyon gerçek yükte yetersiz kalırsa database function/advisory-lock gibi daha güçlü atomik rezervasyon uygulanması yeniden değerlendirilir.

---

### ADR-010 — Katmanlı yetkilendirme, gizli anahtar ve veri minimizasyonu

**Durum:** Kabul edildi

**Karar:**

Güvenlik yalnız authentication'a bırakılmayacaktır. Her API'de oturum ve sahiplik kontrolü, veritabanında RLS, sunucuda istek/iş kuralı doğrulaması, AI kota koruması ve kişisel veri minimizasyonu birlikte uygulanacaktır. Olmayan ve başka kullanıcıya ait plan istekleri ayrım yapmadan `404 PLAN_NOT_FOUND` döndürecektir. OpenAI ve service-role anahtarları yalnız server environment variable olarak tutulacaktır.

**Bağlam / Problem:**

Public MVP; kullanıcılar arası veri sızıntısı, API anahtarı hırsızlığı, bütçe suistimali, prompt injection, uydurma içerik, zararlı URL, CSRF/XSS ve loglarda kişisel veri riskleri taşır.

**Neden bu yaklaşım seçildi?**

Technical plan, tek bir kontrolün yeterli olmadığını; auth, RLS, server validation, quota ve AI çıktı doğrulamasının birlikte gerektiğini belirtir.

**Değerlendirilen alternatifler:**

- Yalnız authentication kontrolüne güvenmek
- Yalnız API sahiplik kontrolü kullanıp RLS uygulamamak
- Normal plan işlemlerini geniş yetkili service-role istemcisiyle yürütmek

**Alternatifleri neden seçmedik?**

- Authentication tek başına nesne sahipliğini ve satır düzeyi izolasyonu garanti etmez.
- Yalnız API kontrolü, uygulama hatasında veritabanı düzeyinde ikinci savunma bırakmaz.
- Geniş service-role kullanımı RLS'yi atlar ve tek bir backend hatasının etki alanını büyütür.

**Avantajı:**

Bir kontrol atlatılsa bile kullanıcı verisi, gizli anahtar, bütçe ve doğrulanmış içerik için ek koruma katmanları bırakır.

**Bedeli / Trade-off:**

Oturum/sahiplik kontrolü, RLS, request validation, kota ve negatif güvenlik testlerinin birlikte uygulanması daha fazla kod ve test disiplini gerektirir.

**MVP ile ilişkisi:**

Herkese açık ve kullanıcı verisi saklayan uygulamanın güvenli biçimde yayınlanmasının ön koşuludur.

**Kanban / uygulama etkisi:**

Plan CRUD işlemleri session client ile yapılmalı; service-role yalnız dar kota/log ve auth kullanıcısını kaldıran hesap-silme modüllerinde kullanılmalıdır. `DELETE /api/account` açık onayla plan/feedback silmeli, 35 günlük run kayıtlarını kimliksizleştirmeli, auth kullanıcısını silmeli ve oturumu kapatmalıdır. E-posta, tam prompt ve serbest metin loglanmamalı; model HTML'i render edilmemelidir. SameSite cookie, Origin kontrolü, JSON mutasyon istekleri ve belirtilen güvenlik başlıkları uygulanmalıdır. Secrets source control'e girmemelidir.

**Yeniden değerlendirme koşulu:**

Ödeme, dosya yükleme, public plan paylaşımı, admin/editör rolü, yeni bir veri işleyici/harici entegrasyon, güvenlik olayı veya güvenlik testinde ihlal ortaya çıktığında bu karar yeniden açılır.

---

### ADR-011 — Katmanlı test stratejisi ve gerçek AI testlerini CI'dan ayırma

**Durum:** Kabul edildi

**Karar:**

Saf iş kuralları ve şemalar Vitest, kritik UI durumları React Testing Library, ana tarayıcı akışı Playwright ile test edilecektir. RLS ve migration testleri CI'da yerel Supabase üzerinde zorunlu çalışacaktır. Ayrı development Supabase projesi yalnız public release öncesi production-benzeri smoke testi için kullanılacak; preview hiçbir zaman production database'e bağlanmayacaktır. CI, AI sağlayıcısını mock edecek; küçük gerçek model eval seti yalnız model/prompt/içerik sürümü değiştiğinde ve release öncesinde çalıştırılacaktır.

**Bağlam / Problem:**

İş kuralları, kullanıcı izolasyonu, AI çıktı doğrulaması ve veri saklama davranışı tekrarlanabilir biçimde doğrulanmalıdır. Gerçek model çağrıları pahalı ve değişkendir.

**Neden bu yaklaşım seçildi?**

Vitest hızlı mantık testleri; Playwright Chromium, Firefox ve WebKit üzerinde gerçek uçtan uca kanıt sağlar. Mock CI testleri deterministik ve ücretsiz kalırken ayrı eval seti gerçek kaliteyi ölçer.

**Değerlendirilen alternatifler:**

- Jest + React Testing Library + Cypress
- Her commit'te gerçek AI testi çalıştırmak

**Alternatifleri neden seçmedik?**

- Jest + Cypress daha fazla başlangıç konfigürasyonu gerektirir; seçilen stack için güncel Next.js rehberleri Vitest ve Playwright'ı destekler.
- Her commit'te gerçek AI testi maliyetli ve değişkendir.

**Avantajı:**

Hızlı, tekrar edilebilir CI ile gerçek tarayıcı, veri izolasyonu ve model kalitesi kontrollerini dengeler.

**Bedeli / Trade-off:**

Vitest ve Playwright olmak üzere iki test aracının öğrenilmesi; ayrıca ayrı bir eval akışının bakımı gerekir.

**MVP ile ilişkisi:**

Ana akışın, güvenlik sınırlarının ve AI sözleşmesinin Codex değişiklikleri sonrasında güvenle doğrulanmasını sağlar.

**Kanban / uygulama etkisi:**

Kartların kabul ölçütleri uygun test katmanına bağlanmalıdır. Release gate; typecheck/lint/unit, local Supabase RLS/migration ve iki kullanıcılı negatif testler, development Supabase smoke testi, mock AI E2E, production-benzeri AI smoke testi, içerik şema/link doğrulaması, secret taraması, idempotent yarış, hesap silme ve kota/maliyet davranışını içermelidir.

**Yeniden değerlendirme koşulu:**

CI testleri tekrarlı biçimde flaky veya yavaş hâle gelirse, gerçek tarayıcı/runtime kullanıcı hataları mevcut katmanlardan kaçarsa ya da eval seti bilinen regresyonları yakalayamazsa test araçları, ortamları ve katmanları yeniden değerlendirilir.

---

### ADR-012 — Vercel Hobby, Supabase Free ve Resend Free ile deployment

**Durum:** Koşullu kabul edildi

**Karar:**

Uygulama ve Route Handlers Vercel Hobby'de, Auth ve veritabanı Supabase Free'de, authentication e-postaları Resend Free'de yayınlanacaktır. Local, preview ve production ortamları ayrılacak; preview deployment production veritabanına bağlanmayacaktır.

**Bağlam / Problem:**

Hedef, kişisel ve başlangıçta ticari olmayan public web MVP'sini aylık toplam 10 USD sınırında ve düşük işletim yüküyle yayınlamaktır.

**Neden bu yaklaşım seçildi?**

Vercel, Next.js için native ve en düşük deployment/bakım yükünü sunar. Supabase ve Resend free katmanları seçilen auth/veri mimarisiyle uyumludur.

**Değerlendirilen alternatifler:**

- Cloudflare Workers + OpenNext
- Railway

**Alternatifleri neden seçmedik?**

- Cloudflare Workers, OpenNext adaptörü ve local Node ile production workerd arasında ek test yükü getirir.
- Railway yaklaşık 5 USD taban maliyetle AI bütçesini daraltır ve ayrı servis işletim yükü oluşturur.

**Avantajı:**

Public HTTPS yayınını düşük sabit maliyet ve az operasyonla sağlar.

**Bedeli / Trade-off:**

Vercel Hobby yalnız kişisel ve ticari olmayan kullanıma uygundur. Free servislerde kota, Supabase pause ve otomatik backup olmaması riskleri kabul edilir.

**MVP ile ilişkisi:**

Portföy ve ürün doğrulama amaçlı public MVP'yi bütçe sınırı içinde internete açar.

**Kanban / uygulama etkisi:**

Preview ortamı production verisine bağlanmamalıdır. Production secret'ları hosting panelinde, local secret'lar source control dışında tutulmalıdır. Commercial özellik veya gelir ekleyen kartlar host kararını önce yeniden açmalıdır.

**Yeniden değerlendirme koşulu:**

Reklam, affiliate, ödeme veya başka ticari gelir başladığında Vercel Hobby kararı yeniden açılır. Free pause, backup/SLA veya gerçek kota sınırları kabul edilemez hâle gelirse ilgili servis planı/hostu yeniden değerlendirilir.

---

### ADR-013 — Platform logları ve kişisel veri içermeyen generation ledger

**Durum:** Koşullu kabul edildi

**Karar:**

MVP'de ayrı observability servisi kurulmayacaktır. Vercel runtime logları, Supabase auth/database logları ve kişisel veri içermeyen `generation_runs` tablosu birlikte kullanılacaktır. Her istekte `request_id`; cache hit olmayan AI kullanıcı işlemlerinde durum, işlem içi deneme sayısı, toplam token, toplam tahmini maliyet, toplam latency ve hata kodu tutulacaktır. Run kayıtları 35 gün saklanır; plan silinince `plan_id`, hesap silinince `user_id` null yapılır ve süre sonunda dar retention görevi kaydı siler.

**Bağlam / Problem:**

Teknik hatalar, zaman aşımı ve AI maliyeti izlenmelidir. Yalnız platform logları kalıcı AI maliyet geçmişini sağlamaz; yeni observability SDK'sı ise ek veri paylaşımı ve ayar yüzeyi yaratır.

**Neden bu yaklaşım seçildi?**

Platform logları ile dar bir generation ledger, ayrı servis eklemeden hata inceleme ve kalıcı AI maliyet takibi sağlar.

**Değerlendirilen alternatifler:**

- Yalnız platform logları
- Sentry Developer + `generation_runs`

**Alternatifleri neden seçmedik?**

- Yalnız platform logları AI maliyet geçmişini ve kısa log saklama süresini çözmez.
- Sentry ilk sürümde yeni SDK, veri paylaşım noktası ve ayar yüzeyi ekler.

**Avantajı:**

Düşük maliyetle hata, durum, token, latency ve bütçe görünürlüğü sağlar.

**Bedeli / Trade-off:**

Merkezi hata gruplayıcı ve gelişmiş observability özellikleri olmaz; teknik inceleme kısmen manuel kalır.

**MVP ile ilişkisi:**

Yeni bir servis kurmadan güvenilirlik ve 10 USD bütçe sınırının izlenmesini destekler.

**Kanban / uygulama etkisi:**

Loglara e-posta, tam prompt, serbest metin veya plan anlatımı yazılmamalıdır. `generation_runs` prompt/model cevabı kopyalamamalı, tarayıcıdan doğrudan erişilememeli ve `expires_at=created_at+35 gün` kuralına uymalıdır. Bu retention temizliği üretim workflow'u değildir ve genel cron/worker mimarisi açmaz.

**Yeniden değerlendirme koşulu:**

Hata hacmi platform loglarıyla manuel yönetilemez hâle gelirse Sentry veya eşdeğer observability servisi değerlendirilir.

---

### ADR-014 — AI bütçesini uygulama katmanında sert sınırlarla koruma

**Durum:** Kabul edildi

**Karar:**

Toplam aylık altyapı ve AI bütçesi 10 USD ile sınırlandırılacaktır. Global uygulama AI bütçesi başlangıçta 7 USD olacaktır. AI yalnız giriş yapmış kullanıcılar için çalışır. Başlangıç sınırları kullanıcı başına 4 üretim / kayan 24 saat, plan + stage başına 2 üretim / kayan 24 saat ve kullanıcı başına 3 fiziksel olarak silinmemiş plandır; MVP'de ayrı arşiv durumu yoktur. Token üst sınırları route için 12.000 input / 2.000 output, detail için 24.000 input / 8.000 output'tur. Her kullanıcı işlemi en fazla bir repair/sağlayıcı retry içerir. Güncel snapshot provenance'ıyla eşleşen cache hit, validation hatası veya eşzamanlı rezervasyon nedeniyle dönen `409` kota ya da AI bütçesi tüketmez. Desteklenmeyen senaryolar AI çağrısından önce durdurulur; deterministik ön filtreleme uygulanır. Web search, file search ve diğer ücretli model araçları kullanılmaz.

**Bağlam / Problem:**

Public bir uygulamada anonim veya tekrarlı çağrılar bütçeyi tüketebilir. Domain maliyeti ve hata payı için toplam hedefin bir kısmı AI dışında bırakılmalıdır.

**Neden bu yaklaşım seçildi?**

Kaynak plan, 7 USD AI bütçesi ile kalan yaklaşık 3 USD'yi domain amortismanı ve hata payına ayırır. Ön filtreleme, yalnız seçilen rota için detay üretme ve başarılı sonucu yeniden kullanma çağrı maliyetini düşürür.

**Değerlendirilen alternatifler:**

- Yalnız sağlayıcı harcama uyarısına güvenmek
- Kullanıcı ve plan bazlı kota koymadan yalnız global bütçe eşiği uygulamak
- Anonim kullanıcılara AI üretimi açmak

**Alternatifleri neden seçmedik?**

- Harcama uyarısı kullanıcı/plan bazlı kötüye kullanımı çağrıdan önce durdurmaz.
- Yalnız global eşik, tek kullanıcının ortak bütçeyi tüketmesini engellemez.
- Anonim üretim güvenilir sahiplik ve kullanıcı kotası uygulanmasını imkânsızlaştırır.

**Avantajı:**

Maliyet öngörülebilirliğini artırır; bütçe dolduğunda kayıtlı planların okunmasını etkilemeden yeni üretimi durdurmaya imkân verir.

**Bedeli / Trade-off:**

Kullanıcı üretim sayısı ve yeniden denemeler sınırlandırılır; bütçe dolduğunda yeni plan üretilemez.

**MVP ile ilişkisi:**

Herkese açık MVP'nin sert 10 USD hedefi aşmadan çalışmasının temel koşuludur.

**Kanban / uygulama etkisi:**

Güncel snapshot cache kontrolü AI çağrısından önce yapılmalı; eşleşme yoksa kullanıcı/plan-stage/aylık bütçe anahtarları database düzeyinde serialize edilerek kota/bütçe kontrolü ve yeni `reserved` run insert'i aynı transaction içinde olmalıdır. Kesin başlangıç değerlerinin tamamı environment config ile ayarlanmalı ve boundary/cache-hit/concurrency/retry testleriyle doğrulanmalıdır. Global bütçe environment variable ile ayarlanmalı, OpenAI proje harcama uyarısı ayrıca kurulmalı ve bütçe dolduğunda güvenli hata dönerken kayıtlı planlar okunmaya devam etmelidir.

**Yeniden değerlendirme koşulu:**

AI maliyeti aylık 7 USD'ye veya tamamlanmış plan başına 0,05 USD'nin üzerine düzenli çıkarsa prompt daraltma, model değişimi veya deterministik fallback değerlendirilir.

---

### ADR-015 — Plan içi rota seçimi ile doğrulanmış rota şablonunun kimliklerini ayırma

**Durum:** Kabul edildi

**Karar:**

Kullanıcının seçtiği rota `selected_route_option_id` ile saklanacaktır. Bu değer, ilgili planın `RouteOptionsSnapshot.options[].route_option_id` değerlerinden birine referans verir. Her route option ayrıca kaynak doğrulanmış rota şablonunu `route_template_id` ile taşır.

**Bağlam / Problem:**

Teknik planın önceki `selected_route_id` alanı, kullanıcının plan içindeki rota seçeneğini mi yoksa doğrulanmış içerikteki rota şablonunu mu temsil ettiğini açıkça belirtmiyordu. AI doğrulanmış rota şablonlarını kullanırken kullanıcı belirli plan için oluşturulmuş rota seçeneklerinden birini seçmektedir.

**Neden bu yaklaşım seçildi?**

Plan içindeki kullanıcı seçimi ile doğrulanmış içerikteki kaynak rota şablonunu birbirinden açıkça ayırır. Böylece seçim doğrulaması ve kaydedilmiş planın yeniden açılması tek anlamlı hâle gelir.

**Değerlendirilen alternatif:**

Yalnız `route_template_id` değerini seçili rota olarak saklamak.

**Alternatifi neden seçmedik?**

Bu yaklaşım kullanıcının hangi plan içi option'ı seçtiğini doğrudan ifade etmez ve route option içindeki sıra, rol ve kişiselleştirilmiş açıklama ile kaynak şablon arasındaki ayrımı bulanıklaştırır.

**Kanban / uygulama etkisi:**

Rota seçim endpoint'i `route_option_id` alır; backend bu ID'nin ilgili planın mevcut rota seçenekleri arasında bulunduğunu doğrular. `plans.selected_route_option_id` bu değeri saklar. Ayrıntılı plan oluşturulurken seçili option içindeki `route_template_id` üzerinden doğrulanmış rota şablonuna ulaşılır.

**Yeniden değerlendirme koşulu:**

Rota option katmanı kaldırılır ve kullanıcı doğrudan tekil doğrulanmış rota şablonları arasından seçim yapmaya başlarsa yeniden değerlendirilir.

Bu ADR, ADR-004 veya ADR-006'yı değiştirmez; aralarında kalan kimlik kararını tamamlar.

---

### ADR-016 — Sürümlü QuestionCatalog ve tek kaynaklı soru sözleşmesi

**Durum:** Kabul edildi

**Karar:**

MVP planlama soruları frontend ve backend'de ayrı ayrı tanımlanmayacaktır. Bilgi Mimarisi'ndeki mevcut soru envanteri `QuestionCatalog v1.0.0` altında machine-readable ortak domain contract'a dönüştürülecektir. Her soru stable ID, tip, zorunluluk, seçenek/constraint, koşullu görünürlük ve `eligibility | route | detail` impact sınıfı taşıyacaktır. Ayrı `question-catalog.md` oluşturulmayacak; ayrıntılı alan listesi `data-contracts(4).md` içinde tutulacaktır.

**Gerekçe:**

Frontend/backend soru anlamlarının ayrışmasını önlemek; aynı doğrulamayı autosave, profil onayı ve input-hash üretiminde kullanmak; bir cevap değişikliğinin hangi AI snapshot'ını geçersiz kılacağını deterministik hâle getirmek.

**Bedeli / Trade-off:**

Soru anlamı, enum veya görünürlük kuralındaki contract değişikliklerinde catalog sürümünün artırılması gerekir.

**Kanban / uygulama etkisi:**

Soru ekranları ve backend validator'ları aynı catalog'dan türetilir. Codex ayrı frontend enum listeleri veya backend'e gömülü ikinci soru sözleşmesi oluşturmamalıdır.

**Yeniden değerlendirme koşulu:**

Soru sistemi MVP'nin basit koşullu form modelini aşacak kadar dinamik veya içerik yöneticisi tarafından çalışma zamanında düzenlenebilir hâle gelirse yeniden değerlendirilir.

---

### ADR-017 — Aktif/dormant cevaplar ve etki tabanlı invalidation

**Durum:** Kabul edildi

**Karar:** `PlanAnswers.values`, catalog'a göre tek başına geçerli aktif ve dormant cevapları kalıcı tutacaktır. Backend, her kullanımda `visible_if` kurallarından runtime `active_values` türetecek; dormant cevapları profil, uygunluk, AI input'u ve `input_hash` dışında bırakacak ve yeniden aktif olduklarında tekrar doğrulayacaktır. Profil onayı sonrasındaki değişiklik kullanıcıya etkisi gösterilip açıkça onaylanmadan uygulanmayacaktır.

**Gerekçe:** Koşullu soru değişiminde kullanıcı cevabını sessizce silmeden, pasif cevabın eski profile veya AI sonucuna sızmasını engeller.

**Kanban / uygulama etkisi:** Frontend değişikliği staged tutar; backend `acknowledge_invalidation=true` isteğinde etkiyi yeniden hesaplar. `eligibility/route` değişikliği cevapları koruyup profil ve bütün downstream snapshot'ları temizler ve `draft`a döner. `detail` değişikliği profili atomik yeniler, rota/seçimi korur, detayı temizler ve seçili rota varsa `route_selected` durumuna döner. Onaysız veya başarısız işlem hiçbir başarılı snapshot'ı temizlemez.

---

### ADR-018 — Plan düzeyinde tek feedback ve idempotent PUT

**Durum:** Kabul edildi

**Karar:** MVP'de kullanıcı-plan çifti başına tek feedback kaydı tutulacaktır. `PUT /api/plans/:id/feedback`, yalnız `status=detail_ready` ve `detailed_plan` sahibi planda `(user_id, plan_id)` unique constraint ile upsert yapacak; ilk `created_at` korunurken `updated_at` yenilenecektir. Gün veya içerik düzeyinde feedback ilk sürümün dışındadır.

**Gerekçe:** Tek plan için yinelenen satırları, spam ve analiz belirsizliğini önlerken kullanıcının fikrini güncellemesine izin verir.

---

### ADR-019 — Stable location kayıtları ve render-complete snapshot'lar

**Durum:** Kabul edildi

**Karar:** Giriş/çıkış, ülke/bölge/şehir ve transport noktaları server-only verified içerikte `location` türü ve `location_kind` ile stable ID sahibi olacaktır. Aynı fiziksel konum giriş/çıkış rolüne göre çoğaltılmayacak, tek ID kullanacaktır. AI yalnız ID döndürür; backend doğrular ve hydrate eder. `RouteOptionsSnapshot` ile `DetailedPlanSnapshot`, frontend'in ek server-only içerik lookup'u yapmadan rota kartını, gün başlangıç/bitiş noktalarını, adım içeriklerini ve sürüş uçlarını tamamen render edebileceği type-specific hydrated görünümleri saklar.

**Gerekçe:** Farklı içeriklerin aynı konuma tek anlamlı referans vermesini, yeniden açılan planın aynı görünmesini ve AI'nın gerçek alan üretmemesini birlikte sağlar. Ayrı location database tablosu gerektirmez.

---

### ADR-020 — İlk teknik pilot kapsamı ve fallback politikası

**Durum:** Kabul edildi

**Karar:** İlk teknik release Arnavutluk + Karadağ ve 4-6 günlük planlarla sınırlıdır; 7-8 günlük plan üretimi desteklenmez. Deterministik fallback ilk release'e dahil değildir. Tekrarlayan model/schema hataları kaliteyi sürekli engeller veya bütçe yeni üretimi uzun süre durdurursa ayrı kararla yeniden değerlendirilir.

**Gerekçe:** Ürün personasındaki daha geniş süre olasılığını, gerçekten içerik ve contract desteği bulunan teknik pilotla karıştırmaz; ilk sürümde sessizce daha düşük kişiselleştirmeli başka davranış üretmez.

---

### ADR-021 — Hesap silme ve operasyonel run saklama

**Durum:** Kabul edildi

**Karar:** `DELETE /api/account`, açık onaydan sonra kullanıcının plan ve feedback kayıtlarını silecek, saklama süresi dolmamış `generation_runs.user_id` değerlerini null yapacak, auth kullanıcısını kaldıracak ve oturumu kapatacaktır. `generation_runs` prompt/ham cevap içermez; plan silinince `plan_id` null olur ve kayıt oluşturulmasından 35 gün sonra dar retention göreviyle silinir.

**Gerekçe:** Kullanıcının ürün verisini kaldırma hakkını sağlarken, plan silerek 24 saatlik kota ve maliyet ledger'ını atlatmayı engeller. Service-role kapsamı yalnız kota/log ve bu dar hesap-silme modülleriyle sınırlıdır.

---

### ADR-022 — Cevap autosave'inde revision tabanlı yarış koruması

**Durum:** Kabul edildi

**Karar:** `PlanAnswers`, 0'dan başlayan ve her başarılı canonical cevap yazımında atomik artan `revision` taşıyacaktır. `PATCH /api/plans/:id/answers`, son okunan değeri `expected_revision` olarak isteyecek; eşleşmeyen eski veya sırası bozulmuş istek `409 ANSWERS_VERSION_CONFLICT` ile son canonical cevap/revision'ı alacak ve yeni cevabı ezmeyecektir. `TravelProfileSnapshot.answers_revision`, profilin hangi cevap snapshot'ından üretildiğini gösterecektir.

**Gerekçe:** Debounce autosave istekleri ağda farklı sırada tamamlanabilir. Revision karşılaştırması olmadan daha eski bir istek kullanıcının daha yeni cevabını ve ona bağlı invalidation kararını geriye çevirebilir.

**Kanban / uygulama etkisi:** Frontend her başarılı kayıttan dönen revision'ı saklamalı; normal autosave ve profil onayı sonrası staged değişiklik aynı compare-and-swap kuralını kullanmalıdır. Conflict durumunda UI sunucudaki son canonical snapshot'ı temel alarak kullanıcıya güvenli uzlaştırma göstermelidir.

---

### ADR-023 — Varış/dönüş zamanı ve günlük hareket bütünlüğü

**Durum:** Kabul edildi

**Karar:** Canonical varış ve dönüş cevaplarındaki `time_known` ile varsa `local_time`, `TravelProfileSnapshot` içinde kayıpsız korunacaktır. Detail üretimi bu değerleri kullanıcı tarafından bildirilen zaman sınırı olarak kullanacak; bilinmeyen saati kesinleştirmeyecektir. Başlangıç ve bitiş konumu farklı olan her gün, bu iki ucu kesintisiz bağlayan sıralı sürüş adımı zinciri taşıyacak; gece ve sürüş dağılımı seçili doğrulanmış rota şablonuyla uyuşacaktır.

**Gerekçe:** Saat bilgisinin formdan sonra kaybolması ilk/son günün uçuşla çelişmesine; yalnız gün başlangıç/bitiş ID'si bulunması fakat hareket adımı aranmaması ise ayrıntılı planda örtük “ışınlanma” ve rota metrikleriyle uyumsuzluk oluşmasına izin veriyordu.

**Kanban / uygulama etkisi:** Profile builder saat kesinliğini test etmeli; detail input builder bu bilgiyi yalnız gerekli alt kümeye taşımalıdır. Domain validator bilinen varış/dönüş sınırını, bilinmeyen saat için temkinli yoğunluk kuralını, günlük sürüş zincirini, toplam/en uzun sürüş ölçüsünü ve gece dağılımını doğrulamalıdır.

---

## Açık / Eksik Kararlar

Kanban başlangıcını engelleyen açık teknik karar kalmamıştır. Public release öncesinde iki deployment/editoryal değer kesinleştirilmelidir:

1. Resend için kullanılacak sahip olunan ve doğrulanmış gönderici alan adının gerçek adı environment/deployment ayarına girilmelidir; seçilen auth mimarisi değişmez.
2. İçerik türüne göre `last_verified_at` eskime eşikleri ve safety-critical yeniden doğrulama süresi release gate'te yazılı hale getirilmelidir.
