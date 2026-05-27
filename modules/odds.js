/* ═══════════════════════════════════════════════════════════
   Module: Odds & Probability (概率与赔率)
   ═══════════════════════════════════════════════════════════ */

/* ── Common Probability Table ── */
var PROB_TABLE = [
  { situation: '口袋对子 → 翻牌中三条', prob: '12%', odds: '1 : 7.5', desc: '手里有对子时，翻牌击中三条的概率。' },
  { situation: '两张同花 → 翻牌中同花', prob: '0.8%', odds: '1 : 118', desc: '翻牌直接成同花的概率极低。' },
  { situation: '两张同花 → 翻牌听同花', prob: '11%', odds: '1 : 8.1', desc: '翻牌有两张同花听牌的概率。' },
  { situation: '听同花 → 转牌/河牌成牌', prob: '35%', odds: '1 : 1.9', desc: '翻牌听同花后，到河牌成牌的总概率。' },
  { situation: '两张连牌 → 翻牌听顺子', prob: '10%', odds: '1 : 9', desc: '手里有连牌（如 J-10），翻牌听两头顺的概率。' },
  { situation: '听两头顺 → 转牌/河牌成牌', prob: '32%', odds: '1 : 2.1', desc: '翻牌听两头顺后，到河牌成牌的总概率。' },
  { situation: '听卡顺 → 转牌成牌', prob: '8.5%', odds: '1 : 10.8', desc: '翻牌听卡顺（如 8-9-J-Q 需要 10），单轮成牌概率。' },
  { situation: '任意两张 → 翻牌至少一对', prob: '32%', odds: '1 : 2.1', desc: '任意起手牌在翻牌击中至少一对的概率。' },
  { situation: '口袋对子 → 翻牌中四条', prob: '0.25%', odds: '1 : 407', desc: '手里有对子时，翻牌击中四条的概率（极低）。' },
  { situation: 'A-K → 翻牌至少一对', prob: '32%', odds: '1 : 2.1', desc: 'AK 在翻牌至少击中一对（A或K）的概率。' },
];

/* ── Rule of 4 and 2 ── */
function ruleOf4And2(outs, streets) {
  if (streets === 2) return Math.min(outs * 4, 99);
  return Math.min(outs * 2, 99);
}

/* ── Predefined Scenarios for Outs Calculator ── */
var OUTS_SCENARIOS = [
  {
    label: '听同花', outs: 9, hand: [{r:'A',s:'hearts'},{r:'K',s:'hearts'}],
    board: [{r:'Q',s:'hearts'},{r:'7',s:'hearts'},{r:'2',s:'spades'}],
    desc: '你有4张红心，还需要1张红心完成同花。剩余9张红心是 Outs。',
  },
  {
    label: '听两头顺', outs: 8, hand: [{r:'J',s:'spades'},{r:'10',s:'hearts'}],
    board: [{r:'9',s:'diamonds'},{r:'8',s:'clubs'},{r:'2',s:'hearts'}],
    desc: '你需要一张 Q 或一张 7 完成顺子。4张Q + 4张7 = 8个 Outs。',
  },
  {
    label: '听卡顺', outs: 4, hand: [{r:'8',s:'spades'},{r:'7',s:'hearts'}],
    board: [{r:'10',s:'diamonds'},{r:'9',s:'clubs'},{r:'2',s:'hearts'}],
    desc: '只有一张 J 能让你完成顺子。4张 J = 4个 Outs。概率比两头顺低一半。',
  },
  {
    label: '一对 → 三条/两对', outs: 5, hand: [{r:'A',s:'spades'},{r:'K',s:'hearts'}],
    board: [{r:'A',s:'diamonds'},{r:'7',s:'clubs'},{r:'2',s:'hearts'}],
    desc: '你有顶对A。2张A（三条）+ 3张K（两对）= 5个 Outs 可以改善牌力。',
  },
  {
    label: '同花顺双听', outs: 15, hand: [{r:'J',s:'hearts'},{r:'10',s:'hearts'}],
    board: [{r:'Q',s:'hearts'},{r:'9',s:'hearts'},{r:'2',s:'spades'}],
    desc: '同时听同花和顺子！9张红心(同花) + 6张顺子牌(非红心的8和K) = 15 Outs。这是最强听牌。',
  },
];

/* ── Odds Module ── */
function OddsModule() {
  var _t = React.useState('outs');
  var tab = _t[0];
  var setTab = _t[1];

  return (
    <div className="module-odds">
      <div className="module-page-header">
        <h1 className="module-page-title"><IconTarget /> 概率与赔率</h1>
        <p className="module-page-subtitle">Outs 计算 · 底池赔率 · 常用概率速查 · 四二法则</p>
      </div>

      {/* Tabs */}
      <div className="hands-tabs">
        <button className={'hands-tab' + (tab === 'outs' ? ' active' : '')} onClick={function() { setTab('outs'); }}>Outs 计算器</button>
        <button className={'hands-tab' + (tab === 'potodds' ? ' active' : '')} onClick={function() { setTab('potodds'); }}>底池赔率</button>
        <button className={'hands-tab' + (tab === 'table' ? ' active' : '')} onClick={function() { setTab('table'); }}>概率速查表</button>
        <button className={'hands-tab' + (tab === 'rule42' ? ' active' : '')} onClick={function() { setTab('rule42'); }}>四二法则</button>
      </div>

      {/* Tab: Outs Calculator */}
      {tab === 'outs' && <OutsCalculator />}

      {/* Tab: Pot Odds */}
      {tab === 'potodds' && <PotOddsCalculator />}

      {/* Tab: Probability Table */}
      {tab === 'table' && (
        <div className="odds-table-wrap">
          <table className="odds-table">
            <thead>
              <tr>
                <th>场景</th>
                <th>概率</th>
                <th>赔率</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {PROB_TABLE.map(function(row, i) {
                return (
                  <tr key={i}>
                    <td className="odds-td-scene">{row.situation}</td>
                    <td className="odds-td-num">{row.prob}</td>
                    <td className="odds-td-num">{row.odds}</td>
                    <td className="odds-td-desc">{row.desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Rule of 4 and 2 */}
      {tab === 'rule42' && <RuleOf42 />}
    </div>
  );
}

/* ── Outs Calculator Component ── */
function OutsCalculator() {
  var _sc = React.useState(0);
  var scenarioIdx = _sc[0];
  var setScenarioIdx = _sc[1];

  var _os = React.useState(null);
  var customOuts = _os[0];
  var setCustomOuts = _os[1];

  var sc = OUTS_SCENARIOS[scenarioIdx];
  var outs = customOuts !== null ? customOuts : sc.outs;

  return (
    <div className="odds-calc">
      {/* Scenario Selector */}
      <div className="odds-scenarios">
        {OUTS_SCENARIOS.map(function(s, i) {
          return (
            <button
              key={i}
              className={'odds-scenario-btn' + (scenarioIdx === i ? ' active' : '')}
              onClick={function() { setScenarioIdx(i); setCustomOuts(null); }}
            >
              <span className="odds-scenario-label">{s.label}</span>
              <span className="odds-scenario-outs">{s.outs} Outs</span>
            </button>
          );
        })}
      </div>

      {/* Scenario detail */}
      <div className="odds-scenario-detail">
        <div className="odds-scenario-cards">
          <div className="odds-card-group">
            <span className="odds-card-group-label">你的手牌</span>
            <div className="pcard-row">
              {sc.hand.map(function(c, i) { return <PlayingCard key={i} rank={c.r} suit={c.s} size="table" />; })}
            </div>
          </div>
          <div className="odds-card-group">
            <span className="odds-card-group-label">公共牌</span>
            <div className="pcard-row">
              {sc.board.map(function(c, i) { return <PlayingCard key={i} rank={c.r} suit={c.s} size="table" />; })}
              {Array.from({ length: 5 - sc.board.length }).map(function(_, i) {
                return <div key={'empty-' + i} className="pt-empty-slot" style={{ width: 60, height: 86 }} />;
              })}
            </div>
          </div>
        </div>
        <p className="odds-scenario-desc">{sc.desc}</p>
      </div>

      {/* Outs input */}
      <div className="odds-outs-input">
        <label>Outs 数量：</label>
        <input
          type="range"
          min="1" max="25" value={outs}
          onChange={function(e) { setCustomOuts(parseInt(e.target.value)); setScenarioIdx(-1); }}
          className="odds-slider"
        />
        <span className="odds-outs-val">{outs}</span>
      </div>

      {/* Results */}
      <div className="odds-results">
        <div className="odds-result-card">
          <div className="odds-result-label">转牌成牌概率</div>
          <div className="odds-result-num">{Math.round(outs / 47 * 100)}%</div>
          <div className="odds-result-odds">赔率 1 : {Math.round(47 / outs - 1)}</div>
        </div>
        <div className="odds-result-card">
          <div className="odds-result-label">转牌或河牌成牌</div>
          <div className="odds-result-num">{Math.round((1 - (47-outs)/47 * (46-outs)/46) * 100)}%</div>
          <div className="odds-result-odds">约 {ruleOf4And2(outs, 2)}%（四二法则）</div>
        </div>
      </div>
    </div>
  );
}

/* ── Pot Odds Calculator ── */
function PotOddsCalculator() {
  var _p = React.useState(1000);
  var pot = _p[0];
  var setPot = _p[1];

  var _b = React.useState(300);
  var bet = _b[0];
  var setBet = _b[1];

  var callAmount = bet;
  var totalAfterCall = pot + bet + callAmount;
  var potOdds = callAmount / totalAfterCall;
  var neededEquity = Math.round(potOdds * 100);

  var _e = React.useState(35);
  var equity = _e[0];
  var setEquity = _e[1];

  var isProfitable = equity >= neededEquity;

  return (
    <div className="odds-calc">
      <div className="potodds-form">
        <div className="potodds-field">
          <label>底池大小</label>
          <div className="potodds-input-row">
            <input type="range" min="100" max="10000" step="100" value={pot} onChange={function(e) { setPot(parseInt(e.target.value)); }} className="odds-slider" />
            <span className="potodds-val">{pot}</span>
          </div>
        </div>
        <div className="potodds-field">
          <label>对手下注</label>
          <div className="potodds-input-row">
            <input type="range" min="50" max={pot} step="50" value={bet} onChange={function(e) { setBet(parseInt(e.target.value)); }} className="odds-slider" />
            <span className="potodds-val">{bet}</span>
          </div>
        </div>
        <div className="potodds-field">
          <label>你的预估胜率 (%)</label>
          <div className="potodds-input-row">
            <input type="range" min="0" max="100" step="1" value={equity} onChange={function(e) { setEquity(parseInt(e.target.value)); }} className="odds-slider" />
            <span className="potodds-val">{equity}%</span>
          </div>
        </div>
      </div>

      <div className="potodds-result">
        <div className="potodds-summary">
          <div className="potodds-row">
            <span>你需要跟注</span>
            <strong>{callAmount}</strong>
          </div>
          <div className="potodds-row">
            <span>跟注后总底池</span>
            <strong>{totalAfterCall}</strong>
          </div>
          <div className="potodds-row">
            <span>所需最低胜率</span>
            <strong>{neededEquity}%</strong>
          </div>
          <div className={'potodds-verdict ' + (isProfitable ? 'good' : 'bad')}>
            {isProfitable ? <span><IconCheck /> 值得跟注</span> : <span><IconCross /> 应该弃牌</span>}
            <span className="potodds-verdict-reason">
              {isProfitable
                ? '（你的胜率 ' + equity + '% ≥ 所需 ' + neededEquity + '%）'
                : '（你的胜率 ' + equity + '% < 所需 ' + neededEquity + '%）'}
            </span>
          </div>
        </div>
      </div>

      <div className="potodds-explain">
        <p><strong>公式：</strong>所需胜率 = 跟注额 ÷ (当前底池 + 对手下注 + 跟注额)</p>
        <p>{callAmount} ÷ ({pot} + {bet} + {callAmount}) = <strong>{neededEquity}%</strong></p>
        <p>只有当你的预估胜率 ≥ {neededEquity}% 时，跟注才是有利可图的。</p>
      </div>
    </div>
  );
}

/* ── Rule of 4 and 2 ── */
function RuleOf42() {
  var _o = React.useState(9);
  var outs = _o[0];
  var setOuts = _o[1];

  return (
    <div className="odds-calc">
      <div className="rule42-intro">
        <h3>四二法则 — 快速计算胜率</h3>
        <p>在牌桌上不可能用计算器，但可以用这个简便方法心算胜率：</p>
      </div>

      <div className="rule42-cards">
        <div className="rule42-card">
          <div className="rule42-card-title">翻牌后（还有2张牌）</div>
          <div className="rule42-card-formula">Outs × 4 ≈ 胜率</div>
          <div className="rule42-card-example">9 Outs × 4 = 36% 胜率</div>
        </div>
        <div className="rule42-card">
          <div className="rule42-card-title">转牌后（还有1张牌）</div>
          <div className="rule42-card-formula">Outs × 2 ≈ 胜率</div>
          <div className="rule42-card-example">9 Outs × 2 = 18% 胜率</div>
        </div>
      </div>

      <div className="rule42-note">
        <p><strong>注意：</strong>当 Outs 超过 8 个时，四二法则会稍微高估胜率。更精确的公式是：翻牌后胜率 ≈ Outs × 4 - (Outs - 8)，当 Outs {'>'} 8 时。</p>
      </div>

      <div className="odds-outs-input" style={{ marginTop: 24 }}>
        <label>试试看 — 调整 Outs：</label>
        <input type="range" min="1" max="25" value={outs} onChange={function(e) { setOuts(parseInt(e.target.value)); }} className="odds-slider" />
        <span className="odds-outs-val">{outs}</span>
      </div>

      <div className="odds-results">
        <div className="odds-result-card">
          <div className="odds-result-label">翻牌后（×4）</div>
          <div className="odds-result-num">{ruleOf4And2(outs, 2)}%</div>
          <div className="odds-result-odds">精确值约 {Math.round((1 - (47-outs)/47 * (46-outs)/46) * 100)}%</div>
        </div>
        <div className="odds-result-card">
          <div className="odds-result-label">转牌后（×2）</div>
          <div className="odds-result-num">{ruleOf4And2(outs, 1)}%</div>
          <div className="odds-result-odds">精确值约 {Math.round(outs / 46 * 100)}%</div>
        </div>
      </div>
    </div>
  );
}
