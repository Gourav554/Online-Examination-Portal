const questions = [
    {
        id: 1,
        text: "?",
        marks: 1,
        options: [
            
        ]
    },
    {
        id: 2,
        text: "?",
        marks: 1,
        options: [
            
        ]
    },
    {
        id: 3,
        text: "a?",
        marks: 1,
        options: [
           
        ]
    },
    {
        id: 4,
        text: "?",
        marks: 1,
        options: [
          
        ]
    },
    {
        id: 5,
        text: "?",
        marks: 1,
        options: [
            "start()",
            "main()",
            "run()",
            "init()"
        ]
    },
    {
        id: 6,
        text: "W?",
        marks: 1,
        options: [
            "static",
            "final",
            "const",
            "immutable"
        ]
    },
    {
        id: 7,
        text: "",
        marks: 1,
        options: [
            "private",
            "protected",
            "public",
            "All of the above"
        ]
    },
    {
        id: 8,
        text: "W",
        marks: 1,
        options: [
            
        ]
    },
    {
        id: 9,
        text: "",
        marks: 1,
        options: [
            ""
        ]
    },
    {
        id: 10,
        text: "?",
        marks: 1,
        options: [
            "create",
            "new",
            "build",
            "make"
        ]
    }
];

const pageSize = 2;
let currentPage = 1;
const selectedAnswers = {};

function formatTime(value) {
    return String(value).padStart(2, "0");
}

function updateTimer() {
    let totalSeconds = 59 * 60 + 42;
    return function () {
        const timerElement = document.getElementById("time");
        if (!timerElement) return;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        timerElement.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;

        if (totalSeconds > 0) {
            totalSeconds--;
        }
    };
}

function renderQuestions() {
    const questionList = document.querySelector(".questions");
    if (!questionList) return;

    const startIndex = (currentPage - 1) * pageSize;
    const pageQuestions = questions.slice(startIndex, startIndex + pageSize);

    questionList.innerHTML = pageQuestions.map((question) => {
        const optionHtml = question.options.map((option, optionIndex) => {
            const name = `q${question.id}`;
            const optionId = `q${question.id}-option${optionIndex}`;
            const checked = selectedAnswers[question.id] === option ? "checked" : "";
            return `
                <label for="${optionId}">
                    <input type="radio" id="${optionId}" name="${name}" value="${option}" ${checked}>
                    ${option}
                </label>`;
        }).join("");

        return `
            <div class="question-card">
                <div class="question-header">
                    <span>${question.id}</span>
                    <h4>${question.text}</h4>
                    <small>${question.marks} Mark${question.marks > 1 ? "s" : ""}</small>
                </div>
                <div class="options">${optionHtml}</div>
            </div>`;
    }).join("");

    attachOptionListeners();
    updateNavigationButtons();
}

function attachOptionListeners() {
    const inputs = document.querySelectorAll(".questions input[type='radio']");
    inputs.forEach((input) => {
        input.addEventListener("change", (event) => {
            const target = event.target;
            if (!target || !target.name) return;
            const questionId = Number(target.name.replace("q", ""));
            selectedAnswers[questionId] = target.value;
            updatePaletteState(questionId);
        });
    });
}

function updateNavigationButtons() {
    const prevButton = document.querySelector(".prev-btn");
    const nextButton = document.querySelector(".next-btn");
    if (prevButton) {
        prevButton.disabled = currentPage === 1;
    }
    if (nextButton) {
        nextButton.disabled = currentPage === Math.ceil(questions.length / pageSize);
    }
}

function updatePaletteState(questionId) {
    const paletteButton = document.querySelector(`.palette button:nth-child(${questionId})`);
    if (!paletteButton) return;
    if (selectedAnswers[questionId]) {
        paletteButton.classList.add("answered");
        paletteButton.classList.remove("not-answer");
    }
}

function movePage(delta) {
    const maxPage = Math.ceil(questions.length / pageSize);
    currentPage = Math.min(Math.max(1, currentPage + delta), maxPage);
    renderQuestions();
}

function attachNavigation() {
    const prevButton = document.querySelector(".prev-btn");
    const nextButton = document.querySelector(".next-btn");

    if (prevButton) {
        prevButton.addEventListener("click", () => movePage(-1));
    }
    if (nextButton) {
        nextButton.addEventListener("click", () => movePage(1));
    }
}

function showThankYouMessage() {
    const existingMessage = document.getElementById("submission-message");
    if (existingMessage) {
        existingMessage.style.display = "block";
        return;
    }

    const message = document.createElement("div");
    message.id = "submission-message";
    message.className = "submission-message";
    message.textContent = "Thank you for this test";

    const mainContent = document.querySelector(".main");
    if (mainContent) {
        mainContent.insertBefore(message, mainContent.firstChild);
    } else {
        document.body.appendChild(message);
    }
}

function attachSubmitButton() {
    const submitButton = document.querySelector(".submit-btn");
    if (submitButton) {
        submitButton.addEventListener("click", showThankYouMessage);
    }
}

function initializeExamPage() {
    const timerUpdater = updateTimer();
    timerUpdater();
    setInterval(timerUpdater, 1000);
    attachNavigation();
    attachSubmitButton();
    renderQuestions();
}

window.addEventListener("DOMContentLoaded", initializeExamPage);