export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#icerik">İçeriğe geç</a>

      <header className="site-header">
        <span className="wordmark">
          <span className="brand-mark" aria-hidden="true">br.</span>
          Balkan Rehberim
        </span>
        <span className="pilot-label">Pilot sürüm</span>
      </header>

      <main id="icerik">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">İki ülke. Bir yolculuk.</p>
            <h1 id="hero-title">Balkanlar için<br />bir başlangıç.</h1>
            <p className="intro">
              Arnavutluk ve Karadağ’ı birlikte keşfetmek için ilk adım.
              Size uygun bir yolculuk planının başlangıç noktası.
            </p>
            <a className="primary-link" href="#pilot-kapsami" aria-describedby="planning-note">
              Plan oluşturmaya başla <span aria-hidden="true">↗</span>
            </a>
            <p className="helper" id="planning-note">
              Önce pilot kapsamını keşfedin. Planlama akışı henüz açık değil.
            </p>
          </div>

          <aside className="travel-note" aria-labelledby="travel-note-title">
            <p className="note-label">Yolculuk notu / 01</p>
            <h2 id="travel-note-title">Birlikte yola çıkın.</h2>
            <p>İki ülkeyi, kendi temponuzda keşfetme fikriyle başlayın.</p>
            <div className="country-pair">
              <span>Arnavutluk</span>
              <span aria-hidden="true">↕</span>
              <span>Karadağ</span>
            </div>
            <p className="note-footer">4–6 gün <span aria-hidden="true">/</span> İki kişi <span aria-hidden="true">/</span> Kiralık araç</p>
          </aside>
        </section>

        <section className="pilot-section" id="pilot-kapsami" aria-labelledby="pilot-title" tabIndex={-1}>
          <div className="section-heading">
            <p className="eyebrow">Küçük bir kapsamla başlıyoruz</p>
            <h2 id="pilot-title">Bu pilot kimler için?</h2>
          </div>
          <dl className="scope-grid">
            <div><dt>Destinasyon</dt><dd>Arnavutluk + Karadağ</dd></div>
            <div><dt>Süre</dt><dd>4–6 gün</dd></div>
            <div><dt>Seyahat grubu</dt><dd>Çift · 2 kişi</dd></div>
            <div><dt>Ulaşım</dt><dd>Kiralık araç</dd></div>
          </dl>
          <p className="scope-note">
            Şimdilik başlangıç ekranındasınız. Seyahat bilgilerinizi girme ve
            plan oluşturma adımları henüz kullanıma açılmadı.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <span>Balkan Rehberim</span>
        <span>Yolculuk burada başlar.</span>
      </footer>
    </>
  );
}
