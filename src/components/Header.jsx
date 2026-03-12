import headerLogo from "../assets/images/header-logo.gif";

export default function Header() {
  return (
    <header className="slm-header">
      <div className="slm-header-inner">
        <img
          src={headerLogo}
          alt="Sanyark Space Technologies"
          className="slm-header-logo"
        />
      </div>
    </header>
  );
}