/* ═══════════════════════════════════════════════════════════
   NavBar — Top navigation bar
   ═══════════════════════════════════════════════════════════ */
var NAV_ITEMS = [
  { id: 'beginner',  label: '入门指南', icon: 'beginner' },
  { id: 'hands',     label: '牌型大全', icon: 'hands' },
  { id: 'starthand', label: '起手牌表', icon: 'starthand' },
  { id: 'position',  label: '位置策略', icon: 'position' },
  { id: 'odds',      label: '概率赔率', icon: 'odds' },
  { id: 'glossary',  label: '术语词典', icon: 'glossary' },
  { id: 'quiz',      label: '知识测验', icon: 'quiz' },
];

function NavBar({ activeModule, onNavigate }) {
  var _s = React.useState(false);
  var menuOpen = _s[0];
  var setMenuOpen = _s[1];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a className="navbar-brand" href="#/beginner" onClick={function(e) { e.preventDefault(); onNavigate('beginner'); }}>
          <span className="navbar-logo">{'♠♥'}</span>
          <span className="navbar-title">德州扑克资料站</span>
        </a>

        <button
          className={'navbar-toggle' + (menuOpen ? ' open' : '')}
          onClick={function() { setMenuOpen(function(v) { return !v; }); }}
          aria-label="菜单"
        >
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
        </button>

        <nav className={'navbar-links' + (menuOpen ? ' open' : '')} aria-label="主导航">
          {NAV_ITEMS.map(function(item) {
            var isActive = activeModule === item.id;
            return (
              <a
                key={item.id}
                className={'navbar-link' + (isActive ? ' active' : '')}
                href={'#/' + item.id}
                onClick={function(e) { e.preventDefault(); onNavigate(item.id); setMenuOpen(false); }}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
              >
                <span className="navbar-link-icon" aria-hidden="true">{React.createElement(NAV_ICONS[item.icon])}</span>
                <span className="navbar-link-label">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
