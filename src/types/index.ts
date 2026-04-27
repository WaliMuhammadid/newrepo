export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Cosmetics' | 'Baby Products';
  imageURL: string;
  stockStatus: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AdminUser {
  email: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
