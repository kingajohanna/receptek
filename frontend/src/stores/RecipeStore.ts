import {makeAutoObservable, runInAction} from 'mobx';
import {
  addFavRecipe,
  addRecipe,
  deleteRecipe,
  getFavRecipes,
  getRecipes,
  setRecipe,
} from '../constants/backend';
import {Recipe, testRecipe} from '../types/recipe';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const all = 'All';
export default class RecipeStore {
  recipes: Recipe[] = [];
  favourites: Recipe[] = [];
  categories: string[] = [all, 'ebéd', 'vacsi'];
  cuisines: string[] = [all, 'kínai', 'olasz'];

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
    const categories: string[] = [all];
    const cuisines: string[] = [all];
    recipes.map(recipe => {
      if (recipe.category && !categories.includes(recipe.category))
        categories.push(recipe.category);
      if (recipe.cuisine && !cuisines.includes(recipe.cuisine))
        cuisines.push(recipe.cuisine);
    });

    runInAction(() => {
      this.recipes = recipes;
      this.categories = categories;
      this.cuisines = cuisines;
    });
  }

  async setFavourites() {
    const favs = await getFavRecipes();

    runInAction(() => {
      this.favourites = favs;
    });
  }

  refresh() {
    this.setRecipes();
    this.setFavourites();
  }

  async addRecipe(url: string) {
    await addRecipe(url);
    this.refresh();
  }

  async removeRecipe(recipeID: string) {
    await deleteRecipe(recipeID);
    this.refresh();
  }

  removeRecipes() {
    this.recipes = [];
  }

  getRecipes() {
    return this.recipes;
  }

  async addFav(recipeID: string) {
    await addFavRecipe(recipeID);
    this.refresh();
  }

  async editRecipe(recipeID: string, body: any) {
    const modifiedRecipe = await setRecipe(recipeID, body);
    this.refresh();
    return modifiedRecipe;
  }
}
