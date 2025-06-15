import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRegistrationFormComponent } from './invoice-registration-form.component';

describe('InvoiceRegistrationFormComponent', () => {
  let component: InvoiceRegistrationFormComponent;
  let fixture: ComponentFixture<InvoiceRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceRegistrationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
