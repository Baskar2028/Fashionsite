import { useState } from 'react';
import fashion1 from '@/assets/fashion1.png';
import fashion2 from '@/assets/fashion2.png';
import fashion3 from '@/assets/fashion3.png';
import fashion4 from '@/assets/fashion4.png';
import fashion5 from '@/assets/fashion5.png';

const products = [
  { id: 1, img: fashion1, name: 'Navy Blazer', price: '2,499' },
  { id: 2, img: fashion2, name: 'Classic Shirt', price: '1,899' },
  { id: 3, img: fashion3, name: 'Leather Jacket', price: '3,200' },
  { id: 4, img: fashion4, name: 'Slim Denim', price: '1,500' },
  { id: 5, img: fashion5, name: 'Oxford Shoes', price: '4,100' },
];

const Fashion = () => {
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="fashion" className="fashion-section">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="section-title">Our Collection</h2>
          <p className="section-subtitle">Handpicked styles for the modern man</p>
        </div>
        <div className="row g-4 justify-content-center">
          {products.map((item, idx) => (
            <div className="col-lg-4 col-md-6" key={item.id} data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className="card fashion-card h-100">
                <div className="card-img-container">
                  <img src={item.img} alt={item.name} loading="lazy" />
                  <button
                    className={`heart-icon ${liked[item.id] ? 'active' : 'inactive'}`}
                    onClick={() => toggleLike(item.id)}
                    aria-label="Like"
                  >
                    <i className={`bi ${liked[item.id] ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                </div>
                <div className="card-body d-flex flex-column">
                  <p className="mb-1 fw-medium" style={{ color: '#888', fontSize: '0.85rem' }}>{item.name}</p>
                  <p className="product-price mb-3">₹ {item.price}</p>
                  <button className="btn btn-buy mt-auto">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fashion;
