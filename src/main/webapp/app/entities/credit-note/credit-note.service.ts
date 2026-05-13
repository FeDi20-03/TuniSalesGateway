import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICreditNote, NewCreditNote } from './credit-note.model';

type RestCN = Omit<ICreditNote, 'createdAt'> & { createdAt?: string | null };
export type EntityResponseType = HttpResponse<ICreditNote>;
export type EntityArrayResponseType = HttpResponse<ICreditNote[]>;

@Injectable({ providedIn: 'root' })
export class CreditNoteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credit-notes', 'businessservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cn: NewCreditNote): Observable<EntityResponseType> {
    return this.http.post<RestCN>(this.resourceUrl, cn, { observe: 'response' }).pipe(map(r => this.fromServer(r)));
  }

  update(cn: ICreditNote): Observable<EntityResponseType> {
    return this.http.put<RestCN>(`${this.resourceUrl}/${cn.id}`, cn, { observe: 'response' }).pipe(map(r => this.fromServer(r)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestCN[]>(this.resourceUrl, { params: createRequestOption(req), observe: 'response' })
      .pipe(map(r => r.clone({ body: r.body?.map(x => this.fromRest(x)) ?? null })));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  validate(id: number): Observable<EntityResponseType> {
    return this.http.post<RestCN>(`${this.resourceUrl}/${id}/validate`, {}, { observe: 'response' }).pipe(map(r => this.fromServer(r)));
  }

  apply(id: number): Observable<EntityResponseType> {
    return this.http.post<RestCN>(`${this.resourceUrl}/${id}/apply`, {}, { observe: 'response' }).pipe(map(r => this.fromServer(r)));
  }

  private fromRest(r: RestCN): ICreditNote {
    return { ...r, createdAt: r.createdAt ? dayjs(r.createdAt) : undefined };
  }

  private fromServer(res: HttpResponse<RestCN>): HttpResponse<ICreditNote> {
    return res.clone({ body: res.body ? this.fromRest(res.body) : null });
  }
}
