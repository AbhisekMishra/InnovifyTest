import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from './../user';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class UserConnectionService {

  constructor(private _http : HttpClient) { }

  registerUser(user: IUser) : Observable<IUser> {
	return this._http.post('http://localhost:3000/api/user', JSON.stringify(user))
			   .pipe(
			    tap(user: IUser => user.json()),
			    );
			   
  }

  loginUser(user: IUser) : Observable<IUser> {
	return this._http.post('http://localhost:3000/api/login', JSON.stringify(user))
			   .pipe(
			    	tap(user: IUser => user.json()),
			    );
			   
  }

  authenticateUser(token: String) {
		return this._http.post('http://localhost:3000/api/me', JSON.stringify({token}))
				   .pipe(
				    	tap(user => user),
				    );
	}

}
