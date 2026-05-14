import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Product = { id: string; sku: string; name: string; category: string; uom: string; price: string; image?: string };
export type Customer = { name: string; phone: string; whatsapp: string; address: string; tin: string; orders: number };
export type Order = { id: string; customer: string; phone: string; date: string; items: number; amount: string; status: string; address: string; tin: string };

export const CATEGORIES = ['All Products','Pooja Items','Lamp Items','Grocery','Prayer Items','Incense Sticks','Camphor','Kumkum','Turmeric','Sandalwood','Rose Water','Ghee Products','Oil Products','Agarbathi','Vilakku','Agal Vilakku','Brass Items','Steel Items','Plastic Items','Paper Products','Festival Items','Deepavali Items','Thaipusam Items','Pongal Items','Temple Supplies','Garlands','Flowers','Coconut Items','Betel Products','Rice Products','Flour Products','Spices','Masala','Snacks','Biscuits','Drinks','Dairy','Frozen','Cleaning Items','Household','Kitchen Items','Disposable','Packaging','Textiles','Religious Books','Calendars','Photos','Frames','Statues','Gift Items','Seasonal Offers','Wholesale Deals','New Arrivals','Top Selling','Premium Products','Budget Products','Bulk Pack','Retail Pack','Imported Items','Local Items','South Indian Items','North Indian Items','Malaysia Products','Sri Lanka Products','Indonesia Products','Thailand Products','China Products','General Trading','Appalam','Pori','Margarine','Rice Bags','Sugar','Salt','Tea','Coffee','Noodles','Sauces','Canned Food','Dry Food','Nuts','Dates','Sweets','Health Food','Baby Products','Personal Care','Beauty Products','Stationery','Electrical','Hardware','Toys','Decorations','Candles','Wicks','Threads','Containers','Bottles','Boxes','Labels','Others'];
export const UOMS = ['PCS','BOX','CTN','PKT','KG','LITRE'];

function makeProducts(): Product[] { return Array.from({length:4000}, (_,i)=>{ const c = CATEGORIES.filter(x=>x!=='All Products')[i % (CATEGORIES.length-1)]; return {id: `${Date.now()+i}`, sku: `RG${String(i+1).padStart(4,'0')}`, name: `${c.toUpperCase()} Product ${i+1}`, category: c, uom: UOMS[i%UOMS.length], price: `RM ${(2 + (i%80)*.35).toFixed(2)}`, image: ''}; }); }
function makeCustomers(): Customer[] { return Array.from({length:4000}, (_,i)=>({name:`Customer ${String(i+1).padStart(3,'0')}`, phone:`01${i%9+1}-${String(7000+i).padStart(4,'0')} ${String(1000+i).padStart(4,'0')}`, whatsapp:`01${i%9+1}-${String(7000+i).padStart(4,'0')} ${String(1000+i).padStart(4,'0')}`, address:`${i%50+1}, Jalan Rengas ${i+1}, Selangor, Malaysia`, tin:`TIN-${80000+i}`, orders: i%5+1})); }
function makeOrders(customers: Customer[]): Order[] { return Array.from({length:4000}, (_,i)=>{const c=customers[i%customers.length]; return {id:`ORD-${1001+i}`, customer:c.name, phone:c.phone, date:`2026-05-${String(i%28+1).padStart(2,'0')}`, items:6+i%20, amount:`RM ${(180+i*37.5).toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2})}`, status:['View','Modified','Printed'][i%3], address:c.address, tin:c.tin};});}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  private ordersSubject = new BehaviorSubject<Order[]>([]);

  constructor() {
    // Initialize with mock data
    const initialCustomers = makeCustomers();
    this.customersSubject.next(initialCustomers);
    this.productsSubject.next(makeProducts());
    this.ordersSubject.next(makeOrders(initialCustomers));
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getCustomers(): Observable<Customer[]> {
    return this.customersSubject.asObservable();
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  addProduct(product: Product): void {
    const current = this.productsSubject.getValue();
    const newProduct = { ...product, id: product.id || String(Date.now()) };
    this.productsSubject.next([newProduct, ...current]);
  }

  updateProduct(product: Product): void {
    const current = this.productsSubject.getValue();
    const updated = current.map(p => p.id === product.id ? product : p);
    this.productsSubject.next(updated);
  }

  deleteProduct(productId: string): void {
    const current = this.productsSubject.getValue();
    const updated = current.filter(p => p.id !== productId);
    this.productsSubject.next(updated);
  }

  addCustomer(customer: Customer): void {
    const current = this.customersSubject.getValue();
    this.customersSubject.next([customer, ...current]);
  }

  updateCustomer(customer: Customer): void {
    const current = this.customersSubject.getValue();
    const updated = current.map(c => c.name === customer.name ? customer : c);
    this.customersSubject.next(updated);
  }
}
