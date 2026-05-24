const subjectSelect = document.getElementById("subjectSelect");
const answerArea = document.getElementById("answerArea");

for (let subject in EXAMS) {
  const option = document.createElement("option");
  option.value = subject;
  option.textContent = subject;
  subjectSelect.appendChild(option);
}

subjectSelect.addEventListener("change", () => {
  answerArea.innerHTML = "";

  const subject = EXAMS[subjectSelect.value];

  subject.answers.forEach((_, index) => {
    const div = document.createElement("div");
    div.className = "question";

    div.innerHTML = `
      <label>${index + 1}번</label>
      <input type="number" min="1" max="5" id="q${index}">
    `;

    answerArea.appendChild(div);
  });
});

function gradeExam() {
  const subject = EXAMS[subjectSelect.value];

  let total = 0;

  subject.answers.forEach((answer, index) => {
    const userAnswer = Number(document.getElementById(`q${index}`).value);

    if (userAnswer === answer) {
      total += subject.scores[index];
    }
  });

  document.getElementById("result").textContent =
    `점수: ${total}점`;
}