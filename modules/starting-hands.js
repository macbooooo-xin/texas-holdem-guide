/* ═══════════════════════════════════════════════════════════
   Module: Starting Hands (起手牌表) — Professional v2
   ═══════════════════════════════════════════════════════════ */

var RANKS = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];

/* ── Position-specific range definitions (standard 9-max) ── */
var SH_POSITIONS = [
  { id: 'utg',  name: 'UTG',   full: '枪口位',    desc: '前位最紧，只用顶级牌开局',   range: '8%',  color: '#e06c75' },
  { id: 'mp',   name: 'MP',    full: '中位',      desc: '可以适当放宽手牌范围',       range: '13%', color: '#d19a66' },
  { id: 'hj',   name: 'HJ',    full: '劫持位',    desc: '开始加入同花连牌和中等对子',  range: '18%', color: '#e5c07b' },
  { id: 'co',   name: 'CO',    full: '关煞位',    desc: '偷盲黄金位，范围显著放宽',    range: '25%', color: '#61afef' },
  { id: 'btn',  name: 'BTN',   full: '庄位',      desc: '最佳位置，可玩最多手牌',       range: '40%', color: '#56b6c2' },
  { id: 'sb',   name: 'SB',    full: '小盲位',    desc: '最差位置，仅玩最强的牌',       range: '10%', color: '#c678dd' },
];

/* ── Detailed range matrix per position ── */
function getPositionAllowance(posId, r1, r2, isPair, isSuited) {
  var i1 = RANKS.indexOf(r1);
  var i2 = RANKS.indexOf(r2);
  var hi = Math.min(i1, i2);
  var lo = Math.max(i1, i2);
  var gap = lo - hi - 1;

  /* UTG (8%): AA-TT, AK, AQs */
  if (posId === 'utg') {
    if (isPair && hi <= 4) return 'raise';      // 1010+
    if (hi === 0 && lo <= 2 && isSuited) return 'raise'; // AKs, AQs
    if (hi === 0 && lo <= 1 && !isSuited && !isPair) return 'raise'; // AKo
    if (isPair && hi <= 6) return 'call';        // 99-77
    if (hi === 0 && lo <= 3 && isSuited) return 'call'; // AJs
    return null;
  }

  /* MP (13%): AA-88, AK/AQ, KQs, AJs, ATs */
  if (posId === 'mp') {
    if (isPair && hi <= 6) return 'raise';       // 88+
    if (hi === 0 && lo <= 2 && isSuited) return 'raise'; // AKs, AQs
    if (hi === 0 && lo <= 1 && !isSuited && !isPair) return 'raise'; // AK, AQ off
    if (hi === 0 && lo <= 3 && isSuited) return 'raise'; // AJs, ATs
    if (hi <= 1 && gap <= 0 && isSuited) return 'raise'; // KQs
    if (isPair && hi <= 9) return 'call';         // 77-44
    if (hi === 0 && lo <= 4 && isSuited) return 'call'; // A9s, A8s
    if (hi <= 2 && gap <= 0 && isSuited) return 'call'; // QJs
    return null;
  }

  /* HJ (18%) */
  if (posId === 'hj') {
    if (isPair && hi <= 9) return 'raise';        // 44+
    if (hi === 0 && lo <= 4 && isSuited) return 'raise'; // AXs (X<=9)
    if (hi === 0 && lo <= 2 && !isSuited && !isPair) return 'raise'; // AKo, AQo
    if (hi <= 1 && gap <= 0 && isSuited) return 'raise'; // KQs, KJs
    if (hi <= 2 && gap <= 0 && isSuited) return 'raise'; // QJs
    if (hi <= 4 && gap <= 0 && isSuited) return 'raise'; // J10s, 109s
    if (isPair) return 'call';                     // 22-33
    if (hi === 0 && lo <= 5 && isSuited) return 'call'; // A5s-A2s
    if (hi === 1 && lo <= 3 && !isSuited && !isPair) return 'call'; // KQo, KJo
    if (hi <= 5 && gap <= 0 && isSuited) return 'call'; // 98s, 87s
    return null;
  }

  /* CO (25%) - wider range with more suited connectors */
  if (posId === 'co') {
    if (isPair) return 'raise';                    // all pairs
    if (hi === 0 && lo <= 5 && isSuited) return 'raise'; // AXs
    if (hi === 0 && lo <= 3 && !isSuited && !isPair) return 'raise'; // ATo+
    if (hi <= 2 && gap <= 1 && isSuited) return 'raise'; // KQs-K10s, QJs-Q10s
    if (hi <= 4 && gap <= 0 && isSuited) return 'raise'; // J10s-98s
    if (hi === 0 && !isSuited) return 'call';      // A9o-A2o
    if (hi === 1 && lo <= 5 && !isSuited && !isPair) return 'call'; // KJo-K9o
    if (hi <= 3 && gap <= 0 && isSuited) return 'call'; // Q10s, J9s
    if (hi <= 6 && gap <= 0 && isSuited) return 'call'; // 87s, 76s, 65s
    if (hi <= 7 && gap <= 1 && isSuited) return 'call'; // 86s, 75s
    return null;
  }

  /* BTN (40%) - broadest range */
  if (posId === 'btn') {
    if (isPair) return 'raise';
    if (hi === 0 && isSuited) return 'raise';      // all AXs
    if (hi === 0 && lo <= 6 && !isSuited && !isPair) return 'raise'; // A9o+
    if (hi <= 3 && gap <= 1 && isSuited) return 'raise'; // KJs+, QJs+, J10s, etc
    if (hi <= 5 && gap <= 0 && isSuited) return 'raise'; // connectors 98s+
    if (hi === 1 && isSuited) return 'raise';       // all KXs
    if (hi === 0 && !isSuited && !isPair) return 'call'; // remaining AXo
    if (hi <= 2 && lo <= 7 && isSuited) return 'call'; // Q8s+, J7s+
    if (hi <= 6 && gap <= 0 && isSuited) return 'call'; // 87s-54s
    if (hi <= 3 && lo <= 6 && !isSuited && !isPair) return 'call'; // Q9o, J9o, 109o
    if (hi <= 6 && gap <= 1 && isSuited) return 'call'; // 86s, 75s, 64s
    return null;
  }

  /* SB (10%) - tight, similar to UTG */
  if (posId === 'sb') {
    if (isPair && hi <= 5) return 'raise';          // 99+
    if (hi === 0 && lo <= 2 && isSuited) return 'raise'; // AKs, AQs
    if (hi === 0 && lo <= 1 && !isSuited && !isPair) return 'raise'; // AK, AQ
    if (hi <= 1 && gap <= 0 && isSuited) return 'raise'; // KQs
    if (isPair && hi <= 7) return 'call';           // 88-66
    if (hi <= 1 && gap <= 0 && !isSuited && !isPair) return 'call'; // KQo
    return null;
  }

  return null;
}

/* ── Colors ── */
var POS_COLORS = {};
SH_POSITIONS.forEach(function(p) { POS_COLORS[p.id] = p.color; });

function getCellStyle(posId, r1, r2) {
  var isPair = r1 === r2;
  var i1 = RANKS.indexOf(r1);
  var i2 = RANKS.indexOf(r2);
  var isSuited = i1 < i2;

  var action = getPositionAllowance(posId, r1, r2, isPair, isSuited);

  if (action === 'raise') return { bg: 'rgba(46, 160, 67, 0.3)', border: '#3fb950', cls: 'raise' };
  if (action === 'call')  return { bg: 'rgba(210, 153, 34, 0.2)', border: '#d29922', cls: 'call' };
  return { bg: 'rgba(255, 255, 255, 0.02)', border: 'rgba(255,255,255,0.05)', cls: 'fold' };
}

/* ── Module ── */
function StartingHandsModule() {
  var _pi = React.useState(0);
  var posIdx = _pi[0];
  var setPosIdx = _pi[1];

  var _h = React.useState(null);
  var hovered = _h[0];
  var setHovered = _h[1];

  var pos = SH_POSITIONS[posIdx];

  return (
    <div className="module-starthand">
      <div className="module-page-header">
        <h1 className="module-page-title">{'\u{1F0A1}'} 起手牌范围表</h1>
        <p className="module-page-subtitle">不同位置的可玩手牌范围 · 绿色 = 加注 · 黄色 = 可跟注 · 灰色 = 弃牌</p>
      </div>

      {/* Position Tabs */}
      <div className="sh-tabs">
        {SH_POSITIONS.map(function(p, i) {
          var isActive = i === posIdx;
          return (
            <button
              key={p.id}
              className={'sh-tab' + (isActive ? ' active' : '')}
              style={isActive ? { borderColor: p.color, color: p.color } : {}}
              onClick={function() { setPosIdx(i); setHovered(null); }}
            >
              <span className="sh-tab-name">{p.name}</span>
              <span className="sh-tab-full">{p.full}</span>
              <span className="sh-tab-range" style={isActive ? { background: p.color } : {}}>{p.range}</span>
            </button>
          );
        })}
      </div>

      {/* Position description */}
      <div className="sh-pos-info">
        <span className="sh-pos-info-dot" style={{ background: pos.color }} />
        <span className="sh-pos-info-name">{pos.name} — {pos.full}</span>
        <span className="sh-pos-info-desc">{pos.desc}</span>
        <span className="sh-pos-info-range">推荐范围：约 {pos.range} 起手牌</span>
      </div>

      {/* Legend */}
      <div className="sh-legend">
        <span className="sh-legend-item">
          <span className="sh-legend-dot" style={{ background: 'rgba(46,160,67,0.35)', borderColor: '#3fb950' }} />
          <span>加注 (Raise)</span>
        </span>
        <span className="sh-legend-item">
          <span className="sh-legend-dot" style={{ background: 'rgba(210,153,34,0.25)', borderColor: '#d29922' }} />
          <span>跟注/平跟 (Call/Limp)</span>
        </span>
        <span className="sh-legend-item">
          <span className="sh-legend-dot" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }} />
          <span>弃牌 (Fold)</span>
        </span>
        <span className="sh-legend-divider" />
        <span className="sh-legend-note">{'\u{25B2}'} 同花 (Suited)</span>
        <span className="sh-legend-note">{'\u{25BC}'} 不同花 (Off-suit)</span>
        <span className="sh-legend-note">{'\u{25C7}'} 对子 (Pairs)</span>
      </div>

      {/* 13x13 Matrix */}
      <div className="sh-matrix-wrap">
        {/* Zone labels */}
        <div className="sh-zone-labels">
          <span className="sh-zone-label suited-label">{'\u{25B2}'} 同花牌 (Suited)</span>
          <span className="sh-zone-label offsuit-label">{'\u{25BC}'} 不同花 (Off-suit)</span>
        </div>

        <div className="sh-matrix">
          {/* Column headers */}
          <div className="sh-matrix-row sh-matrix-header">
            <div className="sh-matrix-corner" />
            {RANKS.map(function(r) {
              return <div key={'h-'+r} className="sh-col-header">{r}</div>;
            })}
          </div>

          {RANKS.map(function(r1, i) {
            return (
              <div key={'r-'+r1} className="sh-matrix-row">
                <div className="sh-row-header">{r1}</div>
                {RANKS.map(function(r2, j) {
                  var isPair = i === j;
                  var isSuited = i < j;
                  var cellStyle = getCellStyle(pos.id, r1, r2);
                  var active = hovered && hovered.r1 === r1 && hovered.r2 === r2;

                  var display = isPair ? r1 + r1 : (isSuited ? r1 + r2 : r2 + r1);
                  var suffix = isPair ? '' : (isSuited ? 's' : 'o');

                  return (
                    <div
                      key={r1+'-'+r2}
                      className={'sh-cell' + (active ? ' active' : '') + ' sh-' + cellStyle.cls}
                      style={{
                        background: cellStyle.bg,
                        borderColor: active ? 'var(--gold)' : cellStyle.border,
                      }}
                      onMouseEnter={function() { setHovered({r1:r1, r2:r2, display:display+suffix, isPair:isPair, isSuited:isSuited, cls:cellStyle.cls}); }}
                      onMouseLeave={function() { setHovered(null); }}
                      title={display + suffix}
                    >
                      <span className="sh-cell-label">{display}</span>
                      {suffix && <span className="sh-cell-suffix">{suffix}</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover preview */}
      {hovered && (
        <div className="sh-preview">
          <div className="sh-preview-cards">
            <PlayingCard rank={hovered.r1} suit={hovered.isPair || hovered.isSuited ? 'spades' : 'spades'} size="large" />
            <PlayingCard rank={hovered.r2} suit={hovered.isSuited ? 'spades' : 'hearts'} size="large" />
          </div>
          <div className="sh-preview-info">
            <div className="sh-preview-name">{hovered.display}</div>
            <div className="sh-preview-type">
              {hovered.isPair ? '口袋对子 (Pocket Pair)' : hovered.isSuited ? '同花牌 (Suited)' : '不同花 (Off-suit)'}
            </div>
            <div className={'sh-preview-action ' + hovered.cls}>
              {hovered.cls === 'raise' ? '\u{1F7E2} 推荐加注' : hovered.cls === 'call' ? '\u{1F7E1} 可跟注/溜入' : '\u{26AA} 建议弃牌'}
            </div>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="sh-summary">
        <div className="sh-summary-item">
          <span className="sh-summary-num" style={{ color: pos.color }}>{pos.range}</span>
          <span className="sh-summary-label">总起手牌占比</span>
        </div>
        <div className="sh-summary-item">
          <span className="sh-summary-num">{pos.id === 'btn' ? '~40%' : pos.id === 'co' ? '~25%' : pos.id === 'hj' ? '~18%' : pos.id === 'mp' ? '~13%' : '~8-10%'}</span>
          <span className="sh-summary-label">标准翻牌前加注频率</span>
        </div>
        <div className="sh-summary-item">
          <span className="sh-summary-num">{pos.id === 'btn' || pos.id === 'co' ? '宽' : pos.id === 'hj' || pos.id === 'mp' ? '中' : '紧'}</span>
          <span className="sh-summary-label">整体策略风格</span>
        </div>
      </div>
    </div>
  );
}
