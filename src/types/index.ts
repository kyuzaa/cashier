export interface User {
    id: number;
    username: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    products: Product[];
  }
  
  export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category_id: number;
    image: string | null;
    category?: Category;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface Transaction {
    id: number;
    nomor_meja: string;
    items: CartItem[];
    total_amount: number;
    status: '0' | '1' | '2'; // 0: pending, 1: process, 2: completed
    tanggal: string;
  }