import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { of } from 'rxjs';

import { ProductForm } from './product-form';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

describe('ProductForm', () => {

  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;

  const createdProduct: Product = {
    id: 10,
    kod: 'P010',
    nazwa: 'Monitor',
    cena: 999
  };

  const productServiceMock = {
    addProduct: () => of(createdProduct)
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        ProductForm
      ],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject invalid product', () => {

    component.newProduct = {
      kod: '',
      nazwa: '',
      cena: 0
    };

    component.addProduct();

    expect(component.message)
      .toBe('Uzupełnij poprawnie wszystkie pola.');
  });

  it('should emit added product', () => {

    let emittedProduct: Product | undefined;

    component.productAdded.subscribe(product => {
      emittedProduct = product;
    });

    component.newProduct = {
      kod: 'P010',
      nazwa: 'Monitor',
      cena: 999
    };

    component.addProduct();

    expect(emittedProduct)
      .toEqual(createdProduct);
  });

  it('should clear form after adding product', () => {

    component.newProduct = {
      kod: 'P010',
      nazwa: 'Monitor',
      cena: 999
    };

    component.addProduct();

    expect(component.newProduct).toEqual({
      kod: '',
      nazwa: '',
      cena: 0
    });
  });
});