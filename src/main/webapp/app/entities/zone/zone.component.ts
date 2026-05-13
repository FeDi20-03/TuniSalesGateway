import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { IZone, NewZone, IClientAssignment } from './zone.model';
import { ZoneService } from './zone.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IUser } from 'app/admin/user-management/user-management.model';

@Component({
  selector: 'jhi-zone',
  templateUrl: './zone.component.html',
})
export class ZoneComponent implements OnInit {
  zones: IZone[] = [];
  commercials: IUser[] = [];
  selectedCommercial = '';
  clientAssignments: IClientAssignment[] = [];
  isLoading = false;
  isSaving = false;
  editingZone: IZone | null = null;

  zoneForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
  });

  assignForm = new FormGroup({
    commercialLogin: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    clientId: new FormControl<number | null>(null, [Validators.required]),
  });

  private modalRef?: NgbModalRef;

  constructor(
    private zoneService: ZoneService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadZones();
    this.loadCommercials();
  }

  loadZones(): void {
    this.isLoading = true;
    this.zoneService.query({ size: 200 }).subscribe({
      next: res => {
        this.zones = res.body ?? [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  loadCommercials(): void {
    const url = this.applicationConfigService.getEndpointFor('api/admin/users');
    this.http.get<IUser[]>(`${url}?authority=ROLE_COMMERCIAL`).subscribe(users => (this.commercials = users));
  }

  loadClientsByCommercial(): void {
    if (!this.selectedCommercial) return;
    this.zoneService.getClientsByCommercial(this.selectedCommercial).subscribe(clients => (this.clientAssignments = clients));
  }

  openCreateModal(content: any): void {
    this.editingZone = null;
    this.zoneForm.reset();
    this.modalRef = this.modalService.open(content);
  }

  openEditModal(content: any, zone: IZone): void {
    this.editingZone = zone;
    this.zoneForm.patchValue({ name: zone.name ?? '', description: zone.description ?? '' });
    this.modalRef = this.modalService.open(content);
  }

  saveZone(): void {
    if (this.zoneForm.invalid) return;
    this.isSaving = true;
    const val = this.zoneForm.getRawValue();
    if (this.editingZone) {
      this.zoneService.update({ ...this.editingZone, ...val }).subscribe({
        next: () => {
          this.isSaving = false;
          this.modalRef?.close();
          this.loadZones();
        },
        error: () => (this.isSaving = false),
      });
    } else {
      const newZone: NewZone = { id: null, name: val.name, description: val.description ?? null };
      this.zoneService.create(newZone).subscribe({
        next: () => {
          this.isSaving = false;
          this.modalRef?.close();
          this.loadZones();
        },
        error: () => (this.isSaving = false),
      });
    }
  }

  deleteZone(id: number): void {
    if (confirm('Supprimer cette zone ?')) {
      this.zoneService.delete(id).subscribe(() => this.loadZones());
    }
  }

  assignClient(clientId: number, commercialLogin: string): void {
    this.zoneService.assignClientToCommercial(clientId, commercialLogin).subscribe(() => this.loadClientsByCommercial());
  }
}
