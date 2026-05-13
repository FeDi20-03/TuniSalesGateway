import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBonusRule, NewBonusRule } from './bonus-rule.model';

type RestBonusRule = Omit<IBonusRule, 'periodStart' | 'periodEnd'> & {
  periodStart?: string | null;
  periodEnd?: string | null;
};

export type EntityResponseType = HttpResponse<IBonusRule>;
export type EntityArrayResponseType = HttpResponse<IBonusRule[]>;

@Injectable({ providedIn: 'root' })
export class BonusRuleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bonus-rules', 'businessservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bonusRule: NewBonusRule): Observable<EntityResponseType> {
    return this.http
      .post<RestBonusRule>(this.resourceUrl, this.toRest(bonusRule), { observe: 'response' })
      .pipe(map(res => this.fromServer(res)));
  }

  update(bonusRule: IBonusRule): Observable<EntityResponseType> {
    return this.http
      .put<RestBonusRule>(`${this.resourceUrl}/${bonusRule.id}`, this.toRest(bonusRule), { observe: 'response' })
      .pipe(map(res => this.fromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<RestBonusRule>(`${this.resourceUrl}/${id}`, { observe: 'response' }).pipe(map(res => this.fromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBonusRule[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: res.body ? res.body.map(r => this.fromRest(r)) : null })));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  private toRest(b: IBonusRule | NewBonusRule): RestBonusRule {
    return { ...b, periodStart: (b.periodStart as any)?.toJSON?.() ?? null, periodEnd: (b.periodEnd as any)?.toJSON?.() ?? null } as any;
  }

  private fromRest(r: RestBonusRule): IBonusRule {
    return { ...r, periodStart: r.periodStart ? dayjs(r.periodStart) : undefined, periodEnd: r.periodEnd ? dayjs(r.periodEnd) : undefined };
  }

  private fromServer(res: HttpResponse<RestBonusRule>): HttpResponse<IBonusRule> {
    return res.clone({ body: res.body ? this.fromRest(res.body) : null });
  }
}
