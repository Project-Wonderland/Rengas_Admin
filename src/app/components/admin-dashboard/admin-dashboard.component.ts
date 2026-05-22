import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Product, Customer, Order } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: '[app-admin-dashboard]',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  @Input() logo!: string;
  @Input() loggedIn!: string | null;
  @Input() categories: string[] = [];
  @Input() toast: string = '';

  @Output() logout = new EventEmitter<void>();
  @Output() openAddProduct = new EventEmitter<void>();
  @Output() openEditProduct = new EventEmitter<any>();
  @Output() deleteProduct = new EventEmitter<any>();
  @Output() openAddCustomer = new EventEmitter<void>();
  @Output() openDesignCMS = new EventEmitter<void>();

  products: Product[] = [];
  customers: Customer[] = [];
  orders: Order[] = [];
  
  private sub = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.sub.add(this.dataService.getProducts().subscribe(p => {
      this.products = p;
      // Re-trigger computed properties if needed by re-evaluating the current page 
      // (Angular will automatically run getters on CD but we can ensure it's up to date)
    }));
    this.sub.add(this.dataService.getCustomers().subscribe(c => this.customers = c));
    this.sub.add(this.dataService.getOrders().subscribe(o => this.orders = o));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  search = '';
  selectedCategory = 'All Products';
  page = 1;
  perPage = 10;
  activeTab: 'products' | 'customers' | 'orders' = 'products';

  // Using getter methods to simulate computed properties based on inputs
  get filteredProducts() {
    return this.products.filter(p => 
      (this.selectedCategory === 'All Products' || p.category === this.selectedCategory) && 
      `${p.sku} ${p.name} ${p.category}`.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  get pagedProducts() {
    const fp = this.filteredProducts;
    return fp.slice((this.page - 1) * this.perPage, this.page * this.perPage);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.perPage));
  }

  categoryCounts() {
    return this.categories.map(c => ({
      name: c,
      count: c === 'All Products' ? this.products.length : this.products.filter(p => p.category === c).length
    }));
  }

  selectCategory(c: string) {
    this.selectedCategory = c;
    this.page = 1;
  }
}
