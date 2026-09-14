import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { ProductList } from './product-list';

describe('ProductList', () => {

  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        ProductList
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products', () => {

    component.products = [
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

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent)
      .toContain('Laptop');

    expect(element.textContent)
      .toContain('Monitor');

    const rows =
      element.querySelectorAll('tbody tr');

    expect(rows.length).toBe(2);
  });

  it('should show loading information', () => {

    component.isLoading = true;

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent)
      .toContain('Ładowanie produktów');
  });

  it('should show empty list information', () => {

    component.products = [];

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent)
      .toContain('Brak produktów');
  });
});