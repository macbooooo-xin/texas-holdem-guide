/* ═══════════════════════════════════════════════════════════
   NavBar — Top navigation bar
   ═══════════════════════════════════════════════════════════ */
var NAV_ITEMS = [
  { id: 'beginner',  label: '入门指南', icon: '📖' },
  { id: 'hands',     label: '牌型大全', icon: '👑' },
  { id: 'starthand', label: '起手牌表', icon: '🂡' },
  { id: 'position',  label: '位置策略', icon: '📍' },
  { id: 'odds',      label: '概率赔率', icon: '🎯' },
  { id: 'glossary',  label: '术语词典', icon: '📝' },
  { id: 'quiz',      label: '知识测验', icon: '✅' },
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

        <nav className={'navbar-links' + (menuOpen ? ' open' : '')}>
          {NAV_ITEMS.map(function(item) {
            var isActive = activeModule === item.id;
            return (
              <a
                key={item.id}
                className={'navbar-link' + (isActive ? ' active' : '')}
                href={'#/' + item.id}
                onClick={function(e) { e.preventDefault(); onNavigate(item.id); setMenuOpen(false); }}
              >
                <span className="navbar-link-icon">{item.icon}</span>
                <span className="navbar-link-label">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
