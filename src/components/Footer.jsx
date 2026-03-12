import footerLogo from "../assets/images/footer-logo.png";

export default function Footer() {
  return (
    <footer className="slm-footer">
      <div className="slm-footer-inner">
        <div className="slm-footer-left">
          <img
            src={footerLogo}
            alt="Sanyark Space Technologies"
            className="slm-footer-logo"
          />
        </div>

        <div className="slm-footer-center">
          <span className="slm-footer-email-icon">✉</span>
          <span className="slm-footer-email">info@sanyark.com</span>
        </div>

        <div className="slm-footer-right">
          Copyright © 2026 Sanayark Space. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}