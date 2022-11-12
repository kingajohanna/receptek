import {makeAutoObservable, runInAction} from 'mobx';
import {getRecipes} from '../constants/backend';
import {Recipe, testRecipe} from '../types/recipe';

export default class RecipeStore {
  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  recipes: Recipe[] = [];

  async setRecipes() {
    const recipes = await getRecipes();
    runInAction(() => {
      this.recipes = recipes;
    });
  }

  removeRecipe(recipe: Recipe) {
    this.recipes = this.recipes.filter(r => r !== recipe);
  }
}
