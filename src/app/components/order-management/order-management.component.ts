import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Order, Customer } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: '[app-order-management]',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  @Input() logo!: string;
  @Input() loggedIn!: string | null;
  
  @Output() logout = new EventEmitter<void>();

  orders: Order[] = [];
  customers: Customer[] = [];
  private sub = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.sub.add(this.dataService.getOrders().subscribe(o => this.orders = o));
    this.sub.add(this.dataService.getCustomers().subscribe(c => this.customers = c));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  search = '';

  get filteredOrders() {
    return this.orders.filter(o => 
      o.customer.toLowerCase().includes(this.search.toLowerCase()) || 
      o.id.toLowerCase().includes(this.search.toLowerCase())
    );
  }
}
