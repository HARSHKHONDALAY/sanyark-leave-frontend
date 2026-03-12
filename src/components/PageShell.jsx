import Header from "./Header";
import Footer from "./Footer";

export default function PageShell({ children, maxWidth }) {
  const style = maxWidth ? { maxWidth } : undefined;

  return (
    <div className="slm-page-shell">
      <Header />

      <main className="slm-main-content">
        <div className="slm-container" style={style}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}