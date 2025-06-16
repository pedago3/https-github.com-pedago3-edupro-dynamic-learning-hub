
export const createStudentFormValidation = {
  fullName: {
    required: "Le nom complet est requis"
  },
  username: {
    required: "Le pseudo est requis",
    minLength: { value: 3, message: "Le pseudo doit contenir au moins 3 caractères" }
  },
  email: {
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Format d'email invalide"
    }
  },
  password: {
    required: "Le mot de passe est requis",
    minLength: { value: 6, message: "Le mot de passe doit contenir au moins 6 caractères" }
  },
  confirmPassword: {
    required: "La confirmation du mot de passe est requise"
  }
};

export const validatePasswordMatch = (value: string, password: string) => {
  return value === password || "Les mots de passe ne correspondent pas";
};
