import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlanVenteMission, NewPlanVenteMission } from './plan-vente.model';
import { IUser } from 'app/admin/user-management/user-management.model';

export type EntityResponseType = HttpResponse<IPlanVenteMission>;
export type EntityArrayResponseType = HttpResponse<IPlanVenteMission[]>;

type RestMission = Omit<IPlanVenteMission, 'missionDate' | 'createdAt' | 'updatedAt'> & {
  missionDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

@Injectable({ providedIn: 'root' })
export class PlanVenteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/missions', 'businessservice');
  protected usersUrl = this.applicationConfigService.getEndpointFor('api/admin/users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mission: NewPlanVenteMission): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mission);
    return this.http
      .post<RestMission>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(mission: IPlanVenteMission): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mission);
    return this.http
      .put<RestMission>(`${this.resourceUrl}/${mission.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMission[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCommercials(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.usersUrl}?authority=ROLE_COMMERCIAL`);
  }

  private convertDateFromClient<T extends IPlanVenteMission | NewPlanVenteMission>(m: T): RestMission {
    return {
      ...m,
      missionDate: (m as any).missionDate?.toJSON() ?? null,
      createdAt: (m as any).createdAt?.toJSON() ?? null,
      updatedAt: (m as any).updatedAt?.toJSON() ?? null,
    } as RestMission;
  }

  private convertDateFromServer(r: RestMission): IPlanVenteMission {
    return {
      ...r,
      missionDate: r.missionDate ? dayjs(r.missionDate) : undefined,
      createdAt: r.createdAt ? dayjs(r.createdAt) : undefined,
      updatedAt: r.updatedAt ? dayjs(r.updatedAt) : undefined,
    };
  }

  private convertResponseFromServer(res: HttpResponse<RestMission>): HttpResponse<IPlanVenteMission> {
    return res.clone({ body: res.body ? this.convertDateFromServer(res.body) : null });
  }

  private convertResponseArrayFromServer(res: HttpResponse<RestMission[]>): HttpResponse<IPlanVenteMission[]> {
    return res.clone({ body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null });
  }
}
