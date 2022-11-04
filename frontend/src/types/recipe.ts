export type Recipe = {
  title: string;
  totalTime: string;
  ingredients: string;
  instructions: string;
  image: string;
};

export const testRecipe: Recipe = {
  title: 'test',
  totalTime: '120 min',
  ingredients: `1 bab, 
    2 bab,
    3 bab,
    4 bab
    `,
  instructions: 'főzd meg',
  image:
    'https://images.everydayhealth.com/images/diet-nutrition/34da4c4e-82c3-47d7-953d-121945eada1e00-giveitup-unhealthyfood.jpg',
};
