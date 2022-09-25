import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LoopbackService } from '../../../core/services/loopback.service';
import { Crud, CrudPosition, CrudUser } from './auth-http/auth-http.service';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;
  currentRole$: Observable<string[]>;
  currentRoleSubject: BehaviorSubject<string[]>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private loopbackService: LoopbackService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.currentRoleSubject = new BehaviorSubject<string[]>(['']);
    this.currentRole$ = this.currentRoleSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
    const subscrRole = this.getUserRole().subscribe();
    this.unsubscribe.push(subscrRole);
  }

  // public methods
  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((user: UserType) => {
        if (user) {
          console.log('me', user);
          this.loopbackService.storeToken(auth.authToken);
          this.currentUserSubject.next(user);
        } else {
          this.loopbackService.kickUser();
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getUserRole(): Observable<string[]> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of([]);
    }
    this.isLoadingSubject.next(true);
    return this.authHttpService.role(auth.authToken).pipe(
        map((role: string[]) => {
          console.log('role', role);
          this.currentRoleSubject.next(role);
          return role;
        }),
        finalize(() => this.isLoadingSubject.next(false))
    );
  }

  me(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService.getUserByToken(auth.authToken).pipe(
        map((user: UserType) => {
          return user;
        })
    );
  }

  roles(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService.role(auth.authToken).pipe(
        map((roles: string[]) => {
          return roles;
        })
    );
  }

  dictionary(crud?: Crud): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService.dictionary(auth.authToken, crud).pipe(
        map((permission: string[]) => {
          return permission;
        })
    );
  }

  office(officeId?: number, crud?: Crud): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService.office(auth.authToken, officeId, crud).pipe(
        map((permission: string[]) => {
          return permission;
        })
    );
  }

  company(crud?: Crud): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService.company(auth.authToken, crud).pipe(
        map((permission: string[]) => {
          return permission;
        })
    );
  }

  position(positionId?: number, crud?: CrudPosition): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService.position(auth.authToken, positionId, crud).pipe(
        map((permission: string[]) => {
          return permission;
        })
    );
  }

  positionOffice(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService.positionOffice(auth.authToken).pipe(
        map((offices: string[]) => {
          return offices;
        })
    );
  }

  user(userId?: number, crud?: CrudUser): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService.user(auth.authToken, userId, crud).pipe(
        map((permission: string[]) => {
          return permission;
        })
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
