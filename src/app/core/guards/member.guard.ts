import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoopbackService } from '../services/loopback.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberGuard implements CanActivate {
  constructor(
    private loopbackService: LoopbackService,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    /*
    return this.loopbackService.meGuard().pipe(
      map(e => {
        if (e) {
          return true;
        } else {
          this.router.navigate(['/member/login']);
          return false;
        }
      }), catchError((err) => {
        this.router.navigate(['/member/login']);
        return of(false);
      })
    );
    */
  }
}
