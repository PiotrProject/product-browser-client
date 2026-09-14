import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { finalize } from 'rxjs';

import {
  CreateProduct,
  Product
} from '../../models/product';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm {

  @Output()
  productAdded = new EventEmitter<Product>();

  newProduct: CreateProduct = {
    kod: '',
    nazwa: '',
    cena: 0
  };

  message = '';

  isAddingProduct = false;

  constructor(
    private readonly productService: ProductService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  addProduct(): void {

    if (this.isAddingProduct) {
      return;
    }

    const product: CreateProduct = {
      kod: this.newProduct.kod.trim(),
      nazwa: this.newProduct.nazwa.trim(),
      cena: Number(this.newProduct.cena)
    };

    // Walidacja po stronie frontendu
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
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({

        // 201 Created trafia tutaj jako sukces
        next: createdProduct => {

          this.message =
            'Produkt został dodany.';

          this.newProduct = {
            kod: '',
            nazwa: '',
            cena: 0
          };

          this.productAdded.emit(createdProduct);
        },

        // Statusy 4xx / 5xx trafiają tutaj
        error: (error: HttpErrorResponse) => {

          console.error(
            'Błąd dodawania produktu:',
            error
          );

          switch (error.status) {

            case 400:
              this.message =
                'Dane produktu są niepoprawne.';
              break;

            case 409:
              this.message =
                error.error?.message ??
                'Produkt o takim kodzie już istnieje.';
              break;

            case 500:
              this.message =
                'Wystąpił błąd serwera. Spróbuj ponownie później.';
              break;

            case 0:
              this.message =
                'Brak połączenia z serwerem.';
              break;

            default:
              this.message =
                'Wystąpił nieoczekiwany błąd.';
              break;
          }
        }
      });
  }
}