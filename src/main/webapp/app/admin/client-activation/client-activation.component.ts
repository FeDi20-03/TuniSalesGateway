import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IUser } from '../user-management/user-management.model';

@Component({
  selector: 'jhi-client-activation',
  templateUrl: './client-activation.component.html',
})
export class ClientActivationComponent implements OnInit {
  pendingUsers: IUser[] = [];
  isLoading = false;
  processingId: number | null = null;

  private resourceUrl: string;

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/admin/users');
  }

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers(): void {
    this.isLoading = true;
    this.http.get<IUser[]>(`${this.resourceUrl}?activated=false&authority=ROLE_CLIENT`, { observe: 'response' }).subscribe({
      next: (res: HttpResponse<IUser[]>) => {
        this.pendingUsers = res.body ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  activate(user: IUser): void {
    if (user.id === null) return;
    this.processingId = user.id;
    const updated = { ...user, activated: true };
    this.http.put<IUser>(this.resourceUrl, updated).subscribe({
      next: () => {
        this.pendingUsers = this.pendingUsers.filter(u => u.id !== user.id);
        this.processingId = null;
      },
      error: () => {
        this.processingId = null;
      },
    });
  }

  reject(user: IUser): void {
    if (user.id === null) return;
    this.processingId = user.id;
    // Désactiver et retirer le rôle CLIENT = refus d'activation
    const updated = { ...user, activated: false, authorities: (user.authorities ?? []).filter(a => a !== 'ROLE_CLIENT') };
    this.http.put<IUser>(this.resourceUrl, updated).subscribe({
      next: () => {
        this.pendingUsers = this.pendingUsers.filter(u => u.id !== user.id);
        this.processingId = null;
      },
      error: () => {
        this.processingId = null;
      },
    });
  }
}
