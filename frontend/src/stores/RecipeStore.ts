import {makeAutoObservable} from 'mobx';
import {Recipe, testRecipe} from '../types/recipe';

export default class RecipeStore {
  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  recipes: Recipe[] = [testRecipe];

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  }

  removeRecipe(recipe: Recipe) {
    this.recipes = this.recipes.filter(r => r !== recipe);
  }
}
