import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from './../user';
import { UserConnectionService } from './../user-connection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [ UserConnectionService ]
})
export class RegistrationComponent implements OnInit {

  constructor(private _userConnectionService: UserConnectionService,
			  private _router: Router) { }

  regForm: FormGroup;
  fname: FormControl; 
  lname: FormControl;
  email: FormControl;
  pwd: FormControl;
  language: FormControl;
  statusMessage: String = '';
  ngOnInit() {
  	this.createFormControls();
    this.createForm();
  }

  createFormControls() { 
    this.fname = new FormControl('', Validators.required);
    this.lname = new FormControl('', Validators.required);
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
    this.regForm = new FormGroup({
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      pwd: this.pwd
    });
  }

  registerUser(user: IUser) {
  	this._userConnectionService.registerUser(user)
			.subscribe((usr) => {
				if(usr.success) {
					this.statusMessage = "Hello " + usr.user.fname + " ! Welcome aboard";
				} else {
					this.statusMessage = usr.message;
				}
			},
			(error) => {
				console.log(error);
				this.statusMessage = error.statusText;
			}) 
  }

}
