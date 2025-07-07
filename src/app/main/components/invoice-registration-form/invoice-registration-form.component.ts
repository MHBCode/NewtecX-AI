import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LogService } from '../../../shared/log.service';

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
  highlightMessage = '';

  setLoadingPopUp(enable : boolean, message: string) {
    this.isLoading = enable;
    this.highlightMessage = message;
  }

  constructor(private http: HttpClient, private logService: LogService) {}

  onFileSelected(event: any) {
    this.logService.push('I got the invoice, now trying to read its details');
    console.log('added')
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.setLoadingPopUp(true, 'Im reading the invoice');

    this.http.post<any>(
      'http://ntxai-invoiceagent.azurewebsites.net/invoice/upload',
      formData
    ).subscribe({
      next: response => {
        this.setLoadingPopUp(true, 'Checking data');

        if (response.status === 'success' && response.metadata) {
          this.setLoadingPopUp(true, 'I was able to extract the data');
          const meta = response.metadata;
          const form = this.formRef.nativeElement;
          this.setLoadingPopUp(true, 'Im validating the invoice');
          this.validateInvoice(meta);
          (form.querySelector('input[name="invoice_number"]') as HTMLInputElement).value = meta.invoice_number || '';
          (form.querySelector('input[name="purchase_order_number"]') as HTMLInputElement).value = meta.purchase_order_number || '';
          (form.querySelector('input[name="invoice_date"]') as HTMLInputElement).value = meta.invoice_date || '';
          (form.querySelector('input[name="vendor"]') as HTMLInputElement).value = meta.vendor || '';
          (form.querySelector('textarea[name="notes"]') as HTMLTextAreaElement).value = meta.note || '';

          this.lineItems = meta.line_items || [];
          this.isLoading = false;
          console.log('Invoice data populated successfully!');
        } else {
          alert('Unexpected response format.');
        }
      },
      error: error => {
        console.error('API Error:', error);
        alert('Failed to upload invoice.');
        this.isLoading = false;
      }
    });
  }
  handleValidationResponse(validation: any) {
  this.logService.push('✅ Validation results:');

  this.logService.pushValidationNote(validation.date_validation, validation.date_validation_note);
  this.logService.pushValidationNote(validation.invoice_number_validation, validation.invoice_number_validation_note);
  this.logService.pushValidationNote(validation.po_number_validation, validation.po_number_validation_note);
  this.logService.pushValidationNote(validation.vendor_name_validation, validation.vendor_name_validation_note);
  this.logService.pushValidationNote(validation.line_items_validation, validation.line_items_validation_note);
  this.logService.pushValidationNote(validation.total_validation, validation.total_validation_note);

  if (validation.is_valid) {
    this.logService.push('🎉 Invoice is fully valid!');
  } else {
    this.logService.push('⚠️ Some checks failed. Please review.');
  }
}
  validateInvoice(metadata: any) {
  this.logService.push('🔍 Validating invoice data...');

  this.http.post<any>(
    'https://ntxai-invoiceagent.azurewebsites.net/invoice/validate',
    metadata
  ).subscribe({
      next: validation => {
        this.logService.pushValidationNote(validation.date_validation, validation.date_validation_note);
        this.logService.pushValidationNote(validation.invoice_number_validation, validation.invoice_number_validation_note);
        this.logService.pushValidationNote(validation.po_number_validation, validation.po_number_validation_note);
        this.logService.pushValidationNote(validation.vendor_name_validation, validation.vendor_name_validation_note);
        this.logService.pushValidationNote(validation.line_items_validation, validation.line_items_validation_note);
        this.logService.pushValidationNote(validation.total_validation, validation.total_validation_note);

        if (validation.is_valid) {
          this.logService.push('✅ All checks passed. Invoice is valid!');
        } else {
          this.logService.push('⚠️ Some checks failed. Please review.');
        }
      },
      error: err => {
        console.error('Validation API Error:', err);
        this.logService.push('❌ Validation failed due to API error.');
      }
    });
  }
  registerInvoice() {
    this.logService.push('📤 Registering invoice...');

    // Build the payload from the form + lineItems
    const form = this.formRef.nativeElement;
    const payload = {
      invoice_date: (form.querySelector('input[name="invoice_date"]') as HTMLInputElement).value || null,
      invoice_number: (form.querySelector('input[name="invoice_number"]') as HTMLInputElement).value || null,
      purchase_order_number: (form.querySelector('input[name="purchase_order_number"]') as HTMLInputElement).value || null,
      vendor: (form.querySelector('input[name="vendor"]') as HTMLInputElement).value || null,
      sender: '', // <-- if you have a sender field, map it here
      total_amount: 0, // Optional: you can sum lineItems if needed
      note: (form.querySelector('textarea[name="notes"]') as HTMLTextAreaElement).value || null,
      line_items: this.lineItems || []
    };

    // Optionally, compute total_amount from lineItems:
    payload.total_amount = payload.line_items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);

    this.http.post<any>(
      'https://ntxai-invoiceagent.azurewebsites.net/invoice/register_invoice',
      payload
    ).subscribe({
      next: res => {
        if (res.status === 'success') {
          this.logService.push(`✅ ${res.message}`);
        } else {
          this.logService.push('⚠️ Unexpected response from register API.');
        }
      },
      error: err => {
        console.error('Register API Error:', err);
        this.logService.push('❌ Failed to register invoice.');
      }
    });
  }


}
