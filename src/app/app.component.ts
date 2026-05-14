import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { DataService, Product, Customer, Order, CATEGORIES, UOMS } from './services/data.service';

@Component({
  selector: 'app-root', standalone: true, imports: [CommonModule, FormsModule, LoginPageComponent, AdminDashboardComponent, OrderManagementComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  logo = 'assets/logo.png';
  categories = CATEGORIES;
  uoms = UOMS;
  loggedIn = signal<string | null>(localStorage.getItem('rengas_role'));
  role = 'Admin';
  
  modal:'product'|'customer'|'order'|null=null; 
  editProduct:Product={id:'',sku:'',name:'',category:'Pooja Items',uom:'PCS',price:'RM 0.00',image:''};
  editCustomer:Customer={name:'',phone:'',whatsapp:'',address:'',tin:'',orders:0};
  toast='';

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  handleLoginSuccess(role: string){ localStorage.setItem('rengas_role', role); this.loggedIn.set(role); }
  logout(){ localStorage.removeItem('rengas_role'); this.loggedIn.set(null); }
  
  openAddProduct(){this.editProduct={id:'',sku:'',name:'',category:'Pooja Items',uom:'PCS',price:'RM 0.00',image:''}; this.modal='product';}
  openEditProduct(p:Product){this.editProduct={...p}; this.modal='product';}
  saveProduct(){ 
    if (this.editProduct.id) {
      this.dataService.updateProduct(this.editProduct);
    } else {
      this.dataService.addProduct(this.editProduct);
    }
    this.modal=null; 
    this.show('Product saved successfully');
  }
  deleteProduct(p:Product){ 
    if(confirm(`Delete ${p.name}?`)){ 
      this.dataService.deleteProduct(p.id); 
      this.show('Product deleted'); 
    }
  }
  
  openAddCustomer(){this.editCustomer={name:'',phone:'',whatsapp:'',address:'',tin:'',orders:0}; this.modal='customer';}
  saveCustomer(){ 
    // DataService update logic
    this.dataService.addCustomer(this.editCustomer);
    this.modal=null; 
    this.show('Customer saved');
  }
  
  show(m:string){this.toast=m; setTimeout(()=>this.toast='',1800);}
}
