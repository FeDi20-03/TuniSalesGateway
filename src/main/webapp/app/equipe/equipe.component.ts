import { Component, OnInit } from '@angular/core';

interface Commercial {
  nom: string;
  ventes: number;
  objectif: number;
  statut: string;
}

@Component({
  selector: 'jhi-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.scss'],
})
export class EquipeComponent implements OnInit {
  commerciaux: Commercial[] = [
    { nom: 'Alice Dupont', ventes: 15600, objectif: 95, statut: 'Excellent' },
    { nom: 'Bob Martin', ventes: 12400, objectif: 82, statut: 'Bon' },
    { nom: 'Charlie Dubois', ventes: 9800, objectif: 75, statut: 'Moyen' },
    { nom: 'David Lee', ventes: 6500, objectif: 50, statut: 'À améliorer' },
    { nom: 'Sarah Connor', ventes: 21000, objectif: 110, statut: 'Exceptionnel' },
  ];

  ngOnInit(): void {}

  getRankClass(index: number): string {
    if (index === 0) return 'rank-badge--gold';
    if (index === 1) return 'rank-badge--silver';
    if (index === 2) return 'rank-badge--bronze';
    return 'rank-badge--default';
  }

  getProgressClass(objectif: number): string {
    if (objectif >= 100) return 'bg-success';
    if (objectif >= 75) return 'bg-primary';
    return 'bg-warning';
  }

  getStatusClass(objectif: number): string {
    if (objectif >= 100) return 'status--success';
    if (objectif >= 75) return 'status--primary';
    if (objectif >= 50) return 'status--warning';
    return 'status--danger';
  }
}
