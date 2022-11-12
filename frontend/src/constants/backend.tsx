import auth from '@react-native-firebase/auth';
import {Recipe} from '../types/recipe';

const baseUrl = 'http://192.168.1.168:8080/';
export const addRecipeURL = baseUrl + 'recipe/add/';

export const getRecipeURL = baseUrl + 'recipe/get/';

export const addRecipe = async (url: string) => {
  const token = await auth().currentUser?.getIdToken(true);
  console.log(token);

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
  console.log(response);

  return response;
};

export const getRecipes = async () => {
  const token = await auth().currentUser?.getIdToken(true);
  console.log(token);

  const response = await fetch(getRecipeURL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token!,
    },
  });
  const data = (await response.json()) as Recipe[];
  console.log(data);

  return data;
};
