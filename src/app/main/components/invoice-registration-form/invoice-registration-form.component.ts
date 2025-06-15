import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-registration-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-registration-form.component.html',
  styleUrl: './invoice-registration-form.component.scss'
})
export class InvoiceRegistrationFormComponent {
  @ViewChild('formRef') formRef!: ElementRef<HTMLFormElement>;
  lineItems: any[] = [];
  isLoading = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.isLoading = true;

    this.http.post<any>(
      'https://ntxai-containerapp.ashydesert-891f1b97.westus2.azurecontainerapps.io/upload/invoice',
      formData
    ).subscribe({
      next: response => {
        this.isLoading = false;

        if (response.status === 'success' && response.metadata) {
          const meta = response.metadata;
          const form = this.formRef.nativeElement;

          (form.querySelector('input[name="invoice_number"]') as HTMLInputElement).value = meta.invoice_number || '';
          (form.querySelector('input[name="purchase_order_number"]') as HTMLInputElement).value = meta.purchase_order_number || '';
          (form.querySelector('input[name="invoice_date"]') as HTMLInputElement).value = meta.invoice_date || '';
          (form.querySelector('input[name="vendor"]') as HTMLInputElement).value = meta.vendor || '';
          (form.querySelector('textarea[name="notes"]') as HTMLTextAreaElement).value = meta.note || '';

          this.lineItems = meta.line_items || [];

          console.log('Invoice data populated successfully!');
        } else {
          alert('Unexpected response format.');
        }
      },
      error: error => {
        this.isLoading = false;
        console.error('API Error:', error);
        alert('Failed to upload invoice.');
      }
    });
  }
}
