import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/core.index';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})

export class ForgetPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  hasPassword = false

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  submit() {
    const { email } = this.forgotForm.value
    this.authService.requestPasswordReset(email).subscribe({
      next: (response) => {
        console.log('Password reset email sent', response);
        this.forgotForm.reset()
      },
      error: (error) => {
        console.error('Error sending password reset email', error);
      }
    }
    );
  }
}
