const { useState, useEffect, useCallback, useRef, createContext, useContext, createElement: h, Fragment } = React;

/* ═══════════════════════════════════════════════════════════════════
   Hook: useActiveChapter
   ═══════════════════════════════════════════════════════════════════ */
function useActiveChapter(totalChapters) {
  const [activeChapter, setActiveChapter] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = visible[0].target.id;
          const match = id.match(/^chapter-(\d+)$/);
          if (match) {
            setActiveChapter(parseInt(match[1], 10));
          }
        }

        const heroVisible = entries.find(
          (e) => e.target.id === 'hero' && e.isIntersecting
        );
        if (heroVisible) {
          setActiveChapter(-1);
        }
      },
      { threshold: 0.4, rootMargin: '-10% 0px -10% 0px' }
    );

    const hero = document.getElementById('hero');
    if (hero) observer.observe(hero);

    for (let i = 0; i < totalChapters; i++) {
      const el = document.getElementById(`chapter-${i}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [totalChapters]);

  return activeChapter;
}

/* ═══════════════════════════════════════════════════════════════════
   Component: ProgressSidebar
   ═══════════════════════════════════════════════════════════════════ */
function ProgressSidebar({ chapters, activeChapter, onNavigate }) {
  return (
    <nav className="sidebar">
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="sidebar-line"></div>
        <div className="sidebar-track">
          {chapters.map((chapter, i) => (
            <button
              key={i}
              className={`sidebar-dot${i === activeChapter ? ' active' : ''}`}
              onClick={() => onNavigate(i)}
              title={chapter.title}
            >
              {i === activeChapter && <div className="sidebar-dot-pulse" />}
              <span className="sidebar-dot-num">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Component: MobileProgressBar
   ═══════════════════════════════════════════════════════════════════ */
function MobileProgressBar({ chapters, activeChapter, onNavigate }) {
  return (
    <div className="mobile-bar">
      {chapters.map((chapter, i) => (
        <button
          key={i}
          className={`mobile-bar-segment${i <= activeChapter ? ' filled' : ''}`}
          onClick={() => onNavigate(i)}
          aria-label={`第${i + 1}课: ${chapter.title}`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Component: PlayingCard
   ═══════════════════════════════════════════════════════════════════ */
const SUIT_SYMBOLS = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' };

function PlayingCard({ rank, suit, faceDown, size }) {
  if (faceDown) {
    return (
      <div className={`pcard pcard-face-down${size === 'small' ? ' pcard-sm' : ''}${size === 'large' ? ' pcard-lg' : ''}${size === 'table' ? ' pcard-tbl' : ''}`}>
        <div className="pcard-back-pattern">
          <span className="pcard-back-icon">{'♠♥'}</span>
        </div>
      </div>
    );
  }

  const isRed = suit === 'hearts' || suit === 'diamonds';
  const suitSymbol = SUIT_SYMBOLS[suit];
  const colorClass = isRed ? 'pcard-red' : 'pcard-black';
  const sizeClass = size === 'small' ? ' pcard-sm' : size === 'large' ? ' pcard-lg' : size === 'table' ? ' pcard-tbl' : '';

  return (
    <div className={`pcard${sizeClass}`}>
      <div className="pcard-corner pcard-corner-tl">
        <span className={`pcard-rank ${colorClass}`}>{rank}</span>
        <span className={`pcard-suit ${colorClass}`}>{suitSymbol}</span>
      </div>
      <div className="pcard-center">
        <span className={`pcard-center-suit ${colorClass}`}>{suitSymbol}</span>
      </div>
      <div className="pcard-corner pcard-corner-br">
        <span className={`pcard-rank ${colorClass}`}>{rank}</span>
        <span className={`pcard-suit ${colorClass}`}>{suitSymbol}</span>
      </div>
    </div>
  );
}

function CardPair({ cards }) {
  return (
    <div className="pcard-pair">
      {cards.map((card, i) => (
        <PlayingCard key={i} rank={card.rank} suit={card.suit} faceDown={card.faceDown} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Component: ExpandableCard
   ═══════════════════════════════════════════════════════════════════ */
function ExpandableCard({ index, title, content, isExpanded, onToggle }) {
  return (
    <div
      className={`expandable-card${isExpanded ? ' expanded' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <button className="expandable-trigger" onClick={onToggle}>
        <span className="expandable-trigger-title">{title}</span>
        <span className={`expandable-chevron${isExpanded ? ' open' : ''}`}>{'▾'}</span>
      </button>
      <div className={`expandable-body${isExpanded ? ' open' : ''}`}>
        <div className="expandable-content">{content}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Component: HeroSection
   ═══════════════════════════════════════════════════════════════════ */
function HeroSection({ onStart }) {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg-decor">
        <div className="hero-card-float hero-card-1">A{'♠'}</div>
        <div className="hero-card-float hero-card-2">K{'♥'}</div>
        <div className="hero-card-float hero-card-3">Q{'♦'}</div>
        <div className="hero-card-float hero-card-4">J{'♣'}</div>
      </div>
      <div className="hero-content">
        <p className="hero-kicker">从零开始，循序渐进</p>
        <h1 className="hero-title">
          <span className="hero-title-line">德州扑克</span>
          <span className="hero-title-line">入门指南</span>
        </h1>
        <p className="hero-subtitle">五分钟 · 五节课 · 从完全不懂到看懂牌局</p>
        <button className="hero-start-btn" onClick={onStart}>
          开始学习
        </button>
      </div>
      <div className="hero-scroll-hint">
        <span>向下滚动探索</span>
        <div className="hero-scroll-arrow">{'↓'}</div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Component: PokerTable (Interactive Demo)
   ═══════════════════════════════════════════════════════════════════ */
const POKER_STEPS = [
  {
    label: '发底牌',
    desc: '每位玩家拿到 2 张私有手牌，只有自己能看到。大盲注左边玩家先行动。',
    playerCards: [{ rank: 'A', suit: 'spades' }, { rank: 'A', suit: 'hearts' }],
    opponentCards: [{ faceDown: true }, { faceDown: true }],
    community: [],
    pot: 60,
  },
  {
    label: '翻牌 (Flop)',
    desc: '荷官发出 3 张公共牌，所有玩家共享。此时你已能看到 5 张牌中的信息，手牌 + 公共牌，开始形成牌型。',
    playerCards: [{ rank: 'A', suit: 'spades' }, { rank: 'A', suit: 'hearts' }],
    opponentCards: [{ faceDown: true }, { faceDown: true }],
    community: [
      { rank: 'A', suit: 'diamonds' },
      { rank: 'K', suit: 'spades' },
      { rank: '7', suit: 'hearts' },
    ],
    pot: 180,
  },
  {
    label: '转牌 (Turn)',
    desc: '第 4 张公共牌发出。局势可能彻底扭转——对手可能在听牌，你的一对 A 未必安全。下注额通常在这一轮翻倍。',
    playerCards: [{ rank: 'A', suit: 'spades' }, { rank: 'A', suit: 'hearts' }],
    opponentCards: [{ faceDown: true }, { faceDown: true }],
    community: [
      { rank: 'A', suit: 'diamonds' },
      { rank: 'K', suit: 'spades' },
      { rank: '7', suit: 'hearts' },
      { rank: '2', suit: 'clubs' },
    ],
    pot: 420,
  },
  {
    label: '河牌 (River)',
    desc: '最后一张公共牌！这是最后一次下注机会。公共牌全部亮相，你的最终牌型已经确定。',
    playerCards: [{ rank: 'A', suit: 'spades' }, { rank: 'A', suit: 'hearts' }],
    opponentCards: [{ faceDown: true }, { faceDown: true }],
    community: [
      { rank: 'A', suit: 'diamonds' },
      { rank: 'K', suit: 'spades' },
      { rank: '7', suit: 'hearts' },
      { rank: '2', suit: 'clubs' },
      { rank: 'A', suit: 'clubs' },
    ],
    pot: 860,
  },
  {
    label: '摊牌 (Showdown)',
    desc: '双方亮牌！你手握 A-A，公共牌有 A-A-K-7-2，组成四条 A！对手只有一对 K——你赢了 860 筹码的底池！',
    playerCards: [{ rank: 'A', suit: 'spades' }, { rank: 'A', suit: 'hearts' }],
    opponentCards: [
      { rank: 'K', suit: 'hearts' },
      { rank: 'K', suit: 'diamonds' },
    ],
    community: [
      { rank: 'A', suit: 'diamonds' },
      { rank: 'K', suit: 'spades' },
      { rank: '7', suit: 'hearts' },
      { rank: '2', suit: 'clubs' },
      { rank: 'A', suit: 'clubs' },
    ],
    pot: 860,
    winner: 'player',
  },
];

function PokerTable() {
  const [step, setStep] = useState(0);
  const current = POKER_STEPS[Math.min(step, POKER_STEPS.length - 1)];
  const isDone = step >= POKER_STEPS.length - 1;

  return (
    <div className="poker-table-container">
      {/* ── Table Scene ── */}
      <div className="pt-scene">
        {/* Table body: rail (outer border) + felt (inner green) */}
        <div className="pt-table">
          {/* Dealer button */}
          <div className="pt-dealer-btn">D</div>

          {/* Blinds indicators */}
          {step === 0 && (
            <React.Fragment>
              <div className="pt-blind pt-blind-sb">SB</div>
              <div className="pt-blind pt-blind-bb">BB</div>
            </React.Fragment>
          )}

          {/* Opponent seat – top */}
          <div className="pt-seat pt-seat-top">
            <div className="pt-seat-label">对手</div>
            <div className="pt-seat-chips">🟡🟡🟡</div>
            <div className="pt-seat-cards">
              {current.opponentCards.map((card, i) => (
                <PlayingCard key={`opp-${step}-${i}`} rank={card.rank} suit={card.suit} faceDown={card.faceDown} size="table" />
              ))}
            </div>
          </div>

          {/* Left seat (empty) */}
          <div className="pt-seat pt-seat-left">
            <div className="pt-seat-label pt-seat-empty">玩家3 (弃牌)</div>
          </div>

          {/* Right seat (empty) */}
          <div className="pt-seat pt-seat-right">
            <div className="pt-seat-label pt-seat-empty">玩家4 (弃牌)</div>
          </div>

          {/* Community cards – center */}
          <div className="pt-community">
            {current.community.map((card, i) => (
              <PlayingCard key={`comm-${step}-${i}`} rank={card.rank} suit={card.suit} size="small" />
            ))}
            {Array.from({ length: Math.max(0, 5 - current.community.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="pt-empty-slot" />
            ))}
          </div>

          {/* Pot – center */}
          <div className="pt-pot" key={`pot-${step}`}>
            <div className="pt-pot-chips">{'🟡'.repeat(Math.min(8, Math.ceil(current.pot / 120)))}</div>
            <div className="pt-pot-text">底池 <strong>{current.pot}</strong></div>
          </div>

          {/* Player seat – bottom */}
          <div className="pt-seat pt-seat-bottom">
            <div className="pt-seat-cards">
              {current.playerCards.map((card, i) => (
                <PlayingCard key={`player-${step}-${i}`} rank={card.rank} suit={card.suit} size="table" />
              ))}
            </div>
            <div className="pt-seat-chips">🟡🟡🟡🟡🟡</div>
            <div className="pt-seat-label">
              你
              {current.winner === 'player' && (
                <span className="winner-badge">赢!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Step info ── */}
      <div className="pt-step-info" key={`info-${step}`}>
        <div className="pt-step-label">
          步骤 {step + 1}/{POKER_STEPS.length}: {current.label}
        </div>
        <p className="pt-step-desc">{current.desc}</p>
      </div>

      {/* ── Controls ── */}
      <div className="pt-controls">
        {!isDone ? (
          <button className="pt-next-btn" onClick={() => setStep(s => Math.min(s + 1, POKER_STEPS.length - 1))}>
            下一步: {POKER_STEPS[step + 1].label}
          </button>
        ) : (
          <button className="pt-reset-btn" onClick={() => setStep(0)}>
            再看一遍
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Component: Chapter
   ═══════════════════════════════════════════════════════════════════ */
function Chapter({ index, title, icon, summary, cards, expandedCards, onToggleCard, onContinue, isLast, renderExtra }) {
  return (
    <section id={`chapter-${index}`} className="chapter">
      <div className="chapter-inner chapter-inner-animated">
        <div className="chapter-header">
          <span className="chapter-icon">{icon}</span>
          <div className="chapter-num">第 {index + 1} 课</div>
          <h2 className="chapter-title">{title}</h2>
          <p className="chapter-summary">{summary}</p>
        </div>

        <div className="chapter-cards">
          {cards.map((card, i) => (
            <ExpandableCard
              key={i}
              index={i}
              title={card.title}
              content={card.content}
              isExpanded={!!expandedCards[`${index}-${i}`]}
              onToggle={() => onToggleCard(i)}
            />
          ))}
        </div>

        {renderExtra && (
          <div className="chapter-extra">
            {renderExtra()}
          </div>
        )}

        {!isLast && (
          <button className="chapter-continue-btn" onClick={onContinue}>
            继续下一课
            <span className="chapter-continue-arrow">{'↓'}</span>
          </button>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Data: Chapters Content
   ═══════════════════════════════════════════════════════════════════ */

function HandExample({ cards }) {
  return (
    <div style={{ margin: '12px 0' }}>
      <div className="pcard-row">
        {cards.map((c, i) => <PlayingCard key={i} rank={c.r} suit={c.s} size="small" />)}
      </div>
    </div>
  );
}

const chapters = [
  // ── 第 1 课 ──
  {
    icon: '🃏',
    title: '这是什么游戏？',
    summary: '德州扑克是全世界最流行的扑克游戏。2-10 人围坐一桌，用 2 张自己的牌 + 5 张公共牌，组合出最大的 5 张牌型，赢走底池。',
    cards: [
      {
        title: '基本设定',
        content: (
          <div>
            <p>德州扑克使用一副标准的 <strong>52 张扑克牌</strong>（去掉大小王），由 <strong>2 到 10 名玩家</strong>参与。</p>
            <p>每局游戏，每位玩家会拿到 <strong>2 张只有自己能看的私有手牌</strong>，随后桌上会依次翻开 <strong>5 张公共牌</strong>，所有人都能看到和使用。</p>
            <p>你的目标：从自己的 2 张手牌 + 5 张公共牌中，<strong>选出 5 张组成最大的牌型</strong>，和其他玩家比大小，赢走底池里的所有筹码。</p>
          </div>
        ),
      },
      {
        title: '核心元素',
        content: (
          <div>
            <p><strong>底池 (Pot)</strong> — 放在桌子中间的筹码，所有玩家在这一局中下的注都汇集到这里。赢家通吃。</p>
            <p><strong>筹码 (Chips)</strong> — 游戏货币，用来下注。在真实赌场中对应现金，在朋友局中可能只是计分工具。</p>
            <p><strong>庄家按钮 (Dealer Button)</strong> — 一个圆形标记，每局顺时针轮转。庄家是这局最后行动的人，拥有位置优势——后行动的人能看到前面所有人的决策。</p>
            <p><strong>盲注 (Blinds)</strong> — 每局开始前，庄家左手边的两位玩家必须强制下注，分别叫"小盲"和"大盲"。这保证了每局都有初始底池，不会所有人都坐等好牌。</p>
          </div>
        ),
      },
      {
        title: '为什么叫"德州"扑克？',
        content: (
          <div>
            <p>这个游戏的起源可以追溯到 <strong>20 世纪初的美国德克萨斯州</strong>（Robstown, Texas），因此得名"Texas Hold'em"。</p>
            <p>1967 年，几位德州扑克玩家把它带到了拉斯维加斯。到了 1970 年，第一届 WSOP（世界扑克大赛）将德州扑克作为主赛事，从此风靡全球。</p>
            <p>相比于传统扑克玩法，德州扑克的精髓在于 <strong>5 张公共牌共享</strong>——玩家不仅要看自己的牌，还要推测公共牌对所有人的帮助，这让游戏有了极大的策略深度。</p>
          </div>
        ),
      },
    ],
  },

  // ── 第 2 课 ──
  {
    icon: '🔄',
    title: '游戏怎么进行？',
    summary: '一局德州扑克分为四个阶段：翻牌前 → 翻牌 → 转牌 → 河牌。每一轮发牌后都有一轮下注，共四轮发牌 + 四轮下注。',
    cards: [
      {
        title: '第一阶段：翻牌前 (Pre-flop)',
        content: (
          <div>
            <p>小盲和大盲先强制下注。然后每人拿到 <strong>2 张手牌</strong>，从大盲左边的玩家开始，依次决定：跟注、加注、还是弃牌。</p>
            <p>这是最关键的一轮决策——你要根据手牌质量决定是否参与这局。垃圾牌？直接扔了等下一把。好牌？加注进场建立优势。</p>
            <div style={{ marginTop: 16 }}>
              <CardPair cards={[{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'spades' }]} />
              <p style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                A-K 同花是很好的起手牌
              </p>
            </div>
          </div>
        ),
      },
      {
        title: '第二阶段：翻牌 (Flop)',
        content: (
          <div>
            <p>翻牌前下注结束后，荷官翻开 <strong>3 张公共牌</strong>，放在桌子中央。</p>
            <p>现在每位玩家有了 5 张牌的信息（自己的 2 张 + 公共牌 3 张）。新一轮下注开始，从庄家左边第一位还在局中的玩家开始。</p>
            <p><strong>策略要点：</strong>这时你已经能大致判断牌力了——成牌了（已经组成强牌型）？听牌了（差一张就能组成强牌）？还是什么都没有？</p>
          </div>
        ),
      },
      {
        title: '第三阶段：转牌 (Turn)',
        content: (
          <div>
            <p>翻开 <strong>第 4 张公共牌</strong>。又是一轮下注。</p>
            <p>转牌往往是最戏剧性的一张——它可能让听牌成牌，也可能让原本领先的牌变得脆弱。底池在这一轮通常会迅速膨胀，因为下注额度翻倍。</p>
          </div>
        ),
      },
      {
        title: '第四阶段：河牌 (River)',
        content: (
          <div>
            <p>翻开 <strong>第 5 张也是最后一张公共牌</strong>。这是最后一次下注机会。</p>
            <p>5 张公共牌全部亮相。你从自己的 2 张手牌 + 5 张公共牌中，选出最好的 5 张组合——这就是你的最终牌型，再无变化。</p>
            <p>最后一轮下注结束后，仍在局中的玩家<strong>摊牌比大小</strong>。牌最大的人赢走底池。如果有人全下且无人跟注，则全下者直接赢，无须摊牌。</p>
          </div>
        ),
      },
    ],
  },

  // ── 第 3 课 ──
  {
    icon: '👑',
    title: '牌型大小排名',
    summary: '从最大到最小共 9 种牌型。记住口诀：皇家同花顺最大，高牌最小。同花顺 → 四条 → 葫芦 → 同花 → 顺子 → 三条 → 两对 → 一对 → 高牌。',
    cards: [
      {
        title: '皇家同花顺 (Royal Flush) — 最强',
        content: (
          <div>
            <p><strong>同一花色的 A-K-Q-J-10。</strong>这是扑克中最强的牌，几乎不可能被打败。出现概率约 1/649,740。</p>
            <HandExample cards={[{r:'A',s:'spades'},{r:'K',s:'spades'},{r:'Q',s:'spades'},{r:'J',s:'spades'},{r:'10',s:'spades'}]} />
          </div>
        ),
      },
      {
        title: '同花顺 (Straight Flush)',
        content: (
          <div>
            <p><strong>同一花色且数字连续的五张牌。</strong>比如 9-8-7-6-5 全红心。如果两人都有同花顺，数字大的赢。</p>
            <HandExample cards={[{r:'9',s:'hearts'},{r:'8',s:'hearts'},{r:'7',s:'hearts'},{r:'6',s:'hearts'},{r:'5',s:'hearts'}]} />
          </div>
        ),
      },
      {
        title: '四条 (Four of a Kind)',
        content: (
          <div>
            <p><strong>四张相同数字的牌。</strong>比如 4 张 K。四条之间比谁的数字大；如果四条数字一样（都在公共牌里），比第 5 张牌（踢脚）。</p>
            <HandExample cards={[{r:'K',s:'spades'},{r:'K',s:'hearts'},{r:'K',s:'diamonds'},{r:'K',s:'clubs'},{r:'A',s:'spades'}]} />
          </div>
        ),
      },
      {
        title: '葫芦 (Full House)',
        content: (
          <div>
            <p><strong>三条 + 一对的组合。</strong>比如 K-K-K-5-5。先比三条的大小，三条相同时再比对子的大小。</p>
            <HandExample cards={[{r:'K',s:'spades'},{r:'K',s:'hearts'},{r:'K',s:'diamonds'},{r:'5',s:'hearts'},{r:'5',s:'clubs'}]} />
          </div>
        ),
      },
      {
        title: '同花 (Flush)',
        content: (
          <div>
            <p><strong>同一花色的任意五张牌，不需要连续。</strong>比大小时从最大的一张往下比，直到分出胜负。</p>
            <HandExample cards={[{r:'A',s:'diamonds'},{r:'J',s:'diamonds'},{r:'8',s:'diamonds'},{r:'5',s:'diamonds'},{r:'3',s:'diamonds'}]} />
          </div>
        ),
      },
      {
        title: '顺子 (Straight)',
        content: (
          <div>
            <p><strong>五张数字连续的牌，花色不同。</strong>A 可以作为最大牌（A-K-Q-J-10，也叫"Broadway"），也可以作为最小牌（5-4-3-2-A，也叫"Wheel"）。</p>
            <HandExample cards={[{r:'10',s:'spades'},{r:'9',s:'hearts'},{r:'8',s:'diamonds'},{r:'7',s:'clubs'},{r:'6',s:'spades'}]} />
          </div>
        ),
      },
      {
        title: '三条 (Three of a Kind)',
        content: (
          <div>
            <p><strong>三张相同数字的牌。</strong>如果两人都有三条，比三条的数字；数字相同则比另外两张牌中最大的一张。</p>
            <HandExample cards={[{r:'8',s:'spades'},{r:'8',s:'hearts'},{r:'8',s:'diamonds'},{r:'K',s:'clubs'},{r:'2',s:'spades'}]} />
          </div>
        ),
      },
      {
        title: '两对 (Two Pair)',
        content: (
          <div>
            <p><strong>两个对子。</strong>比如 A-A-9-9-K。先比大的对子、再比小的对子、最后比第 5 张牌（踢脚）。</p>
            <HandExample cards={[{r:'A',s:'spades'},{r:'A',s:'hearts'},{r:'9',s:'diamonds'},{r:'9',s:'clubs'},{r:'K',s:'spades'}]} />
          </div>
        ),
      },
      {
        title: '一对 (One Pair)',
        content: (
          <div>
            <p><strong>一个对子。</strong>比如 J-J-A-7-3。先比对子大小，一样大再比剩余三张中最大的（踢脚牌）。</p>
            <HandExample cards={[{r:'J',s:'spades'},{r:'J',s:'hearts'},{r:'A',s:'diamonds'},{r:'7',s:'clubs'},{r:'3',s:'spades'}]} />
          </div>
        ),
      },
      {
        title: '高牌 (High Card) — 最弱',
        content: (
          <div>
            <p><strong>以上所有牌型都没有。</strong>单纯比五张牌中最大的一张。A 最大，2 最小。在德州扑克中，纯高牌几乎不可能赢下摊牌。</p>
            <HandExample cards={[{r:'A',s:'spades'},{r:'J',s:'hearts'},{r:'8',s:'diamonds'},{r:'5',s:'clubs'},{r:'3',s:'spades'}]} />
          </div>
        ),
      },
    ],
  },

  // ── 第 4 课 ──
  {
    icon: '💰',
    title: '下注规则',
    summary: '德州扑克的魅力在于下注。你可以弃牌走人、过牌观望、跟注参战、加注施压、甚至全下梭哈。你的每一个动作都在讲一个故事。',
    cards: [
      {
        title: '基本动作',
        content: (
          <div>
            <p><strong>弃牌 (Fold)</strong> — 扔掉手牌，退出这一局。已经投入的筹码拿不回来。任何时候你觉得牌不够好，都可以弃牌。</p>
            <p><strong>过牌 (Check)</strong> — 不弃牌，也不下注，把行动权交给下一个人。前提是：这一轮还没有人下注。如果有人下了注，你就必须跟注、加注或弃牌。</p>
            <p><strong>跟注 (Call)</strong> — 匹配当前最高下注额。别人下 100，你跟 100，继续留在这局。</p>
            <p><strong>加注 (Raise)</strong> — 在跟注的基础上再加码。别人下 100，你加到 300。加注是德州扑克中最强的进攻武器——它在对所有人说"我有好牌，你们跟不跟？"</p>
          </div>
        ),
      },
      {
        title: '特殊动作：全下 (All-in)',
        content: (
          <div>
            <p><strong>全下 (All-in)</strong> 就是把你面前所有的筹码都推进底池。这是德州扑克中最戏剧性的时刻。</p>
            <p>你什么时候可以全下？<strong>任何时候。</strong>哪怕你只有一张 2，你也可以全下——这是你的权利。当然，别人也可以选择跟注你的全下。</p>
            <p><strong>边池 (Side Pot)：</strong>如果对手筹码比你多，你全下后只能赢走和你筹码等额的主池。多出来的筹码形成"边池"，由剩余玩家争夺。</p>
            <p>全下之后，你不需要再做任何决定——手牌自动进入摊牌流程，坐等公共牌一张张翻开。</p>
          </div>
        ),
      },
      {
        title: '常见策略术语',
        content: (
          <div>
            <p><strong>诈唬 (Bluff)</strong> — 牌不好但假装很好，用大注吓跑对手。德州扑克的精髓：你不是在玩自己的牌，你是在玩对手的恐惧。</p>
            <p><strong>价值下注 (Value Bet)</strong> — 你有好牌，希望对手跟注来扩大底池。下注金额要让对手"想跟但又不太舒服"。</p>
            <p><strong>半诈唬 (Semi-Bluff)</strong> — 你目前牌不够好，但有机会在后面成牌（听牌）。下注有两个目的：如果对手弃牌直接赢；如果跟注，你还有机会在后面命中。</p>
            <p><strong>过牌-加注 (Check-Raise)</strong> — 先过牌示弱，等对手下注后再加注反击。这是一个经典的陷阱，告诉对手"你上当了"。</p>
          </div>
        ),
      },
    ],
  },

  // ── 第 5 课 ──
  {
    icon: '🎮',
    title: '一局完整演示',
    summary: '纸上得来终觉浅。下面是一局真实的德州扑克从发牌到摊牌的完整过程，点击按钮逐步推进，看看每个阶段发生了什么。',
    cards: [],
    renderExtra: () => <PokerTable />,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   App
   ═══════════════════════════════════════════════════════════════════ */
function App() {
  const [expandedCards, setExpandedCards] = useState({});
  const activeChapter = useActiveChapter(chapters.length);

  const toggleCard = useCallback((chapterIndex, cardIndex) => {
    setExpandedCards(prev => {
      const key = `${chapterIndex}-${cardIndex}`;
      const next = { ...prev };
      next[key] = !prev[key];
      return next;
    });
  }, []);

  const scrollToChapter = useCallback((index) => {
    if (index < 0) {
      const el = document.getElementById('hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (index >= chapters.length) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(`chapter-${index}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="app">
      <ProgressSidebar
        chapters={chapters}
        activeChapter={activeChapter}
        onNavigate={scrollToChapter}
      />
      <MobileProgressBar
        chapters={chapters}
        activeChapter={activeChapter}
        onNavigate={scrollToChapter}
      />
      <main className="main">
        <HeroSection onStart={() => scrollToChapter(0)} />
        {chapters.map((chapter, i) => (
          <Chapter
            key={i}
            index={i}
            title={chapter.title}
            icon={chapter.icon}
            summary={chapter.summary}
            cards={chapter.cards}
            expandedCards={expandedCards}
            onToggleCard={(cardIdx) => toggleCard(i, cardIdx)}
            onContinue={() => scrollToChapter(i + 1)}
            isLast={i === chapters.length - 1}
            renderExtra={chapter.renderExtra}
          />
        ))}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Mount
   ═══════════════════════════════════════════════════════════════════ */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
