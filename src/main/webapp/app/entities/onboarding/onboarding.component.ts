import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-onboarding',
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent implements OnInit {
  clientId: number | null = null;
  currentStep = 1;
  isSaving = false;

  // Résultats des étapes
  createdPDV: any = null;
  createdRespPV: any = null;
  createdVendeurs: any[] = [];

  // Étape A : Point de vente
  pdvForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    contact: new FormControl('', [Validators.required, Validators.email]),
  });

  // Étape B : Responsable PV
  respForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.minLength(3)]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    langKey: new FormControl('fr', { nonNullable: true }),
  });

  // Étape C : Vendeurs (1..n)
  vendeursForm = new FormGroup({
    vendeurs: new FormArray([this.buildVendeurGroup()]),
  });

  private pdvUrl: string;
  private usersUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private alertService: AlertService
  ) {
    this.pdvUrl = this.applicationConfigService.getEndpointFor('api/points-de-vente', 'businessservice');
    this.usersUrl = this.applicationConfigService.getEndpointFor('api/admin/users');
  }

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id')) || null;
  }

  get vendeursArray(): FormArray {
    return this.vendeursForm.get('vendeurs') as FormArray;
  }

  buildVendeurGroup(): FormGroup {
    return new FormGroup({
      login: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  addVendeur(): void {
    this.vendeursArray.push(this.buildVendeurGroup());
  }

  removeVendeur(index: number): void {
    if (this.vendeursArray.length > 1) {
      this.vendeursArray.removeAt(index);
    }
  }

  // Étape A → créer PDV
  submitStepA(): void {
    if (this.pdvForm.invalid) return;
    this.isSaving = true;
    const payload = { ...this.pdvForm.getRawValue(), clientId: this.clientId };
    this.http.post<any>(this.pdvUrl, payload).subscribe({
      next: pdv => {
        this.createdPDV = pdv;
        this.isSaving = false;
        this.currentStep = 2;
      },
      error: () => (this.isSaving = false),
    });
  }

  // Étape B → créer Resp. PV
  submitStepB(): void {
    if (this.respForm.invalid) return;
    this.isSaving = true;
    const payload = {
      ...this.respForm.getRawValue(),
      activated: true,
      authorities: ['ROLE_RESP_PV'],
      pdvId: this.createdPDV?.id,
    };
    this.http.post<any>(this.usersUrl, payload).subscribe({
      next: user => {
        this.createdRespPV = user;
        this.isSaving = false;
        this.currentStep = 3;
      },
      error: () => (this.isSaving = false),
    });
  }

  // Étape C → créer Vendeurs
  submitStepC(): void {
    if (this.vendeursForm.invalid) return;
    this.isSaving = true;
    const vendeurs = this.vendeursArray.value;
    const requests = vendeurs.map((v: any) => ({
      ...v,
      activated: true,
      authorities: ['ROLE_VENDEUR'],
      pdvId: this.createdPDV?.id,
      respPVLogin: this.createdRespPV?.login,
    }));

    let completed = 0;
    requests.forEach((payload: any) => {
      this.http.post<any>(this.usersUrl, payload).subscribe({
        next: user => {
          this.createdVendeurs.push(user);
          completed++;
          if (completed === requests.length) {
            this.isSaving = false;
            this.currentStep = 4; // Récap
          }
        },
        error: () => {
          this.isSaving = false;
          this.alertService.addAlert({ type: 'danger', translationKey: 'onboarding.vendeurError' });
        },
      });
    });
  }

  finish(): void {
    this.alertService.addAlert({ type: 'success', translationKey: 'onboarding.success' });
    this.router.navigate(['/client', this.clientId, 'view']);
  }

  back(): void {
    if (this.currentStep > 1) this.currentStep--;
  }
}
