import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ICreditNote, NewCreditNote } from './credit-note.model';
import { CreditNoteService } from './credit-note.service';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-credit-note',
  templateUrl: './credit-note.component.html',
})
export class CreditNoteComponent implements OnInit {
  creditNotes: ICreditNote[] = [];
  isLoading = false;
  isSaving = false;
  editing: ICreditNote | null = null;
  isAdminCommercial = false;
  private modalRef?: NgbModalRef;

  form = new FormGroup({
    clientName: new FormControl('', [Validators.required]),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    reason: new FormControl('', [Validators.required]),
  });

  constructor(
    private creditNoteService: CreditNoteService,
    private accountService: AccountService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isAdminCommercial = this.accountService.hasAnyAuthority(['ROLE_ADMIN_COMMERCIAL', 'ROLE_ADMIN']);
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.creditNoteService.query({ size: 200 }).subscribe({
      next: res => {
        this.creditNotes = res.body ?? [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  openModal(content: any, cn?: ICreditNote): void {
    this.editing = cn ?? null;
    if (cn) {
      this.form.patchValue({ clientName: cn.clientName ?? '', amount: cn.amount ?? null, reason: cn.reason ?? '' });
    } else {
      this.form.reset();
    }
    this.modalRef = this.modalService.open(content);
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    const val = this.form.getRawValue();
    const obs$ = this.editing
      ? this.creditNoteService.update({ ...this.editing, ...val } as ICreditNote)
      : this.creditNoteService.create({ ...val, id: null, status: 'DRAFT' } as NewCreditNote);
    obs$.subscribe({
      next: () => {
        this.isSaving = false;
        this.modalRef?.close();
        this.load();
      },
      error: () => (this.isSaving = false),
    });
  }

  validate(cn: ICreditNote): void {
    this.creditNoteService.validate(cn.id).subscribe({
      next: () => {
        this.alertService.addAlert({ type: 'success', translationKey: 'creditNote.validated' });
        this.load();
      },
      error: () => this.alertService.addAlert({ type: 'danger', translationKey: 'creditNote.error' }),
    });
  }

  delete(id: number): void {
    if (confirm('Supprimer cet avoir ?')) {
      this.creditNoteService.delete(id).subscribe(() => this.load());
    }
  }
}
