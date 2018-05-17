import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { SharedDataService } from './shared-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private translate: TranslateService,
  			  private sharedData: SharedDataService,
  			  private _router: Router,) {
              translate.setDefaultLang('en');
    }
    language: String = 'en';
    loggedIn = false;
    ngOnInit() {
    	this.sharedData.cast.subscribe(user=>{
    		if(user.loggedIn) {
    			this.loggedIn = true;
    		} else {
    			this.loggedIn = false;
    		}
    	})
    }

    logout(e) {
    	e.preventDefault();
      localStorage.removeItem("token");
      this.loggedIn = false;
    	this.sharedData.editUser({loggedIn: false});
    	this._router.navigate(['']);
    }

    changeLanguage(e) {
      this.translate.use(this.language);
    }
}
