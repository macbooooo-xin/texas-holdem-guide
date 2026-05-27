/* ═══════════════════════════════════════════════════════════
   Module: Position Strategy (位置策略)
   ═══════════════════════════════════════════════════════════ */

var POSITIONS = [
  { id: 'btn',  label: 'BTN', name: '庄家 (Button)',        x: 62, y: 82, desc: '全场最佳位置。每局最后行动，能看到所有人决策后再做决定。可以玩最宽的手牌范围，也是诈唬的最佳位置。', range: '40-50% 起手牌', tip: '庄位是德州扑克中最赚钱的位置，利用位置优势多打底池。' },
  { id: 'sb',   label: 'SB',  name: '小盲 (Small Blind)',   x: 46, y: 58, desc: '翻牌后第一个行动，全场最差位置。被迫投入小盲注，且后续每轮都先行动，信息最不充分。', range: '10-15% 起手牌', tip: '小盲位只玩最强牌，不要因为"已经投入了盲注"而跟注边缘牌。' },
  { id: 'bb',   label: 'BB',  name: '大盲 (Big Blind)',     x: 78, y: 58, desc: '翻牌前最后行动（可过牌或加注），但翻牌后第二个行动。位置稍好于小盲，但仍处于劣势。', range: '15-25% 起手牌', tip: '大盲位有"防守"义务——当有人加注时，你可以用更宽的范围跟注，因为已经投入了大盲注。' },
  { id: 'utg',  label: 'UTG', name: '枪口 (Under the Gun)', x: 15, y: 20, desc: '翻牌前第一个行动。没有任何信息，必须用最强的手牌开局。这是全场第二差的位置。', range: '8-12% 起手牌', tip: 'UTG 位只玩顶级牌（如 AA/KK/QQ/AK），不要在中位之前玩投机牌。' },
  { id: 'utg1', label: 'UTG+1', name: '枪口+1',             x: 32, y: 5,  desc: '比 UTG 稍好一点，但仍在前位置。翻牌前第二个行动，手牌范围可以略宽于 UTG。', range: '10-15% 起手牌', tip: 'UTG+1 可以加入 AQ、JJ 等牌，但仍需谨慎。' },
  { id: 'mp',   label: 'MP',  name: '中位 (Middle Position)', x: 50, y: 2, desc: '中间位置，行动顺序居中。可以开始放宽手牌范围，但要注意后面还有玩家可能加注。', range: '15-20% 起手牌', tip: '中位可以开始玩一些同花连牌和中等对子，利用翻牌后的信息做决策。' },
  { id: 'hj',   label: 'HJ',  name: '劫位 (Hijack)',        x: 70, y: 5,  desc: '劫持位，倒数第三个行动。可以"劫持"CO 和 BTN 的加注权。手牌范围可以显著放宽。', range: '20-28% 起手牌', tip: 'HJ 是第一个可以开始"偷盲"的位置——如果前面没人加注，你可以用较宽的范围加注。' },
  { id: 'co',   label: 'CO',  name: '关煞 (Cutoff)',        x: 88, y: 20, desc: '庄家右边，倒数第二个行动。这是除庄位外最好的位置。翻牌后有位置优势，可以玩很多手牌。', range: '25-35% 起手牌', tip: 'CO 位是"偷盲"的黄金位置——如果 BTN 弃牌，你就成了实际上的庄家。' },
  { id: 'sb2',  label: 'SB',  name: '小盲 (位置示意)',      x: 53, y: 88, desc: null },
];

/* Simplified position diagram coords (percentage-based within the table) */
var SEAT_COORDS = [
  { id: 'utg',  x: 14, y: 22 },
  { id: 'utg1', x: 30, y: 6  },
  { id: 'mp',   x: 50, y: 2  },
  { id: 'hj',   x: 70, y: 6  },
  { id: 'co',   x: 86, y: 22 },
  { id: 'btn',  x: 60, y: 80 },
  { id: 'sb',   x: 40, y: 80 },
  { id: 'bb',   x: 20, y: 70 },
];

var POSITION_MAP = {};
POSITIONS.forEach(function(p) { POSITION_MAP[p.id] = p; });

function PositionModule() {
  var _s = React.useState(null);
  var selected = _s[0];
  var setSelected = _s[1];

  var selData = selected ? POSITION_MAP[selected] : null;

  return (
    <div className="module-position">
      <div className="module-page-header">
        <h1 className="module-page-title"><IconPin /> 位置策略</h1>
        <p className="module-page-subtitle">9人桌完整位置图 · 点击座位查看详细策略</p>
      </div>

      <div className="pos-layout">
        {/* Table Diagram */}
        <div className="pos-diagram">
          <div className="pos-table">
            <div className="pos-felt">
              {/* Community card area marker */}
              <div className="pos-community-marker" />

              {/* Seats */}
              {SEAT_COORDS.map(function(seat) {
                var pos = POSITION_MAP[seat.id];
                var isActive = selected === seat.id;
                return (
                  <button
                    key={seat.id}
                    className={'pos-seat' + (isActive ? ' active' : '')}
                    style={{ left: seat.x + '%', top: seat.y + '%' }}
                    onClick={function() { setSelected(isActive ? null : seat.id); }}
                    title={pos.name}
                  >
                    <span className="pos-seat-dot" />
                    <span className="pos-seat-label">{pos.label}</span>
                  </button>
                );
              })}

              {/* Center label */}
              <div className="pos-center-label">点击座位{'\u{2191}'}</div>
            </div>
          </div>

          {/* Action order legend */}
          <div className="pos-action-order">
            <h4>翻牌前行顺序</h4>
            <div className="pos-order-flow">
              {['UTG','UTG+1','MP','HJ','CO','BTN','SB','BB'].map(function(label, i) {
                return (
                  <span key={label} className="pos-order-item">
                    <span className="pos-order-num">{i + 1}</span>
                    {label}
                    {i < 7 && <span className="pos-order-arrow">{'\u{2192}'}</span>}
                  </span>
                );
              })}
            </div>
            <p className="pos-order-note">翻牌后顺序：SB {'\u{2192}'} BB {'\u{2192}'} UTG {'\u{2192}'} ... {'\u{2192}'} BTN（庄家最后）</p>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="pos-detail">
          {selData ? (
            <div className="pos-detail-card">
              <div className="pos-detail-header">
                <span className="pos-detail-badge">{selData.label}</span>
                <h3>{selData.name}</h3>
              </div>
              <p className="pos-detail-desc">{selData.desc}</p>
              <div className="pos-detail-stats">
                <div className="pos-stat">
                  <span className="pos-stat-label">推荐范围</span>
                  <span className="pos-stat-val">{selData.range}</span>
                </div>
              </div>
              <div className="pos-detail-tip">
                <strong><IconBulb /> 策略提示：</strong>
                {selData.tip}
              </div>
            </div>
          ) : (
            <div className="pos-detail-empty">
              <span className="pos-detail-empty-icon"><IconPointUp /></span>
              <p>点击左侧座位图中的任意位置<br />查看详细策略</p>
            </div>
          )}

          {/* Position ranking summary */}
          <div className="pos-ranking">
            <h4>位置强度排名（从强到弱）</h4>
            <div className="pos-ranking-list">
              {[
                { label: 'BTN',  name: '庄家',      cls: 'tier-s' },
                { label: 'CO',   name: '关煞位',    cls: 'tier-s' },
                { label: 'HJ',   name: '劫持位',    cls: 'tier-a' },
                { label: 'MP',   name: '中位',      cls: 'tier-b' },
                { label: 'UTG+1',name: '枪口+1',    cls: 'tier-c' },
                { label: 'UTG',  name: '枪口',      cls: 'tier-c' },
                { label: 'BB',   name: '大盲注',    cls: 'tier-d' },
                { label: 'SB',   name: '小盲注',    cls: 'tier-d' },
              ].map(function(item) {
                return (
                  <div key={item.label} className={'pos-rank-item ' + item.cls}>
                    <span className="pos-rank-badge">{item.label}</span>
                    <span className="pos-rank-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
