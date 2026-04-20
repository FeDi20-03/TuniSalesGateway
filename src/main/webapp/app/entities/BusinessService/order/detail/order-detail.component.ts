import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrder } from '../order.model';
import { OrderStatus } from '../../../enumerations/order-status.model';

@Component({
  selector: 'jhi-order-detail',
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
  order: IOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
    });
  }

  validerCommande(): void {
    if (this.order) {
      this.order.status = OrderStatus.valide;
      // You may also want to call your orderService.update(this.order) and subscribe...
    }
  }

  rejeterCommande(): void {
    if (this.order) {
      this.order.status = OrderStatus.rejete;
      // You may also want to call your orderService.update(this.order) and subscribe...
    }
  }

  previousState(): void {
    window.history.back();
  }

  protected readonly OrderStatus = OrderStatus;
}
