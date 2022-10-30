import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {action, computed, makeAutoObservable, observable} from 'mobx';

export default class UserStore {
  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  isLoggedIn = false;

  user: FirebaseAuthTypes.UserCredential | undefined = undefined;

  setIsLoggedIn(login: boolean) {
    this.isLoggedIn = login;
  }

  setUser(user: FirebaseAuthTypes.UserCredential | undefined) {
    this.user = user;
    if (user) this.setIsLoggedIn(true);
    else this.setIsLoggedIn(false);
  }
}
