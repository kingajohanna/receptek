import { action, computed, makeAutoObservable, observable } from "mobx";

export default class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  isLoggedIn = false;

  setIsLoggedIn(login: boolean) {
    this.isLoggedIn = login;
  }
}
