import { useEffect } from "react";

export default function ParticlesBackground() {
  useEffect(() => {
    const backgroundLayer = document.getElementById("slm-space-bg");
    const particlesContainer = document.getElementById("particles-js");

    if (!backgroundLayer || !particlesContainer) {
      return undefined;
    }

    const existingScript = document.querySelector(
      'script[data-slm-particles="true"]'
    );

    const initParticles = () => {
      if (window.particlesJS) {
        window.particlesJS("particles-js", {
          particles: {
            number: {
              value: 520,
              density: {
                enable: true,
                value_area: 1200
              }
            },
            color: {
              value: ["#ffffff", "#dbeafe", "#c7d2fe", "#bfdbfe"]
            },
            shape: {
              type: "circle"
            },
            opacity: {
              value: 0.85,
              random: true,
              anim: {
                enable: true,
                speed: 0.2,
                opacity_min: 0.35,
                sync: false
              }
            },
            size: {
              value: 2.2,
              random: true,
              anim: {
                enable: true,
                speed: 0.8,
                size_min: 0.2,
                sync: false
              }
            },
            line_linked: {
              enable: false
            },
            move: {
              enable: true,
              speed: 0.45,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: false
              }
            }
          },
          interactivity: {
            detect_on: "window",
            events: {
              onhover: {
                enable: true,
                mode: "repulse"
              },
              onclick: {
                enable: false
              },
              resize: true
            },
            modes: {
              repulse: {
                distance: 180,
                duration: 0.7,
                speed: 1.2
              }
            }
          },
          retina_detect: true
        });
      }
    };

    let script = existingScript;

    if (!script) {
      script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
      script.async = true;
      script.dataset.slmParticles = "true";
      script.onload = initParticles;
      document.body.appendChild(script);
    } else if (window.particlesJS) {
      initParticles();
    } else {
      script.addEventListener("load", initParticles, { once: true });
    }

    const createShootingStar = () => {
      const star = document.createElement("div");
      star.classList.add("shooting-star");
      star.style.top = `${Math.random() * 45}vh`;
      star.style.left = `${Math.random() * 55}vw`;
      star.style.animationDuration = `${2.4 + Math.random() * 2.4}s`;

      backgroundLayer.appendChild(star);

      window.setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      }, 5200);
    };

    const interval = window.setInterval(createShootingStar, 3200);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div id="slm-space-bg" aria-hidden="true">
      <div id="particles-js" />
    </div>
  );
}