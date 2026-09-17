# Data Contracts

- **Belge durumu:** Kanban için kabul edilmiş MVP sözleşmesi v1.0
- **Kapsam:** Yalnızca ilk değerli akış
- **Tarih:** 19 Ağustos 2026
- **Son teknik uzlaştırma ve belge temizliği:** 4 Eylül 2026

## 1. Amaç ve kapsam

Bu belge; Balkan Rehberim'in ilk değerli MVP akışında frontend, backend, kalıcı veri, doğrulanmış seyahat içeriği ve AI arasındaki temel veri sözleşmelerini tanımlar. Bütün gelecekteki sistemi modellemez.

Ana kaynaklar:

1. `1-)PROBLEM_BALKANLAR_SON_REVIZE.docx`: ürün problemi, hedef kullanıcı ve MVP sınırı.
2. `2-)Mehmet_Ayse_Mock_Plan_Ciktisi_Guncellenmis_v3.docx`: beklenen kullanıcı çıktısının kapsam ve sunum kontrolü.
3. `3-)Bilgi_Mimarisi_v1_0_Tamamlandi(2).docx`: soru envanteri, bilgi alanları ve kullanıcı akışı.
4. `technical-plan(6).md`: seçilen mimari, minimum veri modeli, iki aşamalı AI üretimi, güvenlik ve hata davranışları.
5. `decision-log(4).md`: kabul edilen teknik kararlar ve yeniden değerlendirme koşulları.

Güncel ürün belgesindeki Arnavutluk + Karadağ ve 4-6 gün sınırı, eski ürün kopyalarındaki daha geniş 4-8 gün ifadesinin yerine esas alınmıştır.

Bilgi mimarisi dosyası yalnız alan adlarını ve kullanıcı akışını çapraz kontrol etmek için incelenmiştir; bu belgeye MVP kapsamını genişleten yeni bir nesne taşınmamıştır.

Bu belgenin kuralları:

- Plan, kullanıcıya ait tek aggregate'tir; MVP'de her aşama için ayrı tablo kurulmaz.
- Ham AI çıktısı hiçbir zaman doğrudan kullanıcı planı sayılmaz.
- AI gerçeklerin kaynağı değildir; yalnız doğrulanmış adayları seçer, sıralar ve gerekçelendirir.
- İsim, koordinat, harita URL'si, doğrulama tarihi, çalışma saati, fiyat ve kritik gerçek yalnız doğrulanmış içerikten gelir.
- Başarılı rota ve ayrıntılı plan sonuçları snapshot olarak saklanır; yeniden açılışta AI çağrılmaz.
- Aşağıdaki karakter, seçim ve dizi sınırları mimari karar değil, sözleşme güvenlik sınırıdır. Kullanıcı testiyle değiştirilebilir; değiştiğinde contract sürümü artırılır.

## 2. MVP veri akışı

| Aşama | Oluşan / okunan veri | Değişen ve kalıcı saklanan veri | Yalnız geçici veri | AI'ya giden | AI'dan dönen |
| --- | --- | --- | --- | --- | --- |
| 1. Kullanıcı doğrulama | E-posta ve OTP auth sağlayıcısı tarafından işlenir; uygulama doğrulanmış `user_id` okur. | Güvenli oturum auth katmanında tutulur. E-posta plan verisine veya loglara kopyalanmaz. | OTP form state'i. | Yok. | Yok. |
| 2. Plan oluşturma | Oturumdaki `user_id` okunur. | `Plan` oluşturulur: `status=draft`, `answers.revision=0`, boş `answers.values`, zaman damgaları. | Frontend yüklenme/kaydetme durumu. | Yok. | Yok. |
| 3. Planlama soruları | `QuestionCatalog`, mevcut `PlanAnswers` ve önceki cevaplara bağlı görünürlük kuralları okunur. | Geçerli cevaplar debounce ve adım geçişinde `answers` içine kaydedilir. | Gösterilecek sonraki soru, alan hataları, kaydetme bekleme durumu. | Yok. | Yok. |
| 4. Seyahat profili onayı | Tam ve geçerli `PlanAnswers` ile desteklenen kapsam kuralları okunur. | Backend değişmez `TravelProfileSnapshot` üretir; `status=profile_confirmed` olur. | Kullanıcıya gösterilen özet görünümü. | Yok. Profil özeti AI tarafından üretilmez. | Yok. |
| 5. Rota önerileri | Profil snapshot'ı ve doğrulanmış `RouteTemplate` kayıtları okunur; backend uygunsuz adayları eler. | Doğrulanan ve hydrate edilen `RouteOptionsSnapshot` ile üretim provenance'ı saklanır; `status=routes_ready`. `GenerationRun` kaydedilir. | Filtrelenmiş `RouteCandidate[]`, kota/idempotency rezervasyonu, ham AI cevabı. | Kimliksiz kullanıcı profili alt kümesi ve filtrelenmiş rota adaylarının ID/özet alanları. | En fazla üç aday kimliği, önerilen aday, gerekçe kodları ve sınırlı açıklama metinleri. |
| 6. Rota seçimi | Bu plana ait kaydedilmiş rota seçenekleri okunur. | Seçilen rota seçeneği kimliği saklanır; `status=route_selected`. | Onay ekranı state'i. | Yok. | Yok. |
| 7. Ayrıntılı plan | Seçilen rota, profil ve yalnız bu rotaya bağlı doğrulanmış içerik adayları okunur. | Doğrulanıp hydrate edilen `DetailedPlanSnapshot` saklanır; `status=detail_ready`. `GenerationRun` kaydedilir. | Filtrelenmiş içerik paketi, ham AI cevabı, doğrulama sonucu. | Seçili rota çerçevesi, gerekli profil alt kümesi ve izin verilen içerik ID/planlama özetleri. | Gün sırası, adım türleri, içerik ID'leri, planlanan zaman blokları, gerekçeler ve gün düzeyinde Plan B düzeni. |
| 8. Planın kaydedilmesi | Her başarılı aşamanın doğrulanmış sonucu okunur. | Aşama güncellemesi atomik yapılır. Başarısız çağrı önceki başarılı alanı silmez. | Başarı/hata bildirimi. | Yok. | Yok. |
| 9. Daha sonra yeniden açma | Oturum, plan sahipliği ve `Plan` snapshot'ları okunur. | Normal okumada veri değişmez. | Sayfa render state'i. | Yok. | Yok. |
| 10. Feedback | `plan_id`, oturum kullanıcısı ve form verisi okunur. | `Feedback` planla ve kullanıcıyla ilişkilendirilerek saklanır. | Form hataları ve gönderim durumu. | Yok. | Yok. |

Ana durum ilerleyişi:

`draft -> profile_confirmed -> routes_ready -> route_selected -> detail_ready`

Plan.status yalnız son başarılı iş aşamasını temsil eder. Üretim başarısızlığı plan durumuna eklenmez; GenerationRun.status=failed ve runtime ApiError ile temsil edilir. Başarısızlıkta son başarılı plan snapshot'ı ve Plan.status korunur.

## 3. Temel domain nesneleri

### UserIdentityRef

**Amaç:** Plan sahipliği ve yetkilendirme için auth sağlayıcısından gelen kullanıcı kimliğini temsil eder; gelişmiş kullanıcı profili değildir.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `user_id` | Doğrulanmış kullanıcı kimliği | UUID | Zorunlu | Oturumdan alınır; request body'den kabul edilmez | Auth servisi |

**İlişkileri:** Bir kullanıcı birden fazla `Plan` ve `Feedback` sahibi olabilir.
**Yaşam döngüsü:** OTP doğrulandığında oturuma gelir; her plan isteğinde okunur. E-posta AI'ya, plan JSON'una veya uygulama loguna taşınmaz.

### Plan

**Amaç:** Kullanıcının taslaktan kaydedilmiş ayrıntılı plana kadar bütün MVP sürecini taşıyan aggregate'tir.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `id` | Plan kimliği | UUID | Zorunlu | Backend üretir; değişmez | Backend |
| `user_id` | Plan sahibi | UUID | Zorunlu | Oturum kullanıcısıyla eşleşir; RLS ile korunur | Auth/backend |
| `status` | Son başarılı iş aşaması | enum | Zorunlu | `draft`, `profile_confirmed`, `routes_ready`, `route_selected`, `detail_ready`; `failed` bu enum'a ait değildir | Backend state machine |
| `answers` | Backend tarafından doğrulanmış canonical cevap snapshot'ı | `PlanAnswers` | Zorunlu | Catalog sürümüne ve koşullu zorunluluğa uyar | Kullanıcı/backend |
| `profile_snapshot` | Onaylanmış normalize profil | `TravelProfileSnapshot` | Koşullu | Yalnız profil onayından sonra; yeni cevap değişikliğinde geçersizleştirilir | Backend |
| `route_options` | Hydrate edilmiş rota seçenekleri | `RouteOptionsSnapshot` | Koşullu | Yalnız doğrulanmış AI sonucu sonrası | Backend + AI + doğrulanmış içerik |
| `selected_route_option_id` | Bu planda seçilen seçenek | string/UUID | Koşullu | `route_options.options[].route_option_id` içinde bulunmalı | Kullanıcı/backend |
| `detailed_plan` | Kaydedilmiş ayrıntılı plan | `DetailedPlanSnapshot` | Koşullu | Yalnız seçili rota ve başarılı domain validation sonrası | Backend + AI + doğrulanmış içerik |
| `created_at` | Oluşturulma anı | ISO 8601 datetime | Zorunlu | Sunucu zamanı | Database |
| `updated_at` | Son kalıcı değişiklik | ISO 8601 datetime | Zorunlu | Sunucu zamanı, monoton | Database |

**İlişkileri:** Bir `Plan`, bir `PlanAnswers`, sıfır veya bir `TravelProfileSnapshot`, sıfır veya bir `RouteOptionsSnapshot`, sıfır veya bir `DetailedPlanSnapshot`, sıfır veya bir `Feedback` ve birden fazla `GenerationRun` içerir.
**Yaşam döngüsü:** Yeni planla oluşur; cevap, profil, rota, seçim ve detay aşamalarında güncellenir; daha sonra snapshot olarak okunur. Kullanıcı planı silerse plan ve feedback silinir; `GenerationRun.plan_id` null yapılır ve kişisel veri içermeyen ledger kendi 35 günlük saklama süresini tamamlar.

### QuestionCatalog

**Amaç:** Koşullu planlama sorularının frontend ve backend tarafından aynı anlam, tip, sınır ve etki kurallarıyla yorumlanmasını sağlayan sürümlü uygulama konfigürasyonudur. Database tablosu olmak zorunda değildir.

MVP için başlangıç catalog sürümü `1.0.0` olarak kabul edilir. Frontend soru seçeneklerini, görünürlük kurallarını ve alan sınırlarını bu catalog'dan kullanır; backend aynı catalog ile cevap doğrulaması, canonical `PlanAnswers` üretimi ve profil oluşturma işlemlerini yapar. Frontend ve backend içinde ayrı soru ID'si, enum veya doğrulama listeleri tutulmaz.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `catalog_version` | Soru sözleşmesi sürümü | string | Zorunlu | MVP başlangıç sürümü `1.0.0`; yayımlanmış sürüm sessizce değiştirilmez | Sözleşme |
| `questions` | Soru tanımları | array | Zorunlu | ID'ler benzersiz; yalnız MVP planlama soruları | Ürün sözleşmesi |
| `questions[].id` | Değişmez makine kimliği | string | Zorunlu | `^[a-z][a-z0-9_]{2,63}$`; aynı anlam için sürümler arasında gereksiz değiştirilmez | Sözleşme |
| `questions[].value_type` | Cevap biçimi | enum | Zorunlu | `single`, `multi`, `integer`, `content_id`, `content_id_list`, `object` | Sözleşme |
| `questions[].requirement` | Zorunluluk | enum | Zorunlu | `required`, `conditional`, `optional` | Ürün |
| `questions[].allowed_values` | İzin verilen enum veya içerik ID'leri | string[] | Koşullu | Tek kaynak catalog'dur; UI ve backend ayrı sabit listeler tanımlamaz | Ürün / doğrulanmış içerik |
| `questions[].visible_if` | Koşullu görünürlük kuralı | sınırlı kural nesnesi | Koşullu | Yalnız catalog içindeki önceki soru ID'lerine ve izin verilen değerlere başvurur | Ürün |
| `questions[].constraints` | Min/max/seçim sayısı/uzunluk gibi sınırlar | nesne | Koşullu | `value_type` ile uyumlu olmalı | Sözleşme |
| `questions[].impact` | Cevabın downstream etkisi | enum | Zorunlu | `eligibility`, `route`, `detail` | Ürün + sözleşme |

#### `visible_if` sınırlı kural dili

Koşullu görünürlük keyfi kod veya kullanıcı metni çalıştırmaz. `QuestionCatalog v1.0.0` yalnız şu recursive grammar'ı kabul eder:

- `{ "equals": { "question_id": "...", "value": <allowed machine value> } }`
- `{ "in": { "question_id": "...", "values": [<allowed machine values>] } }`
- `{ "all": [<visible_if rule>, ...] }`
- `{ "any": [<visible_if rule>, ...] }`

Bir kural yalnız envanterde kendisinden önce gelen soru ID'sine başvurabilir. `equals.value` ve `in.values[]`, referans verilen sorunun izinli machine değerleriyle tip olarak eşleşir. `all` ve `any` dizileri 1-5 kural taşır; bilinmeyen operatör, boş grup veya serbest expression reddedilir.

#### `impact` anlamı

- `eligibility`: Cevap, kullanıcının desteklenen MVP akışına uygun olup olmadığını belirler. Desteklenen kapsam dışına çıkan cevapta yeni rota veya detay üretimi yapılmaz.
- `route`: Cevap rota seçimini veya sıralamasını etkiler. Böyle bir cevap değiştiğinde mevcut onaylanmış profil ve ona bağlı `route_options`, `selected_route_option_id` ve `detailed_plan` artık geçerli kabul edilmez.
- `detail`: Cevap seçilmiş genel rotayı değiştirmez; yalnız ayrıntılı plan içeriğini etkiler. Böyle bir cevap değiştiğinde mevcut rota seçenekleri ve seçilmiş rota korunabilir, ancak `detailed_plan` yeniden üretilmeden geçerli kabul edilmez.

#### Canonical cevap kuralları

- `PlanAnswers.values` yalnız ilgili `catalog_version` tarafından bilinen soru ID'lerini içerir.
- Bilinmeyen soru ID'leri backend tarafından reddedilir.
- Her cevap kendi `value_type`, `allowed_values`, `requirement`, `visible_if` ve `constraints` kurallarına göre backend tarafından yeniden doğrulanır.
- Bir soru `visible_if` koşulu nedeniyle artık aktif değilse tek başına geçerli olan önceki cevap `PlanAnswers.values` içinde pasif/dormant olarak korunabilir.
- Backend her kullanımda `values` ve catalog görünürlük kurallarından kalıcı olmayan `active_values` görünümü türetir. Pasif cevaplar `active_values`, `TravelProfileSnapshot`, uygunluk kontrolü, AI input'u veya `input_hash` üzerinde etkili olamaz.
- Pasif bir cevap yeniden aktif olduğunda güncel catalog'a göre tekrar doğrulanmadan `active_values` içine alınmaz.
- `conditional` bir soru yalnız görünürlük koşulu sağlandığında zorunlu kabul edilir.
- Bir enum değerinin kullanıcıya gösterilen etiketi değişebilir; ancak machine value anlamı değiştirilmeden yeniden kullanılmaz.

#### Sürümleme kuralı

Aşağıdaki değişikliklerden biri mevcut plan cevaplarının anlamını veya doğrulanmasını değiştiriyorsa yeni `catalog_version` oluşturulur:

- soru ID'sinin veya anlamının değişmesi,
- `value_type` değişmesi,
- machine enum değerlerinin eklenmesi, kaldırılması veya anlam değiştirmesi,
- `requirement` veya `visible_if` davranışının değişmesi,
- plan sonucunu etkileyen `constraints` değişikliği,
- `impact` sınıfının değişmesi.

Mevcut plan, oluşturulduğu `catalog_version` ile ilişkilendirilmeye devam eder; eski plan yeniden açıldığında cevapların hangi sözleşmeyle oluşturulduğu kaybolmaz.

#### QuestionCatalog v1.0.0 — MVP makine sözleşmesi

Aşağıdaki envanter, Bilgi Mimarisi'nde tanımlanan planlama kararlarının MVP için kullanılacak stable machine ID, cevap tipi, zorunluluk, temel enum/constraint ve downstream etki karşılıklarını tanımlar. Kullanıcıya gösterilen soru ve seçenek metinleri değişebilir; burada tanımlanan machine ID ve machine value'lar contract sürümü değiştirilmeden anlam değiştirmez.

`QuestionCatalog v1.0.0` yalnız güncel MVP kapsamını temsil eder. Bilgi Mimarisi'ndeki desteklenmeyen kullanıcı seçenekleri yalnız uygunluk kontrolünün gerektirdiği durumlarda catalog'da tutulur; desteklenen profil veya AI input'u olarak kullanılamaz.

| Sıra | `questions[].id` | `value_type` | `requirement` | `impact` | İzin verilen değer / temel constraint |
| --- | --- | --- | --- | --- | --- |
| 1 | `traveler_group` | `single` | `required` | `eligibility` | `couple`, `solo`, `friends`, `family`, `family_with_children`; MVP'de yalnız `couple` desteklenir |
| 2 | `transport_mode` | `single` | `required` | `eligibility` | `rental_car`, `own_car`, `public_transport`, `undecided`; MVP'de `rental_car` desteklenir, `undecided` yalnız kiralık araç varsayımı açıkça kabul edilirse devam edebilir |
| 2A | `rental_car_assumption` | `single` | `conditional` | `eligibility` | `accepted`; `visible_if={"equals":{"question_id":"transport_mode","value":"undecided"}}` |
| 3 | `travel_time_certainty` | `single` | `required` | `route` | `exact_dates`, `flexible_month`, `unknown`; `unknown` ile rota üretimine geçilemez |
| 4A | `travel_dates` | `object` | `conditional` | `route` | `visible_if` kesin tarih; `{start_date,end_date}`; başlangıç/bitiş dahil 4-6 gün |
| 4B | `travel_month` | `object` | `conditional` | `route` | `visible_if` esnek ay; `{year,month}` |
| 4C | `duration_days` | `integer` | `conditional` | `route` | `visible_if` esnek ay; `4..6`; kesin tarihte backend hesaplar |
| 5 | `arrival` | `object` | `required` | `route` | `{location_id,time_known,local_time}`; stable `location` ID zorunlu |
| 6 | `departure` | `object` | `required` | `route` | `{location_id,time_known,local_time}`; stable `location` ID zorunlu |
| 7 | `rental_car_locations` | `object` | `conditional` | `route` | durum: `both_known`, `pickup_known`, `dropoff_known`, `system_recommend`; seçime göre pickup/dropoff konumları gerekir |
| 8 | `accommodation_status` | `single` | `required` | `route` | `none_booked`, `all_booked`, `partially_booked` |
| 9 | `existing_accommodations` | `object` | `conditional` | `route` | Kesin tarihlerle birlikte kısmen/tamamen ayarlanmışsa görünür; `1..duration_days-1` (MVP'de en fazla 5) verified konum/konaklama üssü + check-in/check-out kaydı; serbest adres rota kısıtı olmaz |
| 10 | `destination_preference_ids` | `content_id_list` | `optional` | `route` | 0-3 benzersiz desteklenen ülke/bölge ID'si; boş liste sistemin önermesi anlamına gelir |
| 11 | `pace` | `single` | `required` | `route` | `relaxed`, `balanced`, `intensive` |
| 12 | `budget_band` | `single` | `required` | `route` | `economy`, `economy_mid`, `mid`, `comfortable` |
| 13 | `trip_priority_tags` | `multi` | `required` | `route` | 1-3: `beach_sea`, `nature_scenery`, `history_culture`, `iconic_must_see`, `photo_social`, `local_food`, `nightlife`, `relaxation`, `romantic`, `activities_adventure`, `scenic_drives`, `shopping` |
| 14 | `accommodation_priority_tags` | `multi` | `conditional` | `route` | tam 2: `budget`, `proximity`, `easy_parking`, `quiet`, `sea_view`, `dining_nightlife`; yalnız ayarlanmamış gece varsa |
| 15 | `dietary_restrictions` | `object` | `required` | `detail` | `{tags,note?}`; `none`, `halal`, `vegetarian`, `vegan`, `gluten_free`, `allergy`, `other`; `none` tek başına |
| 16 | `food_preference_tags` | `multi` | `optional` | `detail` | 0-2 veya yalnız `system_decide`; diğer değerler: `local_popular`, `budget`, `trusted_high_rated`, `turkish_palate`, `scenic_romantic`, `quick_practical`, `grill_meat`, `seafood` |
| 17 | `parking_priority` | `single` | `required` | `detail` | `nearest`, `economy`, `easy_safe`, `balanced` |
| 18 | `walking_tolerance` | `single` | `required` | `detail` | `max_5_min`, `up_to_15_min`, `up_to_20_min`, `flexible` |
| 19 | `night_driving_preference` | `single` | `required` | `route` | `acceptable`, `avoid`, `never` |
| 20 | `must_have_experiences` | `object` | `optional` | `route` | `{experience_ids}`; 0-5 benzersiz verified `experience` ID; v1'de serbest metin yok |

##### Object cevap alt sözleşmeleri

- `travel_dates = {start_date: YYYY-MM-DD, end_date: YYYY-MM-DD}`. `visible_if={"equals":{"question_id":"travel_time_certainty","value":"exact_dates"}}`; bitiş başlangıçtan önce olamaz ve dahilî gün sayısı 4-6 olmalıdır.
- `travel_month = {year: integer, month: integer}`. `visible_if={"equals":{"question_id":"travel_time_certainty","value":"flexible_month"}}`; `year` içinde bulunulan yıl ile sonraki iki yıl, `month` 1-12 arasındadır.
- `duration_days` aynı `flexible_month` koşuluyla aktiftir ve 4-6 arasındadır.
- `arrival` ve `departure = {location_id: string, time_known: boolean, local_time?: "HH:mm"}`. `location_id` uygun `location_kind` değerine sahip verified `location` kaydıdır; `time_known=true` ise `local_time` zorunlu, aksi halde yasaktır.
- `rental_car_locations = {status, pickup_location_id?, dropoff_location_id?}`. `status`, `both_known`, `pickup_known`, `dropoff_known`, `system_recommend` değerlerinden biridir. Bilinen her uç için verified `location` ID zorunludur; `system_recommend` ile iki ID de gönderilmez.
- `existing_accommodations = {stays:[{stay_anchor_id,start_date,end_date}]}`. Görünürlük kuralı, `travel_time_certainty=exact_dates` ile `accommodation_status` değerinin `all_booked` veya `partially_booked` olmasını `all` içinde birlikte arar. Her kayıtta `start_date` check-in, `end_date` check-out günüdür; `end_date > start_date` olmalı, `[start_date,end_date)` aralıkları çakışmamalı ve seyahatin gece aralığında kalmalıdır. `all_booked` bütün `duration_days - 1` geceyi tam bir kez kapsar; `partially_booked` boş gece bırakabilir. `stay_anchor_id`, global olarak benzersiz bir `VerifiedContentRecord.id` değeridir ve yalnız `location` veya `accommodation_base` türüne referans verebilir; serbest adres v1'de rota kısıtı olarak kabul edilmez.
- `dietary_restrictions = {tags:string[], note?:string}`. `tags` benzersiz ve en az bir değerdir; `none` başka tag ile birleşmez. `note` yalnız `allergy` veya `other` varsa, trim sonrası 1-200 karakterdir ve AI'ya gönderilmez.
- `must_have_experiences = {experience_ids:string[]}`. Dizi 0-5 benzersiz verified `experience` ID taşır; boş dizi sistem önerisine açık olmayı ifade eder. Arama sonucu bulunmayan metin v1'de kaydedilmez; kullanıcıya yalnız doğrulanmış listeden seçim yapması açıklanır.

`rental_car_locations.visible_if`, `transport_mode=rental_car` veya `rental_car_assumption=accepted` koşullarından en az biridir. `existing_accommodations.visible_if`, kesin tarih ile kısmen/tamamen ayarlanmış konaklama koşullarını birlikte arar. `accommodation_priority_tags.visible_if`, `accommodation_status` değerinin `none_booked` veya `partially_booked` olmasına dayanır. Bu koşullar yukarıdaki `all`/`any`/`in` grammar'ıyla machine-readable catalog içinde saklanır. `partially_booked` veya `all_booked` seçimi `exact_dates` olmadan profil onayında alan düzeyi validation hatasıdır; backend esnek ayı sessizce kesin tarihe dönüştürmez.

##### Canonical machine-value eşlemeleri

Bilgi Mimarisi'ndeki kullanıcıya gösterilen Türkçe metinler machine value değildir. MVP'de temel eşlemeler şöyledir:

- `Partnerimle / eşimle` → `couple`
- `Araç kiralayacağım` → `rental_car`
- `Kesin başlangıç ve bitiş tarihlerim var` → `exact_dates`
- `Seyahat edeceğim ay belli, tarihlerim esnek` → `flexible_month`
- `Sakin` → `relaxed`
- `Dengeli` → `balanced`
- `Yoğun` → `intensive`
- `Ekonomik` → `economy`
- `Ekonomik-orta` → `economy_mid`
- `Orta` → `mid`
- `Rahat` → `comfortable`
- `Gideceğim yere mümkün olduğunca yakın` → `nearest`
- `Ücretsiz veya uygun fiyatlı` → `economy`
- `Güvenli ve kolay girilip çıkılabilir` → `easy_safe`
- `Sistem fiyat-mesafe-erişim dengesine göre seçsin` → `balanced`
- `En fazla 5 dakika` → `max_5_min`
- `10-15 dakika` → `up_to_15_min`
- `20 dakikaya kadar` → `up_to_20_min`
- `Daha uzun yürümek sorun değil` → `flexible`
- `Gece araç kullanmak sorun değil` → `acceptable`
- `Mümkünse gece araç kullanmak istemiyorum` → `avoid`
- `Kesinlikle gece araç kullanmak istemiyorum` → `never`

##### Normalizasyon kuralları

- `travel_dates` kullanılıyorsa `duration_days` backend tarafından başlangıç ve bitiş günü dahil edilerek (`calendar_day_difference + 1`) hesaplanır; kullanıcıdan ikinci kez alınmaz.
- `travel_month` kullanılıyorsa `duration_days` ayrıca zorunludur.
- `transport_mode=rental_car` ise `TravelProfileSnapshot.rental_car_assumption=confirmed` üretilir.
- `transport_mode=undecided` ve `rental_car_assumption=accepted` ise desteklenen MVP akışı kiralık araç varsayımıyla devam eder ve `TravelProfileSnapshot.rental_car_assumption=user_accepted_assumption` üretilir.
- `destination_preference_ids=[]`, kullanıcının belirli bir bölgeyi zorunlu tutmadığını ve sistem önerisine açık olduğunu ifade eder.
- `must_have_experiences.experience_ids` içindeki en fazla beş doğrulanmış `experience` ID'si `TravelProfileSnapshot.must_have_experience_ids` alanına taşınabilir; v1'de serbest metin deneyim cevabı kabul edilmez.
- `dietary_restrictions` içindeki serbest açıklama AI'ya gönderilmez.
- `food_preference_tags=["system_decide"]` başka yemek tercihleriyle birlikte kullanılamaz.
- `dietary_restrictions.tags=["none"]` başka beslenme kısıtlarıyla birlikte kullanılamaz.
- `accommodation_priority_tags` yalnız ayarlanmamış geceler bulunduğunda aktif cevap kümesinin parçası olur.
- Bir soru `visible_if` koşulu nedeniyle artık aktif değilse tek başına geçerli önceki cevap `PlanAnswers.values` içinde dormant olarak korunur; ancak runtime `active_values` görünümünün parçası sayılmaz.
- Pasif koşullu cevaplar `TravelProfileSnapshot`, uygunluk kontrolü, rota/detail üretimi, AI input'u veya `input_hash` hesaplamasında kullanılamaz.
- Koşullu cevapların pasif hale gelmesi kullanıcı verisini sessizce silmez; yeniden aktif hale gelirlerse backend tarafından tekrar doğrulanmadan kullanılamazlar.

**İlişkileri:** `PlanAnswers.catalog_version` kullanılan catalog sürümüne referans verir. `PlanAnswers.values` tek tek geçerli aktif ve dormant cevapları saklar; backend catalog'a göre runtime `active_values` görünümünü türetir. `TravelProfileSnapshot` ham form state'inden değil, backend tarafından doğrulanmış `active_values` üzerinden üretilir. `questions[].impact`, cevap değişikliklerinde hangi downstream snapshot'ların geçersizleşeceğini belirler.

**Yaşam döngüsü:** `QuestionCatalog` repository ile sürümlenir ve paylaşılan domain contract'ın parçasıdır. Repository aşamasında machine-readable TypeScript/Zod karşılığı oluşturulur. Frontend görünürlük ve seçenekleri, backend doğrulama ve profil üretimi aynı catalog'dan tüketir. Ayrı `question-catalog.md` dosyası oluşturulmaz.

### PlanAnswers

**Amaç:** Kullanıcının planlama akışındaki otomatik kaydedilen, henüz profil olarak onaylanmamış cevaplarını temsil eder. Kalıcı saklanan `PlanAnswers`, frontend'deki geçici form state'i değil; ilgili `QuestionCatalog` sürümüne göre backend tarafından doğrulanmış ve canonical hale getirilmiş cevap snapshot'ıdır.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `catalog_version` | Cevapların bağlı olduğu soru sözleşmesi sürümü | string | Zorunlu | Mevcut veya desteklenen eski `QuestionCatalog` sürümlerinden biri olmalı | Backend |
| `revision` | Autosave ve onaylı değişiklik sırası | integer | Zorunlu | Plan oluştururken 0; her başarılı canonical cevap yazımında atomik olarak 1 artar | Backend |
| `values` | `questions[].id -> typed value` eşlemesi | object/map | Zorunlu | İlgili catalog'da tanımlı, tek başına geçerli aktif ve dormant cevaplar bulunabilir; her değer catalog tipi, izinli değerleri ve constraint'leriyle uyumlu olmalı | Kullanıcı + backend |
| `saved_at` | Son başarılı canonical otomatik kayıt zamanı | ISO 8601 datetime | Zorunlu | Sunucu zamanı | Backend |

#### Canonicalization kuralları

- Frontend, kullanıcının henüz kaydedilmemiş geçici form state'ini tutabilir; kalıcı `Plan.answers` alanına yalnız backend doğrulamasından geçmiş canonical `PlanAnswers` yazılır.
- Her PATCH isteği son başarılı `PlanAnswers.revision` değerini `expected_revision` olarak taşır. Backend yalnız eşleşme varsa canonical snapshot'ı yazar ve `revision` değerini transaction içinde bir artırır; eşleşmiyorsa `409 ANSWERS_VERSION_CONFLICT` ile sunucudaki son canonical cevap/revision'ı döndürür.
- `QuestionCatalog.questions[].id` içinde bulunmayan cevap anahtarları reddedilir.
- Her cevap ilgili `QuestionCatalog` sürümündeki `value_type`, `allowed_values`, `requirement`, `visible_if` ve `constraints` kurallarına göre doğrulanır.
- `conditional` bir soru yalnız `visible_if` koşulu sağlandığında aktif ve gerekiyorsa zorunlu kabul edilir.
- Bir soru daha sonra `visible_if` nedeniyle pasif hale gelirse tek başına hâlâ geçerli cevabı `values` içinde dormant olarak korunur; kullanıcı verisi sessizce silinmez.
- `active_values`, kalıcı ikinci alan değildir; backend `values` ve catalog'dan her doğrulama/profil/hash işleminde yeniden türetir.
- Dormant cevaplar `active_values`, `TravelProfileSnapshot`, uygunluk kontrolü, AI input'u veya `input_hash` üretimini etkileyemez. Yeniden aktif olduklarında güncel catalog'a göre tekrar doğrulanırlar.
- Kullanıcıya gösterilen metinsel etiketler yerine catalog'daki stable machine value'lar saklanır.
- `multi`, `content_id_list`, dietary tag ve must-have ID dizileri sırasız kümedir; tekrarları reddedilir ve canonical machine value/ID sırasına getirilir. `stays`, rota destinasyonları, günler ve adımlar gibi anlam taşıyan sıralı dizilerin sırası korunur.
- Otomatik kayıt yalnız geçerli cevap snapshot'ını günceller; doğrulama veya ağ hatası önceki başarılı `PlanAnswers` değerini silmez.

#### MVP'de kullanılan cevap grupları

MVP için canonical `PlanAnswers`, yalnız ilk değerli akışı gerçekten etkileyen soru gruplarını kapsar:

- seyahat grubu ve kiralık araç uygunluğu,
- seyahat zamanı veya tarihleri,
- `duration_days`,
- desteklenen varış ve dönüş noktaları,
- araç alma-bırakma konumu veya sistem önerisi tercihi,
- mevcut konaklama durumu ve varsa önceden belirlenmiş konaklama bilgileri,
- destinasyon tercihleri,
- `pace`,
- `budget_band`,
- ana seyahat öncelikleri,
- konaklama öncelikleri,
- yemek tercihleri ve beslenme kısıtları,
- `parking_priority`,
- `walking_tolerance`,
- `night_driving_preference`,
- zorunlu deneyim tercihleri.

Bu cevapların kesin machine ID, enum, koşul ve `impact` tanımları kullanılan `QuestionCatalog` sürümünün parçasıdır; `PlanAnswers` aynı kuralları ikinci kez tanımlamaz.

#### Değişiklik etkisi

Bir cevap değiştiğinde sonraki veri davranışı ilgili sorunun `QuestionCatalog.questions[].impact` değerine göre belirlenir:

- `eligibility`: yeni cevap desteklenen MVP kapsamı dışına çıkıyorsa rota veya ayrıntı üretimine devam edilmez.
- `route`: onaylanmış profil ve ona bağlı rota/detail çıktıları artık geçerli kabul edilmez; yeni profil onayı ve rota üretimi gerekir.
- `detail`: mevcut rota seçenekleri ve seçilmiş rota korunabilir; ancak mevcut `detailed_plan` yeniden üretilmeden geçerli kabul edilmez.

`PlanAnswers` bu geçersizleştirme işlemlerini kendi başına yapmaz; hangi alanların temizleneceği veya yeniden üretileceği backend state-transition kuralları tarafından uygulanır.

#### Profil onayı sonrası cevap değişikliği protokolü

- Profil onayından önce geçerli cevaplar normal autosave ile doğrudan kaydedilir.
- Profil onayından sonra frontend değişikliği önce yerel olarak staged tutar, catalog impact'ini ve kaybolacak çıktıları kullanıcıya gösterir. Apply isteği `expected_revision` ile `acknowledge_invalidation=true` taşır; revision eşleşmesi veya bu flag olmadan backend mevcut cevap/snapshot'ları değiştirmez.
- Backend client'ın bildirdiği impact'e güvenmez; eski ve yeni runtime `active_values` kümelerini kullanarak etkiyi yeniden hesaplar. Cevap yazımı, profil yeniden üretimi ve gerekli invalidation tek transaction'dır.
- `eligibility` veya `route` değişikliği: yeni `PlanAnswers.values` korunur; `profile_snapshot`, `route_options`, `selected_route_option_id` ve `detailed_plan` null yapılır; `status=draft` olur. Kullanıcı profili yeniden onaylamadan üretim yapılamaz.
- `detail` değişikliği: backend tüm `active_values` kümesini tekrar doğrular ve onaylı değişiklikle yeni değişmez `TravelProfileSnapshot` üretir; geçerli `route_options` ve `selected_route_option_id` korunur, `detailed_plan` null yapılır. `status`, hâlâ geçerli en ileri başarılı aşamaya döner; seçim varsa `route_selected` olur.
- Onaysız değişiklik, validation/ağ hatası veya başarısız AI işlemi hiçbir başarılı snapshot'ı temizlemez.

**İlişkileri:** `Plan.answers` içinde saklanır ve `catalog_version` ile kullanılan `QuestionCatalog` sürümüne bağlanır. Profil onayında backend, yalnız canonical ve tam `PlanAnswers` üzerinden değişmez `TravelProfileSnapshot` üretir.

**Yaşam döngüsü:** Planlama sırasında sık değişir ve debounce/adım geçişlerinde otomatik kaydedilir. Profil onayından önce taslak niteliğindedir. Ham `PlanAnswers` AI'ya doğrudan gönderilmez; AI işlemleri için yalnız `TravelProfileSnapshot` içinden gerekli ve kişisel veri içermeyen alt küme hazırlanır.

### TravelProfileSnapshot

**Amaç:** Onaylanmış canonical `PlanAnswers` içinden backend tarafından üretilen; AI ve deterministik planlama kurallarında kullanılacak normalize, değişmez ve gereksiz kişisel veri içermeyen seyahat profili snapshot'ıdır.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `profile_version` | Profil contract sürümü | string | Zorunlu | Desteklenen değişmez profil sürümü | Backend |
| `catalog_version` | Profilin üretildiği soru sözleşmesi sürümü | string | Zorunlu | `PlanAnswers.catalog_version` ile aynı olmalı | Backend |
| `answers_revision` | Profilin üretildiği cevap revision'ı | integer | Zorunlu | Profil oluşturulurken güncel `PlanAnswers.revision` ile aynı | Backend |
| `traveler_group` | MVP kullanıcı grubu | enum | Zorunlu | Yalnız `couple` | Cevaplar |
| `transport_mode` | MVP ulaşım biçimi | enum | Zorunlu | Yalnız `rental_car` | Cevaplar |
| `rental_car_assumption` | Kiralık aracın kesin mi kullanıcı tarafından kabul edilmiş varsayım mı olduğu | enum | Zorunlu | `confirmed`, `user_accepted_assumption` | Cevaplar/backend |
| `travel_period` | Seyahatin tarih veya dönem bilgisi | object | Zorunlu | Kesin tarih veya desteklenen esnek dönem biçimlerinden biri; kendi içinde tutarlı olmalı | Cevaplar/backend |
| `duration_days` | Planlanacak gün sayısı | integer | Zorunlu | 4-6; `travel_period` ile çelişmemeli | Cevaplar/backend |
| `entry_point_id` | Desteklenen varış/giriş noktası | verified location ID | Zorunlu | `location_kind=airport` veya `transport_hub`; izin verilen giriş noktası | Cevaplar/doğrulanmış içerik |
| `exit_point_id` | Desteklenen dönüş/çıkış noktası | verified location ID | Zorunlu | `location_kind=airport` veya `transport_hub`; izin verilen çıkış noktası | Cevaplar/doğrulanmış içerik |
| `arrival_timing` | İlk gün varış zamanı ve kesinliği | object | Zorunlu | `{time_known,local_time?}`; `time_known=true` ise `local_time` `HH:mm` olarak zorunlu, aksi halde alan yok | Cevaplar/backend |
| `departure_timing` | Son gün dönüş zamanı ve kesinliği | object | Zorunlu | `{time_known,local_time?}`; `time_known=true` ise `local_time` `HH:mm` olarak zorunlu, aksi halde alan yok | Cevaplar/backend |
| `rental_car_locations` | Araç alma-bırakma konumları veya sistem önerisi ihtiyacı | object | Zorunlu | Kullanıcının bildiği pickup/dropoff verified location ID'lerini ve eksik konum için öneri ihtiyacını tutar | Cevaplar/backend |
| `accommodation_status` | Konaklama kararının mevcut durumu | enum | Zorunlu | `none_booked`, `partially_booked`, `all_booked` | Cevaplar |
| `existing_accommodations` | Önceden belirlenmiş konaklama bilgileri | object[] | Koşullu | `partially_booked` veya `all_booked` ise yalnız planı kısıtlayan konum/tarih bilgileri; belirli otel önerisi oluşturmaz | Cevaplar/backend |
| `destination_preference_ids` | İstenen pilot ülke/bölge tercihleri | verified location ID[] | Opsiyonel | 0-3, benzersiz; `location_kind=country` veya `region`; boşsa sistem uygun rotayı önerebilir | Cevaplar/doğrulanmış içerik |
| `pace` | Gezi temposu | enum | Zorunlu | `relaxed`, `balanced`, `intensive` | Cevaplar |
| `budget_band` | Harcama yaklaşımı | enum | Zorunlu | `economy`, `economy_mid`, `mid`, `comfortable` | Cevaplar |
| `trip_priority_tags` | Planı değiştiren ana seyahat öncelikleri | enum/tag[] | Zorunlu | 1-3, benzersiz, catalog içinden | Cevaplar |
| `accommodation_priority_tags` | Konaklama bölgesi öncelikleri | enum/tag[] | Opsiyonel | Gerekiyorsa tam 2; catalog içinden | Cevaplar |
| `food_preference_tags` | Yemek seçimini ve rota içindeki yemek yaklaşımını etkileyen tercihler | enum/tag[] | Opsiyonel | 0-2; nötr/sistem seçsin değeri diğer tercihlerle birleşmez | Cevaplar |
| `dietary_restriction_tags` | Yemek adaylarının deterministik elenmesini gerektiren kısıtlar | enum/tag[] | Zorunlu | `none` diğer değerlerle birleşmez | Cevaplar/backend |
| `parking_priority` | Park sıralama tercihi | enum | Zorunlu | `nearest`, `economy`, `easy_safe`, `balanced` | Cevaplar |
| `walking_tolerance` | Park/konum yürüyüş toleransı | enum | Zorunlu | `max_5_min`, `up_to_15_min`, `up_to_20_min`, `flexible` | Cevaplar |
| `night_driving_preference` | Gece sürüşü hassasiyeti | enum | Zorunlu | `acceptable`, `avoid`, `never` | Cevaplar |
| `must_have_experience_ids` | Kullanıcının mutlaka istediği doğrulanmış deneyimler | verified content ID[] | Opsiyonel | 0-5, benzersiz; `experience` tipinde; pilot kapsamda | Cevaplar/doğrulanmış içerik |
| `confirmed_at` | Profilin kullanıcı tarafından onaylandığı zaman | ISO 8601 datetime | Zorunlu | Sunucu zamanı | Backend |

#### Normalize profil kuralları

- `TravelProfileSnapshot` yalnız backend tarafından doğrulanmış canonical `PlanAnswers` üzerinden oluşturulur.
- Frontend doğrudan profil snapshot'ı gönderemez veya değiştiremez.
- Profil yalnız ilk değerli MVP akışını etkileyen bilgileri taşır; e-posta, kullanıcı adı veya başka gereksiz kimlik bilgileri içermez.
- Kullanıcıya gösterilen soru etiketleri yerine `QuestionCatalog` tarafından tanımlanan stable machine value'lar kullanılır.
- `entry_point_id`, `exit_point_id`, destinasyon ve deneyim referansları yalnız doğrulanmış içerik havuzundaki stable ID'lerden oluşur.
- `arrival_timing` ve `departure_timing`, canonical `arrival`/`departure` cevaplarındaki `time_known` ve varsa `local_time` değerlerini kayıpsız taşır. Bilinmeyen saat backend tarafından kesin saat gibi doldurulmaz; ilk/son gün daha temkinli planlanır ve belirsizlik kullanıcıya gösterilir.
- `travel_period`, `duration_days`, giriş/çıkış noktaları, araç alma-bırakma düzeni ve önceden belirlenmiş konaklama bilgileri birbiriyle çelişiyorsa profil onaylanmaz.
- `accommodation_status=partially_booked` veya `all_booked` ise `travel_period` kesin tarih taşır; esnek ay ile tarihli konaklama kaydı birlikte onaylanmaz.
- `existing_accommodations` belirli otel veya rezervasyon önerisi anlamına gelmez; yalnız kullanıcının önceden verdiği rota kısıtlarını temsil eder.
- Serbest metin alerji veya açıklama alanı yalnız `PlanAnswers` içinde saklanır ve AI input'una gönderilmez. Backend adayları yalnız yapılandırılmış dietary tag'leriyle deterministik filtreler; serbest notu güvenlik garantisi veya otomatik eleme kuralı yapmaz, kullanıcıya kendi koşullarını doğrulaması için güvenli uyarı bağlamı olarak gösterebilir.

#### AI kullanım sınırı

`TravelProfileSnapshot` bütünüyle AI'ya gönderilmez. Her AI aşamasında yalnız o işlem için gerekli alanlardan kişisel veri içermeyen bir alt küme hazırlanır.

- Rota üretimi; rota seçimini etkileyen profil alanlarını ve doğrulanmış `RouteCandidate` kayıtlarını kullanır.
- Ayrıntılı plan üretimi; seçilmiş rota ile yalnız ayrıntı planını etkileyen gerekli profil alanlarını kullanır.
- Ham `PlanAnswers`, pasif koşullu cevaplar ve gereksiz serbest metin AI'ya gönderilmez.

**İlişkileri:** Bir `Plan`a aittir ve `PlanAnswers.catalog_version` ile hangi soru sözleşmesinden üretildiği izlenebilir. `RouteCandidate` filtreleme, rota AI input'u ve ayrıntılı plan AI input'u için gerekli profil alt kümeleri bu snapshot'tan türetilir.

**Yaşam döngüsü:** Profil onayında yeni ve değişmez bir snapshot olarak oluşturulur. Mevcut snapshot sessizce mutasyona uğramaz. `eligibility` veya `route` cevabı onaylı biçimde değiştiğinde profil ve bütün downstream rota/detail snapshot'ları geçersizleştirilir. `detail` cevabı onaylı biçimde değiştiğinde backend yeni profil snapshot'ını atomik üretir; rota seçimi korunur, mevcut `detailed_plan` temizlenir ve yeniden üretilmeden geçerli sayılmaz.

### VerifiedContentRecord

**Amaç:** Ürünün gerçek olarak sunduğu, insan tarafından kontrol edilmiş pilot seyahat kaydını temsil eder. Repository içindeki server-only JSON arşivinin domain sözleşmesidir.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `id` | Stable içerik kimliği | string | Zorunlu | Benzersiz; sürümler arasında gereksiz değişmez | Editoryal içerik |
| `type` | İçerik türü | enum | Zorunlu | `location`, `route_template`, `accommodation_base`, `car_pickup_dropoff_option`, `experience`, `parking`, `food`, `photo_spot`, `critical_information`, `plan_b_option` | Editoryal içerik |
| `location_kind` | Ortak konum sınıfı | enum | `type=location` ise zorunlu | `country`, `region`, `city`, `airport`, `transport_hub` | Editoryal içerik |
| `country_code` | Ülke | ISO 3166-1 alpha-2 | Koşullu | Pilot kapsam | Editoryal içerik |
| `city_ids` | Bağlı şehir/bölge ID'leri | string[] | Koşullu | Tümü doğrulanmış kapsamda | Editoryal içerik |
| `scope_tags` | Rota/gün/adım kapsamı | string[] | Zorunlu | İzin verilen tag catalog | Editoryal içerik |
| `display_name` | Kullanıcıya gösterilen doğrulanmış ad | string | Zorunlu | 1-120 karakter | Editoryal içerik |
| `coordinates` | Vendor bağımsız konum | `{lat, lng}` | Konumlu kayıtta zorunlu | `lat -90..90`, `lng -180..180` | Editoryal doğrulama |
| `maps_url` | Doğrudan doğrulanmış harita bağlantısı | HTTPS URL | Konumlu kayıtta zorunlu | İzin verilen host ve URL şeması | Editoryal doğrulama |
| `role_or_priority` | Park/restoran/deneyim rolü veya önceliği | enum/tag | Koşullu | Türün izin verdiği değer | Editoryal içerik |
| `fit_tags` | Süre, tempo, ilgi ve kullanım etiketleri | string[] | Zorunlu | Catalog içinden, benzersiz | Editoryal içerik |
| `planning_summary` | AI seçimi için kısa doğrulanmış özet | string | Zorunlu | 1-300 karakter; URL/fiyat eklenmez | Editoryal içerik |
| `verified_fact` | Kullanıcıya gösterilebilen kısa gerçek | string | Zorunlu | Kaynakla desteklenmiş; 1-500 karakter | Editoryal içerik |
| `source_urls` | Editoryal kanıt bağlantıları | HTTPS URL[] | Zorunlu | En az 1; server-only | Editoryal doğrulama |
| `last_verified_at` | Son insan doğrulaması | ISO date | Zorunlu | Gelecek tarih olamaz | Editoryal doğrulama |
| `variability_note` | Değişebilen bilgi uyarısı | string | Opsiyonel | 1-240 karakter | Editoryal içerik |
| `safety_critical` | Güvenlik etkisi | boolean | Zorunlu | `true` ise güvenli uyarı gerekir | Editoryal içerik |
| `safety_warning` | Kullanıcıya gösterilecek güvenli uyarı | string | Koşullu | `safety_critical=true` ise zorunlu | Editoryal doğrulama |
| `content_version` | Kayıt/bundle sürümü | string | Zorunlu | Deployment ile izlenebilir | Repository |

Türlere özgü alanlar aynı discriminated contract'ın uzantılarıdır. `LocationRecord`, `type=location`, stable `id` ve `location_kind` taşır; ülke/bölge/şehir hiyerarşisi için opsiyonel `parent_location_id` yine bir `location` kaydına referans verir. Aynı fiziksel konum, kullanım rolünden bağımsız olarak tek ID kullanır; örneğin aynı havalimanı girişte ve çıkışta farklı kayıt üretmez. `entry_point_id`, `exit_point_id`, `destination_sequence_ids`, gün başlangıç/bitiş noktaları ve ortak konum referansları yalnız bu ID alanını kullanır. Ayrı `locations` database tablosu kurulmaz.

Diğer discriminated uzantılar render ve validation için gerekli alanları açıkça taşır: rota şablonu süre/giriş/çıkış/destinasyon sırası/gece dağılımı/sürüş ölçüleri; konaklama üssü bağlı `location_id`; araç seçeneği pickup/dropoff `location_id`; deneyim ve fotoğraf noktası tahmini süre ile yayın önceliği; park yürüme süresi ve park rolü; yemek grup/venue rolü ile dietary tag'leri; kritik bilgi kapsam ve kullanıcı aksiyonu; Plan B ise tetikleyici ve izinli replacement ID'leri. Frontend bu server-only kaydı doğrudan okumaz.

**İlişkileri:** `RouteCandidate`, `RouteOptionsSnapshot` ve `DetailedPlanSnapshot` stable ID ile bu kayıtlara referans verir.
**Yaşam döngüsü:** İnsan doğrulamasıyla oluşur/değişir; build-time şema ve link kontrolünden geçer. AI tarafından oluşturulmaz veya güncellenmez.

### RouteCandidate

**Amaç:** Backend'in deterministik filtrelemesinden geçen rota şablonunun AI'ya gönderilecek, gerçekleri daraltılmış runtime görünümüdür.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `route_template_id` | Doğrulanmış rota şablonu | verified content ID | Zorunlu | `route_template` tipinde ve benzersiz | Doğrulanmış içerik |
| `duration_days` | Desteklenen süre | integer | Zorunlu | Profil ile aynı, 4-6 | Backend filtre |
| `entry_point_id`, `exit_point_id` | Başlangıç/bitiş | verified location ID | Zorunlu | Profil ile uyumlu; `airport` veya `transport_hub` | Doğrulanmış içerik |
| `destination_sequence_ids` | Genel hareket sırası | verified location ID[] | Zorunlu | En az 1; `city` veya `region`; şablon sırası korunur | Doğrulanmış içerik |
| `overnight_distribution` | Üs/gece dağılımı | object[] | Zorunlu | `nights` toplamı `duration_days - 1`; üsler rota kapsamındaki verified `accommodation_base` kayıtları | Doğrulanmış içerik |
| `candidate_experience_ids` | Rotanın kapsayabileceği deneyimler | verified content ID[] | Zorunlu | Yalnız rota kapsamı | Backend filtre |
| `driving_intensity` | Sürüş yükü | enum | Zorunlu | `low`, `medium`, `high` | Doğrulanmış içerik |
| `estimated_total_driving_minutes` | Yaklaşık toplam sürüş | integer | Zorunlu | `>=0`; doğrulanmış rota verisi | Doğrulanmış içerik |
| `longest_drive_day_minutes` | En uzun sürüş günü | integer | Zorunlu | `0..estimated_total_driving_minutes` | Doğrulanmış içerik |
| `night_driving_requirement` | Gece sürüşü durumu | enum | Zorunlu | `none`, `possible`, `required` | Doğrulanmış içerik |
| `balance_levels` | Plaj/tarih/doğa/serbest zaman dengesi | map of enum | Zorunlu | Her değer `low`, `medium`, `high` | Doğrulanmış içerik |
| `strength_codes`, `tradeoff_codes` | AI'nın seçebileceği doğrulanmış gerekçe kodları | string[] | Zorunlu | En az birer değer | Doğrulanmış içerik |

**İlişkileri:** Bir AI route input paketinde yer alır; ayrı database tablosu değildir.
**Yaşam döngüsü:** Her rota üretim isteğinde oluşturulur ve çağrı bittikten sonra atılır.

### RouteOptionsSnapshot

**Amaç:** AI seçimi ile doğrulanmış rota gerçeklerinin backend tarafından birleştirilmiş ve yeniden açılabilir halidir.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `contract_version` | Snapshot şema sürümü | string | Zorunlu | Desteklenen sürüm | Backend |
| `generation` | İçerik/prompt/model/input sürümü | `GenerationProvenance` | Zorunlu | Başarılı run ile eşleşir | Backend |
| `options` | Rota seçenekleri | array | Zorunlu | 1-3, benzersiz şablonlar; tam olarak biri `recommended` | Backend |
| `options[].route_option_id` | Plan içi seçim kimliği | string/UUID | Zorunlu | Plan içinde benzersiz | Backend |
| `options[].route_template_id` | Doğrulanmış şablon | verified content ID | Zorunlu | AI input adaylarından biri | AI seçimi/backend |
| `options[].rank` | Karşılaştırma sırası | integer | Zorunlu | 1..N, boşluksuz, benzersiz | AI/backend |
| `options[].role` | Önerilen/alternatif | enum | Zorunlu | `recommended`, `alternative`; tam olarak biri `recommended` ve `rank=1` | Backend |
| `options[].verified_route` | Ad, sıra, üs, sürüş ve karşılaştırma gerçekleri | hydrated verified object | Zorunlu | Yalnız server-side içerikten | Backend |
| `options[].ai_explanation` | Sınırlı kişiselleştirilmiş gerekçe | object | Zorunlu | Kodlar adayın izin listesinde; metin sınırları geçerli | AI/backend |

**İlişkileri:** `Plan.route_options` içinde saklanır; `selected_route_option_id` bu listedeki kimliğe referans verir.
**Yaşam döngüsü:** Başarılı rota üretiminde atomik oluşur; rota belirleyici profil değişirse geçersizleşir.

`options[].verified_route`, frontend'in ek içerik sorgusu yapmadan rota kartını çizebileceği şu tam görünümü taşır: `route_template_id`, `display_name`, `duration_days`, hydrate edilmiş `entry_point` ve `exit_point`, sıralı hydrate edilmiş `destination_sequence`, `overnight_distribution[]` (`accommodation_base` + `nights`), `driving_intensity`, `estimated_total_driving_minutes`, `longest_drive_day_minutes`, `night_driving_requirement`, `balance_levels`, hydrate edilmiş `experience_highlights[]` ve `car_summary`. Kullanıcıya gösterilecek güçlü yön/taviz metinleri `ai_explanation` içinde, doğrulanmış code allowlist'iyle birlikte bulunur.

### DetailedPlanSnapshot

**Amaç:** Seçilen rota için kullanıcıya gösterilecek ve yeniden açılacak doğrulanmış ayrıntılı planı temsil eder.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `contract_version` | Snapshot şema sürümü | string | Zorunlu | Desteklenen sürüm | Backend |
| `generation` | İçerik/prompt/model/input sürümü | `GenerationProvenance` | Zorunlu | Başarılı detail run ile eşleşir | Backend |
| `route_option_id` | Planlanan seçili seçenek | string/UUID | Zorunlu | Planın seçili rotasıyla aynı | Backend |
| `overview` | Genel bakış, üsler ve araç konumu kararı | object | Zorunlu | Tüm içerik referansları doğrulanmış | Backend + AI |
| `pre_trip_critical_information` | Seyahat öncesi doğrulanmış uyarılar | `HydratedContentRef[]` | Zorunlu | Yalnız ilgili kapsam | Backend |
| `days` | Gün planları | array | Zorunlu | Uzunluk `duration_days`; gün numarası 1..N | Backend + AI |
| `days[].steps` | Kronolojik plan adımları | array | Zorunlu | 1-12; order benzersiz ve boşluksuz | AI/backend |
| `days[].plan_b` | Gün düzeyinde alternatif | object/null | Zorunlu | Yalnız anlamlı tetikleyici varsa object | AI/backend |

`HydratedContentRef`, frontend'e gerçek olarak gösterilen minimum içerik görünümüdür: `content_id`, `type`, `display_name`, gerekiyorsa `coordinates`, `maps_url`, `verified_fact`, `last_verified_at`, `variability_note`, `safety_critical` ve `safety_warning`. `source_urls` server-only kalır. Type-specific görünüm alanları şunlardır:

- `location`: `location_kind` ve gerekiyorsa hydrate edilmiş parent özeti.
- `accommodation_base`: bağlı hydrate edilmiş `location` ve snapshot bağlamındaki `nights`.
- `car_pickup_dropoff_option`: hydrate edilmiş pickup/dropoff konumu ve doğrulanmış kısa uygulama notu.
- `experience` ve `photo_spot`: `display_priority` (`must_do`, `strong`, `if_time`) ile doğrulanmış tahmini süre.
- `parking`: `parking_role` (`recommended`, `verified_free`, `closest_or_easiest`) ve doğrulanmış yaklaşık yürüme süresi.
- `food`: `food_group_type`, `venue_role` (`primary`, `alternative`) ve kullanıcıya gösterilebilen dietary tag'leri.
- `critical_information`: `scope` (`pre_trip`, `day`, `step`) ve kısa `required_action`.
- `plan_b_option`: `trigger_codes`, kısa `action_summary` ve varsa hydrate edilmiş replacement içerikleri.

`DetailedPlanSnapshot.overview`, AI özetinin yanında hydrate edilmiş `accommodation_bases[]` ve `car_pickup_dropoff` görünümünü taşır. Her `days[]` öğesi hydrate edilmiş `start_location` ve `end_location` görünümünü; her `days[].steps[]` öğesi ise AI'nın sıralama/zaman/purpose alanlarıyla birlikte `content_ids` karşılığı olan hydrate edilmiş `contents[]` dizisini ve varsa `from_content`/`to_content` görünümlerini içerir. `days[].plan_b`, yalnız ID listesi değil, yukarıdaki hydrate edilmiş Plan B görünümüdür. Bu nedenle yeniden açılan plan ekranı server-only içerik arşivine yeni bir lookup yapmadan tamamen render edilebilir; AI output sözleşmesi ise ID-only kalır.

**İlişkileri:** `Plan.detailed_plan` içinde saklanır; içindeki tüm gerçekler `VerifiedContentRecord` ID'lerinden hydrate edilir.
**Yaşam döngüsü:** Başarılı detail üretiminde atomik oluşur; normal yeniden açmada değişmez ve AI çağrısı yapılmadan okunur.

### GenerationProvenance

**Amaç:** Kaydedilmiş AI destekli snapshot'ın hangi girdiler ve sürümlerle oluştuğunu izler.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `generation_run_id` | Snapshot'ı üreten başarılı run korelasyonu | UUID | Zorunlu | Snapshot yazılırken aynı plan ve `stage` için `succeeded` run ile eşleşir | Backend |
| `stage` | Üretim aşaması | enum | Zorunlu | `routes`, `detail` | Backend |
| `content_version` | Kullanılan içerik bundle'ı | string | Zorunlu | Repository sürümüyle eşleşir | Backend |
| `prompt_version` | Kullanılan prompt | string | Zorunlu | Değişmez sürüm | Backend |
| `model_id` | Model kimliği | string | Zorunlu | Server config ile aynı | Backend |
| `input_hash` | Normalize giriş özeti | string | Zorunlu | Kişisel verisiz deterministik hash | Backend |
| `generated_at` | Başarılı üretim zamanı | ISO 8601 datetime | Zorunlu | Sunucu zamanı | Backend |

**İlişkileri:** Rota ve detay snapshot'larında ayrı ayrı bulunur; yazım anında `GenerationRun` ile `generation_run_id`, stage ve input hash üzerinden eşleştirilir. Alan JSONB içinde korelasyon değeridir; 35 günlük run retention nedeniyle kalıcı database foreign key değildir.
**Yaşam döngüsü:** Başarılı sonuçla birlikte yazılır ve snapshot ile birlikte okunur. Ledger satırı retention sonunda silinse de provenance alanı snapshot'ın parçası olarak kalır.

### Feedback

**Amaç:** Kullanıcının planın faydası, güveni, uygulanabilirliği ve harici arama ihtiyacı hakkındaki temel geri bildirimini temsil eder.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `id` | Feedback kimliği | UUID | Zorunlu | Backend üretir | Backend |
| `plan_id` | Değerlendirilen plan | UUID | Zorunlu | `(plan_id, user_id)` birlikte sahip olunan `plans(id, user_id)` kaydına referans verir | Kullanıcı/backend |
| `user_id` | Gönderen | UUID | Zorunlu | Oturumdan; body'den alınmaz | Auth/backend |
| `usefulness_rating` | Fayda | integer | Zorunlu | 1-5 | Kullanıcı |
| `trust_rating` | Güven | integer | Zorunlu | 1-5 | Kullanıcı |
| `applicability_rating` | Uygulanabilirlik | integer | Zorunlu | 1-5 | Kullanıcı |
| `decision_load_reduced` | Karar yükü azaldı mı? | boolean | Zorunlu | Boolean | Kullanıcı |
| `external_search_needed` | Harici arama gerekti mi? | boolean | Zorunlu | Boolean | Kullanıcı |
| `comment` | Kısa serbest yorum | string | Opsiyonel | Trim sonrası 0-1000; HTML render edilmez | Kullanıcı |
| `created_at` | Gönderim zamanı | ISO 8601 datetime | Zorunlu | Sunucu zamanı | Backend |
| `updated_at` | Son güncelleme zamanı | ISO 8601 datetime | Zorunlu | Sunucu zamanı; her upsert'te yenilenir | Backend |

**İlişkileri:** Bir plan ve kullanıcıya aittir; `(user_id, plan_id)` unique constraint vardır. Composite foreign key `(plan_id, user_id) -> plans(id, user_id) ON DELETE CASCADE`, feedback'in başka kullanıcının planına bağlanmasını database düzeyinde engeller ve plan silinince feedback'i siler.
**Yaşam döngüsü:** Ayrıntılı plan sonrası `PUT /api/plans/:id/feedback` ile oluşturulur. Aynı kullanıcının aynı plan için sonraki gönderimi yeni satır açmaz; mevcut satırı upsert eder, `created_at` değerini korur ve `updated_at` değerini yeniler. MVP feedback'i yalnız plan düzeyindedir; gün veya içerik düzeyinde feedback kapsam dışıdır.

### GenerationRun

**Amaç:** AI kota, idempotency, hata ve maliyet takibi için prompt/cevap içermeyen operasyonel ledger kaydıdır.

| Alan | Anlam | Tip | Zorunluluk | Temel validasyon | Kaynak |
| --- | --- | --- | --- | --- | --- |
| `id` | Run kimliği | UUID | Zorunlu | Backend üretir | Backend |
| `request_id` | Teknik istek korelasyonu | string/UUID | Zorunlu | Kişisel veri içermez | Backend |
| `plan_id` | İlgili plan | UUID/null | Zorunlu | Plan silinince null olabilir | Backend |
| `user_id` | Kota sahibi | UUID/null | Zorunlu | Sunucu oturumundan; hesap silinince null | Backend |
| `stage` | Üretim aşaması | enum | Zorunlu | `routes`, `detail` | Backend |
| `input_hash` | Idempotency anahtarı | string | Zorunlu | Stage + normalize input + sürümlerden | Backend |
| `status` | Run durumu | enum | Zorunlu | `reserved`, `succeeded`, `failed` | Backend |
| `attempt_count` | Aynı kullanıcı işlemi içindeki sağlayıcı çağrısı sayısı | integer | Zorunlu | Başlangıç 1; en fazla bir repair/sağlayıcı retry ile en fazla 2 | Backend |
| `model_id` | Kullanılan model | string | Zorunlu | Server config | Backend |
| `input_tokens`, `output_tokens` | İşlemdeki toplam kullanım | integer/null | Opsiyonel | Bütün denemelerin toplamı; `>=0` | AI sağlayıcı cevabı/backend |
| `estimated_cost_usd` | İşlemdeki toplam tahmini maliyet | decimal/null | Opsiyonel | Bütün denemelerin toplamı; `>=0` | Backend |
| `latency_ms` | İşlemdeki toplam sağlayıcı süresi | integer/null | Opsiyonel | Bütün denemelerin toplamı; `>=0` | Backend |
| `error_code` | Güvenli teknik hata kodu | string/null | Opsiyonel | Allowlist; kullanıcı metni içermez | Backend |
| `reservation_expires_at` | Aktif rezervasyon sonu | ISO 8601 datetime/null | Opsiyonel | `reserved` iken zorunlu; süresi dolunca retry alınabilir | Backend |
| `expires_at` | Ledger silme zamanı | ISO 8601 datetime | Zorunlu | `created_at + 35 gün` | Backend |
| `created_at` | Başlangıç zamanı | ISO 8601 datetime | Zorunlu | Sunucu zamanı | Backend |
| `updated_at` | Son durum/deneme zamanı | ISO 8601 datetime | Zorunlu | Sunucu zamanı, monoton | Backend |

**İlişkileri:** Yalnız `status='reserved'` satırlarında `(plan_id, stage, input_hash)` partial unique index bulunur; bu indeks aynı üretimin eşzamanlı ikinci kez başlatılmasını engeller. Tarayıcı tabloya doğrudan erişemez. Başarılı snapshot, kendi `GenerationProvenance.generation_run_id` alanıyla tam olarak bir run'a bağlanır.
**Yaşam döngüsü:** Backend önce ilgili plan alanında aynı `input_hash` değerli güncel ve geçerli snapshot arar. Bulursa snapshot döner; yeni run, AI çağrısı veya kota tüketimi oluşmaz. Bulamazsa kullanıcı, plan-stage ve aylık global bütçe anahtarlarını database düzeyinde serialize eden dar transaction içinde kota/bütçe kontrolüyle `reserved` run insert edilir ve sonuçta satır `succeeded/failed` olur. Süresi dolmamış eşleşen rezervasyon `409 GENERATION_IN_PROGRESS` döndürür; yeni satır veya kota tüketimi oluşturmaz. Süresi dolmuş rezervasyon `failed` yapılır. Kullanıcının açık yeniden denemesi yeni run satırıdır; yalnız aynı kullanıcı işlemi içindeki bir repair/sağlayıcı retry mevcut satırın `attempt_count` ve toplam kullanım alanlarını artırır. Tarihsel `succeeded` satır, karşılık gelen güncel snapshot artık yoksa cache sonucu değildir. Sonuç plana yazılmadan hemen önce stage hash'i güncel plan verisinden yeniden hesaplanır; hash veya gerekli state/seçim değişmişse snapshot yazılmaz ve run `STALE_GENERATION_INPUT` ile `failed` olur. Plan silinince `plan_id`, hesap silinince `user_id` null yapılır. Kayıt 35 gün sonunda dar retention göreviyle silinir. Tam prompt ve ham cevap saklanmaz.

`input_hash`, nesne anahtarları sabitlenmiş canonical JSON üzerinden hesaplanır. Anlamı küme olan tag/ID dizileri canonical sıralanır; rota destinasyonları, overnight dağılımı, günler ve adımlar gibi anlamlı sıralı diziler korunur. Hash en az `stage`, ilgili runtime `active_values`/normalize profil alt kümesi, detail için seçili `route_option_id` ve `route_template_id`, ayrıca contract, catalog, content, prompt ve model sürümlerini kapsar. E-posta, user ID, dormant cevap ve serbest yorum hash girdisi değildir.

### AccountDeletionRequest

**Amaç:** Kullanıcının hesabını ve kullanıcıya bağlı ürün verisini açık onayla silmesini sağlayan dar transport sözleşmesidir.

| Alan | Tip | Zorunluluk | Kural |
| --- | --- | --- | --- |
| `confirmation` | string | Zorunlu | Tam olarak UI'ın gösterdiği sabit onay değeri; e-posta veya serbest açıklama değildir |

`DELETE /api/account`, oturum ve confirmation doğrulamasından sonra tek kontrollü servis akışında kullanıcının planlarını siler; plan FK'siyle feedback kayıtları cascade silinir; saklama süresi dolmamış `GenerationRun.user_id` değerleri null yapılır; ardından auth kullanıcısı service-role kullanan yalnız bu modül tarafından silinir ve oturum kapatılır. İşlem idempotent olmalı; kısmi hatada güvenli `ACCOUNT_DELETION_FAILED` döndürülmeli ve tamamlanmayan adımlar loglarda kişisel veri olmadan izlenmelidir.

## 4. Kalıcı ve geçici veri ayrımı

| Nesne / veri | Sınıf | Nerede tutulur? | Gerekçe |
| --- | --- | --- | --- |
| `UserIdentityRef` ve oturum | Kalıcı auth verisi | Auth sağlayıcısı/cookie | Plan sahipliği ve yeniden açma |
| `Plan`, `PlanAnswers` | Kalıcı | `plans` kaydı | Taslağı ve otomatik kaydı korumak |
| `TravelProfileSnapshot` | Kalıcı | `plans.profile_snapshot` | Kullanıcı onayı ve üretim girdisini dondurmak |
| `QuestionCatalog` | Sürüm kontrollü konfigürasyon | Repository | FE/BE tek kaynak; DB tablosu gerekmez |
| `VerifiedContentRecord` | Doğrulanmış kaynak verisi | Server-only sürüm kontrollü JSON | Gerçeklerin ana kaynağı |
| `RouteCandidate[]` | Geçici/runtime | Backend belleği/istek ömrü | AI öncesi deterministik filtre sonucu |
| Ham route AI output | AI üretimi, saklanmaz | İstek ömrü | Doğrulanmadan kullanıcı verisi değildir |
| `RouteOptionsSnapshot` | AI üretimi + doğrulanmış içerik, saklanır | `plans.route_options` | Aynı karşılaştırmayı yeniden açmak ve ikinci çağrıyı önlemek |
| Rota seçimi | Kalıcı | `plans.selected_route_option_id` eşlemesi | Plan içi option seçimi; kaynak şablon option'ın `route_template_id` alanındadır |
| Ham detail AI output | AI üretimi, saklanmaz | İstek ömrü | Validate/hydrate öncesi güvenilmez |
| `DetailedPlanSnapshot` | AI üretimi + doğrulanmış içerik, saklanır | `plans.detailed_plan` | Planı AI çağrısız yeniden açmak |
| `Feedback` | Kalıcı | `feedback` | MVP değer kanıtı |
| `GenerationRun` | Kalıcı fakat asgari operasyonel veri | `generation_runs` | Kota, maliyet, hata ve idempotency |
| UI loading/error/unsaved state | Geçici/runtime | Frontend belleği | Kullanıcı deneyimi; domain gerçeği değildir |
| E-posta, OTP, tam prompt, ham model cevabı | Plan/AI logunda saklanmaz | Auth sağlayıcısı veya istek ömrü | Veri minimizasyonu |

## 5. Nesneler arası ilişkiler

| Kaynak | İlişki | Hedef | Kural |
| --- | --- | --- | --- |
| `UserIdentityRef` | 1:N | `Plan` | Her plan tam bir kullanıcıya aittir. |
| `Plan` | 1:1 | `PlanAnswers` | Taslak aşamasından itibaren vardır. |
| `PlanAnswers` | N:1 | `QuestionCatalog` sürümü | Aynı ID ve tip kuralları kullanılır. |
| `Plan` | 0..1:1 | `TravelProfileSnapshot` | Yalnız kullanıcı onayından sonra. |
| `TravelProfileSnapshot` | 1:N runtime | `RouteCandidate` | Backend uygun adayları deterministik seçer. |
| `Plan` | 0..1:1 | `RouteOptionsSnapshot` | Her an yalnız son geçerli rota seti saklanır. |
| `RouteOptionsSnapshot` | 1:N | Route option | 1-3 seçenek; tam biri önerilen. |
| `Plan` | 0..1:1 | Selected route option | ID mevcut rota setinden olmalı. |
| Selected route option | 1:1 | `DetailedPlanSnapshot` | Yalnız seçili rota için detay üretilir. |
| Snapshot content ref | N:1 | `VerifiedContentRecord` | Her ID içerik whitelist'inde bulunmalı. |
| `Plan` | 0..1:1 | `Feedback` | `(user_id, plan_id)` tekildir; sahiplik plan üzerinden doğrulanır. |
| `Plan` | 1:N | `GenerationRun` | Cache hit olmayan route/detail kullanıcı işlemleri; işlem içi retry aynı satırda toplanır. |

## 6. AI işlemleri

### AI Contract: Route Recommendation

**Görevi:** Backend tarafından uygun olduğu zaten doğrulanmış rota şablonları arasından 1-3 anlamlı seçeneği sıralamak, birini önerilen olarak işaretlemek ve profil ile adayın doğrulanmış özelliklerine dayalı kısa gerekçe üretmek.

**AI'nın yapmaması gerekenler:**

- Uygunluk, desteklenen süre/destinasyon, auth, kota veya idempotency kararı vermek.
- Yeni rota, şehir, konaklama üssü, deneyim veya content ID üretmek.
- İsim, URL, koordinat, fiyat, çalışma saati, sürüş süresi, doğrulama tarihi veya kritik gerçek üretmek/değiştirmek.
- Ham kullanıcı cevaplarını yeniden yorumlayıp profili değiştirmek.
- Üçten fazla seçenek veya aynı şablonu iki kez döndürmek.

### AI Contract: Detailed Trip Plan

**Görevi:** Seçili rota çerçevesi ve yalnız o rotaya ait izinli içerik adaylarını günlere/adımlara yerleştirmek; planlanan zaman bloklarını, kısa seçim gerekçelerini ve gün seviyesindeki Plan B düzenini üretmek.

**AI'nın yapmaması gerekenler:**

- Seçilmemiş rota veya izin paketinin dışındaki bir içerik ID'sini kullanmak.
- Yeni yer/restoran/park/deneyim, URL, fiyat, çalışma saati, doğrulama tarihi veya kritik gerçek üretmek.
- Verified içeriğin adını, koordinatını, güvenlik uyarısını veya `last_verified_at` değerini değiştirmek.
- Zorunlu gün sayısını değiştirmek, iki günü aynı numarayla döndürmek veya seçili rotanın başlangıç/bitişini bozmak.
- Güvenlik-kritik bir kaydı kaldırmak ya da kullanıcı tercihini güvenlik kuralının önüne koymak.

Profil özeti oluşturma, uygunluk kontrolü, aday filtreleme, hydrate etme, kaydetme, yeniden açma ve feedback işlemlerinde AI kullanılmaz.

## 7. AI Input Contracts

### 7.1. RouteRecommendationInput

**Amaç:** Backend tarafından MVP uygunluğu ve sert rota kısıtları doğrulanmış kullanıcı profili ile yine backend tarafından deterministik olarak filtrelenmiş `RouteCandidate` kayıtlarını rota AI'sına gönderen dar input sözleşmesidir.

`QuestionCatalog.questions[].impact=route`, ilgili cevabın değişmesinin rota çıktısını geçersizleştirdiğini belirtir; bütün `impact=route` alanlarının doğrudan AI'ya gönderileceği anlamına gelmez. Uygunluk ve sert rota kısıtları backend tarafından AI çağrısından önce uygulanır. AI'ya yalnız aday rotaların sıralanması ve gerekçelendirilmesi için gerekli kişisel veri içermeyen profil alt kümesi gönderilir.

| Alan | Tip | Required | Enum / sınır | Açıklama |
| --- | --- | --- | --- | --- |
| `contract_version` | string | Evet | `route-input-v2` | Route AI input şema sürümü |
| `profile` | object | Evet | Aşağıdaki dar alt küme | E-posta, user ID ve ham `PlanAnswers` içermez |
| `profile.duration_days` | integer | Evet | 4-6 | Backend tarafından doğrulanmış plan gün sayısı |
| `profile.entry_point_id` | string | Evet | Verified allowlist | Desteklenen giriş noktası |
| `profile.exit_point_id` | string | Evet | Verified allowlist | Desteklenen çıkış noktası |
| `profile.pace` | enum | Evet | `relaxed`, `balanced`, `intensive` | Rota tempo tercihi |
| `profile.budget_band` | enum | Evet | `economy`, `economy_mid`, `mid`, `comfortable` | MVP bütçe segmenti |
| `profile.trip_priority_tags` | string[] | Evet | 1-3, QuestionCatalog | Ana gezi öncelikleri |
| `profile.destination_preference_ids` | string[] | Hayır | 0-3, verified | Kullanıcının tercih ettiği desteklenen pilot bölgeler |
| `profile.accommodation_priority_tags` | string[] | Hayır | Aktifse tam 2, QuestionCatalog | Yalnız ayarlanmamış konaklama geceleri varsa rota/üs tercihine katkı verir |
| `profile.night_driving_preference` | enum | Evet | `acceptable`, `avoid`, `never` | Gece sürüşü tercihi |
| `profile.must_have_experience_ids` | string[] | Hayır | Benzersiz verified `experience` ID'leri | Kullanıcının rota içinde mutlaka görmek istediği doğrulanmış deneyimler |
| `candidate_routes` | `RouteCandidate[]` | Evet | En az 1; `route_template_id` benzersiz | Backend'in sert kurallarla filtrelediği rota adayları |

#### AI'ya gönderilmeyen route-impact alanları

Aşağıdaki bilgiler rota sonucunu etkileyebilir; ancak AI tarafından yeniden yorumlanmaz. Backend bunları `RouteCandidate` oluşturulmadan önce deterministik uygunluk ve filtreleme kurallarında kullanır:

- `travel_period`,
- `arrival_timing` ve `departure_timing`,
- `rental_car_locations`,
- `accommodation_status`,
- `existing_accommodations`.

Bu alanlardan biri nedeniyle bir rota uygulanamaz durumdaysa o rota AI input'una `RouteCandidate` olarak hiç girmez.

`traveler_group`, `transport_mode` ve `rental_car_assumption` da AI'ya gönderilmez; backend bunları MVP uygunluk kontrolünde AI çağrısından önce doğrular.

`food_preference_tags`, `dietary_restriction_tags`, `parking_priority` ve `walking_tolerance` `impact=detail` kapsamındadır ve rota önerisi AI'sına gönderilmez.

E-posta, kullanıcı kimliği, feedback, serbest yorum, alerji/açıklama metni, source URL'leri ve başka gereksiz kişisel veya editoryal alanlar route AI input'una dahil edilmez.

#### Rota profili alt kümesi kuralları

- Input yalnız kullanıcı tarafından onaylanmış geçerli `TravelProfileSnapshot` üzerinden oluşturulur.
- Ham `PlanAnswers` AI'ya gönderilmez.
- Pasif koşullu cevaplar AI input'una dahil edilmez.
- `accommodation_priority_tags`, yalnız ayarlanmamış konaklama gecesi bulunduğunda gönderilir.
- AI, bir kullanıcı tercihini yalnız ilgili `RouteCandidate` içindeki doğrulanmış alan, `strength_codes` veya `tradeoff_codes` tarafından destekleniyorsa sıralama gerekçesinde kullanabilir.
- AI, profil tercihinden hareketle adayda bulunmayan yeni bir rota özelliği veya gerçek uyduramaz.
- Backend tarafından sert kural nedeniyle filtrelenen bir rotayı AI yeniden uygun ilan edemez.

Örnek input:

```json
{
  "contract_version": "route-input-v2",
  "profile": {
    "duration_days": 5,
    "entry_point_id": "loc_tirana_airport",
    "exit_point_id": "loc_tirana_airport",
    "pace": "balanced",
    "budget_band": "economy_mid",
    "trip_priority_tags": [
      "iconic_must_see",
      "photo_social",
      "beach_sea"
    ],
    "destination_preference_ids": [
      "loc_albania",
      "loc_montenegro"
    ],
    "accommodation_priority_tags": [
      "budget",
      "easy_parking"
    ],
    "night_driving_preference": "avoid",
    "must_have_experience_ids": [
      "exp_kotor_cable_car"
    ]
  },
  "candidate_routes": [
    {
      "route_template_id": "route_adriatic_balanced_5d",
      "duration_days": 5,
      "entry_point_id": "loc_tirana_airport",
      "exit_point_id": "loc_tirana_airport",
      "destination_sequence_ids": [
        "loc_tirana",
        "loc_budva",
        "loc_kotor"
      ],
      "overnight_distribution": [
        {
          "accommodation_base_id": "base_budva",
          "nights": 2
        },
        {
          "accommodation_base_id": "base_kotor",
          "nights": 2
        }
      ],
      "candidate_experience_ids": [
        "exp_budva_old_town",
        "exp_kotor_cable_car"
      ],
      "driving_intensity": "medium",
      "estimated_total_driving_minutes": 520,
      "longest_drive_day_minutes": 300,
      "night_driving_requirement": "none",
      "balance_levels": {
        "beach": "medium",
        "history": "medium",
        "nature": "medium",
        "free_time": "medium"
      },
      "strength_codes": [
        "balanced_pace",
        "must_have_covered",
        "no_night_drive"
      ],
      "tradeoff_codes": [
        "one_base_change"
      ]
    }
  ]
}
```

### 7.2. DetailedTripPlanInput

**Amaç:** Kullanıcının seçtiği doğrulanmış rota çerçevesi içinde, backend tarafından filtrelenmiş doğrulanmış içerik adaylarını kullanarak gün gün ayrıntılı plan oluşturması için detail AI'ya gönderilen dar ve kimliksiz input sözleşmesidir.

`QuestionCatalog.questions[].impact=detail`, ilgili cevap değiştiğinde mevcut ayrıntılı planın artık geçerli olmadığını belirtir. Bu, yalnız `impact=detail` alanlarının detail AI'ya gönderileceği anlamına gelmez. Seçilmiş rota korunurken günlük planın kişiselleştirilmesi için gerekli bazı `impact=route` profil tercihleri de detail input'unda kullanılabilir.

Sert uygunluk, güvenlik, tarih, rota kapsamı ve verified-content filtreleri backend tarafından AI çağrısından önce uygulanır. AI yalnız kendisine verilen `selected_route`, `candidate_content` ve `hard_rules` sınırları içinde seçim ve sıralama yapabilir.

| Alan | Tip | Required | Enum / sınır | Açıklama |
| --- | --- | --- | --- | --- |
| `contract_version` | string | Evet | `detail-input-v3` | Detail AI input şema sürümü; v3 varış/dönüş saat kesinliğini kayıpsız taşır |
| `profile` | object | Evet | Aşağıdaki dar alt küme | E-posta, user ID ve ham `PlanAnswers` içermez |
| `profile.duration_days` | integer | Evet | 4-6 | Output gün sayısını belirler |
| `profile.arrival_timing` | object | Evet | `{time_known,local_time?}` | İlk gün kullanılabilir zamanın kullanıcı tarafından bilinen sınırı; bilinmiyorsa temkinli plan sinyali |
| `profile.departure_timing` | object | Evet | `{time_known,local_time?}` | Son gün kullanılabilir zamanın kullanıcı tarafından bilinen sınırı; bilinmiyorsa temkinli plan sinyali |
| `profile.pace` | enum | Evet | `relaxed`, `balanced`, `intensive` | Gün yoğunluğu ve serbest zaman dengesi |
| `profile.budget_band` | enum | Evet | `economy`, `economy_mid`, `mid`, `comfortable` | Doğrulanmış adaylar arasında bütçe uyumu |
| `profile.trip_priority_tags` | string[] | Evet | 1-3, QuestionCatalog | Deneyim ve zaman dağılımı öncelikleri |
| `profile.accommodation_priority_tags` | string[] | Hayır | Aktifse tam 2, QuestionCatalog | Yalnız seçili rota birden fazla izinli üs seçeneği bırakıyorsa üs seçimine katkı verir |
| `profile.food_preference_tags` | string[] | Hayır | 0-2, QuestionCatalog | Doğrulanmış yemek adaylarının kişisel tercihe göre sıralanması; `system_decide` tercih sinyali olarak gönderilmez |
| `profile.dietary_restriction_tags` | string[] | Evet | QuestionCatalog | Yalnız yapılandırılmış kısıt tag'leri; backend yemek adaylarını AI'dan önce deterministik olarak filtreler |
| `profile.parking_priority` | enum | Evet | `nearest`, `economy`, `easy_safe`, `balanced` | Doğrulanmış park adaylarının sıralanması |
| `profile.walking_tolerance` | enum | Evet | `max_5_min`, `up_to_15_min`, `up_to_20_min`, `flexible` | Park ve deneyim uygulanabilirliği |
| `profile.night_driving_preference` | enum | Evet | `acceptable`, `avoid`, `never` | Gün sonu ve sürüş bloklarının yerleşimi |
| `profile.must_have_experience_ids` | string[] | Hayır | Benzersiz verified `experience` ID'leri | Kullanıcının mutlaka istediği deneyimlerin kapsama kontrolü |
| `selected_route` | object | Evet | Tek doğrulanmış rota çerçevesi | Kullanıcının seçtiği rota; AI rota sırasını veya kapsamını değiştiremez |
| `selected_route.route_template_id` | string | Evet | Verified allowlist | Seçilmiş route option'ın dayandığı doğrulanmış rota şablonu |
| `selected_route.accommodation_base_ids` | string[] | Evet | Verified allowlist | Bu rota içinde kullanılmasına izin verilen konaklama üsleri |
| `selected_route.car_pickup_dropoff_option_ids` | string[] | Evet | Verified allowlist | Bu rota içinde kullanılmasına izin verilen araç alma-bırakma konumu kararları |
| `selected_route.day_frames` | array | Evet | Uzunluk `duration_days` | Her günün sabit rota ve içerik kapsamı |
| `selected_route.day_frames[].day_number` | integer | Evet | `1..duration_days` | Benzersiz ve boşluksuz gün numarası |
| `selected_route.day_frames[].start_location_id` | string | Evet | Verified `location` ID | Günün doğrulanmış başlangıç noktası |
| `selected_route.day_frames[].end_location_id` | string | Evet | Verified `location` ID | Günün doğrulanmış bitiş noktası |
| `selected_route.day_frames[].allowed_content_ids` | string[] | Evet | Verified allowlist | O gün seçilebilecek içerik kayıtları |
| `candidate_content` | array | Evet | Yalnız seçili rota kapsamı | Backend tarafından filtrelenmiş doğrulanmış içerik adayları |
| `candidate_content[].id` | string | Evet | Verified allowlist | AI output referanslarının whitelist'i |
| `candidate_content[].type` | enum | Evet | Verified content türleri | İçerik türü |
| `candidate_content[].allowed_day_numbers` | integer[] | Evet | `1..duration_days` | İçeriğin kullanılabileceği günler |
| `candidate_content[].fit_tags` | string[] | Evet | Doğrulanmış içerik tag catalog'u | Profil ve planlama uyumu |
| `candidate_content[].priority` | enum/tag | Hayır | Türe göre | Deneyim önceliği veya park/restoran rolü |
| `candidate_content[].estimated_duration_minutes` | integer | Hayır | `>=0` | Planlama için doğrulanmış tahmini süre |
| `candidate_content[].planning_summary` | string | Evet | 1-300 karakter | AI seçimi için doğrulanmış kısa özet; kullanıcıya gösterilecek nihai gerçek değildir |
| `hard_rules` | object | Evet | Backend tarafından oluşturulur | Gün sayısı, zorunlu içerikler ve güvenlik-kritik içerik sınırları |

#### Detail input sınırları

`travel_period`, giriş/çıkış noktaları, araç alma-bırakma düzeni ve mevcut konaklama kısıtları detail AI tarafından yeniden yorumlanmaz. Backend bu bilgileri detail çağrısından önce seçilmiş rota çerçevesine, stable `start_location_id`/`end_location_id` taşıyan `day_frames`, izin verilen konaklama/araç seçenekleri ve `candidate_content` filtrelerine dönüştürür. `arrival_timing` ve `departure_timing` yalnız kullanıcının bildirdiği zaman sınırı olarak gönderilir; AI bunları değiştiremez. Saat bilinmiyorsa ilk/son günün temkinli yoğunluk kuralını backend uygular ve çıktıdaki belirsizlik etiketi hydration sırasında eklenir.

`traveler_group`, `transport_mode` ve `rental_car_assumption` AI'ya gönderilmez; MVP uygunluğu daha önce backend tarafından doğrulanmıştır.

`source_urls`, `maps_url`, koordinatlar, `last_verified_at`, tam `verified_fact`, e-posta, user ID, ham `PlanAnswers`, ham alerji/serbest açıklama metni, feedback ve önceki promptlar AI'ya gönderilmez.

`dietary_restriction_tags` yalnız yapılandırılmış machine value olarak gönderilebilir. Alerji veya `other` için girilmiş serbest açıklama AI'ya gönderilmez. Yemek adaylarının kısıtlarla uyumu backend tarafından AI çağrısından önce deterministik olarak kontrol edilir ve AI output'u sonrasında tekrar doğrulanır.

#### Detay profili alt kümesi kuralları

- Input yalnız geçerli ve kullanıcı tarafından onaylanmış `TravelProfileSnapshot` ile seçilmiş `RouteOptionsSnapshot` üzerinden oluşturulur.
- Ham veya pasif `PlanAnswers` değerleri detail AI input'una dahil edilmez.
- `impact=route` olan bir tercih, seçilmiş rotayı değiştirmeden günlük planın içeriğini veya sıralamasını hâlâ etkiliyorsa detail profil alt kümesinde kullanılabilir.
- `impact=detail` olan `dietary_restriction_tags`, detail üretiminin geçerliliğini doğrudan etkiler.
- `accommodation_priority_tags` yalnız seçilmiş rota içinde hâlâ birden fazla izinli konaklama üssü seçeneği bulunuyorsa gönderilir.
- `food_preference_tags=system_decide` ise bu değer tercih sinyali olarak gönderilmez; alan omit edilebilir.
- AI yalnız `candidate_content[].id` içinde bulunan içeriklere referans verebilir.
- AI bir içeriği `allowed_day_numbers` dışında bir güne yerleştiremez.
- AI `selected_route.day_frames` tarafından belirlenen başlangıç/bitiş ve rota kapsamını değiştiremez.
- AI yeni konum, restoran, park, deneyim, URL, çalışma saati, fiyat, koordinat veya başka gerçek üretemez.
- Backend Structured Output doğrulamasından sonra ayrıca whitelist, gün, rota, zorunlu içerik ve güvenlik kurallarını doğrular.

Production input'ta `day_frames[].allowed_content_ids` ile seçilebilir her kayıt `candidate_content` içinde gerekli metadata ile bulunur. Aşağıdaki örnek okunabilirlik için metadata listesinin yalnız iki kaydını gösterir; bu kısaltma production validation kuralı değildir.

Örnek input:

```json
{
  "contract_version": "detail-input-v3",
  "profile": {
    "duration_days": 5,
    "arrival_timing": {
      "time_known": true,
      "local_time": "09:00"
    },
    "departure_timing": {
      "time_known": true,
      "local_time": "22:00"
    },
    "pace": "balanced",
    "budget_band": "economy_mid",
    "trip_priority_tags": [
      "iconic_must_see",
      "photo_social",
      "beach_sea"
    ],
    "accommodation_priority_tags": [
      "easy_parking",
      "proximity"
    ],
    "food_preference_tags": [
      "local_popular",
      "budget"
    ],
    "dietary_restriction_tags": [
      "none"
    ],
    "parking_priority": "balanced",
    "walking_tolerance": "up_to_15_min",
    "night_driving_preference": "avoid",
    "must_have_experience_ids": [
      "exp_kotor_cable_car"
    ]
  },
  "selected_route": {
    "route_template_id": "route_adriatic_balanced_5d",
    "accommodation_base_ids": [
      "base_budva",
      "base_kotor"
    ],
    "car_pickup_dropoff_option_ids": [
      "car_tirana_round_trip"
    ],
    "day_frames": [
      {
        "day_number": 1,
        "start_location_id": "loc_tirana_airport",
        "end_location_id": "loc_budva",
        "allowed_content_ids": [
          "car_tirana_round_trip",
          "exp_budva_old_town",
          "park_budva_main"
        ]
      },
      {
        "day_number": 2,
        "start_location_id": "loc_budva",
        "end_location_id": "loc_budva",
        "allowed_content_ids": [
          "exp_budva_old_town",
          "food_budva_local"
        ]
      },
      {
        "day_number": 3,
        "start_location_id": "loc_budva",
        "end_location_id": "loc_kotor",
        "allowed_content_ids": [
          "exp_kotor_cable_car",
          "park_kotor_main"
        ]
      },
      {
        "day_number": 4,
        "start_location_id": "loc_kotor",
        "end_location_id": "loc_kotor",
        "allowed_content_ids": [
          "exp_kotor_old_town",
          "planb_kotor_short"
        ]
      },
      {
        "day_number": 5,
        "start_location_id": "loc_kotor",
        "end_location_id": "loc_tirana_airport",
        "allowed_content_ids": [
          "critical_return_buffer"
        ]
      }
    ]
  },
  "candidate_content": [
    {
      "id": "exp_kotor_cable_car",
      "type": "experience",
      "allowed_day_numbers": [
        3,
        4
      ],
      "fit_tags": [
        "iconic_must_see",
        "photo_social"
      ],
      "priority": "must_do",
      "estimated_duration_minutes": 150,
      "planning_summary": "Simgesel deneyim; hava ve çalışma durumu kullanıcı tarafından yeniden kontrol edilmelidir."
    },
    {
      "id": "park_kotor_main",
      "type": "parking",
      "allowed_day_numbers": [
        3,
        4
      ],
      "fit_tags": [
        "balanced",
        "up_to_15_min"
      ],
      "priority": "primary",
      "estimated_duration_minutes": 15,
      "planning_summary": "Old Town başlangıcına erişim sağlayan doğrulanmış ana park adayı."
    }
  ],
  "hard_rules": {
    "required_day_count": 5,
    "required_content_ids": [
      "exp_kotor_cable_car",
      "critical_return_buffer"
    ],
    "safety_critical_content_ids": [
      "critical_return_buffer"
    ]
  }
}
```

## 8. AI Output Contracts

### 8.1. RouteRecommendationOutput

| Alan | Tip | Required | Enum / sınır | Açıklama |
| --- | --- | --- | --- | --- |
| `contract_version` | string | Evet | `route-output-v1` | Output şema sürümü |
| `recommended_route_template_id` | string | Evet | Input adaylarından biri ve `rank=1` option | Önerilen rota |
| `options` | array | Evet | 1-3 | Yalnız input adayları; benzersiz |
| `options[].route_template_id` | string | Evet | Input allowlist | Seçilen şablon |
| `options[].rank` | integer | Evet | 1..N | Boşluksuz sıra |
| `options[].fit_reasons` | array | Evet | 1-3 | Kod + kısa AI metni |
| `options[].fit_reasons[].code` | string | Evet | Aday `strength_codes` içinden | Doğrulanabilir gerekçe |
| `options[].fit_reasons[].text` | string | Evet | 1-180; düz metin | Kişiselleştirilmiş açıklama |
| `options[].main_tradeoff` | object | Evet | Tek | Açık karar bedeli |
| `options[].main_tradeoff.code` | string | Evet | Aday `tradeoff_codes` içinden | Doğrulanabilir taviz |
| `options[].main_tradeoff.text` | string | Evet | 1-180; düz metin | Kullanıcıya açıklama |
| `options[].unmet_preference_notes` | string[] | Evet | 0-2, her biri 1-180 | Tam karşılanamayan tercih; yeni gerçek içermez |

Örnek output:

```json
{
  "contract_version": "route-output-v1",
  "recommended_route_template_id": "route_adriatic_balanced_5d",
  "options": [
    {
      "route_template_id": "route_adriatic_balanced_5d",
      "rank": 1,
      "fit_reasons": [
        {"code": "balanced_pace", "text": "Dengeli tempo tercihinle rotanın sürüş ve gezi dağılımı uyumlu."},
        {"code": "must_have_covered", "text": "Zorunlu seçtiğin deneyim rota kapsamındaki doğrulanmış adaylarda bulunuyor."},
        {"code": "no_night_drive", "text": "Rota çerçevesi zorunlu gece sürüşü gerektirmiyor."}
      ],
      "main_tradeoff": {"code": "one_base_change", "text": "Plan boyunca bir kez konaklama üssü değiştirmen gerekiyor."},
      "unmet_preference_notes": []
    }
  ]
}
```

**Boş sonuç davranışı:** Backend filtresi sıfır aday döndürürse AI çağrılmaz ve `NO_SUPPORTED_ROUTE` sonucu üretilir. AI'nın boş `options` döndürmesi geçersiz output'tur.
**Hata/belirsizlik davranışı:** JSON parse/schema veya allowlist hatasında en fazla bir kontrollü repair çağrısı yapılır. İkinci hata sonrası sonuç kaydedilmez. Kritik profil bilgisi varsayımsa bu durum backend'in hydrate ettiği kullanıcı etiketinde gösterilir; AI yeni varsayım üretmez.

### 8.2. DetailedTripPlanOutput

| Alan | Tip | Required | Enum / sınır | Açıklama |
| --- | --- | --- | --- | --- |
| `contract_version` | string | Evet | `detail-output-v1` | Output şema sürümü |
| `overview` | object | Evet | Tek | AI anlatımı + seçilen verified ID'ler |
| `overview.summary` | string | Evet | 1-400; düz metin | Gerçek eklemeyen plan özeti |
| `overview.accommodation_base_ids` | string[] | Evet | Input allowlist | Konaklama üsleri |
| `overview.car_pickup_dropoff_option_id` | string/null | Evet | Input allowlist veya null | Doğrulanmış karar seçeneği |
| `pre_trip_critical_information_ids` | string[] | Evet | Input allowlist | Seyahat öncesi uyarılar |
| `days` | array | Evet | Tam `duration_days` | Gün planları |
| `days[].day_number` | integer | Evet | 1..N | Benzersiz, sıralı |
| `days[].title` | string | Evet | 1-100 | AI anlatımı; yeni yer adı üretmez |
| `days[].summary` | string | Evet | 1-280 | Kısa gün anlatımı |
| `days[].pace` | enum | Evet | `relaxed`, `balanced`, `intensive` | Önerilen gün temposu |
| `days[].overnight_base_id` | string/null | Evet | Gün 1..N-1 için seçili rotanın izinli üssü; son gün `null` | O geceki üs |
| `days[].critical_information_ids` | string[] | Evet | Input allowlist | Gün kapsamındaki gerçekler |
| `days[].steps` | array | Evet | 1-12 | Kronolojik plan adımları |
| `steps[].order` | integer | Evet | 1..M | Boşluksuz, benzersiz |
| `steps[].time_slot` | enum | Evet | `early_morning`, `morning`, `midday`, `afternoon`, `evening` | Planlanan yaklaşık blok; gerçek çalışma saati değildir |
| `steps[].step_type` | enum | Evet | `drive`, `experience`, `meal`, `break`, `free_time`, `accommodation`, `airport` | Adım türü |
| `steps[].content_ids` | string[] | Evet | 0-8, input/day allowlist | Bu adımda kullanılan doğrulanmış içerikler |
| `steps[].from_content_id` | string/null | Evet | Günün content allowlist'i veya sabit başlangıç/bitiş location ID'si | Sürüş başlangıcı gerekiyorsa |
| `steps[].to_content_id` | string/null | Evet | Günün content allowlist'i veya sabit başlangıç/bitiş location ID'si | Sürüş bitişi gerekiyorsa |
| `steps[].allocated_minutes` | integer | Evet | 15-480 | Planlanan süre; verified duration alt sınırlarını bozamaz |
| `steps[].purpose` | string | Evet | 1-220 | Neden bu adım burada? |
| `steps[].shorten_action` | enum | Evet | `keep`, `shorten`, `skip_if_needed` | Zaman daralırsa davranış |
| `days[].plan_b` | object/null | Evet | En fazla 1/gün | Gün düzeyinde alternatif |
| `plan_b.trigger_codes` | enum[] | Koşullu | 1-3: `delay`, `fatigue`, `weather`, `closure`, `border_wait` | Anlamlı tetikleyiciler |
| `plan_b.keep_step_orders` | integer[] | Koşullu | Mevcut step order'ları | Korunan adımlar |
| `plan_b.remove_or_shorten_step_orders` | integer[] | Koşullu | Mevcut step order'ları | Sadeleştirilen adımlar |
| `plan_b.replacement_content_ids` | string[] | Koşullu | 0-3; gün allowlist'i ve ilgili Plan B kaydının replacement allowlist'i | Yalnız doğrulanmış Plan B adayları |
| `plan_b.summary` | string | Koşullu | 1-300 | Sade akış |
| `plan_b.reason` | string | Koşullu | 1-220 | Neden daha uygulanabilir? |

AI tarafından yazılan `days[].title`, `days[].summary`, `purpose` ve Plan B metinleri yeni yer veya içerik adı üretmez. Kullanıcı arayüzü günün ve adımın doğrulanmış yer adlarını `DetailedPlanSnapshot` içindeki hydrate edilmiş location/content görünümlerinden ekler.

Örnek output:

```json
{
  "contract_version": "detail-output-v1",
  "overview": {
    "summary": "Dengeli tempoda kıyı, simgesel deneyimler ve güvenli dönüş payını birlikte koruyan beş günlük plan.",
    "accommodation_base_ids": ["base_budva", "base_kotor"],
    "car_pickup_dropoff_option_id": "car_tirana_round_trip"
  },
  "pre_trip_critical_information_ids": ["critical_return_buffer"],
  "days": [
    {
      "day_number": 1,
      "title": "Varış ve konaklama üssüne geçiş",
      "summary": "İlk gün varış sonrası ana hareket ve kısa bir şehir deneyimiyle sınırlı tutulur.",
      "pace": "balanced",
      "overnight_base_id": "base_budva",
      "critical_information_ids": [],
      "steps": [
        {
          "order": 1,
          "time_slot": "morning",
          "step_type": "airport",
          "content_ids": ["car_tirana_round_trip"],
          "from_content_id": "loc_tirana_airport",
          "to_content_id": "loc_tirana_airport",
          "allocated_minutes": 90,
          "purpose": "Aracı teslim alıp rota başlangıcına hazırlanmak.",
          "shorten_action": "keep"
        },
        {
          "order": 2,
          "time_slot": "midday",
          "step_type": "drive",
          "content_ids": [],
          "from_content_id": "loc_tirana_airport",
          "to_content_id": "loc_budva",
          "allocated_minutes": 160,
          "purpose": "Seçili rota çerçevesindeki ilk konaklama üssüne ulaşmak.",
          "shorten_action": "keep"
        },
        {
          "order": 3,
          "time_slot": "afternoon",
          "step_type": "experience",
          "content_ids": ["exp_budva_old_town", "park_budva_main"],
          "from_content_id": null,
          "to_content_id": null,
          "allocated_minutes": 120,
          "purpose": "Varış gününde rotayı ağırlaştırmadan doğrulanmış ana deneyimi görmek.",
          "shorten_action": "skip_if_needed"
        }
      ],
      "plan_b": {
        "trigger_codes": ["delay", "fatigue"],
        "keep_step_orders": [1, 2],
        "remove_or_shorten_step_orders": [3],
        "replacement_content_ids": [],
        "summary": "Varış işlemlerini koru; şehir deneyimini ertesi uygun güne bırak.",
        "reason": "Gecikmede gece sürüşü ve yorgunluk riskini artırmadan konaklama üssüne ulaşmayı önceliklendirir."
      }
    },
    {
      "day_number": 2,
      "title": "Dengeli keşif günü",
      "summary": "Doğrulanmış deneyim ve yemek adayları dengeli bir sırada kullanılır.",
      "pace": "balanced",
      "overnight_base_id": "base_budva",
      "critical_information_ids": [],
      "steps": [
        {
          "order": 1,
          "time_slot": "morning",
          "step_type": "experience",
          "content_ids": ["exp_budva_old_town"],
          "from_content_id": null,
          "to_content_id": null,
          "allocated_minutes": 150,
          "purpose": "Rotanın doğrulanmış ana şehir deneyimine yeterli zaman ayırmak.",
          "shorten_action": "keep"
        }
      ],
      "plan_b": null
    },
    {
      "day_number": 3,
      "title": "Konaklama üssü değişimi ve simgesel deneyim",
      "summary": "Seçili rotanın zorunlu deneyimi ve konaklama değişimi aynı gün çerçevesinde ele alınır.",
      "pace": "balanced",
      "overnight_base_id": "base_kotor",
      "critical_information_ids": [],
      "steps": [
        {
          "order": 1,
          "time_slot": "morning",
          "step_type": "drive",
          "content_ids": [],
          "from_content_id": "loc_budva",
          "to_content_id": "loc_kotor",
          "allocated_minutes": 60,
          "purpose": "Seçili rota çerçevesindeki ikinci konaklama üssüne geçmek.",
          "shorten_action": "keep"
        },
        {
          "order": 2,
          "time_slot": "afternoon",
          "step_type": "experience",
          "content_ids": ["exp_kotor_cable_car", "park_kotor_main"],
          "from_content_id": null,
          "to_content_id": null,
          "allocated_minutes": 180,
          "purpose": "Kullanıcının zorunlu deneyimini rota kapsamındaki uygun günde gerçekleştirmek.",
          "shorten_action": "keep"
        }
      ],
      "plan_b": null
    },
    {
      "day_number": 4,
      "title": "Dengeli şehir keşfi",
      "summary": "Ana rota kapsamında kalan doğrulanmış içerikler dengeli biçimde kullanılır.",
      "pace": "balanced",
      "overnight_base_id": "base_kotor",
      "critical_information_ids": [],
      "steps": [
        {
          "order": 1,
          "time_slot": "morning",
          "step_type": "experience",
          "content_ids": ["exp_kotor_old_town"],
          "from_content_id": null,
          "to_content_id": null,
          "allocated_minutes": 180,
          "purpose": "Doğrulanmış ana deneyimi günün temel odağı yapmak.",
          "shorten_action": "keep"
        }
      ],
      "plan_b": null
    },
    {
      "day_number": 5,
      "title": "Güvenli dönüş",
      "summary": "Dönüş tamponu korunarak rota çıkış noktasında tamamlanır.",
      "pace": "relaxed",
      "overnight_base_id": null,
      "critical_information_ids": ["critical_return_buffer"],
      "steps": [
        {
          "order": 1,
          "time_slot": "morning",
          "step_type": "drive",
          "content_ids": ["critical_return_buffer"],
          "from_content_id": "loc_kotor",
          "to_content_id": "loc_tirana_airport",
          "allocated_minutes": 300,
          "purpose": "Doğrulanmış dönüş payını koruyarak çıkış noktasına ulaşmak.",
          "shorten_action": "keep"
        }
      ],
      "plan_b": null
    }
  ]
}
```

**Boş sonuç davranışı:** Seçili rotaya ait zorunlu aday paketi eksikse AI çağrılmaz; `INSUFFICIENT_VERIFIED_CONTENT` döner. AI'nın sıfır gün veya boş gün listesi döndürmesi geçersizdir. Bir günde anlamlı Plan B yoksa `plan_b=null` olmalıdır; yapay bir alternatif üretilmez.
**Hata/belirsizlik davranışı:** Bilinmeyen ID, yanlış tür, yanlış gün, gün sayısı uyuşmazlığı, zorunlu/safety-critical ID eksikliği veya şema hatasında en fazla bir kontrollü repair yapılır. İkinci başarısızlıkta ham çıktı atılır, önceki plan korunur ve run `failed` olur.

## 9. Doğrulanmış içerik ↔ AI sınırı

| Veri / işlem | AI okuyabilir mi? | AI seçebilir mi? | AI üretebilir mi? | AI değiştirebilir mi? | Son kullanıcıya kaynağı |
| --- | --- | --- | --- | --- | --- |
| Stable içerik ID | Yalnız filtrelenmiş paket | Evet, allowlist içinden | Hayır | Hayır | Doğrulanmış içerik |
| İsim / görünen ad | Gerekmedikçe gönderilmez | Hayır | Hayır | Hayır | Backend hydrate |
| Koordinat / Maps URL | Hayır | Hayır | Hayır | Hayır | Backend hydrate |
| Fiyat / çalışma saati / canlı durum | Hayır | Hayır | Hayır | Hayır | MVP'de canlı gerçek olarak sunulmaz |
| `last_verified_at` / `variability_note` | Hayır | Hayır | Hayır | Hayır | Backend hydrate |
| Kritik gerçek / güvenlik uyarısı | Yalnız gerekirse kısa planlama flag'i | İlgili kaydı seçebilir | Hayır | Hayır | Backend hydrate |
| Rota adayı | Evet, ID ve gerekli özet | Evet | Yeni aday hayır | Gerçek alanları hayır | Verified template + AI sıralama |
| Gün/adım sırası | Evet, izin çerçevesi | Evet | Evet, öneri olarak | Verified içeriği hayır | AI önerisi |
| Zaman bloğu / ayrılan süre | Verified alt sınırları okur | Evet | Evet, planlama önerisi | Verified süreyi hayır | AI önerisi + backend kontrol |
| Gerekçe / özet / Plan B anlatımı | Gerekli profile/tag'leri okur | Kodları seçer | Evet, sınırlı düz metin | Verified gerçeği hayır | AI tarafından oluşturulan açıklama |
| Kullanıcı e-postası / gerçek user ID | Hayır | Hayır | Hayır | Hayır | AI sınırı dışında |

AI'nın "Şu restoranı öneriyorum" diyerek yeni nesne üretmesi yasaktır. Doğru biçim, örneğin `food_kotor_local_01` gibi mevcut `verified_content_id` değerini seçmesidir. Backend ID'yi allowlist ile doğrular; kullanıcıya ad, harita bağlantısı ve doğrulama bilgilerini asıl kayıttan ekler.

Bu stable ID yaklaşımı teknik planla uyumludur. Kullanıcının plan içi seçimi `selected_route_option_id`, bunun doğrulanmış kaynak şablonu ise seçilen option'ın `route_template_id` alanıdır; iki kimlik birbirinin yerine kullanılmaz.

## 10. Validation kuralları

### Frontend validation

- Catalog'a göre görünür, required ve conditional alanları kontrol eder.
- Seçim sayısı, integer aralığı, metin uzunluğu ve temel biçimi anında gösterir.
- `duration_days` için 4-6, bütçe için MVP enum'u ve content seçimleri için yalnız backend'in sunduğu ID'leri kullanır.
- Rota seçimi yalnız ekranda bulunan `route_option_id` ile yapılır.
- Feedback formu yalnız `detail_ready` plan için açılır; rating alanları 1-5, comment en fazla 1000 karakterdir.
- Bu kontroller kullanıcı deneyimi içindir; güvenlik sınırı sayılmaz.

### Backend validation

- Her istekte oturum, plan sahipliği ve izin verilen state transition kontrol edilir.
- Cevap PATCH isteklerinde `expected_revision`, kalıcı `PlanAnswers.revision` ile atomik karşılaştırılır; eski veya sırası bozulmuş istek yeni snapshot'ı ezemez.
- Request body'deki `user_id`, verified fact, URL, koordinat, content metadata gibi alanlar yok sayılmaz; bilinmeyen/izin verilmeyen alan olarak reddedilir.
- `PlanAnswers`, ilgili `QuestionCatalog.catalog_version` üzerinden `questions[].id`, `value_type`, `allowed_values`, `requirement`, `visible_if` ve `constraints` kurallarına göre doğrulanır. Tek başına geçerli pasif cevaplar `values` içinde dormant saklanabilir; fakat runtime `active_values`, `TravelProfileSnapshot`, AI input'u veya `input_hash` hesabına dahil edilmez ve yeniden aktif olduklarında tekrar doğrulanır.
- Çift + kiralık araç, pilot destinasyon ve 4-6 gün uygunluğu AI çağrısından önce kontrol edilir.
- `TravelProfileSnapshot` yalnız backend tarafından doğrulanmış canonical aktif cevaplardan oluşturulur; frontend doğrudan profil snapshot'ı gönderemez.
- Başarılı cevap değişikliğinde ilgili `QuestionCatalog.questions[].impact` değeri uygulanır: `eligibility` desteklenen akış uygunluğunu, `route` profil ve rota/detail çıktılarının yeniden üretilmesini, `detail` ise yalnız ayrıntılı planın yeniden üretilmesini gerektirir.
- Route/detail çağrılarında önce güncel snapshot provenance'ı ile input hash eşleşmesi kontrol edilir; eşleşme yoksa kullanıcı/plan-stage/aylık bütçe anahtarları database düzeyinde serialize edilerek kota/bütçe kontrolü ve aktif run rezervasyonu aynı transaction içinde yapılır.
- Route selection ID'sinin bu planın geçerli `route_options.options[].route_option_id` değerlerinden biri olduğu doğrulanır.
- Verified içerik ID'si, tipi, kapsamı ve content version'ı server-only allowlist ile doğrulanır.
- AI sonucu başarıyla doğrulanıp hydrate edilmeden `plans` snapshot alanı değiştirilmez.
- Snapshot yazma transaction'ında güncel plan state'i/seçimi ve yeniden hesaplanan stage `input_hash` rezervasyonla eşleşmelidir; eşleşmezse eski üretim sonucu kaydedilmez.
- Feedback plan sahipliği, `status=detail_ready`, mevcut `detailed_plan` ve schema ile doğrulanır; composite ownership foreign key başka kullanıcının planına bağlanmayı, `(user_id, plan_id)` unique constraint ve `PUT` upsert davranışı ise tekrar gönderimde ikinci satırı engeller.

### Üretim kotası ve token sınırları

- Bir üretim işlemi, güncel snapshot cache hit'i olmayan ve atomik olarak yeni `reserved` run satırı oluşturabilen route veya detail generate isteğidir. Validation hatası, güncel snapshot cache hit'i ve `409 GENERATION_IN_PROGRESS` ile reddedilen eşzamanlı tekrar kota tüketmez. Aynı işlem içindeki tek kontrollü repair/sağlayıcı retry ayrı kullanıcı işlemi sayılmaz.
- Kota kontrolü ile run insert'i aynı dar database transaction'ındadır; kullanıcı, plan-stage ve aylık global bütçe anahtarları serialize edilerek farklı hash'li eşzamanlı isteklerin sınırı birlikte aşması engellenir.
- Kullanıcı başına en fazla 4 üretim işlemi / kayan 24 saat uygulanır.
- Plan + stage başına en fazla 2 üretim işlemi / kayan 24 saat uygulanır.
- MVP'de arşiv durumu yoktur; kullanıcı başına `status` değerinden bağımsız olarak en fazla 3 fiziksel olarak silinmemiş plan bulunabilir.
- Route çağrısı en fazla 12.000 input ve 2.000 output token; detail çağrısı en fazla 24.000 input ve 8.000 output token kullanır.
- Her kullanıcı işlemi en fazla bir schema-guided repair veya sağlayıcı retry içerir.
- Planın ilgili alanındaki güncel ve geçerli snapshot'ın provenance `input_hash` değeri eşleşirse dönen cache hit kota ve global AI bütçesini tüketmez. Yalnız tarihsel `succeeded` run bulunması cache hit için yeterli değildir.
- Değerler server environment configuration ile değiştirilebilir; değişiklik test ve karar günlüğünde izlenir. Global aylık AI bütçesi başlangıçta 7 USD'dir.

### AI output validation

Route output için:

1. JSON parse ve tam schema uyumu.
2. Contract version eşleşmesi; unknown field reddi.
3. `options` uzunluğu 1-3; ID'ler benzersiz ve input adaylarından.
4. Önerilen ID options içinde ve `rank=1`; tam bir önerilen rota.
5. Rank değerleri 1..N ve benzersiz.
6. Her strength/tradeoff code ilgili adayın allowlist'inde.
7. Metinler düz metin, uzunluk içinde; HTML, Markdown linki, URL, fiyat/çalışma saati iddiası içermez.

Detail output için:

1. JSON parse ve tam schema uyumu; unknown field reddi.
2. Gün sayısı profil süresine eşit; gün numaraları 1..N.
3. Her content ID input allowlist'inde, doğru türde ve doğru gün kapsamındadır.
4. Zorunlu ve safety-critical ID'lerin tamamı uygun yerde bulunur.
5. Gün 1..N-1 tam bir izinli `overnight_base_id`, son gün `null` taşır; gecelerin sırası ve toplamı seçili rota `overnight_distribution` değeri ile, varsa mevcut konaklama kısıtlarıyla uyumludur.
6. `steps.order` boşluksuz; `time_slot` sırası geriye gitmez; gün başına 1-12 adım.
7. Sürüş adımında `from/to`; içerik adımında uygun `content_ids` zorunludur. `from/to`, aynı günün content allowlist'inde veya `day_frame` başlangıç/bitiş location ID'lerinde bulunmalıdır.
8. Bir `day_frame` başlangıç ve bitiş location ID'leri farklıysa gün, bu hareketi başlangıçtan bitişe kesintisiz karşılayan sıralı sürüş adımı zinciri taşır; rota başlangıç/bitişi atlanamaz veya ters çevrilemez. Günler boyunca sürüş dakikaları seçili rota şablonunun doğrulanmış toplam/en uzun gün ölçüleriyle çelişemez.
9. İlk ve son günün zaman blokları bilinen `arrival_timing`/`departure_timing` sınırlarını ihlal etmez; saat bilinmiyorsa backend'in temkinli yoğunluk kuralı uygulanır ve kesin saat iddiası üretilmez.
10. `allocated_minutes` temel süre ve günlük uygulanabilirlik sınırlarını bozmaz.
11. Aynı içerik gereksiz tekrar edilmez; izinli tekrarlar content metadata ile açık olmalıdır.
12. Plan B yalnız mevcut step order'larına, günün allowlist'ine ve ilgili doğrulanmış `plan_b_option` kaydının izin verdiği replacement ID'lerine referans verir; ana planı silmez.
13. Output'ta URL, koordinat, fiyat, çalışma saati, doğrulama tarihi veya source alanı bulunamaz.

Schema uyumu semantik doğruluk değildir. AI metnindeki gerekçe, seçilen code/ID ile çelişiyorsa domain validator veya eval testi sonucu reddeder. Tam otomatik semantik doğrulama mümkün olmayan metinler kısa tutulur ve verified gerçek olarak etiketlenmez.

## 11. Hata ve fallback davranışları

| Durum | Sistem davranışı | Veri koruma |
| --- | --- | --- |
| JSON parse edilemiyor | En fazla bir schema-guided repair; sonra `AI_SCHEMA_INVALID` | Ham cevap saklanmaz; önceki snapshot korunur |
| Required alan eksik / enum dışı | Aynı repair sınırı; ikinci hatada güvenli hata | Plan aşaması geriye alınmaz |
| Olmayan verified content ID | `AI_UNKNOWN_CONTENT_ID`; sonuç kesinlikle hydrate/kaydetme görmez | Mevcut rota/detay korunur |
| Gün sayısı uyuşmuyor | `AI_DAY_COUNT_MISMATCH`; bir repair | Mevcut detay korunur |
| Zorunlu/safety-critical içerik eksik | `AI_REQUIRED_CONTENT_MISSING`; bir repair | Eksik plan kullanıcıya tamamlandı gösterilmez |
| Deterministik filtre sıfır rota | AI çağrısı yok; `NO_SUPPORTED_ROUTE`; kullanıcı cevaplarını düzenleyebilir | Taslak cevaplar korunur |
| Doğrulanmış detail paketi yetersiz | AI çağrısı yok; `INSUFFICIENT_VERIFIED_CONTENT` | Seçili rota ve önceki veriler korunur |
| Kota/bütçe dolu | `RATE_LIMITED`/`BUDGET_PAUSED`; yeni üretim durur, kayıtlı plan okunur | Taslak ve snapshot korunur |
| AI timeout/servis hatası | Run `failed`; açık kullanıcı retry'ı aynı input hash kurallarıyla yeni run olarak rezerve edilebilir | Önceki başarılı alan null yapılmaz |
| Database kayıt hatası | AI sonucu tamamlanmış gösterilmez; `PERSISTENCE_FAILED` | Atomik write yoksa snapshot değişmez |
| Oturum yok | `401 AUTH_REQUIRED` | Veri sızdırılmaz |
| Olmayan veya başka kullanıcının planı | Ayrım yapmadan `404 PLAN_NOT_FOUND` | Başka kullanıcı verisi ve planın varlığı dönmez |
| Aynı run hâlâ rezerve | `409 GENERATION_IN_PROGRESS`; yeni AI çağrısı yok | Mevcut snapshot ve rezervasyon korunur |
| Üretim sürerken ilgili cevap/state/seçim değişti | `409 STALE_GENERATION_INPUT`; eski sonuç kaydedilmez, run `failed` kapanır | Güncel cevap, seçim ve snapshot'lar korunur |
| Frontend kaydetme hatası | `Kaydedilmedi` görünür; bellekte cevap tutulur ve kullanıcı yeniden dener | Son başarılı database cevabı korunur |
| Cevap autosave revision'ı eski | `409 ANSWERS_VERSION_CONFLICT`; son canonical cevap/revision döner ve UI güvenli uzlaştırma ister | Yeni cevap snapshot'ı eski istekle ezilmez |

Frontend'e dönen ortak `ApiError` sözleşmesi yalnız şu alanları taşır: `code` (allowlist string, zorunlu), `message` (güvenli kullanıcı metni, zorunlu), `retryable` (boolean, zorunlu), `field_errors` (`field -> safe message`, opsiyonel) ve `request_id` (kişisel verisiz korelasyon kimliği, opsiyonel). Stack trace, provider cevabı, prompt veya başka kullanıcı verisi dönmez.

Deterministik fallback ilk release kapsamında değildir. Tekrarlayan model/schema hataları kaliteyi sürekli engeller veya bütçe yeni üretimi uzun süre durdurursa ayrı ürün/teknik kararla yeniden değerlendirilir. İlk release'te güvenli hata, kontrollü yeniden deneme ve mevcut cevap/snapshot'ların korunması uygulanır; sistem sessizce düşük kişiselleştirmeli başka bir plan üretmez.

## 12. Contract ownership / tek kaynak yaklaşımı

Repository kurulduğunda aynı yapı frontend, backend ve AI için üç kez elle tanımlanmayacaktır.

| Contract | Asıl sahibi | Tüketenler | Not |
| --- | --- | --- | --- |
| `QuestionCatalog` + `PlanAnswers` | Paylaşılan domain contracts | Frontend, backend | UI seçenekleri ve backend validation aynı catalog'dan |
| `TravelProfileSnapshot` | Paylaşılan domain contracts | Backend, AI input builder, frontend özet | Ham cevaplardan yalnız backend üretir |
| `RouteOptionsSnapshot` | Paylaşılan domain contracts | Backend, frontend, database JSONB | Ham AI output ile aynı değildir |
| `DetailedPlanSnapshot` | Paylaşılan domain contracts | Backend, frontend, database JSONB | Hydrated kullanıcı verisi |
| `VerifiedContentRecord` | Server-only content contracts | Build validation, backend filter/hydrator | Frontend/AI kaynak URL'lerini görmez |
| AI input/output contracts | Server-only AI contracts | Backend generator, Structured Outputs, tests | Frontend ham AI sözleşmesini tüketmez |
| `Feedback` request/record | Paylaşılan domain contracts | Frontend, backend, database | `user_id` request body'den gelmez |
| `GenerationRun` | Server/database contracts | Backend quota/log modülü | Tarayıcı erişimine kapalı |
| `ApiError` | Paylaşılan transport contract | Backend, frontend | Alan düzeyi hata ve güvenli error code |

Contract değişiklik etkisi:

- `PlanAnswers` veya profil alanı değişirse soru UI'ı, backend validation, profile builder ve ilgili AI input builder etkilenir.
- AI input değişirse input hash, prompt ve eval fixture sürümü değişir.
- AI output değişirse Structured Output schema, domain validator, hydrator ve AI contract testleri etkilenir.
- Hydrated snapshot değişirse frontend render, database JSONB okuma/yazma ve reopen E2E testi etkilenir.
- Verified content contract değişirse content JSON'ları, build validation, filter/hydrator ve link testleri etkilenir.

Bu belge insan tarafından okunabilir ana sözleşmedir. Repository aşamasında machine-readable şemalar üretilir; bu belgeyle çelişen kod sessizce kabul edilmez.

## 13. MVP dışında bırakılan veri yapıları

Aşağıdakiler için entity, tablo, API, event veya şema oluşturulmaz:

- Ödeme, rezervasyon, tur/affiliate ve partner işlemleri.
- Otel/Airbnb ilanı, araç firması, araç modeli, sigorta, rezervasyon numarası.
- Canlı trafik, rota, fiyat, çalışma saati, doluluk veya otomatik güncellik verisi.
- Sosyal ağ, kullanıcılar arası yorum, içerik bazlı ayrı yorum sistemi.
- Gelişmiş kullanıcı profili, rol/organizasyon veya farklı kullanıcı tipleri.
- Gelişmiş admin/CMS, editoryal workflow tablosu.
- Manuel rota editörü, sürükle-bırak gün düzenleme, rotaları birleştirme.
- Canlı sohbet/asistan, sınırsız yeniden üretim veya streaming event modeli.
- Queue, websocket, event bus, üretim cron'u, mikroservis, cache, vector database veya embeddings. Yalnız 35 günü dolan `GenerationRun` kayıtlarını silen dar retention görevi istisnadır.
- Dosya yükleme/object storage, offline sync/PWA conflict modeli.
- Analytics warehouse, ayrıntılı event tracking veya içerik bazlı feedback tabloları.

## 14. Kanban öncesi kararların durumu

### Karar 1 — Rota kimliği

Kabul edildi: Kullanıcı seçimi `selected_route_option_id` ile aynı planın `RouteOptionsSnapshot.options[].route_option_id` değerine; kaynak doğrulanmış rota ise option içindeki `route_template_id` değerine referans verir.

### Karar 2 — Plan ve üretim hata durumu

Kabul edildi: `failed`, `Plan.status` değeri değildir. Başarısız üretim `GenerationRun.status=failed` ve güvenli `ApiError` ile tutulur; son başarılı plan aşaması korunur.

### Karar 3 — Feedback cardinality

Kabul edildi: Kullanıcı-plan çifti başına tek feedback vardır. `PUT /api/plans/:id/feedback` upsert uygular; `(user_id, plan_id)` unique constraint ikinci satırı engeller.

### Karar 4 — QuestionCatalog

Kabul edildi: `QuestionCatalog v1.0.0`, soru ID'leri, tipler, enum'lar, sınırlı `visible_if` grammar'ı, object alt şekilleri, constraint'ler ve `eligibility | route | detail` impact değerleri için tek kaynaktır. Repository aşamasında aynı sözleşme TypeScript/Zod'a dönüştürülür; ayrı frontend/backend listeleri veya `question-catalog.md` oluşturulmaz.

### Karar 5 — Aşama bazlı provenance

Kabul edildi: `RouteOptionsSnapshot` ve `DetailedPlanSnapshot` kendi `GenerationProvenance` nesnesini taşır. Plan düzeyinde son üretimi temsil eden ortak provenance kolonları yoktur.

### Karar 6 — Stable location sahibi

Kabul edildi: Server-only verified içerikte ortak `location` discriminated türü kullanılır. `entry_point_id`, `exit_point_id`, `destination_sequence_ids` ve gün başlangıç/bitiş noktaları bu stable ID'lere referans verir; ayrı database tablosu kurulmaz.

### Karar 7 — Cache ve generation run rezervasyonu

Kabul edildi: Cache hit yalnız ilgili plan alanındaki güncel ve geçerli snapshot provenance'ının hesaplanan `input_hash` değeriyle eşleşmesidir. Tarihsel bir `succeeded` run tek başına cache değildir. Cache miss olan her kullanıcı işlemi yeni run oluşturur; aynı `(plan_id, stage, input_hash)` için aynı anda yalnız bir `reserved` run bulunabilir. Süresi dolmuş rezervasyon `failed` kapatılır ve açık kullanıcı retry'ı yeni run olarak kaydedilir.

### Karar 8 — Autosave revision koruması

Kabul edildi: `PlanAnswers.revision` her başarılı canonical cevap yazımında atomik artar. Her cevap PATCH isteği `expected_revision` taşır; eski veya sırası bozulmuş istek `409 ANSWERS_VERSION_CONFLICT` alır ve yeni snapshot'ı ezemez. Profil onayı sonrası değişiklik ayrıca açık invalidation onayı gerektirir.

### Karar 9 — Varış/dönüş zamanı ve günlük hareket bütünlüğü

Kabul edildi: Varış/dönüş saat kesinliği onaylı profile kayıpsız taşınır; bilinmeyen saat kesin değer gibi doldurulmaz. Konum değiştiren günler başlangıçtan bitişe sürüş zinciri taşır; gece ve sürüş ölçüleri seçili doğrulanmış rota şablonuyla uyuşmadan detay snapshot'ı kaydedilmez.

Kanban başlangıcını engellemeyen fakat public release öncesi yazılı hale getirilmesi gereken tek içerik konusu, tür bazında `last_verified_at` eskime eşiği ve safety-critical yeniden doğrulama süresidir.

## 15. Repository'ye geçiş notları

Bu belge ve Lean kapısı kabul edilmiştir. Repository/Kanban uygulama aşamasında Codex bu sözleşmeleri kullanarak aşağıdaki teknik dosya türlerini oluşturabilir; bu aşamada henüz hiçbiri oluşturulmamıştır:

1. Paylaşılan domain tipleri ve runtime validation şemaları.
2. `QuestionCatalog`, `PlanAnswers`, `TravelProfileSnapshot`, `RouteOptionsSnapshot`, `DetailedPlanSnapshot`, `Feedback` ve `ApiError` için machine-readable contracts.
3. Route/detail AI input-output JSON Schema'ları ve Structured Outputs tanımları.
4. Server-only doğrulanmış içerik tür şemaları ve build-time içerik validator'ları.
5. AI domain validator, whitelist/hydrator ve deterministic input-hash kuralları.
6. `plans`, `feedback`, `generation_runs` migration'ları; RLS ve ownership policy'leri.
7. API request/response şemaları ve state-transition guard'ları.
8. Contract fixture'ları, bilinmeyen ID/gün sayısı/idempotency testleri ve mock AI cevapları.
9. Rota ve detail prompt sürümleri ile küçük eval veri seti.
10. Snapshot yeniden açma ve iki kullanıcılı yetki E2E testleri.

Repository'ye geçerken Bölüm 14'te kabul edilen kararlar decision log ile eşleştirilmeli; sonra machine-readable şemalar bu belgeden türetilmelidir. SQL/ORM modeli domain sözleşmesini belirlememeli, yalnız kalıcı alanlara eşlemelidir. RLS ve migration testleri CI'da yerel Supabase üzerinde zorunludur; ayrı development Supabase projesi yalnız public release öncesi production-benzeri smoke testi için kullanılır ve preview hiçbir zaman production database'e bağlanmaz.

### Son contract kontrolü

| Contract | MVP adımı | Üreten | Tüketen | Doğrulayan | Saklama | Değişiklik etkisi |
| --- | --- | --- | --- | --- | --- | --- |
| `PlanAnswers` | Planlama soruları | Kullanıcı/frontend | Backend/profile builder | FE + backend | Kalıcı | Form, validation, profile builder |
| `TravelProfileSnapshot` | Profil onayı | Backend | Route/detail input builders, UI | Backend | Kalıcı | Filtre, AI input, profil özeti |
| `RouteCandidate` | Rota üretimi | Backend filter | Route AI | Backend | Geçici | Content filter, prompt/input schema |
| `RouteRecommendationOutput` | Rota önerileri | AI | Backend validator/hydrator | Backend + eval | Ham hali saklanmaz | AI schema, validator, prompt |
| `RouteOptionsSnapshot` | Karşılaştırma/seçim | Backend hydrator | Frontend, database | Backend | Kalıcı | Route UI, selection, reopen |
| `DetailedTripPlanOutput` | Ayrıntılı plan | AI | Backend validator/hydrator | Backend + eval | Ham hali saklanmaz | AI schema, validator, prompt |
| `DetailedPlanSnapshot` | Planı kullanma/yeniden açma | Backend hydrator | Frontend, database | Backend | Kalıcı | Plan UI, reopen, feedback context |
| `VerifiedContentRecord` | Rota ve detay gerçekleri | İnsan editör | Filter, AI input builder, hydrator | Build-time + release kontrolü | Doğrulanmış kaynak | İçerik dosyaları, hydration, link testleri |
| `Feedback` | Feedback | Kullanıcı | Backend/ürün testi | FE + backend | Kalıcı | Form, API, database |
| `GenerationRun` | AI çağrısı/kota | Backend/AI metadata | Kota ve teknik inceleme | Backend | Asgari kalıcı | Budget, idempotency, logging |

Bu listede gerçek bir MVP adımına, üreticiye, tüketiciye, doğrulama sınırına ve saklama kararına bağlanamayan başka bir yapı eklenmemiştir.
