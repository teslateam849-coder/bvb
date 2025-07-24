<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <title>تحدي 30 - المتسابق</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="header">
    <img src="https://uploads.onecompiler.io/43r6ub8mz/43r6u5fru/WhatsApp%20Image%202025-07-20%20at%2015.09.26_9c297a66.jpg" class="header-img" alt="شعار" />
    <h1>تحدي الثلاثين - المتسابق</h1>
  </div>

  <div class="quiz-container">
    <div id="questionBox" class="question-box">جاري تحميل السؤال...</div>
    <div id="optionsBox" class="options-box"></div>
    <div id="timer" class="timer-box">10</div>
    <div id="progress" class="progress-box"></div>
  </div>

  <!-- تحميل الأسئلة -->
  <script src="questions.js"></script>
  <!-- تشغيل منطق المسابقة -->
  <script src="contestant.js"></script>
</body>
</html>.....contestant.js....let questions = shuffleArray(window.questions).slice(0, 10);

let current = 0;
let score = 0;
let timer;
let countdown = 10;

const warningSound = new Audio("https://www.soundjay.com/button/sounds/beep-07.mp3");

function startQuestion() {
  if (current >= questions.length) {
    showResult();
    return;
  }

  const q = questions[current];
  document.getElementById("questionBox").innerText = q.question;

  const optionsBox = document.getElementById("optionsBox");
  optionsBox.innerHTML = "";

  const shuffledOptions = shuffleArray([...q.answers]);

  shuffledOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.className = "option-btn";
    btn.onclick = () => {
      clearInterval(timer);
      if (opt === q.correct) score++;
      current++;
      startQuestion();
    };
    optionsBox.appendChild(btn);
  });

  countdown = 10;
  const timerEl = document.getElementById("timer");
  timerEl.innerText = countdown;
  timerEl.style.color = "#d35400";

  timer = setInterval(() => {
    countdown--;
    timerEl.innerText = countdown;

    if (countdown === 3) warningSound.play();
    if (countdown <= 3) timerEl.style.color = "red";
    else timerEl.style.color = "#d35400";

    if (countdown === 0) {
      clearInterval(timer);
      current++;
      startQuestion();
    }
  }, 1000);

  document.getElementById("progress").innerText = السؤال ${current + 1} من ${questions.length};
}

function showResult() {
  document.getElementById("questionBox").style.display = "none";
  document.getElementById("optionsBox").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.getElementById("progress").style.display = "none";

  const quizContainer = document.querySelector(".quiz-container");
  quizContainer.innerHTML = 
    <div class="result-box" style="font-size: 24px; color: #ff7700; text-align: center; margin-top: 40px;">
      انتهت الأسئلة! نتيجتك: ${score} من ${questions.length}
    </div>
  ;

  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startQuestion();
