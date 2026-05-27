/* ═══════════════════════════════════════════════════════════
   App Shell — Hash Router + Top Nav + Module Container
   ═══════════════════════════════════════════════════════════ */

/* ── SEO Meta Map ── */
var SEO_META = {
  beginner:  { title: '入门指南 — 德州扑克资料站', desc: '5节渐进式课程从零了解德州扑克：游戏规则、牌型大小、下注策略、完整牌局演示。' },
  hands:     { title: '牌型大全 — 德州扑克资料站', desc: '9种牌型从皇家同花顺到高牌，含扑克牌可视化、对比示例、概率数据和常见误区。' },
  starthand: { title: '起手牌表 — 德州扑克资料站', desc: '169种起手牌组合的9人桌范围分析，按UTG到BB各位置展示加注/跟注/弃牌建议。' },
  position:  { title: '位置策略 — 德州扑克资料站', desc: '9人桌各位置详解：UTG到BTN的行动顺序、策略要点、推荐手牌范围。' },
  odds:      { title: '概率赔率 — 德州扑克资料站', desc: 'Outs计算器、底池赔率分析、常用概率速查表和四二法则，助你做出+EV决策。' },
  glossary:  { title: '术语词典 — 德州扑克资料站', desc: '88个德州扑克术语中英文对照，支持搜索和分类筛选，从All-in到价值下注全覆盖。' },
  quiz:      { title: '知识测验 — 德州扑克资料站', desc: '35道选择题覆盖入门、牌型、规则、策略、概率，即时判分+答案解析。' },
};

function updateSEOMeta(route) {
  var meta = SEO_META[route];
  if (!meta) {
    document.title = '德州扑克资料站 — 一站式学习平台';
    return;
  }
  document.title = meta.title;
  var descEl = document.querySelector('meta[name="description"]');
  if (descEl) descEl.setAttribute('content', meta.desc);
  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', meta.title);
  var ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', meta.desc);
  var twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', meta.title);
  var twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', meta.desc);
}

/* ── Simple Hash Router ── */
function useHashRouter() {
  var _s = React.useState(function() {
    return window.location.hash.replace('#/', '') || 'beginner';
  });
  var route = _s[0];
  var setRoute = _s[1];

  React.useEffect(function() {
    function onHashChange() {
      var newRoute = window.location.hash.replace('#/', '') || 'beginner';
      setRoute(newRoute);
      updateSEOMeta(newRoute);
    }
    window.addEventListener('hashchange', onHashChange);
    // Initial title set
    var initialRoute = window.location.hash.replace('#/', '') || 'beginner';
    updateSEOMeta(initialRoute);
    return function() { window.removeEventListener('hashchange', onHashChange); };
  }, []);

  var navigate = React.useCallback(function(target) {
    window.location.hash = '#/' + target;
  }, []);

  return [route, navigate];
}

/* ── Placeholder modules for not-yet-implemented routes ── */
function PlaceholderModule(_p) {
  var title = _p.title;
  var icon = _p.icon;
  var desc = _p.desc;
  return (
    <div className="module-placeholder">
      <div className="module-placeholder-inner">
        <span className="module-placeholder-icon">{React.createElement(NAV_ICONS[icon] || 'span')}</span>
        <h2>{title}</h2>
        <p>{desc}</p>
        <div className="module-placeholder-badge">即将上线</div>
      </div>
    </div>
  );
}

/* ── Module Registry ── */
var MODULES = {
  beginner:  { component: BeginnerModule, title: '入门指南' },
  hands:     { title: '牌型大全', icon: 'hands', desc: '9种牌型的详细介绍、对比工具和概率速查。' },
  starthand: { title: '起手牌表', icon: 'starthand', desc: '169种起手牌的胜率分析和位置修正。' },
  position:  { title: '位置策略', icon: 'position', desc: '9人桌位置详解与策略指南。' },
  odds:      { title: '概率赔率', icon: 'odds', desc: 'Outs计算器、底池赔率和常用概率速查。' },
  glossary:  { title: '术语词典', icon: 'glossary', desc: '80+个扑克术语中英文对照和释义。' },
  quiz:      { title: '知识测验', icon: 'quiz', desc: '30+道选择题，检验你的学习成果。' },
};

/* ── Module Loader ── */
function ModuleLoader(_p) {
  var route = _p.route;

  var mod = MODULES[route];
  if (!mod) {
    return (
      <div className="module-placeholder">
        <div className="module-placeholder-inner">
          <h2>页面未找到</h2>
          <p>请检查网址是否正确</p>
        </div>
      </div>
    );
  }

  // Load implemented modules
  if (route === 'beginner' && typeof BeginnerModule !== 'undefined') {
    return <BeginnerModule />;
  }
  if (route === 'hands' && typeof HandsModule !== 'undefined') {
    return <HandsModule />;
  }
  if (route === 'starthand' && typeof StartingHandsModule !== 'undefined') {
    return <StartingHandsModule />;
  }
  if (route === 'position' && typeof PositionModule !== 'undefined') {
    return <PositionModule />;
  }
  if (route === 'odds' && typeof OddsModule !== 'undefined') {
    return <OddsModule />;
  }
  if (route === 'glossary' && typeof GlossaryModule !== 'undefined') {
    return <GlossaryModule />;
  }
  if (route === 'quiz' && typeof QuizModule !== 'undefined') {
    return <QuizModule />;
  }

  // Future modules show placeholder
  return <PlaceholderModule title={mod.title} icon={mod.icon} desc={mod.desc} />;
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <span>{'♠♥'}</span>
          <span>德州扑克资料站</span>
        </div>
        <p className="site-footer-text">
          一个面向德州扑克爱好者的一站式学习平台。内容持续更新中。
        </p>
        <p className="site-footer-copy">
          © 2026 Texas Hold'em Guide · 仅供学习参考
        </p>
      </div>
    </footer>
  );
}

/* ── App ── */
function App() {
  var _r = useHashRouter();
  var route = _r[0];
  var navigate = _r[1];

  return (
    <div className="app-shell">
      <NavBar activeModule={route} onNavigate={navigate} />
      <main className="app-main">
        <ModuleLoader route={route} />
      </main>
      <Footer />
    </div>
  );
}

/* ── Mount ── */
var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
