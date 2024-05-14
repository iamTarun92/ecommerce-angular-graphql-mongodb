import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: ':categoryId',
        loadChildren: () => import('./product-list/product-list.module').then(m => m.ProductListModule)
      },
      {
        path: ':categoryId/:productName/:productId',
        loadChildren: () => import('./product-detail/product-detail.module').then(m => m.ProductDetailModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
