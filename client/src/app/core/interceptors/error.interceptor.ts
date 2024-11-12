import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, delay, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbar = inject(SnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        router.navigateByUrl('/not-found');
      }

      if (error.status === 400) {
        if (error.error.errors) {
          const errors = error.error.errors;
          let modelStateErrors = [];
          for (const key in errors) {
            if (errors[key]) {
              modelStateErrors.push(errors[key]);
            }
          }
          throw modelStateErrors.flat();
        } else {
          snackbar.error(error.error.title || error.error);
        }
      }

      if (error.status === 401) {
        snackbar.error(error.error.title || error.error);
      }

      if (error.status === 500) {
        const navigationExtras: NavigationExtras = { state: { error: error.error } };
        router.navigateByUrl('/server-error', navigationExtras);
      }

      throw error;
    })
  );
};
