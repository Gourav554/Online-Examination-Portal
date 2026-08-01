import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getExamDetails,
  updateExam,
  setExamStatus,
  addQuestion,
  editQuestion,
  deleteQuestion,
} from "../../api/examApi";
import QuestionForm from "../../components/QuestionForm";
import Spinner from "../../components/Spinner";
import { useToast } from "../../context/ToastContext";
import "./TeacherPages.css";

function EditExam() {
  const { id } = useParams();
  const toast = useToast();
  const [exam, setExam] = useState(null);
  const [examForm, setExamForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const loadExam = () => {
    setLoading(true);
    getExamDetails(id)
      .then((res) => {
        const { exam, questions } = res.data.data;
        setExam(exam);
        setQuestions(questions);
        setExamForm({
          title: exam.title,
          description: exam.description || "",
          subject: exam.subject || "",
          durationMinutes: exam.duration_minutes,
          passingMarks: exam.passing_marks,
          negativeMarks: exam.negative_marks,
          randomizeQuestions: !!exam.randomize_questions,
          randomizeOptions: !!exam.randomize_options,
        });
      })
      .catch(() => setError("Failed to load exam."))
      .finally(() => setLoading(false));
  };

  useEffect(loadExam, [id]);

  const handleExamUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await updateExam(id, {
        ...examForm,
        durationMinutes: Number(examForm.durationMinutes),
        passingMarks: Number(examForm.passingMarks),
        negativeMarks: Number(examForm.negativeMarks),
      });
      setExam(res.data.data.exam);
      toast("Exam details saved.");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update exam.";
      setError(message);
      toast(message, "error");
    }
  };

  const handleTogglePublish = async () => {
    setError("");
    try {
      const nextStatus = exam.status === "published" ? "draft" : "published";
      const res = await setExamStatus(id, nextStatus);
      setExam(res.data.data.exam);
      toast(nextStatus === "published" ? "Exam published." : "Exam unpublished.");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update exam status.";
      setError(message);
      toast(message, "error");
    }
  };

  const handleAddQuestion = async (data) => {
    setError("");
    try {
      const res = await addQuestion(id, data);
      setQuestions([...questions, res.data.data.question]);
      setShowAddForm(false);
      toast("Question added.");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add question.";
      setError(message);
      toast(message, "error");
    }
  };

  const handleEditQuestion = async (questionId, data) => {
    setError("");
    try {
      const res = await editQuestion(questionId, data);
      setQuestions(questions.map((q) => (q.id === questionId ? res.data.data.question : q)));
      setEditingQuestionId(null);
      toast("Question updated.");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update question.";
      setError(message);
      toast(message, "error");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Delete this question?")) return;
    setError("");
    try {
      await deleteQuestion(questionId);
      setQuestions(questions.filter((q) => q.id !== questionId));
      toast("Question deleted.");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete question.";
      setError(message);
      toast(message, "error");
    }
  };

  if (loading) return <Spinner />;
  if (!exam) return <p className="empty-state">Exam not found.</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Edit Exam</h2>
        <button className="auth-submit-btn btn-sm" onClick={handleTogglePublish}>
          {exam.status === "published" ? "Unpublish" : "Publish"}
        </button>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form className="exam-form" onSubmit={handleExamUpdate}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={examForm.title}
            onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            placeholder="e.g. Mathematics"
            value={examForm.subject}
            onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={examForm.description}
            onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              min="1"
              value={examForm.durationMinutes}
              onChange={(e) => setExamForm({ ...examForm, durationMinutes: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Passing Marks</label>
            <input
              type="number"
              min="0"
              value={examForm.passingMarks}
              onChange={(e) => setExamForm({ ...examForm, passingMarks: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Negative Marks (deducted per wrong answer)</label>
          <input
            type="number"
            min="0"
            step="0.25"
            value={examForm.negativeMarks}
            onChange={(e) => setExamForm({ ...examForm, negativeMarks: e.target.value })}
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="randomizeQuestions"
            checked={examForm.randomizeQuestions}
            onChange={(e) => setExamForm({ ...examForm, randomizeQuestions: e.target.checked })}
          />
          <label htmlFor="randomizeQuestions">Randomize question order</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="randomizeOptions"
            checked={examForm.randomizeOptions}
            onChange={(e) => setExamForm({ ...examForm, randomizeOptions: e.target.checked })}
          />
          <label htmlFor="randomizeOptions">Randomize answer options</label>
        </div>

        <button type="submit" className="auth-submit-btn">
          Save Exam Details
        </button>
      </form>

      <div className="question-list">
        <div className="page-header">
          <h2>Questions ({questions.length})</h2>
          {!showAddForm && (
            <button className="auth-submit-btn btn-sm" onClick={() => setShowAddForm(true)}>
              + Add Question
            </button>
          )}
        </div>

        {showAddForm && (
          <QuestionForm
            submitLabel="Add Question"
            onSubmit={handleAddQuestion}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {questions.map((q) =>
          editingQuestionId === q.id ? (
            <QuestionForm
              key={q.id}
              initialData={{
                questionText: q.question_text,
                questionType: q.question_type,
                options: q.options || ["", ""],
                correctAnswer: q.correct_answer || "",
                marks: q.marks,
              }}
              submitLabel="Save Question"
              onSubmit={(data) => handleEditQuestion(q.id, data)}
              onCancel={() => setEditingQuestionId(null)}
            />
          ) : (
            <div className="question-card" key={q.id}>
              <div className="question-card-header">
                <div>
                  <strong>{q.question_text}</strong>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-gray-600)" }}>
                    {q.question_type} · {q.marks} mark(s)
                  </p>
                </div>
                <div className="table-actions">
                  <button className="link-btn" onClick={() => setEditingQuestionId(q.id)}>
                    Edit
                  </button>
                  <button className="link-btn link-btn-danger" onClick={() => handleDeleteQuestion(q.id)}>
                    Delete
                  </button>
                </div>
              </div>

              {q.question_type === "mcq" && (
                <ul className="question-card-options">
                  {(q.options || []).map((opt, i) => (
                    <li key={i} className={opt === q.correct_answer ? "correct" : ""}>
                      {opt}
                    </li>
                  ))}
                </ul>
              )}

              {q.question_type === "true_false" && (
                <p className="question-card-options">Correct answer: {q.correct_answer}</p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default EditExam;
