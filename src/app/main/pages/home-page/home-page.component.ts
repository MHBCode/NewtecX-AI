import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceRegistrationFormComponent } from '../../components/invoice-registration-form/invoice-registration-form.component';
import { CommonModule } from '@angular/common';
import { LogService } from '../../../shared/log.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [InvoiceRegistrationFormComponent, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements AfterViewInit {
  constructor(public router: Router, private logService: LogService) {}

   @ViewChild('logMessagesContainer', { static: true })
  logMessagesContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    // ✅ This links the container in the service:
    this.logService.registerContainer(this.logMessagesContainer.nativeElement);
  }

  goTo(where: string){
    if(where == 'main-1'){
      this.router.navigate(['/home/invoiceMenu']);
    }
    else if( where == 'sub-1.1'){
      this.router.navigate(['/home/invoiceForm']);
    }
  }

  addLogMessage(message: string) {
    const div = document.createElement('div');
    div.textContent = message;
    this.logMessagesContainer.nativeElement.appendChild(div);
  }
}
