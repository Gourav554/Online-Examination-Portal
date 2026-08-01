// Central place mapping a user's role to their dashboard route.
export function getDashboardPath(role) {
  if (role === "teacher") return "/teacher";
  if (role === "student") return "/student";
  if (role === "admin") return "/admin";
  return "/login";
}
