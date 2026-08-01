import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExam } from "../../api/examApi";
import { useToast } from "../../context/ToastContext";
import "./TeacherPages.css";

const initialForm = {
  title: "",
  description: "",
  subject: "",
  durationMinutes: 30,
  passingMarks: 0,
  negativeMarks: 0,
  randomizeQuestions: false,
  randomizeOptions: false,
};

function CreateExam() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await createExam({
        ...form,
        durationMinutes: Number(form.durationMinutes),
        passingMarks: Number(form.passingMarks),
        negativeMarks: Number(form.negativeMarks),
      });
      toast("Exam created. Now add some questions.");
      navigate(`/teacher/exams/${res.data.data.exam.id}/edit`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create exam.";
      setError(message);
      toast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Create Exam</h2>

      {error && <div className="auth-error">{error}</div>}

      <form className="exam-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={form.title} onChange={(e) => handleChange("title", e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            placeholder="e.g. Mathematics"
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              min="1"
              value={form.durationMinutes}
              onChange={(e) => handleChange("durationMinutes", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Passing Marks</label>
            <input
              type="number"
              min="0"
              value={form.passingMarks}
              onChange={(e) => handleChange("passingMarks", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Negative Marks (deducted per wrong answer)</label>
          <input
            type="number"
            min="0"
            step="0.25"
            value={form.negativeMarks}
            onChange={(e) => handleChange("negativeMarks", e.target.value)}
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="randomizeQuestions"
            checked={form.randomizeQuestions}
            onChange={(e) => handleChange("randomizeQuestions", e.target.checked)}
          />
          <label htmlFor="randomizeQuestions">Randomize question order</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="randomizeOptions"
            checked={form.randomizeOptions}
            onChange={(e) => handleChange("randomizeOptions", e.target.checked)}
          />
          <label htmlFor="randomizeOptions">Randomize answer options</label>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={submitting}>
          {submitting ? "Creating..." : "Create & Add Questions"}
        </button>
      </form>
    </div>
  );
}

export default CreateExam;
