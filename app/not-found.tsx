import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="page page--center">
      <p className="eyebrow"><span /> 404</p>
      <h1>
        Ce chemin s’est <em>effacé</em>
      </h1>
      <p>La page que tu cherches n’existe pas, ou le conte a changé de village.</p>
      <Link className="btn" href="/">Retour à la carte</Link>
    </section>
  )
}
