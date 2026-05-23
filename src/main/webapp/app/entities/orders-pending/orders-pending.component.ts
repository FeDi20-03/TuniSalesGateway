import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IOrder } from 'app/entities/BusinessService/order/order.model';
import { OrderService } from 'app/entities/BusinessService/order/service/order.service';
import { AlertService } from 'app/core/util/alert.service';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';

@Component({
  selector: 'jhi-orders-pending',
  templateUrl: './orders-pending.component.html',
})
export class OrdersPendingComponent implements OnInit {
  orders: IOrder[] = [];
  isLoading = false;
  selectedOrder: IOrder | null = null;
  reasonControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  actionType: 'negotiate' | 'reject' | null = null;
  private modalRef?: NgbModalRef;

  private resourceUrl: string;

  constructor(
    private orderService: OrderService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private router: Router
  ) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/orders', 'businessservice');
  }

  goToDetail(order: IOrder): void {
    if (order.id != null) {
      this.router.navigate(['/order', order.id, 'view']);
    }
  }

  ngOnInit(): void {
    this.load();
  }

  // Charger les commandes avec le statut legacy ET le nouveau
  load(): void {
    this.isLoading = true;
    this.orderService.query({ 'status.equals': OrderStatus.SUBMITTED, size: 200 }).subscribe({
      next: res => {
        this.orders = res.body ?? [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  accept(order: IOrder): void {
    this.http.post(`${this.resourceUrl}/${order.id}/validate`, {}).subscribe({
      next: () => {
        this.alertService.addAlert({ type: 'success', translationKey: 'ordersPending.accepted' });
        this.load();
      },
      error: err => {
        console.error('Action accepter échouée', err);
        const detail = err?.error?.detail || err?.error?.title || err?.message || 'Erreur inconnue';
        this.alertService.addAlert({ type: 'danger', message: `Échec : ${detail}` });
      },
    });
  }

  openNegotiateModal(order: IOrder, content: any): void {
    this.selectedOrder = order;
    this.actionType = 'negotiate';
    this.reasonControl.reset();
    this.modalRef = this.modalService.open(content);
  }

  openRejectModal(order: IOrder, content: any): void {
    this.selectedOrder = order;
    this.actionType = 'reject';
    this.reasonControl.reset();
    this.modalRef = this.modalService.open(content);
  }

  confirmAction(): void {
    if (!this.selectedOrder || this.reasonControl.invalid) return;
    const reason = this.reasonControl.value;
    const endpoint = this.actionType === 'negotiate' ? 'negotiate' : 'reject';
    this.http.post(`${this.resourceUrl}/${this.selectedOrder.id}/${endpoint}`, { reason }).subscribe({
      next: () => {
        this.alertService.addAlert({
          type: 'success',
          translationKey: this.actionType === 'negotiate' ? 'ordersPending.negotiated' : 'ordersPending.rejected',
        });
        this.modalRef?.close();
        this.load();
      },
      error: err => {
        console.error('Action confirm échouée', err);
        const detail = err?.error?.detail || err?.error?.title || err?.message || 'Erreur inconnue';
        this.alertService.addAlert({ type: 'danger', message: `Échec : ${detail}` });
      },
    });
  }
}
