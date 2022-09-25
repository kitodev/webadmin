import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/index';
import { SetRouteAction } from '../store/admin.action';

const allowedLanguages = ['hu', 'en'];

@Injectable({
  providedIn: 'root'
})
export class UrlRewriteGuard implements CanActivate {

  constructor(
    private store: Store<AppState>
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const action = new SetRouteAction(route.data);
    this.store.dispatch(action);

    return true;
    /*
     return this.next.params.pipe(
     map(params => {
     // console.log('UrlRewriteGuard', params);
     return params && allowedLanguages.includes(params.language)
     ? true
     : this.router.parseUrl(RouteHelper.paths.errorNotFound);
     })
     );
     */
  }

}
