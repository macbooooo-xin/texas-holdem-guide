/* ═══════════════════════════════════════════════════════════
   Module: Starting Hands (起手牌表) — Professional v2
   ═══════════════════════════════════════════════════════════ */

var RANKS = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];

/* ── Standard 9-max position definitions ── */
var SH_POSITIONS = [
  { id: 'utg',   name: 'UTG',   full: '枪口位',        desc: '翻牌前第一个行动，只用最强牌开局',     range: '~8%',   color: '#e06c75' },
  { id: 'utg1',  name: 'UTG+1', full: '枪口+1',       desc: '前位第二个行动，可略微放宽',           range: '~10%',  color: '#e06c75' },
  { id: 'mp',    name: 'MP',    full: '中位',          desc: '中间位置，开始加入更多手牌',           range: '~14%',  color: '#d19a66' },
  { id: 'hj',    name: 'HJ',    full: '劫持位',        desc: '可偷盲的第一个位置',                   range: '~20%',  color: '#e5c07b' },
  { id: 'co',    name: 'CO',    full: '关煞位',        desc: '偷盲黄金位，范围显著放宽',              range: '~28%',  color: '#61afef' },
  { id: 'btn',   name: 'BTN',   full: '庄位 (Button)', desc: '全场最佳位置，每轮最后行动',            range: '~42%',  color: '#56b6c2' },
  { id: 'sb',    name: 'SB',    full: '小盲位',        desc: '翻牌后最差位置，被迫投入小盲注',        range: '~35%*', color: '#c678dd' },
  { id: 'bb',    name: 'BB',    full: '大盲位',        desc: '已有大盲投入，防守范围最宽',            range: '~50%*', color: '#c678dd' },
];

/* ── Range logic per position ── */
function getPositionAllowance(posId, r1, r2, isPair, isSuited) {
  var i1 = RANKS.indexOf(r1);
  var i2 = RANKS.indexOf(r2);
  var hi = Math.min(i1, i2);
  var lo = Math.max(i1, i2);
  var gap = lo - hi - 1;

  /* ── UTG (~8%) ── */
  if (posId === 'utg') {
    if (isPair && hi <= 3) return 'raise';                  // JJ+
    if (isPair && hi <= 4) return 'call';                   // TT
    if (hi === 0 && lo <= 2 && isSuited) return 'raise';    // AKs, AQs
    if (hi === 0 && lo <= 1 && !isSuited && !isPair) return 'raise'; // AKo, AQo
    if (hi <= 1 && gap <= 0 && isSuited) return 'call';     // KQs
    return null;
  }

  /* ── UTG+1 (~10%) ── */
  if (posId === 'utg1') {
    if (isPair && hi <= 3) return 'raise';                  // JJ+
    if (isPair && hi <= 5) return 'call';                   // TT, 99
    if (hi === 0 && lo <= 2 && isSuited) return 'raise';    // AKs, AQs
    if (hi === 0 && lo <= 1 && !isSuited && !isPair) return 'raise'; // AKo, AQo
    if (hi === 0 && lo <= 3 && isSuited) return 'call';     // AJs, ATs
    if (hi <= 1 && gap <= 0 && isSuited) return 'call';     // KQs
    return null;
  }

  /* ── MP (~14%) ── */
  if (posId === 'mp') {
    if (isPair && hi <= 4) return 'raise';                  // TT+
    if (isPair && hi <= 6) return 'call';                   // 99, 88
    if (hi === 0 && lo <= 2 && isSuited) return 'raise';    // AKs, AQs
    if (hi === 0 && lo <= 1 && !isSuited && !isPair) return 'raise'; // AKo, AQo
    if (hi === 0 && lo <= 3 && isSuited) return 'raise';    // AJs, ATs
    if (hi <= 1 && gap <= 0 && isSuited) return 'raise';    // KQs
    if (hi === 0 && lo <= 4 && isSuited) return 'call';     // A9s, A8s
    if (hi === 1 && lo <= 3 && !isSuited && !isPair) return 'call'; // KQo, KJo
    if (hi <= 2 && gap <= 0 && isSuited) return 'call';     // QJs
    return null;
  }

  /* ── HJ (~20%) ── */
  if (posId === 'hj') {
    if (isPair && hi <= 5) return 'raise';                  // 99+
    if (isPair && hi <= 9) return 'call';                   // 88-44
    if (hi === 0 && lo <= 2 && isSuited) return 'raise';    // AKs, AQs
    if (hi === 0 && lo <= 1 && !isSuited && !isPair) return 'raise'; // AKo, AQo
    if (hi === 0 && lo <= 3 && isSuited) return 'raise';    // AJs, ATs
    if (hi <= 1 && gap <= 0 && isSuited) return 'raise';    // KQs, KJs
    if (hi <= 2 && gap <= 0 && isSuited) return 'raise';    // QJs
    if (hi <= 4 && gap <= 0 && isSuited) return 'raise';    // JTs, T9s
    if (hi === 0 && lo <= 4 && isSuited) return 'call';     // A9s-A5s
    if (hi === 1 && lo <= 3 && !isSuited && !isPair) return 'call'; // KQo, KJo
    if (hi === 0 && lo <= 2 && !isSuited && !isPair) return 'call'; // AJo
    if (hi <= 5 && gap <= 0 && isSuited) return 'call';     // 98s, 87s
    return null;
  }

  /* ── CO (~28%) ── */
  if (posId === 'co') {
    if (isPair && hi <= 5) return 'raise';                  // 99+
    if (isPair) return 'call';                              // all remaining pairs
    if (hi === 0 && lo <= 2 && isSuited) return 'raise';    // AKs, AQs
    if (hi === 0 && lo <= 1 && !isSuited && !isPair) return 'raise'; // AKo, AQo
    if (hi === 0 && lo <= 4 && isSuited) return 'raise';    // AJs-A5s
    if (hi <= 2 && gap <= 1 && isSuited) return 'raise';    // KQs-KTs, QJs-QTs
    if (hi <= 4 && gap <= 0 && isSuited) return 'raise';    // JTs-98s
    if (hi === 0 && lo <= 6 && isSuited) return 'call';     // A4s-A2s
    if (hi === 0 && lo <= 3 && !isSuited && !isPair) return 'call'; // AJo-ATo
    if (hi === 1 && lo <= 5 && isSuited) return 'call';     // K9s-K2s
    if (hi === 1 && lo <= 3 && !isSuited && !isPair) return 'call'; // KQo-KJo
    if (hi === 2 && lo <= 4 && isSuited) return 'call';     // Q9s, Q8s
    if (hi <= 3 && lo <= 5 && isSuited) return 'call';      // J9s, J8s
    if (hi <= 6 && gap <= 0 && isSuited) return 'call';     // 87s-65s
    if (hi <= 7 && gap <= 1 && isSuited) return 'call';     // 86s, 75s
    return null;
  }

  /* ── BTN (~42%) ── */
  if (posId === 'btn') {
    if (isPair) return 'raise';                             // all pairs
    if (hi === 0 && lo <= 5 && isSuited) return 'raise';    // AKs-A5s
    if (hi === 0 && lo <= 3 && !isSuited && !isPair) return 'raise'; // AKo-ATo
    if (hi <= 2 && gap <= 1 && isSuited) return 'raise';    // KQs-KTs, QJs-QTs
    if (hi <= 4 && gap <= 0 && isSuited) return 'raise';    // JTs-98s
    if (hi <= 5 && gap <= 0 && isSuited) return 'raise';    // 87s
    if (hi === 0 && isSuited) return 'call';                // all remaining AXs
    if (hi === 0 && !isSuited && !isPair) return 'call';    // all remaining AXo
    if (hi === 1 && isSuited) return 'call';                // all KXs
    if (hi === 1 && lo <= 6 && !isSuited && !isPair) return 'call'; // KQo-K9o
    if (hi === 2 && lo <= 5 && isSuited) return 'call';     // QJs-Q6s
    if (hi === 2 && lo <= 5 && !isSuited && !isPair) return 'call'; // QJo-Q9o
    if (hi <= 3 && lo <= 6 && isSuited) return 'call';      // JTs-J7s
    if (hi <= 6 && gap <= 0 && isSuited) return 'call';     // 76s-54s
    if (hi <= 7 && gap <= 1 && isSuited) return 'call';     // 86s, 75s, 64s
    if (hi <= 8 && gap <= 0 && isSuited) return 'call';     // 43s, 32s
    return null;
  }

  /* ── SB (~15% raise, with implied odds calls) ── */
  if (posId === 'sb') {
    if (isPair && hi <= 4) return 'raise';                  // TT+
    if (isPair && hi <= 6) return 'call';                   // 99-77
    if (hi === 0 && lo <= 2 && isSuited) return 'raise';    // AKs, AQs
    if (hi === 0 && lo <= 1 && !isSuited && !isPair) return 'raise'; // AKo, AQo
    if (hi === 0 && lo <= 3 && isSuited) return 'call';     // AJs, ATs
    if (hi <= 1 && gap <= 0 && isSuited) return 'call';     // KQs
    if (hi <= 2 && gap <= 0 && isSuited) return 'call';     // QJs
    return null;
  }

  /* ── BB (defense range ~30-50% vs different positions) ── */
  if (posId === 'bb') {
    if (isPair && hi <= 5) return 'raise';                  // 99+ (3-bet)
    if (isPair) return 'call';                              // all pairs (defend)
    if (hi === 0 && lo <= 2 && isSuited) return 'raise';    // AKs, AQs (3-bet)
    if (hi === 0 && lo <= 1 && !isSuited && !isPair) return 'raise'; // AKo, AQo
    if (hi === 0 && isSuited) return 'call';                // all AXs
    if (hi === 0 && lo <= 5 && !isSuited && !isPair) return 'call'; // AJo-A8o
    if (hi === 1 && isSuited) return 'call';                // KXs
    if (hi === 1 && lo <= 5 && !isSuited && !isPair) return 'call'; // KQo-K9o
    if (hi === 2 && lo <= 5 && isSuited) return 'call';     // QJs-Q6s
    if (hi <= 3 && lo <= 5 && isSuited) return 'call';      // JTs-J8s
    if (hi <= 5 && gap <= 0 && isSuited) return 'call';     // 98s-87s-76s
    if (hi <= 6 && gap <= 1 && isSuited) return 'call';     // 86s, 75s
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
        <h1 className="module-page-title"><IconGrid /> 起手牌范围表</h1>
        <p className="module-page-subtitle">不同位置的可玩手牌范围 · 绿色 = 加注 · 黄色 = 可跟注 · 灰色 = 弃牌</p>
      </div>

      {/* Position Tabs — top */}
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
          <span>跟注/平跟 (Call)</span>
        </span>
        <span className="sh-legend-item">
          <span className="sh-legend-dot" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }} />
          <span>弃牌 (Fold)</span>
        </span>
        <span className="sh-legend-divider" />
        <span className="sh-legend-note">{'\u{25B2}'} 同花</span>
        <span className="sh-legend-note">{'\u{25BC}'} 不同花</span>
        <span className="sh-legend-note">{'\u{25C7}'} 对子</span>
      </div>

      {/* ── Matrix + Preview: side by side ── */}
      <div className="sh-body">
        <div className="sh-body-left">
          <div className="sh-zone-labels">
            <span className="sh-zone-label suited-label">{'\u{25B2}'} 同花牌 (Suited)</span>
            <span className="sh-zone-label offsuit-label">{'\u{25BC}'} 不同花 (Off-suit)</span>
          </div>
          <div className="sh-matrix">
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
                        style={{ background: cellStyle.bg, borderColor: active ? 'var(--gold)' : cellStyle.border }}
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

        <div className="sh-body-right">
          <div className="sh-preview-panel">
            <div className="sh-preview-panel-title">手牌详情</div>
            {hovered ? (
              <div className="sh-preview-content">
                <div className="sh-preview-cards">
                  <PlayingCard rank={hovered.r1} suit={hovered.isPair || hovered.isSuited ? 'spades' : 'spades'} size="large" />
                  <PlayingCard rank={hovered.r2} suit={hovered.isSuited ? 'spades' : 'hearts'} size="large" />
                </div>
                <div className="sh-preview-name">{hovered.display}</div>
                <div className="sh-preview-type">
                  {hovered.isPair ? '口袋对子' : hovered.isSuited ? '同花牌' : '不同花'}
                </div>
                <div className={'sh-preview-action ' + hovered.cls}>
                  {hovered.cls === 'raise' ? <span><IconCheck /> 推荐加注</span> : hovered.cls === 'call' ? <span><span style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:'#d29922',marginRight:4}} /> 可跟注/溜入</span> : <span><IconCross /> 建议弃牌</span>}
                </div>
              </div>
            ) : (
              <div className="sh-preview-empty"><IconPointUp /> 鼠标悬停矩阵中的手牌</div>
            )}
          </div>

          <div className="sh-stats-panel">
            <div className="sh-stats-item">
              <span className="sh-stats-num" style={{ color: pos.color }}>{pos.range}</span>
              <span className="sh-stats-label">起手牌范围</span>
            </div>
            <div className="sh-stats-item">
              <span className="sh-stats-num">
                {pos.id === 'bb' ? '防守为主' : pos.id === 'sb' ? '紧凶' : pos.id === 'utg' || pos.id === 'utg1' ? '紧' : pos.id === 'mp' ? '适中偏紧' : pos.id === 'hj' ? '适中' : pos.id === 'co' ? '偏松' : '松'}
              </span>
              <span className="sh-stats-label">策略风格</span>
            </div>
            <div className="sh-stats-item">
              <span className="sh-stats-num">
                {pos.id === 'bb' || pos.id === 'sb' ? <span><IconWarning /> 盲注位</span> : pos.id === 'utg' ? '第1个' : pos.id === 'utg1' ? '第2个' : pos.id === 'mp' ? '第3-4个' : pos.id === 'hj' ? '第5个' : pos.id === 'co' ? '第6个' : '最后'}
              </span>
              <span className="sh-stats-label">行动顺序</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
