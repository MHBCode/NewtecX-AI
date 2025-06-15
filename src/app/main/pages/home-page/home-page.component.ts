import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceRegistrationFormComponent } from '../../components/invoice-registration-form/invoice-registration-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [InvoiceRegistrationFormComponent, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  constructor(public router: Router) {}


  goTo(where: string){
    if(where == 'main-1'){
      this.router.navigate(['/home/invoiceMenu']);
    }
    else if( where == 'sub-1.1'){
      this.router.navigate(['/home/invoiceForm']);
    }
  }
}
