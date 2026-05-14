using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using RengasAdmin.Models;

namespace RengasAdmin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderManagementController : ControllerBase
    {
        // GET: api/ordermanagement/summary
        [HttpGet("summary")]
        public IActionResult GetSummaryMetrics()
        {
            var metrics = new
            {
                TotalCustomers = 100,
                TodayReceived = 4,
                WeeklyOrders = 72,
                MonthlyOrders = 100
            };
            return Ok(metrics);
        }

        // GET: api/ordermanagement/orders
        [HttpGet("orders")]
        public IActionResult GetOrders([FromQuery] string searchTerm)
        {
            var orders = new List<OrderDto>
            {
                new OrderDto { Id = 1, OrderNumber = "ORD-1001", CustomerName = "Customer 001", CustomerPhone = "011-7000 1000", CustomerAddress = "1, Jalan Rengas 1, Selangor, Malaysia", CustomerTIN = "TIN-80000", OrderDate = new DateTime(2026, 5, 1), ItemCount = 6, TotalAmount = 180.00m, Status = "View" },
                new OrderDto { Id = 2, OrderNumber = "ORD-1002", CustomerName = "Customer 002", CustomerPhone = "012-7001 1001", CustomerAddress = "2, Jalan Rengas 2, Selangor, Malaysia", CustomerTIN = "TIN-80001", OrderDate = new DateTime(2026, 5, 2), ItemCount = 7, TotalAmount = 217.50m, Status = "Modified" },
                new OrderDto { Id = 3, OrderNumber = "ORD-1003", CustomerName = "Customer 003", CustomerPhone = "013-7002 1002", CustomerAddress = "3, Jalan Rengas 3, Selangor, Malaysia", CustomerTIN = "TIN-80002", OrderDate = new DateTime(2026, 5, 3), ItemCount = 8, TotalAmount = 255.00m, Status = "Printed" },
                new OrderDto { Id = 4, OrderNumber = "ORD-1004", CustomerName = "Customer 004", CustomerPhone = "014-7003 1003", CustomerAddress = "4, Jalan Rengas 4, Selangor, Malaysia", CustomerTIN = "TIN-80003", OrderDate = new DateTime(2026, 5, 4), ItemCount = 9, TotalAmount = 292.50m, Status = "View" }
            };

            // Basic filtering
            if (!string.IsNullOrEmpty(searchTerm))
            {
                orders = orders.FindAll(o => o.OrderNumber.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                                             o.CustomerName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
            }

            return Ok(orders);
        }

        // GET: api/ordermanagement/customers
        [HttpGet("customers")]
        public IActionResult GetCustomers()
        {
            var customers = new List<object>
            {
                new { Name = "Customer 001", Orders = 1 },
                new { Name = "Customer 002", Orders = 1 },
                new { Name = "Customer 003", Orders = 1 },
                new { Name = "Customer 004", Orders = 1 }
            };
            return Ok(customers);
        }
    }
}
