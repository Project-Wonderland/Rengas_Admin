import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { ConfirmationModalComponent } from './commonComponents/confirmation-modal/confirmation-modal.component';
import { DesignCmsModalComponent } from './components/design-cms-modal/design-cms-modal.component';
import { DataService, Product, Customer, Order, CATEGORIES, UOMS } from './services/data.service';

@Component({
  selector: 'app-root', standalone: true, imports: [CommonModule, FormsModule, LoginPageComponent, AdminDashboardComponent, OrderManagementComponent, ConfirmationModalComponent, DesignCmsModalComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  logo = 'assets/logo.png';
  categories = CATEGORIES;
  uoms = UOMS;
  loggedIn = signal<string | null>(localStorage.getItem('rengas_role'));
  role = 'Admin';
  
  modal:'product'|'customer'|'order'|'design'|null=null; 
  editProduct:Product={id:'',sku:'',name:'',category:'Pooja Items',uom:'PCS',price:'RM 0.00',image:''};
  editCustomer:Customer={name:'',phone:'',whatsapp:'',address:'',tin:'',orders:0};
  toast='';
  
  selectedFileName = '';
  newCategory = '';
  catSearch = '';
  selectedCats: string[] = [];

  confirmConfig = {
    visible: false,
    title: '',
    message: '',
    isDanger: true,
    action: null as any
  };

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
    this.confirmConfig = {
      visible: true,
      title: 'Delete Product',
      message: `Are you sure you want to delete ${p.name}?`,
      isDanger: true,
      action: () => {
        this.dataService.deleteProduct(p.id); 
        this.show('Product deleted');
      }
    };
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.editProduct.image = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }

  uploadBulk() {
    if (!this.selectedFileName) {
      this.show('Please select a file first.');
      return;
    }
    this.show('Bulk upload successful.');
    this.selectedFileName = '';
  }

  removeAllProducts() {
    this.confirmConfig = {
      visible: true,
      title: 'Remove All Products',
      message: 'Are you sure you want to remove all products? This action cannot be undone.',
      isDanger: true,
      action: () => {
        this.show('All products have been removed.');
      }
    };
  }

  addCategory() {
    if (this.newCategory.trim()) {
      if (!this.categories.includes(this.newCategory.trim())) {
         this.categories = [...this.categories, this.newCategory.trim()];
         this.show('Category added.');
      }
      this.newCategory = '';
    }
  }

  filteredCats() {
    const search = this.catSearch.toLowerCase();
    return this.categories.slice(1).filter(c => c.toLowerCase().includes(search));
  }

  toggleCatSelect(cat: string) {
    if (this.selectedCats.includes(cat)) {
      this.selectedCats = this.selectedCats.filter(c => c !== cat);
    } else {
      this.selectedCats.push(cat);
    }
  }

  toggleSelectAllCats() {
    const cats = this.filteredCats();
    if (this.selectedCats.length === cats.length) {
      this.selectedCats = [];
    } else {
      this.selectedCats = [...cats];
    }
  }

  deleteSelectedCats() {
    if (this.selectedCats.length === 0) return;
    this.confirmConfig = {
      visible: true,
      title: 'Delete Categories',
      message: `Are you sure you want to delete ${this.selectedCats.length} categories?`,
      isDanger: true,
      action: () => {
        this.categories = this.categories.filter(c => !this.selectedCats.includes(c));
        this.selectedCats = [];
        this.show('Selected categories deleted.');
      }
    };
  }

  handleConfirm() {
    if (this.confirmConfig.action) {
      this.confirmConfig.action();
    }
    this.confirmConfig.visible = false;
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
