import auth from '@react-native-firebase/auth';

const baseUrl = 'http://192.168.1.168:8080/';
export const addRecipeURL = baseUrl + 'recipe/add';

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
