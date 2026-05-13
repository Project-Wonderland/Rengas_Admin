import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Product = { id: string; sku: string; name: string; category: string; uom: string; price: string; image?: string };
type Customer = { name: string; phone: string; whatsapp: string; address: string; tin: string; orders: number };
type Order = { id: string; customer: string; phone: string; date: string; items: number; amount: string; status: string; address: string; tin: string };

const CATEGORIES = ['All Products','Pooja Items','Lamp Items','Grocery','Prayer Items','Incense Sticks','Camphor','Kumkum','Turmeric','Sandalwood','Rose Water','Ghee Products','Oil Products','Agarbathi','Vilakku','Agal Vilakku','Brass Items','Steel Items','Plastic Items','Paper Products','Festival Items','Deepavali Items','Thaipusam Items','Pongal Items','Temple Supplies','Garlands','Flowers','Coconut Items','Betel Products','Rice Products','Flour Products','Spices','Masala','Snacks','Biscuits','Drinks','Dairy','Frozen','Cleaning Items','Household','Kitchen Items','Disposable','Packaging','Textiles','Religious Books','Calendars','Photos','Frames','Statues','Gift Items','Seasonal Offers','Wholesale Deals','New Arrivals','Top Selling','Premium Products','Budget Products','Bulk Pack','Retail Pack','Imported Items','Local Items','South Indian Items','North Indian Items','Malaysia Products','Sri Lanka Products','Indonesia Products','Thailand Products','China Products','General Trading','Appalam','Pori','Margarine','Rice Bags','Sugar','Salt','Tea','Coffee','Noodles','Sauces','Canned Food','Dry Food','Nuts','Dates','Sweets','Health Food','Baby Products','Personal Care','Beauty Products','Stationery','Electrical','Hardware','Toys','Decorations','Candles','Wicks','Threads','Containers','Bottles','Boxes','Labels','Others'];
const UOMS = ['PCS','BOX','CTN','PKT','KG','LITRE'];
function makeProducts(): Product[] { return Array.from({length:156}, (_,i)=>{ const c = CATEGORIES.filter(x=>x!=='All Products')[i % (CATEGORIES.length-1)]; return {id: `${Date.now()+i}`, sku: `RG${String(i+1).padStart(4,'0')}`, name: `${c.toUpperCase()} Product ${i+1}`, category: c, uom: UOMS[i%UOMS.length], price: `RM ${(2 + (i%80)*.35).toFixed(2)}`, image: ''}; }); }
function makeCustomers(): Customer[] { return Array.from({length:25}, (_,i)=>({name:`Customer ${String(i+1).padStart(3,'0')}`, phone:`01${i%9+1}-${String(7000+i).padStart(4,'0')} ${String(1000+i).padStart(4,'0')}`, whatsapp:`01${i%9+1}-${String(7000+i).padStart(4,'0')} ${String(1000+i).padStart(4,'0')}`, address:`${i%50+1}, Jalan Rengas ${i+1}, Selangor, Malaysia`, tin:`TIN-${80000+i}`, orders: i%5+1})); }
function makeOrders(customers: Customer[]): Order[] { return Array.from({length:25}, (_,i)=>{const c=customers[i%customers.length]; return {id:`ORD-${1001+i}`, customer:c.name, phone:c.phone, date:`2026-05-${String(i%28+1).padStart(2,'0')}`, items:6+i%20, amount:`RM ${(180+i*37.5).toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2})}`, status:['View','Modified','Printed'][i%3], address:c.address, tin:c.tin};});}

@Component({
  selector: 'app-root', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  logo = 'assets/logo.png';
  categories = CATEGORIES;
  uoms = UOMS;
  loggedIn = signal<string | null>(localStorage.getItem('rengas_role'));
  role = 'Admin'; username=''; password=''; error='';
  products = signal<Product[]>(makeProducts()); customers = signal<Customer[]>(makeCustomers()); orders = signal<Order[]>(makeOrders(makeCustomers()));
  search=''; selectedCategory='All Products'; page=1; perPage=10; activeTab:'products'|'customers'|'orders'='products';
  modal:'product'|'customer'|'order'|null=null; editProduct:Product={id:'',sku:'',name:'',category:'Pooja Items',uom:'PCS',price:'RM 0.00',image:''};
  editCustomer:Customer={name:'',phone:'',whatsapp:'',address:'',tin:'',orders:0};
  toast='';
  filteredProducts = computed(()=> this.products().filter(p => (this.selectedCategory==='All Products'||p.category===this.selectedCategory) && `${p.sku} ${p.name} ${p.category}`.toLowerCase().includes(this.search.toLowerCase())));
  pagedProducts = computed(()=> this.filteredProducts().slice((this.page-1)*this.perPage, this.page*this.perPage));
  totalPages = computed(()=> Math.max(1, Math.ceil(this.filteredProducts().length/this.perPage)));
  categoryCounts(){ return this.categories.map(c=>({name:c,count:c==='All Products'?this.products().length:this.products().filter(p=>p.category===c).length})); }
  login(){ this.error=''; if(this.role==='Admin' && this.username.trim()==='admin' && this.password==='admin123'){localStorage.setItem('rengas_role','Admin'); this.loggedIn.set('Admin'); return;} if(this.role==='Order Management Admin' && this.username.trim()==='order' && this.password==='order123'){localStorage.setItem('rengas_role','Order Management Admin'); this.loggedIn.set('Order Management Admin'); return;} this.error='Invalid username or password'; }
  logout(){ localStorage.removeItem('rengas_role'); this.loggedIn.set(null); }
  selectCategory(c:string){this.selectedCategory=c; this.page=1;}
  openAddProduct(){this.editProduct={id:'',sku:'',name:'',category:'Pooja Items',uom:'PCS',price:'RM 0.00',image:''}; this.modal='product';}
  openEditProduct(p:Product){this.editProduct={...p}; this.modal='product';}
  saveProduct(){ const p={...this.editProduct, id:this.editProduct.id || String(Date.now())}; this.products.set(this.products().some(x=>x.id===p.id)?this.products().map(x=>x.id===p.id?p:x):[p,...this.products()]); this.modal=null; this.show('Product saved successfully');}
  deleteProduct(p:Product){ if(confirm(`Delete ${p.name}?`)){ this.products.set(this.products().filter(x=>x.id!==p.id)); this.show('Product deleted'); }}
  openAddCustomer(){this.editCustomer={name:'',phone:'',whatsapp:'',address:'',tin:'',orders:0}; this.modal='customer';}
  saveCustomer(){ const c={...this.editCustomer}; this.customers.set(this.customers().some(x=>x.name===c.name)?this.customers().map(x=>x.name===c.name?c:x):[c,...this.customers()]); this.modal=null; this.show('Customer saved');}
  show(m:string){this.toast=m; setTimeout(()=>this.toast='',1800);}
}
