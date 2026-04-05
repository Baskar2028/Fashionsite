import mapImg from '@/assets/map.png';

const Location = () => (
  <section id="location" className="location-section">
    <div className="container">
      <div className="text-center mb-5" data-aos="fade-up">
        <h2 className="section-title">Visit Our Store</h2>
        <p className="section-subtitle">Find us at the heart of the city</p>
      </div>
      <div className="text-center" data-aos="zoom-in" data-aos-delay="200">
        <img src={mapImg} alt="Store Location Map" className="img-fluid map-img" loading="lazy" width={1024} height={512} />
      </div>
    </div>
  </section>
);

export default Location;
