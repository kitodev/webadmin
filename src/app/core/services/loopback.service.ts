import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../store/index';
import { Credentials, Positions } from '../models/loopback.model';
import { SetAccountAction, SetTokenAction } from '../store/admin.action';
import { Observable, EMPTY, from, of } from 'rxjs';
import { catchError, map, retry, publishReplay, refCount, shareReplay, mergeMap } from 'rxjs/operators';
import { HeaderComponent } from '../../_metronic/layout/components/header/header.component';

class TokenObject {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoopbackService extends BaseService<any> {
  API_URL = `${environment.loopbackUrl}`;
  isBrowser: boolean;
  isServer: boolean;
  account: any;
  auth: Observable<any>;
  token: string | null;
  meObject: any;
  tokenName = 'ng_token';
  refreshTokenName = 'ng_refreshtoken';
  // tokenOptions = (environment.production ? {httpOnly: true, secure: true} : {});
  tokenOptions = (environment.production ? {} : {});
  siteStore$: any;
  private headerRef: HeaderComponent;

  constructor(
    @Inject(HttpClient) http: HttpClient,
    private store: Store<AppState>,
    private cookieService: CookieService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: any,
  ) {
    super(http);

    this.isBrowser = isPlatformBrowser(platformId);
    this.isServer = isPlatformServer(platformId);
    // this.getAccount();
  }

  setHeaderRef(ref: HeaderComponent): void {
    this.headerRef = ref;
  }

  ping(): Observable<any> {
    const url = `${this.API_URL}ping`;
    const params = {};
    this.serviceData = this.http.get(url).pipe(
        publishReplay(1), // this tells Rx to cache the latest emitted
        refCount() // and this tells Rx to keep the Observable alive as long as there are any Subscribers
    );
    return this.serviceData;
  }

  storeToken(token: string): void {
    // console.log('storeToken');
    this.token = token;
    this.store.dispatch(new SetTokenAction(this.token));
    if (this.isBrowser) {
      this.cookieService.put(this.tokenName, this.token, this.tokenOptions);
    }
    const sb = this.me().subscribe(me => {
          // console.log('storeToken me', me);
          if (me) {
            this.meObject = me;
            this.account = me;
            this.store.dispatch(new SetAccountAction(me));
            if (this.headerRef && this.headerRef.headerChanged) {
              this.headerRef.headerChanged();
            }
          // } else if (me) {
          //   this.kickUser();
          } else {
            this.meObject = {};
            this.account = null;
            this.store.dispatch(new SetAccountAction(this.account));
          }
        },
        err => {
          this.meObject = null;
          this.account = null;
          this.store.dispatch(new SetAccountAction(null));
          if (this.headerRef && this.headerRef.headerChanged) {
            this.headerRef.headerChanged();
          }
        });
    this.subscriptions.push(sb);
  }

  kickUser(): void {
    if (this.headerRef && this.headerRef.headerChanged) {
      this.headerRef.headerChanged();
    }
    this.logout();
    // console.log('routerNavigated', '/');
    this.router.navigate(['/']);
  }

  logout(): void {
    this.token = '';
    if (this.isBrowser) {
      this.cookieService.remove(this.refreshTokenName);
      this.cookieService.remove(this.tokenName);
    }
    this.meObject = null;
    this.account = null;
    this.store.dispatch(new SetTokenAction(null));
    this.store.dispatch(new SetAccountAction(null));
  }

  me(): Observable<any> {
    if (this.account) {
      return of(this.account);
    }
    const url = `${this.API_URL}admin/me`;
    if (this.token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      });
      const result = this.http.get(url, { headers }).pipe(
          publishReplay(1), // this tells Rx to cache the latest emitted
          refCount(), // and this tells Rx to keep the Observable alive as long as there are any Subscribers
          map(response => {
            return response;
          })
      );
      return result;
    }
    return EMPTY;
  }

  async fetch(method: string, url: string, params?: any, catchFn?: any): Promise<any> {
    if (!params) {
      params = {};
    }
    const fetching = (fetchMethod: string, fetchUrl: string, headers: any, fetchParams: any) => {
      if (fetchMethod === 'post') {
        return this.http.post(fetchUrl, fetchParams, { headers }).pipe(
            publishReplay(1), // this tells Rx to cache the latest emitted
            refCount(), // and this tells Rx to keep the Observable alive as long as there are any Subscribers
            map(response => {
              return response;
            }),
            catchError(err => {
              console.log('fetch ERROR', err);
              if (catchFn) {
                catchFn(err);
              }
              return EMPTY;
            })
        );
      } else if (fetchMethod === 'patch') {
        return this.http.patch(fetchUrl, fetchParams, { headers }).pipe(
            publishReplay(1), // this tells Rx to cache the latest emitted
            refCount(), // and this tells Rx to keep the Observable alive as long as there are any Subscribers
            map(response => {
              return response;
            }),
            catchError(err => {
              console.log('fetch ERROR', err);
              if (catchFn) {
                catchFn(err);
              }
              return EMPTY;
            })
        );
          } else if (fetchMethod === 'del' || fetchMethod === 'delete') {
          return this.http.delete(fetchUrl, { headers, params }).pipe(
              publishReplay(1), // this tells Rx to cache the latest emitted
              refCount(), // and this tells Rx to keep the Observable alive as long as there are any Subscribers
              map(response => {
                return response;
              }),
          );
      } else {
        return this.http.get(fetchUrl, { headers, params }).pipe(
            publishReplay(1), // this tells Rx to cache the latest emitted
            refCount(), // and this tells Rx to keep the Observable alive as long as there are any Subscribers
            map(response => {
              return response;
            }),
            catchError(err => {
              console.log('fetch ERROR', err);
              if (catchFn) {
                catchFn(err);
              }
              return EMPTY;
            })
        );
      }
    };
    if (!this.token) {
      this.kickUser();
      return EMPTY;
    } else {
      return fetching(method, url, new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      }), params);
    }
  }

  getValue(endpoint: string, id: number, field: string): any {
    const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const url = `${this.API_URL}${endpoint}/${id}`;
    const params = {
      where: JSON.stringify({isActive: 1})
    };
    if (!this.token) {
      this.kickUser();
      return EMPTY;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.get(url, {headers, params}).pipe(
        publishReplay(1), // this tells Rx to cache the latest emitted
        refCount(), // and this tells Rx to keep the Observable alive as long as there are any Subscribers
        map((response: any) => {
          if (response && response[field]) {
            return response[field];
          }
          return null;
        }),
        catchError(err => {
          console.log('fetch ERROR', err);
          if (err.status && err.status === 401) {
            this.kickUser();
            return EMPTY;
          }
          return EMPTY;
        })
    );
  }

  listFieldsOfWorkCategories(categoryId: number = 0, order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}fields-of-work-categories`;
    const whereObj: any = {
      and: [],
    };

    if (categoryId) {
      whereObj.and.push({fieldsOfWorkCategoryId: categoryId});
    }

    const params = {
      order,
      offset,
      where: JSON.stringify(whereObj),
    };

    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findFieldsOfWorkCategoryById(id: any): Observable<any> {
    const url = `${this.API_URL}fields-of-work-categories/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveFieldsOfWorkCategory(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}fields-of-work-categories`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}fields-of-work-categories/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  fieldsOfWorkCategoryCount(): Observable<any> {
    const url = `${this.API_URL}fields-of-work-categories/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteFieldsOfWorkCategory(id: any): Observable<any> {
    const url = `${this.API_URL}fields-of-work-categories/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listFieldsOfWorks(categoryId: number = 0, order: string[] = ['name ASC'], offset = 0, limit = 500): Observable<any> {
    const url = `${this.API_URL}fields-of-works`;
    const whereObj: any = {
      and: [],
    };
    if (categoryId) {
      whereObj.and.push({fieldsOfWorkCategoryId: categoryId});
    }
    const params = {
      order,
      offset,
      limit,
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  findFieldsOfWorkById(id: any): Observable<any> {
    const url = `${this.API_URL}fields-of-works/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveFieldsOfWork(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}fields-of-works`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}fields-of-works/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  fieldsOfWorkCount(): Observable<any> {
    const url = `${this.API_URL}fields-of-works/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteFieldsOfWork(id: any): Observable<any> {
    const url = `${this.API_URL}fields-of-works/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  listQualifications(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}qualifications`;
    const params = {
      order,
      offset,
      
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  findQualificationById(id: any): Observable<any> {
    const url = `${this.API_URL}qualifications/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveQualification(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}qualifications`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}qualifications/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  qualificationCount(): Observable<any> {
    const url = `${this.API_URL}qualifications/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteQualification(id: any): Observable<any> {
    const url = `${this.API_URL}qualifications/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listFieldsOfStudyCategories(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}fields-of-study-categories`;
    const params = {
      order,
      offset,
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  findFieldsOfStudyCategoryById(id: any): Observable<any> {
    const url = `${this.API_URL}fields-of-study-categories/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveFieldsOfStudyCategory(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}fields-of-study-categories`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}fields-of-study-categories/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  countFieldsOfStudyCategories(): Observable<any> {
    const url = `${this.API_URL}fields-of-study-categories/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteFieldsOfStudyCategory(id: any): Observable<any> {
    const url = `${this.API_URL}fields-of-study-categories/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listFieldsOfStudies(categoryId: number = 0, order: string[] = ['name ASC'], offset = 0, limit = 288): Observable<any> {
    const url = `${this.API_URL}fields-of-studies`;
    const whereObj: any = {
      and: [],
    };
    if (categoryId) {
      whereObj.and.push({fieldsOfStudyCategoryId: categoryId});
    }
    const params = {
      order,
      offset,
      limit,
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  findFieldsOfStudyById(id: any): Observable<any> {
    const url = `${this.API_URL}fields-of-studies/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveFieldsOfStudy(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}fields-of-studies`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}fields-of-studies/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  countFieldsOfStudy(): Observable<any> {
    const url = `${this.API_URL}fields-of-studies/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteFieldsOfStudy(id: any): Observable<any> {
    const url = `${this.API_URL}fields-of-studies/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listWorkTypeMds(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}work-type-mds`;
    const params = {
      order,
      offset,
      
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  findWorkTypeMdById(id: any): Observable<any> {
    const url = `${this.API_URL}work-type-mds/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveWorkTypeMd(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}work-type-mds`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}work-type-mds/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  countWorkTypeMd(): Observable<any> {
    const url = `${this.API_URL}work-type-mds/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteWorkTypeMd(id: any): Observable<any> {
    const url = `${this.API_URL}work-type-mds/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listComputerSkillCategories(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}computer-skill-categories`;
    const params = {
      order,
      offset,
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findComputerSkillCategoryById(id: any): Observable<any> {
    const url = `${this.API_URL}computer-skill-categories/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  saveComputerSkillCategory(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}computer-skill-categories`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}computer-skill-categories/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  deleteComputerSkillCategory(id: any): Observable<any> {
    const url = `${this.API_URL}computer-skill-categories/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listComputerSkills(categoryId: number = 0, order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}computer-skills`;
    const whereObj: any = {
      and: [],
    };
    if (categoryId) {
      whereObj.and.push({computerSkillCategoryId: categoryId});
    }
    const params = {
      order,
      offset,
      
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  findComputerSkillById(id: any): Observable<any> {
    const url = `${this.API_URL}computer-skills/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveComputerSkill(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}computer-skills`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}computer-skills/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
 
  countComputerSkill (): Observable<any> {
    const url = `${this.API_URL}computer-skills/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  deleteComputerSkill(id: any): Observable<any> {
    const url = `${this.API_URL}computer-skills/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listReferers(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}referers`;
    const params = {
      order,
      offset,
      
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findRefererById(id: any): Observable<any> {
    const url = `${this.API_URL}referers/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveReferer(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}referers`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}referers/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  countReferer(): Observable<any> {
    const url = `${this.API_URL}referers/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteReferer(id: any): Observable<any> {
    const url = `${this.API_URL}referers/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listCountries(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}countries`;
    const params = {
      order,
      offset,
      
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  findCountryById(id: any): Observable<any> {
    const url = `${this.API_URL}countries/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveCountry(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}countries`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}countries/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  countCountry(): Observable<any> {
    const url = `${this.API_URL}countries/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteCountry(id: any): Observable<any> {
    const url = `${this.API_URL}countries/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listCounties(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}counties`;
    const params = {
      order,
      offset,
      
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  findCountyById(id: any): Observable<any> {
    const url = `${this.API_URL}counties/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveCounty(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}counties`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}counties/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  deleteCounty(id: any): Observable<any> {
    const url = `${this.API_URL}counties/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listCities(cityId: number = 0, order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}cities`;
    const whereObj: any = {
      and: [],
    };

    if (cityId) {
      whereObj.and.push({countyId: cityId});
    }

    const params = {
      order,
      offset,
      
      where: JSON.stringify(whereObj),
    };
   
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findCityById(id: any): Observable<any> {
    const url = `${this.API_URL}cities/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  saveCity(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}cities`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}cities/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listCityCount(): Observable<any> {
    const url = `${this.API_URL}cities/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteCity(id: any): Observable<any> {
    const url = `${this.API_URL}cities/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listLanguages(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}languages`;
    const params = {
      order,
      offset,
      
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  findLanguageById(id: any): Observable<any> {
    const url = `${this.API_URL}languages/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveLanguage(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}languages`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}languages/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  languagesCount(): Observable<any> {
    const url = `${this.API_URL}languages/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteLanguage(id: any): Observable<any> {
    const url = `${this.API_URL}languages/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listDrivingLicences(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}driving-licences`;
    
    const params = {
      order,
      offset,
      
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  findDrivingLicenceById(id: any): Observable<any> {
    const url = `${this.API_URL}driving-licences/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveDrivingLicence(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}driving-licences`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}driving-licences/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  countDrivingLicence(): Observable<any> {
    const url = `${this.API_URL}driving-licences/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteDrivingLicence(id: any): Observable<any> {
    const url = `${this.API_URL}driving-licences/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listTagCategories(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}tag-categories`;
    const params = {
      order,
      offset,
      
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  findTagCategoryById(id: any): Observable<any> {
    const url = `${this.API_URL}tag-categories/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveTagCategory(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}tag-categories`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}tag-categories/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
      mergeMap(response => {
        return response;
      }),
    );
  }

  deleteTagCategory(id: any): Observable<any> {
    const url = `${this.API_URL}tag-categories/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  

  listTags(categoryId: number = 0, order: string[] = ['name ASC'], offset = 0, limit = 25): Observable<any> {
    const url = `${this.API_URL}tags`;
    const whereObj: any = {
      and: [],
    };
    if (categoryId) {
      whereObj.and.push({tagCategoryId: categoryId});
    }
    const params = {
      order,
      offset,
      limit,
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listTagsCount(): Observable<any> {
    const url = `${this.API_URL}tags/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findTagById(id: any): Observable<any> {
    const url = `${this.API_URL}tags/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  saveTag(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}tags`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}tags/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteTag(id: any): Observable<any> {
    const url = `${this.API_URL}tags/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listCompany(order: string[] = ['name ASC']): Observable<any> {
    const url = `${this.API_URL}companies`;
    const whereObj = {
      and: [],
    };
    const params = {
      order,
      
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findCompanyById(id: any): Observable<any> {
    const url = `${this.API_URL}companies/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  saveCompany(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}companies`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}companies/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteCompany(id: any): Observable<any> {
    const url = `${this.API_URL}companies/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listCompanyFieldsOfWorkCategories(companyId: number, offset = 0): Observable<any> {
    const url = `${this.API_URL}company-fields-of-work-categories/${companyId}`;
    const whereObj = {
      and: [],
    };
    const params = {
      offset,
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  saveCompanyFieldsOfWorkCategories(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}company-fields-of-work-categories`;
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteCompanyFieldsOfWorkCategories(companyId: any): Observable<any> {
    const url = `${this.API_URL}company-fields-of-work-categories/${companyId}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listOffice(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}offices`;
    const whereObj = {
      and: [],
    };
    const params = {
      order,
      offset,
      
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findOfficeById(id: any): Observable<any> {
    const url = `${this.API_URL}offices/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  saveOffice(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}offices`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}offices/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteOffice(id: any): Observable<any> {
    const url = `${this.API_URL}offices/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  

  listEmailSubscriber(order: string[] = ['name ASC'], offset = 0, limit = 225): Observable<any> {
    const url = `${this.API_URL}email-subscribers`;
    const whereObj = {
      and: [],
    };
    const params = {
      order,
      offset,
      limit,
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findEmailSubscriberById(id: any): Observable<any> {
    const url = `${this.API_URL}email-subscribers/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  saveEmailSubscriber(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}email-subscribers`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}email-subscribers/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteEmailSubscriber(id: any): Observable<any> {
    const url = `${this.API_URL}email-subscribers/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  listNewsletter(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}newsletters`;
    const whereObj = {
      and: [],
    };
    const params = {
      order,
      offset,
      
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findNewsletterById(id: any): Observable<any> {
    const url = `${this.API_URL}newsletters/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  saveNewsletter(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}newsletters`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}newsletters/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteNewsletter(id: any): Observable<any> {
    const url = `${this.API_URL}newsletters/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listSpareTimes(order: string[] = ['name ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}spare-times`;
    const whereObj = {
      and: [],
    };
    const params = {
      order,
      offset,
      
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findSpareTimeById(id: any): Observable<any> {
    const url = `${this.API_URL}spare-times/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  saveSpareTime(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}spare-times`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}spare-times/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  countSparetime(): Observable<any> {
    const url = `${this.API_URL}spare-times/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteSpareTime(id: any): Observable<any> {
    const url = `${this.API_URL}spare-times/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listUserHcs(order: string[] = ['userId ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}user-hcs`;
    const params = {
      order,
      offset,
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findUserHcsById(id: any): Observable<any> {
    const url = `${this.API_URL}user-hcs/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  saveUserHcs(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}user-hcs`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}user-hcs/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  countUserHcs(): Observable<any> {
    const url = `${this.API_URL}user-hcs/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findPositionsComputerSkillsById(id: any): Observable<any> {
    const url = `${this.API_URL}positions/${id}/position-computer-skills`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findPositionsLanguagesById(id: any): Observable<any> {
    const url = `${this.API_URL}positions/${id}/position-languages`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findPositionsQualificationById(id: any): Observable<any> {
    const url = `${this.API_URL}positions/${id}/position-qualifications`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  findPositionsTagById(id: any): Observable<any> {
    const url = `${this.API_URL}positions/${id}/position-tags`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listPositions(order: string[] = ['id ASC'], offset = 0, limit = 647): Observable<any> {
    const url = `${this.API_URL}positions`;
    const whereObj = {
      and: [],
    };
    const params = {
      order,
      offset,
      limit,
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findPositionsById(id: number): Observable<any> {
    const url = `${this.API_URL}positions/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  savePositions(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}position-md`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}position-md/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  countPositions(): Observable<any> {
    const url = `${this.API_URL}positions/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deletePositions(id: any): Observable<any> {
    const url = `${this.API_URL}positions/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listPositionMd(order: string[] = ['positionId ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}position-md`;
    const params = {
      order,
      offset,
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findPositionMdById(id: any): Observable<any> {
    const url = `${this.API_URL}position-md/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  savePositionMd(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}position-md`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}position-md/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  countPositionMd(): Observable<any> {
    const url = `${this.API_URL}position-md/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deletePositionMd(id: any): Observable<any> {
    const url = `${this.API_URL}position-md/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listPositionHcs(order: string[] = ['positionId ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}position-hcs`;
    const params = {
      order,
      offset,
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findPositionHcsById(id: any): Observable<any> {
    const url = `${this.API_URL}position-hcs/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  savePositionHcs(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}position-hcs`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}position-hcs/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  countPositionHcs(): Observable<any> {
    const url = `${this.API_URL}position-hcs/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deletePositionHcs(id: any): Observable<any> {
    const url = `${this.API_URL}position-hcs/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  listUser(order: string[] = ['username ASC'], offset = 0): Observable<any> {
    const url = `${this.API_URL}users`;
    const params = {
      order,
      offset,
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  findUserById(id: any): Observable<any> {
    const url = `${this.API_URL}users/${id}`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  saveUser(data: any, catchFn?: any): Observable<any> {
    let method = 'post';
    let url = `${this.API_URL}users`;
    if (data && data.id) {
      method = 'patch';
      url = `${this.API_URL}users/${data.id}`;
    }
    return from(this.fetch(method, url, data, catchFn)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  countUser(): Observable<any> {
    const url = `${this.API_URL}users/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  deleteUserHcs(id: any): Observable<any> {
    const url = `${this.API_URL}user-hcs/${id}`;
    return from(this.fetch('delete', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }
  
  listUserDeletionLogs(order: string[] = ['name ASC'], offset = 0, limit = 500): Observable<any> {
    const url = `${this.API_URL}user-deletion-logs`;
    const whereObj: any = {
      and: [],
    };
    const params = {
      order,
      offset,
      limit,
      where: JSON.stringify(whereObj),
    };
    return from(this.fetch('get', url, params)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

  userDeletionLogsCount(): Observable<any> {
    const url = `${this.API_URL}user-deletion-logs/count`;
    return from(this.fetch('get', url)).pipe(
        mergeMap(response => {
          return response;
        }),
    );
  }

}
