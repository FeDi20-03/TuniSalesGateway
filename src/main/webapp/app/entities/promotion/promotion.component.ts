import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs/esm';

import { IPromotion, NewPromotion } from './promotion.model';
import { PromotionService } from './promotion.service';

@Component({
  selector: 'jhi-promotion',
  templateUrl: './promotion.component.html',
})
export class PromotionComponent implements OnInit {
  promotions: IPromotion[] = [];
  isLoading = false;
  isSaving = false;
  editing: IPromotion | null = null;
  private modalRef?: NgbModalRef;

  form = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    discountPercent: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(100)]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    conditions: new FormControl(''),
  });

  constructor(private promotionService: PromotionService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.promotionService.query({ size: 200 }).subscribe({
      next: res => {
        this.promotions = res.body ?? [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  openModal(content: any, p?: IPromotion): void {
    this.editing = p ?? null;
    if (p) {
      this.form.patchValue({
        productName: p.productName ?? '',
        discountPercent: p.discountPercent ?? null,
        startDate: p.startDate?.format('YYYY-MM-DD') ?? '',
        endDate: p.endDate?.format('YYYY-MM-DD') ?? '',
        conditions: p.conditions ?? '',
      });
    } else {
      this.form.reset();
    }
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    const val = this.form.getRawValue();
    const payload = { ...val, startDate: dayjs(val.startDate!), endDate: dayjs(val.endDate!) };
    const obs$ = this.editing
      ? this.promotionService.update({ ...payload, id: this.editing.id } as IPromotion)
      : this.promotionService.create({ ...payload, id: null } as NewPromotion);
    obs$.subscribe({
      next: () => {
        this.isSaving = false;
        this.modalRef?.close();
        this.load();
      },
      error: () => (this.isSaving = false),
    });
  }

  delete(id: number): void {
    if (confirm('Supprimer cette promotion ?')) {
      this.promotionService.delete(id).subscribe(() => this.load());
    }
  }
}
