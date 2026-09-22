# Balkan Rehberim — Codex Working Instructions

## 1. Temel çalışma kuralı

Bu repository Kanban kartları üzerinden geliştirilir.

- Aynı anda yalnızca kullanıcı tarafından belirtilen tek KBN kartı üzerinde çalış.
- Sonraki karta kendiliğinden geçme.
- Aktif kartın kapsamını sessizce büyütme.
- Kart beklenenden belirgin biçimde büyür veya ayrı bir karta bölünmesi gerekirse çalışmayı durdur ve bildir.

## 2. Göreve başlamadan önce

Kod yazmadan önce:

1. Aktif KBN kartını oku.
2. Kartın `Kapsam`, `Kapsam dışı`, `Tamamlanma ölçütleri`, `Test / kanıt`, `Öğrenme hedefi` ve `Kaynaklar` bölümlerini incele.
3. Kartın `Kaynaklar` bölümünde belirtilen proje dokümanlarının ilgili kısımlarını oku.
4. Mevcut repository yapısını ve mevcut branch'i kontrol et.

Uzun plan raporu hazırlamak veya kullanıcıdan ayrıca plan onayı beklemek zorunda değilsin.

Kaynaklarda karar verilmiş konuları yeniden tartışma.

Karara bağlanmamış önemli bir implementation seçimi varsa:
- birkaç makul seçeneği kısa biçimde değerlendir,
- mevcut mimariye en uygun ve en basit seçeneği tercih et,
- önemli trade-off'u belirt.

Yeni bir mimari karar gerekiyorsa uygulamayı durdur ve kullanıcıya bildir.

## 3. Kaynakların rolleri

Kaynakların görevlerini birbirine karıştırma:

- **Ana Proje Geliştirme Rehberi:** çalışma yöntemi, kalite, öğrenme ve AI kullanım kuralları.
- **Aktif KBN kartı:** bu oturumdaki işin kapsamı, kapsam dışı, kabul kriterleri, testleri ve öğrenme hedefi.
- **Technical Plan:** kabul edilmiş teknik mimari ve sistemin nasıl kurulacağı.
- **Decision Log / ADR:** önemli teknik kararların nedenleri ve yeniden değerlendirme koşulları.
- **Data Contracts:** domain, API, AI, snapshot ve veri sözleşmeleri.
- **Kartın `Kaynaklar` bölümü:** o kartta özellikle okunması gereken bölümler.

Repository ile kabul edilmiş kaynaklar arasında önemli bir çelişki varsa tahmin ederek ilerleme.

## 4. Mimari kararlar

Kabul edilmiş Technical Plan, ADR veya Data Contracts kararlarını gerekçesiz değiştirme.

Bir değişiklik kabul edilmiş mimariyle çelişiyorsa:

- kodlamayı durdur,
- çelişkiyi açıkça belirt,
- önerilen değişikliği ve etkisini açıkla,
- kullanıcı kararı olmadan uygulama.

Mimari karar değişmediyse sonuç notunda:

`ADR değişikliği yok.`

yaz.

## 5. Scope discipline

Yalnızca aktif kart için gerekli değişiklikleri yap.

Şunları yapma:

- sonraki kartların işlerini erkenden uygulama,
- "ileride lazım olabilir" gerekçesiyle altyapı ekleme,
- gereksiz abstraction veya refactor yapma,
- kart gerektirmiyorsa yeni servis, tablo, API, dependency veya teknoloji ekleme.

Kapsam dışında faydalı bir fikir görürsen uygulama; kısa sonuç notunda belirt.

## 6. Implementasyon

Kartı mümkün olduğunca baştan sona tamamla.

- Mevcut mimari ve naming convention'lara uy.
- Küçük ve anlaşılır değişiklikler yap.
- Kartın görünür veya teknik çıktısını gerçekten çalışır hale getir.
- Hata senaryolarını kartta tanımlandığı ölçüde ele al.

## 7. Test ve kanıt

Kartın `Test / kanıt` bölümünde istenen kontrolleri çalıştır.

Geçerli olduğu ölçüde:
- lint
- typecheck
- unit
- integration
- RLS
- component
- E2E
- production build

kontrollerini uygula.

- Başarısız testi görmezden gelme.
- Kart kapsamında çözülebiliyorsa düzelt ve tekrar çalıştır.
- Çalıştırılmamış testi başarılı olarak raporlama.
- Sonuçta çalıştırılan komutları ve PASS / FAIL durumunu belirt.
- Kartın istediği ekran görüntüsü, URL veya başka kanıt varsa yerini belirt.

## 8. Güvenlik ve veri

- Secret, API key, parola veya kişisel veriyi repository'ye yazma.
- `.env.example` içinde yalnız değişken adlarını kullan.
- Server-only veri ve secret'ları client bundle'a taşıma.
- Log ve hata çıktılarında kişisel veya gizli veri bırakma.

## 9. Git çalışma sınırı

Her KBN kartı kısa ömürlü ayrı bir feature branch üzerinde uygulanır.

Codex kullanıcı istemeden:

- branch oluşturmaz veya değiştirmez,
- commit oluşturmaz,
- push yapmaz,
- PR açmaz,
- main'e merge etmez.

Mevcut branch aktif karta uygun değilse kod yazmadan önce bildir.

## 10. Diff kontrolü

İş bittikten sonra diff'i kontrol et.

Diff:

- yalnızca aktif karta ait değişiklikleri içermeli,
- kapsam dışı refactor içermemeli,
- gereksiz dosya değişiklikleri içermemeli,
- secret veya kişisel veri içermemeli.

## 11. Görevin bitişi

Codex kendi implementasyon görevini ancak şu durumda bitmiş sayabilir:

- kartın görünür / teknik çıktısı çalışıyorsa,
- kabul kriterleri karşılanıyorsa,
- gerekli testler geçiyorsa,
- diff kart kapsamıyla sınırlıysa,
- önemli mimari çelişki yoksa.

Ancak Kanban kartını doğrudan `Tamamlandı` sayma.

Kartın gerçek Definition of Done süreci ayrıca:
- diff incelemesini,
- test kanıtını,
- öğrenme hedefinin geliştirici tarafından açıklanabilmesini,
- gerekli dokümantasyon / ADR kontrolünü

gerektirir.

Bu nedenle iş bittiğinde kartı:

`Test / İnceleme için hazır`

olarak değerlendir.

Learning Report ve öğrenme kontrolü ayrı süreçte yapılacaktır.

## 12. Son cevap

Uzun rapor oluşturma.

Kısa biçimde yalnızca şunları bildir:

- KBN kartı ve durum: `Test / İnceleme için hazır` veya `Eksik`
- Ana değişiklikler
- Çalıştırılan testler ve sonuçları
- Karşılanmayan kabul kriteri varsa hangisi
- Mimari çelişki veya önemli sorun varsa ne olduğu
- `ADR değişikliği yok` veya ADR değerlendirmesi gerektiği
- Sonraki karta geçilmediği

Learning Report oluşturma.

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
