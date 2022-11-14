import {makeAutoObservable, runInAction} from 'mobx';
import {getRecipes} from '../constants/backend';
import {Recipe, testRecipe} from '../types/recipe';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class RecipeStore {
  recipes: Recipe[] = [];
  favourites: Recipe[] = [];

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
    makePersistable(this, {
      name: 'RecipeStore',
      properties: ['recipes'],
      storage: AsyncStorage,
    });
  }

  async setRecipes() {
    const recipes = await getRecipes();
    runInAction(() => {
      this.recipes = recipes;
    });
  }

  removeRecipes() {
    this.recipes = [];
  }

  getRecipes() {
    return this.recipes;
  }
}
