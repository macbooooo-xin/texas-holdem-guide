/* ═══════════════════════════════════════════════════════════
   Module: Hands (牌型大全)
   ═══════════════════════════════════════════════════════════ */

/* ── Hand Ranking Data ── */
var HAND_RANKINGS = [
  {
    rank: 1, name: '皇家同花顺', eng: 'Royal Flush',
    cards: [{r:'A',s:'spades'},{r:'K',s:'spades'},{r:'Q',s:'spades'},{r:'J',s:'spades'},{r:'10',s:'spades'}],
    prob: '1 / 649,740', pct: '0.000154%',
    desc: '同一花色的 A-K-Q-J-10。扑克中最强的牌，拿到它几乎不可能输。',
    tip: '你一生中拿到皇家同花顺的概率比被闪电击中还低。',
  },
  {
    rank: 2, name: '同花顺', eng: 'Straight Flush',
    cards: [{r:'9',s:'hearts'},{r:'8',s:'hearts'},{r:'7',s:'hearts'},{r:'6',s:'hearts'},{r:'5',s:'hearts'}],
    prob: '1 / 72,193', pct: '0.00139%',
    desc: '同一花色且连续的五张牌。如果两人都有同花顺，数字大的赢。',
    tip: 'A-2-3-4-5 同花是最小的同花顺，也叫"钢轮"(Steel Wheel)。',
  },
  {
    rank: 3, name: '四条', eng: 'Four of a Kind',
    cards: [{r:'K',s:'spades'},{r:'K',s:'hearts'},{r:'K',s:'diamonds'},{r:'K',s:'clubs'},{r:'A',s:'spades'}],
    prob: '1 / 4,165', pct: '0.0240%',
    desc: '四张相同数字的牌。四条之间比数字大小；四条相同则比第5张牌（踢脚）。',
    tip: '四条在电影里经常出现，现实中你可能玩几千局才见到一次。',
  },
  {
    rank: 4, name: '葫芦', eng: 'Full House',
    cards: [{r:'K',s:'spades'},{r:'K',s:'hearts'},{r:'K',s:'diamonds'},{r:'5',s:'hearts'},{r:'5',s:'clubs'}],
    prob: '1 / 694', pct: '0.144%',
    desc: '三条 + 一对的组合。先比三条的大小，三张相同时再比对子。',
    tip: '葫芦是你在实际游戏中能见到的最强的"常见"牌型。',
  },
  {
    rank: 5, name: '同花', eng: 'Flush',
    cards: [{r:'A',s:'diamonds'},{r:'J',s:'diamonds'},{r:'8',s:'diamonds'},{r:'5',s:'diamonds'},{r:'3',s:'diamonds'}],
    prob: '1 / 509', pct: '0.197%',
    desc: '五张同一花色但不连续的牌。比大小时从最大的一张开始往下比。',
    tip: '同花看起来漂亮，但要注意：顺子虽然更"整齐"，但同花实际上比顺子大！',
  },
  {
    rank: 6, name: '顺子', eng: 'Straight',
    cards: [{r:'10',s:'spades'},{r:'9',s:'hearts'},{r:'8',s:'diamonds'},{r:'7',s:'clubs'},{r:'6',s:'spades'}],
    prob: '1 / 255', pct: '0.392%',
    desc: '五张连续数字的牌，花色不同。A 可作最大(A-K-Q-J-10)或最小(5-4-3-2-A)。',
    tip: '同花比顺子大！这是新手最容易搞错的地方——花色的稀有度高于连续性。',
  },
  {
    rank: 7, name: '三条', eng: 'Three of a Kind',
    cards: [{r:'8',s:'spades'},{r:'8',s:'hearts'},{r:'8',s:'diamonds'},{r:'K',s:'clubs'},{r:'2',s:'spades'}],
    prob: '1 / 47', pct: '2.11%',
    desc: '三张相同数字的牌。先比三条数字，相同则比另外两张中最大的一张。',
    tip: '三条出现频率明显高于之前的牌型，你平均每 47 手牌就能拿到一次。',
  },
  {
    rank: 8, name: '两对', eng: 'Two Pair',
    cards: [{r:'A',s:'spades'},{r:'A',s:'hearts'},{r:'9',s:'diamonds'},{r:'9',s:'clubs'},{r:'K',s:'spades'}],
    prob: '1 / 21', pct: '4.75%',
    desc: '两个对子。先比大对，再比小对，最后比第5张踢脚。',
    tip: '两对是常见的"还不错"牌型，但要注意公共牌可能让对手组成更大的两对。',
  },
  {
    rank: 9, name: '一对', eng: 'One Pair',
    cards: [{r:'J',s:'spades'},{r:'J',s:'hearts'},{r:'A',s:'diamonds'},{r:'7',s:'clubs'},{r:'3',s:'spades'}],
    prob: '1 / 2.4', pct: '42.3%',
    desc: '一个对子。先比对子大小，一样大再比踢脚牌中最大的一张。',
    tip: '拿到一对的概率接近一半，但仅凭一对能赢下底池的情况并不常见。',
  },
  {
    rank: 10, name: '高牌', eng: 'High Card',
    cards: [{r:'A',s:'spades'},{r:'J',s:'hearts'},{r:'8',s:'diamonds'},{r:'5',s:'clubs'},{r:'3',s:'spades'}],
    prob: '1 / 2', pct: '50.1%',
    desc: '以上牌型都没有。单纯比五张中最大的一张。在德州扑克中几乎不可能靠高牌赢摊牌。',
    tip: '如果你经常需要靠高牌摊牌，说明你的起手牌选择出了问题。',
  },
];

/* ── Comparison Data ── */
var COMPARE_EXAMPLES = [
  {
    title: '同花 vs 顺子 — 谁大？',
    handA: { label: '同花 (Flush)', cards: [{r:'A',s:'diamonds'},{r:'J',s:'diamonds'},{r:'8',s:'diamonds'},{r:'5',s:'diamonds'},{r:'3',s:'diamonds'}] },
    handB: { label: '顺子 (Straight)', cards: [{r:'10',s:'spades'},{r:'9',s:'hearts'},{r:'8',s:'clubs'},{r:'7',s:'diamonds'},{r:'6',s:'hearts'}] },
    winner: 'A',
    explain: '同花比顺子大！虽然顺子看起来更"整齐"，但同花的出现概率更低（1/509 vs 1/255），所以同花等级更高。',
  },
  {
    title: '葫芦 vs 同花 — 谁大？',
    handA: { label: '葫芦 (Full House)', cards: [{r:'K',s:'spades'},{r:'K',s:'hearts'},{r:'K',s:'diamonds'},{r:'5',s:'clubs'},{r:'5',s:'spades'}] },
    handB: { label: '同花 (Flush)', cards: [{r:'A',s:'hearts'},{r:'Q',s:'hearts'},{r:'10',s:'hearts'},{r:'7',s:'hearts'},{r:'2',s:'hearts'}] },
    winner: 'A',
    explain: '葫芦比同花大。三条+一对的组合比五张同花更稀有（1/694 vs 1/509）。',
  },
  {
    title: '两对 vs 两对 — 踢脚决胜',
    handA: { label: 'A-A-9-9-K', cards: [{r:'A',s:'spades'},{r:'A',s:'hearts'},{r:'9',s:'diamonds'},{r:'9',s:'clubs'},{r:'K',s:'spades'}] },
    handB: { label: 'A-A-9-9-7', cards: [{r:'A',s:'diamonds'},{r:'A',s:'clubs'},{r:'9',s:'spades'},{r:'9',s:'hearts'},{r:'7',s:'diamonds'}] },
    winner: 'A',
    explain: '双方都是 A 和 9 的两对，但左边第5张是 K，右边是 7，K > 7，左边赢。这就是"踢脚牌"的作用。',
  },
];

/* ── Hands Module ── */
function HandsModule() {
  var _t = React.useState('rankings');
  var tab = _t[0];
  var setTab = _t[1];

  return (
    <div className="module-hands">
      <div className="module-page-header">
        <h1 className="module-page-title">{'\u{1F451}'} 牌型大全</h1>
        <p className="module-page-subtitle">9种牌型从强到弱，配扑克牌可视化和概率数据</p>
      </div>

      {/* Tab Bar */}
      <div className="hands-tabs">
        <button className={'hands-tab' + (tab === 'rankings' ? ' active' : '')} onClick={function() { setTab('rankings'); }}>
          排名总览
        </button>
        <button className={'hands-tab' + (tab === 'compare' ? ' active' : '')} onClick={function() { setTab('compare'); }}>
          对比示例
        </button>
        <button className={'hands-tab' + (tab === 'tips' ? ' active' : '')} onClick={function() { setTab('tips'); }}>
          常见误区
        </button>
      </div>

      {/* Tab: Rankings */}
      {tab === 'rankings' && (
        <div className="hands-rankings">
          {HAND_RANKINGS.map(function(hand) {
            return (
              <div key={hand.rank} className="hand-card">
                <div className="hand-card-rank">
                  <span className="hand-card-rank-num">#{hand.rank}</span>
                  <span className="hand-card-prob">{hand.prob}</span>
                </div>
                <div className="hand-card-main">
                  <div className="hand-card-header">
                    <h3 className="hand-card-name">{hand.name}</h3>
                    <span className="hand-card-eng">{hand.eng}</span>
                  </div>
                  <div className="hand-card-cards">
                    <CardRow cards={hand.cards} size="table" />
                  </div>
                  <p className="hand-card-desc">{hand.desc}</p>
                  <div className="hand-card-tip">{'\u{1F4A1}'} {hand.tip}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Compare */}
      {tab === 'compare' && (
        <div className="hands-compare">
          {COMPARE_EXAMPLES.map(function(ex, i) {
            return (
              <div key={i} className="compare-card">
                <h3 className="compare-title">{ex.title}</h3>
                <div className="compare-hands">
                  <div className={'compare-hand' + (ex.winner === 'A' ? ' winner' : '')}>
                    <div className="compare-hand-label">{ex.handA.label}</div>
                    <CardRow cards={ex.handA.cards} size="table" />
                    {ex.winner === 'A' && <div className="compare-badge">胜</div>}
                  </div>
                  <div className="compare-vs">VS</div>
                  <div className={'compare-hand' + (ex.winner === 'B' ? ' winner' : '')}>
                    <div className="compare-hand-label">{ex.handB.label}</div>
                    <CardRow cards={ex.handB.cards} size="table" />
                    {ex.winner === 'B' && <div className="compare-badge">胜</div>}
                  </div>
                </div>
                <p className="compare-explain">{ex.explain}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Tips */}
      {tab === 'tips' && (
        <div className="hands-tips">
          <div className="tips-list">
            <div className="tip-card">
              <h4>{'\u{274C}'} 误区一：顺子比同花大</h4>
              <p>很多人觉得"顺子"听起来更厉害，但同花（同一花色）的出现概率更低，因此<strong>同花比顺子大</strong>。</p>
              <p className="tip-remember">记忆口诀：同花顺 → 四条 → 葫芦 → <strong>同花 → 顺子</strong> → 三条 → 两对 → 一对 → 高牌</p>
            </div>
            <div className="tip-card">
              <h4>{'\u{274C}'} 误区二：A-2-3-4-5 不是顺子</h4>
              <p>A 既可以作为最大的牌（A-K-Q-J-10），也可以作为最小的牌（5-4-3-2-A）。后者被称为 <strong>"Wheel"（轮子）</strong>，是完全合法的顺子。</p>
              <p className="tip-remember">但注意：K-A-2-3-4 不是顺子，A 不能"绕一圈"连接 K 和 2。</p>
            </div>
            <div className="tip-card">
              <h4>{'\u{274C}'} 误区三：牌型相同就平分</h4>
              <p>牌型相同时，需要<strong>逐个比较</strong>牌的大小。例如两人都有两对，先比大对子、再比小对子、最后比踢脚牌。</p>
              <p className="tip-remember">踢脚牌（Kicker）经常决定胜负，别忽略它！</p>
            </div>
            <div className="tip-card">
              <h4>{'\u{274C}'} 误区四：手上有对子就很大</h4>
              <p>一对是最常见的牌型之一，出现概率高达 42%。但对手也可能有一对，而且对子比你大。</p>
              <p className="tip-remember">手里有一对小牌（如 2-2）时，翻牌后如果没有中三条，通常应该谨慎行事。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
