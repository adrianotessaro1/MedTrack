import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AccountService } from '../shared/services/account.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const accountService = inject(AccountService);

  const authToken = sessionStorage.getItem('auth-token');

  if (authToken) {
    return true;
  } else {
    router.navigate(['/account/login']);
    return false;
  }

  /*return accountService.verifyAuthentication().pipe(
    map((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        return true;
      } else {
        return router.createUrlTree(['/account/login']);
      }
    }
    ), catchError((error) => {
      return of(router.createUrlTree(['/account/login']));
    })
  ); */
};
