import mainImg from '@/assets/main.png';

const Home = () => (
  <section id="home" style={{ backgroundColor: '#f8f9fa' }}>
    <div className="container">
      <div className="row align-items-center g-5">
        <div className="col-lg-6 text-center fade-in">
          <img src={mainImg} alt="Men's Fashion" className="img-fluid rounded-4 shadow" width={768} height={1024} />
        </div>
        <div className="col-lg-6 fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-uppercase fw-semibold mb-2" style={{ color: '#ffc107', letterSpacing: '3px', fontSize: '14px' }}>
            New Collection 2026
          </p>
          <h1 className="display-3 fw-bold mb-3" style={{ color: '#212529', lineHeight: 1.1 }}>
            Men's <span style={{ color: '#ffc107' }}>Fashion</span>
          </h1>
          <p className="fs-4 mb-4" style={{ color: '#495057' }}>
            Rich, Premium, Affordable Price
          </p>
          <p className="lead mb-4" style={{ color: '#6c757d' }}>
            Discover our exclusive collection of premium menswear crafted for the modern gentleman. 
            Style meets comfort at prices that won't break the bank.
          </p>
          <a href="#fashion" className="btn btn-warning btn-lg px-5 py-3 fw-semibold rounded-pill shadow-sm">
            Shop Now <i className="bi bi-arrow-right ms-2"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Home;
