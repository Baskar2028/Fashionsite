import aboutImg from '@/assets/about.png';

const About = () => (
  <section id="about">
    <div className="container">
      <h2 className="text-center display-5 fw-bold mb-2" style={{ color: '#212529' }}>
        About <span style={{ color: '#ffc107' }}>Us</span>
      </h2>
      <p className="text-center mb-5" style={{ color: '#6c757d' }}>Our story & vision</p>
      <div className="row align-items-center g-5">
        <div className="col-lg-6 fade-in">
          <img src={aboutImg} alt="About our fashion" className="img-fluid rounded-4 shadow" loading="lazy" width={768} height={768} />
        </div>
        <div className="col-lg-6 fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="fw-bold mb-3" style={{ color: '#212529' }}>Where Style Meets Comfort</h3>
          <p className="lead" style={{ color: '#495057', lineHeight: 1.8 }}>
            At LuxeWear, we believe that great style should never compromise on comfort. Our curated collection
            blends the latest fashion trends with premium quality fabrics, giving you the confidence to
            express your unique personality.
          </p>
          <p style={{ color: '#6c757d', lineHeight: 1.8 }}>
            From casual everyday wear to sharp formal attire, every piece in our collection is designed with
            attention to detail, ensuring you look and feel your best. We source only the finest materials to
            deliver quality you can trust at prices that make luxury accessible.
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
