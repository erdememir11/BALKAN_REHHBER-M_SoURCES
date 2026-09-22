# Balkan Rehberim - MVP Teknik Planı

Bu belge, Balkan Rehberim'in ilk değerli MVP akışı için teknik baseline olarak kabul edilmiştir. Kanban kartları ve uygulama bu mimari sınırlar içinde hazırlanacaktır. Önemli teknoloji veya mimari değişiklikler decision log üzerinden yeniden değerlendirilmeden uygulanmaz.

- **Karar tarihi:** 12 Ağustos 2026
- **Son teknik uzlaştırma ve belge temizliği:** 4 Eylül 2026
- **Ana ürün kaynakları:** `1-)PROBLEM_BALKANLAR_SON_REVIZE.docx`, `2-)Mehmet_Ayse_Mock_Plan_Ciktisi_Guncellenmis_v3.docx`, `3-)Bilgi_Mimarisi_v1_0_Tamamlandi(2).docx` ve proje rehberinin Bölüm 01-04 kararları.

Karar koşulları:

- Yayın biçimi: Herkese açık, kişisel ve başlangıçta ticari olmayan web MVP'si
- Zaman: Haftada 20-25 saat
- Toplam aylık altyapı ve AI bütçesi: En fazla 10 USD
- Geliştirme biçimi: Tek geliştirici + AI/Codex desteği
- Öğrenme amacı: Proje üzerinden frontend, backend, API, authentication, veritabanı, AI ve deployment sınırlarını çalışma bilgisi seviyesinde anlamak
- AI tercihi: Doğrulanmış içerikle sınırlandırılmış dinamik LLM üretimi
- İlk teknik pilot kapsamı: Arnavutluk + Karadağ ve 4-6 günlük planlar; 7-8 günlük akış ilk release'te desteklenmez

Lean kapısı: Bölüm 04 kapsamında yedi hedef kullanıcı testi tamamlanmış, `DEVAM` kararı kaydedilmiş ve MVP teknik geliştirme aşamasına geçiş onaylanmıştır.

## 1. MVP'nin tek değerli akışı

Kullanıcı e-posta koduyla giriş yapar -> yeni plan başlatır -> çift + kiralık araç ve pilot kapsam uygunluğu kontrol edilir -> kısa ve koşullu planlama sorularını cevaplar -> seyahat profili özetini onaylar -> bir ana öneri ve en fazla iki anlamlı rota alternatifini ortak ölçütlerle karşılaştırır -> bir rotayı seçer -> yalnızca seçilen rota için ayrıntılı plan oluşturulur -> plan kaydedilir ve daha sonra aynı kullanıcı tarafından yeniden açılır -> kullanıcı temel geri bildirim verir.

### Bu MVP'nin teknik olarak yapabilmesi gerekenler

Bu alt bölüm bilinçli olarak teknoloji adı kullanmaz.

1. Her kullanıcıyı e-posta adresine gönderilen tek kullanımlık kodla doğrulamak ve oturumunu güvenli biçimde sürdürebilmek.
2. Kullanıcıya yeni bir plan başlatma, yarım kalan taslağı görme ve kaydedilmiş planını daha sonra yeniden açma imkanı vermek.
3. Çift + kiralık araç, desteklenen destinasyon ve desteklenen süre kurallarını hem arayüzde hem güvenilir sunucu tarafında kontrol etmek.
4. Yalnızca planı değiştiren soruları göstermek; cevaplara göre sonraki soruları koşullu hale getirmek.
5. Cevapları otomatik kaydetmek; ağ veya dış servis hatasında girilmiş cevapları ve önceki başarılı sonuçları silmemek.
6. Kullanıcı cevaplarından açık bir seyahat profili özeti üretmek ve rota üretiminden önce kullanıcı onayı almak.
7. Doğrulanmış pilot içerikten bir ana ve en fazla iki anlamlı rota seçeneği üretmek; seçenekleri aynı ölçütlerle karşılaştırmak.
8. Kullanıcının seçtiği rotayı doğrulamak ve yalnızca bu rota için ayrıntılı plan üretmek.
9. Ayrıntılı planda konaklama üssü, araç alma-bırakma konumu, gün gün akış, deneyim, park, yemek, fotoğraf noktası, kritik bilgi, son doğrulama tarihi, değişkenlik notu ve gün seviyesinde Plan B göstermek.
10. Yer ve rota kartlarını doğrulanmış doğrudan harita bağlantılarıyla açmak.
11. Yapay zeka çıktısının beklenen veri biçimine uyduğunu, yalnızca izin verilen yer ve rota kayıtlarına referans verdiğini ve gün/süre kurallarını bozmadığını kontrol etmek.
12. Aynı işlem tekrar gönderildiğinde gereksiz ikinci AI çağrısı ve çift kayıt oluşturmamak.
13. AI kullanımını yalnızca giriş yapmış kullanıcılarla sınırlamak; kullanıcı, plan ve aylık bütçe kotaları uygulamak.
14. Planı kullanıcı hesabıyla ilişkilendirmek ve bir kullanıcının başka kullanıcının planını okuyamamasını veya değiştirememesini sağlamak.
15. Geri bildirimi kullanıcı-plan çifti başına tek kayıt olarak saklamak; sonraki gönderimde aynı kaydı güncellemek.
16. Yüklenme, desteklenmeyen kapsam, boş sonuç, doğrulama hatası, zaman aşımı ve dış servis hatası için anlaşılır kurtarma davranışları göstermek.
17. Hataları ve AI maliyetini kişisel veriyi loglara dökmeden izleyebilmek.
18. Ana akışı, güvenlik sınırlarını ve veri saklama davranışını tekrarlanabilir biçimde test edebilmek.
19. Uygulamayı herkese açık güvenli bir web adresinde çalıştırmak.
20. Kullanıcıya hesabını ve buna bağlı plan/feedback verisini silebileceği güvenli bir hesap silme akışı sunmak.

### MVP'nin kabul ölçütü

- Kullanıcı A, Kullanıcı B'nin planını hiçbir istemci veya API çağrısıyla okuyamaz.
- Desteklenmeyen senaryo AI çağrısı yapılmadan güvenli biçimde durur.
- LLM tarafından dönen her içerik kimliği doğrulanmış pilot veri havuzunda bulunur.
- Harita bağlantısı, doğrulama tarihi ve kritik gerçekler LLM tarafından icat edilmez; doğrulanmış kayıttan eklenir.
- Başarılı kaydedilmiş plan yeniden açıldığında yeni AI çağrısı yapılmadan aynı plan görüntülenir.
- AI veya ağ hatası, soru cevaplarını ve önceki başarılı plan aşamasını silmez.

## 2. Sistem mimarisi

### Bileşen kararları

| Bileşen | Karar | Gerekçe |
| --- | --- | --- |
| Frontend | Gerekli | Sorular, profil onayı, rota karşılaştırması, plan görünümü, hata ve kaydetme durumları kullanıcıya burada sunulur. |
| Backend / API | Gerekli, fakat ince | Gizli AI anahtarı, sunucu doğrulaması, iş kuralları, kota, içerik seçimi, AI çağrısı ve güvenli kayıt için gereklidir. Ayrı ve sürekli çalışan sunucu gerekli değildir. |
| Authentication | Gerekli | Belge e-posta koduyla giriş, kalıcı oturum ve kullanıcıya ait plan saklama şartı koyar. |
| Database / kalıcı veri | Gerekli | Taslaklar, rota sonuçları, ayrıntılı plan ve geri bildirim kullanıcıya bağlı saklanmalıdır. |
| Doğrulanmış seyahat içeriği | Gerekli | Ürünün güvenilirlik vaadinin ana kaynağıdır. AI modelinin genel hafızası doğrulanmış içerik sayılmaz. |
| AI / LLM | Seçilen MVP davranışı için gerekli | Kişiye göre seçim, sıralama ve gerekçe üretir. Gerçeklerin kaynağı olmaz. Deterministik fallback ilk release kapsamına alınmaz; yalnız yazılı yeniden değerlendirme koşullarında ele alınır. |
| Harita / konum bağlantıları | Bağlantı düzeyinde gerekli | Doğrudan konum açma ürün vaadinin parçasıdır. Gömülü harita, canlı rota veya ücretli harita API'si gerekli değildir. |
| Deployment / hosting | Gerekli | Hedef herkese açık web MVP'sidir. |
| Logging | Asgari düzeyde gerekli | Hata, zaman aşımı, token ve maliyet takibi gerekir. Ayrı bir observability ürünü gerekli değildir. |
| Test | Gerekli | İş kuralları, kullanıcı izolasyonu ve AI çıktı doğrulaması test edilmeden güvenilir MVP oluşmaz. |
| Güvenlik | Gerekli ve kesişen konu | Authentication tek başına yetmez; yetkilendirme, gizli anahtar, doğrulama, kota ve kişisel veri sınırları gerekir. |
| CMS / gelişmiş admin | Gerekli değil | Pilot içerik tek kişi tarafından küçük ve sürüm kontrollü dosyalarla yönetilebilir. |
| Vector database / embedding | Gerekli değil | Pilot veri küçük ve yapılandırılmıştır; kodla filtreleme daha ucuz, anlaşılır ve test edilebilirdir. |
| Queue / background worker | Gerekli değil | MVP üretimi bir istekte tamamlanabilir. Zaman aşımı veya yüksek trafik görülmeden eklenmez. |
| Cache katmanı | Gerekli değil | Sonuç plan kaydında saklanır; aynı girdide tekrar çağrıyı önleyen idempotency yeterlidir. |
| Dosya/object storage | Gerekli değil | Kullanıcı dosya yüklemez; metin ve yapılandırılmış plan verisi veritabanında tutulur. |

### Seçilen sınır

Seçilen yapı bir ince full-stack monolittir:

- Tek Next.js + TypeScript projesi frontend sayfalarını ve sunucu Route Handler API'lerini içerir.
- Supabase, e-posta OTP authentication ve Postgres veri saklamayı yönetir.
- Resend, herkese açık kullanımdaki authentication e-postalarını Supabase'e SMTP olarak iletir.
- OpenAI Responses API, sunucu tarafından çağrılır.
- Doğrulanmış pilot içerik repository içindeki sürüm kontrollü JSON dosyalarında, yalnızca sunucu tarafında tutulur.
- Google Maps yalnızca dışarı açılan doğrulanmış URL olarak kullanılır.

### Basit ASCII mimari diyagramı

    [Kullanıcının tarayıcısı]
              |
              | HTTPS + oturum çerezi
              v
    [Next.js uygulaması / Vercel]
       |-- Frontend: form, rota, plan, feedback
       |
       '-- Route Handlers: ince backend / API
             |-- oturum, yetki, doğrulama, kota
             |-- doğrulanmış JSON içeriğini filtreleme
             |-- AI çıktısını doğrulama ve gerçeklerle birleştirme
             |
             |----> [Supabase Auth + Postgres]
             |
             |----> [OpenAI Responses API]
             |          |
             |          '-- yapılandırılmış kimlikler ve anlatım
             |
             '----> [Sunucuya özel doğrulanmış içerik dosyaları]

    [Supabase Auth] ----> [Resend SMTP] ----> [E-posta OTP]

    [Plan kartı] --------> [Google Maps URL]
                            Harici uygulama veya tarayıcı açılır

### Frontend-only, yönetilen backend ve kendi backend'imiz

| Seçenek | Gizli anahtar | Kullanıcı planı | Auth ve yetki | İş kuralı / doğrulama | İşletim yükü | Karar |
| --- | --- | --- | --- | --- | --- | --- |
| Frontend-only | Güvenli saklanamaz | Tarayıcıda saklama kullanıcılar arası kalıcı kullanım için yetersizdir | Güvenli bütünlük kurulamaz | Kullanıcı tarafından atlanabilir | Düşük görünür, fakat güvenlik riski yüksek | Elendi |
| Yönetilen auth/veri + ince sunucu katmanı | Sunucuda saklanır | Yönetilen veritabanında saklanır | Hazır auth + satır yetkisi | İnce API'de açıkça uygulanır | Düşük | Seçildi |
| Ayrı kendi backend'imiz | Sunucuda saklanır | Herhangi bir veritabanında saklanır | Daha fazla kod ve konfigürasyon | Tam kontrol | Orta-yüksek | Python öğrenme önceliği doğarsa değerlendir |

Backend gereklidir; fakat bu karar ayrı bir Express veya FastAPI sunucusunun zorunlu olduğu anlamına gelmez. Next.js Route Handlers, bu MVP için gereken backend sınırını aynı projede sağlar.

### Üç bütünsel mimari alternatifi

| Parça | Mimari A - Supabase ağırlıklı | Mimari B - Dengeli tek repo | Mimari C - Python backend |
| --- | --- | --- | --- |
| Frontend | React + Vite | Next.js + TypeScript | React + Vite |
| Backend/API | Supabase Edge Functions | Next.js Route Handlers | FastAPI |
| Authentication | Supabase Auth OTP + Resend | Supabase Auth OTP + Resend | Supabase Auth OTP + Resend |
| Database | Supabase PostgreSQL + RLS | Supabase PostgreSQL + RLS | Supabase PostgreSQL + RLS |
| AI | OpenAI Responses API | OpenAI Responses API | OpenAI Responses API |
| Doğrulanmış içerik | Edge Function ile paketlenen JSON | Next.js sunucu katmanına özel JSON | FastAPI servisine özel JSON |
| Deployment | Cloudflare Pages + Supabase | Vercel + Supabase | Statik frontend hostu + Railway + Supabase |
| Tahmini sabit maliyet | 0 USD + domain | 0 USD + domain | Yaklaşık 5 USD + domain |
| Öğrenme yükü | Orta; Deno/Edge runtime ve iki deployment | Orta; React + Next.js server/client sınırı | Yüksek; React, Python API, CORS ve iki deployment |

#### Mimari A - Supabase ağırlıklı en az özel backend

Avantajları:

- Frontend statik ve yalındır.
- Authentication, database ve sunucu fonksiyonu aynı yönetilen platformdadır.
- Altyapı sabit maliyeti ücretsiz kalabilir.

Dezavantajları:

- Frontend ve backend farklı yerlerde yayınlanır.
- Edge Function çalışma zamanı ve yerel geliştirme akışı ayrıca öğrenilir.
- Frontend, function ve database logları bölünür.

MVP riski: Edge runtime farkları ve iki deployment yüzeyi, görünen az koda rağmen tek geliştirici için hata ayıklamayı zorlaştırabilir.

#### Mimari B - Dengeli tek repo

Avantajları:

- Frontend ve ince API aynı dil, repository ve deployment içindedir.
- API sınırı görünür kalırken ayrı backend sunucusu işletilmez.
- Next.js, Supabase ve OpenAI için resmi ve yaygın TypeScript örnekleri bulunur.
- En düşük bakım yüküyle full-stack çalışma bilgisi kazandırır.

Dezavantajları:

- Next.js server/client bileşen ayrımı öğrenilmelidir.
- Vercel Hobby yalnız kişisel ve ticari olmayan kullanım içindir.
- Framework'e bir miktar deployment bağımlılığı oluşur.

MVP riski: Next.js'in bütün özelliklerini kullanmaya çalışma kapsamı şişirebilir. Teknik plan yalnız sayfalar, Route Handlers ve gerekli auth entegrasyonuyla sınırlar.

#### Mimari C - Ayrı Python backend ile daha fazla kontrol

Avantajları:

- Frontend ve backend sınırı en açık biçimde görülür.
- Mevcut Python bilgisi kullanılır ve FastAPI öğrenilir.
- Backend başka hosta taşınabilir.

Dezavantajları:

- Frontend ve backend ayrı çalıştırılır, yayınlanır ve izlenir.
- CORS, iki bağımlılık ağacı, iki test akışı ve iki log yüzeyi oluşur.
- Railway'in yaklaşık 5 USD taban maliyeti AI bütçesini daraltır.

MVP riski: Ürün değerinden önce deployment ve entegrasyon işlerine fazla zaman harcamaktır.

Karar: Mimari B seçildi. Mimari A en güçlü sadelik alternatifi, Mimari C ise Python öğrenme hedefi ileride açıkça öncelik kazanırsa seçilecek alternatiftir.

## 3. Frontend

### Bu parça nedir?

Frontend, kullanıcının tarayıcıda gördüğü ve etkileştiği uygulama katmanıdır.

### Balkan Rehberim'de ne işe yarar?

- E-posta kodu ekranını gösterir.
- Uygunluk ve koşullu soruları yönetir.
- Otomatik kaydetme durumunu görünür kılar.
- Profil özetini, rota karşılaştırmasını ve ayrıntılı planı sunar.
- Yüklenme, hata, desteklenmeyen senaryo ve yeniden deneme durumlarını açıklar.
- Harita bağlantılarını dışarı açar.
- Feedback formunu yalnız ayrıntılı plan hazır olduğunda sunar.

### Olmasaydı ne olurdu?

Ürünün API ve verileri olsa bile hedef kullanıcı planlama akışını kullanamazdı.

### Neden seçilen çözüm?

Next.js App Router + React + TypeScript seçilir. Aynı projede sayfa ve Route Handler bulunması iki ayrı uygulama kurma ihtiyacını kaldırır. TypeScript, form, API ve AI veri şemaları arasında erken hata yakalar. Next.js'i yalnızca gerekli özellikleriyle kullanacağız; karmaşık cache, gelişmiş server action düzeni veya framework'e özel veri platformları eklenmeyecek.

### Frontend seçenekleri

Puanlar göreli kararı gösterir: 5 çok güçlü, 1 zayıf. Vendor lock-in puanında 5 daha taşınabilir anlamındadır.

| Seçenek | MVP uygunluğu | Geliştirme | Öğrenme | Bakım | AI/Codex | Maliyet | Deployment | Güvenlik | Lock-in | Büyüme |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Next.js + TypeScript | 5 | 4 | 3 | 5 | 5 | 5 | 5 | 4 | 3 | 5 |
| React + Vite + TypeScript | 4 | 4 | 4 | 3 | 5 | 5 | 4 | 4 | 5 | 4 |

Next.js'in en güçlü alternatifi React + Vite'tır. Vite frontend kavramlarını daha yalın öğretir ve statik deployment kolaydır; ancak güvenli AI çağrısı için ayrı bir backend deployment'ı gerekir. Bu projede toplam sistem sadeliği, frontend sadeliğinden daha değerlidir.

Trade-off: Next.js aynı anda React, server/client bileşen sınırı ve framework routing öğrenmeyi gerektirir. Bu yük, tek repository ve tek deployment kazancı karşılığında kabul edilir.

## 4. Backend / API

### Bu parça nedir?

Backend, tarayıcının güvenemeyeceği veya görememesi gereken işleri sunucuda yapan katmandır. API, frontend ile bu sunucu işleri arasındaki açık sözleşmedir.

### Balkan Rehberim'de tam görevleri

1. Kullanıcı oturumunu ve plan sahipliğini doğrulamak.
2. İstek verisini şemaya, uzunluk sınırına ve desteklenen enum değerlerine göre doğrulamak.
3. Çift + kiralık araç, destinasyon ve süre iş kurallarını tekrar kontrol etmek.
4. Cevaplardan onaylanabilir profil snapshot'ı oluşturmak.
5. Doğrulanmış içerikten yalnızca ilgili adayları seçmek.
6. Kullanıcı, plan, aşama ve aylık bütçe kotalarını kontrol etmek.
7. Tekrarlı istekte ikinci maliyet oluşturmamak için input hash ve idempotency kontrolü yapmak.
8. OpenAI anahtarını gizli tutarak AI servisini çağırmak.
9. AI çıktısının JSON şemasını ve referans verdiği içerik kimliklerini doğrulamak.
10. İsim, harita URL'si, doğrulama tarihi ve kritik gerçekleri doğrulanmış kayıttan eklemek.
11. Başarılı sonucu plana kaydetmek; başarısızlıkta mevcut plan verisini korumak.
12. Token, tahmini maliyet, süre, durum ve hata kodunu kişisel veri içermeden kaydetmek.

### Olmasaydı ne olurdu?

- AI anahtarı tarayıcıdan çalınabilir ve bütçe tüketilebilir.
- Kullanıcı istemci doğrulamasını atlayabilir.
- Kullanıcı plan sahipliği ve kotalar güvenilir uygulanamaz.
- Modelin uydurduğu yer veya bağlantı doğrudan plana girebilir.

### Backend seçenekleri

| Seçenek | MVP uygunluğu | Geliştirme | Öğrenme | Bakım | AI/Codex | Maliyet | Deployment | Güvenlik | Lock-in | Büyüme |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Next.js Route Handlers | 5 | 4 | 3 | 5 | 5 | 5 | 5 | 4 | 3 | 4 |
| Supabase Edge Functions | 4 | 4 | 3 | 4 | 4 | 5 | 4 | 4 | 3 | 4 |
| FastAPI ayrı servis | 4 | 3 | 4 | 2 | 5 | 3 | 3 | 4 | 5 | 5 |

Seçim: Next.js Route Handlers.

En güçlü alternatif: FastAPI. Python bilgisini derinleştirir ve frontend/backend ayrımını çok görünür yapar. Seçilmemesinin nedeni iki uygulama, iki deployment, CORS, ayrı loglar, ayrı bağımlılık yönetimi ve en az 5 USD civarı sürekli backend bütçesi riskidir.

Trade-off: Route Handlers, backend'i Next.js'e bağlar. Bunu azaltmak için iş kuralları ve AI planlama mantığı framework dosyalarının içinde değil, bağımsız TypeScript modüllerinde tutulur.

### MVP API sözleşmesi

İsimler uygulama sırasında küçük ölçüde değişebilir; sorumluluk sınırları değişmez.

| İşlem | Amaç | Sunucu kontrolü |
| --- | --- | --- |
| POST /api/plans | Yeni taslak oluştur | Oturum; kullanıcıya göre serialize edilen transaction içinde silinmemiş plan sınırı ve insert |
| PATCH /api/plans/:id/answers | Cevapları otomatik kaydet veya onaylı değişikliği uygula | Sahiplik, `expected_revision`, soru şeması, görünürlük; profil onayından sonra `acknowledge_invalidation=true` ve backend'in yeniden hesapladığı etki |
| POST /api/plans/:id/profile/confirm | Profil snapshot'ını dondur | Cevap tamlığı, uygunluk, sürüm |
| POST /api/plans/:id/routes/generate | En fazla üç rota üret | Sahiplik, durum, kota, idempotency, aday içerik |
| POST /api/plans/:id/routes/select | Rotayı seç | Gönderilen `route_option_id`, bu planın kaydedilmiş `route_options.options[]` listesinde bulunuyor mu? |
| POST /api/plans/:id/detail/generate | Seçili rota için plan üret | Seçim, kota, idempotency, içerik kimlikleri |
| GET /api/plans | Kullanıcının planlarını listele | Yalnızca oturum kullanıcısı |
| GET /api/plans/:id | Kaydedilmiş planı aç | Sahiplik ve satır güvenliği |
| PUT /api/plans/:id/feedback | Plan düzeyindeki tek feedback kaydını oluştur/güncelle | Sahiplik, `status=detail_ready`, mevcut `detailed_plan`, şema, `(user_id, plan_id)` unique constraint; tekrar gönderimde upsert |
| DELETE /api/plans/:id | Kullanıcının kendi planını sil | Sahiplik ve ilişkili kayıtların temizlenmesi |
| DELETE /api/account | Hesabı ve kullanıcı verisini sil | Açık kullanıcı onayı; plan/feedback silme, run anonimleştirme, auth kullanıcısını silme ve oturumu kapatma |

Queue, websocket, üretim cron'u, event bus ve mikroservis eklenmez. Üretim çağrısı senkron çalışır; arayüz bekleme durumu gösterir. Tek dar zamanlanmış istisna, 35 günü dolan kişisel verisiz `generation_runs` kayıtlarını silen retention görevidir. Gerçek zaman aşımı kanıtı oluşursa üretim kararı yeniden açılır.

Plan kimliği bulunmadığında veya oturum kullanıcısına ait olmadığında bütün plan endpoint'leri aynı `404 PLAN_NOT_FOUND` cevabını döndürür. Böylece başka kullanıcıya ait bir planın varlığı sızdırılmaz.

## 5. Authentication

### Bu parça nedir?

Authentication, kullanıcının iddia ettiği kişi olduğunu doğrular. Authorization ise doğrulanan kullanıcının hangi plana erişebileceğini belirler. İkisi aynı şey değildir.

### Balkan Rehberim'de ne işe yarar?

- Kullanıcı e-posta adresini girer.
- Altı haneli tek kullanımlık kod e-postaya gönderilir.
- Kod doğrulanınca kalıcı fakat süresi yönetilen bir oturum oluşur.
- Plan satırları oturumdaki kullanıcı kimliğiyle ilişkilendirilir.

### Olmasaydı ne olurdu?

Kaydedilen planın kime ait olduğu güvenilir biçimde belirlenemez ve kullanıcılar arası veri izolasyonu kurulamazdı.

### Seçim

Supabase Auth e-posta OTP + cookie tabanlı SSR oturumu + public kullanım için Resend SMTP seçilir.

Supabase'in yerleşik e-posta göndericisi yalnızca demonstrasyon içindir ve resmi güncel limit toplam 2 e-posta/saattir. Public MVP'den önce Resend ve doğrulanmış bir gönderici alan adı bağlanması zorunlu launch kontrolüdür. OTP şablonu altı haneli Token değişkenini içerir.

### Authentication seçenekleri

| Seçenek | MVP uygunluğu | Geliştirme | Öğrenme | Bakım | AI/Codex | Maliyet | Deployment | Güvenlik | Lock-in | Büyüme |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Supabase Auth + Resend | 5 | 4 | 3 | 4 | 5 | 5 | 4 | 5 | 4 | 4 |
| Clerk e-posta OTP | 4 | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 2 | 4 |
| Firebase e-posta linki | 3 | 4 | 3 | 5 | 5 | 5 | 5 | 4 | 2 | 5 |

En güçlü alternatif: Clerk. OTP teslimini ve hazır giriş bileşenlerini çok kolaylaştırır. Seçilmemesinin nedeni Supabase veritabanıyla ikinci bir kimlik sağlayıcısı entegrasyonu, ek JWT/RLS ayarı ve daha güçlü auth vendor lock-in'idir.

Trade-off: Supabase Auth seçimi public e-posta için Resend ve sahip olunan bir alan adı kurulumu gerektirir. Alan adı edinmek istenmezse mimariyi bozmadan yalnız auth bileşeni Clerk olarak yeniden değerlendirilebilir.

### Authentication güvenlik sınırları

- OTP yeniden gönderimi için sağlayıcı limitleri korunur.
- Public launch öncesi bot kötüye kullanımında CAPTCHA açılabilecek şekilde ekran hazırlanır; ilk günden zorunlu CAPTCHA eklenmez.
- Oturum e-postası uygulama loglarına yazılmaz.
- Kullanıcı verisi için yalnız auth kullanıcı kimliği kullanılır.
- Service-role anahtarı tarayıcıya verilmez ve normal plan CRUD işlemlerinde kullanılmaz. Yalnız kota/log işlemleri ile auth kullanıcısını silen dar hesap-silme modülünde kullanılabilir.

## 6. Veri ve veritabanı

### Bu parça nedir?

Veritabanı, kullanıcı ve plan verisini tarayıcı kapandıktan sonra da kalıcı ve sorgulanabilir biçimde tutar.

### Balkan Rehberim'de ne işe yarar?

- Yarım taslak ve otomatik kaydedilen cevaplar
- Onaylanan profil snapshot'ı
- Rota alternatifleri ve seçilen rota
- Ayrıntılı plan snapshot'ı
- Rota ve detay snapshot'larının kendi içerik, prompt, model ve input-hash provenance'ı
- Feedback
- AI kullanım ve hata metadatası

### Olmasaydı ne olurdu?

Plan cihaz ve tarayıcıya bağlı kalır, oturumlar arasında açılamaz, kullanıcının kaldığı yer korunamaz ve AI çağrıları bütçe açısından izlenemezdi.

### Seçim

Supabase tarafından yönetilen PostgreSQL seçilir. Uygulama kodunda ağır bir ORM kullanılmaz; SQL migration dosyaları, Supabase JavaScript istemcisi ve üretilmiş TypeScript tipleri yeterlidir.

### Veritabanı seçenekleri

| Seçenek | MVP uygunluğu | Geliştirme | Öğrenme | Bakım | AI/Codex | Maliyet | Deployment | Güvenlik | Lock-in | Büyüme |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Supabase PostgreSQL | 5 | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | 5 |
| Neon PostgreSQL + ayrı auth | 4 | 4 | 4 | 4 | 5 | 5 | 4 | 3 | 5 | 5 |
| Firebase Firestore | 3 | 4 | 3 | 4 | 5 | 5 | 5 | 4 | 2 | 5 |

En güçlü alternatif: Neon PostgreSQL. Standart Postgres ve iyi taşınabilirlik sunar. Seçilmemesinin nedeni authentication ve kullanıcı yetkisi için ayrıca Clerk veya özel JWT katmanı gerektirmesidir.

Trade-off: Supabase Auth ve RLS entegrasyonu kolaylık sağlar, fakat platforma bir miktar bağımlılık yaratır. Veri standart PostgreSQL olduğu için plan ve feedback verileri dışarı aktarılabilir.

### Minimum tablo modeli

#### plans

- id: UUID
- user_id: Auth kullanıcı kimliği
- status: planın son başarılı iş aşaması; `draft`, `profile_confirmed`, `routes_ready`, `route_selected`, `detail_ready`
- answers: `revision` taşıyan `PlanAnswers` JSONB snapshot'ı
- profile_snapshot: JSONB
- route_options: JSONB
- selected_route_option_id: metin veya UUID
- detailed_plan: JSONB
- created_at, updated_at
- unique: `(id, user_id)`; feedback sahiplik foreign key'i için

Planın farklı aşamalarını ayrı onlarca tabloya bölmek yerine MVP'de doğrulanmış JSONB snapshot'ları tutulur. `route_options` ve `detailed_plan`, başarılı `generation_run_id` dahil birbirinden bağımsız `GenerationProvenance` nesnesi taşır; plan satırında son üretimi temsil eden ortak `content_version`, `prompt_version`, `model_id` veya `input_hash` kolonu tutulmaz. Bu, iki AI aşamasının izini karıştırmadan yeniden açıldığında aynı planın gösterilmesini kolaylaştırır. Şehir veya deneyim bazında raporlama ihtiyacı doğarsa normalizasyon yeniden değerlendirilir.

#### feedback

- id
- plan_id
- user_id
- usefulness_rating
- trust_rating
- applicability_rating
- decision_load_reduced
- external_search_needed
- comment
- created_at, updated_at
- unique: `(user_id, plan_id)`; aynı kullanıcı aynı plan için ikinci satır oluşturmaz, mevcut satır güncellenir
- composite foreign key: `(plan_id, user_id) -> plans(id, user_id) ON DELETE CASCADE`; feedback başka kullanıcının planına bağlanamaz

#### generation_runs

- id
- request_id: kişisel veri içermeyen teknik istek korelasyonu
- plan_id: nullable; plan silinirse null, foreign key davranışı ON DELETE SET NULL
- user_id: nullable; hesap silinirse null
- stage: routes veya detail
- input_hash
- status: reserved, succeeded, failed
- attempt_count: aynı kullanıcı işlemi içindeki ilk çağrı ve en fazla bir repair/sağlayıcı retry; başlangıç 1, en fazla 2
- model_id
- input_tokens, output_tokens: işlemdeki bütün sağlayıcı denemelerinin toplamı
- estimated_cost_usd: işlemdeki bütün sağlayıcı denemelerinin toplam tahmini maliyeti
- latency_ms: işlemdeki bütün sağlayıcı denemelerinin toplam süresi
- error_code
- reservation_expires_at
- expires_at
- created_at, updated_at
- concurrency constraint: yalnız `status='reserved'` satırlarında `(plan_id, stage, input_hash)` için partial unique index

Her cache hit olmayan kullanıcı üretim işlemi ayrı bir `generation_runs` satırı oluşturur; aynı işlem içindeki en fazla bir repair/sağlayıcı retry aynı satırın `attempt_count` ve toplam kullanım alanlarına eklenir. Prompt veya tam model cevabı log tablosuna kopyalanmaz. Başarılı plan cevabı zaten `plans` tablosunda kullanıcı verisi olarak saklanır. `generation_runs` 35 gün tutulur; süre sonunda dar bir retention temizleme göreviyle silinir. Plan silinince `plan_id`, hesap silinince `user_id` null olur; bu süre içinde kalan kayıt yalnız kişisel veri içermeyen kota/maliyet metadatasıdır.

MVP'de ayrı bir arşiv durumu yoktur. Silinmemiş plan sınırında `status` değeri ne olursa olsun fiziksel olarak silinmemiş her plan sayılır; kullanıcı dördüncü planı açmak için mevcut planlarından birini silmelidir.

### Yetkilendirme

- `plans` ve `feedback` tablolarında Row Level Security zorunludur.
- Temel kural: auth kullanıcı kimliği satırdaki `user_id` ile eşleşir; feedback INSERT/UPDATE ayrıca composite foreign key ve sahip olunan plan kontrolünü geçer.
- Kullanıcı A'nın Kullanıcı B satırını SELECT, UPDATE ve DELETE etmesi otomatik testle reddedilir.
- generation_runs tarayıcıdan doğrudan erişime kapalıdır.
- Service-role istemcisi yalnız sunucu tarafındaki dar kota/log ve hesap-silme modüllerinde kullanılabilir; normal plan sorgularında kullanılmaz.

### Veri koruma davranışı

- Cevaplar kısa debounce sonrasında ve her adım geçişinde kaydedilir.
- Her cevap PATCH isteği son okunan `expected_revision` değerini taşır; backend yalnız eşleşen revision'ı atomik artırır. Eski/ağda gecikmiş istek `409 ANSWERS_VERSION_CONFLICT` alır ve yeni cevabın üzerine yazamaz.
- Kaydetme başarısızsa arayüz Kaydedilmedi durumunu gösterir ve bellekteki cevapları silmez.
- AI üretimi önce ayrı bir run kaydıyla başlar; ancak doğrulanan sonuç hazır olduğunda plan alanı güncellenir.
- Başarısız üretim mevcut route_options veya detailed_plan değerini null yapmaz.
- Başarısız AI üretiminde plans.status değiştirilmez; plan son başarılı iş aşamasında kalır. Hata generation_runs.status=failed ve güvenli error_code ile kaydedilir.
- Plan silme planı ve feedback'i temizler. Bütçe suistimalini önlemek için `generation_runs` prompt/cevap içermeyen asgari maliyet metadatasıyla 35 gün tutulur; `plan_id` silinince null olur.
- Hesap silme açık kullanıcı onayı ister; kullanıcının plan ve feedback kayıtlarını siler, saklama süresi dolmamış `generation_runs.user_id` değerini null yapar, auth kullanıcısını siler ve oturumu kapatır.

Profil onayından sonraki cevap değişiklikleri sessiz uygulanmaz. Frontend önerilen değişikliği ve catalog'dan türetilen etkisini kullanıcıya gösterir; kullanıcı onayından sonra `acknowledge_invalidation=true` ile gönderir. Backend etkiyi yeniden hesaplar ve tek transaction içinde şu kuralları uygular:

- `eligibility` veya `route`: geçerli cevaplar korunur; `profile_snapshot`, `route_options`, `selected_route_option_id` ve `detailed_plan` temizlenir; `status=draft` olur ve yeni profil onayı gerekir.
- `detail`: backend bütün aktif cevapları tekrar doğrular, yeni profil snapshot'ını onaylı değişiklikle atomik üretir; rota seçenekleri ve seçili rota korunur, `detailed_plan` temizlenir. `status`, hâlâ geçerli en ileri aşamaya döner; seçili rota varsa `route_selected` olur.
- Hiçbir geçiş başarısız AI çağrısında veya onaysız cevap değişikliğinde mevcut başarılı snapshot'ı temizlemez.

## 7. AI ve dış servisler

### LLM bu projede nedir?

LLM, doğrulanmış adayları kullanıcı profiline göre seçen, sıralayan ve gerekçelendiren üretim motorudur. Doğrulanmış seyahat verisinin kaynağı değildir.

### Üç üretim yaklaşımının karşılaştırması

| Yaklaşım | Kişiselleştirme | Güvenilirlik | Test edilebilirlik | Maliyet | Karar |
| --- | --- | --- | --- | --- | --- |
| Serbest dinamik üretim | Yüksek görünür | Düşük; yeni yer ve gerçek uydurabilir | Düşük | Yüksek ve değişken | Reddedildi |
| Kurallar planı kurar, AI yalnız metni düzenler | Orta | Çok yüksek | Çok yüksek | Çok düşük | İlk release'te yok; tetiklenirse yeniden değerlendirilir |
| Doğrulanmış kimliklerden sınırlandırılmış dinamik üretim | Yüksek | Yüksek | Yüksek | Düşük-kontrollü | Seçildi |

Seçilen yaklaşım gerçekten dinamiktir: model kullanıcı profiline göre rota adaylarını puanlar, deneyimleri seçer ve günlere sıralar, gerekçe ve Plan B anlatımı üretir. Ancak yeni restoran, park, koordinat, çalışma saati, fiyat, harita linki veya doğrulama tarihi icat edemez.

### Sağlayıcı seçenekleri

4 Eylül 2026 resmi standart işleme liste fiyatları kullanılmıştır. Fiyatlar milyon metin token başınadır ve değişebilir. OpenAI çağrılarında `service_tier=standard` açıkça kullanılır; priority/flex işleme bu baseline'a dahil değildir.

| Seçenek | Input/output fiyatı | MVP | Geliştirme | Öğrenme | Bakım | AI/Codex | Maliyet | Deploy | Güvenlik | Lock-in | Büyüme |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| OpenAI GPT-5.6 Luna | 0.20 / 1.20 USD | 5 | 5 | 4 | 5 | 5 | 5 | 5 | 4 | 3 | 5 |
| Gemini 3.5 Flash-Lite | 0.30 / 2.50 USD | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 4 | 3 | 5 |
| Claude Haiku 4.5 | 1.00 / 5.00 USD | 3 | 4 | 4 | 5 | 4 | 3 | 5 | 4 | 3 | 5 |

Seçim: OpenAI Responses API + GPT-5.6 Luna + Structured Outputs.

En güçlü alternatif: Gemini 3.5 Flash-Lite. Benzer düşük maliyet ve yapılandırılmış çıktı sunar. Mevcut resmi fiyatla OpenAI Luna daha ucuzdur ve seçilen TypeScript backend ile resmi SDK entegrasyonu doğrudandır.

Trade-off: Model sağlayıcısına bağımlılık ve model davranışı değişikliği riski vardır. Çok sağlayıcılı soyutlama kurulmaz; yalnız tek bir plan-generator modülü ve environment variable ile model adı ayrılır. Sağlayıcı değişikliği gerçek kalite veya fiyat kanıtı çıkınca yapılır.

### İki aşamalı üretim

#### Aşama 1: Rota alternatifleri

1. Sunucu uygun profil snapshot'ını alır.
2. Kod, desteklenen rota şablonlarını süre, giriş-çıkış, tempo ve ilgi alanına göre filtreler.
3. Modele yalnız kalan aday kimlikleri ve gerekli özet alanları verilir.
4. Model bir ana ve en fazla iki alternatif için kimlik, karşılaştırma ölçütleri ve gerekçe döndürür.
5. Sunucu kimlikleri ve rota kurallarını doğrular, doğrulanmış gerçekleri ekler ve sonucu kaydeder.

#### Aşama 2: Ayrıntılı plan

1. Kullanıcı bir rota seçer.
2. Sunucu yalnız seçilen rota ve ilişkili deneyim, park, yemek, kritik bilgi ve Plan B adaylarını yükler.
3. Model günlere sıralanmış, yapılandırılmış içerik kimlikleri ile özgün gerekçe/metin döndürür.
4. Sunucu gün sayısı, zorunlu alan, tekrar, geçersiz kimlik ve kapsam dışı içerik kontrollerini yapar.
5. İsim, koordinat, URL, doğrulama tarihi ve değişkenlik notu sunucuda asıl kayıttan hydrate edilir.
6. Doğrulanan plan snapshot olarak kaydedilir.

### AI güvenilirlik kuralları

- Model web araması yapmaz.
- Modelin genel bilgisi doğrulanmış gerçek yerine kullanılmaz.
- Modelden URL üretmesi istenmez.
- Her yer ve bilgi, stable `VerifiedContentRecord.id` değerini taşıyan ilgili `*_id` / `*_ids` alanlarıyla referans edilir.
- Çıktı JSON Schema ile sınırlandırılır.
- Şema uyumu tek başına gerçek doğruluğu sayılmaz; content_id whitelist kontrolü ayrıca yapılır.
- Serbest metin girdileri kısa, sınırlandırılmış ve talimat değil veri olarak işaretlenir.
- Bir şema/doğrulama hatasında en fazla bir kontrollü düzeltme denemesi yapılır; sonra güvenli hata döner.
- Güncel ve geçerli snapshot aynı `input_hash` değerini taşıyorsa yeni run veya AI çağrısı oluşturulmaz.
- Başarılı run kimliği ile model, prompt, içerik ve input-hash bilgisi ilgili rota veya detay snapshot'ının kendi `GenerationProvenance` nesnesinde saklanır.

İdempotency ve yarış kontrolü, güncel snapshot provenance'ı ile aktif rezervasyonu birlikte kullanarak atomik uygulanır:

- Hash; `stage`, o aşamayla ilgili normalize profil/aktif cevap alt kümesi, seçili rota gerekiyorsa onun kimliği, contract/catalog/content/prompt/model sürümleri üzerinden üretilir. Nesne anahtarları sabit sıralanır; anlamı küme olan seçim dizileri canonical sıraya getirilir, rota/gün/adım gibi anlamlı sıralı diziler korunur.
- İlgili plan alanında aynı `input_hash` değerini taşıyan güncel ve geçerli snapshot varsa bu snapshot doğrudan döner; yeni run, AI çağrısı veya kota tüketimi oluşmaz.
- Eşleşen güncel snapshot yoksa kota/bütçe kontrolü ve `reserved` run oluşturma aynı dar database transaction'ında yapılır. Transaction kullanıcı, plan-stage ve aylık global bütçe anahtarlarını database düzeyinde serialize eder; yalnız `status='reserved'` satırlarında `(plan_id, stage, input_hash)` partial unique index'i aynı hash için eşzamanlı ikinci rezervasyonu ayrıca engeller.
- Aynı anahtarda süresi dolmamış `reserved` kayıt varsa `409 GENERATION_IN_PROGRESS` döner; yeni run açılmaz ve kota tüketilmez.
- Süresi dolmuş rezervasyon güvenli hata koduyla `failed` yapılır; kullanıcının açık yeniden denemesi yeni bir run satırı oluşturur. Eski `succeeded` run yalnız tarihsel ledger kaydıdır; karşılık gelen güncel snapshot yoksa cache sonucu sayılmaz.
- Aynı kullanıcı işlemi içindeki en fazla bir schema repair veya sağlayıcı retry aynı run üzerinde `attempt_count` değerini artırır; token, maliyet ve latency alanları bütün denemelerin toplamını taşır.
- Doğrulanmış AI sonucu plana yazılmadan hemen önce backend güncel plan verisinden aynı stage hash'ini yeniden hesaplar. Hash veya gerekli plan durumu/seçimi değişmişse eski sonuç snapshot'ı ezmez; run `STALE_GENERATION_INPUT` hata koduyla `failed` olur ve güvenli yeniden deneme cevabı döner.

### Harita / konum

Google Maps URLs kullanılır. Bu URL'ler mobil uygulamayı veya tarayıcıyı açabilir ve API anahtarı gerektirmez.

- Doğrulanmış kayıtta isim, koordinat, varsa Place ID ve maps_url tutulur.
- Uygulama canlı Places, Routes, trafik, süre, ücret veya doluluk sorgulamaz.
- Koordinat vendor-neutral tutulduğu için gelecekte başka harita sağlayıcısına geçilebilir.

Harita seçenekleri:

| Seçenek | MVP | Geliştirme | Öğrenme | Bakım | AI/Codex | Maliyet | Deploy | Güvenlik | Lock-in | Büyüme |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Google Maps URLs | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 3 |
| Google Maps JS + Places/Routes API | 2 | 2 | 2 | 3 | 5 | 2 | 3 | 3 | 2 | 5 |
| OpenStreetMap dış bağlantıları | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 3 |

En güçlü alternatif OpenStreetMap bağlantılarıdır ve maliyet/taşınabilirlik açısından iyidir. Hedef kullanıcıların bugün Google Maps kullanması ve resmi Maps URLs özelliğinin API anahtarı istememesi nedeniyle Google Maps URLs seçilir. Kritik veri koordinat olarak da tutulduğu için bu tercih veri modelini Google'a kilitlemez.

## 8. Doğrulanmış seyahat içeriği

### Bu parça nedir?

Ürünün kullanıcıya gerçek olarak sunduğu, insan tarafından kontrol edilmiş pilot seyahat kayıtlarıdır. AI prompt'u veya model hafızası bu arşivin yerini tutmaz.

### Seçim

Repository içinde sürüm kontrollü, sunucuya özel JSON dosyaları ve Zod tabanlı build-time doğrulama seçilir.

Örnek içerik grupları:

- locations
- route_templates
- accommodation_bases
- car_pickup_dropoff_options
- experiences
- parking
- food
- photo_spots
- critical_information
- plan_b_options

`locations`, ortak server-only doğrulanmış konum kaydıdır; ayrı database tablosu değildir. Her kayıt stable `id`, `location_kind` (`country`, `region`, `city`, `airport`, `transport_hub`), görünen ad ve türüne göre koordinat/harita alanlarını taşır. `entry_point_id`, `exit_point_id`, `destination_sequence_ids` ve gün başlangıç/bitiş referansları yalnız bu kayıtların ID'lerini kullanır.

Her kayıt için asgari alanlar:

- id ve type
- ülke, şehir ve kapsam etiketleri
- görünen ad
- koordinat ve doğrulanmış harita URL'si
- rol veya öncelik
- uygun süre/tempo/ilgi etiketleri
- kısa doğrulanmış gerçek
- source_urls
- last_verified_at
- variability_note
- safety_critical işareti ve gerekiyorsa güvenli uyarı
- content_version

### Neden dosya, neden veritabanı değil?

Pilot veri küçüktür, tek editör vardır ve admin paneli kapsam dışıdır. Dosya yaklaşımı:

- Ücretsizdir.
- Her değişikliği Git diff olarak gösterir.
- Codex'in yanlış veya geniş değişikliğini incelemeyi kolaylaştırır.
- Build sırasında eksik alan ve bozuk URL'yi yakalar.
- Yanlış değişiklikten geri dönmeyi kolaylaştırır.

Bedeli: İçerik güncellemesi yeni deployment gerektirir ve arama/filtreleme büyüdükçe kod zorlaşır.

### İçerik seçenekleri

| Seçenek | MVP | Geliştirme | Öğrenme | Bakım | AI/Codex | Maliyet | Deploy | Güvenlik | Lock-in | Büyüme |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Sürüm kontrollü JSON | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 2 |
| Supabase içerik tabloları | 4 | 4 | 4 | 4 | 5 | 5 | 4 | 5 | 4 | 5 |
| Headless CMS | 2 | 3 | 2 | 4 | 4 | 3 | 4 | 4 | 2 | 5 |

En güçlü alternatif: Supabase içerik tabloları. İçeriği deployment olmadan günceller ve daha iyi sorgular. Pilot kapsam birkaç destinasyonu veya yüzlerce sık güncellenen kaydı geçtiğinde yeniden değerlendirilir.

Vector search eklenmez. Kod önce destinasyon, rota, süre, tempo ve etiketlerle deterministik filtre yapar; modele yalnız küçük aday kümesi gider.

## 9. Veri akışı

### Senaryo: sorular -> rota -> seçim -> ayrıntılı plan -> kaydetme -> yeniden açma

1. Kullanıcı e-posta OTP ile giriş yapar.
   - Frontend e-posta ve kod ekranını gösterir.
   - Authentication servisi kodu gönderir ve doğrular.
   - Tarayıcıda güvenli oturum oluşur.

2. Kullanıcı yeni plan başlatır.
   - Frontend POST /api/plans çağrısı yapar.
   - Backend oturumu doğrular.
   - Database kullanıcıya bağlı draft plan kaydı oluşturur.

3. Kullanıcı planlama sorularını doldurur.
   - Frontend koşullu soruları ortak `QuestionCatalog` sürümüne göre gösterir.
   - Cevaplar kısa debounce ve adım geçişlerinde backend'e gönderilir.
   - Frontend son başarılı kaydın `revision` değerini `expected_revision` olarak gönderir; backend revision eşleşmesini ve cevapları aynı `QuestionCatalog` sürümüne göre tip, izin verilen değer, zorunluluk, görünürlük ve constraint kurallarıyla doğrular.
   - Database `answers.values` içinde tek tek geçerli aktif ve pasif cevapları korur; backend her kullanımda görünürlük kurallarından runtime `active_values` türetir. Pasif cevaplar profil, uygunluk, AI girdisi veya `input_hash` içinde kullanılmaz ve yeniden aktif olduğunda tekrar doğrulanır.

4. Kullanıcı profil özetini onaylar.
   - Backend aktif ve doğrulanmış cevapların tamlığını ve desteklenen MVP kapsamını tekrar kontrol eder.
   - Yalnız bu cevaplardan, varış/dönüş saat kesinliğini kaybetmeyen değişmez `profile_snapshot` oluşturulur ve database'e kaydedilir.
   - Uygun değilse burada durulur; AI çağrısı yapılmaz.

5. Rota alternatifleri oluşturulur.
   - Backend önce auth, sahiplik ve durum kontrolünü; ardından güncel snapshot cache kontrolü ile atomik kota/bütçe/rezervasyon işlemini yapar.
   - Doğrulanmış içerikten uygun rota adaylarını filtreler.
   - AI'a profil ve yalnız aday kimlik/özetleri gönderilir.
   - AI yapılandırılmış en fazla üç seçenek döndürür.
   - Backend kimlik, gün, kapsam ve şema kontrolü yapar; gerçek alanları doğrulanmış içerikten ekler.
   - Database, kendi `GenerationProvenance` nesnesini taşıyan `route_options` snapshot'ını kaydeder.
   - Frontend karşılaştırmayı gösterir.

6. Kullanıcı rota seçer.
   - Frontend seçilen `route_option_id` değerini gönderir.
   - Backend bu `route_option_id` değerinin ilgili planın kaydedilmiş `route_options.options[]` listesinde bulunduğunu doğrular.
   - Database `selected_route_option_id` ve `status=route_selected` değerlerini günceller.
   - Seçilen option içindeki `route_template_id`, ayrıntılı plan üretiminde doğrulanmış rota şablonuna ulaşmak için kullanılır.

7. Ayrıntılı plan oluşturulur.
   - Backend yalnız seçili rotaya ait doğrulanmış adayları yükler.
   - Kota ve aynı istek kontrolünden sonra AI çağrılır.
   - AI günlere göre içerik kimlikleri, sıralama, sürüş adımları, gerekçe ve Plan B anlatımı döndürür; kullanıcı tarafından bilinen varış/dönüş saatlerini değiştiremez.
   - Backend tüm kimlikleri whitelist ile doğrular; gece dağılımını, gün başlangıç/bitiş sürüş zincirini ve ilk/son gün zaman sınırlarını kontrol eder; isim, harita URL'si, doğrulama tarihi ve kritik gerçekleri ana içerikten ekler.
   - Başarılı snapshot, detail aşamasına ait kendi `GenerationProvenance` nesnesiyle database'e kaydedilir.
   - Frontend planı Genel Bakış, Seyahate Çıkmadan Önce ve Gün Gün Plan olarak gösterir.

8. Kullanıcı daha sonra planı yeniden açar.
   - Oturum tekrar doğrulanır.
   - Backend plan sahipliğini ve RLS sonucunu kontrol eder.
   - Database'deki detailed_plan snapshot döner.
   - Yeni AI çağrısı yapılmaz.

9. Kullanıcı feedback verir veya önceki feedback'ini günceller.
   - Frontend kısa formu gönderir.
   - Backend plan sahipliği ve feedback şemasını doğrular.
   - Database `(user_id, plan_id)` anahtarına göre feedback kaydını upsert eder; `created_at` korunur, `updated_at` yenilenir.

### Hata akışı

- Auth yok: 401 ve giriş ekranına dönüş.
- Olmayan veya başka kullanıcıya ait plan: ayrım yapmadan `404 PLAN_NOT_FOUND`.
- Eksik/hatalı cevap: 400, alan düzeyinde açıklama, mevcut taslak korunur.
- Eski cevap revision'ı: `409 ANSWERS_VERSION_CONFLICT`; sunucudaki son canonical cevap/revision döner, eski istek yeni cevabı ezmez.
- Desteklenmeyen senaryo: açıklayıcı kapsam mesajı, AI çağrısı yok.
- Kota/bütçe dolu: 429 veya 503, plan ve cevaplar korunur.
- AI zaman aşımı/servis hatası: GenerationRun.status=failed; Plan.status son başarılı aşamada kalır; önceki plan alanları korunur; kontrollü yeniden deneme sunulur
- AI geçersiz kimlik: sonuç kaydedilmez, güvenli hata ve log error_code.
- Database kaydı başarısız: AI sonucu kullanıcıya kalıcı tamamlandı gibi gösterilmez.

## 10. Güvenlik

| Risk | MVP kontrolü |
| --- | --- |
| OpenAI anahtarının çalınması | Anahtar yalnız sunucu environment variable'ında; tarayıcı bundle'ında ve repository'de bulunmaz. |
| Kullanıcılar arası plan sızıntısı | Her API'de oturum + sahiplik, PostgreSQL RLS ve iki kullanıcılı negatif test. |
| Service-role anahtarının geniş kullanımı | Yalnız dar kota/log ve hesap-silme modülleri; normal plan CRUD kullanıcının session client'ı ile yapılır. |
| AI bütçe suistimali | Giriş zorunluluğu, kullanıcı/gün ve plan/aşama kotaları, global aylık maliyet kontrolü, idempotency. |
| OTP bot saldırısı | Sağlayıcı rate limitleri, custom SMTP, gerektiğinde CAPTCHA açma, resend cooldown. |
| Prompt injection | Çoğu girdi enum; serbest metin uzunluk sınırı; kullanıcı metni veri olarak ayrılır; web/tool erişimi yok. |
| Hallucinated facts | Stable content_id, Structured Outputs, whitelist, server-side hydration. |
| Zararlı veya bozuk URL | URL'ler editoryal içerikten gelir; izin verilen HTTPS host ve şema build testinde doğrulanır. |
| CSRF | SameSite güvenli cookie, state-changing isteklerde Origin kontrolü ve yalnız JSON `POST`/`PATCH`/`PUT`/`DELETE`; hesap silme `DELETE` body içinde sabit confirmation değeri ister. |
| XSS | React'in varsayılan escaping'i; model HTML'i render edilmez; Markdown gerekiyorsa whitelist sanitizer. MVP'de düz metin tercih edilir. |
| Loglarda kişisel veri | E-posta, tam prompt ve serbest metin loglanmaz; request ID, plan ID, durum, token ve hata kodu tutulur. |
| Veri kaybı | Atomik sonuç kaydı, başarısızlıkta mevcut snapshot'ı koruma; migration öncesi manuel export. Free planda otomatik backup olmadığı açık risk olarak kabul edilir. |
| Eski/değişken seyahat bilgisi | last_verified_at ve variability_note kullanıcıya gösterilir; safety-critical kayıtlar yayın öncesi tekrar kontrol edilir. |

Asgari HTTP başlıkları: HTTPS, Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, Permissions-Policy ve uygun frame-ancestors kuralı.

Kişisel veri minimizasyonu:

- E-posta auth sağlayıcısında tutulur; AI prompt'una gönderilmez.
- AI'a gerçek kullanıcı kimliği, e-posta veya gereksiz kişisel veri gönderilmez.
- Seyahat girdileri yalnız plan üretimi için kullanılır.
- Kullanıcı kendi planını silebilir.
- Kullanıcı hesabını açık onayla silebilir; plan/feedback silinir, 35 günlük operasyonel run kaydı kimliksizleştirilir ve auth hesabı kaldırılır.
- Public launch öncesi sade gizlilik bildirimi ve veri saklama açıklaması hazırlanır.

## 11. Test yaklaşımı

### Seçim

- Vitest: iş kuralları, şema ve saf fonksiyon testleri
- React Testing Library: kritik form ve durum bileşenleri
- Playwright: tarayıcıda ana uçtan uca akış
- Supabase local: CI'da zorunlu RLS ve migration doğrulaması
- Ayrı development Supabase projesi: public release öncesi production-benzeri RLS/migration smoke testi
- Küçük model eval seti: gerçek AI kalitesi; normal CI'da değil

| Test seçeneği | MVP | Geliştirme | Öğrenme | Bakım | AI/Codex | Maliyet | Deploy/CI | Güvenlik | Lock-in | Büyüme |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Vitest + React Testing Library + Playwright | 5 | 4 | 3 | 4 | 5 | 5 | 5 | 5 | 5 | 5 |
| Jest + React Testing Library + Cypress | 4 | 4 | 3 | 4 | 5 | 5 | 4 | 5 | 5 | 5 |

En güçlü alternatif Jest + Cypress'tir. Seçilen stack, Next.js'in güncel resmi rehberlerinde hem Vitest hem Playwright desteğine sahip; Playwright aynı zamanda Chromium, Firefox ve WebKit üzerinde gerçek uçtan uca akış sağlar. Bedeli iki test aracını öğrenmektir.

### Test katmanları

1. Unit test
   - Uygunluk kuralları
   - Koşullu soru görünürlüğü
   - Profil snapshot oluşturma
   - Varış/dönüş saat kesinliğinin profile kayıpsız aktarılması ve bilinmeyen saatte temkinli ilk/son gün kuralı
   - İçerik filtreleme
   - Google Maps URL ve içerik dosyası şeması
   - Token/maliyet hesabı
   - AI output domain validator

2. Database ve authorization test
   - Kullanıcı A kendi planını CRUD yapabilir.
   - Kullanıcı A, Kullanıcı B planını okuyamaz/değiştiremez/silemez.
   - Kullanıcı A, kendi `user_id` değeriyle Kullanıcı B'nin `plan_id` değerine feedback bağlayamaz.
   - Plan silme plan ve feedback kayıtlarını temizler; kısa süreli maliyet ledger'ının silerek kota aşmaya izin vermediğini doğrular.
   - Hesap silme plan/feedback kayıtlarını temizler, saklama süresi dolmamış run kayıtlarını kimliksizleştirir ve auth hesabını kaldırır.
   - Olmayan ve başka kullanıcıya ait plan aynı `404 PLAN_NOT_FOUND` sözleşmesini döndürür.
   - Eşzamanlı plan oluşturma istekleri kullanıcı başına üç silinmemiş plan sınırını aşamaz.
   - Migration boş veritabanına uygulanabilir.

3. API integration test
   - Oturumsuz istek reddedilir.
   - Hatalı girdi AI çağrısından önce reddedilir.
   - Güncel snapshot provenance'ıyla eşleşen aynı `input_hash` ikinci run veya AI çağrısı oluşturmaz.
   - Aynı sırasız seçim kümesinin farklı istemci sıraları aynı canonical `input_hash` değerini üretir.
   - Aynı `(plan_id, stage, input_hash)` için eşzamanlı isteklerden yalnız biri run rezervasyonu alır; diğeri `409 GENERATION_IN_PROGRESS` görür.
   - Farklı hash'lerle gelen eşzamanlı istekler kullanıcı/plan/global kota transaction lock'larını aşamaz; sınırın üzerinde run oluşturulmaz.
   - Tarihsel `succeeded` run bulunup karşılık gelen güncel snapshot bulunmadığında istek yanlış cache hit sayılmaz; yeni kullanıcı işlemi olarak rezerve edilebilir.
   - Üretim sürerken cevap veya rota seçimi değişirse eski hash'li sonuç plan snapshot'ını ezmez; run `STALE_GENERATION_INPUT` ile kapanır.
   - Profil onayı sonrası cevap değişikliği, kullanıcı onayı olmadan snapshot temizlemez; onaylı değişiklik catalog impact kuralına göre doğru alanları atomik geçersizleştirir.
   - Gecikmiş/eski `expected_revision` ile gelen autosave veya onaylı değişiklik yeni cevap snapshot'ını ezmez.
   - Sahte AI cevabındaki bilinmeyen content_id kaydedilmez.
   - Gece dağılımı seçili rota şablonuyla uyuşmayan veya konum değiştiren günde başlangıç-bitiş sürüş zinciri bulunmayan AI çıktısı kaydedilmez.
   - İlk/son gün planı bilinen varış/dönüş saatini ihlal edemez; bilinmeyen saatte temkinli yoğunluk kuralı uygulanır.
   - AI hatası mevcut taslağı korur.

4. Playwright E2E
   - Giriş yapılmış test kullanıcısı yeni planı başlatır.
   - Soruları doldurur ve otomatik kaydı görür.
   - Profil onayı -> rota karşılaştırması -> rota seçimi -> ayrıntılı plan akışını tamamlar.
   - Sayfayı kapatıp açtığında planı yeniden görür.
   - Feedback verir.
   - Mobil görünümde temel akış çalışır.

5. AI eval
   - En az 10 sabit profil senaryosu
   - Rota çeşitliliği ve gerekçe uygunluğu
   - Zorunlu simgesel deneyim kapsaması
   - Gün/süre uygulanabilirliği
   - Geçersiz kimlik oranı: yüzde 0
   - Güvenlik-kritik yanlış yönlendirme: yüzde 0
   - Ortalama plan maliyeti ve latency kaydı

Gerçek AI testi her commit'te çalıştırılmaz; pahalı ve değişkendir. CI, sağlayıcıyı mock ederek sözleşmeyi test eder ve RLS/migration testlerini yerel Supabase üzerinde zorunlu çalıştırır. Development Supabase projesi yalnız release öncesi production-benzeri smoke testinde kullanılır. Gerçek model eval'i model/prompt/content sürümü değiştiğinde ve release öncesinde çalıştırılır.

### MVP release gate

- Typecheck, lint ve unit testler başarılı
- RLS negatif testleri başarılı
- Mock AI ile E2E ana akış başarılı
- En az bir production-benzeri gerçek AI smoke testi başarılı
- Tüm içerik JSON dosyaları şema ve link doğrulamasından geçiyor
- Gizli anahtar taraması temiz
- Maliyet koruması ve kota davranışı doğrulanmış

## 12. Deployment

### Seçim

- Uygulama ve Route Handlers: Vercel Hobby
- Auth ve database: Supabase Free
- Auth e-postası: Resend Free
- AI: OpenAI usage-based
- Harita: Google Maps URLs

Vercel Hobby yalnız kişisel ve ticari olmayan kullanım içindir. Bu plan, portföy ve ürün doğrulama amaçlı public MVP için kabul edilir. Reklam, affiliate, satış veya ticari kullanım başlarsa Vercel planı/host seçimi yayın öncesi yeniden değerlendirilir.

### Hosting seçenekleri

| Seçenek | MVP | Geliştirme | Öğrenme | Bakım | AI/Codex | Maliyet | Deploy | Güvenlik | Lock-in | Büyüme |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Vercel Hobby | 5 | 5 | 4 | 5 | 5 | 5 ticari olmayanda | 5 | 5 | 3 | 4 |
| Cloudflare Workers | 4 | 3 | 3 | 4 | 4 | 5 | 3 | 5 | 3 | 5 |
| Railway | 3 | 4 | 4 | 3 | 5 | 3 | 4 | 4 | 4 | 4 |

En güçlü alternatif: Cloudflare Workers. Free planda yüksek istek kotası ve 5 USD ücretli başlangıç sunar; Next.js için OpenNext adaptörü gerekir ve local Node ile production workerd çalışma zamanı arasında ek test yükü getirir. Vercel'in native Next.js deployment kolaylığı MVP'de daha değerlidir.

### Ortamlar

- Local: Yerel Next.js, mock AI varsayılan, gerektiğinde development Supabase.
- Preview: Vercel preview deployment; production verisine bağlanmaz.
- Production: Ayrı environment variables ve production Supabase.

Supabase Free iki aktif proje sınırı içinde development ve production ayrımı kullanılabilir. Tek production veritabanını preview deployment'lara bağlamak yasaktır.

### Gizli değişkenler

- OPENAI_API_KEY: server-only
- SUPABASE_SERVICE_ROLE_KEY: server-only, yalnız quota/log ve hesap-silme modülleri
- NEXT_PUBLIC_SUPABASE_URL: public olması tasarım gereğidir
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: public olması tasarım gereğidir; güvenlik RLS ile sağlanır
- AI_MODEL_ID
- OPENAI_SERVICE_TIER: `standard`
- AI_MONTHLY_BUDGET_USD
- AI_MAX_GENERATIONS_PER_USER_24H: başlangıç `4`
- AI_MAX_GENERATIONS_PER_PLAN_STAGE_24H: başlangıç `2`
- MAX_UNDELETED_PLANS_PER_USER: başlangıç `3`
- AI_ROUTE_INPUT_TOKEN_LIMIT: başlangıç `12000`
- AI_ROUTE_OUTPUT_TOKEN_LIMIT: başlangıç `2000`
- AI_DETAIL_INPUT_TOKEN_LIMIT: başlangıç `24000`
- AI_DETAIL_OUTPUT_TOKEN_LIMIT: başlangıç `8000`
- AI_MAX_RETRIES_PER_OPERATION: başlangıç `1`
- GENERATION_RESERVATION_TTL_SECONDS
- GENERATION_RUN_RETENTION_DAYS: başlangıç `35`
- APP_ORIGIN

Local secret dosyaları source control'e girmez. Production secret'ları hosting panelinde tutulur.

### Logging

MVP'de ayrı Sentry benzeri servis yoktur.

- Vercel runtime logs: kısa süreli teknik hata inceleme
- Supabase auth/database logs: authentication ve database sorunu
- generation_runs: kalıcı AI durum, token, maliyet ve latency
- Her istek için request_id
- Loglarda e-posta, tam prompt veya plan anlatımı yok
- `generation_runs` 35 gün sonunda dar retention göreviyle silinir; plan/hesap silinince ilgili kimlik alanı süre dolmadan önce null yapılır

| Logging seçeneği | MVP | Geliştirme | Öğrenme | Bakım | AI/Codex | Maliyet | Deploy | Güvenlik | Lock-in | Büyüme |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Yalnız platform logları | 3 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 2 |
| Platform logları + generation_runs | 5 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 |
| Sentry Developer + generation_runs | 4 | 3 | 3 | 4 | 5 | 5 limit içinde | 4 | 4 | 3 | 5 |

Yalnız platform logları AI maliyet geçmişini ve kısa log saklama süresini çözmez. Sentry ücretsiz geliştirici planı güçlü alternatiftir; fakat ilk sürümde yeni SDK, veri paylaşım noktası ve ayar yüzeyi ekler. Gerçek hata hacmi kanıtı çıkana kadar platform logları + dar generation_runs ledger'ı seçilir.

Hata hacmi manuel incelemeyi aşarsa Sentry yeniden değerlendirilir.

## 13. Tahmini maliyet

### Sabit servisler

| Kalem | MVP planı | Aylık tahmin | Kritik sınır |
| --- | --- | ---: | --- |
| Vercel | Hobby | 0 USD | Kişisel/ticari olmayan kullanım, kota aşımında satın alma yok |
| Supabase | Free | 0 USD | 500 MB DB, 5 GB egress, 50.000 MAU; 1 hafta inaktivitede pause; otomatik backup yok |
| Resend | Free | 0 USD | 3.000 e-posta/ay, 100 e-posta/gün, 3 alan adı |
| Google Maps URLs | URL bağlantısı | 0 USD | Canlı API özelliği yok |
| Alan adı | Sağlayıcıya göre yıllık | Değişken | Resend için sahip olunan ve doğrulanan domain gerekir |

### AI maliyet varsayımı

GPT-5.6 Luna `service_tier=standard` resmi fiyatı:

- Input: 0.20 USD / 1 milyon token
- Output: 1.20 USD / 1 milyon token

Örnek tamamlanmış plan varsayımı:

- Rota + detay toplam input: 30.000 token
- Rota + detay toplam output: 12.000 token
- Teorik model maliyeti: 30.000 / 1.000.000 x 0.20 + 12.000 / 1.000.000 x 1.20 = yaklaşık 0.0204 USD
- Retry ve değişkenliği içeren planlama payı: yaklaşık 0.03-0.05 USD / tamamlanmış plan

Bu tahmin gerçek prompt ve usage loguyla doğrulanmalıdır. 7 USD AI bütçesi, yaklaşık 140-230 tamamlanmış planlık güvenli planlama aralığı verir. Bu bir kapasite vaadi değildir.

### Bütçe korumaları

1. Anonim kullanıcı AI çağıramaz.
2. Desteklenmeyen senaryo AI çağrısından önce durur.
3. Yalnız seçilen rota için ayrıntılı plan üretilir.
4. Doğrulanmış içerik önce kodla filtrelenir; tüm veri prompt'a gönderilmez.
5. Input/output token üst sınırı vardır.
6. İlgili plan alanındaki güncel ve geçerli snapshot provenance'ı aynı `input_hash` değerini taşıyorsa tekrar çağrı yapılmaz; tarihsel bir `succeeded` run tek başına cache hit sayılmaz.
7. Kullanıcı başına kullanıcı tarafından başlatılan en fazla 4 üretim işlemi / kayan 24 saat uygulanır.
8. Plan + aşama başına en fazla 2 üretim işlemi / kayan 24 saat uygulanır.
9. Kullanıcı başına `status` değerinden bağımsız en fazla 3 fiziksel olarak silinmemiş plan tutulur; MVP'de ayrı arşiv durumu yoktur.
10. Token sınırları rota için 12.000 input / 2.000 output, detay için 24.000 input / 8.000 output'tur.
11. Her kullanıcı işlemi için en fazla bir repair veya sağlayıcı retry yapılır.
12. Güncel snapshot provenance'ı aynı `input_hash` değerini taşıdığı için sonucu döndüren idempotent cache hit kota sayacını ve AI bütçesini tüketmez.
13. Global aylık uygulama budget değeri başlangıçta 7 USD olur; kalan yaklaşık 3 USD domain amortismanı ve hata payıdır.
14. OpenAI proje harcama uyarısı ayrıca açılır.
15. Web search, file search ve diğer ücretli model araçları kullanılmaz.

Beklenen normal aylık toplam: 1-7 USD AI + alan adının aylıklaştırılmış maliyeti ve küçük hata payı; toplam sert hedef 10 USD'dir. Trafik veya model kullanımı bütçe sınırına yaklaşırsa yeni üretim güvenli biçimde durdurulur; kayıtlı planlar okunmaya devam eder.

## 14. Teknik kararların gerekçeleri

### Seçilen mimari

- Frontend: Next.js App Router + React + TypeScript
- Backend/API: Aynı projede Next.js Route Handlers; ince monolit
- Authentication: Supabase Auth e-posta OTP + cookie session; public e-posta için Resend SMTP
- Database: Supabase PostgreSQL + RLS; plans, feedback ve generation_runs
- AI: OpenAI Responses API + GPT-5.6 Luna + Structured Outputs
- İçerik/veri yönetimi: Server-only, sürüm kontrollü doğrulanmış JSON + Zod şeması
- Harita: Doğrulanmış Google Maps URLs; API anahtarı veya gömülü harita yok
- Deployment: Vercel Hobby + Supabase Free + Resend Free
- Logging: Platform logları + kişisel veri içermeyen generation_runs
- Test: Vitest + React Testing Library + Playwright + RLS testleri + küçük AI eval seti

### Karar özeti

| Parça | Neden seçtik? | En güçlü alternatif | Neden seçmedik? | Bedel / trade-off |
| --- | --- | --- | --- | --- |
| Next.js frontend | Tek repo ve backend ile tek deployment; güçlü TypeScript/Codex ekosistemi | React + Vite | Ayrı backend deployment gerekir | Framework ve server/client sınırı öğrenme yükü |
| Route Handlers backend | Gizli anahtar ve kuralları ayrı sunucu işletmeden korur | FastAPI | İki uygulama, CORS, ayrı host ve bütçe | Next.js'e runtime bağımlılığı |
| Supabase Auth | Database/RLS ile aynı kimlik sistemi; OTP gereksinimini karşılar | Clerk | İkinci auth vendor ve JWT entegrasyonu | Resend + domain kurulumu |
| Supabase Postgres | Auth, SQL, RLS ve yönetilen veri tek yerde | Neon | Auth/authorization ayrıca kurulmalı | Free pause/backup sınırı ve platform bağımlılığı |
| OpenAI Luna | En düşük karşılaştırılan resmi fiyat, Structured Outputs, resmi JS SDK | Gemini Flash-Lite | Daha yüksek mevcut token fiyatı | Model sağlayıcı bağımlılığı; kalite eval'i şart |
| Server-only JSON içerik | Pilot, tek editör, diff ve rollback için en basit yol | Supabase içerik tabloları | Şu an gereksiz schema/edit iş akışı | Güncelleme için deploy, düşük büyüme kapasitesi |
| Vercel Hobby | Next.js için en düşük deployment ve bakım yükü | Cloudflare Workers | OpenNext ve farklı runtime test yükü | Ticari kullanım yok; büyümede host kararı açılır |
| Vitest + Playwright | Hızlı kurallar testi + gerçek tarayıcı ana akışı | Jest + Cypress | İki ekosistemde daha fazla başlangıç konfigürasyonu | İki test aracı öğrenilir |

### Dört soruluk öğretici özet

| Parça | Bu parça nedir? | Bu projede ne yapar? | Olmasaydı ne olurdu? | Neden bu çözüm? |
| --- | --- | --- | --- | --- |
| Frontend | Tarayıcıdaki kullanıcı katmanı | Soru, onay, karşılaştırma ve plan ekranlarını sunar | Kullanıcı sistemi kullanamaz | Next.js aynı repo içinde UI ve backend sağlar |
| Backend/API | Güvenilen sunucu sınırı | Auth, validation, iş kuralı, AI ve kayıt işlemlerini yürütür | Anahtar açığa çıkar, kurallar atlanır | Route Handlers ayrı sunucu işletmeden gerçek backend öğretir |
| Authentication | Kimlik ve oturum sistemi | Planı doğrulanmış kullanıcıya bağlar | Plan sahipliği kurulamaz | Supabase Auth, Postgres RLS ile doğrudan bütünleşir |
| Database | Kalıcı veri deposu | Taslak, plan, feedback ve maliyet metadatasını saklar | Plan yeniden açılamaz | Supabase standart Postgres + yönetilen RLS sunar |
| AI/LLM | Sınırlandırılmış seçim ve anlatım motoru | Doğrulanmış adayları profile göre sıralar | Deterministik fallback çalışabilir, kişiselleştirme azalır | Luna düşük maliyetli ve Structured Outputs desteklidir |
| Doğrulanmış içerik | İnsan kontrolündeki gerçek kaynağı | Yer, link, tarih ve kritik bilgiyi güvenilir tutar | AI hafızası gerçek kaynağına dönüşür ve güven vaadi bozulur | JSON pilotta en ucuz, incelenebilir ve geri alınabilir yoldur |
| Harita bağlantısı | Harici konum açma yöntemi | Park, yemek ve deneyimi doğrudan açar | Kullanıcı yeniden arama yapar | Maps URLs anahtarsız ve cihazlar arası çalışır |
| Deployment | Uygulamayı internette çalıştıran ortam | Web ve API'yi public HTTPS adresinde sunar | MVP yalnız yerelde kalır | Vercel Next.js için en az operasyon yükünü getirir |
| Logging | Hata ve kullanım izi | Sorun, token, latency ve maliyeti gösterir | Hata ve bütçe kör noktası oluşur | Platform logu + ledger yeni bir servis gerektirmez |
| Test | Davranışı tekrarlanabilir doğrulama sistemi | Kuralları, RLS'yi, API'yi ve ana akışı kontrol eder | AI/Codex değişiklikleri güvenle kabul edilemez | Vitest hızlı mantık, Playwright gerçek tarayıcı kanıtı sağlar |
| Güvenlik | Birden çok katmandaki risk kontrolleri | Anahtar, kullanıcı verisi, bütçe ve AI çıktısını korur | Public MVP kötüye kullanıma ve veri sızıntısına açık olur | Auth + RLS + server validation + quota birlikte gerekir |

### Öğrenme hedefi

Bu mimari her alanı saklamaz; yönetilebilir sınırlar oluşturur:

- Frontend: form state, koşullu UI, loading/error, responsive plan görünümü
- Backend/API: HTTP isteği, auth kontrolü, validation, iş kuralı, dış servis çağrısı
- Database: tablo, JSONB, migration, sorgu ve RLS
- Authentication: kimlik, session ve authorization farkı
- AI: prompt değil; bağlam seçimi, schema, validation, eval ve maliyet
- Deployment: environment variable, preview/production ve log
- Güvenlik/test: bir kontrolün neden hem uygulama hem database düzeyinde bulunduğu

Hedef, her alanda uzmanlık değil; bu parçanın ne yaptığını, veri akışındaki yerini, neden seçildiğini, nasıl test edildiğini ve bozulursa ilk nereye bakılacağını açıklayabilmektir.

## 15. MVP dışında bırakılan teknik özellikler

Aşağıdakiler bugünkü mimariye geri eklenmez:

- Gerçek zamanlı trafik veya yol durumu
- Canlı fiyat, canlı çalışma saati, doluluk veya otomatik güncellik
- Rezervasyon, ödeme, tur satışı, affiliate ve partner entegrasyonu
- Otel/Airbnb veya araç firması satın alma kararı
- Sosyal ağ, kullanıcılar arası yorum ve yorum analizi
- Gelişmiş admin paneli veya headless CMS
- Haritada şehir sürükleme, manuel rota editörü ve serbest rota birleştirme
- Tam offline kullanım ve PWA senkronizasyon sistemi
- Canlı anlık asistan ve sınırsız plan yeniden üretimi
- Websocket, queue, event bus, üretim cron pipeline'ı ve background worker; yalnız 35 günlük `generation_runs` retention temizliği istisnadır
- Mikroservis, Kubernetes, container orchestration ve çok bölgeli mimari
- Redis veya ayrı cache servisi
- Vector database, embeddings ve genel RAG platformu
- Kullanıcı dosya yükleme ve object storage
- Gelişmiş üyelik/profil/rol sistemi
- Özel analytics warehouse veya data pipeline
- Birden fazla LLM sağlayıcısına otomatik failover
- Model fine-tuning

## 16. Yeniden değerlendirme koşulları

Bir koşul gerçekleşmeden mimari sırf gelecekte gerekebilir diye büyütülmez.

| Koşul | Yeniden açılacak karar |
| --- | --- |
| Reklam, affiliate, ödeme veya ticari gelir başlar | Vercel Hobby yerine ücretli veya ticari kullanıma uygun host |
| Supabase Free pause kabul edilemez hale gelir; backup/SLA gerekir | Supabase Pro veya başka Postgres hostu |
| Veritabanı 400 MB'a, egress 4 GB'a veya gerçek kota limitlerine yaklaşır | Veri boyutu, arşiv, ücretli plan |
| İçerik birkaç pilot destinasyonu aşar, yüzlerce kayıt olur veya haftalık sık edit gerekir | JSON -> içerik tabloları veya CMS |
| İçeriği geliştirici olmayan ikinci kişi yönetir | Basit admin/editoryal iş akışı |
| JSONB içindeki alanlar üzerinden raporlama ve çapraz sorgu gerekir | Plan şemasını normalize etme |
| AI maliyeti aylık 7 USD sınırına veya plan başına 0.05 USD üstüne düzenli çıkar | Prompt daraltma, model veya deterministic fallback |
| Luna kalite eval eşiklerini karşılamaz | Terra/Gemini/Claude karşılaştırmalı eval; yalnız kanıtla model değişimi |
| Model deprecate olur veya fiyatı anlamlı değişir | Model sürümü ve maliyet kararı |
| Üretim sık sık host zaman aşımına uğrar veya 60 saniyeyi aşar | Async job/queue ve polling |
| Dar database transaction lock'ları + partial unique index tabanlı atomik rezervasyon gerçek yükte yetersiz kalırsa | Queue veya daha güçlü merkezi rezervasyon mekanizması |
| Kullanıcılar rota veya günü elle değiştirmek ister ve test kanıtı güçlüdür | Plan veri modeli ve editör kapsamı |
| Gerçek zamanlı trafik/fiyat ürün değerinin kanıtlanmış parçası olur | Ayrı dış veri sağlayıcısı ve cache politikası |
| Hata sayısı platform loglarıyla yönetilemez | Sentry veya eşdeğer observability |
| Paylaşılabilir public plan gerekir | Ayrı, salt-okunur paylaşım yetki modeli |
| Tam offline kullanım kanıtlanmış ihtiyaç olur | PWA cache, conflict ve sync mimarisi |
| Birden fazla geliştirici düzenli çalışır | Ortam, rol, review ve deployment süreçleri |
| Ödeme, dosya yükleme, public paylaşım, admin/editör rolü, yeni veri işleyici veya güvenlik olayı/test ihlali ortaya çıkar | ADR-010 güvenlik sınırı ve veri akışları |
| CI testleri tekrarlı biçimde flaky/yavaş olur, gerçek tarayıcı-runtime hatası kaçırır veya eval regresyonu yakalayamaz | ADR-011 test araçları, ortamı ve katmanları |
| Tekrarlayan model/schema hatası kaliteyi engeller veya bütçe yeni üretimi uzun süre durdurur | İlk release dışında tutulan deterministik fallback yaklaşımı |

## Resmi teknik kaynaklar

Bu kaynaklar ana teknik kararlar için 12 Ağustos 2026 tarihinde kullanılmıştır. OpenAI standart işleme fiyatı ve Resend Free limitleri 4 Eylül 2026 tarihinde resmi sayfalardan yeniden doğrulanmıştır.

- Next.js genel dokümantasyon: https://nextjs.org/docs
- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Next.js Vitest: https://nextjs.org/docs/app/guides/testing/vitest
- Next.js Playwright: https://nextjs.org/docs/app/guides/testing/playwright
- Vercel fiyatlandırma ve Hobby kullanım sınırı: https://vercel.com/pricing
- Supabase fiyatlandırma: https://supabase.com/pricing
- Supabase e-posta OTP: https://supabase.com/docs/guides/auth/auth-email-passwordless
- Supabase auth rate limits: https://supabase.com/docs/guides/auth/rate-limits
- Supabase custom SMTP: https://supabase.com/docs/guides/auth/auth-smtp
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Next.js auth: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Resend fiyatlandırma: https://resend.com/pricing
- Resend + Supabase SMTP: https://resend.com/docs/send-with-supabase-smtp
- OpenAI model seçimi: https://developers.openai.com/api/docs/models
- OpenAI model karşılaştırma: https://developers.openai.com/api/docs/models/compare
- OpenAI API fiyatlandırma: https://developers.openai.com/api/docs/pricing
- OpenAI Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI API anahtar güvenliği: https://developers.openai.com/api/reference/overview/
- Google Maps URLs: https://developers.google.com/maps/documentation/urls/get-started
- Cloudflare Workers fiyatlandırma: https://developers.cloudflare.com/workers/platform/pricing/
- Cloudflare Next.js/OpenNext: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- Railway fiyatlandırma: https://docs.railway.com/pricing/plans
- Clerk fiyatlandırma: https://clerk.com/pricing
- Clerk e-posta OTP: https://clerk.com/docs/guides/development/custom-flows/authentication/email-sms-otp
- Neon planları: https://neon.com/docs/introduction/plans
- Firebase fiyatlandırma: https://firebase.google.com/pricing
- Firebase e-posta linki: https://firebase.google.com/docs/auth/web/email-link-auth
- Gemini fiyatlandırma: https://ai.google.dev/gemini-api/docs/pricing
- Gemini güncel modeller: https://ai.google.dev/gemini-api/docs/latest-model
- Gemini Structured Outputs: https://ai.google.dev/gemini-api/docs/structured-output
- Claude modelleri ve fiyatları: https://docs.anthropic.com/en/docs/about-claude/models/overview
- Claude Structured Outputs durumu: https://docs.anthropic.com/en/release-notes/api
- Sentry fiyatlandırma: https://sentry.io/pricing/

## Kanban'a geçiş

Bu teknik plan, `data-contracts(4).md` ve `decision-log(4).md` ile birlikte kabul edilmiş Kanban baseline'ıdır. Bundan sonraki çalışma:

1. Teknik planı çalışan, birkaç saatlik ve test edilebilir Kanban kartlarına bölmek.
2. Her kartın kabul ölçütünü ilgili contract, ADR ve test katmanına bağlamak.
3. Codex'te aynı anda yalnız bir ana kartı uygulamak.
