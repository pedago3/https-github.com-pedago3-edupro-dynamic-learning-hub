
export const WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const semaines = [
  "Semaine 1",
  "Semaine 2",
  "Semaine 3",
  "Semaine 4",
  "Semaine 5",
  "Semaine 6",
  "Semaine 7",
];

const mois = [
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
  "Janvier",
  "Février",
  "Mars",
];

export function defaultRows() {
  return semaines.map((semaine, idx) => ({
    semaine,
    mois: mois[idx] || "",
    days: ["", "", "", "", ""],
  }));
}
