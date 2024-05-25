import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/core.index';
import { matchPasswordValidator } from 'src/app/validation.directive';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  token = ''

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.activeRoute.snapshot.queryParamMap.get('token')!;
    console.log(this.token);

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', Validators.required]
    }, { validators: matchPasswordValidator('password', 'passwordConfirmation') })
  }

  resetPassword() {
    const { password } = this.resetForm.value
    this.authService.resetPassword(this.token, password).subscribe(
      (response) => {
        console.log('Password reset successful', response);
        this.router.navigate(['login'])
      },
      (error) => {
        console.error('Error resetting password', error);
      }
    );
  }

}
