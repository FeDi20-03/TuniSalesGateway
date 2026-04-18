import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.scss'],
})
export class EquipeComponent implements OnInit {
  commerciaux = [
    { nom: 'Alice Dupont', ventes: 15600, objectif: 95, statut: 'Excellent' },
    { nom: 'Bob Martin', ventes: 12400, objectif: 82, statut: 'Bon' },
    { nom: 'Charlie Dubois', ventes: 9800, objectif: 75, statut: 'Moyen' },
    { nom: 'David Lee', ventes: 6500, objectif: 50, statut: 'À améliorer' },
    { nom: 'Sarah Connor', ventes: 21000, objectif: 110, statut: 'Exceptionnel' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
