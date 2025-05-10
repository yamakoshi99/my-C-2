let timer;
let timeLeft;
let maxTime;
let interval = 50; // ms
let correctAnswer;
const timeBuffer = 0.5; // 時間切れ判定に0.5秒の余裕を持たせる

function startQuiz(questionText, answerIsTrue, seconds = 10) {
    maxTime = seconds;
    timeLeft = seconds;
    correctAnswer = answerIsTrue;

    const quizArea = document.getElementById("quiz-area");
    quizArea.innerHTML = `
        <div class="mb-3">
            <strong>${questionText}</strong>
        </div>
        <div class="mb-3">
            <button class="btn btn-success me-2" onclick="answerQuiz(true)">○</button>
            <button class="btn btn-danger" onclick="answerQuiz(false)">×</button>
        </div>
        <div class="mb-2">
            <span id="timer" class="badge bg-warning text-dark">残り時間: ${Math.ceil(timeLeft)}秒</span>
        </div>
        <div class="progress" style="height: 20px;">
            <div id="timeBar" class="progress-bar bg-info" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    `;
    updateQuizTimer();
    timer = setInterval(updateQuizTimer, interval);
}

function updateQuizTimer() {
    timeLeft -= interval / 1000;
    document.getElementById("timer").textContent = `残り時間: ${Math.max(0, Math.ceil(timeLeft))}秒`;
    
    // 進捗バーの表示を調整
    let percent = Math.max(0, (timeLeft / maxTime) * 100);
    let bar = document.getElementById("timeBar");
    bar.style.width = percent + "%";
    bar.setAttribute("aria-valuenow", percent);

    // 時間が0以下になった場合
    if (timeLeft <= 0) {
        clearInterval(timer);
        // 進捗バーを完全に消す
        bar.style.width = "0%";
        bar.setAttribute("aria-valuenow", 0);
        
        // わずかな遅延を入れて、進捗バーが完全になくなってから結果を表示
        setTimeout(() => {
            showQuizResult("時間切れです。");
        }, 500); // 0.5秒後に表示
    }
}

function answerQuiz(isTrue) {
    clearInterval(timer);
    if (isTrue === correctAnswer) {
        showQuizResult("正解です！");
    } else {
        showQuizResult("不正解です。");
    }
}

function showQuizResult(message) {
    document.getElementById("quiz-area").innerHTML = `
        <div class="alert alert-info">${message}</div>
        <a class="btn btn-secondary mt-3" href="" onclick="location.reload(); return false;">もう一度</a>
    `;
}