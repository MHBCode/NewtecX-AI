import { Routes } from '@angular/router';
import { HomePageComponent } from './main/pages/home-page/home-page.component';

export const routes: Routes = [
    { 
        path: 'home', component: HomePageComponent
    },
    {
        path: 'home/invoiceMenu', component: HomePageComponent
    },
    {
        path: 'home/invoiceForm', component: HomePageComponent
    },
    { 
        path: '', component: HomePageComponent
    }
];
