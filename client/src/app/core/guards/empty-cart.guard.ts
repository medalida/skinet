import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ShopService } from '../services/shop.service';
import { CartService } from '../services/cart.service';
import { EMPTY, empty } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const EmptyCartGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const cartService = inject(CartService);
  const router = inject(Router);
  const snack = inject(SnackbarService);

  if (!cartService.cart()?.items.length) {
    snack.error("Your cart is empty");
    router.navigateByUrl("/cart");
    return false;
  }
  return true;
};
