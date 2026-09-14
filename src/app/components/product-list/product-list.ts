import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';

import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {

  @Input()
  products: Product[] = [];

  @Input()
  isLoading = false;
}