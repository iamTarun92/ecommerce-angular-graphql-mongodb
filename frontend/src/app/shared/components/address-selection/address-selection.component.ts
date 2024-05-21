import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/core.index';
import { AddressRoot } from 'src/app/core/models/user';

@Component({
  selector: 'app-address-selection',
  templateUrl: './address-selection.component.html',
  styleUrls: ['./address-selection.component.scss']
})
export class AddressSelectionComponent implements OnInit {

  @Input() addresses: any | AddressRoot[];
  @Input() name: string = '';
  @Input() currentUser: any;
  @Output() addressSelected = new EventEmitter<any>();

  editAddressForm!: FormGroup
  selectedAddress: any
  isEditFormSelected = false
  selectedAddressIndex = 0

  constructor(
    private fb: FormBuilder,
    private apiService: CommonService
  ) { }


  ngOnInit(): void {
    this.editAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required,]],
      type: ['', [Validators.required,]]
    })
  }


  onAddressSelected(address: AddressRoot) {
    this.selectedAddress = address
    this.addressSelected.emit(address);
  }

  editAddress(address: AddressRoot) {
    const formData = {
      ...address
    }
    this.isEditFormSelected = !this.isEditFormSelected
    this.selectedAddress = address
    this.editAddressForm.patchValue(formData)
  }

  cancelEditAddress() {
    this.isEditFormSelected = !this.isEditFormSelected
    this.editAddressForm.reset();
  }
}
