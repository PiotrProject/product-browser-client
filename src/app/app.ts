import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { finalize } from 'rxjs';

import { Product } from './models/product';
import { ProductService } from './services/product.service';

import {
  ProductForm
} from './components/product-form/product-form';

import {
  ProductList
} from './components/product-list/product-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ProductForm,
    ProductList
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  products: Product[] = [];

  isLoadingProducts = false;

  constructor(
    private readonly productService: ProductService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.isLoadingProducts = true;

    this.productService
      .getProducts()
      .pipe(
        finalize(() => {
          this.isLoadingProducts = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({

        next: products => {
          this.products = [...products];
        },

        error: error => {
          console.error(
            'Błąd pobierania produktów:',
            error
          );
        }
      });
  }

  onProductAdded(
    product: Product
  ): void {

    this.products = [
      ...this.products,
      product
    ];
  }
}