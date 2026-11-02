import { useState } from 'react';
import { heroAssistant } from '../../data';

export default function HeroAssistant() {
  const [scenarioId, setScenarioId] = useState(heroAssistant.scenarios[0].id);
  const scenario = heroAssistant.scenarios.find(item => item.id === scenarioId);

  return <aside className="hero-assistant" aria-label={heroAssistant.label}>
    <div className="hero-assistant-header">
      <span className="hero-assistant-avatar" aria-hidden="true">N</span>
      <div><h3>{heroAssistant.name}</h3><p>{heroAssistant.subtitle}</p></div>
    </div>
    <div className="hero-assistant-dialog" aria-live="polite" aria-atomic="true">
      <p className="hero-assistant-question">
        <span className="sr-only">Вы: </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M7 18l-4 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7Z" />
          <path d="M7 8h10M7 12h6" />
        </svg>
        <span>{scenario.question}</span>
        <span className="hero-assistant-sent" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
        </span>
      </p>
      <p className="hero-assistant-answer">
        <span className="sr-only">Ассистент: </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M12 2c1.2 6.5 3.5 8.8 10 10-6.5 1.2-8.8 3.5-10 10C10.8 15.5 8.5 13.2 2 12c6.5-1.2 8.8-3.5 10-10Z" />
        </svg>
        <span>{scenario.answer}</span>
      </p>
    </div>
    <div className="hero-assistant-footer">
      <div className="hero-assistant-prompts" role="group" aria-label="Примеры запросов к ассистенту">
        {[...heroAssistant.scenarios].reverse().map(item => <button type="button" key={item.id}
          aria-pressed={scenarioId === item.id} onClick={() => setScenarioId(item.id)}>{item.label}</button>)}
      </div>
      <a href="#ai-assistant">{heroAssistant.more}<span aria-hidden="true">↗</span></a>
    </div>
  </aside>;
}
