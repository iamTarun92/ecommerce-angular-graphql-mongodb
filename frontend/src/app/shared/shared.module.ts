import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component';
import { AddressSelectionComponent } from './components/address-selection/address-selection.component';



@NgModule({
  declarations: [
    AddressSelectionComponent,
    SelectDropdownComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    AddressSelectionComponent,
    SelectDropdownComponent
  ]
})
export class SharedModule { }
