export enum OrderStatus {
  // Nouvelles valeurs canoniques (à utiliser pour les nouvelles commandes)
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  NEGOTIATING = 'NEGOTIATING',
  REJECTED = 'REJECTED',

  // Anciennes valeurs (legacy — données existantes en base)
  enAttente = 'enAttente',
  valide = 'valide',
  enCours = 'enCours',
  livre = 'livre',
  rejete = 'rejete',
}
