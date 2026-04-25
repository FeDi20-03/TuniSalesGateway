import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Assurez-vous que ces chemins correspondent bien à vos modèles
import { IClient } from 'app/entities/BusinessService/client/client.model';
import { IProduct } from 'app/entities/BusinessService/product/product.model';
import { ClientService } from 'app/entities/BusinessService/client/service/client.service';
import { ProductService } from 'app/entities/BusinessService/product/service/product.service'; // Si vous l'avez
import { NewOrder } from 'app/entities/BusinessService/order/order.model';
import { IOrderLine } from 'app/entities/BusinessService/order-line/order-line.model';
import { OrderService } from 'app/entities/BusinessService/order/service/order.service';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-order-new-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule], // StepperComponent retiré
  templateUrl: './order-new-wizard.component.html',
  styleUrls: ['./order-new-wizard.component.scss'],
})
export class OrderNewWizardComponent implements OnInit {
  currentStep = 1;
  submitted = false;
  animationClass = 'slide-in';
  orderReference = '';
  isOffline = false;
  isSubmitting = false;

  // Step 1
  searchQueryClient = '';
  clients: IClient[] = [];
  selectedClient: IClient | null = null;

  // Step 2
  searchQueryProduct = '';
  products: IProduct[] = [];

  // Variables d'état locales pour remplacer VenteState
  cart: { [productId: number]: number } = {};
  notes = '';

  constructor(
    private router: Router,
    private clientService: ClientService,
    private productService: ProductService, // Si vous l'avez
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Récupère les clients depuis la base de données
    this.clientService.query().subscribe({
      next: res => {
        this.clients = res.body || [];
      },
      error: () => {
        console.error('Erreur lors du chargement des clients');
      },
    });

    // Pareil pour les produits
    this.productService.query().subscribe({
      next: res => {
        this.products = res.body || [];
      },
    });
  }

  // --- LOGIQUE CLIENT ---
  get filteredClients(): IClient[] {
    if (!this.searchQueryClient) return this.clients;
    const q = this.searchQueryClient.toLowerCase();
    return this.clients.filter(c => (c.name || '').toLowerCase().includes(q) || (c.id?.toString() || '').toLowerCase().includes(q));
  }

  selectClient(client: IClient): void {
    this.selectedClient = client;
  }

  // --- LOGIQUE PRODUIT ---
  get filteredProducts(): IProduct[] {
    if (!this.searchQueryProduct) return this.products;
    const q = this.searchQueryProduct.toLowerCase();
    return this.products.filter(p => (p.name || '').toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q));
  }

  // --- LOGIQUE DU PANIER (Cart) ---
  getProductQty(productId: number): number {
    return this.cart[productId] || 0;
  }

  changeQty(productId: number, delta: number): void {
    const currentQty = this.cart[productId] || 0;
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      delete this.cart[productId]; // Supprime du panier si quantité = 0
    } else {
      this.cart[productId] = newQty; // Met à jour la quantité
    }
  }

  get cartCount(): number {
    return Object.values(this.cart).reduce((total, qty) => total + qty, 0);
  }

  get cartTotal(): number {
    return Object.keys(this.cart).reduce((total, idStr) => {
      const id = Number(idStr);
      const product = this.products.find(p => p.id === id);
      // Remplacez `.price` par l'attribut réel de prix dans votre IProduct s'il est différent
      const price = product ? (product as any).price || 0 : 0;
      return total + price * this.cart[id];
    }, 0);
  }

  get cartItems() {
    return Object.keys(this.cart).map(idStr => {
      const id = Number(idStr);
      const product = this.products.find(p => p.id === id);
      return { product, qty: this.cart[id] };
    });
  }

  updateNotes(notes: string): void {
    this.notes = notes;
  }

  // --- NAVIGATION WIZARD ---
  nextStep(): void {
    if (this.currentStep === 1 && !this.selectedClient) return;
    if (this.currentStep < 3) {
      this.animationClass = 'slide-in';
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.animationClass = 'slide-back';
      this.currentStep--;
    }
  }

  // --- SOUMISSION DE LA COMMANDE ---
  generateRef(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CMD-${new Date().getTime().toString().slice(-6)}-${random}`;
  }

  submitOrder(offline: boolean): void {
    this.isOffline = offline;
    this.orderReference = this.generateRef();
    this.isSubmitting = true;

    if (!offline) {
      const orderLines: IOrderLine[] = this.cartItems.map(item => {
        const qty = item.qty;
        const unitPrice = item.product ? (item.product as any).price || 0 : 0;
        const lineTotal = qty * unitPrice;

        return {
          quantity: qty,
          unitPrice: unitPrice,
          lineTotal: lineTotal,
          product: { id: item.product!.id } as IProduct,
          createdAt: dayjs(),
        } as IOrderLine;
      });

      const newOrder = {
        tenantId: 1,
        orderNumber: this.orderReference,
        status: OrderStatus.enAttente,
        subtotal: this.cartTotal,
        taxAmount: 0,
        totalAmount: this.cartTotal,
        isDeleted: false,
        createdAt: dayjs(),
        client: { id: this.selectedClient!.id } as IClient,
        orderLines: orderLines,
      } as NewOrder;

      this.orderService.create(newOrder).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitted = true;
          console.log('Commande créée avec succès !');
        },
        error: () => {
          this.isSubmitting = false;
          alert('Erreur lors de la création de la commande');
        },
      });
    } else {
      // Simulation pour le offline
      setTimeout(() => {
        console.log('Commande hors ligne créée avec succès : ', {
          reference: this.orderReference,
          client: this.selectedClient,
          items: this.cartItems,
          total: this.cartTotal,
          notes: this.notes,
          offline: this.isOffline,
        });

        this.isSubmitting = false;
        this.submitted = true;
      }, 1000);
    }
  }

  // --- RÉINITIALISATION ---
  resetWizard(): void {
    // On vide tout manuellement
    this.cart = {};
    this.notes = '';
    this.selectedClient = null;
    this.currentStep = 1;
    this.submitted = false;
    this.animationClass = 'slide-in';
    this.searchQueryClient = '';
    this.searchQueryProduct = '';

    // Redirection vers la liste
    this.router.navigate(['/order']);
  }
}
