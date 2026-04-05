import mainImg from '@/assets/main.png';

const Home = () => (
  <section id="home" className="hero-section">
    <div className="container">
      <div className="row align-items-center g-5">
        <div className="col-lg-6 text-center" data-aos="fade-right">
          <img src={mainImg} alt="Men's Fashion" className="img-fluid hero-img" width={768} height={1024} />
        </div>
        <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
          <span className="hero-badge">New Collection 2026</span>
          <h1 className="hero-title display-3 mb-3">
            Men's <span style={{ color: '#ffc107' }}>Fashion</span>
          </h1>
          <p className="hero-subtitle mb-4">Rich, Premium, Affordable Price</p>
          <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '2rem' }}>
            Discover our exclusive collection of premium menswear crafted for the modern gentleman.
            Style meets comfort at prices that won't break the bank.
          </p>
          <a href="#fashion" className="btn btn-explore">
            Explore Now <i className="bi bi-arrow-right ms-2"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Home;
