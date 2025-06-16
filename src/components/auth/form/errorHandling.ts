
export const getErrorMessage = (error: any): string => {
  if (!error) return '';
  
  const message = error.message || error.toString();
  
  if (message.includes('Invalid login credentials') || message.includes('invalid_credentials')) {
    return 'Email/nom d\'utilisateur ou mot de passe incorrect. Vérifiez vos identifiants.';
  }
  if (message.includes('Email not confirmed') || message.includes('email_not_confirmed')) {
    return 'Veuillez confirmer votre email avant de vous connecter.';
  }
  if (message.includes('User already registered')) {
    return 'Un compte existe déjà avec cette adresse email.';
  }
  if (message.includes('Password should be at least')) {
    return 'Le mot de passe doit contenir au moins 6 caractères.';
  }
  if (message.includes('Username already exists')) {
    return 'Ce nom d\'utilisateur est déjà utilisé.';
  }
  if (message.includes('Nom d\'utilisateur ou mot de passe incorrect')) {
    return 'Nom d\'utilisateur ou mot de passe incorrect.';
  }
  
  return message;
};
