const createBtn = document.querySelector(".create-btn");
const modalOverlay = document.querySelector(".modal-overlay");
const closeModalBtn = document.querySelector(".close-modal");
const cancelBtn = document.querySelector(".cancel-btn");
const examForm = document.querySelector(".exam-form");
const createdExamsContainer = document.querySelector(".created-exams");

function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("hidden");
}

function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add("hidden");
    examForm.reset();
}

function renderExamCard(exam) {
    const card = document.createElement("div");
    card.className = "exam-card";
    card.innerHTML = `
        <div class="exam-card-header">
            <h3>${exam.title}</h3>
            <span>${exam.subject}</span>
        </div>
        <div class="exam-card-body">
            <p><strong>Questions:</strong> ${exam.questions}</p>
            <p><strong>Duration:</strong> ${exam.duration} minutes</p>
            <p><strong>Status:</strong> ${exam.status}</p>
        </div>
    `;
    return card;
}

function showEmptyMessage(show) {
    const emptyMessage = createdExamsContainer.querySelector(".empty-message");
    if (!emptyMessage) return;
    emptyMessage.style.display = show ? "block" : "none";
}

function addExam(event) {
    event.preventDefault();
    const formData = new FormData(examForm);
    const exam = {
        title: formData.get("title")?.toString().trim(),
        subject: formData.get("subject")?.toString(),
        questions: formData.get("questions")?.toString(),
        duration: formData.get("duration")?.toString(),
        status: formData.get("status")?.toString()
    };

    if (!exam.title || !exam.subject || !exam.questions || !exam.duration || !exam.status) {
        alert("Please fill all exam details.");
        return;
    }

    const examCard = renderExamCard(exam);
    createdExamsContainer.appendChild(examCard);
    showEmptyMessage(false);
    closeModal();
}

function initializeTeacherPage() {
    if (createBtn) {
        createBtn.addEventListener("click", openModal);
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }
    if (examForm) {
        examForm.addEventListener("submit", addExam);
    }
}

window.addEventListener("DOMContentLoaded", initializeTeacherPage);
