import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  let accountService = inject(AccountService);
  let router = inject(Router);
  if (accountService.isAdmin()) return true;
  if (accountService.currentUser() == null) router.navigateByUrl('/login');
  else router.navigateByUrl('/shop');
  return false;
};
