export interface Product {
  id: number;
  kod: string;
  nazwa: string;
  cena: number;
}

export interface CreateProduct {
  kod: string;
  nazwa: string;
  cena: number;
}