import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product, CreateProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = 'https://localhost:7208/api/products';

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?_ts=${Date.now()}`);
  }

  addProduct(product: CreateProduct): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
}