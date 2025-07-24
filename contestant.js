import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaVUoJm1_m2Cg-qZPjjMfJzCMxM81v-ig",
  authDomain: "tesla-2ed15.firebaseapp.com",
  databaseURL: "https://tesla-2ed15-default-rtdb.firebaseio.com",
  projectId: "tesla-2ed15",
  storageBucket: "tesla-2ed15.firebasestorage.app",
  messagingSenderId: "728875030496",
  appId: "1:728875030496:web:25b5477635dea1e291bd85",
  measurementId: "G-F6NKFKLHDH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentQuestion = 0;
let score = 0;
let selectedQuestions = [];
let timer;
let timeLeft = 10;

const questionContainer = document.getElementById("questionContainer");
const timerElement = document.getElementById("timer");

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function loadQuestions() {
  const qs = JSON.parse(localStorage.getItem("questions"));
  if (!qs || qs.length === 0) {
    alert("لا توجد أسئلة متاحة حاليا.");
    return [];
  }
  return qs;
}

function startQuiz() {
  const allQuestions = loadQuestions();
  selectedQuestions = shuffle([...allQuestions]).slice(0, 10);
  currentQuestion = 0;
  score = 0;
  showQuestion();
  startTimer();
}

function showQuestion() {
  const q = selectedQuestions[currentQuestion];
  if (!q) return;

  questionContainer.innerHTML = `
    <h3>${currentQuestion + 1}. ${q.question}</h3>
    ${q.options.map(option => `<button onclick="checkAnswer('${option}')">${option}</button>`).join('')}
  `;

  timeLeft = 10;
  updateTimerDisplay();
}

function checkAnswer(selectedOption) {
  const q = selectedQuestions[currentQuestion];
  if (selectedOption === q.correct) {
    score++;
  }
  nextQuestion();
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < selectedQuestions.length) {
    showQuestion();
    resetTimer();
  } else {
    showResult();
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft === 0) {
      nextQuestion();
    }
  }, 1000);
}

function resetTimer() {
  timeLeft = 10;
}

function updateTimerDisplay() {
  timerElement.textContent = `الوقت المتبقي: ${timeLeft} ثانية`;
}

function showResult() {
  clearInterval(timer);
  questionContainer.innerHTML = `
    <h2>انتهى الاختبار</h2>
    <p>درجتك: ${score} من ${selectedQuestions.length}</p>
  `;

  const key = localStorage.getItem("currentContestantKey");
  if (key) {
    const scoreRef = ref(db, "contestants/" + key + "/score");
    set(scoreRef, score)
      .then(() => console.log("تم حفظ النتيجة بنجاح"))
      .catch(err => console.error("خطأ في حفظ النتيجة:", err));
  } else {
    console.warn("لم يتم العثور على مفتاح المتسابق في localStorage");
  }

  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}

window.checkAnswer = checkAnswer; // لجعل الدالة متاحة في الـ onclick بالـ HTML

window.onload = () => {
  startQuiz();
};
