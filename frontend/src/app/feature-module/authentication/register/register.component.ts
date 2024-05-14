import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/core.index';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  signupForm!: FormGroup;
  currentUser: any

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')

    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    const { username, email, password } = this.signupForm.value;
    this.authService.signup(username, email, password).subscribe({
      next: response => {
        this.signupForm.reset()
        this.router.navigateByUrl('login')
      },
      error: (error) => alert('Error: ' + error.error.error.message)
    });
  }

}
