import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Fashion from "./components/Fashion";
import Location from "./components/Location";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Fashion />
      <Location />
      <Contact />
      <Footer />
    </>
  );
};

export default App;
