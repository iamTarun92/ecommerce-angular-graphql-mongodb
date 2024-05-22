import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, CommonService } from 'src/app/core/core.index';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  editAddressForm!: FormGroup
  isEditFormSelected = false
  selectedAddress: any
  isAddFormSelected = false
  isActive = true
  currentUser: any
  addAddressForm!: FormGroup
  allAddress: any[] = []


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private commonService: CommonService,
  ) { }


  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')
    this.loadAddress()

    this.addAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required]],
      type: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required]
      })
    });

    this.editAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required]],
      type: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required]
      })
    })
  }


  loadAddress() {
    this.commonService.getAddressByEmail(this.currentUser.email).subscribe({
      next: (res: any) => {
        this.allAddress = res
      }
    })
  }

  saveAddress() {
    const addressData = {
      email: this.currentUser.email,
      ...this.addAddressForm.value
    }
    console.log(addressData);

    this.commonService.addAddress(addressData).subscribe({
      next: res => {
        this.isAddFormSelected = !this.isAddFormSelected
        this.addAddressForm.reset();
        this.loadAddress()
      }
    })
  }

  updateAddress(id: string) {
    const addressData = this.editAddressForm.value
    this.commonService.updateAddress(id, addressData).subscribe({
      next: res => {
        this.selectedAddress = null
        this.isEditFormSelected = !this.isEditFormSelected
        this.editAddressForm.reset();
        this.loadAddress()
      },
      error: (error) => console.log(error)
    })
  }

  deleteAddress(id: string) {
    this.commonService.deleteAddress(id).subscribe({
      next: res => {
        this.loadAddress()
      },
      error: (error) => console.log(error)
    })
  }

  cancelSaveAddress() {
    this.isAddFormSelected = !this.isAddFormSelected
    this.addAddressForm.reset();
  }

  editAddress(address: any) {
    const formData = {
      ...address
    }
    this.selectedAddress = address
    this.isEditFormSelected = !this.isEditFormSelected
    this.editAddressForm.patchValue(formData)
  }

  cancelEditAddress() {
    this.isEditFormSelected = !this.isEditFormSelected
    this.editAddressForm.reset();
  }

}
