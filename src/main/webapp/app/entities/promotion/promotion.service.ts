import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPromotion, NewPromotion } from './promotion.model';

type RestPromotion = Omit<IPromotion, 'startDate' | 'endDate'> & { startDate?: string | null; endDate?: string | null };
export type EntityResponseType = HttpResponse<IPromotion>;
export type EntityArrayResponseType = HttpResponse<IPromotion[]>;

@Injectable({ providedIn: 'root' })
export class PromotionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/promotions', 'businessservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(p: NewPromotion): Observable<EntityResponseType> {
    return this.http.post<RestPromotion>(this.resourceUrl, this.toRest(p), { observe: 'response' }).pipe(map(r => this.fromServer(r)));
  }

  update(p: IPromotion): Observable<EntityResponseType> {
    return this.http
      .put<RestPromotion>(`${this.resourceUrl}/${p.id}`, this.toRest(p), { observe: 'response' })
      .pipe(map(r => this.fromServer(r)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestPromotion[]>(this.resourceUrl, { params: createRequestOption(req), observe: 'response' })
      .pipe(map(r => r.clone({ body: r.body?.map(x => this.fromRest(x)) ?? null })));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  private toRest(p: any): RestPromotion {
    return { ...p, startDate: p.startDate?.toJSON?.() ?? null, endDate: p.endDate?.toJSON?.() ?? null };
  }

  private fromRest(r: RestPromotion): IPromotion {
    return { ...r, startDate: r.startDate ? dayjs(r.startDate) : undefined, endDate: r.endDate ? dayjs(r.endDate) : undefined };
  }

  private fromServer(res: HttpResponse<RestPromotion>): HttpResponse<IPromotion> {
    return res.clone({ body: res.body ? this.fromRest(res.body) : null });
  }
}
