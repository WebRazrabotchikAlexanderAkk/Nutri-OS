import { useRef, useState } from 'react';
import { assistant } from '../../data';

export default function AiAssistant() {
  const [scenarioId, setScenarioId] = useState(assistant.scenarios[0].id);
  const [chosen, setChosen] = useState(false);
  const example = useRef(null);
  const scenario = assistant.scenarios.find(item => item.id === scenarioId);

  return <section id="ai-assistant" className="section assistant-section" aria-labelledby="assistant-title">
    <div className="container assistant-grid">
      <div className="assistant-copy">
        <p className="assistant-eyebrow">{assistant.label}</p>
        <h2 id="assistant-title">{assistant.title.map(line => <span key={line}>{line}</span>)}</h2>
        <p className="assistant-description">{assistant.description}</p>
        <ul className="assistant-benefits">{assistant.benefits.map(benefit => <li key={benefit}>
          <span aria-hidden="true">✓</span>{benefit}
        </li>)}</ul>
        <a className="text-link assistant-link" href="#assistant-example" onClick={() => example.current?.focus()}>
          {assistant.action}<span aria-hidden="true">↗</span>
        </a>
        <p className="assistant-planned">{assistant.planned}</p>
      </div>
      <div ref={example} id="assistant-example" className="assistant-chat" tabIndex={-1} data-ui aria-label={assistant.example}>
        <div className="assistant-chat-header">
          <span className="assistant-avatar" aria-hidden="true">N</span>
          <div className="assistant-identity"><h3>{assistant.name}</h3><p>{assistant.subtitle}</p></div>
          <span className="assistant-example-label">{assistant.example}</span>
        </div>
        <div className="assistant-conversation" aria-live="polite" aria-atomic="true">
          <p className="assistant-message assistant-question"><span className="sr-only">Вы: </span>{scenario.question}</p>
          <p className="assistant-message assistant-answer"><span className="sr-only">Ассистент: </span>{scenario.answer}</p>
        </div>
        <div className="assistant-meal">
          <img src={assistant.meal.image} alt={assistant.meal.alt} width="512" height="512" loading="lazy" decoding="async" />
          <div className="assistant-meal-copy">
            <span className="assistant-meal-label">{assistant.meal.label}</span>
            <h4>{assistant.meal.title}</h4>
            <p>{assistant.meal.detail}</p>
            <button type="button" className="button assistant-choose" aria-pressed={chosen} onClick={() => setChosen(value => !value)}>
              {chosen ? assistant.chosen : assistant.choose}<span aria-hidden="true">{chosen ? '✓' : '→'}</span>
            </button>
          </div>
        </div>
        <p className="assistant-status" role="status">{chosen ? assistant.status : ''}</p>
        <div className="assistant-chat-footer">
          <div className="assistant-prompts" role="group" aria-label="Примеры запросов">
            {assistant.scenarios.map(item => <button type="button" key={item.id} aria-pressed={scenarioId === item.id}
              onClick={() => { setScenarioId(item.id); setChosen(false); }}>{item.label}</button>)}
          </div>
          <p>{assistant.caption}</p>
        </div>
      </div>
    </div>
  </section>;
}
