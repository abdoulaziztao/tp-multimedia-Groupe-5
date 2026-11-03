import Link from 'next/link'
import { ArrowRight, Compass, Headphones, Map as MapIcon, Mic, Gamepad2 } from 'lucide-react'
import { Carnet } from '@/components/carnet'
import { Explorer } from '@/components/explorer'
import { SceneArt } from '@/components/scene-art'
import { LANGUAGES, PHRASES } from '@/lib/languages'
import { REGION_COUNT, STORIES } from '@/lib/stories'

const STEPS = [
  { icon: MapIcon, title: 'Explore', text: 'Survole le relief 3D, passe en satellite ou lance la visite guidée des régions.' },
  { icon: Headphones, title: 'Écoute', text: 'Une voix raconte le conte en suivant le texte ; ajoute l’ambiance sonore du décor.' },
  { icon: Gamepad2, title: 'Joue', text: 'Choisis le destin du héros, découvre plusieurs fins et teste ta mémoire au quiz.' },
  { icon: Mic, title: 'Transmets', text: 'Enregistre un conteur dans sa langue : le site lira ton fichier à la place de la voix de synthèse.' },
]

export default function HomePage() {
  const regionsCovered = new Set(STORIES.map((s) => s.region)).size
  return (
    <>
      <section className="hero" id="accueil">
        <div className="hero__copy">
          <p className="eyebrow"><span /> PATRIMOINE ORAL DU BURKINA FASO</p>
          <h1>
            Écouter le pays
            <br />
            <em>raconter</em>
          </h1>
          <p className="hero__intro">
            Une plateforme multimédia pour préserver et transmettre les contes et légendes du Burkina Faso : une carte
            en relief, des illustrations animées, des voix en langues nationales et des histoires où l’on choisit la suite.
          </p>
          <div className="hero__actions">
            <a className="btn" href="#explorer">
              Commencer l’exploration <Compass aria-hidden="true" />
            </a>
            <Link className="btn btn--ghost" href="/contes">
              Voir tous les contes <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <dl className="stats">
            <div><dt>{STORIES.length}</dt><dd>contes</dd></div>
            <div><dt>{regionsCovered}/{REGION_COUNT}</dt><dd>régions</dd></div>
            <div><dt>{LANGUAGES.length}</dt><dd>langues</dd></div>
          </dl>
        </div>
        <div className="hero__art">
          <SceneArt variant="savane" focus="storyteller" cinematic image="/images/accueil.jpg" label="Illustration : un conteur et son tambour sous un acacia, au coucher du soleil" />
        </div>
      </section>

      <section className="section section--paper" id="explorer" aria-labelledby="explorer-title">
        <div className="section__head" data-reveal>
          <div>
            <p className="eyebrow"><span /> CARTE DES RÉCITS</p>
            <h2 id="explorer-title">
              Un territoire,
              <br />
              <em>mille histoires.</em>
            </h2>
          </div>
          <p className="section__note">Clique sur un marqueur ou sur une région colorée pour découvrir son conte, puis écoute-le directement.</p>
        </div>
        <Explorer stories={STORIES} />
        <div className="home-carnet" data-reveal>
          <Carnet total={STORIES.length} />
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="section__head" data-reveal>
          <div>
            <p className="eyebrow"><span /> UNE EXPÉRIENCE EN 4 TEMPS</p>
            <h2 id="how-title">
              Plus qu’une carte :
              <br />
              <em>une veillée.</em>
            </h2>
          </div>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} data-reveal style={{ ['--i' as string]: i }}>
              <span className="steps__num">0{i + 1}</span>
              <s.icon aria-hidden="true" />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--paper" aria-labelledby="langs-title">
        <div className="section__head" data-reveal>
          <div>
            <p className="eyebrow"><span /> LANGUES NATIONALES</p>
            <h2 id="langs-title">
              Les mots avant
              <br />
              <em>les histoires.</em>
            </h2>
          </div>
          <Link className="btn btn--ghost" href="/langues">
            Tout le lexique <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="lang-grid">
          {LANGUAGES.filter((l) => l.code !== 'fr').map((l, i) => {
            const merci = PHRASES[l.code as 'mos' | 'dyu' | 'ful'].find((p) => p.fr === 'Merci')
            return (
              <article key={l.code} className="lang-card" data-reveal style={{ ['--i' as string]: i }}>
                <h3>{l.name}</h3>
                <p className="lang-card__area">{l.area}</p>
                <p className="lang-card__word">
                  <span>Merci</span>
                  <strong>{merci?.local}</strong>
                </p>
                <p>{l.note}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section" aria-labelledby="veillee-title">
        <div className="veillee" data-reveal>
          <div className="veillee__copy">
            <p className="veillee__kicker">ILLUSTRATION ANIMÉE</p>
            <h2 id="veillee-title">Veillée sous le baobab</h2>
            <p>Une scène de transmission, entre feu de camp, voix des anciens et ciel étoilé. Les animations respectent le réglage « réduire les animations » de ton appareil.</p>
          </div>
          <iframe src="/veillee-sous-le-baobab.html" title="Veillée sous le baobab, illustration animée" loading="lazy" />
        </div>
      </section>

      <section className="section section--cta" aria-labelledby="cta-title">
        <h2 id="cta-title">Tu connais un conte que personne n’a encore enregistré ?</h2>
        <p>Cinq régions attendent encore leur premier récit. Enregistre un grand-parent, un conteur, un voisin : ta voix rejoint la carte.</p>
        <Link className="btn btn--light" href="/contribuer">
          Contribuer <Mic aria-hidden="true" />
        </Link>
      </section>
    </>
  )
}
