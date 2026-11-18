import React from "react";
import "./App.css";
import Order from "./Order.jsx";
import Admin from "./Admin.jsx";

function App() {
  const [showOrder, setShowOrder] = React.useState(false);

  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  if (showOrder) {
    return <Order />;
  }

  const services = [
    {
      title: "Şəhərlərarası daşınma",
      description: "Bakıdan Azərbaycanın bütün bölgələrinə sürətli və etibarlı yükdaşıma.",
      image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=85",
      number: "01"
    },
    {
      title: "Kommersiya yükləri",
      description: "Şirkətlər, mağazalar və sahibkarlar üçün logistika və yükdaşıma həlləri.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=85",
      number: "02"
    },
    {
      title: "Fərdi sifarişlər",
      description: "Mebel, məişət əşyaları və tikinti materiallarının təhlükəsiz daşınması.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
      number: "03"
    },
    {
      title: "Anbar və saxlama xidmətləri",
      description: "Yüklərin müvəqqəti saxlanılması, çeşidlənməsi və daşınmaya hazırlanması.",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=85",
      number: "04"
    }
  ];

  const advantages = [
    {
      icon: "🗺️",
      title: "Geniş əhatə",
      description: "Azərbaycanın şəhər və rayonlarına daşınma imkanları."
    },
    {
      icon: "🚛",
      title: "4 xidmət istiqaməti",
      description: "Fərdi, kommersiya, şəhərlərarası və anbar xidmətləri."
    },
    {
      icon: "🤝",
      title: "Tərəfdaşlıq",
      description: "Müştərilərlə daşıyıcıları bir araya gətirən logistika modeli."
    },
    {
      icon: "⚡",
      title: "Operativ yanaşma",
      description: "Sifarişlərin rahat qəbulu və daşınmanın təşkili."
    }
  ];

  return (
    <div className="app">

      <header className="header">
        <h2>REGIONAL <span>CARGO</span></h2>

        <nav>
          <a href="#home">Ana səhifə</a>
          <a href="#services">Xidmətlər</a>
          <a href="#statistics">Üstünlüklər</a>
          <a href="#regions">Regionlar</a>
          <a href="#about">Haqqımızda</a>
          <a href="#contact">Əlaqə</a>
        </nav>

        <button onClick={() => setShowOrder(true)}>
          Sifariş et
        </button>
      </header>

      <main id="home" className="hero">
        <div className="hero-content">
          <p className="tag">AZƏRBAYCAN ÜZRƏ YÜKDAŞIMA</p>

          <h1>
            Yükünüzü <span>etibarla</span> daşıyırıq!
          </h1>

          <p>
            Bakıdan Azərbaycanın bütün bölgələrinə
            sürətli, etibarlı və rahat yükdaşıma.
          </p>

          <button onClick={() => setShowOrder(true)}>
            Daşınma sifariş et →
          </button>
        </div>
      </main>

      <section id="services" className="services">
        <p className="tag">NƏ TƏKLİF EDİRİK?</p>
        <h2>Xidmətlərimiz</h2>

        <p className="section-description">
          Yükünüzün növündən asılı olmayaraq,
          sizə uyğun logistika həllimiz var.
        </p>

        <div className="service-list">
          {services.map((service) => (
            <div className="service" key={service.number}>
              <div className="service-image">
                <img src={service.image} alt={service.title} />
                <span className="service-number">
                  {service.number}
                </span>
              </div>

              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <button onClick={() => setShowOrder(true)}>
                  Sifariş et →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="statistics" className="statistics">
        <div className="statistics-heading">
          <p className="tag">REGIONAL CARGO</p>
          <h2>Logistikada güclü tərəflərimiz</h2>
          <p>
            Müştərilərimizə rahat, çevik və etibarlı
            yükdaşıma həlləri təqdim etməyi hədəfləyirik.
          </p>
        </div>

        <div className="advantages-grid">
          {advantages.map((item, index) => (
            <div className="advantage-card" key={index}>
              <span>{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="regions" id="regions">
        <p className="tag">BÜTÜN AZƏRBAYCAN ÜZRƏ</p>
        <h2>Haraya daşınma lazımdır?</h2>

        <p className="regions-text">
          Bakıdan Azərbaycanın bütün bölgələrinə etibarlı yükdaşıma.
        </p>

        <div className="region-list">
          <div className="region-card">
            <span>🏙️</span>
            <h3>Bakı</h3>
            <p>Paytaxt və ətraf ərazilər</p>
          </div>

          <div className="region-card">
            <span>🏞️</span>
            <h3>Gəncə</h3>
            <p>Qərb bölgəsi</p>
          </div>

          <div className="region-card">
            <span>🌳</span>
            <h3>Qəbələ</h3>
            <p>Şimal-qərb bölgəsi</p>
          </div>

          <div className="region-card">
            <span>🌊</span>
            <h3>Lənkəran</h3>
            <p>Cənub bölgəsi</p>
          </div>

          <div className="region-card">
            <span>⛰️</span>
            <h3>Quba</h3>
            <p>Şimal bölgəsi</p>
          </div>

          <div className="region-card">
            <span>🚛</span>
            <h3>Digər rayonlar</h3>
            <p>Bütün Azərbaycan üzrə</p>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <p className="tag">BİZ KİMİK?</p>
        <h2>Haqqımızda</h2>

        <p>
          Regional Cargo Azərbaycanın bütün bölgələrində
          etibarlı və operativ yükdaşıma xidmətləri təqdim edir.
        </p>

        <p>
          Məqsədimiz müştərilərlə daşıyıcıları bir araya gətirərək
          logistikanı daha rahat, sürətli və əlçatan etməkdir.
        </p>
      </section>

      <footer id="contact">
        <h2>REGIONAL <span>CARGO</span></h2>
        <p>Etibarlı logistika, güvənli daşınma.</p>
        <p>Əlaqə: +994 50 592 18 77</p>

        <a
          href="https://wa.me/994505921877"
          target="_blank"
          rel="noreferrer"
          className="whatsapp"
        >
          WhatsApp ilə əlaqə
        </a>
      </footer>

    </div>
  );
}

export default App;