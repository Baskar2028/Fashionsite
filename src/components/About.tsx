import aboutImg from '@/assets/about.png';

const About = () => (
  <section id="about" className="about-section">
    <div className="container">
      <div className="text-center mb-5" data-aos="fade-up">
        <h2 className="section-title">About Us</h2>
        <p className="section-subtitle">Redefining men's fashion since 2020</p>
      </div>
      <div className="row align-items-center g-5">
        <div className="col-lg-6" data-aos="fade-right">
          <img src={aboutImg} alt="About our fashion" className="img-fluid about-img" loading="lazy" width={768} height={768} />
        </div>
        <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
          <h3 className="about-title mb-3">Redefining Style</h3>
          <p className="about-text">
            Our mission is to blend style and comfort seamlessly. We follow the latest
            trends while maintaining high quality. Step out with confidence wearing
            apparel designed for you.
          </p>
          <p className="about-text">
            From casual everyday wear to sharp formal attire, every piece in our collection
            is crafted with attention to detail — ensuring you look and feel your absolute best.
          </p>
          <div className="row mt-4 g-3">
            {[
              { num: '500+', label: 'Products' },
              { num: '10K+', label: 'Happy Customers' },
              { num: '50+', label: 'Brands' },
            ].map((s) => (
              <div className="col-4 text-center" key={s.label}>
                <h4 className="fw-bold" style={{ color: '#ffc107' }}>{s.num}</h4>
                <small style={{ color: '#6c757d' }}>{s.label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
