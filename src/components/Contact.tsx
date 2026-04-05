const socials = [
  { icon: 'bi-whatsapp', color: '#25D366', label: 'WhatsApp' },
  { icon: 'bi-facebook', color: '#1877F2', label: 'Facebook' },
  { icon: 'bi-instagram', color: '#E4405F', label: 'Instagram' },
];

const Contact = () => (
  <section id="contact" className="contact-section">
    <div className="container">
      <div className="text-center mb-5" data-aos="fade-up">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">We'd love to hear from you</p>
      </div>
      <div className="row justify-content-center g-4 mb-5">
        {socials.map((s, idx) => (
          <div className="col-md-3 col-6" key={s.label} data-aos="fade-up" data-aos-delay={idx * 100}>
            <div className="social-icon-box text-center">
              <i className={`bi ${s.icon}`} style={{ color: s.color }}></i>
              <p className="mt-2 mb-0 fw-semibold" style={{ color: '#333' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="row justify-content-center g-3" data-aos="fade-up" data-aos-delay="300">
        <div className="col-md-5">
          <div className="contact-info-item">
            <i className="bi bi-telephone-fill" style={{ color: '#ffc107', fontSize: '1.3rem' }}></i>
            <span style={{ color: '#333' }}>+91 98765 43210</span>
          </div>
        </div>
        <div className="col-md-5">
          <div className="contact-info-item">
            <i className="bi bi-envelope-fill" style={{ color: '#ffc107', fontSize: '1.3rem' }}></i>
            <span style={{ color: '#333' }}>support@luxefashion.com</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Contact;
