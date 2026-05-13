import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs/esm';

import { IBonusRule, NewBonusRule } from './bonus-rule.model';
import { BonusRuleService } from './bonus-rule.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-bonus-rule',
  templateUrl: './bonus-rule.component.html',
})
export class BonusRuleComponent implements OnInit {
  bonusRules: IBonusRule[] = [];
  zones: any[] = [];
  products: any[] = [];
  isLoading = false;
  isSaving = false;
  editingRule: IBonusRule | null = null;
  private modalRef?: NgbModalRef;

  form = new FormGroup({
    productId: new FormControl<number | null>(null),
    productName: new FormControl(''),
    zoneId: new FormControl<number | null>(null),
    zoneName: new FormControl(''),
    periodStart: new FormControl('', [Validators.required]),
    periodEnd: new FormControl('', [Validators.required]),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    description: new FormControl(''),
  });

  constructor(
    private bonusRuleService: BonusRuleService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.load();
    this.http.get<any[]>(this.applicationConfigService.getEndpointFor('api/zones', 'businessservice')).subscribe(z => (this.zones = z));
    this.http
      .get<any[]>(this.applicationConfigService.getEndpointFor('api/products', 'businessservice'))
      .subscribe(p => (this.products = p));
  }

  load(): void {
    this.isLoading = true;
    this.bonusRuleService.query({ size: 200 }).subscribe({
      next: res => {
        this.bonusRules = res.body ?? [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  openModal(content: any, rule?: IBonusRule): void {
    this.editingRule = rule ?? null;
    if (rule) {
      this.form.patchValue({
        productId: rule.productId ?? null,
        productName: rule.productName ?? '',
        zoneId: rule.zoneId ?? null,
        zoneName: rule.zoneName ?? '',
        periodStart: rule.periodStart?.format('YYYY-MM-DD') ?? '',
        periodEnd: rule.periodEnd?.format('YYYY-MM-DD') ?? '',
        amount: rule.amount ?? null,
        description: rule.description ?? '',
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
    const payload: any = {
      ...val,
      periodStart: val.periodStart ? dayjs(val.periodStart) : null,
      periodEnd: val.periodEnd ? dayjs(val.periodEnd) : null,
    };
    const obs$ = this.editingRule
      ? this.bonusRuleService.update({ ...payload, id: this.editingRule.id })
      : this.bonusRuleService.create({ ...payload, id: null } as NewBonusRule);
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
    if (confirm('Supprimer cette règle de bonus ?')) {
      this.bonusRuleService.delete(id).subscribe(() => this.load());
    }
  }
}
