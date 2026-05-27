/* ═══════════════════════════════════════════════════════════
   PlayingCard — CSS-drawn playing card component
   Shared across all modules
   ═══════════════════════════════════════════════════════════ */
var SUIT_SYMBOLS = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' };

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

  var isRed = suit === 'hearts' || suit === 'diamonds';
  var suitSymbol = SUIT_SYMBOLS[suit];
  var colorClass = isRed ? 'pcard-red' : 'pcard-black';
  var sizeClass = size === 'small' ? ' pcard-sm' : size === 'large' ? ' pcard-lg' : size === 'table' ? ' pcard-tbl' : '';

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
      {cards.map(function(card, i) {
        return <PlayingCard key={i} rank={card.rank} suit={card.suit} faceDown={card.faceDown} />;
      })}
    </div>
  );
}

function CardRow({ cards, size }) {
  return (
    <div className="pcard-row">
      {cards.map(function(c, i) {
        return <PlayingCard key={i} rank={c.r} suit={c.s} size={size || 'small'} />;
      })}
    </div>
  );
}
