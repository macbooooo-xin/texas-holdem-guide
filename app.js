/* ═══════════════════════════════════════════════════════════
   App Shell — Hash Router + Top Nav + Module Container
   ═══════════════════════════════════════════════════════════ */

/* ── Simple Hash Router ── */
function useHashRouter() {
  var _s = React.useState(function() {
    return window.location.hash.replace('#/', '') || 'beginner';
  });
  var route = _s[0];
  var setRoute = _s[1];

  React.useEffect(function() {
    function onHashChange() {
      setRoute(window.location.hash.replace('#/', '') || 'beginner');
    }
    window.addEventListener('hashchange', onHashChange);
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
        <span className="module-placeholder-icon">{icon}</span>
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
  hands:     { title: '牌型大全', icon: '\u{1F451}', desc: '9种牌型的详细介绍、对比工具和概率速查。' },
  starthand: { title: '起手牌表', icon: '\u{1F0A1}', desc: '169种起手牌的胜率分析和位置修正。' },
  position:  { title: '位置策略', icon: '\u{1F4CD}', desc: '9人桌位置详解与策略指南。' },
  odds:      { title: '概率赔率', icon: '\u{1F3AF}', desc: 'Outs计算器、底池赔率和常用概率速查。' },
  glossary:  { title: '术语词典', icon: '\u{1F4DD}', desc: '80+个扑克术语中英文对照和释义。' },
  quiz:      { title: '知识测验', icon: '\u{2705}', desc: '30+道选择题，检验你的学习成果。' },
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
