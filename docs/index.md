---
title: Home
layout: "Null"
---

<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#11101a">
  <meta name="description" content="Friday Felt helps friends and families run memorable home poker nights, learn together, and celebrate every champion.">
  <title>Friday Felt — Turn Poker Night into a Tradition</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ '/assets/css/friday-felt.css' | relative_url }}">
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>

  <input class="nav-toggle" type="checkbox" id="nav-toggle" aria-hidden="true">
  <label class="nav-overlay" for="nav-toggle" aria-hidden="true"></label>

  <aside class="sidebar" aria-label="Primary navigation">
    <a class="brand" href="{{ '/' | relative_url }}" aria-label="Friday Felt home">
      <img class="brand-logo" src="{{ '/assets/images/friday-felt-logo.png' | relative_url }}" alt="Friday Felt">
      <!--span class="brand-name">Friday Felt</span-->
    </a>

    <nav class="main-nav">
      <p class="nav-label">Explore</p>
      <a class="nav-item active" href="{{ '/' | relative_url }}" aria-current="page">
        <span class="nav-icon">⌂</span> Home
      </a>
      <a class="nav-item" href="{{ '/getting-started/' | relative_url }}">
        <span class="nav-icon">♠</span> Getting Started
      </a>
      <a class="nav-item" href="{{ '/tour/' | relative_url }}">
        <span class="nav-icon">◇</span> Poker Tour
      </a>
      <a class="nav-item" href="{{ '/leaderboard/' | relative_url }}">
        <span class="nav-icon">↗</span> Leaderboard
      </a>
      <a class="nav-item" href="{{ '/lessons/' | relative_url }}">
        <span class="nav-icon">◎</span> Poker School
      </a>
      <a class="nav-item" href="{{ '/resources/' | relative_url }}">
        <span class="nav-icon">▤</span> Resources
      </a>

      <p class="nav-label nav-label-spaced">Season 1</p>
      <a class="nav-item" href="{{ '/season-1/results/' | relative_url }}">
        <span class="nav-icon">✓</span> Match Results
      </a>
      <a class="nav-item" href="{{ '/champions/' | relative_url }}">
        <span class="nav-icon">★</span> Hall of Champions
      </a>
    </nav>

    <div class="sidebar-card">
      <span class="mini-chip">♠</span>
      <p>Friday Night Poker Tour</p>
      <strong>Season 1</strong>
      <span>Event 3 of 12</span>
      <div class="season-progress"><i style="width: 25%"></i></div>
    </div>

    <p class="sidebar-footer">Good game. Good people.<br>Great memories.</p>
  </aside>

  <header class="mobile-header">
    <a class="brand" href="{{ '/' | relative_url }}">
      <span class="brand-mark" aria-hidden="true"><span>F</span><i>♠</i><span>F</span></span>
      <span class="brand-name">Friday Felt</span>
    </a>
    <label class="menu-button" for="nav-toggle" aria-label="Open navigation"><span></span><span></span><span></span></label>
  </header>

  <main id="main-content">
    <section class="hero">
      <div class="hero-glow hero-glow-one"></div>
      <div class="hero-glow hero-glow-two"></div>
      <div class="hero-copy">
        <div class="eyebrow"><span></span> Home poker, made memorable</div>
        <h1>Turn poker night<br>into a <em>tradition.</em></h1>
        <p>Everything you need to run a home poker league, teach new players, track the season, and celebrate the stories that happen around the table.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="{{ '/getting-started/' | relative_url }}">Plan your first night <span>→</span></a>
          <a class="button button-secondary" href="{{ '/resources/' | relative_url }}">Explore resources</a>
        </div>
        <div class="hero-proof">
          <div class="avatar-stack" aria-hidden="true">
            <span>W</span><span>A</span><span>E</span><span>J</span>
          </div>
          <p><strong>Built around a real family table</strong><br>Play. Learn. Compete.</p>
        </div>
      </div>

      <div class="hero-table" aria-label="Stylised poker table">
        <div class="table-orbit orbit-one"></div>
        <div class="table-orbit orbit-two"></div>
        <div class="playing-card card-one"><span>A</span><b>♠</b></div>
        <div class="playing-card card-two"><span>K</span><b>♥</b></div>
        <div class="poker-table">
          <div class="felt-inner">
            <span class="table-spade">♠</span>
            <strong>FRIDAY FELT</strong>
            <small>PLAY · LEARN · COMPETE</small>
          </div>
        </div>
        <div class="chip-stack chips-left"><i></i><i></i><i></i><i></i></div>
        <div class="chip-stack chips-right"><i></i><i></i><i></i></div>
        <div class="dealer-chip">D</div>
      </div>
    </section>

    <section class="content-section feature-section" aria-labelledby="features-title">
      <div class="section-heading">
        <div>
          <span class="section-kicker">Everything for the home game</span>
          <h2 id="features-title">Make every night count.</h2>
        </div>
        <p>No complicated software. Just practical guides, tested structures, and simple traditions you can use tonight.</p>
      </div>

      <div class="feature-grid">
        <a class="feature-card feature-purple" href="{{ '/tour/' | relative_url }}">
          <span class="feature-icon">♠</span>
          <span class="card-tag">PLAY</span>
          <h3>Run your league</h3>
          <p>Set up players, chips, blind levels, points and a season that keeps everyone coming back.</p>
          <span class="text-link">Explore the tour guide <b>→</b></span>
        </a>
        <a class="feature-card feature-blue" href="{{ '/lessons/' | relative_url }}">
          <span class="feature-icon">◎</span>
          <span class="card-tag">LEARN</span>
          <h3>Build confidence</h3>
          <p>Teach one clear poker idea each week with short lessons and table challenges.</p>
          <span class="text-link">Visit poker school <b>→</b></span>
        </a>
        <a class="feature-card feature-gold" href="{{ '/champions/' | relative_url }}">
          <span class="feature-icon">★</span>
          <span class="card-tag">CELEBRATE</span>
          <h3>Create traditions</h3>
          <p>Recognise winners with a card protector, season bracelet and a family trophy.</p>
          <span class="text-link">See champion traditions <b>→</b></span>
        </a>
      </div>
    </section>

    <section class="content-section season-section" aria-labelledby="season-title">
      <div class="section-heading compact-heading">
        <div>
          <span class="section-kicker">Friday Night Poker Tour</span>
          <h2 id="season-title">Season 1 at a glance.</h2>
        </div>
        <a class="button button-secondary button-small" href="{{ '/leaderboard/' | relative_url }}">Full leaderboard <span>→</span></a>
      </div>

      <div class="dashboard-grid">
        <article class="panel leaderboard-card">
          <div class="panel-header">
            <div>
              <span class="live-pill"><i></i> CURRENT STANDINGS</span>
              <h3>Season 1 Leaderboard</h3>
            </div>
            <span class="updated">After Event 2</span>
          </div>
          <div class="leaderboard" role="table" aria-label="Season 1 leaderboard">
            <div class="leader-row leaderboard-head" role="row">
              <span>Rank</span><span>Player</span><span>Played</span><span>Points</span>
            </div>
            <div class="leader-row is-leader" role="row">
              <span class="rank"><i>1</i></span>
              <span class="player"><b class="player-avatar avatar-purple">M</b><span><strong>Miki</strong><small>1 win</small></span></span>
              <span>2</span><strong class="points">7</strong>
            </div>
            <div class="leader-row" role="row">
              <span class="rank">2</span>
              <span class="player"><b class="player-avatar avatar-pink">K</b><span><strong>Kahlia</strong><small>1 win</small></span></span>
              <span>2</span><strong class="points">7</strong>
            </div>
            <div class="leader-row" role="row">
              <span class="rank">3</span>
              <span class="player"><b class="player-avatar avatar-blue">K</b><span><strong>KB</strong><small>Best: 2nd</small></span></span>
              <span>2</span><strong class="points">5</strong>
            </div>
            <div class="leader-row" role="row">
              <span class="rank">4</span>
              <span class="player"><b class="player-avatar avatar-green">A</b><span><strong>Ariel</strong><small>Best: 3rd</small></span></span>
              <span>2</span><strong class="points">4</strong>
            </div>
            <div class="leader-row" role="row">
              <span class="rank">5</span>
              <span class="player"><b class="player-avatar avatar-orange">W</b><span><strong>Wayneo</strong><small>Best: 2nd</small></span></span>
              <span>1</span><strong class="points">4</strong>
            </div>
          </div>
          <div class="panel-note">
            <span>Scoring system</span>
            <strong>3 points enter the pool for every player</strong>
          </div>
        </article>

        <article class="panel next-event-card">
          <div class="event-top">
            <span class="calendar-icon"><b>FRI</b><strong>31</strong></span>
            <span class="event-status">NEXT TOURNAMENT</span>
          </div>
          <h3>Friday Night Poker #3</h3>
          <p class="event-subtitle">The cards are almost in the air.</p>
          <dl class="event-details">
            <div><dt>Date</dt><dd>Sunday, 26 July</dd></div>
            <div><dt>Cards in the air</dt><dd>7:00 pm</dd></div>
            <div><dt>Starting stack</dt><dd>2,100</dd></div>
            <div><dt>Blind levels</dt><dd>20 minutes</dd></div>
          </dl>
          <div class="lesson-callout">
            <span>THIS WEEK'S LESSON</span>
            <strong>Position is power</strong>
            <p>Notice where the dealer button is before every hand.</p>
          </div>
          <a class="button button-primary event-button" href="{{ '/tour/next-event/' | relative_url }}">View tournament details <span>→</span></a>
        </article>
      </div>
    </section>

    <section class="content-section resources-section" aria-labelledby="resources-title">
      <div class="section-heading compact-heading">
        <div>
          <span class="section-kicker">Ready for poker night</span>
          <h2 id="resources-title">Featured resources.</h2>
        </div>
        <a class="text-link standalone-link" href="{{ '/resources/' | relative_url }}">Browse all resources <b>→</b></a>
      </div>
      <div class="resource-grid">
        <a class="resource-card" href="{{ '/resources/first-poker-night/' | relative_url }}">
          <span class="resource-visual visual-cards"><i>Q</i><i>♠</i></span>
          <span class="resource-meta">GETTING STARTED · 8 MIN READ</span>
          <h3>Your first family poker night</h3>
          <p>A relaxed, step-by-step plan from setting out the chips to crowning the first winner.</p>
          <span class="text-link">Read the guide <b>→</b></span>
        </a>
        <a class="resource-card" href="{{ '/resources/blind-structures/' | relative_url }}">
          <span class="resource-visual visual-timer"><i>15</i><small>MIN</small></span>
          <span class="resource-meta">TOURNAMENT GUIDE · DOWNLOAD</span>
          <h3>A balanced blind structure</h3>
          <p>Keep a four-to-nine-player tournament moving while leaving room for real decisions.</p>
          <span class="text-link">View blind levels <b>→</b></span>
        </a>
        <a class="resource-card" href="{{ '/lessons/folding-is-a-skill/' | relative_url }}">
          <span class="resource-visual visual-book"><i></i><b>01</b></span>
          <span class="resource-meta">POKER SCHOOL · LESSON 1</span>
          <h3>Folding is a poker skill</h3>
          <p>A ten-minute beginner lesson that turns folding from disappointment into success.</p>
          <span class="text-link">Teach this lesson <b>→</b></span>
        </a>
      </div>
    </section>

    <section class="content-section story-banner">
      <span class="story-suit story-suit-one">♠</span>
      <span class="story-suit story-suit-two">♥</span>
      <div>
        <span class="section-kicker">More than a game</span>
        <h2>Every great poker story<br>starts at home.</h2>
      </div>
      <p>Friday Felt began with a simple idea: help families and friends turn an ordinary card game into a tradition worth passing on.</p>
      <a class="button button-light" href="{{ '/about/' | relative_url }}">Our story <span>→</span></a>
    </section>
  </main>

  <footer>
    <a class="brand footer-brand" href="{{ '/' | relative_url }}">
      <span class="brand-mark" aria-hidden="true"><span>F</span><i>♠</i><span>F</span></span>
      <span class="brand-name">Friday Felt</span>
    </a>
    <p>Good game. Good people. Great memories.</p>
    <nav aria-label="Footer navigation">
      <a href="{{ '/about/' | relative_url }}">About</a>
      <a href="{{ '/resources/' | relative_url }}">Resources</a>
      <a href="{{ '/roadmap/' | relative_url }}">Roadmap</a>
      <a href="{{ '/contact/' | relative_url }}">Contact</a>
    </nav>
    <span>© 2026 Friday Felt</span>
  </footer>
</body>
</html>
