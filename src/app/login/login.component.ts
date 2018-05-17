import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from './../user';
import { UserConnectionService } from './../user-connection.service';
import { Router } from '@angular/router';
import { SharedDataService } from './../shared-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ UserConnectionService ]
})
export class LoginComponent implements OnInit {

  constructor(private _userConnectionService: UserConnectionService,
			  private _router: Router,
        private sharedData: SharedDataService) { }

  email: FormControl;
  pwd: FormControl;
  statusMessage: String = '';

  ngOnInit() {
  	this.createFormControls();
    this.createForm();
  }

  createFormControls() { 
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);
    this.pwd = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);
  }

  createForm() { 
    this.loginForm = new FormGroup({
      email: this.email,
      pwd: this.pwd
    });
  }

  loginUser(user: IUser) {
  	this._userConnectionService.loginUser(user)
		.subscribe((usr) => {
			if(usr.success) {
        this.sharedData.editUser({...usr.user, loggedIn: true });
				localStorage.setItem('token', usr.token);
				this._router.navigate(['home']);
			} else {
				this.statusMessage = usr.message;
			}
		},
		(error) => {
			this.statusMessage = error.statusText;
		}) 
  }
}
