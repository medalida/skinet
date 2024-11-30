import { CanActivateFn, Router } from '@angular/router';
import { CheckoutService } from '../services/checkout.service';
import { inject } from '@angular/core';

export const checkoutCompleteGuard: CanActivateFn = (route, state) => {
  const checkoutService = inject(CheckoutService);
  const router = inject(Router);
  if (checkoutService.checkoutComplete) return true;
  router.navigateByUrl('/shop');
  return false;
};
