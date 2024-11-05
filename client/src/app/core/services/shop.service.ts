import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/modules/pagination';
import { Product } from '../../shared/modules/product';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'http://localhost:5000/api/';
  private http: HttpClient = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];

  getProducts(brands? : string[], types? : string[]): Observable<Pagination<Product>> {
    let params: HttpParams = new HttpParams();
    params.append('pageSize', 20);

  if (brands && brands.length > 0) {
    params = params.append('brands', brands.join(','));
  }
  if (types && types.length > 0) {
    params = params.append('types', types.join(','));
  }
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {params});
  }

  getTypes(): void {
    this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: (response) => {
        this.types = response;
      },
      error: (error) => console.error(error)
    });
  }

  getBrands(): void {
    this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: (response) => {
        this.brands = response;
      },
      error: (error) => console.error(error)
    });
  }
}
