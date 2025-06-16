
export const validateUsername = (username: string): string | null => {
  if (!username.trim()) {
    return 'Le nom d\'utilisateur est requis.';
  }

  const usernameRegex = /^[a-z0-9._-]+$/;
  if (!usernameRegex.test(username.toLowerCase())) {
    return 'Le nom d\'utilisateur ne peut contenir que des lettres minuscules, chiffres, points, tirets et underscores.';
  }

  return null;
};

export const validateFullName = (fullName: string): string | null => {
  if (!fullName.trim()) {
    return 'Le nom complet est requis.';
  }
  return null;
};
