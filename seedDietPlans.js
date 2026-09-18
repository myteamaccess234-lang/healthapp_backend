const mongoose = require('mongoose');
const DietPlan = require('./dietplanModel'); // Make sure path matches your model file

// Replace with your actual MongoDB Atlas connection string 
// (or use process.env.MONGO_URI if you have dotenv configured)
const MONGO_URI = 'your_mongodb_atlas_connection_string_here';

// Sample data structure representing your age groups (16 to 75)
// Add your 61 age documents inside this array
const dietPlansData = [
  {
    age: 51,
    categories: {
      underweight: {
        portions: "1½–2 cups / 150g non-veg",
        weeks: {
          week1: [
            { day: "Monday", breakfast: "Ragi Vegetable Roti", lunch: "Chayote Dal Curry with Roti", snack: "Lobia Chaat", dinner: "Drumstick Leaves Dal with Roti" },
            // ... add Tuesday to Sunday for Week 1
          ],
          week2: [/* ... */],
          week3: [/* ... */],
          week4: [/* ... */]
        }
      },
      normal: {
        portions: "1–1½ cups / 120g non-veg",
        weeks: {
          week1: [/* ... */],
          week2: [/* ... */],
          week3: [/* ... */],
          week4: [/* ... */]
        }
      },
      overweight: {
        portions: "¾–1 cup / 90–100g non-veg",
        weeks: {
          week1: [/* ... */],
          week2: [/* ... */],
          week3: [/* ... */],
          week4: [/* ... */]
        }
      }
    }
  },
  // ... Repeat for ages 16 through 75
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected for seeding...');

    // Clear existing diet plans to avoid duplication duplicates if run multiple times
    await DietPlan.deleteMany({});
    console.log('Old diet plans cleared.');

    // Insert all documents at once
    await DietPlan.insertMany(dietPlansData);
    console.log('Successfully seeded all age group diet plans into MongoDB Atlas!');

    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  }
}

seedDB();
