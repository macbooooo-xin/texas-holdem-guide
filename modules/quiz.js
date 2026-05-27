/* ═══════════════════════════════════════════════════════════
   Module: Quiz (知识测验)
   ═══════════════════════════════════════════════════════════ */

function QuizModule() {
  var _p = React.useState('start');
  var phase = _p[0];
  var setPhase = _p[1];

  var _q = React.useState(0);
  var currentQ = _q[0];
  var setCurrentQ = _q[1];

  var _a = React.useState({});
  var answers = _a[0];
  var setAnswers = _a[1];

  var _r = React.useState(null);
  var results = _r[0];
  var setResults = _r[1];

  // Load saved score
  React.useEffect(function() {
    try {
      var saved = JSON.parse(localStorage.getItem('th_quiz_best') || 'null');
      if (saved) setResults(saved);
    } catch(e) {}
  }, []);

  function startQuiz() {
    // Shuffle questions
    var shuffled = QUIZ_QUESTIONS.slice().sort(function() { return Math.random() - 0.5; });
    window._shuffledQuiz = shuffled;
    setPhase('quiz');
    setCurrentQ(0);
    setAnswers({});
  }

  function selectAnswer(qIdx, optIdx) {
    var next = {};
    for (var k in answers) next[k] = answers[k];
    next[qIdx] = optIdx;
    setAnswers(next);
  }

  function nextQuestion() {
    if (currentQ < window._shuffledQuiz.length - 1) {
      setCurrentQ(function(i) { return i + 1; });
    }
  }

  function prevQuestion() {
    if (currentQ > 0) {
      setCurrentQ(function(i) { return i - 1; });
    }
  }

  function finishQuiz() {
    var shuffled = window._shuffledQuiz;
    var correct = 0;
    var total = shuffled.length;
    var details = [];
    shuffled.forEach(function(q, i) {
      var userAns = answers[i];
      if (userAns !== undefined && userAns === q.ans) correct++;
    });
    var score = Math.round(correct / total * 100);
    var result = { score: score, correct: correct, total: total, date: new Date().toISOString() };

    // Save best
    try {
      var prev = JSON.parse(localStorage.getItem('th_quiz_best') || 'null');
      if (!prev || score >= prev.score) {
        localStorage.setItem('th_quiz_best', JSON.stringify(result));
      }
    } catch(e) {}

    setResults(result);
    setPhase('result');
  }

  // ── Start Screen ──
  if (phase === 'start') {
    return (
      <div className="module-quiz">
        <div className="module-page-header">
          <h1 className="module-page-title"><IconCheckCircle /> 知识测验</h1>
          <p className="module-page-subtitle">{QUIZ_QUESTIONS.length} 道题 · 覆盖全部知识点 · 即时判分</p>
        </div>
        <div className="quiz-start-card">
          <div className="quiz-start-icon"><IconTarget /></div>
          <h3>准备开始测验</h3>
          <div className="quiz-start-info">
            <div className="quiz-start-stat">
              <span className="quiz-start-stat-num">{QUIZ_QUESTIONS.length}</span>
              <span className="quiz-start-stat-label">题目总数</span>
            </div>
            <div className="quiz-start-stat">
              <span className="quiz-start-stat-num">4-5</span>
              <span className="quiz-start-stat-label">每题选项</span>
            </div>
            <div className="quiz-start-stat">
              <span className="quiz-start-stat-num">{'\u{221E}'}</span>
              <span className="quiz-start-stat-label">可重复作答</span>
            </div>
          </div>
          {results && (
            <div className="quiz-best-score">
              历史最佳：<strong>{results.score}分</strong>（{results.correct}/{results.total}）
            </div>
          )}
          <button className="quiz-start-btn" onClick={startQuiz}>开始测验</button>
        </div>
      </div>
    );
  }

  // ── Quiz Screen ──
  if (phase === 'quiz') {
    var shuffled = window._shuffledQuiz;
    var q = shuffled[currentQ];
    var total = shuffled.length;
    var answered = Object.keys(answers).length;

    return (
      <div className="module-quiz">
        <div className="quiz-header-bar">
          <div className="quiz-progress">
            <div className="quiz-progress-text">第 {currentQ + 1} / {total} 题</div>
            <div className="quiz-progress-track">
              <div className="quiz-progress-fill" style={{ width: ((currentQ + 1) / total * 100) + '%' }} />
            </div>
          </div>
          <div className="quiz-answered">已答 {answered}/{total}</div>
        </div>

        <div className="quiz-question-card">
          <span className="quiz-q-cat">{q.cat}</span>
          <h3 className="quiz-q-text">{q.q}</h3>
          <div className="quiz-options">
            {q.opts.map(function(opt, i) {
              var isSelected = answers[currentQ] === i;
              return (
                <button
                  key={i}
                  className={'quiz-option' + (isSelected ? ' selected' : '')}
                  onClick={function() { selectAnswer(currentQ, i); }}
                >
                  <span className="quiz-option-letter">{'ABCD'[i]}</span>
                  <span className="quiz-option-text">{opt}</span>
                  {isSelected && <span className="quiz-option-check"><IconCheck /></span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="quiz-nav">
          <button className="quiz-nav-btn" onClick={prevQuestion} disabled={currentQ === 0}>上一题</button>
          {currentQ < total - 1 ? (
            <button className="quiz-nav-btn primary" onClick={nextQuestion}>下一题</button>
          ) : (
            <button className="quiz-nav-btn submit" onClick={finishQuiz} disabled={answered < total}>
              提交答卷（{answered}/{total}）
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="quiz-dots">
          {shuffled.map(function(_, i) {
            return (
              <button
                key={i}
                className={'quiz-dot' + (i === currentQ ? ' current' : '') + (answers[i] !== undefined ? ' answered' : '')}
                onClick={function() { setCurrentQ(i); }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Result Screen ──
  if (phase === 'result') {
    var r = results;
    var grade = r.score >= 90 ? '优秀' : r.score >= 70 ? '良好' : r.score >= 50 ? '加油' : '继续学习';

    return (
      <div className="module-quiz">
        <div className="quiz-result-card">
          <div className="quiz-result-score">{r.score}<span className="quiz-result-pct">分</span></div>
          <div className="quiz-result-grade">{grade}</div>
          <div className="quiz-result-stats">
            <span>答对 {r.correct} 题</span>
            <span>共 {r.total} 题</span>
          </div>

          {/* Answer review */}
          <div className="quiz-review">
            <h4>答题回顾</h4>
            {window._shuffledQuiz.map(function(q, i) {
              var userAns = answers[i];
              var isCorrect = userAns === q.ans;
              return (
                <div key={i} className={'quiz-review-item ' + (isCorrect ? 'correct' : 'wrong')}>
                  <div className="quiz-review-q">
                    <span className={'quiz-review-mark' + (isCorrect ? ' correct' : ' wrong')}>
                      {isCorrect ? <IconCheck /> : <IconCross />}
                    </span>
                    <span>{q.q}</span>
                    <span className="quiz-review-cat">{q.cat}</span>
                  </div>
                  {!isCorrect && (
                    <div className="quiz-review-answers">
                      <span className="quiz-review-wrong-ans">你的答案：{q.opts[userAns !== undefined ? userAns : -1] || '未作答'}</span>
                      <span className="quiz-review-right-ans">正确答案：{q.opts[q.ans]}</span>
                    </div>
                  )}
                  <p className="quiz-review-exp">{q.exp}</p>
                </div>
              );
            })}
          </div>

          <div className="quiz-result-actions">
            <button className="quiz-start-btn" onClick={startQuiz}>再做一次</button>
            <button className="quiz-result-back" onClick={function() { setPhase('start'); }}>返回首页</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
