import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs/esm';

import { IPlanVenteMission, MissionType, MissionStatus, NewPlanVenteMission } from './plan-vente.model';
import { PlanVenteService } from './plan-vente.service';
import { IUser } from 'app/admin/user-management/user-management.model';

@Component({
  selector: 'jhi-plan-vente',
  templateUrl: './plan-vente.component.html',
})
export class PlanVenteComponent implements OnInit {
  missions: IPlanVenteMission[] = [];
  commercials: IUser[] = [];
  isLoading = false;
  isSaving = false;

  filterCommercial = '';
  filterType = '';
  filterStatus = '';

  missionTypes: MissionType[] = ['VISITE', 'LIVRAISON', 'RECOUVREMENT', 'PROSPECTION', 'AUTRE'];
  missionStatuses: MissionStatus[] = ['PLANNED', 'IN_PROGRESS', 'DONE', 'CANCELLED'];

  // Semaine courante (lundi→dimanche)
  weekDays: { label: string; date: string }[] = [];

  createForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    missionType: new FormControl<MissionType>('VISITE', { nonNullable: true }),
    assignedToLogin: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    missionDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
  });

  private modalRef?: NgbModalRef;

  constructor(private planVenteService: PlanVenteService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.buildWeekDays();
    this.load();
    this.planVenteService.getCommercials().subscribe(users => (this.commercials = users));
  }

  buildWeekDays(): void {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    this.weekDays = days.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { label, date: d.toISOString().split('T')[0] };
    });
  }

  load(): void {
    this.isLoading = true;
    this.planVenteService.query({ size: 200 }).subscribe({
      next: res => {
        this.missions = res.body ?? [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  get filteredMissions(): IPlanVenteMission[] {
    return this.missions.filter(m => {
      const byCommercial = !this.filterCommercial || m.assignedToLogin === this.filterCommercial;
      const byType = !this.filterType || m.missionType === this.filterType;
      const byStatus = !this.filterStatus || m.status === this.filterStatus;
      return byCommercial && byType && byStatus;
    });
  }

  getMissionsFor(commercial: string, date: string): IPlanVenteMission[] {
    return this.filteredMissions.filter(m => m.assignedToLogin === commercial && m.missionDate?.format('YYYY-MM-DD') === date);
  }

  openCreateModal(content: any): void {
    this.createForm.reset({ missionType: 'VISITE' });
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  saveNewMission(): void {
    if (this.createForm.invalid) return;
    this.isSaving = true;
    const val = this.createForm.getRawValue();
    const newMission: NewPlanVenteMission = {
      id: null,
      title: val.title,
      missionType: val.missionType,
      assignedToLogin: val.assignedToLogin,
      missionDate: val.missionDate ? dayjs(val.missionDate) : null,
      description: val.description ?? null,
      status: 'PLANNED',
    };
    this.planVenteService.create(newMission).subscribe({
      next: () => {
        this.isSaving = false;
        this.modalRef?.close();
        this.load();
      },
      error: () => (this.isSaving = false),
    });
  }

  delete(id: number): void {
    if (confirm('Supprimer cette mission ?')) {
      this.planVenteService.delete(id).subscribe(() => this.load());
    }
  }
}
