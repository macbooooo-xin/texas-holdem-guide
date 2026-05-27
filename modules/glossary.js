/* ═══════════════════════════════════════════════════════════
   Module: Glossary (术语词典)
   ═══════════════════════════════════════════════════════════ */

function GlossaryModule() {
  var _q = React.useState('');
  var query = _q[0];
  var setQuery = _q[1];

  var _c = React.useState('全部');
  var catFilter = _c[0];
  var setCatFilter = _c[1];

  // Get unique categories
  var cats = ['全部'];
  var catSet = {};
  GLOSSARY_TERMS.forEach(function(t) {
    if (!catSet[t.cat]) { catSet[t.cat] = true; cats.push(t.cat); }
  });

  // Filter terms
  var filtered = GLOSSARY_TERMS.filter(function(t) {
    var matchSearch = !query || t.zh.indexOf(query) !== -1 || t.en.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    var matchCat = catFilter === '全部' || t.cat === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="module-glossary">
      <div className="module-page-header">
        <h1 className="module-page-title">{'\u{1F4DD}'} 术语词典</h1>
        <p className="module-page-subtitle">{GLOSSARY_TERMS.length}+ 个扑克术语 · 中英文对照 · 分类检索</p>
      </div>

      {/* Search + Filter */}
      <div className="glossary-toolbar">
        <div className="glossary-search">
          <span className="glossary-search-icon">{'\u{1F50D}'}</span>
          <input
            type="text"
            className="glossary-search-input"
            placeholder="搜索中文或英文术语..."
            value={query}
            onChange={function(e) { setQuery(e.target.value); }}
          />
          {query && (
            <button className="glossary-search-clear" onClick={function() { setQuery(''); }}>{'\u{2715}'}</button>
          )}
        </div>
        <div className="glossary-cats">
          {cats.map(function(c) {
            return (
              <button
                key={c}
                className={'glossary-cat-btn' + (catFilter === c ? ' active' : '')}
                onClick={function() { setCatFilter(c); }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="glossary-count">{filtered.length} 个结果</div>
      <div className="glossary-list">
        {filtered.map(function(term, i) {
          return (
            <div key={i} className="glossary-item">
              <div className="glossary-item-header">
                <span className="glossary-item-zh">{term.zh}</span>
                <span className="glossary-item-en">{term.en}</span>
                <span className="glossary-item-cat">{term.cat}</span>
              </div>
              <p className="glossary-item-def">{term.def}</p>
              {term.ex && (
                <p className="glossary-item-ex">{'\u{1F4AC}'} "{term.ex}"</p>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="glossary-empty">
            <p>没有找到匹配的术语</p>
            <button className="glossary-reset-btn" onClick={function() { setQuery(''); setCatFilter('全部'); }}>重置筛选</button>
          </div>
        )}
      </div>
    </div>
  );
}
