
export interface VacationPeriod {
  debut: string;
  fin: string;
}

export interface TrimestreData {
  chapitres: string;
  activites: string;
  evaluations: string;
}

export interface FormData {
  etablissement: string;
  enseignant: string;
  anneeScolaire: string;
  matiere: string;
  niveau: string;
  specialite: string;
  heuresParSemaine: number;
  competences: string;
  objectifs: string;
  rentree: string;
  vacancesToussaint: VacationPeriod;
  vacancesNoel: VacationPeriod;
  vacancesHiver: VacationPeriod;
  vacancesPrintemps: VacationPeriod;
  bacBlanc: string;
  epreuvesFinales: string;
  grandOral: string;
  finAnnee: string;
  trimestre1: TrimestreData;
  trimestre2: TrimestreData;
  trimestre3: TrimestreData;
  approches: string[];
  outils: string[];
  ressources: string;
  controlsEcrits: number;
  devoirsMaison: number;
  evaluationsOrales: number;
  projets: number;
  participation: number;
  criteresEvaluation: string;
  elevesDifficulte: string;
  elevesHautPotentiel: string;
  besoinsPep: string;
  interdisciplinarite: string;
  partenariats: string;
  sorties: string;
  indicateursReussite: string;
  ajustements: string;
  notesPersonnelles: string;
}
