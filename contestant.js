// Firebase SDK - تأكد أن firebaseApp.js تم تحميله في index.html أو أضفه هنا إن لم يكن موجودًا
const firebaseConfig = {
  apiKey: "ضع مفتاحك هنا",
  authDomain: "project-id.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "....",
  appId: "...."
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// أسئلة الاختبار
import { questions } from './questions.js';

let currentQuestion = 0;
let score = 0;
let timer;
let seconds = 15;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");

function startQuestion() {
  if (currentQuestion >= questions.length) {
    showResult();
    return;
  }

  const q = questions[currentQuestion];
  questionEl.textContent = q.question;

  answersEl.innerHTML = "";
  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.className = "answer-btn";
    btn.addEventListener("click", () => checkAnswer(btn, q.correct));
    answersEl.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timer);
  seconds = 15;
  timerEl.textContent = seconds;
  timer = setInterval(() => {
    seconds--;
    timerEl.textContent = seconds;
    if (seconds === 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function checkAnswer(button, correctAnswer) {
  clearInterval(timer);
  const isCorrect = button.textContent === correctAnswer;
  if (isCorrect) {
    score++;
    button.style.backgroundColor = "green";
  } else {
    button.style.backgroundColor = "red";
    [...answersEl.children].forEach(btn => {
      if (btn.textContent === correctAnswer) {
        btn.style.backgroundColor = "green";
      }
    });
  }

  [...answersEl.children].forEach(btn => btn.disabled = true);
  nextBtn.disabled = false;
}

function nextQuestion() {
  currentQuestion++;
  nextBtn.disabled = true;
  startQuestion();
}

function showResult() {
  questionEl.textContent = "انتهى الاختبار!";
  answersEl.innerHTML = "";
  timerEl.textContent = "";
  resultEl.textContent = `نتيجتك: ${score} / ${questions.length}`;
  nextBtn.style.display = "none";

  // ✅ تحديث النتيجة في Firestore
  const contestantId = localStorage.getItem("contestantId");

  if (contestantId) {
    db.collection("contestants").doc(contestantId).update({
      score
    })
    .then(() => {
      console.log("تم حفظ النتيجة بنجاح");
    })
    .catch(err => {
      console.error("فشل حفظ النتيجة:", err);
    });
  } else {
    console.warn("لم يتم العثور على contestantId في localStorage");
  }
}

// عند تحميل الصفحة، نبدأ أول سؤال
startQuestion();

// زر التالي
nextBtn.addEventListener("click", nextQuestion);
