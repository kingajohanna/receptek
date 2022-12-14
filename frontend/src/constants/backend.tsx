import auth from '@react-native-firebase/auth';
import {Recipe} from '../types/recipe';

const baseUrl = 'https://192.168.1.168:8080/';

export const addRecipeURL = baseUrl + 'recipe/add/';

export const getRecipeURL = baseUrl + 'recipe/get/';

export const deleteRecipeURL = baseUrl + 'recipe/del/';

export const addFavRecipeURL = baseUrl + 'recipe/fav/';

export const getFavRecipeURL = baseUrl + 'recipe/get/favorite/';

export const setRecipeURL = baseUrl + 'recipe/edit/';

export const addUserURL = baseUrl + 'user/add/';

export const deleteUserURL = baseUrl + 'user/del/';

export const addRecipe = async (url: string) => {
  const token = await auth().currentUser?.getIdToken(true);

  const response = await fetch(addRecipeURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token!,
    },
    body: JSON.stringify({
      url: url,
    }),
  });
  console.log('addrecipe', response);

  return response;
};

export const getRecipes = async () => {
  const token = await auth().currentUser?.getIdToken(true);

  const response = await fetch(getRecipeURL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token!,
    },
  });
  const data = (await response.json()) as Recipe[];
  console.log('getrecipe', data);

  return data;
};

export const deleteRecipe = async (recipeID: string) => {
  const token = await auth().currentUser?.getIdToken(true);

  const url = deleteRecipeURL + recipeID + '/';

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token!,
    },
  });
  const data = (await response.json()) as Recipe[];
  console.log('deleteRecipe', data);

  return data;
};

export const addFavRecipe = async (recipeID: string) => {
  const token = await auth().currentUser?.getIdToken(true);

  const url = addFavRecipeURL + recipeID + '/';

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token!,
    },
  });
  console.log('addfav', response);

  return response;
};

export const getFavRecipes = async () => {
  const token = await auth().currentUser?.getIdToken(true);

  const response = await fetch(getFavRecipeURL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token!,
    },
  });
  const data = (await response.json()) as Recipe[];

  console.log('getfav', data);

  return data;
};

export const setRecipe = async (recipeID: string, body: any) => {
  const token = await auth().currentUser?.getIdToken(true);
  console.log(token, body);

  const url = setRecipeURL + recipeID + '/';

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token!,
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as Recipe;

  console.log('editrecipe', data);

  return data;
};

export const addUser = async () => {
  const token = await auth().currentUser?.getIdToken(true);

  const response = await fetch(addUserURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token!,
    },
  });
  console.log('adduser', response);

  return response;
};

export const deleteUser = async () => {
  const token = await auth().currentUser?.getIdToken(true);

  const url = deleteUserURL + auth().currentUser?.uid + '/';

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token!,
    },
  });

  console.log('deleteuser', response);

  return response;
};
