/* ═══════════════════════════════════════════════════════════
   Module: Starting Hands (起手牌表)
   ═══════════════════════════════════════════════════════════ */

var RANKS = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];

/* ── Hand strength classification ── */
function getHandStrength(r1, r2, suited) {
  var i1 = RANKS.indexOf(r1);
  var i2 = RANKS.indexOf(r2);
  var high = Math.min(i1, i2);
  var low = Math.max(i1, i2);
  var gap = low - high - 1;

  // Pair
  if (r1 === r2) {
    if (high <= 1) return 'premium';   // AA, KK
    if (high <= 4) return 'strong';    // QQ, JJ, 10-10
    if (high <= 7) return 'playable';  // 99, 88
    return 'marginal';                  // 77-22
  }

  // Suited
  if (suited) {
    if (high === 0 && low <= 2) return 'premium';      // AKs, AQs
    if (high === 0 && low <= 5) return 'strong';       // AJs-A8s
    if (high === 0) return 'playable';                  // A7s-A2s
    if (high <= 2 && gap <= 1) return 'strong';        // KQs, KJs, QJs
    if (high <= 4 && gap <= 1) return 'playable';      // J10s-98s
    if (gap <= 1) return 'marginal';                    // lower connectors
    return 'weak';
  }

  // Off-suit
  if (high === 0 && low <= 1) return 'premium';         // AKo, AQo
  if (high === 0 && low <= 4) return 'strong';          // AJo-A9o
  if (high === 0) return 'playable';                    // A8o-A2o
  if (high <= 2 && gap <= 0) return 'strong';           // KQo
  if (high <= 3 && gap <= 0) return 'playable';         // KJo, QJo
  if (high <= 5 && gap <= 0) return 'marginal';         // J10o-98o
  return 'weak';
}

var STRENGTH_COLORS = {
  premium:  { label: '顶级牌',  bg: 'rgba(46, 160, 67, 0.35)',  text: '#3fb950' },
  strong:   { label: '强牌',    bg: 'rgba(46, 160, 67, 0.18)',  text: '#56d364' },
  playable: { label: '可玩',    bg: 'rgba(210, 153, 34, 0.18)',  text: '#d29922' },
  marginal: { label: '边缘牌', bg: 'rgba(210, 153, 34, 0.10)',  text: '#c69026' },
  weak:     { label: '弱牌',    bg: 'rgba(248, 81, 73, 0.10)',   text: '#f85149' },
};

var POSITION_RANGES = {
  early: {
    label: '早位 (UTG/UTG+1)',
    desc: '前位置最紧，只玩最强牌。',
    allow: ['premium', 'strong'],
  },
  middle: {
    label: '中位 (MP/HJ)',
    desc: '可以放宽一些，加入可玩牌。',
    allow: ['premium', 'strong', 'playable'],
  },
  late: {
    label: '晚位 (CO/BTN)',
    desc: '位置优势最大，可以玩更多手牌。',
    allow: ['premium', 'strong', 'playable', 'marginal'],
  },
};

/* ── Starting Hands Module ── */
function StartingHandsModule() {
  var _p = React.useState('late');
  var position = _p[0];
  var setPosition = _p[1];

  var _s = React.useState(null);
  var selected = _s[0];
  var setSelected = _s[1];

  var allowSet = POSITION_RANGES[position].allow;

  function isAllowed(strength) {
    return allowSet.indexOf(strength) !== -1;
  }

  return (
    <div className="module-starthand">
      <div className="module-page-header">
        <h1 className="module-page-title">{'\u{1F0A1}'} 起手牌表</h1>
        <p className="module-page-subtitle">169种起手牌组合 · 颜色表示强度 · 点击查看详情</p>
      </div>

      {/* Position Selector */}
      <div className="sh-position-bar">
        <span className="sh-position-label">位置选择：</span>
        {Object.keys(POSITION_RANGES).map(function(key) {
          var pr = POSITION_RANGES[key];
          return (
            <button
              key={key}
              className={'sh-pos-btn' + (position === key ? ' active' : '')}
              onClick={function() { setPosition(key); setSelected(null); }}
            >
              {pr.label.split(' ')[0]}
            </button>
          );
        })}
        <span className="sh-position-desc">{POSITION_RANGES[position].desc}</span>
      </div>

      {/* Legend */}
      <div className="sh-legend">
        {Object.keys(STRENGTH_COLORS).map(function(key) {
          var sc = STRENGTH_COLORS[key];
          var dimmed = !isAllowed(key);
          return (
            <span key={key} className={'sh-legend-item' + (dimmed ? ' dimmed' : '')}>
              <span className="sh-legend-dot" style={{ background: sc.bg, borderColor: sc.text }} />
              {sc.label}
            </span>
          );
        })}
      </div>

      {/* 13x13 Matrix */}
      <div className="sh-matrix">
        {/* Header row */}
        <div className="sh-matrix-row sh-matrix-header">
          <div className="sh-matrix-cell sh-matrix-corner" />
          {RANKS.map(function(r) {
            return <div key={r} className="sh-matrix-cell sh-matrix-header-cell">{r}</div>;
          })}
        </div>

        {RANKS.map(function(r1, i) {
          return (
            <div key={r1} className="sh-matrix-row">
              <div className="sh-matrix-cell sh-matrix-header-cell">{r1}</div>
              {RANKS.map(function(r2, j) {
                var suited = i < j;
                var unsuited = i > j;
                var isPair = i === j;

                var displayRank1 = suited ? r2 : r1;
                var displayRank2 = suited ? r1 : r2;
                var display = isPair ? r1 + r1 : displayRank1 + displayRank2;
                var suffix = isPair ? '' : (suited ? 's' : 'o');

                var strength = getHandStrength(displayRank1, displayRank2, suited || isPair);
                var sc = STRENGTH_COLORS[strength];
                var allowed = isAllowed(strength);
                var isSelected = selected && selected.r1 === r1 && selected.r2 === r2;

                return (
                  <div
                    key={r1 + '-' + r2}
                    className={'sh-matrix-cell sh-hand-cell' + (isSelected ? ' selected' : '') + (!allowed ? ' dimmed' : '')}
                    style={{ background: isSelected ? 'rgba(201,168,76,0.25)' : sc.bg, borderColor: isSelected ? 'var(--gold)' : sc.text }}
                    onClick={function() {
                      if (isSelected) { setSelected(null); }
                      else { setSelected({ r1: r1, r2: r2, display: display + suffix, suited: suited || isPair, strength: strength }); }
                    }}
                    title={display + suffix + ' — ' + sc.label}
                  >
                    <span className="sh-hand-label">{display}</span>
                    <span className="sh-hand-suffix">{suffix}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="sh-detail">
          <div className="sh-detail-inner">
            <div className="sh-detail-header">
              <h3>{selected.display}</h3>
              <span className="sh-detail-badge" style={{ background: STRENGTH_COLORS[selected.strength].bg, color: STRENGTH_COLORS[selected.strength].text, borderColor: STRENGTH_COLORS[selected.strength].text }}>
                {STRENGTH_COLORS[selected.strength].label}
              </span>
              <button className="sh-detail-close" onClick={function() { setSelected(null); }}>{'\u{2715}'}</button>
            </div>
            <div className="sh-detail-cards">
              <PlayingCard rank={selected.r1} suit={selected.suited && selected.r1 !== selected.r2 ? 'spades' : 'spades'} size="large" />
              <PlayingCard rank={selected.r2} suit={selected.suited ? 'spades' : 'hearts'} size="large" />
            </div>
            <div className="sh-detail-info">
              <div className="sh-detail-row">
                <span className="sh-detail-key">类型</span>
                <span className="sh-detail-val">{selected.r1 === selected.r2 ? '口袋对子 (Pocket Pair)' : selected.suited ? '同花连牌 (Suited)' : '不同花 (Off-suit)'}</span>
              </div>
              <div className="sh-detail-row">
                <span className="sh-detail-key">强度</span>
                <span className="sh-detail-val" style={{ color: STRENGTH_COLORS[selected.strength].text }}>{STRENGTH_COLORS[selected.strength].label}</span>
              </div>
              <div className="sh-detail-row">
                <span className="sh-detail-key">当前位置</span>
                <span className="sh-detail-val">{isAllowed(selected.strength) ? '\u{2705} 建议玩' : '\u{274C} 建议弃牌'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
