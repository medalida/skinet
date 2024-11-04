import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getProducts(): Observable<Pagination<Product>> {
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products?pageSize=20');
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
