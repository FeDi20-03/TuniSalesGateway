import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { IComplaint, NewComplaint, ComplaintType } from './complaint.model';
import { ComplaintService } from './complaint.service';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-complaint',
  templateUrl: './complaint.component.html',
})
export class ComplaintComponent implements OnInit {
  complaints: IComplaint[] = [];
  isLoading = false;
  isSaving = false;
  resolving: IComplaint | null = null;
  isAdmin = false;
  private modalRef?: NgbModalRef;

  complaintTypes: ComplaintType[] = ['PRODUIT_DEFECTUEUX', 'LIVRAISON', 'FACTURATION', 'SERVICE', 'AUTRE'];

  createForm = new FormGroup({
    type: new FormControl<ComplaintType>('AUTRE', { nonNullable: true }),
    description: new FormControl('', [Validators.required]),
    imei: new FormControl(''),
  });

  resolveForm = new FormGroup({
    resolution: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });

  constructor(
    private complaintService: ComplaintService,
    private accountService: AccountService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.accountService.hasAnyAuthority(['ROLE_ADMIN_COMMERCIAL', 'ROLE_ADMIN', 'ROLE_ADMIN_SYSTEME']);
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.complaintService.query({ size: 200 }).subscribe({
      next: res => {
        this.complaints = res.body ?? [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  openCreateModal(content: any): void {
    this.createForm.reset({ type: 'AUTRE' });
    this.modalRef = this.modalService.open(content);
  }

  openResolveModal(content: any, complaint: IComplaint): void {
    this.resolving = complaint;
    this.resolveForm.reset();
    this.modalRef = this.modalService.open(content);
  }

  save(): void {
    if (this.createForm.invalid) return;
    this.isSaving = true;
    const val = this.createForm.getRawValue();
    const newComplaint: NewComplaint = { id: null, type: val.type, description: val.description, imei: val.imei ?? null, status: 'OPEN' };
    this.complaintService.create(newComplaint).subscribe({
      next: () => {
        this.isSaving = false;
        this.modalRef?.close();
        this.load();
      },
      error: () => (this.isSaving = false),
    });
  }

  resolve(): void {
    if (!this.resolving || this.resolveForm.invalid) return;
    this.isSaving = true;
    this.complaintService.resolve(this.resolving.id, this.resolveForm.get('resolution')!.value!).subscribe({
      next: () => {
        this.isSaving = false;
        this.alertService.addAlert({ type: 'success', translationKey: 'complaint.resolved' });
        this.modalRef?.close();
        this.load();
      },
      error: () => (this.isSaving = false),
    });
  }

  delete(id: number): void {
    if (confirm('Supprimer cette réclamation ?')) {
      this.complaintService.delete(id).subscribe(() => this.load());
    }
  }
}
