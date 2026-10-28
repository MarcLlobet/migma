import {
  campaign, comparison, cta, footer, founders, gallery, hero, integrations,
  meet, nav, sameTeam, trusted,
} from "../content";
import { SvgLogo as Logo } from "./SvgLogo";
import { PromptBox } from "./PromptBox";
import { MenuToggle } from "./MenuToggle";
import { Reveal } from "./Reveal";
import { Info } from "./Info";

/**
 * The whole homepage, as a Server Component.
 * Only PromptBox and MenuToggle are client components ("use client");
 * everything else ships as HTML with no JavaScript to hydrate.
 */
export function Home() {
  return (
    <>
      <p className="proto-banner">Performance prototype of migma.ai. Not the official site.</p>
      <header className="header">
        <a href="#" className="brand" aria-label="Migma home">
          <Logo size={31} />
          <span className="wordmark">Migma</span>
        </a>
        <nav className="nav" aria-label="Main">
          {nav.map((n) => <a key={n} href="#">{n}</a>)}
        </nav>
        <div className="header-actions">
          <a href="#" className="link-muted hide-mobile">Sign In</a>
          <a href="#" className="btn btn-light btn-sm">Get started</a>
          <MenuToggle />
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-bg-css" aria-hidden="true" />
          <div className="container hero-inner">
            <h1 className="display hero-title">
              {hero.title[0]} <span className="grad">{hero.title[1]}</span>
            </h1>
            <p className="hero-subtitle">{hero.subtitle}</p>
            <PromptBox />
            <div className="imports">
              <p className="muted small">Already have a design?</p>
              <h2 className="sr-only">Suggested Chat Messages</h2>
              <div className="chips">
                {hero.imports.map((i) => (
                  <button key={i.label} type="button" className="chip">
                    {i.label}{i.badge && <span className="badge">{i.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Reveal className="container">
          <div className="card-dark meet">
            <h2 className="display h2">{meet.title}</h2>
            {meet.items.map((m) => (
              <div key={m.title} className="meet-item">
                <h3 className="display h3">{m.title}</h3>
                <p className="muted">{m.text}</p>
              </div>
            ))}
          </div>
          <ul className="logos" aria-label="Trusted by">
            {trusted.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </Reveal>

        <Reveal className="container section">
          <h2 className="display h1 center">{sameTeam.title[0]}<br />{sameTeam.title[1]}</h2>
          <p className="muted center lead">{sameTeam.subtitle}</p>
          {sameTeam.cards.map((c) => (
            <article key={c.title} className={`card-feature tone-${c.tone}`}>
              <div className="pill"><span>{c.tag[0]}</span>{c.tag[1]}</div>
              <h3 className="display h1 center">{c.title}</h3>
              <p className="center">{c.text}</p>
              <a href="#" className="center arrow-link">{c.cta} →</a>
              <div className="mock">
                <div className="mock-side">
                  <div className="mock-chip">{c.tone === "light" ? "Your idea" : "Your products"}</div>
                  <div className="mock-chip">{c.tone === "light" ? "Your brand" : "Products"}</div>
                </div>
                <div className="mock-email">
                  <div className="mock-bar" /><div className="mock-hero" /><div className="mock-line" /><div className="mock-line short" />
                </div>
              </div>
            </article>
          ))}
        </Reveal>

        <Reveal className="container section">
          <article className="card-feature tone-light">
            <div className="pill"><span>{campaign.tag[0]}</span>{campaign.tag[1]}</div>
            <h2 className="display h1 center">{campaign.title}</h2>
            <p className="center">{campaign.text}</p>
            <a href="#" className="center arrow-link">{campaign.cta} →</a>
            <div className="series">
              {campaign.emails.map((e) => (
                <div key={e} className="mock-email"><div className="mock-bar" /><div className="mock-hero" /><p className="small">{e}</p></div>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal className="container section">
          <h2 className="display h1 center">{comparison.title}</h2>
          <table className="compare">
            <thead><tr><th>Feature</th>{comparison.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {comparison.rows.map(([name, text, both]) => (
                <tr key={name}>
                  <td><span className="feat">{name}</span> <Info title={name} text={text} /></td>
                  <td aria-label="Available">✓</td>
                  <td aria-label={both ? "Available" : "Not built in"}>{both ? "✓" : "×"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted small">{comparison.note}</p>
        </Reveal>

        <Reveal className="container section center">
          <h2 className="display h1">{integrations.title[0]}<br />{integrations.title[1]}</h2>
          <p className="muted lead">{integrations.text}</p>
          <ul className="integrations">
            {integrations.items.map((i) => <li key={i}><span className="app-icon" aria-hidden="true">{i[0]}</span>{i}</li>)}
          </ul>
          <a href="#" className="btn btn-light">{integrations.cta}</a>
        </Reveal>

        <Reveal className="container section">
          <h2 className="display h2">{gallery.title}</h2>
          <p className="muted">{gallery.text}</p>
          <a href="#" className="arrow-link">{gallery.cta} →</a>
          <div className="gallery">
            {gallery.items.map(([brand, subject], i) => (
              <article key={brand} className={`email-card h${i % 3}`}>
                <div className="email-thumb" />
                <p className="email-meta"><u>{brand}</u><span>Today</span></p>
                <p className="email-subject">{subject}</p>
              </article>
            ))}
          </div>
          <div className="center"><a href="#" className="btn btn-outline">View More ↗</a></div>
        </Reveal>

        <Reveal className="container section center">
          <Logo size={44} />
          <h2 className="display h1">{cta.title}</h2>
          <p className="muted lead">{cta.text}</p>
          <a href="#" className="btn btn-light">{cta.button}</a>
        </Reveal>

        <Reveal className="container section">
          <div className="founders-photo" role="img" aria-label="Migma co-founders" />
          <h2 className="display h2">{founders.title}</h2>
          <p className="muted">{founders.text}</p>
          <a href="#" className="link-muted">{founders.link} ›</a>
        </Reveal>
      </main>

      <footer className="footer container">
        <div className="footer-cols">
          {footer.map(([title, links]) => (
            <div key={title}>
              <h3 className="small muted">{title}</h3>
              <ul>{links.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <Logo size={36} />
          <p className="small muted">Performance prototype for Migma. Not the production site.</p>
        </div>
      </footer>
    </>
  );
}
