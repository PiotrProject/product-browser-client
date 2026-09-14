import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { App } from './app';
import { ProductService } from './services/product.service';

describe('App', () => {

  const productServiceMock = {
    getProducts: () => of([]),

    addProduct: () => of({
      id: 1,
      kod: 'P001',
      nazwa: 'Produkt testowy',
      cena: 100
    })
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        App
      ],

      providers: [
        {
          provide: ProductService,
          useValue: productServiceMock
        }
      ]
    }).compileComponents();

  });

  it('should create the app', () => {

    const fixture =
      TestBed.createComponent(App);

    expect(
      fixture.componentInstance
    ).toBeTruthy();
  });

  it('should render title', () => {

    const fixture =
      TestBed.createComponent(App);

    fixture.detectChanges();

    const compiled =
      fixture.nativeElement as HTMLElement;

    expect(
      compiled.querySelector('h1')?.textContent
    ).toContain('Katalog produktów');
  });

});