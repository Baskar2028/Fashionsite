import { useState, useEffect, useRef } from 'react';

const navItems = ['Home', 'About', 'Fashion', 'Location', 'Contact'];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const collapseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => {
    const collapse = collapseRef.current;
    if (collapse?.classList.contains('show')) {
      const toggler = document.querySelector('.navbar-toggler') as HTMLElement;
      toggler?.click();
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid px-4 px-lg-5">
        <a className="navbar-brand fw-bold" href="#home">
          <span style={{ color: '#ffc107' }}>LUXE</span> FASHION
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav" ref={collapseRef}>
          <ul className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item}>
                <a className="nav-link" href={`#${item.toLowerCase()}`} onClick={closeMenu}>
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
