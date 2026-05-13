import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IComplaint, NewComplaint } from './complaint.model';

type RestComplaint = Omit<IComplaint, 'createdAt' | 'resolvedAt'> & { createdAt?: string | null; resolvedAt?: string | null };
export type EntityResponseType = HttpResponse<IComplaint>;
export type EntityArrayResponseType = HttpResponse<IComplaint[]>;

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/complaints', 'businessservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(c: NewComplaint): Observable<EntityResponseType> {
    return this.http.post<RestComplaint>(this.resourceUrl, c, { observe: 'response' }).pipe(map(r => this.fromServer(r)));
  }

  update(c: IComplaint): Observable<EntityResponseType> {
    return this.http.put<RestComplaint>(`${this.resourceUrl}/${c.id}`, c, { observe: 'response' }).pipe(map(r => this.fromServer(r)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestComplaint[]>(this.resourceUrl, { params: createRequestOption(req), observe: 'response' })
      .pipe(map(r => r.clone({ body: r.body?.map(x => this.fromRest(x)) ?? null })));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  resolve(id: number, resolution: string): Observable<EntityResponseType> {
    return this.http
      .post<RestComplaint>(`${this.resourceUrl}/${id}/resolve`, { resolution }, { observe: 'response' })
      .pipe(map(r => this.fromServer(r)));
  }

  private fromRest(r: RestComplaint): IComplaint {
    return {
      ...r,
      createdAt: r.createdAt ? dayjs(r.createdAt) : undefined,
      resolvedAt: r.resolvedAt ? dayjs(r.resolvedAt) : undefined,
    };
  }

  private fromServer(res: HttpResponse<RestComplaint>): HttpResponse<IComplaint> {
    return res.clone({ body: res.body ? this.fromRest(res.body) : null });
  }
}
