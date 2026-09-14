import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { Product, CreateProduct } from './models/product';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  products: Product[] = [];

  newProduct: CreateProduct = {
    kod: '',
    nazwa: '',
    cena: 0
  };

  message = '';

  // loader dla pobierania listy
  isLoadingProducts = false;

  // loader dla dodawania produktu
  isAddingProduct = false;

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

          // wymuszamy aktualizację widoku
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({
        next: products => {
          this.products = [...products];
        },

        error: error => {
          console.error('Błąd pobierania produktów:', error);

          this.message =
            'Nie udało się pobrać produktów.';
        }
      });
  }

  addProduct(): void {

    // zabezpieczenie przed podwójnym kliknięciem
    if (this.isAddingProduct) {
      return;
    }

    const product: CreateProduct = {
      kod: this.newProduct.kod.trim(),
      nazwa: this.newProduct.nazwa.trim(),
      cena: Number(this.newProduct.cena)
    };

    if (
      !product.kod ||
      !product.nazwa ||
      product.cena <= 0
    ) {
      this.message =
        'Uzupełnij poprawnie wszystkie pola.';

      return;
    }

    this.isAddingProduct = true;
    this.message = '';

    this.productService
      .addProduct(product)
      .pipe(
        finalize(() => {
          this.isAddingProduct = false;

          // wymuszamy aktualizację widoku
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({

        next: createdProduct => {

          console.log(
            'Dodany produkt:',
            createdProduct
          );

          // Nie robimy dodatkowego GET.
          // Produkt zwrócony przez API dodajemy od razu
          // do aktualnej listy.
          this.products = [
            ...this.products,
            createdProduct
          ];

          this.message =
            'Produkt został dodany.';

          // czyszczenie formularza
          this.newProduct = {
            kod: '',
            nazwa: '',
            cena: 0
          };
        },

        error: error => {

          console.error(
            'Błąd dodawania produktu:',
            error
          );

          this.message =
            'Nie udało się dodać produktu.';
        }
      });
  }
}