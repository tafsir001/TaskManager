import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignupService } from './service/signup.service';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signup!: FormGroup;

  constructor(private fb: FormBuilder, private signupService: SignupService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.signup = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    if (isPlatformBrowser(this.platformId)) {

      if(localStorage.getItem('authToken')){

        this.router.navigate(['/home']);
      }
    }
  }

  get email() {
    return this.signup.get('email');
  }

  get password() {
    return this.signup.get('password');
  }

  get username() {
    return this.signup.get('username');
  }

  signupUser(): void {
    if (this.signup.valid) {
      console.log('Form Submitted', this.signup.value);

      this.signupService.signup(this.signup.value).subscribe({
        next: (data) => {
          console.log('Task updated successfully', data);
          if (isPlatformBrowser(this.platformId)) {

            localStorage.setItem('authToken', data.authToken);
          }
          this.signup.reset();
          this.router.navigate(['/home']);
        },
        error: (err: any) => console.error('Login error:', err),
      });
    }
  }
}
