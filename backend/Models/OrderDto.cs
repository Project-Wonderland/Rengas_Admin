using System;
using System.ComponentModel.DataAnnotations;

namespace RengasAdmin.Models
{
    public class OrderDto
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string OrderNumber { get; set; }
        
        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; }
        
        [StringLength(50)]
        public string CustomerPhone { get; set; }
        
        [StringLength(250)]
        public string CustomerAddress { get; set; }
        
        [StringLength(50)]
        public string CustomerTIN { get; set; }
        
        public DateTime OrderDate { get; set; }
        
        public int ItemCount { get; set; }
        
        public decimal TotalAmount { get; set; }
        
        [StringLength(50)]
        public string Status { get; set; }
    }
}
