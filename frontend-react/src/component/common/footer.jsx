import logo from "./logo/logo.jpg"
export function PsychologyCareFooter() {
    return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <a href="/home" className="footer-logo">
              <img src={logo} className="logo-img" alt="Logo" />
              <span className="logo-text">Psychology Care</span>
            </a>
            <ul className="footer-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Licensing</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <hr className="footer-divider" />
          <span className="footer-bottom">
            © 2025 <a href="https://flowbite.com/" className="footer-bottom-link">Flowbite™</a>. All Rights Reserved.
          </span>
        </div>
      </footer>
    );
  }
  