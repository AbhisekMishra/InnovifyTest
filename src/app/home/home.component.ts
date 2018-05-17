import { Component, OnInit } from '@angular/core';
import { UserConnectionService } from './../user-connection.service';
import { Router } from '@angular/router';
import { SharedDataService } from './../shared-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ UserConnectionService ]
})
export class HomeComponent implements OnInit {

  constructor(private _userConnectionService: UserConnectionService,
			  private _router: Router,
			  private sharedData: SharedDataService) { }
  userName: String = '';
  token: String;

  ngOnInit() {
    this.sharedData.cast.subscribe(user=>{
    	this.token = localStorage.getItem("token");
  		if(user.loggedIn) {
  			this.userName = user.fname + " " + user.lname;
  		} else if(this.token) {
		  this._userConnectionService.authenticateUser(this.token)
			  .subscribe((user) => {
				  if(user.success) {
				  	console.log('Success');
					  this.sharedData.editUser({...user.user.data, loggedIn: true });
					  this.userName = user.user.data.fname + " " + user.user.data.lname;
				  } else {
					  this._router.navigate(['']);
				  }
			  })
	  } else {
		  this._router.navigate(['']);
	  }


  	})
	  
  }

}
