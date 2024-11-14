import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/modules/pagination';
import { Product } from '../../shared/modules/product';
import { Observable } from 'rxjs/internal/Observable';
import { ShopParams } from '../../shared/modules/shopParams';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = environment.baseUrl;
  private http: HttpClient = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];

  getProducts(shopParams: ShopParams): Observable<Pagination<Product>> {
    let params: HttpParams = new HttpParams();
    params.append('pageSize', 20);

  if (shopParams.brands && shopParams.brands.length > 0) {
    params = params.append('brands', shopParams.brands.join(','));
  }
  if (shopParams.types && shopParams.types.length > 0) {
    params = params.append('types', shopParams.types.join(','));
  }
  if (shopParams.sort) {
    params = params.append('sort', shopParams.sort);
  }
  if (shopParams.search) {
    params = params.append('search', shopParams.search);
  }
  if (shopParams.pageIndex) {
    params = params.append('pageIndex', shopParams.pageIndex);
  }
  if (shopParams.pageSize) {
    params = params.append('pageSize', shopParams.pageSize);
  }
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {params});
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
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
