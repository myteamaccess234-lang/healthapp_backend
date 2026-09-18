const mongoose = require('mongoose');
const DietPlan = require('./dietplanModel'); // Make sure path matches your model file
require('dotenv').config();

// Use environment variables for your MongoDB Atlas connection string
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

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
            { day: "Tuesday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Gongura Pappu with Rice", snack: "Banana Ragi Balls", dinner: "Vegetable Sevai with Chana Dal" },
            { day: "Wednesday", breakfast: "Leftover Rice Paniyaram", lunch: "Home-Style Chicken Methi Garlic Roast (150g non-veg)", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Ragi Kozhukattai with Chutney" },
            { day: "Thursday", breakfast: "Millet Vegetable Pancake", lunch: "Methi Corn Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Bajra Thalipeeth with Curd" },
            { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Green Gram Masala with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Methi Handvo with Chutney" },
            { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Raw Mango Dal with Rice", snack: "Roasted Cowpeas", dinner: "Dudhi Muthia with Curd" },
            { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "Spicy Chicken Andhra Fry (150g non-veg)", snack: "Roasted Green Gram", dinner: "Aval Vegetable Kichadi" }
          ],
          week2: [
            { day: "Monday", breakfast: "Methi Thalipeeth", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Onion Thalipeeth with Curd" },
            { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Dal with Amaranth Leaves", snack: "Roasted Gram Balls", dinner: "Cowpea Curry with Ragi Roti" },
            { day: "Wednesday", breakfast: "Lemon Sevai with Peanuts", lunch: "Traditional Chicken Telangana Fry (150g non-veg)", snack: "Homemade Poha Chivda", dinner: "Ragi Dhokla with Curd" },
            { day: "Thursday", breakfast: "Guava Curd Bowl", lunch: "Dal with Drumstick Leaves", snack: "Sattu Buttermilk", dinner: "Methi Missi Roti with Dal" },
            { day: "Friday", breakfast: "Ragi Rotti with Chutney", lunch: "Dill Leaves Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Vegetable Handvo with Curd" },
            { day: "Saturday", breakfast: "Mixed Dal Adai", lunch: "Beetroot Coconut Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Ajwain Missi Roti with Dal" },
            { day: "Sunday", breakfast: "Onion Paniyaram", lunch: "Light Chicken Tawa Lemon Fry (150g non-veg)", snack: "Roasted Chana Ladoo", dinner: "Green Peas Muthia with Curd" }
          ],
          week3: [
            { day: "Monday", breakfast: "Ragi Paniyaram", lunch: "Stuffed Brinjal with Rice", snack: "Banana Sattu Shake", dinner: "Vegetable Rice Kozhukattai" },
            { day: "Tuesday", breakfast: "Vegetable Adai", lunch: "Moong Dal with Sweet Potato", snack: "Sattu Jaggery Balls", dinner: "Sattu Roti with Dal" },
            { day: "Wednesday", breakfast: "Ragi Dhokla", lunch: "Traditional Prawn Tawa Fry (150g non-veg)", snack: "Banana Jaggery Milk", dinner: "Stuffed Bhindi with Roti" },
            { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Stuffed Bhindi with Roti", snack: "Ragi Buttermilk", dinner: "Ragi Malt with Roti and Dal" },
            { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Cowpea Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Khaman Dhokla with Curd" },
            { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Kala Vatana Usal with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Methi Akki Rotti" },
            { day: "Sunday", breakfast: "Jowar Vegetable Pancake", lunch: "Spicy Chicken Mangalorean Fry (150g non-veg)", snack: "Boiled Groundnut Salad", dinner: "Black-Eyed Pea Curry with Roti" }
          ],
          week4: [
            { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Broad Beans Dal Curry with Rice", snack: "Banana Ragi Shake", dinner: "Bharli Vangi with Bhakri" },
            { day: "Tuesday", breakfast: "Methi Missi Roti", lunch: "Sprouted Moong Curry with Rice", snack: "Bajra Malt Drink", dinner: "Onion Besan Cheela with Curd" },
            { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Chicken Peanut Fry (120g non-veg)", snack: "Mint Buttermilk", dinner: "Jowar Rotti with Dal" },
            { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Green Peas Usal with Roti", snack: "Peanut Sundal", dinner: "Sweet Potato Peas Curry with Phulka" },
            { day: "Friday", breakfast: "Vegetable Muthia", lunch: "Cauliflower Peas Masala with Rice", snack: "Homemade Peanut Bar", dinner: "Vegetable Muthia with Curd" },
            { day: "Saturday", breakfast: "Banana Ragi Pancake", lunch: "Tindora Peanut Curry with Rice", snack: "Raw Banana Chaat", dinner: "Jowar Malt with Vegetable Curry" },
            { day: "Sunday", breakfast: "Bajra Malt with Jaggery", lunch: "Traditional Chicken Lemon Herb Roast (120g non-veg)", snack: "Green Gram Chaat", dinner: "Carrot Roti with Dal" }
          ]
        }
      },
      normal: {
        portions: "1–1½ cups / 120g non-veg",
        weeks: {
          week1: [
            { day: "Monday", breakfast: "Palak Dhokla", lunch: "Potato Methi Curry with Roti", snack: "Rice Kanji Drink", dinner: "Kala Vatana Usal with Roti" },
            { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "Sweet Potato Peas Curry with Roti", snack: "Curd Peanut Bowl", dinner: "Methi Besan Cheela with Curd" },
            { day: "Wednesday", breakfast: "Methi Muthia", lunch: "Light Chicken Punjabi Masala Fry (120g non-veg)", snack: "Boiled Peanut Chaat", dinner: "Rava Vegetable Kichadi" },
            { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Beerakaya Pappu with Rice", snack: "Papaya Lassi", dinner: "Vegetable Thalipeeth with Curd" },
            { day: "Friday", breakfast: "Jowar Malt with Milk", lunch: "Raw Banana Masala with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Stuffed Tindora with Roti" },
            { day: "Saturday", breakfast: "Bajra Methi Roti", lunch: "Spinach Corn Curry with Rice", snack: "Roasted Mung Beans", dinner: "Carrot Peas Masala with Phulka" },
            { day: "Sunday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Traditional Chicken Sesame Pepper Roast (120g non-veg)", snack: "Plain Homemade Lassi", dinner: "Sattu Cheela with Curd" }
          ],
          week2: [],
          week3: [],
          week4: []
        }
      },
      overweight: {
        portions: "¾–1 cup / 90–100g non-veg",
        weeks: {
          week1: [
            { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Kala Vatana Usal with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Moong Dal Handvo" },
            { day: "Tuesday", breakfast: "Beetroot Roti with Curd", lunch: "Masoor Dal with Methi", snack: "Curd Banana Jaggery Bowl", dinner: "Lobia Curry with Roti" },
            { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Home-Style Prawn Jeera Fry (90–100g non-veg)", snack: "Peanut Poha Chivda", dinner: "Rice Kanji with Dal" },
            { day: "Thursday", breakfast: "Rava Paniyaram", lunch: "Moong Dal with Spinach", snack: "White Pea Chaat", dinner: "Mixed Dal Cheela with Curd" },
            { day: "Friday", breakfast: "Papaya Curd Bowl", lunch: "Drumstick Leaves Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Broad Beans Dal Curry with Phulka" },
            { day: "Saturday", breakfast: "Aval Upma with Peanuts", lunch: "Broad Beans Masala with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Raw Banana Masala with Phulka" },
            { day: "Sunday", breakfast: "Jowar Kanji with Curd", lunch: "Traditional Fish Coconut Garlic Curry (90–100g non-veg)", snack: "Boiled Yam Chaat", dinner: "Chana Dal Cheela with Chutney" }
          ],
          week2: [],
          week3: [],
          week4: []
        }
      }
    }
  }
  // ... Repeat for ages 16 through 75
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Database connected for seeding...');

    // Clear existing diet plans to avoid duplicates if run multiple times
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
