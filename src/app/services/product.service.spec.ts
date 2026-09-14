import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { CreateProduct, Product } from '../models/product';

describe('ProductService', () => {

  let service: ProductService;
  let httpMock: HttpTestingController;

  const apiUrl =
    'https://localhost:7208/api/products';

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service =
      TestBed.inject(ProductService);

    httpMock =
      TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get products', () => {

    const products: Product[] = [
      {
        id: 1,
        kod: 'P001',
        nazwa: 'Laptop',
        cena: 3500
      },
      {
        id: 2,
        kod: 'P002',
        nazwa: 'Monitor',
        cena: 1000
      }
    ];

    service.getProducts().subscribe(result => {
      expect(result).toEqual(products);
    });

    const request = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.urlWithParams.startsWith(apiUrl)
    );

    expect(request.request.method)
      .toBe('GET');

    request.flush(products);
  });

  it('should add product using POST', () => {

    const product: CreateProduct = {
      kod: 'P003',
      nazwa: 'Mysz',
      cena: 129.99
    };

    const createdProduct: Product = {
      id: 3,
      ...product
    };

    service.addProduct(product).subscribe(result => {
      expect(result).toEqual(createdProduct);
    });

    const request = httpMock.expectOne(req =>
      req.method === 'POST' &&
      req.urlWithParams.startsWith(apiUrl)
    );

    expect(request.request.method)
      .toBe('POST');

    expect(request.request.body)
      .toEqual(product);

    request.flush(createdProduct);
  });

});