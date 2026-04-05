import { useState, useEffect } from 'react';

const navItems = ['Home', 'About', 'Fashion', 'Location', 'Contact'];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a className="navbar-brand fw-bold fs-4" href="#home" onClick={(e) => handleClick(e, 'home')}>
          <span style={{ color: '#ffc107' }}>LUXE</span>WEAR
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-1">
            {navItems.map((item) => (
              <li className="nav-item" key={item}>
                <a
                  className="nav-link nav-link-custom px-3"
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => handleClick(e, item)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
