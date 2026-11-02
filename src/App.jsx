import { useEffect, useRef, useState } from 'react';
import { config, days, shortDays, meals, faq, features } from './data';
import HowItWorks09 from './components/ui/how-it-works-09';
import AetherFlowHero from './components/ui/aether-flow-hero';
import DataRain from './components/ui/data-rain';
import AiAssistant from './components/ui/ai-assistant';
import HeroAssistant from './components/ui/hero-assistant';

const nav = [['Демо', '#app-preview'], ['Как это работает', '#how-it-works'], ['Ассистент', '#ai-assistant'], ['Возможности', '#features'], ['Вопросы', '#faq']];

function CTA({ light = false }) {
  return <a className={`button${light ? ' button-light' : ''}`} href={config.primaryCTA.href}>
    {config.primaryCTA.label}<span aria-hidden="true">↗</span>
  </a>;
}

function Logo() {
  return <a className="logo" href="#hero" aria-label="NutriOS – в начало">NutriOS<span>.</span></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const navigation = useRef(null);
  useEffect(() => {
    if (open) navigation.current?.querySelector('a')?.focus();
  }, [open]);
  return <header className="header" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      trigger.current?.focus();
    }
  }}>
    <div className="container header-inner">
      <Logo />
      <nav ref={navigation} id="navigation" className={`nav${open ? ' nav-open' : ''}`} aria-label="Основная навигация"
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== trigger.current) setOpen(false);
        }}>
        {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-cta"><CTA /></div>
      <button ref={trigger} className="menu-button" aria-controls="navigation" aria-expanded={open}
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setOpen(!open)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d={open ? 'M6 6l12 12M6 18L18 6' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </button>
    </div>
  </header>;
}

function MealArt({ variant = 0 }) {
  return <span className={`meal-art meal-art-${variant}`} aria-hidden="true">
    <span className="plate"><i /><i /><i /><i /><i /></span>
  </span>;
}

function usePlan() {
  const [day, setDay] = useState(0);
  const [replaced, setReplaced] = useState(false);
  const [status, setStatus] = useState('');
  function replace() {
    setReplaced(!replaced);
    setStatus(replaced ? 'Обед понедельника возвращён: Рис с овощами.' : 'Обед понедельника заменён: Гречка с грибами.');
  }
  function reset() {
    setDay(0);
    setReplaced(false);
    setStatus('Демо сброшено к исходному состоянию.');
  }
  const getMeal = (dayIndex, mealIndex) => dayIndex === 0 && mealIndex === 1 && replaced
    ? 'Гречка с грибами' : meals[dayIndex][mealIndex];
  return { day, setDay, getMeal, replace, reset, status };
}

function DaySelector({ plan }) {
  return <div className="day-selector" role="group" aria-label="Выберите день">
    {days.map((day, index) => <button key={day} aria-label={day} aria-pressed={plan.day === index}
      onClick={() => plan.setDay(index)}>{shortDays[index]}</button>)}
  </div>;
}

function MealList({ plan }) {
  return <div className="meal-list">
    {meals[plan.day].map((_, index) => <div className="meal-row" key={index}>
      <MealArt variant={index} />
      <div className="meal-copy">
        <small>{['Завтрак', 'Обед', 'Ужин'][index]}</small>
        <b>{plan.getMeal(plan.day, index)}</b>
      </div>
      {plan.day === 0 && index === 1 && <button className="replace" onClick={plan.replace}>Заменить</button>}
    </div>)}
  </div>;
}

function MiniApp({ plan }) {
  return <div className="mini-app" data-ui data-animation-pause aria-label="Интерактивный пример плана">
    <div className="mini-top"><b>NutriOS</b><span>Попробуйте демо</span></div>
    <h2>Ваш план на день</h2>
    <DaySelector plan={plan} />
    <p className="selected-day">{days[plan.day]}</p>
    <MealList plan={plan} />
    <p className="demo-status" role="status">{plan.status}</p>
    <p className="demo-caption">Пример меню. Замена обеда доступна в понедельник.</p>
    <a className="text-link" href="#app-preview">Открыть обзор недели <span aria-hidden="true">↗</span></a>
  </div>;
}

function Preview({ plan }) {
  const [view, setView] = useState('week');
  const dayView = useRef(null);
  return <div className="app-shell" data-ui>
    <div className="workspace">
      <div className="workspace-top">
        <div><h3>Мой план</h3><p>Интерактивный пример меню</p></div>
        <button className="reset" onClick={() => { plan.reset(); setView('week'); }}>Сбросить</button>
      </div>
      <div className="toolbar">
        <b>Выберите день</b>
        <div className="segmented" role="group" aria-label="Вид плана">
          <button ref={dayView} aria-pressed={view === 'day'} onClick={() => setView('day')}>День</button>
          <button aria-pressed={view === 'week'} onClick={() => setView('week')}>Неделя</button>
        </div>
      </div>
      <DaySelector plan={plan} />
      {view === 'week' && <div className="week-overview">
        <h4>Обеды на неделю</h4>
        <div>{days.map((day, index) => <button key={day} aria-label={`${day}: ${plan.getMeal(index, 1)}`}
          onClick={() => { plan.setDay(index); setView('day'); dayView.current?.focus(); }}>
          <b>{shortDays[index]}</b><span>{plan.getMeal(index, 1)}</span>
        </button>)}</div>
      </div>}
      <h4 className="meal-title">{days[plan.day]}</h4>
      <MealList plan={plan} />
      <p className="demo-status" role="status">{plan.status}</p>
      <p className="demo-caption">В этом примере можно заменить обед понедельника. Остальные блюда показаны для знакомства с планом.</p>
    </div>
    <aside className="context-panel" aria-label="Пример предпочтений">
      <h3>Ваш контекст</h3>
      <p>Пример настроек для этого меню.</p>
      <dl>{[['Предпочтения', 'Простые домашние блюда'], ['Время приготовления', 'До 30 минут'], ['Приоритет', 'Удобное планирование']].map(([label, value]) => <div className="context-item" key={label}>
        <dt>{label}</dt><dd>{value}</dd>
      </div>)}</dl>
      <p className="context-note">Настройки здесь показаны как пример. Их редактирование планируется.</p>
    </aside>
  </div>;
}

function App() {
  const plan = usePlan();
  return <>
    <a className="skip" href="#main">К основному содержимому</a>
    <Header />
    <main id="main" tabIndex={-1}>
      <section id="hero" className="hero">
        <AetherFlowHero />
        <div className="container hero-grid">
          <div className="hero-copy" data-animation-pause>
            <h1>План питания под ваш ритм.</h1>
            <p className="lead">Соберите меню на неделю с учётом привычек и расписания. Если планы изменятся – замените блюдо.</p>
            <p className="hero-line">Меньше рутины – больше свободы выбора.</p>
            <div className="hero-actions"><CTA /><a className="text-link" href="#how-it-works">Как это работает <span aria-hidden="true">↗</span></a></div>
            <p className="concept-note">Концепция продукта. Сейчас доступно интерактивное демо.</p>
            <HeroAssistant />
          </div>
          <MiniApp plan={plan} />
        </div>
      </section>
      <section id="app-preview" className="section demo-section">
        <div className="container">
          <div className="section-heading split">
            <h2>Неделя перед глазами.</h2>
            <p>Выберите день и посмотрите меню. Замените обед понедельника – изменение появится и в обзоре недели.</p>
          </div>
          <p className="notice">Демонстрация концепции. Данные вымышлены и не являются рекомендациями по питанию.</p>
          <Preview plan={plan} />
        </div>
      </section>
      <HowItWorks09 />
      <AiAssistant />
      <section id="features" className="section features">
        <div className="container">
          <div className="section-heading split"><h2>Всё нужное для плана.</h2><p>Возможности, которые планируются в продукте. Сейчас на сайте можно попробовать выбор дня и замену одного блюда.</p></div>
          <div className="feature-grid">{features.map(([id, title, copy]) => <article key={id}><h3>{title}</h3><p>{copy}</p><span className="planned">Планируется</span></article>)}</div>
          <div id="trust" className="trust-note"><h3>Решение остаётся за вами.</h3><p>План можно будет пересматривать без жёстких правил и давления. NutriOS предназначен для повседневного планирования и не заменяет врача или диетолога.</p></div>
        </div>
      </section>
      <section id="faq" className="section">
        <div className="container faq-grid">
          <div><h2>Вопросы о NutriOS.</h2><p>О концепции, возможностях и границах продукта.</p></div>
          <div>{faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>
      <section id="final-cta" className="final-cta">
        <DataRain />
        <div className="container final-inner"><div><h2>Ваш план. Ваш выбор.</h2><p>Начните с простого: выберите день и попробуйте заменить обед.</p><CTA light /></div><div className="final-art" aria-hidden="true"><MealArt variant={1} /></div></div>
      </section>
    </main>
    <footer id="footer"><div className="container">
      <div className="footer-top"><div><Logo /><p>Питание в ритме вашей жизни.</p></div><nav aria-label="Навигация в подвале">{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav></div>
      <div className="footer-bottom"><span>© NutriOS · Концепция продукта</span><p>NutriOS предназначен для общего планирования питания и образовательной поддержки. Сервис не предоставляет медицинские консультации, диагностику или лечение и не заменяет рекомендации квалифицированного специалиста.</p></div>
    </div></footer>
  </>;
}

export default App;
