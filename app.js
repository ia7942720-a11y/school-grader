const subjectSelect = document.getElementById("subjectSelect");
const answerArea = document.getElementById("answerArea");
const result = document.getElementById("result");

for (let subject in EXAMS) {
  const option = document.createElement("option");
  option.value = subject;
  option.textContent = subject;
  subjectSelect.appendChild(option);
}

subjectSelect.addEventListener("change", () => {
  answerArea.innerHTML = "";
  result.textContent = "";

  const exam = EXAMS[subjectSelect.value];

  exam.questions.forEach((question, index) => {
    const div = document.createElement("div");
    div.className = "question";

    div.innerHTML = `
      <label>${index + 1}번</label>
      <input
        type="text"
        inputmode="numeric"
        id="q${index}"
        class="answer-input"
        placeholder="${question.type === "choice" ? "1~5" : "주관식"}"
      >
      <span id="mark${index}"></span>
    `;

    answerArea.appendChild(div);

    const input = document.getElementById(`q${index}`);

    const savedAnswers = JSON.parse(localStorage.getItem("savedAnswers")) || {};
const subjectName = subjectSelect.value;

if (savedAnswers[subjectName] && savedAnswers[subjectName][index]) {
  input.value = savedAnswers[subjectName][index];
}
    
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9]/g, "");

      saveCurrentAnswers();
      
      if (question.type === "choice" && input.value.length === 1) {
        moveToNext(index);
      }
    });

    if (hasSavedAnswers(subjectSelect.value)) {
  gradeExam(false);
}

    input.addEventListener("keydown", (e) => {
      if (question.type === "short" && e.key === "Enter") {
        moveToNext(index);
      }
    });
  });
});

function moveToNext(index) {
  const nextInput = document.getElementById(`q${index + 1}`);

  if (nextInput) {
    nextInput.focus();
  }
}

function gradeExam() {
  const exam = EXAMS[subjectSelect.value];

  let total = 0;
  let maxScore = 0;
  let wrongList = [];

  exam.questions.forEach((question, index) => {
    const input = document.getElementById(`q${index}`);
    const mark = document.getElementById(`mark${index}`);

    const userAnswer = input.value.trim();
    const correctAnswer = question.answer.trim();

    maxScore += question.score;

    if (userAnswer === correctAnswer) {
      total += question.score;
      mark.textContent = " O";
      mark.style.color = "green";
    } else {
      mark.textContent = ` X 정답: ${correctAnswer}`;
      mark.style.color = "red";
      wrongList.push(index + 1);
    }
  });

  result.innerHTML = `
    점수: ${total} / ${maxScore}<br>
    틀린 문제: ${wrongList.length ? wrongList.join(", ") : "없음"}
  `;
}

const history = JSON.parse(localStorage.getItem("gradeHistory")) || [];

history.push({
  subject: subjectSelect.value,
  score: total,
  maxScore: maxScore,
  wrong: wrongList,
  date: new Date().toLocaleString()
});

localStorage.setItem("gradeHistory", JSON.stringify(history));

function saveCurrentAnswers() {
  const subjectName = subjectSelect.value;
  if (!subjectName) return;

  const exam = EXAMS[subjectName];
  const answers = [];

  exam.questions.forEach((_, index) => {
    const input = document.getElementById(`q${index}`);
    answers[index] = input ? input.value : "";
  });

  const savedAnswers = JSON.parse(localStorage.getItem("savedAnswers")) || {};
  savedAnswers[subjectName] = answers;

  localStorage.setItem("savedAnswers", JSON.stringify(savedAnswers));
}
function hasSavedAnswers(subjectName) {
  const savedAnswers = JSON.parse(localStorage.getItem("savedAnswers")) || {};
  return savedAnswers[subjectName] && savedAnswers[subjectName].some(answer => answer !== "");
}
