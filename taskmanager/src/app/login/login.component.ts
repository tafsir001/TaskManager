import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  login!: FormGroup;
  error: any;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.login = this.fb.group({
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
    return this.login.get('email');
  }

  get password() {
    return this.login.get('password');
  }
  loginUser(): void {
    if (this.login.valid) {
      console.log('Form Submitted', this.login.value);

      this.loginService.login(this.login.value).subscribe({
        next: (data) => {
          console.log('Task updated successfully', data);
          if (isPlatformBrowser(this.platformId)) {

            localStorage.setItem('authToken', data.authToken);
          }
          this.login.reset();
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          console.error('Login error:', err.error)
          this.error = err.error.error

          setTimeout(() => {
            this.error = null
          },5000)
        },
      });
    }
  }
}
