import { useState } from "react";
import "./QuestionForm.css";

const emptyForm = { questionText: "", questionType: "mcq", options: ["", ""], correctAnswer: "", marks: 1 };

// Reusable add/edit form for a single question. Fields shown depend on questionType.
function QuestionForm({ initialData, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(
    initialData
      ? { ...emptyForm, ...initialData, options: initialData.options || ["", ""] }
      : emptyForm
  );
  const [error, setError] = useState("");

  const updateOption = (index, value) => {
    const options = [...form.options];
    options[index] = value;
    setForm({ ...form, options });
  };

  const addOption = () => setForm({ ...form, options: [...form.options, ""] });

  const removeOption = (index) => {
    const removed = form.options[index];
    const options = form.options.filter((_, i) => i !== index);
    setForm({
      ...form,
      options,
      correctAnswer: form.correctAnswer === removed ? "" : form.correctAnswer,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.questionText.trim()) {
      return setError("Question text is required.");
    }
    if (form.questionType === "mcq") {
      const cleanOptions = form.options.map((o) => o.trim()).filter(Boolean);
      if (cleanOptions.length < 2) {
        return setError("Provide at least 2 options.");
      }
      if (!form.correctAnswer) {
        return setError("Select the correct option.");
      }
    }
    if (form.questionType === "true_false" && !form.correctAnswer) {
      return setError("Select the correct answer (True or False).");
    }

    onSubmit({
      questionText: form.questionText.trim(),
      questionType: form.questionType,
      options: form.questionType === "mcq" ? form.options.map((o) => o.trim()).filter(Boolean) : undefined,
      correctAnswer: form.questionType === "descriptive" ? undefined : form.correctAnswer,
      marks: Number(form.marks),
    });
  };

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}

      <div className="form-group">
        <label>Question Text</label>
        <input
          type="text"
          value={form.questionText}
          onChange={(e) => setForm({ ...form, questionText: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Question Type</label>
        <select
          value={form.questionType}
          onChange={(e) => setForm({ ...form, questionType: e.target.value, correctAnswer: "" })}
        >
          <option value="mcq">Multiple Choice</option>
          <option value="true_false">True / False</option>
          <option value="descriptive">Descriptive</option>
        </select>
      </div>

      {form.questionType === "mcq" && (
        <div className="form-group">
          <label>Options (select the correct one)</label>
          {form.options.map((option, index) => (
            <div className="option-row" key={index}>
              <input
                type="radio"
                name="correctAnswer"
                checked={form.correctAnswer === option && option !== ""}
                onChange={() => setForm({ ...form, correctAnswer: option })}
              />
              <input
                type="text"
                value={option}
                placeholder={`Option ${index + 1}`}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              {form.options.length > 2 && (
                <button type="button" className="option-remove-btn" onClick={() => removeOption(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="option-add-btn" onClick={addOption}>
            + Add Option
          </button>
        </div>
      )}

      {form.questionType === "true_false" && (
        <div className="form-group">
          <label>Correct Answer</label>
          <div className="option-row">
            <label>
              <input
                type="radio"
                name="tfAnswer"
                checked={form.correctAnswer === "true"}
                onChange={() => setForm({ ...form, correctAnswer: "true" })}
              />{" "}
              True
            </label>
            <label>
              <input
                type="radio"
                name="tfAnswer"
                checked={form.correctAnswer === "false"}
                onChange={() => setForm({ ...form, correctAnswer: "false" })}
              />{" "}
              False
            </label>
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Marks</label>
        <input
          type="number"
          min="1"
          value={form.marks}
          onChange={(e) => setForm({ ...form, marks: e.target.value })}
        />
      </div>

      <div className="question-form-actions">
        <button type="submit" className="auth-submit-btn">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default QuestionForm;
