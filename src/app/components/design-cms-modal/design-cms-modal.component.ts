import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-design-cms-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './design-cms-modal.component.html'
})
export class DesignCmsModalComponent {
  @Output() close = new EventEmitter<void>();
  
  topBanner: string | null = null;
  productPhoto: string | null = null;
  footerBanner: string | null = null;

  onClose() {
    this.close.emit();
  }

  saveDesign() {
    // Save logic here
    this.onClose();
  }

  removeFrontImages() {
    if(confirm('Are you sure you want to remove all front page images?')) {
      this.topBanner = null;
      this.productPhoto = null;
      this.footerBanner = null;
    }
  }

  onUploadTopBanner(event: any) {
    this.handleFile(event, (result) => this.topBanner = result);
  }

  onUploadProductPhoto(event: any) {
    this.handleFile(event, (result) => this.productPhoto = result);
  }

  onUploadFooterBanner(event: any) {
    this.handleFile(event, (result) => this.footerBanner = result);
  }

  private handleFile(event: any, callback: (result: string) => void) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => callback(e.target.result);
      reader.readAsDataURL(file);
    }
  }
}
