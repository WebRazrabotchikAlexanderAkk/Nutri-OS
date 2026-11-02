import { config, steps } from '../../data';

// Adapted from ln-dev7's How It Works Steps (09) on 21st.dev:
// https://21st.dev/@ln-dev7/components/how-it-works-09
// Uses the project's CSS and link styles instead of Tailwind, shadcn and lucide.
export default function HowItWorks09() {
  return <section id="how-it-works" className="section how-section" aria-labelledby="how-heading">
    <div className="container how-inner">
      <div className="section-heading how-heading">
        <h2 id="how-heading">От привычек к меню.</h2>
        <p>Как будет устроено планирование в NutriOS.</p>
      </div>
      <ol className="how-steps" role="list">
        {steps.map(([title, copy], index) => <li className="how-step" key={title}>
          <span className="how-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <div className="how-copy"><h3>{title}</h3><p>{copy}</p></div>
          {index < steps.length - 1 && <svg className="how-next" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 4v16m-6-6 6 6 6-6" />
          </svg>}
        </li>)}
      </ol>
      <div className="how-action">
        <a className="button" href={config.primaryCTA.href}>{config.primaryCTA.label}<span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>;
}
