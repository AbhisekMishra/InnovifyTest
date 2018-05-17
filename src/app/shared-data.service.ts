import { Injectable } from '@angular/core';
import { IUser } from './user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedDataService {

  constructor() { }
  private loggedInUser = new BehaviorSubject<IUser>({loggedIn: false});
  cast = this.loggedInUser.asObservable();
  
  editUser(newUser) {
  	this.loggedInUser.next(Object.assign({}, this.loggedInUser, newUser));
  }
}
