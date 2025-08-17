const mongoose = require('./config/db');
const Meal = require('./models/meal.model');
const fs = require('fs');

// Load meals from JSON
const rawData = fs.readFileSync('ghanaian_meals.json');
const jsonData = JSON.parse(rawData);
const mealsData = jsonData.meals;

// Allowed categories in the model
const allowedCategories = ['breakfast', 'lunch', 'dinner', 'snack'];

// Generic fallback ingredients by category
const genericIngredients = {
  breakfast: ['maize', 'sugar', 'water', 'salt'],
  lunch: ['rice', 'tomato', 'onion', 'oil', 'spices', 'salt'],
  dinner: ['cassava', 'plantain', 'meat', 'pepper', 'onion', 'spices', 'salt'],
  snack: ['plantain', 'oil', 'spices', 'salt'],
  default: ['ingredient1', 'ingredient2']
};

// Map JSON meal to DB meal model
function mapMeal(jsonMeal) {
  // Map category
  let category = (jsonMeal.category || '').toLowerCase();
  if (!allowedCategories.includes(category)) {
    // Guess category based on tags or fallback
    if (jsonMeal.tags && Array.isArray(jsonMeal.tags)) {
      if (jsonMeal.tags.includes('breakfast')) category = 'breakfast';
      else if (jsonMeal.tags.includes('lunch')) category = 'lunch';
      else if (jsonMeal.tags.includes('dinner')) category = 'dinner';
      else if (jsonMeal.tags.includes('snack')) category = 'snack';
      else category = 'lunch';
    } else {
      category = 'lunch';
    }
  }

  // Ingredients: not in JSON, so use generic by category
  let ingredients = genericIngredients[category] || genericIngredients.default;

  // Nutrients: fill missing with 0
  const n = jsonMeal.nutrients || {};
  const nutrients = {
    calories: n.calories ?? 0,
    protein: n.protein ?? 0,
    fat: n.fat ?? 0,
    carbs: n.carbs ?? 0,
    fiber: n.fiber ?? 0,
    sugar: n.sugar ?? 0,
    sodium: n.sodium ?? 0,
    calcium: n.calcium ?? 0,
    iron: n.iron ?? 0,
    potassium: n.potassium ?? 0,
    vitaminC: n.vitaminC ?? 0
  };

  return {
    name: jsonMeal.name,
    category,
    ingredients,
    nutrients,
    imageURL: ''
  };
}

async function importMeals() {
  let inserted = 0;
  for (let i = 0; i < mealsData.length; i += 5) {
    const batch = mealsData.slice(i, i + 5);
    for (const meal of batch) {
      // Check for duplicate by name
      const exists = await Meal.findOne({ name: meal.name });
      if (exists) {
        console.log(`Skipping existing meal: ${meal.name}`);
        continue;
      }
      // Map and insert
      const mapped = mapMeal(meal);
      try {
        await Meal.create(mapped);
        console.log(`Inserted: ${mapped.name}`);
        inserted++;
      } catch (err) {
        console.error(`Error inserting ${mapped.name}:`, err.message);
      }
    }
  }
  console.log(`\nDone. Inserted ${inserted} new meals.`);
  mongoose.connection.close();
}

importMeals(); 