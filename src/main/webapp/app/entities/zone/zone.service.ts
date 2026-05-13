import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IZone, NewZone, IClientAssignment } from './zone.model';

export type EntityResponseType = HttpResponse<IZone>;
export type EntityArrayResponseType = HttpResponse<IZone[]>;

@Injectable({ providedIn: 'root' })
export class ZoneService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/zones', 'businessservice');
  protected clientsUrl = this.applicationConfigService.getEndpointFor('api/clients', 'businessservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(zone: NewZone): Observable<EntityResponseType> {
    return this.http.post<IZone>(this.resourceUrl, zone, { observe: 'response' });
  }

  update(zone: IZone): Observable<EntityResponseType> {
    return this.http.put<IZone>(`${this.resourceUrl}/${zone.id}`, zone, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IZone>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IZone[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClientsByCommercial(login: string): Observable<IClientAssignment[]> {
    return this.http.get<IClientAssignment[]>(`${this.clientsUrl}/by-commercial/${login}`);
  }

  assignClientToCommercial(clientId: number, commercialLogin: string): Observable<any> {
    return this.http.post(`${this.clientsUrl}/${clientId}/assign`, { commercialLogin });
  }
}
