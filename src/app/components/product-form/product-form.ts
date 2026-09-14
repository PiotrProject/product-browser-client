import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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