const mongoose = require('./config/db');
const Meal = require('./models/meal.model');

const meals = [
  {
    name: 'Jollof Rice with Chicken',
    category: 'lunch',
    ingredients: [
      'rice',
      'tomato',
      'onion',
      'chicken',
      'vegetable oil',
      'pepper',
      'spices',
      'salt'
    ],
    nutrients: {
      calories: 650,
      protein: 28,
      fat: 18,
      carbs: 90,
      fiber: 4,
      sugar: 8,
      sodium: 900,
      calcium: 60,
      iron: 3,
      potassium: 400,
      vitaminC: 12
    },
    imageURL: 'https://example.com/images/jollof-rice.jpg'
  },
  {
    name: 'Banku and Tilapia',
    category: 'dinner',
    ingredients: [
      'corn dough',
      'cassava dough',
      'tilapia',
      'pepper',
      'onion',
      'tomato',
      'spices',
      'salt'
    ],
    nutrients: {
      calories: 700,
      protein: 35,
      fat: 15,
      carbs: 100,
      fiber: 5,
      sugar: 6,
      sodium: 850,
      calcium: 80,
      iron: 2.5,
      potassium: 500,
      vitaminC: 10
    },
    imageURL: 'https://example.com/images/banku-tilapia.jpg'
  },
  {
    name: 'Waakye',
    category: 'lunch',
    ingredients: [
      'rice',
      'black-eyed beans',
      'millet leaves',
      'egg',
      'spaghetti',
      'shito',
      'gari',
      'meat',
      'fish',
      'salt'
    ],
    nutrients: {
      calories: 800,
      protein: 32,
      fat: 22,
      carbs: 120,
      fiber: 8,
      sugar: 7,
      sodium: 950,
      calcium: 70,
      iron: 4,
      potassium: 600,
      vitaminC: 9
    },
    imageURL: 'https://example.com/images/waakye.jpg'
  },
  {
    name: 'Fufu and Light Soup',
    category: 'dinner',
    ingredients: [
      'cassava',
      'plantain',
      'goat meat',
      'tomato',
      'onion',
      'pepper',
      'spices',
      'salt'
    ],
    nutrients: {
      calories: 900,
      protein: 40,
      fat: 20,
      carbs: 140,
      fiber: 6,
      sugar: 5,
      sodium: 1000,
      calcium: 90,
      iron: 3.5,
      potassium: 700,
      vitaminC: 15
    },
    imageURL: 'https://example.com/images/fufu-light-soup.jpg'
  },
  {
    name: 'Kelewele',
    category: 'snack',
    ingredients: [
      'ripe plantain',
      'ginger',
      'pepper',
      'spices',
      'salt',
      'vegetable oil'
    ],
    nutrients: {
      calories: 400,
      protein: 3,
      fat: 18,
      carbs: 60,
      fiber: 3,
      sugar: 24,
      sodium: 300,
      calcium: 20,
      iron: 1,
      potassium: 450,
      vitaminC: 8
    },
    imageURL: 'https://example.com/images/kelewele.jpg'
  }
];

async function seedMeals() {
  try {
    await Meal.deleteMany({});
    await Meal.insertMany(meals);
    console.log('Seeded 5 Ghanaian meals successfully!');
  } catch (err) {
    console.error('Error seeding meals:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedMeals(); 