import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import metlogo from '../assets/metlogo.png';
import metcurvepool from '../assets/metcurvepool.png';
import '../styles/Curve.css';

const Curve = () => {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const factSections = document.querySelectorAll('.fact-section, .strategy-section, .pool-setup-section');
    factSections.forEach((section, index) => {
      section.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="curve-page">
      <div className="bg-gradient"></div>

      <Link to="/" className="back-button">← Back</Link>

      <div className="container">
        <header>
          <div className="logo-header">
            <img src={metlogo} alt="Meteora" />
          </div>
          <h1>Curved Starter Pack</h1>
          <p className="subtitle">6 Visual Facts Every LP Needs to Know</p>
        </header>

        {/* Fact 1: Chart Movement */}
        <section className="fact-section">
          <div className="fact-text">
            <div className="fact-number">FACT 01</div>
            <h2 className="fact-title">Curved prints only when the chart moves</h2>
            <p className="fact-description">
              If the chart is sleeping, your P is sleeping too. No price action means no swaps passing through your range. Your position just sits there earning nothing.
            </p>
            <div className="fact-highlight">💡 Motion = Money</div>
          </div>
          <div className="fact-graphic">
            <div className="chart-movement">
              <div className="money-particles">
                <span className="money-particle">💰</span>
                <span className="money-particle">💵</span>
                <span className="money-particle">🤑</span>
              </div>
              <div className="chart-line">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none">
                  <path className="line-active" d="M0,80 Q50,80 80,50 T160,60 T240,30 T320,55 T400,20" />
                </svg>
              </div>
              <div className="chart-line" style={{ opacity: 0.3, top: '120px' }}>
                <svg viewBox="0 0 400 100" preserveAspectRatio="none">
                  <path className="line-flat" d="M0,50 L400,50" />
                </svg>
              </div>
              <div className="chart-labels">
                <div className="chart-label">
                  <div className="chart-label-icon">📈</div>
                  <div>Active = $$$</div>
                </div>
                <div className="chart-label">
                  <div className="chart-label-icon">😴</div>
                  <div>Flat = Zzz</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fact 2: Volume Engine */}
        <section className="fact-section">
          <div className="fact-text">
            <div className="fact-number">FACT 02</div>
            <h2 className="fact-title">Volume is the whole engine</h2>
            <p className="fact-description">
              High volume? Fees go brrrr. Low volume? You're farming dust, bro. The amount of trading activity directly powers your earnings.
            </p>
            <div className="fact-highlight">⚡ Volume = Your Paycheck</div>
          </div>
          <div className="fact-graphic">
            <div className="volume-engine">
              <div className="engine-comparison">
                <div className="engine-side">
                  <div className="engine-visual engine-high">
                    <span className="engine-icon">⚙️</span>
                  </div>
                  <div className="engine-label engine-high-label">HIGH VOLUME</div>
                  <span className="engine-result result-good">Fees go brrrr 🚀</span>
                </div>
                <div className="engine-side">
                  <div className="engine-visual engine-low">
                    <span className="engine-icon">💨</span>
                  </div>
                  <div className="engine-label engine-low-label">LOW VOLUME</div>
                  <span className="engine-result result-bad">Farming dust 🌫️</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fact 3: Curve Levels */}
        <section className="fact-section">
          <div className="fact-text">
            <div className="fact-number">FACT 03</div>
            <h2 className="fact-title">Curve level = how wild your LP acts</h2>
            <p className="fact-description">
              Low curve gives you chill vibes with wider range. High curve? That's chaos, adrenaline, and possible tears. Choose your adventure wisely.
            </p>
            <div className="fact-highlight">🎚️ Your Risk Dial</div>
          </div>
          <div className="fact-graphic">
            <div className="curve-levels">
              <div className="curve-row curve-low">
                <div className="curve-visual">
                  <svg viewBox="0 0 80 60">
                    <path className="curve-line-low" d="M0,50 Q40,30 80,50" />
                  </svg>
                </div>
                <div className="curve-info">
                  <div className="curve-name">LOW CURVE</div>
                  <div className="curve-desc">Chill vibes, wider range, steady earner</div>
                </div>
                <div className="curve-emoji">😌</div>
              </div>
              <div className="curve-row curve-high">
                <div className="curve-visual">
                  <svg viewBox="0 0 80 60">
                    <path className="curve-line-high" d="M0,55 Q40,5 80,55" />
                  </svg>
                </div>
                <div className="curve-info">
                  <div className="curve-name">HIGH CURVE</div>
                  <div className="curve-desc">Chaos mode, tight range, max fees OR tears</div>
                </div>
                <div className="curve-emoji">🎢</div>
              </div>
            </div>
          </div>
        </section>

        {/* Fact 4: Quickie Tool */}
        <section className="fact-section">
          <div className="fact-text">
            <div className="fact-number">FACT 04</div>
            <h2 className="fact-title">Curved is a quickie tool</h2>
            <p className="fact-description">
              Get in when it's popping → dip when it cools off. No loyalty here. This isn't a marriage, it's a tactical rotation strategy.
            </p>
            <div className="fact-highlight">🔄 In Fast, Out Faster</div>
          </div>
          <div className="fact-graphic">
            <div className="quickie-timeline">
              <div className="timeline-track">
                <div className="timeline-progress"></div>
                <div className="timeline-points">
                  <div className="timeline-point point-enter">
                    <div className="point-dot">🚀</div>
                    <div className="point-label">ENTER<br /><small>when popping</small></div>
                  </div>
                  <div className="timeline-point point-exit">
                    <div className="point-dot">👋</div>
                    <div className="point-label">EXIT<br /><small>when cooling</small></div>
                  </div>
                </div>
                <div className="timeline-arrow">→</div>
              </div>
            </div>
          </div>
        </section>

        {/* Fact 5: IL Risk */}
        <section className="fact-section">
          <div className="fact-text">
            <div className="fact-number">FACT 05</div>
            <h2 className="fact-title">High curve loves IL (in a bad way)</h2>
            <p className="fact-description">
              If price trends too long in one direction, your bags get cooked. Impermanent Loss hits harder on concentrated positions. Newbies, stay low.
            </p>
            <div className="fact-highlight">⚠️ Beginners: Stay Low</div>
          </div>
          <div className="fact-graphic">
            <div className="il-risk">
              <div className="risk-meter">
                <div className="meter-bg"></div>
                <div className="meter-needle"></div>
                <div className="meter-center">
                  <div className="meter-value">IL</div>
                  <div className="meter-label">RISK LEVEL</div>
                </div>
              </div>
              <div className="risk-warning">
                <span>⚠️</span>
                <span>High curve + trending price = cooked bags</span>
              </div>
            </div>
          </div>
        </section>

        {/* Fact 6: Small Swings */}
        <section className="fact-section">
          <div className="fact-text">
            <div className="fact-number">FACT 06</div>
            <h2 className="fact-title">You don't need a pump to print</h2>
            <p className="fact-description">
              Tiny swings + volume = easy Curved fees. No moonshot needed. A choppy sideways market can be your best friend with the right setup.
            </p>
            <div className="fact-highlight">📊 Small Moves, Big Fees</div>
          </div>
          <div className="fact-graphic">
            <div className="small-swings">
              <div className="fee-pops">
                <span className="fee-pop">+0.02%</span>
                <span className="fee-pop">+0.05%</span>
                <span className="fee-pop">+0.03%</span>
                <span className="fee-pop">+0.04%</span>
              </div>
              <div className="swing-zone">
                <span className="zone-label">YOUR RANGE</span>
              </div>
              <div className="swing-chart">
                <svg viewBox="0 0 400 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="swingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'rgba(156, 81, 182, 0.5)' }} />
                      <stop offset="100%" style={{ stopColor: 'rgba(156, 81, 182, 0)' }} />
                    </linearGradient>
                  </defs>
                  <path className="swing-line" d="M0,75 Q25,60 50,75 T100,70 T150,80 T200,65 T250,78 T300,68 T350,76 T400,70" />
                </svg>
              </div>
              <div className="swing-result">
                <div className="swing-stat">
                  <div className="stat-icon">🔄</div>
                  <div className="stat-text">Small swings</div>
                </div>
                <div className="swing-stat">
                  <div className="stat-icon">+</div>
                  <div className="stat-text">Volume</div>
                </div>
                <div className="swing-stat">
                  <div className="stat-icon">=</div>
                  <div className="stat-text">Easy fees</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MY STRATEGY SECTION ===== */}
        <section className="strategy-section">
          <div className="strategy-header">
            <div className="strategy-badge">💎 MY STRATEGY</div>
            <h2 className="strategy-title">Only Do Quickies</h2>
            <p className="strategy-subtitle">The simple 3-step playbook for printing consistent fees without getting rekt</p>
          </div>

          <div className="strategy-visual">
            {/* 3-Step Flow */}
            <div className="strategy-flow">
              <div className="strategy-step step-1">
                <div className="step-icon-wrap">
                  <span className="step-icon">🎯</span>
                  <span className="step-number">1</span>
                </div>
                <h3 className="step-title">ENTER IN VOLUME</h3>
                <p className="step-desc">Wait for high activity. Don't jump into dead pools.</p>
                <span className="step-trigger">📊 Volume spike = GO</span>
              </div>

              <span className="flow-arrow arrow-1">→</span>

              <div className="strategy-step step-2">
                <div className="step-icon-wrap">
                  <span className="step-icon">💸</span>
                  <span className="step-number">2</span>
                </div>
                <h3 className="step-title">PRINT FEES</h3>
                <p className="step-desc">Ride the action. Let swaps flow through your range.</p>
                <span className="step-trigger">🔥 Action = Earnings</span>
              </div>

              <span className="flow-arrow arrow-2">→</span>

              <div className="strategy-step step-3">
                <div className="step-icon-wrap">
                  <span className="step-icon">🚪</span>
                  <span className="step-number">3</span>
                </div>
                <h3 className="step-title">EXIT BEFORE QUIET</h3>
                <p className="step-desc">Don't overstay. Leave before volume dies.</p>
                <span className="step-trigger">📉 Cooling = GTFO</span>
              </div>
            </div>

            {/* Strategy Chart Visualization */}
            <div className="strategy-chart">
              <span className="chart-label-y">VOLUME</span>
              <div className="chart-bg">
                <div className="entry-zone">
                  <span className="zone-tag">ENTER</span>
                </div>
                <div className="buy-zone">
                  <span className="zone-tag">PRINTING AREA</span>
                </div>
                <div className="exit-zone">
                  <span className="zone-tag">EXIT</span>
                </div>
                <div className="volume-bars">
                  <div className="vol-bar low" style={{ height: '15%' }}></div>
                  <div className="vol-bar low" style={{ height: '20%' }}></div>
                  <div className="vol-bar" style={{ height: '35%' }}></div>
                  <div className="vol-bar active" style={{ height: '70%' }}></div>
                  <div className="vol-bar active" style={{ height: '90%' }}></div>
                  <div className="vol-bar active" style={{ height: '85%' }}></div>
                  <div className="vol-bar active" style={{ height: '75%' }}></div>
                  <div className="vol-bar" style={{ height: '50%' }}></div>
                  <div className="vol-bar" style={{ height: '35%' }}></div>
                  <div className="vol-bar low" style={{ height: '20%' }}></div>
                  <div className="vol-bar low" style={{ height: '12%' }}></div>
                  <div className="vol-bar low" style={{ height: '10%' }}></div>
                </div>
              </div>
              <div className="chart-x-axis">
                <span>Quiet</span>
                <span>Building</span>
                <span>🔥 PEAK ACTION 🔥</span>
                <span>Cooling</span>
                <span>Dead</span>
              </div>
            </div>

            {/* Summary */}
            <div className="strategy-summary">
              <div className="summary-box">
                <p className="summary-text">
                  <span className="green">Enter in volume</span> → 
                  <span className="orange"> Print fees during action</span> → 
                  <span className="red"> Exit before things go quiet</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== POOL SETUP GUIDE SECTION ===== */}
        <section className="pool-setup-section">
          <div className="pool-setup-header">
            <div className="pool-setup-badge">⚙️ POOL SETUP</div>
            <h2 className="pool-setup-title">Set The Pool Right</h2>
            <p className="pool-setup-subtitle">Before any quickie, I dial in these settings.</p>
          </div>

          <div className="pool-setup-screenshot">
            <div className="screenshot-wrapper">
              <img src={metcurvepool} alt="Meteora Curve Pool Setup" />
            </div>
          </div>

          <div className="params-row">
            <div className="param-card param-range">
              <div className="param-header">
                <span className="param-icon">🎯</span>
                <span className="param-name">Range</span>
                <span className="param-value">-5% to +5~6%</span>
              </div>
              <p className="param-desc"><strong>Tight and spicy</strong> — for max fee action.</p>
            </div>

            <div className="param-card param-bins">
              <div className="param-header">
                <span className="param-icon">📊</span>
                <span className="param-name">Bin Steps</span>
                <span className="param-value">Depends</span>
              </div>
              <p className="param-desc"><strong>Token's mood</strong> — calm = small, degen = bigger.</p>
            </div>

            <div className="param-card param-curve">
              <div className="param-header">
                <span className="param-icon">📈</span>
                <span className="param-name">Curve Level</span>
                <span className="param-value">Dynamic</span>
              </div>
              <p className="param-desc"><strong>Chart cooking?</strong> Turn it up. Meh? Keep low.</p>
            </div>
          </div>

          <div className="warning-footer">
            <span className="warning-icon">⚠️</span>
            <span className="warning-text">Bad setup = No fees.</span>
            <span className="warning-simple">Simple.</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Curve;
