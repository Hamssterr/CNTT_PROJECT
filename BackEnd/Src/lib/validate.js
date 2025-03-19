export const validateSignup = ({ firstName, lastName, email, password, role }) => {
    if (!firstName || !lastName || !email || !password || !role) return "All fields are required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    if (password.length < 6) return "Password must be at least 6 characters";
    const validRoles = ['parent', 'student', 'teacher', 'consultant', 'admin', 'finance'];
    if (!validRoles.includes(role)) return "Invalid role";
    return null;
  };