const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ["admin", "teacher", "student"];

function isValidEmail(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email);
}

function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6;
}

function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

const QUESTION_TYPES = ["mcq", "true_false", "descriptive"];

// Returns an error message string if the question payload is invalid, otherwise null.
function validateQuestionData({ questionText, questionType, options, correctAnswer, marks }) {
  if (!questionText || typeof questionText !== "string") {
    return "Question text is required.";
  }

  if (!QUESTION_TYPES.includes(questionType)) {
    return "Question type must be mcq, true_false or descriptive.";
  }

  if (!Number.isInteger(marks) || marks < 1) {
    return "Marks must be a positive whole number.";
  }

  if (questionType === "mcq") {
    if (!Array.isArray(options) || options.length < 2 || options.some((o) => !o || typeof o !== "string")) {
      return "MCQ questions need at least 2 non-empty options.";
    }
    if (!correctAnswer || !options.includes(correctAnswer)) {
      return "MCQ correct answer must match one of the provided options.";
    }
  }

  if (questionType === "true_false" && !["true", "false"].includes(correctAnswer)) {
    return "True/False correct answer must be 'true' or 'false'.";
  }

  return null;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidRole,
  VALID_ROLES,
  QUESTION_TYPES,
  validateQuestionData,
};
