import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureModuleComponent } from './feature-module.component';
import { LoggedInGuard } from '../core/guards/logged-in.guard';
import { AuthGuard } from '../core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '', component: FeatureModuleComponent,
    children: [
      {
        path: '',
        canActivate: [LoggedInGuard],
        loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
      },
      {
        path: 'checkout',
        loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule)
      },
      {
        path: 'orders',
        canActivate: [AuthGuard],
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
      },
      {
        path: 'wishlist',
        loadChildren: () => import('./wishlist/wishlist.module').then(m => m.WishlistModule)
      },
      {
        path: ':categoryName',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureModuleRoutingModule { }
