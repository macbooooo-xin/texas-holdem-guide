/* ═══════════════════════════════════════════════════════════
   PokerTable — Interactive Texas Hold'em hand demo
   ═══════════════════════════════════════════════════════════ */
var POKER_STEPS = [
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
  var _s = React.useState(0);
  var step = _s[0];
  var setStep = _s[1];
  var current = POKER_STEPS[Math.min(step, POKER_STEPS.length - 1)];
  var isDone = step >= POKER_STEPS.length - 1;

  return (
    <div className="poker-table-container">
      <div className="pt-scene">
        <div className="pt-table">
          <div className="pt-dealer-btn">D</div>

          {step === 0 && (
            <React.Fragment>
              <div className="pt-blind pt-blind-sb">SB</div>
              <div className="pt-blind pt-blind-bb">BB</div>
            </React.Fragment>
          )}

          <div className="pt-seat pt-seat-top">
            <div className="pt-seat-label">对手</div>
            <div className="pt-seat-chips">{'\u{1F7E1}\u{1F7E1}\u{1F7E1}'}</div>
            <div className="pt-seat-cards">
              {current.opponentCards.map(function(card, i) {
                return <PlayingCard key={'opp-' + step + '-' + i} rank={card.rank} suit={card.suit} faceDown={card.faceDown} size="table" />;
              })}
            </div>
          </div>

          <div className="pt-seat pt-seat-left">
            <div className="pt-seat-label pt-seat-empty">玩家3 (弃牌)</div>
          </div>

          <div className="pt-seat pt-seat-right">
            <div className="pt-seat-label pt-seat-empty">玩家4 (弃牌)</div>
          </div>

          <div className="pt-community">
            {current.community.map(function(card, i) {
              return <PlayingCard key={'comm-' + step + '-' + i} rank={card.rank} suit={card.suit} size="small" />;
            })}
            {Array.from({ length: Math.max(0, 5 - current.community.length) }).map(function(_, i) {
              return <div key={'empty-' + i} className="pt-empty-slot" />;
            })}
          </div>

          <div className="pt-pot" key={'pot-' + step}>
            <div className="pt-pot-chips">{'\u{1F7E1}'.repeat(Math.min(8, Math.ceil(current.pot / 120)))}</div>
            <div className="pt-pot-text">底池 <strong>{current.pot}</strong></div>
          </div>

          <div className="pt-seat pt-seat-bottom">
            <div className="pt-seat-cards">
              {current.playerCards.map(function(card, i) {
                return <PlayingCard key={'player-' + step + '-' + i} rank={card.rank} suit={card.suit} size="table" />;
              })}
            </div>
            <div className="pt-seat-chips">{'\u{1F7E1}\u{1F7E1}\u{1F7E1}\u{1F7E1}\u{1F7E1}'}</div>
            <div className="pt-seat-label">
              你
              {current.winner === 'player' && (
                <span className="winner-badge">赢!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-step-info" key={'info-' + step}>
        <div className="pt-step-label">
          步骤 {step + 1}/{POKER_STEPS.length}: {current.label}
        </div>
        <p className="pt-step-desc">{current.desc}</p>
      </div>

      <div className="pt-controls">
        {!isDone ? (
          <button className="pt-next-btn" onClick={function() { setStep(function(s) { return Math.min(s + 1, POKER_STEPS.length - 1); }); }}>
            下一步: {POKER_STEPS[step + 1].label}
          </button>
        ) : (
          <button className="pt-reset-btn" onClick={function() { setStep(0); }}>
            再看一遍
          </button>
        )}
      </div>
    </div>
  );
}
