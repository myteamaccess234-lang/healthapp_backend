const mongoose = require('mongoose');
const DietPlan = require('./dietplanModel'); // Make sure path matches your model file
require('dotenv').config();

// Use environment variables for your MongoDB Atlas connection string
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// Sample data structure representing your age groups (16 to 75)
// Add your 61 age documents inside this array
const dietPlansData = [
 // Age 16 | underweight | plan1
  {
    age: 16, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Carrot Muthia", lunch: "Lobia Curry with Rice", snack: "White Peas Sundal", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Dal with Carrot and Beans", snack: "Guava Jaggery Bowl", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Banana Jowar Pancake", lunch: "Chicken Curry Leaf Roast", snack: "Ragi Buttermilk", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Gongura Pappu with Rice", snack: "Papaya Lassi", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Amaranth Leaves Curry with Rice", snack: "Ragi Banana Balls", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Saturday", breakfast: "Green Peas Roti", lunch: "Masoor Dal with Methi", snack: "Jaggery Lassi", dinner: "Carrot Roti with Dal" },
      { day: "Sunday", breakfast: "Drumstick Leaves Adai", lunch: "Fish Curry Leaf Roast", snack: "Sattu Jaggery Ladoo", dinner: "Moong Dal Dhokla with Chutney" }
    ]
  },
  // Age 16 | underweight | plan2
  {
    age: 16, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Palak Missi Roti", lunch: "Dal with Amaranth Leaves", snack: "Banana Ragi Balls", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Radish Roti with Curd", lunch: "Andhra Mudda Pappu with Rice", snack: "Dry Roasted Corn", dinner: "Coconut Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Chicken Coconut Ginger Roast", snack: "Homemade Banana Shake", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Matki Usal with Bhakri", snack: "Cucumber Roasted Chana Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Friday", breakfast: "Vegetable Thalipeeth", lunch: "Raw Banana Masala with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Chana Dal with Spinach", snack: "Roasted Rice Flake Mixture", dinner: "Radish Roti with Dal" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Prawn Mustard Curry", snack: "Peanut Jaggery Ladoo", dinner: "Jowar Ambli with Roti" }
    ]
  },
  // Age 16 | underweight | plan3
  {
    age: 16, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Stuffed Brinjal with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Tuesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Maharashtrian Amti with Rice", snack: "Bajra Malt Drink", dinner: "Jowar Rotti with Dal" },
      { day: "Wednesday", breakfast: "Methi Akki Rotti", lunch: "Chicken Onion Fry", snack: "Green Gram Chaat", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Methi Peas Curry with Roti", snack: "Banana Jaggery Milk", dinner: "Chana Usal with Bhakri" },
      { day: "Friday", breakfast: "Palak Dhokla", lunch: "Carrot Chana Curry with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Onion Adai with Chutney" },
      { day: "Saturday", breakfast: "Ragi Rotti with Chutney", lunch: "Dal with Fenugreek Leaves", snack: "Homemade Poha Chivda", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Lemon Sevai with Peanuts", lunch: "Chicken Ginger Coriander Roast", snack: "Sattu Buttermilk", dinner: "Sweet Potato Peas Curry with Phulka" }
    ]
  },
  // Age 16 | underweight | plan4
  {
    age: 16, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Ambli", lunch: "Sattu Curry with Roti", snack: "Carrot Peanut Chaat", dinner: "Mixed Dal Adai with Curd" },
      { day: "Tuesday", breakfast: "Cabbage Besan Cheela", lunch: "Potato Peas Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Wednesday", breakfast: "Onion Missi Roti", lunch: "Chicken Lemon Herb Roast", snack: "Curd Cucumber Peanut Bowl", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Onion Paniyaram", lunch: "Carrot Peas Masala with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Onion Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Peas Potato Curry with Roti", snack: "Boiled Corn with Lemon", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Rice Kanji with Curd", lunch: "Moong Dal with Spinach", snack: "Roasted Chana Jaggery Mix", dinner: "Sattu Curry with Phulka" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Chicken Telangana Pepper Roast", snack: "Jowar Puffed Grain Chaat", dinner: "Sattu Cheela with Curd" }
    ]
  },
  // Age 16 | normal | plan1
  {
    age: 16, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Guava Curd Bowl", lunch: "Black-Eyed Pea Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Methi Handvo with Chutney" },
      { day: "Tuesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Sprouted Moong Curry with Rice", snack: "Horse Gram Sundal", dinner: "Dudhi Muthia with Curd" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Roti", lunch: "Chicken Curry Leaf Fry", snack: "Plain Homemade Lassi", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Spinach Chana Curry with Roti", snack: "Cowpea Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Rava Paniyaram", lunch: "Cauliflower Peas Masala with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Saturday", breakfast: "Jowar Thalipeeth", lunch: "Kala Vatana Usal with Rice", snack: "Beetroot Peanut Chaat", dinner: "Methi Adai with Curd" },
      { day: "Sunday", breakfast: "Ragi Dhokla", lunch: "Chicken Gongura Fry", snack: "Roasted Cowpeas", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 16 | normal | plan2
  {
    age: 16, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Banana with Roasted Peanuts", lunch: "Brinjal Peanut Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Moong Dal with Sweet Potato", snack: "Boiled Groundnut Salad", dinner: "Urad Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Carrot Besan Cheela", lunch: "Chicken Fenugreek Fry", snack: "Jowar Chikki", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Beerakaya Pappu with Rice", snack: "Guava Peanut Chaat", dinner: "Stuffed Bhindi with Roti" },
      { day: "Friday", breakfast: "Banana Ragi Pancake", lunch: "Matki Usal with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Stuffed Brinjal with Roti" },
      { day: "Saturday", breakfast: "Chana Dal Cheela", lunch: "Tindora Peanut Curry with Rice", snack: "Homemade Corn Chivda", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Ammini Kozhukattai", lunch: "Chicken Ginger Lemon Fry", snack: "Murmura Onion Chaat", dinner: "Moong Dal Handvo" }
    ]
  },
  // Age 16 | normal | plan3
  {
    age: 16, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Dudhi Muthia", lunch: "Beetroot Masala with Roti", snack: "Rice Kanji Drink", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Sprouted Moong Curry with Roti", snack: "Mint Buttermilk", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Millet Vegetable Pancake", lunch: "Chicken Cumin Coriander Roast", snack: "Murmura Peanut Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Sweet Potato Roti", lunch: "Potato Beans Curry with Rice", snack: "Roasted Mung Beans", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Bottle Gourd Handvo", lunch: "Brinjal Coconut Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Palak Missi Roti with Curd" },
      { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Brinjal Dal Curry with Roti", snack: "Cowpea Sundal", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "Chicken Coconut Masala Fry", snack: "Banana Lassi", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 16 | normal | plan4
  {
    age: 16, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Methi Handvo", lunch: "Kala Vatana Usal with Roti", snack: "Green Gram Sundal", dinner: "Vegetable Adai with Curd" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "White Peas Masala with Roti", snack: "Homemade Murmura Chaat", dinner: "Sweet Potato Roti with Curd" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Chicken Mangalorean Fry", snack: "Puffed Rice Peanut Mixture", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "Green Peas Usal with Roti", snack: "Boiled Peanut Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Chayote Moong Curry with Rice", snack: "Black Chana Sundal", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Cabbage Moong Curry with Roti", snack: "Jaggery Ragi Milk", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Ajwain Missi Roti", lunch: "Prawn Pepper Fry", snack: "Papaya Coconut Bowl", dinner: "Carrot Peas Masala with Phulka" }
    ]
  },
  // Age 16 | overweight | plan1
  {
    age: 16, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Urad Dal Cheela", lunch: "Potato Methi Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Green Gram Masala with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Green Peas Muthia with Curd" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Chicken Dry Peanut Roast", snack: "Poha Jaggery Ladoo", dinner: "Palak Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Jowar Kanji with Curd", lunch: "Broad Beans Masala with Rice", snack: "Roasted Chana Ladoo", dinner: "Akki Rotti with Curd" },
      { day: "Friday", breakfast: "Masoor Dal Cheela", lunch: "Chana Dal with Ridge Gourd", snack: "Curry Leaf Buttermilk", dinner: "Bajra Ambli with Curd" },
      { day: "Saturday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Raw Mango Dal with Rice", snack: "Curd Peanut Bowl", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Adai", lunch: "Chicken Tawa Curry Leaf Fry", snack: "Homemade Peanut Bar", dinner: "Ragi Rotti with Curd" }
    ]
  },
  // Age 16 | overweight | plan2
  {
    age: 16, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Bharli Vangi with Bhakri", snack: "Ginger Buttermilk", dinner: "Methi Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Besan Dhokla", lunch: "Broad Beans Dal Curry with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Chicken Lemon Garlic Roast", snack: "Roasted Green Gram", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Thursday", breakfast: "Khaman Dhokla", lunch: "Dal with Drumstick Leaves", snack: "Jeera Buttermilk", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Gujarati Dal with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Saturday", breakfast: "Jowar Methi Roti", lunch: "Black-Eyed Pea Curry with Roti", snack: "Ragi Peanut Ladoo", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Sunday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Chicken Curry Leaf Lemon Fry", snack: "Ragi Peanut Chikki", dinner: "Aval Vegetable Kichadi" }
    ]
  },
  // Age 16 | overweight | plan3
  {
    age: 16, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Sattu Cheela", lunch: "Beetroot Coconut Curry with Rice", snack: "Lobia Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Carrot Roti with Curd", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Vegetable Muthia with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Handvo", lunch: "Chicken Sukka", snack: "Sattu Jaggery Balls", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Thursday", breakfast: "Moong Dal Roti", lunch: "Sweet Potato Peas Curry with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Yam Pepper Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Rice Kanji with Dal" },
      { day: "Saturday", breakfast: "Chana Dal Roti", lunch: "Cowpea Curry with Rice", snack: "Jowar Malt Drink", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Vegetable Adai", lunch: "Chicken Garlic Lemon Fry", snack: "Banana Sesame Chaat", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 16 | overweight | plan4
  {
    age: 16, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Methi Missi Roti", lunch: "Spinach Corn Curry with Rice", snack: "Banana Sattu Shake", dinner: "Raw Banana Masala with Phulka" },
      { day: "Tuesday", breakfast: "Methi Thalipeeth", lunch: "Carrot Peas Masala with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Rava Vegetable Kichadi" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Chicken Telangana Fry", snack: "Papaya Peanut Chaat", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Methi Corn Curry with Rice", snack: "Roasted Gram Balls", dinner: "Bajra Rotti with Dal" },
      { day: "Friday", breakfast: "Vegetable Muthia", lunch: "Drumstick Leaves Curry with Rice", snack: "White Pea Chaat", dinner: "Jowar Muthia with Dal" },
      { day: "Saturday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Amaranth Dal with Roti", snack: "Puffed Rice Chikki", dinner: "Ragi Dhokla with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "Prawn Green Masala Fry", snack: "Coconut Jaggery Ladoo", dinner: "Lobia Curry with Roti" }
    ]
  },
  // Age 17 | underweight | plan1
  {
    age: 17, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Tindora Sesame Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Vegetable Thalipeeth", lunch: "Green Gram Masala with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Chicken Mint Coriander Fry", snack: "Roasted Black Chana with Lemon", dinner: "Moong Dal Handvo" },
      { day: "Thursday", breakfast: "Mixed Dal Adai", lunch: "Dill Leaves Dal with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Bajra Thalipeeth", lunch: "Matki Usal with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Saturday", breakfast: "Methi Adai", lunch: "Green Gram Masala with Roti", snack: "White Pea Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Banana Jowar Pancake", lunch: "Chicken Sukka", snack: "Roasted Bengal Gram with Onion", dinner: "Jowar Kanji with Dal" }
    ]
  },
  // Age 17 | underweight | plan2
  {
    age: 17, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Aval Upma with Peanuts", lunch: "Broad Beans Masala with Roti", snack: "Boiled Yam Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Beetroot Coconut Curry with Rice", snack: "Peanut Poha Chivda", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Bajra Ambli", lunch: "Prawn Ginger Garlic Fry", snack: "Black Chana Sundal", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Thursday", breakfast: "Jowar Methi Roti", lunch: "Cabbage Moong Curry with Roti", snack: "Homemade Banana Shake", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Onion Adai", lunch: "White Peas Masala with Roti", snack: "Boiled Groundnut Salad", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Chana Dal Cheela", lunch: "Potato Beans Curry with Roti", snack: "Peanut Chikki", dinner: "Ragi Dhokla with Curd" },
      { day: "Sunday", breakfast: "Ragi Dhokla", lunch: "Chicken Coconut Fry", snack: "Sattu Buttermilk", dinner: "Moong Dal Dhokla with Chutney" }
    ]
  },
  // Age 17 | underweight | plan3
  {
    age: 17, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Jowar Chikki", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Sweet Potato Peas Curry with Roti", snack: "Mint Buttermilk", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Roti", lunch: "Fish Green Masala Fry", snack: "Raw Banana Chaat", dinner: "Onion Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Methi Muthia", lunch: "Drumstick Leaves Dal with Roti", snack: "Roasted Chana Ladoo", dinner: "Radish Roti with Dal" },
      { day: "Friday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Masoor Dal with Methi", snack: "Curd Peanut Bowl", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Jowar Vegetable Pancake", lunch: "Chayote Dal Curry with Roti", snack: "Cowpea Chaat", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Banana with Roasted Peanuts", lunch: "Chicken Mustard Pepper Roast", snack: "Roasted Cowpeas", dinner: "Rava Vegetable Kichadi" }
    ]
  },
  // Age 17 | underweight | plan4
  {
    age: 17, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Amaranth Leaves Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Sattu Cheela with Curd" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Stuffed Brinjal with Rice", snack: "Jaggery Ragi Milk", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Rava Paniyaram", lunch: "Prawn Andhra Pepper Fry", snack: "Curd Banana Jaggery Bowl", dinner: "Green Peas Roti with Curd" },
      { day: "Thursday", breakfast: "Papaya Curd Bowl", lunch: "Carrot Peas Masala with Rice", snack: "Banana Lassi", dinner: "Carrot Muthia with Dal" },
      { day: "Friday", breakfast: "Vegetable Paniyaram", lunch: "Carrot Chana Curry with Rice", snack: "Curry Leaf Buttermilk", dinner: "Bharli Vangi with Bhakri" },
      { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Potato Peas Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Jowar Muthia with Dal" },
      { day: "Sunday", breakfast: "Methi Besan Cheela", lunch: "Chicken Pepper Roast", snack: "Banana Ragi Shake", dinner: "Ragi Ambli with Roti" }
    ]
  },
  // Age 17 | normal | plan1
  {
    age: 17, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Onion Paniyaram", lunch: "Yam Pepper Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Chana Dal Roti with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Handvo", lunch: "Raw Banana Masala with Rice", snack: "Roasted Chana Chikki", dinner: "Akki Rotti with Curd" },
      { day: "Wednesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Chicken Curry Leaf Roast", snack: "Guava Peanut Chaat", dinner: "Coconut Sevai with Peanuts" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Dill Leaves Curry with Roti", snack: "Roasted Peanuts with Curry Leaves", dinner: "Sattu Roti with Dal" },
      { day: "Friday", breakfast: "Vegetable Muthia", lunch: "Kala Vatana Usal with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Vegetable Handvo with Curd" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Potato Methi Curry with Roti", snack: "Ragi Peanut Chikki", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Sunday", breakfast: "Chana Dal Roti", lunch: "Chicken Telangana Fry", snack: "Boiled Chana Chaat with Onion", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 17 | normal | plan2
  {
    age: 17, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Drumstick Leaves Curry with Rice", snack: "Boiled Peanut Chaat", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Carrot Roti with Curd", lunch: "Methi Corn Curry with Rice", snack: "Jowar Malt Drink", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Wednesday", breakfast: "Mixed Dal Cheela", lunch: "Chicken Pepper Fry", snack: "Curd Roasted Chana Bowl", dinner: "Beetroot Masala with Roti" },
      { day: "Thursday", breakfast: "Bottle Gourd Handvo", lunch: "Cowpea Masala with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Onion Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Ragi Ambli with Jaggery", lunch: "Dal with Drumstick Leaves", snack: "Murmura Peanut Chaat", dinner: "Matki Usal with Bhakri" },
      { day: "Saturday", breakfast: "Dudhi Muthia", lunch: "Chayote Moong Curry with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Paniyaram", lunch: "Chicken Dry Lemon Roast", snack: "Bajra Puffed Grain Chaat", dinner: "Jowar Malt with Vegetable Curry" }
    ]
  },
  // Age 17 | normal | plan3
  {
    age: 17, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Sweet Potato Peas Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Sweet Potato Roti with Curd" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Methi Peas Curry with Roti", snack: "Green Gram Chaat", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Wednesday", breakfast: "Guava Curd Bowl", lunch: "Prawn Green Masala Fry", snack: "Poha Jaggery Ladoo", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Ragi Kozhukattai", lunch: "Raw Banana Masala with Roti", snack: "Ragi Peanut Ladoo", dinner: "Bajra Rotti with Dal" },
      { day: "Friday", breakfast: "Urad Dal Cheela", lunch: "Moong Dal with Spinach", snack: "Puffed Rice Chikki", dinner: "Stuffed Brinjal with Roti" },
      { day: "Saturday", breakfast: "Palak Missi Roti", lunch: "Black-Eyed Pea Curry with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Lobia Curry with Roti" },
      { day: "Sunday", breakfast: "Radish Roti with Curd", lunch: "Chicken Garlic Coriander Roast", snack: "Homemade Poha Chivda", dinner: "Vegetable Thalipeeth with Curd" }
    ]
  },
  // Age 17 | normal | plan4
  {
    age: 17, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Kala Vatana Usal with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Leftover Rice Paniyaram", lunch: "Cauliflower Methi Curry with Roti", snack: "Murmura Black Chana Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Wednesday", breakfast: "Ragi Paniyaram", lunch: "Chicken Andhra Fry", snack: "Sweet Potato Peanut Chaat", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Thursday", breakfast: "Sattu Vegetable Pancake", lunch: "Dal with Carrot and Beans", snack: "Bajra Malt Drink", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Ragi Vegetable Pancake", lunch: "Brinjal Coconut Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Saturday", breakfast: "Jowar Malt with Milk", lunch: "Black-Eyed Pea Curry with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Methi Akki Rotti" },
      { day: "Sunday", breakfast: "Sattu Cheela", lunch: "Chicken Jeera Pepper Fry", snack: "Sesame Chikki", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 17 | overweight | plan1
  {
    age: 17, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Peanut Banana Bowl", lunch: "Carrot Moong Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Tuesday", breakfast: "Bajra Malt with Jaggery", lunch: "Toor Dal with Raw Banana", snack: "Cowpea Sundal", dinner: "Chana Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Cabbage Besan Cheela", lunch: "Chicken Mustard Fry", snack: "Puffed Rice Peanut Mixture", dinner: "Yam Pepper Curry with Roti" },
      { day: "Thursday", breakfast: "Bajra Methi Roti", lunch: "White Peas Curry with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Cauliflower Dal Curry with Roti", snack: "Peanut Sundal", dinner: "Beetroot Roti with Curd" },
      { day: "Saturday", breakfast: "Jowar Muthia", lunch: "Moong Dal with Carrot", snack: "Jeera Buttermilk", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Methi Thalipeeth", lunch: "Chicken Tamarind Fry", snack: "Murmura Onion Chaat", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 17 | overweight | plan2
  {
    age: 17, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sattu Roti with Curd", lunch: "Dal with Fenugreek Leaves", snack: "Ragi Buttermilk", dinner: "Mixed Dal Adai with Curd" },
      { day: "Tuesday", breakfast: "Methi Handvo", lunch: "Peas Potato Curry with Roti", snack: "Banana Sesame Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Wednesday", breakfast: "Vegetable Rice Sevai", lunch: "Prawn Methi Masala", snack: "Guava Jaggery Bowl", dinner: "Rice Kanji with Dal" },
      { day: "Thursday", breakfast: "Jowar Ambli", lunch: "Amaranth Dal with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Aval Vegetable Kichadi" },
      { day: "Friday", breakfast: "Onion Missi Roti", lunch: "Maharashtrian Amti with Rice", snack: "Roasted Mung Beans", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Saturday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Chana Dal with Spinach", snack: "Homemade Ragi Savoury Balls", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Chicken Tawa Coriander Fry", snack: "Dry Roasted Corn", dinner: "Broad Beans Dal Curry with Phulka" }
    ]
  },
  // Age 17 | overweight | plan3
  {
    age: 17, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Adai", lunch: "Sprouted Moong Curry with Roti", snack: "Rice Kanji Drink", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Carrot Peas Masala with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Sattu Curry with Phulka" },
      { day: "Wednesday", breakfast: "Drumstick Leaves Adai", lunch: "Chicken Dry Green Masala Roast", snack: "Roasted Corn Peanut Mix", dinner: "Methi Handvo with Chutney" },
      { day: "Thursday", breakfast: "Ragi Malt with Jaggery", lunch: "Moong Dal with Sweet Potato", snack: "Jaggery Lassi", dinner: "Chayote Moong Curry with Roti" },
      { day: "Friday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Peas Potato Curry with Rice", snack: "Green Gram Sundal", dinner: "Vegetable Muthia with Curd" },
      { day: "Saturday", breakfast: "Ragi Rotti with Chutney", lunch: "Raw Mango Dal with Rice", snack: "Banana Sattu Shake", dinner: "Raw Banana Masala with Phulka" },
      { day: "Sunday", breakfast: "Onion Thalipeeth", lunch: "Chicken Coriander Pepper Fry", snack: "Ragi Puffed Grain Chaat", dinner: "Palak Besan Cheela with Curd" }
    ]
  },
  // Age 17 | overweight | plan4
  {
    age: 17, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Methi Missi Roti", lunch: "Broad Beans Masala with Rice", snack: "White Peas Sundal", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Tuesday", breakfast: "Moong Dal Roti", lunch: "Sattu Curry with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Jowar Ambli with Roti" },
      { day: "Wednesday", breakfast: "Green Peas Muthia", lunch: "Chicken Jeera Garlic Roast", snack: "Roasted Gram Balls", dinner: "Urad Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Banana Ragi Pancake", lunch: "Stuffed Tindora with Roti", snack: "Papaya Coconut Bowl", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Bengali Masoor Dal with Rice", snack: "Lobia Chaat", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Brinjal Peanut Curry with Rice", snack: "Sattu Jaggery Balls", dinner: "Bajra Ambli with Curd" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Chicken Tawa Fry", snack: "Homemade Corn Chivda", dinner: "Cabbage Besan Cheela with Chutney" }
    ]
  },
  // Age 18 | underweight | plan1
  {
    age: 18, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Lemon Sevai with Peanuts", lunch: "Lobia Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Vegetable Handvo with Curd" },
      { day: "Tuesday", breakfast: "Aval Upma with Peanuts", lunch: "Yam Masala with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Beetroot Roti with Curd" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Chicken Green Pepper Roast", snack: "Carrot Peanut Chaat", dinner: "Beetroot Masala with Roti" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Sprouted Moong Curry with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Friday", breakfast: "Chana Dal Roti", lunch: "Cauliflower Methi Curry with Roti", snack: "Rice Kanji Drink", dinner: "Methi Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Palak Dhokla", lunch: "Gongura Pappu with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Methi Muthia with Dal" },
      { day: "Sunday", breakfast: "Banana with Roasted Peanuts", lunch: "Chicken Curry Leaf Onion Roast", snack: "Homemade Corn Chivda", dinner: "Ajwain Missi Roti with Dal" }
    ]
  },
  // Age 18 | underweight | plan2
  {
    age: 18, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Cabbage Moong Curry with Roti", snack: "Horse Gram Sundal", dinner: "Sweet Potato Roti with Curd" },
      { day: "Tuesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Spinach Chana Curry with Roti", snack: "White Peas Sundal", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Carrot Roti with Curd", lunch: "Chicken Gongura Fry", snack: "Peanut Poha Chivda", dinner: "Lobia Curry with Roti" },
      { day: "Thursday", breakfast: "Methi Besan Cheela", lunch: "Cabbage Carrot Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Friday", breakfast: "Cabbage Besan Cheela", lunch: "Broad Beans Masala with Rice", snack: "Banana Sattu Shake", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "Carrot Peas Masala with Roti", snack: "Roasted Chana Ladoo", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Sunday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Prawn Ginger Fry", snack: "Curd Sweet Potato Bowl", dinner: "Onion Thalipeeth with Curd" }
    ]
  },
  // Age 18 | underweight | plan3
  {
    age: 18, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Mixed Dal Cheela", lunch: "Sattu Curry with Roti", snack: "Black Chana Sundal", dinner: "Kala Vatana Usal with Roti" },
      { day: "Tuesday", breakfast: "Jowar Malt with Milk", lunch: "Peas Potato Curry with Roti", snack: "Ragi Buttermilk", dinner: "Radish Roti with Dal" },
      { day: "Wednesday", breakfast: "Methi Akki Rotti", lunch: "Chicken Dry Green Masala Roast", snack: "Cucumber Roasted Chana Chaat", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Sweet Potato Peas Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Palak Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Drumstick Leaves Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Sattu Cheela with Curd" },
      { day: "Saturday", breakfast: "Mixed Dal Adai", lunch: "Cauliflower Peas Masala with Rice", snack: "Ginger Buttermilk", dinner: "Bajra Rotti with Dal" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Chicken Ginger Lemon Fry", snack: "Roasted Cowpeas", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 18 | underweight | plan4
  {
    age: 18, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Sevai", lunch: "Methi Corn Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Boiled Yam with Curd", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Onion Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Bottle Gourd Handvo", lunch: "Chicken Coriander Lemon Fry", snack: "Green Gram Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Masoor Dal with Methi", snack: "Papaya Lassi", dinner: "Sattu Roti with Dal" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "Stuffed Brinjal with Rice", snack: "Banana Jaggery Bowl", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Saturday", breakfast: "Green Peas Muthia", lunch: "Cowpea Curry with Rice", snack: "Peanut Chikki", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Prawn Lemon Pepper Fry", snack: "Papaya Coconut Bowl", dinner: "Ragi Rotti with Curd" }
    ]
  },
  // Age 18 | normal | plan1
  {
    age: 18, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Rava Kichadi with Peanuts", lunch: "Matki Usal with Bhakri", snack: "Homemade Murmura Chaat", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Methi Thalipeeth", lunch: "Yam Pepper Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Methi Adai with Curd" },
      { day: "Wednesday", breakfast: "Onion Besan Cheela", lunch: "Prawn Garlic Fry", snack: "Boiled Chana Chaat with Onion", dinner: "Vegetable Muthia with Curd" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Stuffed Bhindi with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Friday", breakfast: "Banana Ragi Pancake", lunch: "Kala Vatana Usal with Rice", snack: "Homemade Banana Shake", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Onion Adai", lunch: "Maharashtrian Amti with Rice", snack: "Boiled Groundnut Salad", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Chicken Andhra Fry", snack: "Curd Peanut Bowl", dinner: "Masoor Dal Cheela with Chutney" }
    ]
  },
  // Age 18 | normal | plan2
  {
    age: 18, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Muthia", lunch: "Cluster Beans Dal Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Tuesday", breakfast: "Ragi Malt with Jaggery", lunch: "Stuffed Brinjal with Roti", snack: "Roasted Peanuts with Curry Leaves", dinner: "White Pea Curry with Phulka" },
      { day: "Wednesday", breakfast: "Moong Dal Roti", lunch: "Chicken Coconut Ginger Roast", snack: "Cowpea Sundal", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Jowar Thalipeeth", lunch: "Carrot Moong Curry with Roti", snack: "Guava Jaggery Bowl", dinner: "Akki Rotti with Curd" },
      { day: "Friday", breakfast: "Ammini Kozhukattai", lunch: "Beetroot Coconut Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Raw Banana Masala with Phulka" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Potato Beans Curry with Rice", snack: "Bajra Malt Drink", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Sunday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Fish Tamarind Curry", snack: "Mint Buttermilk", dinner: "Green Gram Curry with Jowar Roti" }
    ]
  },
  // Age 18 | normal | plan3
  {
    age: 18, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bajra Malt with Jaggery", lunch: "Dal with Amaranth Leaves", snack: "Curd Cucumber Peanut Bowl", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Gujarati Dal with Rice", snack: "Roasted Mung Beans", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Wednesday", breakfast: "Vegetable Handvo", lunch: "Fish Mangalorean Curry", snack: "Guava Peanut Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Ragi Rotti with Chutney", lunch: "Moong Dal with Carrot", snack: "Roasted Corn Peanut Mix", dinner: "Jowar Ambli with Roti" },
      { day: "Friday", breakfast: "Sattu Vegetable Roti", lunch: "Chana Usal with Bhakri", snack: "Curd Roasted Chana Bowl", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Carrot Besan Cheela", lunch: "White Peas Curry with Rice", snack: "Roasted Gram Balls", dinner: "Rice Kanji with Dal" },
      { day: "Sunday", breakfast: "Chana Dal Cheela", lunch: "Chicken Pepper Roast", snack: "Jowar Chikki", dinner: "Millet Vegetable Pancake with Curd" }
    ]
  },
  // Age 18 | normal | plan4
  {
    age: 18, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Thalipeeth", lunch: "Amaranth Dal with Roti", snack: "Ragi Banana Balls", dinner: "Sattu Curry with Phulka" },
      { day: "Tuesday", breakfast: "Onion Paniyaram", lunch: "Raw Banana Masala with Roti", snack: "Plain Homemade Lassi", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Pancake", lunch: "Fish Curry Leaf Roast", snack: "Bajra Puffed Grain Chaat", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Jowar Methi Roti", lunch: "Dal with Carrot and Beans", snack: "Murmura Peanut Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Drumstick Leaves Adai", lunch: "Toor Dal with Raw Banana", snack: "Sesame Chikki", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Sattu Curry with Rice", snack: "Banana Sesame Chaat", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Sunday", breakfast: "Bajra Thalipeeth", lunch: "Chicken Dry Coriander Roast", snack: "Jowar Puffed Grain Chaat", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 18 | overweight | plan1
  {
    age: 18, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Vegetable Pancake", lunch: "Sweet Potato Peas Curry with Roti", snack: "Lobia Chaat", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Tuesday", breakfast: "Vegetable Paniyaram", lunch: "Green Gram Masala with Roti", snack: "Corn Peanut Sundal", dinner: "Green Peas Muthia with Curd" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Fish Tomato Masala", snack: "Boiled Yam Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Thursday", breakfast: "Bajra Ambli", lunch: "Beerakaya Pappu with Rice", snack: "Boiled Corn with Lemon", dinner: "Jowar Muthia with Dal" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Methi Peas Curry with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Dal with Fenugreek Leaves", snack: "Roasted Sweet Corn", dinner: "Methi Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Chicken Lemon Garlic Roast", snack: "Poha Jaggery Ladoo", dinner: "Aval Vegetable Kichadi" }
    ]
  },
  // Age 18 | overweight | plan2
  {
    age: 18, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Potato Peas Curry with Rice", snack: "Jaggery Lassi", dinner: "Bajra Ambli with Curd" },
      { day: "Tuesday", breakfast: "Peanut Banana Bowl", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Homemade Peanut Bar", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Vegetable Thalipeeth", lunch: "Chicken Black Pepper Fry", snack: "Puffed Rice Peanut Mixture", dinner: "Jowar Kanji with Dal" },
      { day: "Thursday", breakfast: "Ragi Banana Malt", lunch: "Brinjal Peanut Curry with Rice", snack: "White Pea Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Chana Dal with Spinach", snack: "Sweet Potato Peanut Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Saturday", breakfast: "Green Peas Roti", lunch: "Chayote Moong Curry with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Dudhi Muthia with Curd" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Chicken Pepper Onion Roast", snack: "Murmura Onion Chaat", dinner: "Carrot Roti with Dal" }
    ]
  },
  // Age 18 | overweight | plan3
  {
    age: 18, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "Bengali Masoor Dal with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Chayote Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Ragi Paniyaram", lunch: "Black-Eyed Pea Curry with Rice", snack: "Ragi Peanut Ladoo", dinner: "Chana Dal Roti with Curd" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Chicken Kasuri Methi Fry", snack: "Dry Roasted Corn", dinner: "Yam Pepper Curry with Roti" },
      { day: "Thursday", breakfast: "Banana Jowar Pancake", lunch: "Dal with Drumstick Leaves", snack: "Sattu Jaggery Balls", dinner: "Coconut Sevai with Peanuts" },
      { day: "Friday", breakfast: "Dudhi Muthia", lunch: "Tindora Sesame Curry with Roti", snack: "Cowpea Chaat", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Saturday", breakfast: "Rava Paniyaram", lunch: "Carrot Peas Masala with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Ragi Dhokla with Curd" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "Fish Andhra Pepper Fry", snack: "Puffed Rice Chikki", dinner: "Ragi Vegetable Pancake with Curd" }
    ]
  },
  // Age 18 | overweight | plan4
  {
    age: 18, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Vegetable Muthia", lunch: "Moong Dal with Sweet Potato", snack: "Sweet Potato Sesame Balls", dinner: "Vegetable Adai with Curd" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Roti", lunch: "Masoor Dal with Dill Leaves", snack: "Ragi Puffed Grain Chaat", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Wednesday", breakfast: "Moong Dal Dhokla", lunch: "Prawn Pepper Fry", snack: "Boiled Peanut Chaat", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Thursday", breakfast: "Ragi Dhokla", lunch: "Dosakaya Pappu with Rice", snack: "Homemade Poha Chivda", dinner: "Palak Missi Roti with Curd" },
      { day: "Friday", breakfast: "Jowar Ambli", lunch: "Tindora Peanut Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Onion Adai with Chutney" },
      { day: "Saturday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Broad Beans Masala with Roti", snack: "Jowar Malt Drink", dinner: "Besan Dhokla with Curd" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Chicken Cumin Coriander Roast", snack: "Curry Leaf Buttermilk", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 19 | underweight | plan1
  {
    age: 19, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Sevai", lunch: "Brinjal Peanut Curry with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Methi Akki Rotti", lunch: "Yam Masala with Roti", snack: "Cucumber Roasted Chana Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Chicken Mustard Pepper Roast", snack: "Ragi Puffed Grain Chaat", dinner: "Moong Dal Handvo" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Cabbage Moong Curry with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Stuffed Brinjal with Roti" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Moong Dal with Spinach", snack: "Banana Ragi Shake", dinner: "Bajra Ambli with Curd" },
      { day: "Saturday", breakfast: "Aval Upma with Peanuts", lunch: "Raw Banana Masala with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Sattu Curry with Phulka" },
      { day: "Sunday", breakfast: "Guava Curd Bowl", lunch: "Chicken Tawa Lemon Fry", snack: "Banana Sesame Chaat", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 19 | underweight | plan2
  {
    age: 19, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Thalipeeth", lunch: "Potato Methi Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Raw Banana Masala with Phulka" },
      { day: "Tuesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Dal with Fenugreek Leaves", snack: "Jowar Malt Drink", dinner: "Lemon Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Onion Paniyaram", lunch: "Prawn Coriander Fry", snack: "Banana Jaggery Bowl", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Green Peas Usal with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Friday", breakfast: "Dudhi Muthia", lunch: "Peas Potato Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Dill Leaves Curry with Roti", snack: "Guava Jaggery Bowl", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Sunday", breakfast: "Rava Kichadi with Peanuts", lunch: "Chicken Pepper Fry", snack: "White Peas Sundal", dinner: "Jowar Vegetable Pancake with Chutney" }
    ]
  },
  // Age 19 | underweight | plan3
  {
    age: 19, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Onion Adai", lunch: "Potato Peas Curry with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Amaranth Dal with Roti", snack: "Jeera Buttermilk", dinner: "Chayote Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Ragi Kozhukattai", lunch: "Prawn Andhra Curry", snack: "Murmura Peanut Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Drumstick Leaves Adai", lunch: "Sattu Curry with Rice", snack: "Roasted Gram Balls", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Moong Dal Roti", lunch: "Drumstick Leaves Curry with Rice", snack: "Peanut Sundal", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Sattu Cheela", lunch: "White Peas Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Jowar Vegetable Pancake", lunch: "Fish Lemon Roast", snack: "Sattu Buttermilk", dinner: "Jowar Rotti with Dal" }
    ]
  },
  // Age 19 | underweight | plan4
  {
    age: 19, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Green Peas Roti", lunch: "Chayote Moong Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Chana Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Ragi Thalipeeth", lunch: "Dill Leaves Dal with Rice", snack: "Ragi Peanut Chikki", dinner: "Mixed Dal Adai with Curd" },
      { day: "Wednesday", breakfast: "Onion Besan Cheela", lunch: "Chicken Jeera Pepper Fry", snack: "Sesame Jaggery Ladoo", dinner: "Lobia Curry with Roti" },
      { day: "Thursday", breakfast: "Ragi Vegetable Pancake", lunch: "Raw Mango Dal with Rice", snack: "Ragi Buttermilk", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Vegetable Handvo", lunch: "Green Gram Masala with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Methi Muthia with Dal" },
      { day: "Saturday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Carrot Chana Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Sunday", breakfast: "Radish Roti with Curd", lunch: "Prawn Tamarind Curry", snack: "Ragi Peanut Ladoo", dinner: "Bottle Gourd Handvo with Curd" }
    ]
  },
  // Age 19 | normal | plan1
  {
    age: 19, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Cabbage Carrot Curry with Rice", snack: "Jaggery Lassi", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Stuffed Bhindi with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Methi Handvo with Chutney" },
      { day: "Wednesday", breakfast: "Jowar Kanji with Curd", lunch: "Prawn Coconut Garlic Curry", snack: "Guava Peanut Chaat", dinner: "Rice Kanji with Dal" },
      { day: "Thursday", breakfast: "Methi Handvo", lunch: "Spinach Chana Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Brinjal Coconut Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Jowar Muthia", lunch: "Sprouted Moong Curry with Rice", snack: "Raw Banana Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Sunday", breakfast: "Moong Dal Paniyaram", lunch: "Prawn Coriander Lemon Fry", snack: "Roasted Rice Flake Mixture", dinner: "Radish Roti with Dal" }
    ]
  },
  // Age 19 | normal | plan2
  {
    age: 19, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Masoor Dal Cheela", lunch: "Sprouted Moong Curry with Roti", snack: "Roasted Green Gram", dinner: "Bharli Vangi with Bhakri" },
      { day: "Tuesday", breakfast: "Bajra Methi Roti", lunch: "Chana Dal with Ridge Gourd", snack: "Papaya Peanut Chaat", dinner: "Methi Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Bottle Gourd Handvo", lunch: "Fish Tamarind Curry", snack: "Puffed Rice Peanut Mixture", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Thursday", breakfast: "Millet Vegetable Pancake", lunch: "Toor Dal with Raw Banana", snack: "Banana Lassi", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Methi Corn Curry with Rice", snack: "Puffed Rice Chikki", dinner: "Methi Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Methi Besan Cheela", lunch: "Matki Usal with Bhakri", snack: "Homemade Banana Shake", dinner: "Green Peas Roti with Curd" },
      { day: "Sunday", breakfast: "Vegetable Muthia", lunch: "Prawn Coconut Curry", snack: "Homemade Poha Chivda", dinner: "Jowar Kanji with Dal" }
    ]
  },
  // Age 19 | normal | plan3
  {
    age: 19, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Broad Beans Dal Curry with Rice", snack: "Boiled Peanut Chaat", dinner: "Carrot Roti with Dal" },
      { day: "Tuesday", breakfast: "Urad Dal Cheela", lunch: "Cowpea Curry with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Onion Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Bajra Malt with Jaggery", lunch: "Chicken Lemon Ginger Roast", snack: "Poha Jaggery Ladoo", dinner: "Palak Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Ragi Dhokla", lunch: "Moong Dal with Sweet Potato", snack: "Lobia Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Friday", breakfast: "Beetroot Roti with Curd", lunch: "Dal with Drumstick Leaves", snack: "Bajra Puffed Grain Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Saturday", breakfast: "Vegetable Adai", lunch: "Carrot Peas Masala with Rice", snack: "Sesame Chikki", dinner: "Khaman Dhokla with Curd" },
      { day: "Sunday", breakfast: "Carrot Muthia", lunch: "Chicken Mint Pepper Roast", snack: "Mint Buttermilk", dinner: "Vegetable Sevai with Chana Dal" }
    ]
  },
  // Age 19 | normal | plan4
  {
    age: 19, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Lobia Curry with Rice", snack: "Homemade Corn Chivda", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Bajra Thalipeeth", lunch: "Broad Beans Masala with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Carrot Roti with Curd", lunch: "Chicken Gongura Pepper Fry", snack: "Jaggery Ragi Milk", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Ragi Rotti with Chutney", lunch: "Brinjal Dal Curry with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Methi Muthia", lunch: "Moong Dal with Carrot", snack: "Boiled Chana Chaat with Onion", dinner: "Onion Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Palak Besan Cheela", lunch: "Masoor Dal with Dill Leaves", snack: "Banana Sattu Shake", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Chicken Peanut Pepper Roast", snack: "Murmura Black Chana Chaat", dinner: "Sweet Potato Peas Curry with Phulka" }
    ]
  },
  // Age 19 | overweight | plan1
  {
    age: 19, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Roti", lunch: "Stuffed Brinjal with Rice", snack: "Curry Leaf Buttermilk", dinner: "Coconut Sevai with Peanuts" },
      { day: "Tuesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Potato Beans Curry with Rice", snack: "Horse Gram Sundal", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Wednesday", breakfast: "Ragi Sevai Upma", lunch: "Fish Andhra Pulusu", snack: "Cowpea Sundal", dinner: "Methi Adai with Curd" },
      { day: "Thursday", breakfast: "Leftover Rice Paniyaram", lunch: "Gongura Pappu with Rice", snack: "Plain Homemade Lassi", dinner: "Green Peas Usal with Chapati" },
      { day: "Friday", breakfast: "Onion Missi Roti", lunch: "Green Gram Masala with Rice", snack: "Peanut Chikki", dinner: "Ragi Rotti with Curd" },
      { day: "Saturday", breakfast: "Papaya Curd Bowl", lunch: "Dal with Amaranth Leaves", snack: "Ragi Banana Balls", dinner: "Sweet Potato Roti with Curd" },
      { day: "Sunday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Chicken Green Pepper Roast", snack: "Homemade Ragi Savoury Balls", dinner: "Akki Rotti with Curd" }
    ]
  },
  // Age 19 | overweight | plan2
  {
    age: 19, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Black-Eyed Pea Curry with Rice", snack: "Curd Peanut Bowl", dinner: "Palak Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Matki Usal with Rice", snack: "Boiled Yam Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Wednesday", breakfast: "Rava Paniyaram", lunch: "Chicken Coastal Pepper Fry", snack: "Roasted Corn Peanut Mix", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "Carrot Peas Masala with Roti", snack: "Roasted Peanuts with Curry Leaves", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Friday", breakfast: "Sweet Potato Roti", lunch: "Sweet Potato Peas Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Saturday", breakfast: "Methi Adai", lunch: "Dosakaya Pappu with Rice", snack: "Rice Kanji Drink", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "Fish Methi Curry", snack: "Green Gram Chaat", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 19 | overweight | plan3
  {
    age: 19, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Mixed Dal Cheela", lunch: "Sattu Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Sattu Cheela with Curd" },
      { day: "Tuesday", breakfast: "Mixed Dal Adai", lunch: "Cauliflower Methi Curry with Roti", snack: "Roasted Cowpeas", dinner: "Vegetable Muthia with Curd" },
      { day: "Wednesday", breakfast: "Chana Dal Roti", lunch: "Chicken Andhra Fry", snack: "Boiled Corn with Lemon", dinner: "Aval Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Ragi Paniyaram", lunch: "Chana Dal with Spinach", snack: "Bajra Malt Drink", dinner: "Carrot Muthia with Dal" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Raw Banana Masala with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Saturday", breakfast: "Besan Dhokla", lunch: "Cowpea Masala with Roti", snack: "Sattu Jaggery Balls", dinner: "Jowar Muthia with Dal" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Chicken Dry Methi Roast", snack: "Homemade Murmura Chaat", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 19 | overweight | plan4
  {
    age: 19, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Rotti with Curd", lunch: "Tindora Peanut Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Cabbage Besan Cheela", lunch: "Chayote Dal Curry with Roti", snack: "Banana Ragi Balls", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Pancake", lunch: "Chicken Coriander Pepper Fry", snack: "Roasted Chana Jaggery Mix", dinner: "Rava Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Dry Roasted Corn", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Friday", breakfast: "Khaman Dhokla", lunch: "Beetroot Coconut Curry with Rice", snack: "Black Chana Sundal", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Vegetable Thalipeeth", lunch: "Carrot Moong Curry with Roti", snack: "White Pea Chaat", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Palak Missi Roti", lunch: "Fish Tawa Fry", snack: "Cowpea Chaat", dinner: "Green Peas Muthia with Curd" }
    ]
  },
  // Age 20 | underweight | plan1
  {
    age: 20, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Cauliflower Peas Masala with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Drumstick Leaves Adai", lunch: "Sweet Potato Peas Curry with Roti", snack: "Guava Jaggery Bowl", dinner: "Bharli Vangi with Bhakri" },
      { day: "Wednesday", breakfast: "Onion Paniyaram", lunch: "Chicken Garlic Pepper Fry", snack: "Banana Lassi", dinner: "Jowar Rotti with Dal" },
      { day: "Thursday", breakfast: "Lemon Sevai with Peanuts", lunch: "Green Peas Usal with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Friday", breakfast: "Ragi Rotti with Chutney", lunch: "Sattu Curry with Roti", snack: "Black Chana Sundal", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Bajra Thalipeeth", lunch: "Raw Mango Dal with Rice", snack: "Roasted Mung Beans", dinner: "Vegetable Muthia with Curd" },
      { day: "Sunday", breakfast: "Methi Besan Cheela", lunch: "Chicken Dry Methi Roast", snack: "Curd Sweet Potato Bowl", dinner: "Black-Eyed Pea Curry with Roti" }
    ]
  },
  // Age 20 | underweight | plan2
  {
    age: 20, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Dill Leaves Dal with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Palak Dhokla", lunch: "Bengali Masoor Dal with Rice", snack: "Cowpea Sundal", dinner: "Dudhi Muthia with Curd" },
      { day: "Wednesday", breakfast: "Moong Dal Handvo", lunch: "Chicken Gongura Pepper Fry", snack: "Banana Jaggery Bowl", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Sweet Potato Roti", lunch: "Carrot Peas Masala with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Friday", breakfast: "Leftover Rice Paniyaram", lunch: "Matki Usal with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Ragi Dhokla with Curd" },
      { day: "Saturday", breakfast: "Vegetable Rice Sevai", lunch: "Andhra Mudda Pappu with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Chicken Sukka", snack: "Homemade Murmura Chaat", dinner: "Palak Besan Cheela with Curd" }
    ]
  },
  // Age 20 | underweight | plan3
  {
    age: 20, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Methi Peas Curry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Green Peas Roti with Curd" },
      { day: "Tuesday", breakfast: "Palak Besan Cheela", lunch: "Sattu Curry with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Mixed Dal Adai", lunch: "Fish Mustard Fry", snack: "Ragi Puffed Grain Chaat", dinner: "Sattu Cheela with Curd" },
      { day: "Thursday", breakfast: "Onion Missi Roti", lunch: "Cowpea Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Cabbage Carrot Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Methi Adai with Curd" },
      { day: "Saturday", breakfast: "Ragi Dhokla", lunch: "Stuffed Brinjal with Roti", snack: "Bajra Malt Drink", dinner: "Methi Handvo with Chutney" },
      { day: "Sunday", breakfast: "Sattu Cheela", lunch: "Chicken Chettinad Fry", snack: "Puffed Rice Chana Mixture", dinner: "Cowpea Curry with Ragi Roti" }
    ]
  },
  // Age 20 | underweight | plan4
  {
    age: 20, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Moong Dal Dhokla", lunch: "Moong Dal with Sweet Potato", snack: "Papaya Lassi", dinner: "Sattu Curry with Phulka" },
      { day: "Tuesday", breakfast: "Bajra Ambli", lunch: "Spinach Corn Curry with Rice", snack: "Boiled Corn with Lemon", dinner: "Beetroot Masala with Roti" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Chicken Lemon Garlic Roast", snack: "Peanut Jaggery Ladoo", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Stuffed Bhindi with Roti", snack: "Papaya Peanut Chaat", dinner: "Raw Banana Masala with Phulka" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Carrot Chana Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Akki Rotti with Curd" },
      { day: "Saturday", breakfast: "Ragi Paniyaram", lunch: "Cowpea Masala with Roti", snack: "Sattu Buttermilk", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Chicken Spinach Pepper Fry", snack: "Banana Sesame Chaat", dinner: "Vegetable Thalipeeth with Curd" }
    ]
  },
  // Age 20 | normal | plan1
  {
    age: 20, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Green Gram Masala with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Cabbage Besan Cheela", lunch: "Dal with Drumstick Leaves", snack: "Roasted Peanuts with Curry Leaves", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Green Peas Roti", lunch: "Fish Tamarind Pepper Fry", snack: "Jeera Buttermilk", dinner: "Jowar Muthia with Dal" },
      { day: "Thursday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Green Gram Masala with Roti", snack: "Dry Roasted Corn", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Aval Upma with Peanuts", lunch: "Sprouted Moong Curry with Roti", snack: "Rice Kanji Drink", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Saturday", breakfast: "Ragi Ambli with Jaggery", lunch: "Chayote Moong Curry with Rice", snack: "Curry Leaf Buttermilk", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Chicken Fenugreek Fry", snack: "Roasted Chana Jaggery Mix", dinner: "Moong Dal Dhokla with Chutney" }
    ]
  },
  // Age 20 | normal | plan2
  {
    age: 20, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Missi Roti", lunch: "Amaranth Dal with Roti", snack: "Peanut Sundal", dinner: "Methi Akki Rotti" },
      { day: "Tuesday", breakfast: "Methi Handvo", lunch: "Lobia Curry with Roti", snack: "Roasted Cowpeas", dinner: "Bajra Ambli with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Paniyaram", lunch: "Chicken Andhra Fry", snack: "Roasted Chana Chikki", dinner: "Matki Usal with Bhakri" },
      { day: "Thursday", breakfast: "Rava Kichadi with Peanuts", lunch: "Broad Beans Masala with Rice", snack: "Jaggery Ragi Milk", dinner: "Onion Adai with Chutney" },
      { day: "Friday", breakfast: "Moong Dal Paniyaram", lunch: "Chana Usal with Bhakri", snack: "Ragi Buttermilk", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Ragi Sevai Upma", lunch: "Cabbage Moong Curry with Roti", snack: "Homemade Corn Chivda", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Sunday", breakfast: "Palak Missi Roti", lunch: "Chicken Methi Fry", snack: "Horse Gram Sundal", dinner: "Stuffed Tindora with Roti" }
    ]
  },
  // Age 20 | normal | plan3
  {
    age: 20, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Roti", lunch: "Moong Dal with Carrot", snack: "Roasted Corn Peanut Mix", dinner: "Rice Kanji with Dal" },
      { day: "Tuesday", breakfast: "Sattu Roti with Curd", lunch: "Tindora Peanut Curry with Rice", snack: "Lobia Chaat", dinner: "Chana Dal Roti with Curd" },
      { day: "Wednesday", breakfast: "Green Peas Muthia", lunch: "Chicken Mustard Pepper Roast", snack: "Beetroot Peanut Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Thursday", breakfast: "Moong Dal Roti", lunch: "Brinjal Peanut Curry with Rice", snack: "Puffed Rice Chikki", dinner: "Chayote Moong Curry with Roti" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Maharashtrian Amti with Rice", snack: "Roasted Green Gram", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Saturday", breakfast: "Methi Adai", lunch: "Kala Vatana Usal with Roti", snack: "Homemade Poha Chivda", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Sunday", breakfast: "Chana Dal Cheela", lunch: "Chicken Andhra Pepper Roast", snack: "Banana Jaggery Milk", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 20 | normal | plan4
  {
    age: 20, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Muthia", lunch: "Broad Beans Masala with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Toor Dal with Raw Banana", snack: "Homemade Banana Shake", dinner: "Methi Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Jowar Thalipeeth", lunch: "Chicken Curry Leaf Lemon Fry", snack: "Ragi Banana Balls", dinner: "Palak Missi Roti with Curd" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Brinjal Coconut Curry with Rice", snack: "Jaggery Lassi", dinner: "Radish Roti with Dal" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "White Peas Masala with Roti", snack: "Jowar Malt Drink", dinner: "Jowar Kanji with Dal" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Gongura Pappu with Rice", snack: "Peanut Chikki", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Prawn Tomato Masala", snack: "Roasted Chana Ladoo", dinner: "Ragi Ambli with Roti" }
    ]
  },
  // Age 20 | overweight | plan1
  {
    age: 20, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Methi Roti", lunch: "Masoor Dal with Dill Leaves", snack: "Green Gram Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Tuesday", breakfast: "Boiled Yam with Curd", lunch: "Beetroot Coconut Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Vegetable Handvo", lunch: "Prawn Gongura Curry", snack: "Peanut Poha Chivda", dinner: "Methi Missi Roti with Dal" },
      { day: "Thursday", breakfast: "Ragi Malt with Jaggery", lunch: "Dill Leaves Curry with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Rava Paniyaram", lunch: "Carrot Peas Masala with Rice", snack: "Boiled Peanut Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Onion Besan Cheela", lunch: "Cluster Beans Dal Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Methi Muthia", lunch: "Chicken Jeera Fry", snack: "Sattu Jaggery Balls", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 20 | overweight | plan2
  {
    age: 20, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Dudhi Muthia", lunch: "Drumstick Leaves Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Tindora Sesame Curry with Roti", snack: "Jowar Puffed Grain Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Wednesday", breakfast: "Carrot Besan Cheela", lunch: "Fish Andhra Pulusu", snack: "Roasted Bengal Gram with Onion", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Potato Beans Curry with Roti", snack: "Cowpea Chaat", dinner: "Carrot Roti with Dal" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Black-Eyed Pea Curry with Rice", snack: "Ginger Buttermilk", dinner: "Onion Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Dosakaya Pappu with Rice", snack: "Murmura Black Chana Chaat", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Khaman Dhokla", lunch: "Prawn Mustard Curry", snack: "Curd Peanut Bowl", dinner: "Ammini Kozhukattai with Vegetables" }
    ]
  },
  // Age 20 | overweight | plan3
  {
    age: 20, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bottle Gourd Handvo", lunch: "Brinjal Dal Curry with Roti", snack: "Roasted Sweet Corn", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Tuesday", breakfast: "Jowar Kanji with Curd", lunch: "Cauliflower Dal Curry with Roti", snack: "Banana Ragi Shake", dinner: "Bajra Rotti with Dal" },
      { day: "Wednesday", breakfast: "Peanut Banana Bowl", lunch: "Fish Coconut Curry", snack: "Homemade Popcorn with Peanuts", dinner: "Besan Dhokla with Curd" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "White Peas Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Amaranth Leaves Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Palak Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Carrot Muthia", lunch: "Drumstick Leaves Dal with Roti", snack: "Raw Banana Chaat", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Chicken Garlic Fry", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Methi Muthia with Dal" }
    ]
  },
  // Age 20 | overweight | plan4
  {
    age: 20, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Pancake", lunch: "Beerakaya Pappu with Rice", snack: "Boiled Yam Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Ajwain Missi Roti", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Green Peas Usal with Chapati" },
      { day: "Wednesday", breakfast: "Papaya Curd Bowl", lunch: "Prawn Andhra Curry", snack: "Murmura Peanut Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Thursday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Lobia Curry with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Mixed Dal Adai with Curd" },
      { day: "Friday", breakfast: "Banana Ragi Pancake", lunch: "Chana Dal with Ridge Gourd", snack: "Guava Peanut Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Saturday", breakfast: "Ragi Thalipeeth", lunch: "Dal with Carrot and Beans", snack: "Roasted Gram Balls", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Sunday", breakfast: "Jowar Vegetable Pancake", lunch: "Fish Curry Leaf Roast", snack: "Green Gram Sundal", dinner: "Aval Vegetable Kichadi" }
    ]
  },
  // Age 21 | underweight | plan1
  {
    age: 21, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Aval Upma with Peanuts", lunch: "Green Peas Usal with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Rice Kanji with Curd", lunch: "Sweet Potato Peas Curry with Roti", snack: "Cowpea Sundal", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "Chicken Sesame Pepper Roast", snack: "Boiled Peanut Chaat", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Thursday", breakfast: "Methi Adai", lunch: "Dal with Carrot and Beans", snack: "Boiled Yam Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Chana Dal with Spinach", snack: "Sesame Jaggery Ladoo", dinner: "Bajra Rotti with Dal" },
      { day: "Saturday", breakfast: "Sattu Roti with Curd", lunch: "Spinach Corn Curry with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Beetroot Roti with Curd" },
      { day: "Sunday", breakfast: "Onion Paniyaram", lunch: "Prawn Coconut Curry", snack: "Curd Roasted Chana Bowl", dinner: "Chana Usal with Bhakri" }
    ]
  },
  // Age 21 | underweight | plan2
  {
    age: 21, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Malt with Jaggery", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Tuesday", breakfast: "Bajra Methi Roti", lunch: "Cowpea Curry with Rice", snack: "Ginger Buttermilk", dinner: "Lemon Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Carrot Besan Cheela", lunch: "Chicken Konkan Fry", snack: "Boiled Corn with Lemon", dinner: "Matki Usal with Bhakri" },
      { day: "Thursday", breakfast: "Ragi Kozhukattai", lunch: "Broad Beans Masala with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Jowar Vegetable Pancake", lunch: "Bengali Masoor Dal with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Methi Adai with Curd" },
      { day: "Saturday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Black-Eyed Pea Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Sattu Curry with Phulka" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Prawn Jeera Fry", snack: "Boiled Chana Chaat with Onion", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 21 | underweight | plan3
  {
    age: 21, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Moong Dal Roti", lunch: "Andhra Mudda Pappu with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Akki Rotti with Curd" },
      { day: "Tuesday", breakfast: "Carrot Roti with Curd", lunch: "Broad Beans Masala with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Radish Roti with Dal" },
      { day: "Wednesday", breakfast: "Methi Handvo", lunch: "Prawn Andhra Pepper Fry", snack: "Curd Peanut Bowl", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Ragi Ambli with Jaggery", lunch: "Beetroot Masala with Roti", snack: "Jowar Chikki", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Friday", breakfast: "Sattu Vegetable Roti", lunch: "Potato Beans Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Coconut Sevai with Peanuts" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Gujarati Dal with Rice", snack: "Roasted Mung Beans", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Sunday", breakfast: "Ragi Paniyaram", lunch: "Chicken Tawa Coriander Fry", snack: "Banana Sesame Chaat", dinner: "Ajwain Missi Roti with Dal" }
    ]
  },
  // Age 21 | underweight | plan4
  {
    age: 21, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "Amaranth Leaves Curry with Rice", snack: "Roasted Sweet Corn", dinner: "Sattu Roti with Dal" },
      { day: "Tuesday", breakfast: "Jowar Ambli", lunch: "Masoor Dal with Methi", snack: "Roasted Corn Peanut Mix", dinner: "Aval Vegetable Kichadi" },
      { day: "Wednesday", breakfast: "Palak Missi Roti", lunch: "Chicken Dry Peanut Roast", snack: "Beetroot Peanut Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Millet Vegetable Pancake", lunch: "Kala Vatana Usal with Rice", snack: "Peanut Poha Chivda", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Tindora Peanut Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Onion Missi Roti", lunch: "Yam Pepper Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Vegetable Rice Sevai", lunch: "Chicken Onion Fry", snack: "Roasted Chana Ladoo", dinner: "Jowar Muthia with Dal" }
    ]
  },
  // Age 21 | normal | plan1
  {
    age: 21, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Moong Dal Handvo", lunch: "Masoor Dal with Dill Leaves", snack: "Jaggery Lassi", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Vegetable Muthia", lunch: "Cabbage Carrot Curry with Rice", snack: "Murmura Peanut Chaat", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Chicken Spinach Pepper Fry", snack: "Murmura Black Chana Chaat", dinner: "Methi Handvo with Chutney" },
      { day: "Thursday", breakfast: "Leftover Rice Paniyaram", lunch: "Moong Dal with Spinach", snack: "Poha Jaggery Ladoo", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Moong Dal with Sweet Potato", snack: "Papaya Lassi", dinner: "Methi Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Palak Besan Cheela", lunch: "Cowpea Masala with Roti", snack: "Homemade Poha Chivda", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Fish Gongura Curry", snack: "Boiled Groundnut Salad", dinner: "Masoor Dal Cheela with Chutney" }
    ]
  },
  // Age 21 | normal | plan2
  {
    age: 21, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Cauliflower Peas Masala with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Gongura Pappu with Rice", snack: "Sesame Chikki", dinner: "Vegetable Muthia with Curd" },
      { day: "Wednesday", breakfast: "Onion Besan Cheela", lunch: "Chicken Curry Leaf Roast", snack: "Jaggery Ragi Milk", dinner: "Ragi Dhokla with Curd" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Sprouted Moong Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Jowar Ambli with Roti" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Raw Banana Masala with Rice", snack: "Jowar Malt Drink", dinner: "Lobia Curry with Roti" },
      { day: "Saturday", breakfast: "Banana Jowar Pancake", lunch: "Sprouted Moong Curry with Roti", snack: "Banana Jaggery Milk", dinner: "Chayote Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Moong Dal Dhokla", lunch: "Chicken Telangana Fry", snack: "Green Gram Sundal", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 21 | normal | plan3
  {
    age: 21, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Cauliflower Methi Curry with Roti", snack: "Raw Banana Chaat", dinner: "Mixed Dal Adai with Curd" },
      { day: "Tuesday", breakfast: "Jowar Methi Roti", lunch: "White Peas Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Bajra Ambli with Curd" },
      { day: "Wednesday", breakfast: "Ragi Sevai Upma", lunch: "Chicken Tomato Pepper Fry", snack: "Homemade Murmura Chaat", dinner: "Stuffed Bhindi with Roti" },
      { day: "Thursday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Tindora Sesame Curry with Roti", snack: "Horse Gram Sundal", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Stuffed Tindora with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "Methi Muthia with Dal" },
      { day: "Saturday", breakfast: "Bajra Thalipeeth", lunch: "Amaranth Dal with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Raw Banana Masala with Phulka" },
      { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "Prawn Pepper Fry", snack: "Curry Leaf Buttermilk", dinner: "Cabbage Chana Dal Curry with Roti" }
    ]
  },
  // Age 21 | normal | plan4
  {
    age: 21, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Rotti with Chutney", lunch: "Green Gram Masala with Rice", snack: "Roasted Green Gram", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Tuesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Cluster Beans Dal Curry with Roti", snack: "Peanut Sundal", dinner: "Kala Vatana Usal with Roti" },
      { day: "Wednesday", breakfast: "Peanut Banana Bowl", lunch: "Chicken Tawa Pepper Roast", snack: "Roasted Chana Chikki", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "White Peas Masala with Roti", snack: "Murmura Onion Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Jowar Malt with Milk", lunch: "Dill Leaves Curry with Roti", snack: "Homemade Corn Chivda", dinner: "Khaman Dhokla with Curd" },
      { day: "Saturday", breakfast: "Green Peas Muthia", lunch: "Matki Usal with Rice", snack: "Green Gram Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Sunday", breakfast: "Methi Thalipeeth", lunch: "Chicken Coconut Fry", snack: "Roasted Black Chana with Lemon", dinner: "Methi Akki Rotti" }
    ]
  },
  // Age 21 | overweight | plan1
  {
    age: 21, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Masoor Dal Cheela", lunch: "Sattu Curry with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "Methi Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Mixed Dal Adai", lunch: "Lobia Curry with Rice", snack: "Dry Roasted Corn", dinner: "Urad Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Prawn Gongura Curry", snack: "Curd Banana Jaggery Bowl", dinner: "Green Peas Muthia with Curd" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Potato Peas Curry with Rice", snack: "Rice Kanji Drink", dinner: "Sattu Cheela with Curd" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Brinjal Peanut Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Jowar Rotti with Dal" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Peas Potato Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Chicken Chettinad Fry", snack: "Carrot Peanut Chaat", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 21 | overweight | plan2
  {
    age: 21, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Green Peas Roti", lunch: "Dal with Fenugreek Leaves", snack: "Banana Lassi", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Paniyaram", lunch: "Chicken Tawa Fry", snack: "Puffed Rice Chana Mixture", dinner: "Carrot Muthia with Dal" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Green Gram Masala with Roti", snack: "Ragi Banana Balls", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Ragi Dhokla", lunch: "Spinach Chana Curry with Roti", snack: "Roasted Cowpeas", dinner: "Sweet Potato Roti with Curd" },
      { day: "Saturday", breakfast: "Jowar Thalipeeth", lunch: "Broad Beans Dal Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Banana Ragi Pancake", lunch: "Chicken Methi Garlic Roast", snack: "Peanut Chikki", dinner: "Jowar Malt with Vegetable Curry" }
    ]
  },
  // Age 21 | overweight | plan3
  {
    age: 21, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Onion Adai", lunch: "Sattu Curry with Rice", snack: "Black Chana Sundal", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Methi Besan Cheela", lunch: "Potato Beans Curry with Roti", snack: "Roasted Gram Balls", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Bottle Gourd Handvo", lunch: "Chicken Mangalorean Fry", snack: "Guava Jaggery Bowl", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Khaman Dhokla", lunch: "Dosakaya Pappu with Rice", snack: "Lobia Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Friday", breakfast: "Papaya Curd Bowl", lunch: "Chana Dal with Ridge Gourd", snack: "Bajra Malt Drink", dinner: "Rice Kanji with Dal" },
      { day: "Saturday", breakfast: "Urad Dal Cheela", lunch: "Beetroot Coconut Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Chicken Tawa Lemon Fry", snack: "Banana Ragi Balls", dinner: "Ragi Sevai Vegetable Bowl" }
    ]
  },
  // Age 21 | overweight | plan4
  {
    age: 21, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Muthia", lunch: "Moong Dal with Carrot", snack: "Ragi Peanut Ladoo", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Drumstick Leaves Adai", lunch: "Carrot Moong Curry with Roti", snack: "White Pea Chaat", dinner: "Onion Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Adai", lunch: "Chicken Mustard Fry", snack: "Cucumber Roasted Chana Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Thursday", breakfast: "Chana Dal Roti", lunch: "Potato Methi Curry with Roti", snack: "Plain Homemade Lassi", dinner: "Stuffed Brinjal with Roti" },
      { day: "Friday", breakfast: "Sattu Vegetable Pancake", lunch: "Carrot Chana Curry with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Toor Dal with Raw Banana", snack: "Mint Buttermilk", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Sunday", breakfast: "Ajwain Missi Roti", lunch: "Chicken Mint Pepper Roast", snack: "Roasted Peanuts with Curry Leaves", dinner: "Drumstick Leaves Dal with Roti" }
    ]
  },
  // Age 22 | underweight | plan1
  {
    age: 22, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Lemon Sevai with Peanuts", lunch: "Tindora Sesame Curry with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Sattu Curry with Phulka" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "White Peas Masala with Roti", snack: "Raw Banana Chaat", dinner: "Lobia Curry with Roti" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Roti", lunch: "Chicken Curry Leaf Garlic Roast", snack: "Puffed Rice Peanut Mixture", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Broad Beans Masala with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Spinach Chana Curry with Roti", snack: "Peanut Sundal", dinner: "Palak Missi Roti with Curd" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Stuffed Brinjal with Rice", snack: "Peanut Poha Chivda", dinner: "Rava Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Vegetable Rice Sevai", lunch: "Chicken Jeera Fry", snack: "Banana Sattu Shake", dinner: "Methi Muthia with Dal" }
    ]
  },
  // Age 22 | underweight | plan2
  {
    age: 22, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Kozhukattai", lunch: "Broad Beans Masala with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Methi Peas Curry with Roti", snack: "Roasted Sweet Corn", dinner: "Jowar Ambli with Roti" },
      { day: "Wednesday", breakfast: "Vegetable Muthia", lunch: "Chicken Tomato Pepper Fry", snack: "Boiled Chana Chaat with Onion", dinner: "Jowar Rotti with Dal" },
      { day: "Thursday", breakfast: "Onion Missi Roti", lunch: "Chana Dal with Ridge Gourd", snack: "White Pea Chaat", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Methi Thalipeeth", lunch: "Cauliflower Methi Curry with Roti", snack: "Roasted Cowpeas", dinner: "Methi Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Moong Dal Handvo", lunch: "Drumstick Leaves Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Chicken Coconut Pepper Fry", snack: "Banana Jaggery Milk", dinner: "Methi Adai with Curd" }
    ]
  },
  // Age 22 | underweight | plan3
  {
    age: 22, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Dal with Drumstick Leaves", snack: "Roasted Green Gram", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Methi Adai", lunch: "White Peas Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Wednesday", breakfast: "Carrot Muthia", lunch: "Chicken Pan Fry", snack: "Roasted Chana Ladoo", dinner: "Chana Usal with Bhakri" },
      { day: "Thursday", breakfast: "Ragi Malt with Jaggery", lunch: "Peas Potato Curry with Roti", snack: "Ragi Buttermilk", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Friday", breakfast: "Ragi Thalipeeth", lunch: "Sattu Curry with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Lobia Chaat", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Bajra Thalipeeth", lunch: "Chicken Coconut Masala Fry", snack: "Sattu Jaggery Ladoo", dinner: "Millet Vegetable Pancake with Curd" }
    ]
  },
  // Age 22 | underweight | plan4
  {
    age: 22, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Kanji with Curd", lunch: "Spinach Corn Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Radish Roti with Dal" },
      { day: "Tuesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Gujarati Dal with Rice", snack: "Murmura Peanut Chaat", dinner: "Beetroot Roti with Curd" },
      { day: "Wednesday", breakfast: "Sattu Roti with Curd", lunch: "Chicken Ginger Pepper Fry", snack: "Peanut Jaggery Ladoo", dinner: "Rice Kanji with Dal" },
      { day: "Thursday", breakfast: "Sattu Cheela", lunch: "Yam Pepper Curry with Rice", snack: "Black Chana Sundal", dinner: "Khaman Dhokla with Curd" },
      { day: "Friday", breakfast: "Carrot Roti with Curd", lunch: "Raw Mango Dal with Rice", snack: "Peanut Chikki", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Palak Besan Cheela", lunch: "Gongura Pappu with Rice", snack: "Boiled Corn with Lemon", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Sunday", breakfast: "Jowar Muthia", lunch: "Chicken Pepper Onion Roast", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Urad Dal Cheela with Curd" }
    ]
  },
  // Age 22 | normal | plan1
  {
    age: 22, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Raw Banana Masala with Roti", snack: "Poha Jaggery Ladoo", dinner: "Vegetable Handvo with Curd" },
      { day: "Tuesday", breakfast: "Onion Besan Cheela", lunch: "Matki Usal with Rice", snack: "Cowpea Chaat", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Wednesday", breakfast: "Methi Akki Rotti", lunch: "Chicken Methi Garlic Roast", snack: "Black Chana Chaat with Lemon", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Potato Beans Curry with Roti", snack: "Boiled Yam Chaat", dinner: "Carrot Roti with Dal" },
      { day: "Friday", breakfast: "Khaman Dhokla", lunch: "Dill Leaves Dal with Rice", snack: "Banana Sesame Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Moong Dal Paniyaram", lunch: "Brinjal Peanut Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Sattu Cheela with Curd" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Chicken Village-Style Fry", snack: "Banana Lassi", dinner: "Bajra Ambli with Curd" }
    ]
  },
  // Age 22 | normal | plan2
  {
    age: 22, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Cauliflower Peas Masala with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "Dosakaya Pappu with Rice", snack: "Boiled Peanut Chaat", dinner: "Methi Handvo with Chutney" },
      { day: "Wednesday", breakfast: "Bajra Malt with Jaggery", lunch: "Chicken Dry Lemon Roast", snack: "Banana Jaggery Bowl", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "Chana Dal with Spinach", snack: "Ginger Buttermilk", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Millet Vegetable Pancake", lunch: "Dill Leaves Curry with Roti", snack: "Horse Gram Sundal", dinner: "Green Peas Roti with Curd" },
      { day: "Saturday", breakfast: "Jowar Thalipeeth", lunch: "Black-Eyed Pea Curry with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Banana Ragi Pancake", lunch: "Chicken Telangana Pepper Roast", snack: "Roasted Mung Beans", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 22 | normal | plan3
  {
    age: 22, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Banana with Roasted Peanuts", lunch: "Sweet Potato Peas Curry with Roti", snack: "Jeera Buttermilk", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Vegetable Paniyaram", lunch: "Green Gram Masala with Rice", snack: "Homemade Banana Shake", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "Prawn Green Masala Fry", snack: "Corn Peanut Sundal", dinner: "Sattu Roti with Dal" },
      { day: "Thursday", breakfast: "Mixed Dal Cheela", lunch: "Carrot Moong Curry with Roti", snack: "Green Gram Chaat", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Cabbage Moong Curry with Roti", snack: "Green Gram Sundal", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Rava Paniyaram", lunch: "Beetroot Masala with Roti", snack: "Ragi Banana Balls", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Sunday", breakfast: "Sattu Vegetable Pancake", lunch: "Chicken Dry Curry Leaf Roast", snack: "Rice Kanji Drink", dinner: "Drumstick Leaves Dal with Roti" }
    ]
  },
  // Age 22 | normal | plan4
  {
    age: 22, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Stuffed Brinjal with Roti", snack: "Jaggery Ragi Milk", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Pancake", lunch: "Cluster Beans Dal Curry with Roti", snack: "Beetroot Peanut Chaat", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Ragi Dhokla", lunch: "Chicken Fenugreek Fry", snack: "Sesame Chikki", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Thursday", breakfast: "Ragi Banana Malt", lunch: "Andhra Mudda Pappu with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Vegetable Handvo", lunch: "Dal with Carrot and Beans", snack: "Roasted Bengal Gram with Onion", dinner: "Stuffed Bhindi with Roti" },
      { day: "Saturday", breakfast: "Jowar Vegetable Pancake", lunch: "Cauliflower Dal Curry with Roti", snack: "Bajra Malt Drink", dinner: "Jowar Muthia with Dal" },
      { day: "Sunday", breakfast: "Banana Jowar Pancake", lunch: "Chicken Dry Methi Roast", snack: "Jaggery Lassi", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 22 | overweight | plan1
  {
    age: 22, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Chana Dal Roti", lunch: "Yam Masala with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Matki Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Ragi Paniyaram", lunch: "Sprouted Moong Curry with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Bottle Gourd Handvo", lunch: "Chicken Methi Fry", snack: "Coconut Jaggery Ladoo", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Dal with Amaranth Leaves", snack: "Sattu Buttermilk", dinner: "Sweet Potato Roti with Curd" },
      { day: "Friday", breakfast: "Bajra Methi Roti", lunch: "Carrot Peas Masala with Rice", snack: "Roasted Gram Balls", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Raw Banana Masala with Rice", snack: "Banana Ragi Shake", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Fish Lemon Roast", snack: "Homemade Murmura Chaat", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 22 | overweight | plan2
  {
    age: 22, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Rotti with Chutney", lunch: "Chayote Moong Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Methi Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Aval Upma with Peanuts", lunch: "Beetroot Coconut Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Ragi Rotti with Curd" },
      { day: "Wednesday", breakfast: "Besan Dhokla", lunch: "Prawn Coriander Lemon Fry", snack: "Sweet Potato Peanut Chaat", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Black-Eyed Pea Curry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Onion Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Bengali Masoor Dal with Rice", snack: "Curry Leaf Buttermilk", dinner: "Onion Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Bajra Ambli", lunch: "Brinjal Coconut Curry with Rice", snack: "Banana Ragi Balls", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Sunday", breakfast: "Dudhi Muthia", lunch: "Chicken Cumin Coriander Roast", snack: "Ragi Puffed Grain Chaat", dinner: "Raw Banana Masala with Phulka" }
    ]
  },
  // Age 22 | overweight | plan3
  {
    age: 22, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Stuffed Tindora with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Tuesday", breakfast: "Moong Dal Roti", lunch: "Broad Beans Dal Curry with Rice", snack: "Jowar Chikki", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Green Peas Roti", lunch: "Chicken Green Pepper Roast", snack: "Sattu Jaggery Balls", dinner: "Dudhi Muthia with Curd" },
      { day: "Thursday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Green Gram Masala with Roti", snack: "Roasted Peanuts with Curry Leaves", dinner: "Chayote Moong Curry with Roti" },
      { day: "Friday", breakfast: "Vegetable Adai", lunch: "Moong Dal with Carrot", snack: "Puffed Rice Chikki", dinner: "Yam Pepper Curry with Roti" },
      { day: "Saturday", breakfast: "Ammini Kozhukattai", lunch: "Methi Corn Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Chicken Coconut Ginger Roast", snack: "Homemade Peanut Bar", dinner: "Ammini Kozhukattai with Vegetables" }
    ]
  },
  // Age 22 | overweight | plan4
  {
    age: 22, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Onion Adai", lunch: "Carrot Peas Masala with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Jowar Ambli", lunch: "Maharashtrian Amti with Rice", snack: "Dry Roasted Corn", dinner: "Green Peas Muthia with Curd" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Chicken Garlic Lemon Fry", snack: "Mint Buttermilk", dinner: "Ragi Dhokla with Curd" },
      { day: "Thursday", breakfast: "Mixed Dal Adai", lunch: "Cowpea Curry with Rice", snack: "Guava Peanut Chaat", dinner: "Jowar Kanji with Dal" },
      { day: "Friday", breakfast: "Leftover Rice Paniyaram", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Carrot Chana Curry with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Sunday", breakfast: "Urad Dal Cheela", lunch: "Chicken Dhaba Fry", snack: "Curd Peanut Bowl", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 23 | underweight | plan1
  {
    age: 23, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bottle Gourd Handvo", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Bajra Ambli with Curd" },
      { day: "Tuesday", breakfast: "Bajra Thalipeeth", lunch: "Potato Beans Curry with Roti", snack: "Guava Peanut Chaat", dinner: "Methi Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Carrot Besan Cheela", lunch: "Chicken Tawa Ginger Fry", snack: "Roasted Peanut Jaggery Mix", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Dill Leaves Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Methi Handvo with Chutney" },
      { day: "Friday", breakfast: "Beetroot Roti with Curd", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Murmura Peanut Chaat", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Potato Beans Curry with Rice", snack: "Peanut Sundal", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Jowar Kanji with Curd", lunch: "Chicken Pan Fry", snack: "Ragi Buttermilk", dinner: "Green Peas Roti with Curd" }
    ]
  },
  // Age 23 | underweight | plan2
  {
    age: 23, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Leftover Rice Paniyaram", lunch: "Cauliflower Peas Masala with Rice", snack: "Homemade Corn Chivda", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Lobia Curry with Roti", snack: "Corn Peanut Sundal", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Wednesday", breakfast: "Ragi Sevai Upma", lunch: "Fish Ginger Garlic Fry", snack: "Green Gram Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Broad Beans Masala with Roti", snack: "Boiled Groundnut Salad", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Bajra Malt with Jaggery", lunch: "Raw Mango Dal with Rice", snack: "Sattu Buttermilk", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Masoor Dal with Methi", snack: "Roasted Sweet Corn", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Prawn Coconut Curry", snack: "Beetroot Peanut Chaat", dinner: "Bajra Rotti with Dal" }
    ]
  },
  // Age 23 | underweight | plan3
  {
    age: 23, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Kozhukattai", lunch: "Cabbage Moong Curry with Roti", snack: "Puffed Rice Chikki", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Tuesday", breakfast: "Boiled Yam with Curd", lunch: "Methi Peas Curry with Roti", snack: "Banana Ragi Balls", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Wednesday", breakfast: "Carrot Muthia", lunch: "Prawn Tamarind Curry", snack: "Sattu Jaggery Balls", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Ragi Ambli with Jaggery", lunch: "Cowpea Curry with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Friday", breakfast: "Carrot Roti with Curd", lunch: "Broad Beans Dal Curry with Rice", snack: "Bajra Malt Drink", dinner: "Vegetable Adai with Curd" },
      { day: "Saturday", breakfast: "Onion Adai", lunch: "Sattu Curry with Rice", snack: "Roasted Gram Balls", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Sunday", breakfast: "Dudhi Muthia", lunch: "Chicken Dry Sesame Roast", snack: "Boiled Yam Chaat", dinner: "Vegetable Thalipeeth with Curd" }
    ]
  },
  // Age 23 | underweight | plan4
  {
    age: 23, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Stuffed Tindora with Roti", snack: "Ragi Banana Balls", dinner: "Akki Rotti with Curd" },
      { day: "Tuesday", breakfast: "Methi Handvo", lunch: "Green Gram Masala with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Wednesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Chicken Ginger Coriander Roast", snack: "Peanut Jaggery Ladoo", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Stuffed Brinjal with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Friday", breakfast: "Jowar Methi Roti", lunch: "Dal with Carrot and Beans", snack: "Papaya Coconut Bowl", dinner: "Methi Adai with Curd" },
      { day: "Saturday", breakfast: "Papaya Curd Bowl", lunch: "White Peas Masala with Roti", snack: "Ragi Peanut Chikki", dinner: "Sattu Roti with Dal" },
      { day: "Sunday", breakfast: "Methi Muthia", lunch: "Chicken Village-Style Fry", snack: "Peanut Chikki", dinner: "Stuffed Bhindi with Roti" }
    ]
  },
  // Age 23 | normal | plan1
  {
    age: 23, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Kala Vatana Usal with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Tuesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Carrot Moong Curry with Roti", snack: "Jowar Chikki", dinner: "Methi Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Chicken Methi Garlic Roast", snack: "Black Chana Chaat with Lemon", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "Spinach Chana Curry with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Palak Missi Roti with Curd" },
      { day: "Friday", breakfast: "Ragi Malt with Jaggery", lunch: "Peas Potato Curry with Rice", snack: "Roasted Cowpeas", dinner: "Jowar Rotti with Dal" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Spinach Corn Curry with Rice", snack: "Raw Banana Chaat", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Masoor Dal Cheela", lunch: "Fish Curry Leaf Fry", snack: "Banana Sattu Shake", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 23 | normal | plan2
  {
    age: 23, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Broad Beans Masala with Rice", snack: "Homemade Peanut Bar", dinner: "Vegetable Handvo with Curd" },
      { day: "Tuesday", breakfast: "Jowar Malt with Milk", lunch: "Green Gram Masala with Roti", snack: "Roasted Chana Ladoo", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Banana Ragi Pancake", lunch: "Fish Pepper Roast", snack: "White Peas Sundal", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Thursday", breakfast: "Methi Akki Rotti", lunch: "Raw Banana Masala with Roti", snack: "Papaya Lassi", dinner: "Sweet Potato Roti with Curd" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Gujarati Dal with Rice", snack: "Jeera Buttermilk", dinner: "Vegetable Muthia with Curd" },
      { day: "Saturday", breakfast: "Ragi Banana Malt", lunch: "Chana Usal with Bhakri", snack: "Cowpea Sundal", dinner: "Jowar Muthia with Dal" },
      { day: "Sunday", breakfast: "Moong Dal Dhokla", lunch: "Chicken Coconut Masala Fry", snack: "Jaggery Ragi Milk", dinner: "Moong Dal Handvo" }
    ]
  },
  // Age 23 | normal | plan3
  {
    age: 23, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rava Kichadi with Peanuts", lunch: "Matki Usal with Bhakri", snack: "Sattu Jaggery Ladoo", dinner: "Bharli Vangi with Bhakri" },
      { day: "Tuesday", breakfast: "Moong Dal Roti", lunch: "Cluster Beans Dal Curry with Roti", snack: "Dry Roasted Corn", dinner: "Mixed Dal Adai with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Handvo", lunch: "Fish Coriander Fry", snack: "Curd Banana Jaggery Bowl", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Thursday", breakfast: "Jowar Ambli", lunch: "Cowpea Masala with Roti", snack: "Ragi Peanut Ladoo", dinner: "Khaman Dhokla with Curd" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Drumstick Leaves Dal with Roti", snack: "White Pea Chaat", dinner: "Yam Pepper Curry with Roti" },
      { day: "Saturday", breakfast: "Lemon Sevai with Peanuts", lunch: "Beetroot Coconut Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Jowar Ambli with Roti" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Chicken Andhra Pepper Roast", snack: "Banana Sesame Chaat", dinner: "Ragi Rotti with Curd" }
    ]
  },
  // Age 23 | normal | plan4
  {
    age: 23, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Guava Curd Bowl", lunch: "Carrot Peas Masala with Rice", snack: "Homemade Poha Chivda", dinner: "Green Peas Usal with Chapati" },
      { day: "Tuesday", breakfast: "Rice Kanji with Curd", lunch: "Amaranth Dal with Roti", snack: "Cucumber Roasted Chana Chaat", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Chicken Telangana Fry", snack: "Boiled Peanut Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Thursday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Gongura Pappu with Rice", snack: "Banana Ragi Shake", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Methi Adai", lunch: "Sweet Potato Peas Curry with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Rava Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Sprouted Moong Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Sunday", breakfast: "Vegetable Rice Sevai", lunch: "Chicken Onion Fry", snack: "Green Gram Sundal", dinner: "Rice Sevai Vegetable Bowl" }
    ]
  },
  // Age 23 | overweight | plan1
  {
    age: 23, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "Green Peas Usal with Roti", snack: "Homemade Murmura Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Mixed Dal Adai", lunch: "Bengali Masoor Dal with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Onion Adai with Chutney" },
      { day: "Wednesday", breakfast: "Palak Besan Cheela", lunch: "Fish Green Masala Fry", snack: "Homemade Jowar Savoury Balls", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Thursday", breakfast: "Ajwain Missi Roti", lunch: "Toor Dal with Raw Banana", snack: "Horse Gram Sundal", dinner: "Jowar Kanji with Dal" },
      { day: "Friday", breakfast: "Vegetable Adai", lunch: "Cauliflower Dal Curry with Roti", snack: "Boiled Corn with Lemon", dinner: "Green Peas Muthia with Curd" },
      { day: "Saturday", breakfast: "Cabbage Besan Cheela", lunch: "Maharashtrian Amti with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Chicken Green Chilli Fry", snack: "Banana Lassi", dinner: "Raw Banana Masala with Phulka" }
    ]
  },
  // Age 23 | overweight | plan2
  {
    age: 23, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Methi Corn Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Dudhi Muthia with Curd" },
      { day: "Tuesday", breakfast: "Chana Dal Cheela", lunch: "Moong Dal with Sweet Potato", snack: "Lobia Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Fish Mangalorean Curry", snack: "Roasted Corn Peanut Mix", dinner: "Rice Kanji with Dal" },
      { day: "Thursday", breakfast: "Ragi Rotti with Chutney", lunch: "Chayote Dal Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Friday", breakfast: "Sattu Cheela", lunch: "Amaranth Leaves Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Chana Dal Roti", lunch: "Sattu Curry with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Sattu Curry with Phulka" },
      { day: "Sunday", breakfast: "Green Peas Roti", lunch: "Chicken Pepper Onion Roast", snack: "Roasted Chana Chikki", dinner: "Aval Vegetable Kichadi" }
    ]
  },
  // Age 23 | overweight | plan3
  {
    age: 23, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Mixed Dal Cheela", lunch: "Tindora Peanut Curry with Rice", snack: "Black Chana Sundal", dinner: "Besan Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Ragi Paniyaram", lunch: "Chana Dal with Spinach", snack: "Guava Jaggery Bowl", dinner: "Carrot Roti with Dal" },
      { day: "Wednesday", breakfast: "Drumstick Leaves Adai", lunch: "Chicken Dry Pudina Roast", snack: "Murmura Onion Chaat", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Drumstick Leaves Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Onion Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Methi Thalipeeth", lunch: "White Peas Curry with Rice", snack: "Sesame Chikki", dinner: "Palak Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Yam Pepper Curry with Rice", snack: "Roasted Bengal Gram with Onion", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Rava Paniyaram", lunch: "Prawn Gongura Curry", snack: "Ragi Puffed Grain Chaat", dinner: "Ragi Malt with Roti and Dal" }
    ]
  },
  // Age 23 | overweight | plan4
  {
    age: 23, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Thalipeeth", lunch: "Carrot Peas Masala with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Methi Muthia with Dal" },
      { day: "Tuesday", breakfast: "Bajra Methi Roti", lunch: "Lobia Curry with Rice", snack: "Ginger Buttermilk", dinner: "Chayote Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Vegetable Muthia", lunch: "Chicken Tawa Garlic Fry", snack: "Jowar Malt Drink", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Thursday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Tindora Sesame Curry with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Vegetable Paniyaram", lunch: "Black-Eyed Pea Curry with Rice", snack: "Peanut Poha Chivda", dinner: "Urad Dal Cheela with Curd" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Potato Peas Curry with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Sattu Cheela with Curd" },
      { day: "Sunday", breakfast: "Onion Missi Roti", lunch: "Chicken Methi Pepper Fry", snack: "Jaggery Lassi", dinner: "Ajwain Missi Roti with Dal" }
    ]
  },
  // Age 24 | underweight | plan1
  {
    age: 24, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Leftover Rice Paniyaram", lunch: "Sprouted Moong Curry with Rice", snack: "Homemade Peanut Bar", dinner: "Methi Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Ragi Rotti with Chutney", lunch: "Peas Potato Curry with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Sattu Roti with Curd", lunch: "Chicken Green Chilli Fry", snack: "Jeera Buttermilk", dinner: "Yam Pepper Curry with Roti" },
      { day: "Thursday", breakfast: "Moong Dal Dhokla", lunch: "Dal with Amaranth Leaves", snack: "Horse Gram Sundal", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Tindora Sesame Curry with Roti", snack: "Corn Peanut Sundal", dinner: "Green Peas Roti with Curd" },
      { day: "Saturday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Dal with Carrot and Beans", snack: "Homemade Murmura Chaat", dinner: "Rava Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Millet Vegetable Pancake", lunch: "Chicken Dry Lemon Roast", snack: "Jaggery Lassi", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 24 | underweight | plan2
  {
    age: 24, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Boiled Yam with Curd", lunch: "Sweet Potato Peas Curry with Rice", snack: "Cowpea Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Green Gram Masala with Roti", snack: "White Pea Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Chicken Sesame Fry", snack: "Sweet Potato Peanut Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Jowar Kanji with Curd", lunch: "Matki Usal with Bhakri", snack: "Homemade Popcorn with Peanuts", dinner: "Chayote Moong Curry with Roti" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Gongura Pappu with Rice", snack: "Jowar Chikki", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Saturday", breakfast: "Moong Dal Handvo", lunch: "Carrot Chana Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Beetroot Roti with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Paniyaram", lunch: "Chicken Ginger Pepper Fry", snack: "Sattu Buttermilk", dinner: "Mixed Dal Cheela with Curd" }
    ]
  },
  // Age 24 | underweight | plan3
  {
    age: 24, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Broad Beans Masala with Roti", snack: "Banana Ragi Balls", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Bajra Rotti with Curd", lunch: "Cauliflower Methi Curry with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Methi Akki Rotti", lunch: "Chicken Telangana Fry", snack: "Ragi Peanut Ladoo", dinner: "Palak Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Vegetable Rice Sevai", lunch: "Sweet Potato Peas Curry with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Jowar Kanji with Dal" },
      { day: "Friday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Moong Dal with Carrot", snack: "Banana Lassi", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "White Peas Masala with Roti", snack: "Roasted Chana Ladoo", dinner: "Lobia Curry with Roti" },
      { day: "Sunday", breakfast: "Rava Paniyaram", lunch: "Chicken Lemon Pepper Fry", snack: "Papaya Coconut Bowl", dinner: "Sattu Cheela with Curd" }
    ]
  },
  // Age 24 | underweight | plan4
  {
    age: 24, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Potato Beans Curry with Roti", snack: "Rice Kanji Drink", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Rice Kanji with Dal" },
      { day: "Wednesday", breakfast: "Bajra Malt with Jaggery", lunch: "Chicken Coconut Garlic Roast", snack: "Sattu Jaggery Balls", dinner: "Carrot Muthia with Dal" },
      { day: "Thursday", breakfast: "Methi Adai", lunch: "Stuffed Tindora with Roti", snack: "Ragi Buttermilk", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Onion Adai", lunch: "Methi Corn Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Mixed Dal Cheela", lunch: "Maharashtrian Amti with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Jowar Rotti with Dal" },
      { day: "Sunday", breakfast: "Chana Dal Cheela", lunch: "Prawn Coconut Pepper Fry", snack: "Dry Roasted Corn", dinner: "Beetroot Masala with Roti" }
    ]
  },
  // Age 24 | normal | plan1
  {
    age: 24, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Muthia", lunch: "Dosakaya Pappu with Rice", snack: "Bajra Malt Drink", dinner: "Coconut Sevai with Peanuts" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Roti", lunch: "Tindora Peanut Curry with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Besan Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "Chicken Dry Garlic Roast", snack: "Black Chana Chaat with Lemon", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Cowpea Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Friday", breakfast: "Jowar Vegetable Pancake", lunch: "Carrot Moong Curry with Roti", snack: "Ragi Banana Balls", dinner: "Bharli Vangi with Bhakri" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Toor Dal with Raw Banana", snack: "Poha Jaggery Ladoo", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Rava Kichadi with Peanuts", lunch: "Chicken Mint Pepper Roast", snack: "Puffed Rice Chikki", dinner: "Green Gram Curry with Jowar Roti" }
    ]
  },
  // Age 24 | normal | plan2
  {
    age: 24, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Methi Adai with Curd" },
      { day: "Tuesday", breakfast: "Aval Upma with Peanuts", lunch: "White Peas Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Chicken Tamarind Fry", snack: "Homemade Poha Chivda", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Vegetable Adai", lunch: "Sattu Curry with Roti", snack: "Jowar Puffed Grain Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Bottle Gourd Handvo", lunch: "Masoor Dal with Methi", snack: "Homemade Jowar Savoury Balls", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Spinach Corn Curry with Rice", snack: "Ginger Buttermilk", dinner: "Methi Handvo with Chutney" },
      { day: "Sunday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Chicken Dry Curry Leaf Roast", snack: "White Peas Sundal", dinner: "Green Peas Muthia with Curd" }
    ]
  },
  // Age 24 | normal | plan3
  {
    age: 24, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "Yam Pepper Curry with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Methi Thalipeeth", lunch: "Dill Leaves Curry with Roti", snack: "Boiled Corn with Lemon", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Chicken Dry Sesame Roast", snack: "Peanut Sundal", dinner: "White Pea Curry with Phulka" },
      { day: "Thursday", breakfast: "Carrot Roti with Curd", lunch: "Stuffed Brinjal with Rice", snack: "Banana Sesame Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Friday", breakfast: "Onion Paniyaram", lunch: "Broad Beans Dal Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Onion Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Lemon Sevai with Peanuts", lunch: "Drumstick Leaves Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Sattu Curry with Phulka" },
      { day: "Sunday", breakfast: "Vegetable Paniyaram", lunch: "Chicken Ginger Lemon Fry", snack: "Banana Ragi Shake", dinner: "Jowar Muthia with Dal" }
    ]
  },
  // Age 24 | normal | plan4
  {
    age: 24, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Kozhukattai", lunch: "Beetroot Coconut Curry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Chayote Dal Curry with Roti", snack: "Cowpea Sundal", dinner: "Stuffed Brinjal with Roti" },
      { day: "Wednesday", breakfast: "Banana with Roasted Peanuts", lunch: "Prawn Andhra Pepper Fry", snack: "Bajra Puffed Grain Chaat", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Moong Dal with Spinach", snack: "Green Gram Sundal", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Masoor Dal with Dill Leaves", snack: "Murmura Peanut Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Bajra Thalipeeth", lunch: "Brinjal Coconut Curry with Rice", snack: "Murmura Onion Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Chicken Curry Leaf Garlic Roast", snack: "Ragi Peanut Chikki", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 24 | overweight | plan1
  {
    age: 24, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Green Peas Muthia", lunch: "Cowpea Masala with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Cauliflower Dal Curry with Roti", snack: "Banana Sattu Shake", dinner: "Mixed Dal Adai with Curd" },
      { day: "Wednesday", breakfast: "Guava Curd Bowl", lunch: "Fish Methi Curry", snack: "Boiled Groundnut Salad", dinner: "Urad Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Ragi Malt with Jaggery", lunch: "Green Peas Usal with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Stuffed Bhindi with Roti" },
      { day: "Friday", breakfast: "Ragi Dhokla", lunch: "Kala Vatana Usal with Rice", snack: "Green Gram Chaat", dinner: "Chana Usal with Bhakri" },
      { day: "Saturday", breakfast: "Jowar Ambli", lunch: "Black-Eyed Pea Curry with Rice", snack: "Lobia Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Sunday", breakfast: "Onion Missi Roti", lunch: "Fish Bengali Jhol", snack: "Homemade Corn Chivda", dinner: "Ragi Ambli with Roti" }
    ]
  },
  // Age 24 | overweight | plan2
  {
    age: 24, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Vegetable Thalipeeth", lunch: "Cauliflower Peas Masala with Rice", snack: "Roasted Bengal Gram with Onion", dinner: "Onion Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Pancake", lunch: "Potato Beans Curry with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Fish Andhra Pulusu", snack: "Roasted Corn Peanut Mix", dinner: "Palak Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Palak Dhokla", lunch: "Moong Dal with Sweet Potato", snack: "Curd Roasted Chana Bowl", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Friday", breakfast: "Mixed Dal Adai", lunch: "Bengali Masoor Dal with Rice", snack: "Roasted Sweet Corn", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Saturday", breakfast: "Sattu Cheela", lunch: "Potato Peas Curry with Rice", snack: "Papaya Lassi", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Sunday", breakfast: "Ragi Ambli with Jaggery", lunch: "Fish Mustard Fry", snack: "Curd Peanut Bowl", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 24 | overweight | plan3
  {
    age: 24, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Andhra Mudda Pappu with Rice", snack: "Boiled Peanut Chaat", dinner: "Palak Missi Roti with Curd" },
      { day: "Tuesday", breakfast: "Jowar Malt with Milk", lunch: "Carrot Peas Masala with Rice", snack: "Raw Banana Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Onion Thalipeeth", lunch: "Chicken Jeera Garlic Roast", snack: "Homemade Banana Shake", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Thursday", breakfast: "Khaman Dhokla", lunch: "Green Gram Masala with Rice", snack: "Roasted Cowpeas", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Urad Dal Cheela", lunch: "Chana Dal with Spinach", snack: "Jowar Malt Drink", dinner: "Sweet Potato Roti with Curd" },
      { day: "Saturday", breakfast: "Vegetable Handvo", lunch: "Peas Potato Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Prawn Mustard Curry", snack: "Guava Jaggery Bowl", dinner: "Aval Vegetable Kichadi" }
    ]
  },
  // Age 24 | overweight | plan4
  {
    age: 24, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Potato Methi Curry with Roti", snack: "Cucumber Roasted Chana Chaat", dinner: "Methi Muthia with Dal" },
      { day: "Tuesday", breakfast: "Besan Dhokla", lunch: "Yam Masala with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Vegetable Adai with Curd" },
      { day: "Wednesday", breakfast: "Ragi Paniyaram", lunch: "Chicken Dry Green Masala Roast", snack: "Mint Buttermilk", dinner: "Bajra Ambli with Curd" },
      { day: "Thursday", breakfast: "Moong Dal Roti", lunch: "Brinjal Peanut Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Carrot Roti with Dal" },
      { day: "Friday", breakfast: "Cabbage Besan Cheela", lunch: "Brinjal Dal Curry with Roti", snack: "Guava Peanut Chaat", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Cabbage Moong Curry with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Vegetable Handvo with Curd" },
      { day: "Sunday", breakfast: "Jowar Methi Roti", lunch: "Chicken Coriander Ginger Roast", snack: "Roasted Peanut Jaggery Mix", dinner: "Carrot Besan Cheela with Chutney" }
    ]
  },
  // Age 25 | underweight | plan1
  {
    age: 25, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Banana Jowar Pancake", lunch: "Cluster Beans Dal Curry with Roti", snack: "Roasted Cowpeas", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Tuesday", breakfast: "Moong Dal Paniyaram", lunch: "Stuffed Brinjal with Roti", snack: "Jowar Malt Drink", dinner: "Green Peas Roti with Curd" },
      { day: "Wednesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Chicken Dry Sesame Roast", snack: "Sesame Jaggery Ladoo", dinner: "Beetroot Masala with Roti" },
      { day: "Thursday", breakfast: "Vegetable Handvo", lunch: "Dal with Carrot and Beans", snack: "Boiled Groundnut Salad", dinner: "Onion Adai with Chutney" },
      { day: "Friday", breakfast: "Palak Missi Roti", lunch: "Kala Vatana Usal with Rice", snack: "Sattu Jaggery Balls", dinner: "Radish Roti with Dal" },
      { day: "Saturday", breakfast: "Vegetable Thalipeeth", lunch: "Raw Mango Dal with Rice", snack: "Roasted Gram Balls", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Fish Tomato Masala", snack: "Lobia Chaat", dinner: "Khaman Dhokla with Curd" }
    ]
  },
  // Age 25 | underweight | plan2
  {
    age: 25, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Chana Dal with Spinach", snack: "Ragi Puffed Grain Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Masoor Dal with Dill Leaves", snack: "White Peas Sundal", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Guava Curd Bowl", lunch: "Chicken Cumin Coriander Roast", snack: "Roasted Peanut Jaggery Mix", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Thursday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Green Gram Masala with Roti", snack: "Boiled Chana Chaat with Onion", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Vegetable Paniyaram", lunch: "Masoor Dal with Methi", snack: "Murmura Onion Chaat", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Saturday", breakfast: "Ragi Kozhukattai", lunch: "Black-Eyed Pea Curry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Yam Pepper Curry with Roti" },
      { day: "Sunday", breakfast: "Bajra Thalipeeth", lunch: "Chicken Gongura Pepper Fry", snack: "Horse Gram Sundal", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 25 | underweight | plan3
  {
    age: 25, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Yam Masala with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Drumstick Leaves Adai", lunch: "Green Gram Masala with Rice", snack: "Homemade Corn Chivda", dinner: "Akki Rotti with Curd" },
      { day: "Wednesday", breakfast: "Rice Kanji with Curd", lunch: "Chicken Peanut Pepper Roast", snack: "Ragi Jaggery Ladoo", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Sweet Potato Roti", lunch: "Peas Potato Curry with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Mixed Dal Adai with Curd" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Yam Pepper Curry with Rice", snack: "Bajra Malt Drink", dinner: "Palak Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Methi Besan Cheela", lunch: "Carrot Moong Curry with Roti", snack: "Rice Kanji Drink", dinner: "Vegetable Handvo with Curd" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Chicken Spinach Pepper Fry", snack: "Roasted Chana Chikki", dinner: "Stuffed Bhindi with Roti" }
    ]
  },
  // Age 25 | underweight | plan4
  {
    age: 25, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Cabbage Besan Cheela", lunch: "Peas Potato Curry with Roti", snack: "Ragi Buttermilk", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Vegetable Adai", lunch: "Carrot Chana Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Besan Dhokla", lunch: "Chicken Masala Fry", snack: "Sattu Buttermilk", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Methi Adai", lunch: "Potato Beans Curry with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Sattu Cheela with Curd" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Chayote Moong Curry with Rice", snack: "Murmura Peanut Chaat", dinner: "Methi Muthia with Dal" },
      { day: "Saturday", breakfast: "Sattu Roti with Curd", lunch: "Broad Beans Masala with Rice", snack: "Roasted Chana Ladoo", dinner: "Lobia Curry with Roti" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "Prawn Green Masala Fry", snack: "Guava Jaggery Bowl", dinner: "Onion Besan Cheela with Curd" }
    ]
  },
  // Age 25 | normal | plan1
  {
    age: 25, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Banana Ragi Balls", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "Sattu Curry with Rice", snack: "Boiled Peanut Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Banana with Roasted Peanuts", lunch: "Chicken Green Chilli Fry", snack: "Sweet Potato Peanut Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Ragi Malt with Jaggery", lunch: "Cowpea Curry with Rice", snack: "Banana Ragi Shake", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Friday", breakfast: "Moong Dal Roti", lunch: "Drumstick Leaves Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Lemon Sevai with Peanuts" },
      { day: "Saturday", breakfast: "Jowar Methi Roti", lunch: "Cabbage Moong Curry with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Moong Dal Handvo", lunch: "Chicken Dhaba Fry", snack: "Homemade Ragi Savoury Balls", dinner: "Bajra Ambli with Curd" }
    ]
  },
  // Age 25 | normal | plan2
  {
    age: 25, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Dal with Fenugreek Leaves", snack: "Curd Peanut Bowl", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Moong Dal with Spinach", snack: "Roasted Peanuts with Curry Leaves", dinner: "Bajra Rotti with Dal" },
      { day: "Wednesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Fish Lemon Roast", snack: "Boiled Corn with Lemon", dinner: "Rava Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Banana Ragi Pancake", lunch: "Chana Dal with Ridge Gourd", snack: "Raw Banana Chaat", dinner: "Sattu Curry with Phulka" },
      { day: "Friday", breakfast: "Urad Dal Cheela", lunch: "Broad Beans Masala with Roti", snack: "Papaya Lassi", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Gongura Pappu with Rice", snack: "Roasted Mung Beans", dinner: "Matki Usal with Bhakri" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "Prawn Andhra Pepper Fry", snack: "Banana Jaggery Bowl", dinner: "Vegetable Adai with Curd" }
    ]
  },
  // Age 25 | normal | plan3
  {
    age: 25, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Moong Dal with Sweet Potato", snack: "Banana Sattu Shake", dinner: "Methi Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Masoor Dal Cheela", lunch: "Dill Leaves Curry with Roti", snack: "Peanut Sundal", dinner: "Dudhi Muthia with Curd" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Prawn Mustard Curry", snack: "Homemade Banana Shake", dinner: "Green Peas Muthia with Curd" },
      { day: "Thursday", breakfast: "Ragi Banana Malt", lunch: "Stuffed Tindora with Roti", snack: "Ragi Banana Balls", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Sattu Vegetable Pancake", lunch: "Green Peas Usal with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Lobia Curry with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Carrot Roti with Dal" },
      { day: "Sunday", breakfast: "Millet Vegetable Pancake", lunch: "Fish Garlic Pepper Fry", snack: "Plain Homemade Lassi", dinner: "Tindora Peanut Curry with Roti" }
    ]
  },
  // Age 25 | normal | plan4
  {
    age: 25, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "Sweet Potato Peas Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Methi Handvo with Chutney" },
      { day: "Tuesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Carrot Peas Masala with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Boiled Yam with Curd", lunch: "Chicken Coriander Ginger Roast", snack: "Roasted Chana Jaggery Mix", dinner: "Raw Banana Masala with Phulka" },
      { day: "Thursday", breakfast: "Methi Thalipeeth", lunch: "Dal with Amaranth Leaves", snack: "Curd Roasted Chana Bowl", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Jowar Ambli", lunch: "Raw Banana Masala with Roti", snack: "Jaggery Ragi Milk", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Mixed Dal Adai", lunch: "Andhra Mudda Pappu with Rice", snack: "Carrot Peanut Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Chicken Garlic Lemon Fry", snack: "Cowpea Chaat", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 25 | overweight | plan1
  {
    age: 25, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Potato Peas Curry with Rice", snack: "Jowar Chikki", dinner: "Ragi Rotti with Curd" },
      { day: "Tuesday", breakfast: "Beetroot Roti with Curd", lunch: "Amaranth Leaves Curry with Rice", snack: "Homemade Peanut Bar", dinner: "Bharli Vangi with Bhakri" },
      { day: "Wednesday", breakfast: "Ajwain Missi Roti", lunch: "Fish Tawa Fry", snack: "Papaya Coconut Bowl", dinner: "Jowar Ambli with Roti" },
      { day: "Thursday", breakfast: "Onion Missi Roti", lunch: "Tindora Sesame Curry with Roti", snack: "Ragi Peanut Chikki", dinner: "Onion Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Methi Muthia", lunch: "Broad Beans Dal Curry with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Saturday", breakfast: "Ragi Vegetable Roti", lunch: "Gujarati Dal with Rice", snack: "Jaggery Lassi", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Ragi Paniyaram", lunch: "Fish Lemon Pepper Fry", snack: "Roasted Corn Peanut Mix", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 25 | overweight | plan2
  {
    age: 25, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Rotti with Curd", lunch: "Carrot Peas Masala with Roti", snack: "Homemade Poha Chivda", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Methi Akki Rotti", lunch: "Dill Leaves Dal with Rice", snack: "Dry Roasted Corn", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Roti", lunch: "Fish Andhra Pepper Fry", snack: "Sweet Potato Sesame Balls", dinner: "Jowar Kanji with Dal" },
      { day: "Thursday", breakfast: "Palak Besan Cheela", lunch: "Raw Banana Masala with Rice", snack: "Banana Lassi", dinner: "Vegetable Muthia with Curd" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Dosakaya Pappu with Rice", snack: "Peanut Chikki", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Cabbage Carrot Curry with Rice", snack: "Black Chana Sundal", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Carrot Muthia", lunch: "Chicken Pepper Onion Roast", snack: "Roasted Bengal Gram with Onion", dinner: "White Pea Curry with Phulka" }
    ]
  },
  // Age 25 | overweight | plan3
  {
    age: 25, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Vegetable Pancake", lunch: "Cowpea Masala with Roti", snack: "Cowpea Sundal", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Maharashtrian Amti with Rice", snack: "Roasted Green Gram", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Wednesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Chicken Dry Jeera Roast", snack: "Green Gram Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Kala Vatana Usal with Roti" },
      { day: "Friday", breakfast: "Palak Dhokla", lunch: "Brinjal Peanut Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Spinach Chana Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Besan Dhokla with Curd" },
      { day: "Sunday", breakfast: "Carrot Roti with Curd", lunch: "Chicken Punjabi Masala Fry", snack: "Puffed Rice Chikki", dinner: "Green Peas Usal with Chapati" }
    ]
  },
  // Age 25 | overweight | plan4
  {
    age: 25, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Bengali Masoor Dal with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Rice Kanji with Dal" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Potato Beans Curry with Rice", snack: "Roasted Sweet Corn", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Wednesday", breakfast: "Onion Paniyaram", lunch: "Chicken Tawa Lemon Fry", snack: "Jeera Buttermilk", dinner: "Palak Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Jowar Thalipeeth", lunch: "Matki Usal with Rice", snack: "White Pea Chaat", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Friday", breakfast: "Papaya Curd Bowl", lunch: "Cauliflower Methi Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Rava Paniyaram", lunch: "Brinjal Coconut Curry with Rice", snack: "Banana Sesame Chaat", dinner: "Chana Usal with Bhakri" },
      { day: "Sunday", breakfast: "Methi Handvo", lunch: "Prawn Garlic Pepper Fry", snack: "Sesame Chikki", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 26 | underweight | plan1
  {
    age: 26, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Lobia Curry with Roti", snack: "Homemade Corn Chivda", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Tuesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Beerakaya Pappu with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Wednesday", breakfast: "Carrot Roti with Curd", lunch: "South Indian Chicken Dry Methi Roast with", snack: "Roasted Green Gram", dinner: "Rice Kanji with Dal" },
      { day: "Thursday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Dal with Drumstick Leaves", snack: "Guava Peanut Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Friday", breakfast: "Methi Handvo", lunch: "Spinach Chana Curry with Roti", snack: "Guava Jaggery Bowl", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Rava Paniyaram", lunch: "Dosakaya Pappu with Rice", snack: "Sattu Buttermilk", dinner: "Palak Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Guava Curd Bowl", lunch: "Andhra Chicken Pan Fry with Rice", snack: "Dry Roasted Corn", dinner: "Stuffed Brinjal with Roti" }
    ]
  },
  // Age 26 | underweight | plan2
  {
    age: 26, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Green Peas Muthia", lunch: "Sweet Potato Peas Curry with Rice", snack: "Mint Buttermilk", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Vegetable Rice Sevai", lunch: "Brinjal Peanut Curry with Rice", snack: "Roasted Chana Ladoo", dinner: "Bajra Ambli with Curd" },
      { day: "Wednesday", breakfast: "Chana Dal Roti", lunch: "Andhra Prawn Coriander Fry", snack: "Sattu Jaggery Ladoo", dinner: "White Pea Curry with Phulka" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Carrot Moong Curry with Roti", snack: "Banana Lassi", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Sweet Potato Peas Curry with Roti", snack: "Ragi Buttermilk", dinner: "Ragi Dhokla with Curd" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Chayote Dal Curry with Roti", snack: "Carrot Peanut Chaat", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Sunday", breakfast: "Methi Akki Rotti", lunch: "Andhra Chicken Coastal Pepper Fry - 150", snack: "Banana Ragi Shake", dinner: "Ragi Sevai Vegetable Bowl" }
    ]
  },
  // Age 26 | underweight | plan3
  {
    age: 26, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Tindora Peanut Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Besan Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Brinjal Coconut Curry with Rice", snack: "Jeera Buttermilk", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Wednesday", breakfast: "Ragi Rotti with Chutney", lunch: "North Indian Chicken Gongura Roast with", snack: "Curry Leaf Buttermilk", dinner: "Sattu Roti with Dal" },
      { day: "Thursday", breakfast: "Green Peas Roti", lunch: "Spinach Corn Curry with Rice", snack: "Curd Peanut Bowl", dinner: "Green Peas Roti with Curd" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Carrot Chana Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Saturday", breakfast: "Lemon Sevai with Peanuts", lunch: "Moong Dal with Carrot", snack: "Homemade Poha Chivda", dinner: "Jowar Kanji with Dal" },
      { day: "Sunday", breakfast: "Jowar Vegetable Pancake", lunch: "Andhra Fish Garlic Pepper Fry", snack: "Coconut Jaggery Ladoo", dinner: "Onion Besan Cheela with Curd" }
    ]
  },
  // Age 26 | underweight | plan4
  {
    age: 26, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Pancake", lunch: "Potato Beans Curry with Roti", snack: "Banana Jaggery Bowl", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Tuesday", breakfast: "Leftover Rice Paniyaram", lunch: "White Peas Masala with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Jowar Muthia with Dal" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "North Indian Chicken Onion Fry", snack: "Puffed Rice Chana Mixture", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Dill Leaves Dal with Rice", snack: "Ragi Banana Balls", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Black-Eyed Pea Curry with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Saturday", breakfast: "Palak Dhokla", lunch: "Beetroot Masala with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Jowar Ambli with Roti" },
      { day: "Sunday", breakfast: "Onion Besan Cheela", lunch: "Andhra Chicken Andhra Pepper Roast with", snack: "Curd Cucumber Peanut Bowl", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 26 | normal | plan1
  {
    age: 26, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Raw Banana Masala with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Yam Pepper Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Chana Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Jowar Ambli", lunch: "Andhra Chicken Kasuri Methi Fry", snack: "Roasted Corn Peanut Mix", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Thursday", breakfast: "Ragi Vegetable Pancake", lunch: "Matki Usal with Bhakri", snack: "Roasted Gram Balls", dinner: "Palak Missi Roti with Curd" },
      { day: "Friday", breakfast: "Vegetable Adai", lunch: "Green Gram Masala with Roti", snack: "Boiled Chana Chaat with Onion", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Bajra Rotti with Curd", lunch: "Methi Corn Curry with Rice", snack: "Bajra Malt Drink", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Sunday", breakfast: "Rice Flour Vegetable Pancake", lunch: "South Indian Chicken Gongura Roast with", snack: "Puffed Rice Peanut Mixture", dinner: "Carrot Roti with Dal" }
    ]
  },
  // Age 26 | normal | plan2
  {
    age: 26, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Carrot Peas Masala with Roti", snack: "Banana Sesame Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Gujarati Dal with Rice", snack: "Black Chana Sundal", dinner: "Yam Pepper Curry with Roti" },
      { day: "Wednesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Prawn Andhra Pepper Fry with Rice - 120", snack: "Beetroot Peanut Chaat", dinner: "Methi Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Methi Muthia", lunch: "Cluster Beans Dal Curry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Onion Adai", lunch: "Sattu Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Bajra Rotti with Dal" },
      { day: "Saturday", breakfast: "Mixed Dal Adai", lunch: "Dal with Amaranth Leaves", snack: "Sweet Potato Peanut Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Sunday", breakfast: "Bajra Ambli", lunch: "Chicken Green Chilli Fry with Roti", snack: "Ragi Peanut Chikki", dinner: "Ragi Malt with Roti and Dal" }
    ]
  },
  // Age 26 | normal | plan3
  {
    age: 26, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "Potato Methi Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Mixed Dal Adai with Curd" },
      { day: "Tuesday", breakfast: "Bajra Methi Roti", lunch: "Raw Banana Masala with Rice", snack: "Puffed Rice Chikki", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Kozhukattai", lunch: "Chicken Tawa Pepper Roast", snack: "Roasted Black Chana with Lemon", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Dudhi Muthia", lunch: "Dal with Carrot and Beans", snack: "Corn Peanut Sundal", dinner: "Dudhi Muthia with Curd" },
      { day: "Friday", breakfast: "Sattu Cheela", lunch: "Moong Dal with Sweet Potato", snack: "Bajra Puffed Grain Chaat", dinner: "Vegetable Muthia with Curd" },
      { day: "Saturday", breakfast: "Onion Thalipeeth", lunch: "Carrot Peas Masala with Rice", snack: "Banana Ragi Balls", dinner: "Methi Handvo with Chutney" },
      { day: "Sunday", breakfast: "Palak Besan Cheela", lunch: "North Indian Chicken Dry Masala Fry with", snack: "Sesame Chikki", dinner: "Chana Dal Roti with Curd" }
    ]
  },
  // Age 26 | normal | plan4
  {
    age: 26, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Green Gram Masala with Rice", snack: "Boiled Corn with Lemon", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Roti", lunch: "Moong Dal with Spinach", snack: "Sweet Potato Sesame Balls", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Handvo", lunch: "Telangana Chicken Onion Pepper Fry with", snack: "Jowar Malt Drink", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Vegetable Muthia", lunch: "Lobia Curry with Rice", snack: "Peanut Poha Chivda", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Jowar Methi Roti", lunch: "Potato Beans Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Saturday", breakfast: "Moong Dal Handvo", lunch: "Gongura Pappu with Rice", snack: "White Pea Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "Prawn Mustard Curry", snack: "Murmura Onion Chaat", dinner: "Sweet Potato Peas Curry with Phulka" }
    ]
  },
  // Age 26 | overweight | plan1
  {
    age: 26, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Palak Missi Roti", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Roasted Sweet Corn", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Methi Adai", lunch: "Kala Vatana Usal with Roti", snack: "Jaggery Lassi", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Andhra Prawn Ginger Garlic Fry with Red", snack: "Curd Sweet Potato Bowl", dinner: "Green Peas Muthia with Curd" },
      { day: "Thursday", breakfast: "Chana Dal Cheela", lunch: "Toor Dal with Raw Banana", snack: "Homemade Murmura Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Cowpea Masala with Roti", snack: "Peanut Chikki", dinner: "Sattu Cheela with Curd" },
      { day: "Saturday", breakfast: "Beetroot Roti with Curd", lunch: "Cabbage Carrot Curry with Rice", snack: "Ragi Peanut Ladoo", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Bajra Thalipeeth", lunch: "Prawn Jeera Fry", snack: "Papaya Peanut Chaat", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 26 | overweight | plan2
  {
    age: 26, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Aval Upma with Peanuts", lunch: "Sattu Curry with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Methi Muthia with Dal" },
      { day: "Tuesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Cauliflower Dal Curry with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Moong Dal Roti", lunch: "North Indian Chicken Mint Coriander Fry", snack: "Rice Kanji Drink", dinner: "Aval Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Onion Paniyaram", lunch: "Chayote Moong Curry with Rice", snack: "Jowar Chikki", dinner: "Sattu Curry with Phulka" },
      { day: "Friday", breakfast: "Carrot Muthia", lunch: "Kala Vatana Usal with Rice", snack: "White Peas Sundal", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Cowpea Curry with Rice", snack: "Banana Sattu Shake", dinner: "Vegetable Handvo with Curd" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Telangana Chicken Kasuri Methi Fry with", snack: "Raw Banana Chaat", dinner: "Green Peas Usal with Chapati" }
    ]
  },
  // Age 26 | overweight | plan3
  {
    age: 26, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Paniyaram", lunch: "Amaranth Leaves Curry with Rice", snack: "Green Gram Sundal", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Bharli Vangi with Bhakri", snack: "Sattu Jaggery Balls", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Jowar Thalipeeth", lunch: "Chicken Green Pepper Roast with Roti", snack: "Ginger Buttermilk", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Ajwain Missi Roti", lunch: "Peas Potato Curry with Roti", snack: "Peanut Sundal", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Masoor Dal with Methi", snack: "Lobia Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Chana Dal with Spinach", snack: "Cowpea Sundal", dinner: "Raw Banana Masala with Phulka" },
      { day: "Sunday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "South Indian Chicken Lemon Garlic Roast", snack: "Curd Roasted Chana Bowl", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 26 | overweight | plan4
  {
    age: 26, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Methi Besan Cheela", lunch: "Broad Beans Masala with Rice", snack: "Plain Homemade Lassi", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Onion Missi Roti", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Horse Gram Sundal", dinner: "Akki Rotti with Curd" },
      { day: "Wednesday", breakfast: "Boiled Yam with Curd", lunch: "Chicken Jeera Pepper Fry", snack: "Murmura Peanut Chaat", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Dill Leaves Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Ragi Ambli with Roti" },
      { day: "Friday", breakfast: "Ragi Thalipeeth", lunch: "Bengali Masoor Dal with Rice", snack: "Murmura Black Chana Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Mixed Dal Cheela", lunch: "Methi Peas Curry with Roti", snack: "Papaya Lassi", dinner: "Jowar Rotti with Dal" },
      { day: "Sunday", breakfast: "Peanut Banana Bowl", lunch: "Prawn Coriander Lemon Fry", snack: "Black Chana Chaat with Lemon", dinner: "Chayote Moong Curry with Roti" }
    ]
  },
  // Age 27 | underweight | plan1
  {
    age: 27, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Tindora Sesame Curry with Roti", snack: "Peanut Chikki", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Jowar Vegetable Pancake", lunch: "Beetroot Masala with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Rice Kanji with Dal" },
      { day: "Wednesday", breakfast: "Cabbage Besan Cheela", lunch: "North Indian Chicken Ginger Fry", snack: "Murmura Onion Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Sattu Vegetable Roti", lunch: "Cowpea Masala with Roti", snack: "Boiled Yam Chaat", dinner: "Sweet Potato Roti with Curd" },
      { day: "Friday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Carrot Peas Masala with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Carrot Peas Masala with Rice", snack: "Jeera Buttermilk", dinner: "Ragi Rotti with Curd" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Telangana Chicken Dry Green Masala", snack: "Homemade Corn Chivda", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 27 | underweight | plan2
  {
    age: 27, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Dal with Amaranth Leaves", snack: "Cucumber Roasted Chana Chaat", dinner: "Matki Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Bajra Rotti with Curd", lunch: "Chana Usal with Bhakri", snack: "Ginger Buttermilk", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Palak Dhokla", lunch: "Chicken Tamarind Fry", snack: "Roasted Chana Ladoo", dinner: "Onion Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Stuffed Bhindi with Roti", snack: "Papaya Lassi", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Rava Paniyaram", lunch: "Stuffed Tindora with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Vegetable Muthia with Curd" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "Moong Dal with Carrot", snack: "Dry Roasted Corn", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Lemon Sevai with Peanuts", lunch: "Telangana Chicken Ginger Pepper Fry", snack: "Papaya Coconut Bowl", dinner: "Vegetable Rice Kozhukattai" }
    ]
  },
  // Age 27 | underweight | plan3
  {
    age: 27, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Moong Dal with Sweet Potato", snack: "Rice Kanji Drink", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Ajwain Missi Roti", lunch: "Brinjal Peanut Curry with Rice", snack: "White Pea Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "Telangana Chicken Pepper Roast", snack: "Bajra Puffed Grain Chaat", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Ragi Dhokla", lunch: "Yam Masala with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Vegetable Thalipeeth", lunch: "Spinach Chana Curry with Roti", snack: "Ragi Buttermilk", dinner: "Beetroot Roti with Curd" },
      { day: "Saturday", breakfast: "Ragi Paniyaram", lunch: "Carrot Moong Curry with Roti", snack: "Jaggery Ragi Milk", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Bajra Ambli", lunch: "Andhra Fish Coconut Pepper Curry with", snack: "Curry Leaf Buttermilk", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 27 | underweight | plan4
  {
    age: 27, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Chana Dal with Spinach", snack: "White Peas Sundal", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Cauliflower Peas Masala with Rice", snack: "Mint Buttermilk", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Wednesday", breakfast: "Carrot Roti with Curd", lunch: "Fish Andhra Pepper Fry", snack: "Sesame Jaggery Ladoo", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Methi Thalipeeth", lunch: "Masoor Dal with Methi", snack: "Boiled Peanut Chaat", dinner: "Lobia Curry with Roti" },
      { day: "Friday", breakfast: "Ragi Thalipeeth", lunch: "Moong Dal with Spinach", snack: "Poha Jaggery Ladoo", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Saturday", breakfast: "Palak Besan Cheela", lunch: "Toor Dal with Raw Banana", snack: "Banana Sesame Chaat", dinner: "Methi Adai with Curd" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Telangana Chicken Coconut Masala Fry", snack: "Lobia Chaat", dinner: "Khaman Dhokla with Curd" }
    ]
  },
  // Age 27 | normal | plan1
  {
    age: 27, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Onion Thalipeeth", lunch: "Sweet Potato Peas Curry with Rice", snack: "Jaggery Lassi", dinner: "Chayote Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Methi Adai", lunch: "Yam Pepper Curry with Rice", snack: "Black Chana Sundal", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Wednesday", breakfast: "Ragi Kozhukattai", lunch: "Prawn Coconut Garlic Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Dudhi Muthia with Curd" },
      { day: "Thursday", breakfast: "Jowar Malt with Milk", lunch: "Bengali Masoor Dal with Rice", snack: "Roasted Bengal Gram with Onion", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Banana Ragi Pancake", lunch: "Bharli Vangi with Bhakri", snack: "Roasted Mung Beans", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Saturday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Raw Banana Masala with Rice", snack: "Roasted Green Gram", dinner: "Radish Roti with Dal" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Kerala Prawn Coconut Pepper Fry with Red", snack: "Roasted Corn Peanut Mix", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 27 | normal | plan2
  {
    age: 27, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Pancake", lunch: "Sprouted Moong Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Akki Rotti with Curd" },
      { day: "Tuesday", breakfast: "Millet Vegetable Pancake", lunch: "Cluster Beans Dal Curry with Roti", snack: "Guava Jaggery Bowl", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Andhra Chicken Peanut Fry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Mixed Dal Adai with Curd" },
      { day: "Thursday", breakfast: "Drumstick Leaves Adai", lunch: "Chayote Dal Curry with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Stuffed Brinjal with Roti" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Green Gram Masala with Roti", snack: "Cowpea Sundal", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Banana Jowar Pancake", lunch: "Potato Peas Curry with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Vegetable Rice Sevai", lunch: "North Indian Chicken Mangalorean Fry", snack: "Curd Roasted Chana Bowl", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 27 | normal | plan3
  {
    age: 27, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Urad Dal Cheela", lunch: "Green Gram Masala with Rice", snack: "Jowar Malt Drink", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Tuesday", breakfast: "Vegetable Adai", lunch: "Green Peas Usal with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Moong Dal Handvo" },
      { day: "Wednesday", breakfast: "Rava Kichadi with Peanuts", lunch: "North Indian Chicken Curry Leaf Lemon Fry", snack: "Roasted Black Chana with Lemon", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Thursday", breakfast: "Bottle Gourd Handvo", lunch: "Peas Potato Curry with Roti", snack: "Boiled Chana Chaat with Onion", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Methi Besan Cheela", lunch: "Drumstick Leaves Curry with Rice", snack: "Sattu Buttermilk", dinner: "Palak Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "White Peas Masala with Roti", snack: "Ragi Banana Balls", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Andhra Chicken Garlic Fry with Roti - 120", snack: "Sesame Chikki", dinner: "Yam Pepper Curry with Roti" }
    ]
  },
  // Age 27 | normal | plan4
  {
    age: 27, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Mixed Dal Adai", lunch: "Broad Beans Masala with Roti", snack: "Homemade Banana Shake", dinner: "Sattu Cheela with Curd" },
      { day: "Tuesday", breakfast: "Mixed Dal Cheela", lunch: "Dal with Drumstick Leaves", snack: "Boiled Groundnut Salad", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Wednesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "South Indian Chicken Andhra Fry - 90-100", snack: "Corn Peanut Sundal", dinner: "Palak Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Kala Vatana Usal with Rice", snack: "Puffed Rice Chana Mixture", dinner: "White Pea Curry with Phulka" },
      { day: "Friday", breakfast: "Khaman Dhokla", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Homemade Peanut Bar", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Saturday", breakfast: "Ammini Kozhukattai", lunch: "Broad Beans Dal Curry with Rice", snack: "Puffed Rice Chikki", dinner: "Chana Dal Roti with Curd" },
      { day: "Sunday", breakfast: "Sattu Cheela", lunch: "Andhra Chicken Mustard Fry with Roti", snack: "Banana Sattu Shake", dinner: "Bajra Ambli with Curd" }
    ]
  },
  // Age 27 | overweight | plan1
  {
    age: 27, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Vegetable Muthia", lunch: "Carrot Chana Curry with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Methi Handvo with Chutney" },
      { day: "Tuesday", breakfast: "Moong Dal Paniyaram", lunch: "Stuffed Brinjal with Rice", snack: "Jowar Chikki", dinner: "Jowar Ambli with Roti" },
      { day: "Wednesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Fish Coconut Pepper Curry", snack: "Raw Banana Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Methi Muthia", lunch: "Dill Leaves Curry with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Friday", breakfast: "Onion Missi Roti", lunch: "Kala Vatana Usal with Roti", snack: "Peanut Sundal", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Chana Dal Cheela", lunch: "Matki Usal with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Jowar Muthia with Dal" },
      { day: "Sunday", breakfast: "Dudhi Muthia", lunch: "Prawn Lemon Pepper Fry", snack: "Banana Lassi", dinner: "Millet Vegetable Pancake with Curd" }
    ]
  },
  // Age 27 | overweight | plan2
  {
    age: 27, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Cauliflower Dal Curry with Roti", snack: "Murmura Peanut Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Andhra Mudda Pappu with Rice", snack: "Horse Gram Sundal", dinner: "Methi Akki Rotti" },
      { day: "Wednesday", breakfast: "Jowar Ambli", lunch: "North Indian Chicken Telangana Pepper", snack: "Roasted Rice Flake Mixture", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Chana Dal Roti", lunch: "Masoor Dal with Dill Leaves", snack: "Homemade Jowar Savoury Balls", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Moong Dal Roti", lunch: "Amaranth Dal with Roti", snack: "Ragi Peanut Chikki", dinner: "Methi Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Ragi Malt with Jaggery", lunch: "Dal with Fenugreek Leaves", snack: "Peanut Poha Chivda", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Sattu Vegetable Pancake", lunch: "North Indian Chicken Tomato Pepper Fry", snack: "Green Gram Sundal", dinner: "Methi Besan Cheela with Curd" }
    ]
  },
  // Age 27 | overweight | plan3
  {
    age: 27, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bajra Malt with Jaggery", lunch: "Spinach Corn Curry with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Black-Eyed Pea Curry with Rice", snack: "Cowpea Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Andhra Chicken Mustard Fry with Rice", snack: "Ragi Peanut Ladoo", dinner: "Vegetable Adai with Curd" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Sattu Curry with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Methi Muthia with Dal" },
      { day: "Friday", breakfast: "Ragi Ambli with Jaggery", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Bajra Malt Drink", dinner: "Jowar Kanji with Dal" },
      { day: "Saturday", breakfast: "Onion Paniyaram", lunch: "Raw Banana Masala with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "South Indian Chicken Tawa Curry Leaf Fry", snack: "Plain Homemade Lassi", dinner: "Cabbage Chana Dal Curry with Roti" }
    ]
  },
  // Age 27 | overweight | plan4
  {
    age: 27, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Green Peas Muthia", lunch: "Chayote Moong Curry with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Ragi Ambli with Roti" },
      { day: "Tuesday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Peas Potato Curry with Rice", snack: "Banana Ragi Balls", dinner: "Jowar Rotti with Dal" },
      { day: "Wednesday", breakfast: "Peanut Banana Bowl", lunch: "South Indian Chicken Jeera Fry", snack: "Papaya Peanut Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Thursday", breakfast: "Vegetable Handvo", lunch: "Methi Peas Curry with Roti", snack: "Roasted Chana Chikki", dinner: "Rava Vegetable Kichadi" },
      { day: "Friday", breakfast: "Jowar Methi Roti", lunch: "Lobia Curry with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Onion Adai", lunch: "Dal with Carrot and Beans", snack: "Roasted Peanuts with Curry Leaves", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "Chicken Sesame Fry", snack: "Boiled Corn with Lemon", dinner: "Black-Eyed Pea Curry with Roti" }
    ]
  },
  // Age 28 | underweight | plan1
  {
    age: 28, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Guava Curd Bowl", lunch: "Black-Eyed Pea Curry with Rice", snack: "Roasted Cowpeas", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "Lobia Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Sattu Curry with Phulka" },
      { day: "Wednesday", breakfast: "Methi Akki Rotti", lunch: "Chicken Coconut Ginger Roast", snack: "Murmura Onion Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Chana Dal with Spinach", snack: "Boiled Yam Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Friday", breakfast: "Bajra Malt with Jaggery", lunch: "Sattu Curry with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Saturday", breakfast: "Drumstick Leaves Adai", lunch: "Matki Usal with Rice", snack: "Homemade Peanut Bar", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "North Indian Chicken Masala Fry", snack: "Plain Homemade Lassi", dinner: "Jowar Malt with Vegetable Curry" }
    ]
  },
  // Age 28 | underweight | plan2
  {
    age: 28, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Onion Adai", lunch: "White Peas Curry with Rice", snack: "Roasted Green Gram", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Chayote Moong Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Wednesday", breakfast: "Methi Adai", lunch: "Prawn Lemon Pepper Fry with Rice", snack: "Boiled Groundnut Salad", dinner: "Onion Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "Tindora Peanut Curry with Rice", snack: "Poha Jaggery Ladoo", dinner: "Stuffed Bhindi with Roti" },
      { day: "Friday", breakfast: "Sattu Vegetable Pancake", lunch: "Kala Vatana Usal with Roti", snack: "White Peas Sundal", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Saturday", breakfast: "Urad Dal Cheela", lunch: "Raw Banana Masala with Roti", snack: "Peanut Poha Chivda", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Rava Kichadi with Peanuts", lunch: "North Indian Chicken Onion Fry", snack: "Homemade Poha Chivda", dinner: "Cowpea Curry with Ragi Roti" }
    ]
  },
  // Age 28 | underweight | plan3
  {
    age: 28, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Cauliflower Peas Masala with Rice", snack: "Rice Kanji Drink", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Vegetable Paniyaram", lunch: "Raw Mango Dal with Rice", snack: "Boiled Corn with Lemon", dinner: "Bajra Rotti with Dal" },
      { day: "Wednesday", breakfast: "Moong Dal Dhokla", lunch: "Andhra Prawn Coriander Fry", snack: "Sattu Jaggery Balls", dinner: "Rice Kanji with Dal" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Murmura Peanut Chaat", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Ragi Sevai Upma", lunch: "Dal with Amaranth Leaves", snack: "Curd Roasted Chana Bowl", dinner: "Green Peas Usal with Chapati" },
      { day: "Saturday", breakfast: "Ragi Paniyaram", lunch: "Brinjal Peanut Curry with Rice", snack: "Homemade Murmura Chaat", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Chicken Dry Green Masala Roast", snack: "Roasted Mung Beans", dinner: "Mixed Dal Cheela with Curd" }
    ]
  },
  // Age 28 | underweight | plan4
  {
    age: 28, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sattu Roti with Curd", lunch: "White Peas Masala with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Methi Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Sattu Cheela", lunch: "Drumstick Leaves Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Roti", lunch: "South Indian Chicken Andhra Pepper Roast", snack: "White Pea Chaat", dinner: "Methi Muthia with Dal" },
      { day: "Thursday", breakfast: "Palak Besan Cheela", lunch: "Stuffed Brinjal with Roti", snack: "Green Gram Sundal", dinner: "Methi Handvo with Chutney" },
      { day: "Friday", breakfast: "Mixed Dal Adai", lunch: "Chana Usal with Bhakri", snack: "Banana Jaggery Milk", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Onion Paniyaram", lunch: "Potato Peas Curry with Rice", snack: "Peanut Chikki", dinner: "Palak Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Millet Vegetable Pancake", lunch: "Andhra Chicken Lemon Herb Roast", snack: "Puffed Rice Peanut Mixture", dinner: "Lobia Curry with Roti" }
    ]
  },
  // Age 28 | normal | plan1
  {
    age: 28, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Dal with Drumstick Leaves", snack: "Sesame Jaggery Ladoo", dinner: "Methi Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Palak Dhokla", lunch: "Moong Dal with Spinach", snack: "Cowpea Chaat", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Telangana Chicken Garlic Fry with Rice", snack: "Banana Lassi", dinner: "Besan Dhokla with Curd" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Carrot Chana Curry with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Cowpea Masala with Roti", snack: "Murmura Black Chana Chaat", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "Methi Peas Curry with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Chana Dal Roti with Curd" },
      { day: "Sunday", breakfast: "Banana with Roasted Peanuts", lunch: "Andhra Chicken Tawa Curry Leaf Fry with", snack: "Dry Roasted Corn", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 28 | normal | plan2
  {
    age: 28, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Carrot Peas Masala with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Peanut Banana Bowl", lunch: "Sweet Potato Peas Curry with Roti", snack: "Banana Ragi Balls", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Bajra Ambli", lunch: "Telangana Chicken Tomato Pepper Fry with", snack: "Ragi Peanut Chikki", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Dosakaya Pappu with Rice", snack: "Bajra Malt Drink", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Palak Missi Roti", lunch: "Moong Dal with Carrot", snack: "Jowar Puffed Grain Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Saturday", breakfast: "Methi Muthia", lunch: "Potato Beans Curry with Rice", snack: "Horse Gram Sundal", dinner: "Jowar Rotti with Dal" },
      { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "Chicken Garlic Coriander Roast", snack: "Green Gram Chaat", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 28 | normal | plan3
  {
    age: 28, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Missi Roti", lunch: "Cauliflower Dal Curry with Roti", snack: "Roasted Chana Chikki", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Tuesday", breakfast: "Chana Dal Roti", lunch: "Dal with Carrot and Beans", snack: "Ragi Buttermilk", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Ragi Malt with Jaggery", lunch: "North Indian Chicken Coconut Fry", snack: "Guava Jaggery Bowl", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Aval Upma with Peanuts", lunch: "Green Gram Masala with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Friday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Stuffed Brinjal with Rice", snack: "Ragi Peanut Ladoo", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Leftover Rice Paniyaram", lunch: "Yam Masala with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Vegetable Adai with Curd" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Kerala Prawn Coconut Pepper Fry with Red", snack: "Homemade Jowar Savoury Balls", dinner: "Vegetable Handvo with Curd" }
    ]
  },
  // Age 28 | normal | plan4
  {
    age: 28, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Green Peas Muthia", lunch: "Green Peas Usal with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Tuesday", breakfast: "Onion Besan Cheela", lunch: "Amaranth Leaves Curry with Rice", snack: "Banana Sesame Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Vegetable Rice Sevai", lunch: "Fish Jeera Fry", snack: "Puffed Rice Chana Mixture", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Ragi Ambli with Jaggery", lunch: "Potato Beans Curry with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Friday", breakfast: "Vegetable Adai", lunch: "Methi Corn Curry with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Sweet Potato Roti with Curd" },
      { day: "Saturday", breakfast: "Vegetable Muthia", lunch: "Sweet Potato Peas Curry with Rice", snack: "Puffed Rice Chikki", dinner: "Jowar Muthia with Dal" },
      { day: "Sunday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Fish Tamarind Curry", snack: "Curd Peanut Bowl", dinner: "Radish Roti with Dal" }
    ]
  },
  // Age 28 | overweight | plan1
  {
    age: 28, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Muthia", lunch: "Dill Leaves Dal with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Methi Adai with Curd" },
      { day: "Tuesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Beerakaya Pappu with Rice", snack: "Curry Leaf Buttermilk", dinner: "Beetroot Masala with Roti" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Fish Gongura Curry with Red Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Tindora Sesame Curry with Roti", snack: "Raw Banana Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Friday", breakfast: "Methi Besan Cheela", lunch: "Raw Banana Masala with Rice", snack: "Roasted Sweet Corn", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Peas Potato Curry with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Chana Dal Cheela", lunch: "Chicken Peanut Pepper Roast", snack: "Ginger Buttermilk", dinner: "Carrot Muthia with Dal" }
    ]
  },
  // Age 28 | overweight | plan2
  {
    age: 28, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "Dal with Fenugreek Leaves", snack: "Sesame Chikki", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Ragi Thalipeeth", lunch: "Brinjal Dal Curry with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Wednesday", breakfast: "Papaya Curd Bowl", lunch: "North Indian Chicken Dry Ginger Roast", snack: "Roasted Peanut Jaggery Mix", dinner: "Palak Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Rava Paniyaram", lunch: "Masoor Dal with Dill Leaves", snack: "Ragi Banana Balls", dinner: "Yam Pepper Curry with Roti" },
      { day: "Friday", breakfast: "Ragi Rotti with Chutney", lunch: "Carrot Moong Curry with Roti", snack: "Beetroot Peanut Chaat", dinner: "Raw Banana Masala with Phulka" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Potato Methi Curry with Roti", snack: "Black Chana Sundal", dinner: "Matki Usal with Bhakri" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Andhra Chicken Pepper Onion Roast - 120", snack: "Peanut Sundal", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 28 | overweight | plan3
  {
    age: 28, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Kozhukattai", lunch: "Drumstick Leaves Dal with Roti", snack: "Guava Peanut Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Chana Dal with Ridge Gourd", snack: "Lobia Chaat", dinner: "Mixed Dal Adai with Curd" },
      { day: "Wednesday", breakfast: "Jowar Thalipeeth", lunch: "Chicken Lemon Fry", snack: "Corn Peanut Sundal", dinner: "Jowar Kanji with Dal" },
      { day: "Thursday", breakfast: "Jowar Vegetable Pancake", lunch: "Carrot Peas Masala with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Friday", breakfast: "Banana Ragi Pancake", lunch: "Broad Beans Masala with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Jowar Ambli", lunch: "Sprouted Moong Curry with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Aval Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Ragi Banana Malt", lunch: "Chicken Onion Fry", snack: "Sweet Potato Sesame Balls", dinner: "Sattu Cheela with Curd" }
    ]
  },
  // Age 28 | overweight | plan4
  {
    age: 28, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Onion Missi Roti", lunch: "Moong Dal with Sweet Potato", snack: "Roasted Gram Balls", dinner: "Chayote Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Khaman Dhokla", lunch: "Maharashtrian Amti with Rice", snack: "Roasted Chana Ladoo", dinner: "Ragi Rotti with Curd" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Roti", lunch: "Chicken Malabar Fry", snack: "Homemade Banana Shake", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Bottle Gourd Handvo", lunch: "Gongura Pappu with Rice", snack: "Banana Ragi Shake", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Bajra Methi Roti", lunch: "Brinjal Coconut Curry with Rice", snack: "Banana Sattu Shake", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Dudhi Muthia", lunch: "Kala Vatana Usal with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Vegetable Muthia with Curd" },
      { day: "Sunday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Chicken Green Pepper Roast with Rice", snack: "Carrot Peanut Chaat", dinner: "Ragi Thalipeeth with Dal" }
    ]
  },
  // Age 29 | underweight | plan1
  {
    age: 29, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Stuffed Tindora with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Amaranth Dal with Roti", snack: "Green Gram Chaat", dinner: "Lemon Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Green Peas Muthia", lunch: "Chicken Tawa Coriander Fry", snack: "Sesame Jaggery Ladoo", dinner: "Onion Adai with Chutney" },
      { day: "Thursday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Chayote Dal Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Methi Adai with Curd" },
      { day: "Friday", breakfast: "Bajra Rotti with Curd", lunch: "Toor Dal with Raw Banana", snack: "Black Chana Sundal", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Saturday", breakfast: "Carrot Besan Cheela", lunch: "Sprouted Moong Curry with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Lobia Curry with Roti" },
      { day: "Sunday", breakfast: "Jowar Muthia", lunch: "Andhra Chicken Garlic Pepper Fry", snack: "Sattu Buttermilk", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 29 | underweight | plan2
  {
    age: 29, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Carrot Chana Curry with Rice", snack: "Mint Buttermilk", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Paniyaram", lunch: "Chayote Moong Curry with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Chicken Tomato Pepper Fry", snack: "Rice Kanji Drink", dinner: "Bajra Ambli with Curd" },
      { day: "Thursday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Moong Dal with Spinach", snack: "Poha Jaggery Ladoo", dinner: "Mixed Dal Adai with Curd" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Gujarati Dal with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Bajra Rotti with Dal" },
      { day: "Saturday", breakfast: "Bajra Methi Roti", lunch: "Broad Beans Masala with Rice", snack: "Bajra Malt Drink", dinner: "Sattu Roti with Dal" },
      { day: "Sunday", breakfast: "Banana Jowar Pancake", lunch: "North Indian Chicken Dry Coriander Roast", snack: "White Peas Sundal", dinner: "Kala Vatana Usal with Roti" }
    ]
  },
  // Age 29 | underweight | plan3
  {
    age: 29, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Dudhi Muthia", lunch: "Andhra Mudda Pappu with Rice", snack: "Homemade Corn Chivda", dinner: "Onion Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Carrot Roti with Curd", lunch: "Bengali Masoor Dal with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Andhra Chicken Curry Leaf Fry with Roti", snack: "Green Gram Sundal", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Methi Muthia", lunch: "Cabbage Moong Curry with Roti", snack: "Ragi Peanut Chikki", dinner: "Chana Usal with Bhakri" },
      { day: "Friday", breakfast: "Ragi Sevai Upma", lunch: "Spinach Corn Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Ragi Ambli with Roti" },
      { day: "Saturday", breakfast: "Mixed Dal Adai", lunch: "Broad Beans Masala with Roti", snack: "Boiled Peanut Chaat", dinner: "Sweet Potato Roti with Curd" },
      { day: "Sunday", breakfast: "Ragi Ambli with Jaggery", lunch: "North Indian Chicken Gongura Roast with", snack: "Jaggery Ragi Milk", dinner: "Akki Rotti with Curd" }
    ]
  },
  // Age 29 | underweight | plan4
  {
    age: 29, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Malt with Jaggery", lunch: "Beetroot Coconut Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Handvo", lunch: "Potato Beans Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Onion Paniyaram", lunch: "South Indian Chicken Sesame Fry", snack: "Papaya Lassi", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Ragi Paniyaram", lunch: "Brinjal Coconut Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Sattu Cheela", lunch: "Sweet Potato Peas Curry with Rice", snack: "Jowar Malt Drink", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Saturday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Carrot Moong Curry with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Jowar Rotti with Dal" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Chicken Garlic Fry", snack: "Ragi Banana Balls", dinner: "Carrot Roti with Dal" }
    ]
  },
  // Age 29 | normal | plan1
  {
    age: 29, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bottle Gourd Handvo", lunch: "Dal with Drumstick Leaves", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Ragi Rotti with Curd" },
      { day: "Tuesday", breakfast: "Millet Vegetable Pancake", lunch: "Cauliflower Methi Curry with Roti", snack: "Dry Roasted Corn", dinner: "Palak Missi Roti with Curd" },
      { day: "Wednesday", breakfast: "Jowar Kanji with Curd", lunch: "Chicken Coriander Ginger Roast", snack: "Puffed Rice Peanut Mixture", dinner: "Stuffed Bhindi with Roti" },
      { day: "Thursday", breakfast: "Moong Dal Dhokla", lunch: "Peas Potato Curry with Rice", snack: "Murmura Peanut Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Friday", breakfast: "Bajra Malt with Jaggery", lunch: "Black-Eyed Pea Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Potato Beans Curry with Roti", snack: "Roasted Gram Balls", dinner: "Methi Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Vegetable Rice Sevai", lunch: "North Indian Chicken Dry Pepper Roast", snack: "Banana Lassi", dinner: "Chayote Moong Curry with Roti" }
    ]
  },
  // Age 29 | normal | plan2
  {
    age: 29, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Brinjal Peanut Curry with Rice", snack: "White Pea Chaat", dinner: "Onion Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Urad Dal Cheela", lunch: "Stuffed Brinjal with Roti", snack: "Puffed Rice Chikki", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Wednesday", breakfast: "Beetroot Roti with Curd", lunch: "Andhra Chicken Onion Fry with Rice - 150", snack: "Homemade Peanut Bar", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Chana Dal Roti", lunch: "Potato Peas Curry with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Sweet Potato Roti", lunch: "White Peas Masala with Roti", snack: "Boiled Chana Chaat with Onion", dinner: "Bharli Vangi with Bhakri" },
      { day: "Saturday", breakfast: "Drumstick Leaves Adai", lunch: "Carrot Peas Masala with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Ragi Dhokla", lunch: "Andhra Chicken Mustard Fry with Rice", snack: "Curry Leaf Buttermilk", dinner: "Sweet Potato Peas Curry with Phulka" }
    ]
  },
  // Age 29 | normal | plan3
  {
    age: 29, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Cauliflower Peas Masala with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Tuesday", breakfast: "Methi Besan Cheela", lunch: "Dal with Carrot and Beans", snack: "Boiled Yam Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Jowar Thalipeeth", lunch: "Chicken Ginger Lemon Fry with Roti - 120", snack: "Roasted Mung Beans", dinner: "Beetroot Masala with Roti" },
      { day: "Thursday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Methi Corn Curry with Rice", snack: "Cowpea Sundal", dinner: "Ragi Dhokla with Curd" },
      { day: "Friday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Sprouted Moong Curry with Roti", snack: "Ragi Peanut Ladoo", dinner: "Raw Banana Masala with Phulka" },
      { day: "Saturday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Methi Peas Curry with Roti", snack: "Roasted Chana Ladoo", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Sunday", breakfast: "Ajwain Missi Roti", lunch: "Chicken Mint Coriander Fry", snack: "Guava Jaggery Bowl", dinner: "Drumstick Leaves Dal with Roti" }
    ]
  },
  // Age 29 | normal | plan4
  {
    age: 29, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Roti", lunch: "Dill Leaves Curry with Roti", snack: "Roasted Cowpeas", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Jowar Vegetable Pancake", lunch: "Cabbage Carrot Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Rice Kanji with Dal" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "Chicken Coriander Pepper Fry", snack: "Papaya Coconut Bowl", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Broad Beans Dal Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Raw Banana Masala with Roti", snack: "Roasted Green Gram", dinner: "Matki Usal with Bhakri" },
      { day: "Saturday", breakfast: "Papaya Curd Bowl", lunch: "Green Gram Masala with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Sunday", breakfast: "Onion Besan Cheela", lunch: "Andhra Chicken Jeera Pepper Fry", snack: "Jowar Chikki", dinner: "Chana Dal Roti with Curd" }
    ]
  },
  // Age 29 | overweight | plan1
  {
    age: 29, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Akki Rotti", lunch: "Masoor Dal with Methi", snack: "Sattu Jaggery Balls", dinner: "Green Peas Muthia with Curd" },
      { day: "Tuesday", breakfast: "Banana with Roasted Peanuts", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Homemade Poha Chivda", dinner: "Coconut Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Pancake", lunch: "Kerala Fish Mustard Fry", snack: "Curd Banana Jaggery Bowl", dinner: "Sattu Cheela with Curd" },
      { day: "Thursday", breakfast: "Sattu Roti with Curd", lunch: "Cowpea Curry with Rice", snack: "Raw Banana Chaat", dinner: "Jowar Muthia with Dal" },
      { day: "Friday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Masoor Dal with Dill Leaves", snack: "Homemade Murmura Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Brinjal Dal Curry with Roti", snack: "Homemade Banana Shake", dinner: "Moong Dal Handvo" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "Chicken Onion Pepper Fry with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 29 | overweight | plan2
  {
    age: 29, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Onion Thalipeeth", lunch: "Green Gram Masala with Roti", snack: "Carrot Peanut Chaat", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Kala Vatana Usal with Rice", snack: "Boiled Groundnut Salad", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Andhra Prawn Green Masala Fry with Red", snack: "Ragi Buttermilk", dinner: "Sattu Curry with Phulka" },
      { day: "Thursday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Cowpea Masala with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Methi Missi Roti", lunch: "Potato Methi Curry with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Palak Missi Roti", lunch: "Maharashtrian Amti with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Methi Handvo with Chutney" },
      { day: "Sunday", breakfast: "Moong Dal Roti", lunch: "Chicken Telangana Pepper Roast", snack: "Peanut Chikki", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 29 | overweight | plan3
  {
    age: 29, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Cluster Beans Dal Curry with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Aval Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Moong Dal Paniyaram", lunch: "Amaranth Leaves Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Wednesday", breakfast: "Onion Missi Roti", lunch: "Chicken Dry Jeera Roast with Rice", snack: "Curd Peanut Bowl", dinner: "Green Peas Usal with Chapati" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Stuffed Brinjal with Rice", snack: "Jaggery Lassi", dinner: "White Pea Curry with Phulka" },
      { day: "Friday", breakfast: "Boiled Yam with Curd", lunch: "Sattu Curry with Rice", snack: "Ginger Buttermilk", dinner: "Jowar Kanji with Dal" },
      { day: "Saturday", breakfast: "Cabbage Besan Cheela", lunch: "Spinach Chana Curry with Roti", snack: "Jeera Buttermilk", dinner: "Green Peas Roti with Curd" },
      { day: "Sunday", breakfast: "Guava Curd Bowl", lunch: "Fish Methi Curry", snack: "Lobia Chaat", dinner: "Moong Dal Dhokla with Chutney" }
    ]
  },
  // Age 29 | overweight | plan4
  {
    age: 29, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "Carrot Peas Masala with Rice", snack: "Murmura Onion Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Carrot Muthia", lunch: "Moong Dal with Sweet Potato", snack: "Beetroot Peanut Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Wednesday", breakfast: "Jowar Ambli", lunch: "South Indian Chicken Mint Pepper Roast", snack: "Banana Ragi Shake", dinner: "Jowar Ambli with Roti" },
      { day: "Thursday", breakfast: "Vegetable Adai", lunch: "Drumstick Leaves Curry with Rice", snack: "Banana Ragi Balls", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Rava Kichadi with Peanuts", lunch: "Yam Masala with Roti", snack: "Banana Sesame Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Onion Adai", lunch: "Green Peas Usal with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Sunday", breakfast: "Jowar Methi Roti", lunch: "Telangana Chicken Pudina Fry with Rice", snack: "Sesame Chikki", dinner: "Broad Beans Dal Curry with Phulka" }
    ]
  },
  // Age 30 | underweight | plan1
  {
    age: 30, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Stuffed Brinjal with Rice", snack: "Jaggery Lassi", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "Gongura Pappu with Rice", snack: "Banana Jaggery Bowl", dinner: "Radish Roti with Dal" },
      { day: "Wednesday", breakfast: "Jowar Malt with Milk", lunch: "Andhra Chicken Dry Green Masala Roast", snack: "Roasted Chana Jaggery Mix", dinner: "Jowar Rotti with Dal" },
      { day: "Thursday", breakfast: "Green Peas Muthia", lunch: "Matki Usal with Bhakri", snack: "Murmura Onion Chaat", dinner: "Rice Kanji with Dal" },
      { day: "Friday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Peas Potato Curry with Rice", snack: "Curd Peanut Bowl", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Methi Adai", lunch: "Bharli Vangi with Bhakri", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Methi Muthia with Dal" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Kerala Prawn Tamarind Curry", snack: "Ragi Jaggery Ladoo", dinner: "Onion Besan Cheela with Curd" }
    ]
  },
  // Age 30 | underweight | plan2
  {
    age: 30, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Roti", lunch: "Sprouted Moong Curry with Roti", snack: "Roasted Chana Ladoo", dinner: "Chana Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Methi Muthia", lunch: "Cowpea Curry with Rice", snack: "Poha Jaggery Ladoo", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Wednesday", breakfast: "Chana Dal Cheela", lunch: "Chicken Mint Coriander Fry", snack: "Puffed Rice Chikki", dinner: "Kala Vatana Usal with Roti" },
      { day: "Thursday", breakfast: "Jowar Kanji with Curd", lunch: "Cauliflower Dal Curry with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Vegetable Handvo", lunch: "Peas Potato Curry with Roti", snack: "Roasted Chana Chikki", dinner: "Besan Dhokla with Curd" },
      { day: "Saturday", breakfast: "Ragi Banana Malt", lunch: "Potato Methi Curry with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Sunday", breakfast: "Onion Missi Roti", lunch: "South Indian Chicken Sukka with Roti", snack: "Beetroot Peanut Chaat", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 30 | underweight | plan3
  {
    age: 30, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Cabbage Besan Cheela", lunch: "Lobia Curry with Roti", snack: "Roasted Cowpeas", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Adai", lunch: "Tindora Sesame Curry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Ragi Sevai Upma", lunch: "Kerala Prawn Andhra Pepper Fry - 90-100", snack: "Puffed Rice Peanut Mixture", dinner: "Raw Banana Masala with Phulka" },
      { day: "Thursday", breakfast: "Ragi Vegetable Pancake", lunch: "Dal with Carrot and Beans", snack: "Black Chana Sundal", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Friday", breakfast: "Guava Curd Bowl", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Papaya Lassi", dinner: "Stuffed Brinjal with Roti" },
      { day: "Saturday", breakfast: "Ragi Malt with Jaggery", lunch: "Masoor Dal with Methi", snack: "Boiled Groundnut Salad", dinner: "Carrot Roti with Dal" },
      { day: "Sunday", breakfast: "Jowar Ambli", lunch: "Fish Coriander Fry", snack: "Ragi Banana Balls", dinner: "Sattu Curry with Phulka" }
    ]
  },
  // Age 30 | underweight | plan4
  {
    age: 30, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Chana Dal Roti", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Jowar Ambli with Roti" },
      { day: "Tuesday", breakfast: "Radish Roti with Curd", lunch: "Cauliflower Methi Curry with Roti", snack: "Curry Leaf Buttermilk", dinner: "Ragi Rotti with Curd" },
      { day: "Wednesday", breakfast: "Ragi Dhokla", lunch: "Chicken Masala Fry", snack: "Roasted Green Gram", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Millet Vegetable Pancake", lunch: "Amaranth Dal with Roti", snack: "Banana Sattu Shake", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Toor Dal with Raw Banana", snack: "Sattu Buttermilk", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Cabbage Moong Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Sunday", breakfast: "Sattu Vegetable Pancake", lunch: "North Indian Chicken Tawa Pepper Roast", snack: "Boiled Corn with Lemon", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 30 | normal | plan1
  {
    age: 30, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Carrot Peas Masala with Roti", snack: "Boiled Yam Chaat", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Palak Dhokla", lunch: "Methi Corn Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Stuffed Tindora with Roti" },
      { day: "Wednesday", breakfast: "Rava Kichadi with Peanuts", lunch: "South Indian Chicken Jeera Pepper Fry", snack: "Cowpea Sundal", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Thursday", breakfast: "Methi Akki Rotti", lunch: "Chana Dal with Ridge Gourd", snack: "Homemade Murmura Chaat", dinner: "Akki Rotti with Curd" },
      { day: "Friday", breakfast: "Lemon Sevai with Peanuts", lunch: "Chayote Dal Curry with Roti", snack: "Cowpea Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Saturday", breakfast: "Vegetable Rice Sevai", lunch: "Dal with Drumstick Leaves", snack: "Roasted Mung Beans", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "North Indian Chicken Sukka", snack: "Black Chana Chaat with Lemon", dinner: "Ragi Ambli with Roti" }
    ]
  },
  // Age 30 | normal | plan2
  {
    age: 30, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Rotti with Chutney", lunch: "Yam Masala with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Leftover Rice Paniyaram", lunch: "Bengali Masoor Dal with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Methi Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Moong Dal Paniyaram", lunch: "North Indian Chicken Gongura Roast with", snack: "Guava Peanut Chaat", dinner: "Coconut Sevai with Peanuts" },
      { day: "Thursday", breakfast: "Ragi Paniyaram", lunch: "White Peas Curry with Rice", snack: "Peanut Chikki", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Dal with Amaranth Leaves", snack: "Ragi Peanut Chikki", dinner: "Bajra Ambli with Curd" },
      { day: "Saturday", breakfast: "Banana Jowar Pancake", lunch: "Carrot Moong Curry with Roti", snack: "Plain Homemade Lassi", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Sunday", breakfast: "Methi Thalipeeth", lunch: "Andhra Chicken Ginger Coriander Roast", snack: "Puffed Rice Chana Mixture", dinner: "Jowar Thalipeeth with Dal" }
    ]
  },
  // Age 30 | normal | plan3
  {
    age: 30, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Mixed Dal Cheela", lunch: "Beerakaya Pappu with Rice", snack: "Green Gram Sundal", dinner: "Ragi Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Ajwain Missi Roti", lunch: "Dosakaya Pappu with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Vegetable Muthia with Curd" },
      { day: "Wednesday", breakfast: "Sattu Cheela", lunch: "Chicken Drumstick Leaf Fry", snack: "Jowar Puffed Grain Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Thursday", breakfast: "Banana Ragi Pancake", lunch: "Tindora Peanut Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "White Peas Masala with Roti", snack: "Banana Ragi Balls", dinner: "Green Peas Muthia with Curd" },
      { day: "Saturday", breakfast: "Bajra Methi Roti", lunch: "Brinjal Coconut Curry with Rice", snack: "Murmura Peanut Chaat", dinner: "Bajra Rotti with Dal" },
      { day: "Sunday", breakfast: "Onion Paniyaram", lunch: "North Indian Chicken Dry Pepper Roast", snack: "Mint Buttermilk", dinner: "Khaman Dhokla with Curd" }
    ]
  },
  // Age 30 | normal | plan4
  {
    age: 30, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Chayote Moong Curry with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Stuffed Bhindi with Roti" },
      { day: "Tuesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Broad Beans Masala with Roti", snack: "Homemade Peanut Bar", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "North Indian Chicken Jeera Fry", snack: "Sattu Jaggery Balls", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Masoor Dal with Dill Leaves", snack: "Roasted Sweet Corn", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Brinjal Dal Curry with Roti", snack: "Guava Jaggery Bowl", dinner: "Methi Adai with Curd" },
      { day: "Saturday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Spinach Corn Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Sunday", breakfast: "Mixed Dal Adai", lunch: "Andhra Fish Coconut Garlic Curry with Red", snack: "Peanut Jaggery Ladoo", dinner: "Methi Handvo with Chutney" }
    ]
  },
  // Age 30 | overweight | plan1
  {
    age: 30, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Moong Dal Roti", lunch: "Raw Mango Dal with Rice", snack: "Rice Kanji Drink", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Kala Vatana Usal with Rice", snack: "Jeera Buttermilk", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Carrot Muthia", lunch: "North Indian Chicken Dhaba Fry", snack: "Raw Banana Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Lobia Curry with Rice", snack: "Jowar Malt Drink", dinner: "Aval Vegetable Kichadi" },
      { day: "Friday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Dill Leaves Curry with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Saturday", breakfast: "Drumstick Leaves Adai", lunch: "Moong Dal with Carrot", snack: "Carrot Peanut Chaat", dinner: "Chana Dal Roti with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Handvo", lunch: "Telangana Chicken Peanut Fry", snack: "Boiled Peanut Chaat", dinner: "Mixed Dal Adai with Curd" }
    ]
  },
  // Age 30 | overweight | plan2
  {
    age: 30, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Masoor Dal Cheela", lunch: "Chana Dal with Spinach", snack: "White Pea Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Carrot Roti with Curd", lunch: "Sweet Potato Peas Curry with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Vegetable Adai with Curd" },
      { day: "Wednesday", breakfast: "Sattu Roti with Curd", lunch: "Telangana Chicken Malabar Fry", snack: "Dry Roasted Corn", dinner: "Palak Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Jowar Vegetable Pancake", lunch: "Dal with Fenugreek Leaves", snack: "Ginger Buttermilk", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Urad Dal Cheela", lunch: "Gujarati Dal with Rice", snack: "Ragi Peanut Ladoo", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Bajra Malt with Jaggery", lunch: "Beetroot Coconut Curry with Rice", snack: "White Peas Sundal", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Sunday", breakfast: "Besan Dhokla", lunch: "Chicken Coriander Fry", snack: "Homemade Ragi Savoury Balls", dinner: "White Pea Curry with Phulka" }
    ]
  },
  // Age 30 | overweight | plan3
  {
    age: 30, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Carrot Peas Masala with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "Maharashtrian Amti with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Wednesday", breakfast: "Methi Handvo", lunch: "South Indian Chicken Curry Leaf Fry", snack: "Peanut Poha Chivda", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Vegetable Muthia", lunch: "Sprouted Moong Curry with Rice", snack: "Banana Sesame Chaat", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Black-Eyed Pea Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Saturday", breakfast: "Bajra Ambli", lunch: "Methi Peas Curry with Roti", snack: "Homemade Poha Chivda", dinner: "Rava Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Bengali Fish Methi Curry", snack: "Lobia Chaat", dinner: "Millet Vegetable Pancake with Curd" }
    ]
  },
  // Age 30 | overweight | plan4
  {
    age: 30, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Vegetable Paniyaram", lunch: "Sattu Curry with Roti", snack: "Bajra Malt Drink", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Sattu Curry with Rice", snack: "Peanut Sundal", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "Chicken Dry Curry Leaf Roast", snack: "Ragi Buttermilk", dinner: "Sattu Cheela with Curd" },
      { day: "Thursday", breakfast: "Methi Missi Roti", lunch: "Sweet Potato Peas Curry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Friday", breakfast: "Ammini Kozhukattai", lunch: "Beetroot Masala with Roti", snack: "Banana Ragi Shake", dinner: "Beetroot Roti with Curd" },
      { day: "Saturday", breakfast: "Vegetable Thalipeeth", lunch: "Green Peas Usal with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "Jowar Muthia with Dal" },
      { day: "Sunday", breakfast: "Ragi Thalipeeth", lunch: "Andhra Chicken Mangalorean Fry", snack: "Roasted Gram Balls", dinner: "Chana Dal Cheela with Chutney" }
    ]
  },
  // Age 31 | underweight | plan1
  {
    age: 31, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Beetroot Masala with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Radish Roti with Dal" },
      { day: "Tuesday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Stuffed Tindora with Roti", snack: "Banana Jaggery Milk", dinner: "Aval Vegetable Kichadi" },
      { day: "Wednesday", breakfast: "Ragi Paniyaram", lunch: "Chicken Sesame Fry", snack: "Ginger Buttermilk", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Kala Vatana Usal with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Vegetable Adai with Curd" },
      { day: "Friday", breakfast: "Sweet Potato Roti", lunch: "Broad Beans Masala with Roti", snack: "Dry Roasted Corn", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Dill Leaves Curry with Roti", snack: "Roasted Chana Chikki", dinner: "Sattu Curry with Phulka" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "North Indian Chicken Mustard Pepper", snack: "Coconut Jaggery Ladoo", dinner: "Ammini Kozhukattai with Vegetables" }
    ]
  },
  // Age 31 | underweight | plan2
  {
    age: 31, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Chana Dal with Spinach", snack: "Roasted Bengal Gram with Onion", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Stuffed Brinjal with Rice", snack: "Boiled Corn with Lemon", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Malt with Jaggery", lunch: "Chicken Dhaba Fry", snack: "Cucumber Roasted Chana Chaat", dinner: "Jowar Muthia with Dal" },
      { day: "Thursday", breakfast: "Methi Missi Roti", lunch: "Yam Masala with Roti", snack: "Murmura Onion Chaat", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Methi Thalipeeth", lunch: "Moong Dal with Spinach", snack: "Cowpea Sundal", dinner: "Stuffed Bhindi with Roti" },
      { day: "Saturday", breakfast: "Banana Jowar Pancake", lunch: "Masoor Dal with Methi", snack: "Lobia Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Dhokla", lunch: "Chicken Malabar Fry", snack: "Green Gram Chaat", dinner: "Vegetable Sevai with Chana Dal" }
    ]
  },
  // Age 31 | underweight | plan3
  {
    age: 31, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Cabbage Besan Cheela", lunch: "Sprouted Moong Curry with Rice", snack: "Bajra Malt Drink", dinner: "Rice Kanji with Dal" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Bengali Masoor Dal with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Kala Vatana Usal with Roti" },
      { day: "Wednesday", breakfast: "Peanut Banana Bowl", lunch: "Kerala Fish Andhra Pepper Fry", snack: "Black-Eyed Pea Sundal", dinner: "Khaman Dhokla with Curd" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Carrot Peas Masala with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Bajra Ambli with Curd" },
      { day: "Friday", breakfast: "Bottle Gourd Handvo", lunch: "Bharli Vangi with Bhakri", snack: "Sesame Jaggery Ladoo", dinner: "Jowar Kanji with Dal" },
      { day: "Saturday", breakfast: "Vegetable Adai", lunch: "Raw Banana Masala with Roti", snack: "Jeera Buttermilk", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Telangana Chicken Red Pepper Roast", snack: "Banana Ragi Shake", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 31 | underweight | plan4
  {
    age: 31, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Methi Adai", lunch: "Beetroot Coconut Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Tuesday", breakfast: "Palak Missi Roti", lunch: "Raw Mango Dal with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "South Indian Chicken Dry Methi Roast with", snack: "Boiled Yam Chaat", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Thursday", breakfast: "Jowar Muthia", lunch: "Cowpea Masala with Roti", snack: "Jaggery Lassi", dinner: "Yam Pepper Curry with Roti" },
      { day: "Friday", breakfast: "Bajra Ambli", lunch: "Dill Leaves Dal with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Onion Thalipeeth", lunch: "Beerakaya Pappu with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "North Indian Chicken Fenugreek Fry", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Bajra Rotti with Dal" }
    ]
  },
  // Age 31 | normal | plan1
  {
    age: 31, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Lemon Sevai with Peanuts", lunch: "Moong Dal with Carrot", snack: "Curd Banana Jaggery Bowl", dinner: "Chana Dal Roti with Curd" },
      { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "Gujarati Dal with Rice", snack: "Murmura Peanut Chaat", dinner: "Methi Adai with Curd" },
      { day: "Wednesday", breakfast: "Methi Akki Rotti", lunch: "Telangana Chicken Curry Leaf Garlic Roast", snack: "Sattu Buttermilk", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Chana Dal with Ridge Gourd", snack: "Curd Peanut Bowl", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Methi Peas Curry with Roti", snack: "Ragi Buttermilk", dinner: "Palak Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Jowar Vegetable Pancake", lunch: "Dal with Fenugreek Leaves", snack: "Roasted Chana Ladoo", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Carrot Muthia", lunch: "Kerala Fish Mangalorean Curry with Red", snack: "Jaggery Ragi Milk", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 31 | normal | plan2
  {
    age: 31, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Brinjal Dal Curry with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Onion Missi Roti", lunch: "Brinjal Coconut Curry with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Akki Rotti with Curd" },
      { day: "Wednesday", breakfast: "Ragi Sevai Upma", lunch: "Prawn Lemon Pepper Fry with Rice", snack: "Peanut Chikki", dinner: "Matki Usal with Bhakri" },
      { day: "Thursday", breakfast: "Onion Besan Cheela", lunch: "Green Peas Usal with Roti", snack: "Sesame Chikki", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Friday", breakfast: "Ragi Vegetable Roti", lunch: "Moong Dal with Sweet Potato", snack: "Murmura Black Chana Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Saturday", breakfast: "Urad Dal Cheela", lunch: "White Peas Curry with Rice", snack: "Sattu Jaggery Balls", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Jowar Thalipeeth", lunch: "South Indian Chicken Konkan Fry", snack: "Boiled Groundnut Salad", dinner: "Ragi Ambli with Roti" }
    ]
  },
  // Age 31 | normal | plan3
  {
    age: 31, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Cowpea Curry with Rice", snack: "Poha Jaggery Ladoo", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Tuesday", breakfast: "Bajra Thalipeeth", lunch: "Cabbage Carrot Curry with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Chicken Garlic Lemon Fry with Roti - 150", snack: "Homemade Peanut Bar", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Thursday", breakfast: "Onion Paniyaram", lunch: "Black-Eyed Pea Curry with Roti", snack: "Jowar Chikki", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Toor Dal with Raw Banana", snack: "White Peas Sundal", dinner: "Sattu Roti with Dal" },
      { day: "Saturday", breakfast: "Mixed Dal Adai", lunch: "Cauliflower Peas Masala with Rice", snack: "Green Gram Sundal", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Carrot Roti with Curd", lunch: "Telangana Chicken Dry Green Masala", snack: "Curd Cucumber Peanut Bowl", dinner: "Sprouted Moong Curry with Roti" }
    ]
  },
  // Age 31 | normal | plan4
  {
    age: 31, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Carrot Moong Curry with Roti", snack: "Papaya Coconut Bowl", dinner: "Onion Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Palak Besan Cheela", lunch: "Carrot Chana Curry with Rice", snack: "Papaya Lassi", dinner: "Chayote Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Sattu Roti with Curd", lunch: "Andhra Fish Garlic Pepper Fry with Rice", snack: "Papaya Peanut Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Thursday", breakfast: "Chana Dal Cheela", lunch: "Lobia Curry with Rice", snack: "Banana Sattu Shake", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Friday", breakfast: "Methi Besan Cheela", lunch: "Dal with Amaranth Leaves", snack: "Homemade Jowar Savoury Balls", dinner: "Carrot Muthia with Dal" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Black-Eyed Pea Curry with Rice", snack: "Banana Lassi", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Jowar Malt with Milk", lunch: "North Indian Chicken Kasuri Methi Fry with", snack: "White Pea Chaat", dinner: "Methi Besan Cheela with Curd" }
    ]
  },
  // Age 31 | overweight | plan1
  {
    age: 31, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Drumstick Leaves Adai", lunch: "Maharashtrian Amti with Rice", snack: "Guava Jaggery Bowl", dinner: "Lobia Curry with Roti" },
      { day: "Tuesday", breakfast: "Ragi Banana Malt", lunch: "Dosakaya Pappu with Rice", snack: "Roasted Gram Balls", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Pancake", lunch: "Telangana Chicken Ginger Lemon Fry", snack: "Roasted Chana Jaggery Mix", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Dal with Drumstick Leaves", snack: "Jowar Malt Drink", dinner: "Methi Handvo with Chutney" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Cauliflower Methi Curry with Roti", snack: "Peanut Sundal", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Saturday", breakfast: "Guava Curd Bowl", lunch: "Spinach Corn Curry with Rice", snack: "Ragi Peanut Ladoo", dinner: "Carrot Roti with Dal" },
      { day: "Sunday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "North Indian Chicken Curry Leaf Garlic", snack: "Curry Leaf Buttermilk", dinner: "Stuffed Brinjal with Roti" }
    ]
  },
  // Age 31 | overweight | plan2
  {
    age: 31, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Amaranth Dal with Roti", snack: "Carrot Peanut Chaat", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Cluster Beans Dal Curry with Roti", snack: "Rice Kanji Drink", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Telangana Chicken Onion Pepper Fry", snack: "Roasted Cowpeas", dinner: "Dudhi Muthia with Curd" },
      { day: "Thursday", breakfast: "Leftover Rice Paniyaram", lunch: "Chayote Moong Curry with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Friday", breakfast: "Rava Paniyaram", lunch: "Masoor Dal with Dill Leaves", snack: "Cowpea Chaat", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Saturday", breakfast: "Vegetable Paniyaram", lunch: "Carrot Peas Masala with Rice", snack: "Homemade Poha Chivda", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Sunday", breakfast: "Ragi Thalipeeth", lunch: "Chicken Dry Methi Roast", snack: "Ragi Banana Balls", dinner: "Onion Adai with Chutney" }
    ]
  },
  // Age 31 | overweight | plan3
  {
    age: 31, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Green Peas Roti", lunch: "Broad Beans Masala with Rice", snack: "Peanut Poha Chivda", dinner: "Sattu Cheela with Curd" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Peas Potato Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Sweet Potato Roti with Curd" },
      { day: "Wednesday", breakfast: "Millet Vegetable Pancake", lunch: "South Indian Chicken Peanut Fry - 90-100", snack: "Homemade Popcorn with Peanuts", dinner: "Chana Usal with Bhakri" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Sweet Potato Peas Curry with Rice", snack: "Homemade Banana Shake", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Friday", breakfast: "Sattu Cheela", lunch: "Broad Beans Dal Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Sweet Potato Peas Curry with Roti", snack: "Black Chana Sundal", dinner: "Green Peas Muthia with Curd" },
      { day: "Sunday", breakfast: "Ragi Dhokla", lunch: "Prawn Methi Masala", snack: "Mint Buttermilk", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 31 | overweight | plan4
  {
    age: 31, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Vegetable Muthia", lunch: "Potato Beans Curry with Roti", snack: "Roasted Mung Beans", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Dal with Carrot and Beans", snack: "Curd Roasted Chana Bowl", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Andhra Chicken Green Masala Fry with", snack: "Corn Peanut Sundal", dinner: "Rava Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Rava Kichadi with Peanuts", lunch: "Brinjal Peanut Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Friday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Raw Banana Masala with Rice", snack: "Homemade Corn Chivda", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Mixed Dal Cheela", lunch: "Sattu Curry with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Sunday", breakfast: "Aval Upma with Peanuts", lunch: "South Indian Chicken Tawa Lemon Fry with", snack: "Banana Jaggery Bowl", dinner: "Raw Banana Masala with Phulka" }
    ]
  },
  // Age 32 | underweight | plan1
  {
    age: 32, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Onion Missi Roti", lunch: "Bharli Vangi with Bhakri", snack: "Mint Buttermilk", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Onion Besan Cheela", lunch: "Moong Dal with Spinach", snack: "Homemade Ragi Savoury Balls", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Chana Dal Roti", lunch: "Chicken Coconut Ginger Roast", snack: "Curd Cucumber Peanut Bowl", dinner: "Methi Muthia with Dal" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Dal with Amaranth Leaves", snack: "Bajra Puffed Grain Chaat", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Brinjal Coconut Curry with Rice", snack: "Ragi Banana Balls", dinner: "Khaman Dhokla with Curd" },
      { day: "Saturday", breakfast: "Mixed Dal Adai", lunch: "Carrot Peas Masala with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Chicken Dry Methi Roast with Rice", snack: "Roasted Green Gram", dinner: "Akki Rotti with Curd" }
    ]
  },
  // Age 32 | underweight | plan2
  {
    age: 32, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Cluster Beans Dal Curry with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Lobia Curry with Roti" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Beerakaya Pappu with Rice", snack: "Cowpea Sundal", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Khaman Dhokla", lunch: "Kerala Fish Tomato Masala with Rice - 150", snack: "Lobia Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Thursday", breakfast: "Ragi Paniyaram", lunch: "Moong Dal with Carrot", snack: "Murmura Black Chana Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Green Gram Masala with Roti", snack: "Banana Ragi Shake", dinner: "Ragi Rotti with Curd" },
      { day: "Saturday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Radish Roti with Dal" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Chicken Masala Fry", snack: "Sesame Chikki", dinner: "Methi Besan Cheela with Curd" }
    ]
  },
  // Age 32 | underweight | plan3
  {
    age: 32, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Yam Masala with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Green Peas Usal with Chapati" },
      { day: "Tuesday", breakfast: "Ragi Banana Malt", lunch: "Potato Beans Curry with Roti", snack: "Boiled Peanut Chaat", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Wednesday", breakfast: "Ammini Kozhukattai", lunch: "Chicken Ginger Lemon Fry", snack: "Roasted Peanuts with Curry Leaves", dinner: "Kala Vatana Usal with Roti" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Dal with Carrot and Beans", snack: "Sattu Buttermilk", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Friday", breakfast: "Vegetable Muthia", lunch: "Beetroot Coconut Curry with Rice", snack: "Black Chana Sundal", dinner: "Palak Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Chana Usal with Bhakri", snack: "Horse Gram Sundal", dinner: "Raw Banana Masala with Phulka" },
      { day: "Sunday", breakfast: "Jowar Muthia", lunch: "South Indian Chicken Lemon Ginger Roast", snack: "Curd Peanut Bowl", dinner: "Bajra Rotti with Dal" }
    ]
  },
  // Age 32 | underweight | plan4
  {
    age: 32, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Dill Leaves Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Onion Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Rice Sevai", lunch: "Broad Beans Masala with Roti", snack: "Homemade Corn Chivda", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Kerala Fish Lemon Roast with Red Rice", snack: "Boiled Corn with Lemon", dinner: "Methi Handvo with Chutney" },
      { day: "Thursday", breakfast: "Moong Dal Handvo", lunch: "Lobia Curry with Rice", snack: "Rice Kanji Drink", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Friday", breakfast: "Ragi Vegetable Roti", lunch: "Matki Usal with Bhakri", snack: "Cowpea Chaat", dinner: "Onion Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Gujarati Dal with Rice", snack: "Ragi Peanut Ladoo", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Aval Upma with Peanuts", lunch: "North Indian Chicken Dry Peanut Roast", snack: "Sattu Jaggery Balls", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 32 | normal | plan1
  {
    age: 32, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Potato Peas Curry with Rice", snack: "Jaggery Lassi", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Stuffed Tindora with Roti", snack: "Bajra Malt Drink", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Prawn Andhra Pepper Fry with Rice - 120", snack: "Roasted Peanut Jaggery Mix", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Thursday", breakfast: "Dudhi Muthia", lunch: "Toor Dal with Raw Banana", snack: "Black Chana Chaat with Lemon", dinner: "Methi Akki Rotti" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Moong Dal with Sweet Potato", snack: "Banana Ragi Balls", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Cowpea Curry with Rice", snack: "Green Gram Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Onion Paniyaram", lunch: "South Indian Chicken Dry Coriander Roast", snack: "Homemade Popcorn with Peanuts", dinner: "Vegetable Thalipeeth with Curd" }
    ]
  },
  // Age 32 | normal | plan2
  {
    age: 32, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Carrot Peas Masala with Rice", snack: "Corn Peanut Sundal", dinner: "Ragi Ambli with Roti" },
      { day: "Tuesday", breakfast: "Bottle Gourd Handvo", lunch: "Maharashtrian Amti with Rice", snack: "Boiled Groundnut Salad", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Banana Jowar Pancake", lunch: "Chicken Jeera Pepper Fry", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Rice Kanji with Curd", lunch: "Yam Pepper Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Friday", breakfast: "Masoor Dal Cheela", lunch: "Beetroot Masala with Roti", snack: "Papaya Lassi", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Dill Leaves Dal with Rice", snack: "Roasted Sweet Corn", dinner: "Methi Adai with Curd" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "South Indian Chicken Jeera Garlic Roast", snack: "Raw Banana Chaat", dinner: "Mixed Dal Adai with Curd" }
    ]
  },
  // Age 32 | normal | plan3
  {
    age: 32, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Sattu Cheela", lunch: "Dosakaya Pappu with Rice", snack: "Homemade Peanut Bar", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Ragi Malt with Jaggery", lunch: "White Peas Curry with Rice", snack: "White Pea Chaat", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "Fish Coconut Pepper Curry with Rice", snack: "Peanut Sundal", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Onion Adai", lunch: "Amaranth Leaves Curry with Rice", snack: "Guava Peanut Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Friday", breakfast: "Methi Missi Roti", lunch: "Cauliflower Methi Curry with Roti", snack: "White Peas Sundal", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Lemon Sevai with Peanuts", lunch: "Green Gram Masala with Rice", snack: "Jeera Buttermilk", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Jowar Ambli", lunch: "South Indian Chicken Andhra Fry - 90-100", snack: "Cucumber Roasted Chana Chaat", dinner: "Urad Dal Cheela with Curd" }
    ]
  },
  // Age 32 | normal | plan4
  {
    age: 32, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Rotti with Curd", lunch: "Drumstick Leaves Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Chayote Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Palak Dhokla", lunch: "Bengali Masoor Dal with Rice", snack: "Banana Lassi", dinner: "Vegetable Muthia with Curd" },
      { day: "Wednesday", breakfast: "Guava Curd Bowl", lunch: "Andhra Chicken Spinach Pepper Fry with", snack: "Papaya Coconut Bowl", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Thursday", breakfast: "Ragi Kozhukattai", lunch: "Sprouted Moong Curry with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Friday", breakfast: "Jowar Malt with Milk", lunch: "Masoor Dal with Dill Leaves", snack: "Coconut Jaggery Ladoo", dinner: "Sweet Potato Roti with Curd" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Amaranth Dal with Roti", snack: "Ginger Buttermilk", dinner: "Stuffed Brinjal with Roti" },
      { day: "Sunday", breakfast: "Vegetable Paniyaram", lunch: "Chicken Mangalorean Fry", snack: "Puffed Rice Chana Mixture", dinner: "Drumstick Leaves Dal with Roti" }
    ]
  },
  // Age 32 | overweight | plan1
  {
    age: 32, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Raw Banana Masala with Rice", snack: "Peanut Poha Chivda", dinner: "Jowar Ambli with Roti" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Stuffed Bhindi with Roti", snack: "Peanut Chikki", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Wednesday", breakfast: "Ragi Rotti with Chutney", lunch: "Chicken Coastal Pepper Fry", snack: "Banana Jaggery Bowl", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Thursday", breakfast: "Mixed Dal Cheela", lunch: "Methi Peas Curry with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Methi Handvo", lunch: "Cabbage Moong Curry with Roti", snack: "Roasted Mung Beans", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Saturday", breakfast: "Palak Missi Roti", lunch: "Brinjal Dal Curry with Roti", snack: "Homemade Banana Shake", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Andhra Chicken Malabar Fry with Roti", snack: "Puffed Rice Chikki", dinner: "Green Peas Muthia with Curd" }
    ]
  },
  // Age 32 | overweight | plan2
  {
    age: 32, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Green Peas Roti", lunch: "Broad Beans Dal Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Bajra Ambli with Curd" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Raw Mango Dal with Rice", snack: "Homemade Murmura Chaat", dinner: "Jowar Rotti with Dal" },
      { day: "Wednesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Andhra Chicken Cumin Coriander Roast", snack: "Murmura Peanut Chaat", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Banana with Roasted Peanuts", lunch: "Cowpea Masala with Roti", snack: "Beetroot Peanut Chaat", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Methi Muthia", lunch: "Broad Beans Masala with Rice", snack: "Banana Sattu Shake", dinner: "Ragi Dhokla with Curd" },
      { day: "Saturday", breakfast: "Bajra Ambli", lunch: "Potato Beans Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Beetroot Roti with Curd", lunch: "Kerala Prawn Coconut Pepper Fry with Red", snack: "Roasted Bengal Gram with Onion", dinner: "Methi Missi Roti with Dal" }
    ]
  },
  // Age 32 | overweight | plan3
  {
    age: 32, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Vegetable Pancake", lunch: "Cabbage Carrot Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Drumstick Leaves Adai", lunch: "Sattu Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Sattu Curry with Phulka" },
      { day: "Wednesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "South Indian Chicken Tomato Pepper Fry", snack: "Jowar Malt Drink", dinner: "Green Peas Roti with Curd" },
      { day: "Thursday", breakfast: "Leftover Rice Paniyaram", lunch: "Kala Vatana Usal with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Coconut Sevai with Peanuts" },
      { day: "Friday", breakfast: "Moong Dal Dhokla", lunch: "Sprouted Moong Curry with Rice", snack: "Murmura Onion Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Saturday", breakfast: "Moong Dal Roti", lunch: "Carrot Chana Curry with Rice", snack: "Ragi Buttermilk", dinner: "Jowar Kanji with Dal" },
      { day: "Sunday", breakfast: "Methi Thalipeeth", lunch: "Telangana Chicken Dry Methi Roast", snack: "Jowar Puffed Grain Chaat", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 32 | overweight | plan4
  {
    age: 32, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Vegetable Adai", lunch: "Raw Banana Masala with Roti", snack: "Roasted Cowpeas", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Sweet Potato Peas Curry with Rice", snack: "Green Gram Sundal", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Andhra Chicken Peanut Fry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Thursday", breakfast: "Chana Dal Cheela", lunch: "Peas Potato Curry with Rice", snack: "Roasted Gram Balls", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Ragi Thalipeeth", lunch: "Masoor Dal with Methi", snack: "Sweet Potato Sesame Balls", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Cauliflower Dal Curry with Roti", snack: "Sattu Jaggery Ladoo", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Sunday", breakfast: "Carrot Besan Cheela", lunch: "Chicken Methi Fry", snack: "Jowar Chikki", dinner: "Mixed Dal Cheela with Curd" }
    ]
  },
  // Age 33 | underweight | plan1
  {
    age: 33, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Pancake", lunch: "Cabbage Carrot Curry with Rice", snack: "Roasted Cowpeas", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Vegetable Adai", lunch: "Drumstick Leaves Dal with Roti", snack: "Raw Banana Chaat", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Wednesday", breakfast: "Bajra Malt with Jaggery", lunch: "Chicken Telangana Fry", snack: "Banana Sattu Shake", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Jowar Thalipeeth", lunch: "Sprouted Moong Curry with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Bajra Ambli with Curd" },
      { day: "Friday", breakfast: "Ajwain Missi Roti", lunch: "Sweet Potato Peas Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Saturday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Kala Vatana Usal with Roti", snack: "Corn Peanut Sundal", dinner: "Vegetable Muthia with Curd" },
      { day: "Sunday", breakfast: "Masoor Dal Cheela", lunch: "Andhra Fish Tamarind Curry", snack: "Homemade Murmura Chaat", dinner: "Carrot Besan Cheela with Chutney" }
    ]
  },
  // Age 33 | underweight | plan2
  {
    age: 33, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Methi Roti", lunch: "Cowpea Curry with Rice", snack: "Black Chana Sundal", dinner: "Urad Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Bajra Thalipeeth", lunch: "Potato Methi Curry with Roti", snack: "Ragi Buttermilk", dinner: "Chayote Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Carrot Muthia", lunch: "Andhra Chicken Mustard Fry with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Jowar Ambli with Roti" },
      { day: "Thursday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Stuffed Bhindi with Roti", snack: "Carrot Peanut Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Lemon Sevai with Peanuts", lunch: "Carrot Moong Curry with Roti", snack: "Murmura Peanut Chaat", dinner: "Palak Missi Roti with Curd" },
      { day: "Saturday", breakfast: "Rava Paniyaram", lunch: "Gujarati Dal with Rice", snack: "Green Gram Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Sunday", breakfast: "Chana Dal Roti", lunch: "North Indian Chicken Sesame Fry", snack: "Homemade Jowar Savoury Balls", dinner: "Stuffed Brinjal with Roti" }
    ]
  },
  // Age 33 | underweight | plan3
  {
    age: 33, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Banana with Roasted Peanuts", lunch: "Toor Dal with Raw Banana", snack: "Curd Peanut Bowl", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Tuesday", breakfast: "Boiled Yam with Curd", lunch: "Black-Eyed Pea Curry with Rice", snack: "Homemade Banana Shake", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Wednesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Chicken Dry Masala Fry", snack: "Jowar Malt Drink", dinner: "Matki Usal with Bhakri" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "Dal with Amaranth Leaves", snack: "Roasted Peanut Jaggery Mix", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Vegetable Handvo", lunch: "Gongura Pappu with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Carrot Roti with Dal" },
      { day: "Saturday", breakfast: "Besan Dhokla", lunch: "Spinach Chana Curry with Roti", snack: "Beetroot Peanut Chaat", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "Telangana Chicken Mustard Fry", snack: "Cowpea Sundal", dinner: "Moong Dal Handvo" }
    ]
  },
  // Age 33 | underweight | plan4
  {
    age: 33, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Vegetable Thalipeeth", lunch: "Chana Dal with Ridge Gourd", snack: "Mint Buttermilk", dinner: "Methi Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Beetroot Roti with Curd", lunch: "Amaranth Dal with Roti", snack: "Green Gram Sundal", dinner: "Green Peas Roti with Curd" },
      { day: "Wednesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Andhra Chicken Pan Fry with Rice", snack: "Banana Sesame Chaat", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Cauliflower Dal Curry with Roti", snack: "Banana Jaggery Milk", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Jowar Malt with Milk", lunch: "Carrot Peas Masala with Rice", snack: "Boiled Peanut Chaat", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Jowar Kanji with Curd", lunch: "Moong Dal with Carrot", snack: "Ragi Jaggery Ladoo", dinner: "Chana Usal with Bhakri" },
      { day: "Sunday", breakfast: "Banana Jowar Pancake", lunch: "Chicken Sesame Fry", snack: "Curd Roasted Chana Bowl", dinner: "Bajra Rotti with Dal" }
    ]
  },
  // Age 33 | normal | plan1
  {
    age: 33, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Sweet Potato Roti", lunch: "Bharli Vangi with Bhakri", snack: "Puffed Rice Chikki", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Onion Besan Cheela", lunch: "Potato Peas Curry with Rice", snack: "Banana Ragi Shake", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "South Indian Chicken Dhaba Fry - 90-100", snack: "Roasted Rice Flake Mixture", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Dosakaya Pappu with Rice", snack: "Sattu Buttermilk", dinner: "Onion Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Khaman Dhokla", lunch: "White Peas Masala with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Sattu Curry with Phulka" },
      { day: "Saturday", breakfast: "Sattu Vegetable Pancake", lunch: "Sweet Potato Peas Curry with Roti", snack: "Roasted Mung Beans", dinner: "Yam Pepper Curry with Roti" },
      { day: "Sunday", breakfast: "Drumstick Leaves Adai", lunch: "North Indian Chicken Green Masala Fry", snack: "Boiled Groundnut Salad", dinner: "Aval Vegetable Kichadi" }
    ]
  },
  // Age 33 | normal | plan2
  {
    age: 33, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Vegetable Muthia", lunch: "Masoor Dal with Dill Leaves", snack: "Roasted Sweet Corn", dinner: "Dudhi Muthia with Curd" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Peas Potato Curry with Roti", snack: "Boiled Corn with Lemon", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Palak Dhokla", lunch: "South Indian Chicken Curry Leaf Garlic", snack: "Sesame Jaggery Ladoo", dinner: "Palak Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Ragi Vegetable Roti", lunch: "Brinjal Dal Curry with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Khaman Dhokla with Curd" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Yam Pepper Curry with Rice", snack: "Peanut Chikki", dinner: "Besan Dhokla with Curd" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Methi Corn Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Sunday", breakfast: "Banana Ragi Pancake", lunch: "South Indian Chicken Mustard Pepper", snack: "White Peas Sundal", dinner: "Lobia Curry with Roti" }
    ]
  },
  // Age 33 | normal | plan3
  {
    age: 33, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Aval Upma with Peanuts", lunch: "Broad Beans Dal Curry with Rice", snack: "Jeera Buttermilk", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Moong Dal Roti", lunch: "Moong Dal with Sweet Potato", snack: "Curd Cucumber Peanut Bowl", dinner: "Vegetable Adai with Curd" },
      { day: "Wednesday", breakfast: "Carrot Roti with Curd", lunch: "Andhra Chicken Dhaba Fry with Roti - 150", snack: "Ginger Buttermilk", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Cauliflower Methi Curry with Roti", snack: "Boiled Chana Chaat with Onion", dinner: "Vegetable Handvo with Curd" },
      { day: "Friday", breakfast: "Jowar Methi Roti", lunch: "Tindora Sesame Curry with Roti", snack: "Banana Ragi Balls", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Methi Muthia", lunch: "Sprouted Moong Curry with Rice", snack: "Homemade Corn Chivda", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Andhra Chicken Lemon Herb Roast", snack: "Ragi Puffed Grain Chaat", dinner: "Ammini Kozhukattai with Vegetables" }
    ]
  },
  // Age 33 | normal | plan4
  {
    age: 33, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Kozhukattai", lunch: "Brinjal Peanut Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Chayote Moong Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Sattu Roti with Dal" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "South Indian Chicken Mint Coriander Fry", snack: "Boiled Yam Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Ragi Paniyaram", lunch: "Carrot Chana Curry with Rice", snack: "Rice Kanji Drink", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Beetroot Masala with Roti", snack: "Homemade Poha Chivda", dinner: "Palak Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Ragi Banana Malt", lunch: "Green Peas Usal with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Chana Dal Cheela", lunch: "Bengali Fish Andhra Pepper Fry", snack: "Roasted Corn Peanut Mix", dinner: "White Pea Curry with Phulka" }
    ]
  },
  // Age 33 | overweight | plan1
  {
    age: 33, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Vegetable Pancake", lunch: "Cluster Beans Dal Curry with Roti", snack: "Guava Jaggery Bowl", dinner: "Methi Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Moong Dal Paniyaram", lunch: "Beetroot Coconut Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Green Peas Muthia with Curd" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "Andhra Chicken Coriander Lemon Fry with", snack: "Curd Banana Jaggery Bowl", dinner: "Methi Handvo with Chutney" },
      { day: "Thursday", breakfast: "Palak Besan Cheela", lunch: "Broad Beans Masala with Roti", snack: "Papaya Lassi", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "Raw Banana Masala with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Saturday", breakfast: "Ragi Sevai Upma", lunch: "Cauliflower Peas Masala with Rice", snack: "Jowar Chikki", dinner: "Ragi Ambli with Roti" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "South Indian Chicken Pepper Fry", snack: "Jaggery Ragi Milk", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 33 | overweight | plan2
  {
    age: 33, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Missi Roti", lunch: "Yam Masala with Roti", snack: "Roasted Gram Balls", dinner: "Onion Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Rice Kanji with Curd", lunch: "Dal with Carrot and Beans", snack: "Sweet Potato Peanut Chaat", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Wednesday", breakfast: "Onion Paniyaram", lunch: "Andhra Chicken Coconut Masala Fry with", snack: "Peanut Poha Chivda", dinner: "Methi Adai with Curd" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Black-Eyed Pea Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Jowar Muthia with Dal" },
      { day: "Friday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Raw Mango Dal with Rice", snack: "Murmura Onion Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Sattu Curry with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Sunday", breakfast: "Methi Handvo", lunch: "Telangana Chicken Garlic Fry with Rice", snack: "Papaya Coconut Bowl", dinner: "Ajwain Missi Roti with Dal" }
    ]
  },
  // Age 33 | overweight | plan3
  {
    age: 33, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Adai", lunch: "Lobia Curry with Rice", snack: "Homemade Peanut Bar", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "White Peas Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Bajra Ambli", lunch: "Telangana Chicken Pepper Roast", snack: "Ragi Peanut Ladoo", dinner: "Sweet Potato Roti with Curd" },
      { day: "Thursday", breakfast: "Methi Besan Cheela", lunch: "Stuffed Brinjal with Rice", snack: "Dry Roasted Corn", dinner: "Raw Banana Masala with Phulka" },
      { day: "Friday", breakfast: "Mixed Dal Adai", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Horse Gram Sundal", dinner: "Rice Kanji with Dal" },
      { day: "Saturday", breakfast: "Moong Dal Dhokla", lunch: "Beerakaya Pappu with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Methi Akki Rotti" },
      { day: "Sunday", breakfast: "Onion Adai", lunch: "Kerala Prawn Garlic Pepper Fry", snack: "Ragi Banana Balls", dinner: "Green Gram Curry with Jowar Roti" }
    ]
  },
  // Age 33 | overweight | plan4
  {
    age: 33, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Carrot Peas Masala with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Andhra Mudda Pappu with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Stuffed Tindora with Roti" },
      { day: "Wednesday", breakfast: "Ragi Thalipeeth", lunch: "Andhra Chicken Village-Style Fry", snack: "Guava Peanut Chaat", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Brinjal Coconut Curry with Rice", snack: "Curry Leaf Buttermilk", dinner: "Methi Muthia with Dal" },
      { day: "Friday", breakfast: "Onion Missi Roti", lunch: "Drumstick Leaves Curry with Rice", snack: "Sesame Chikki", dinner: "Sattu Cheela with Curd" },
      { day: "Saturday", breakfast: "Ragi Dhokla", lunch: "Potato Beans Curry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Carrot Muthia with Dal" },
      { day: "Sunday", breakfast: "Sattu Roti with Curd", lunch: "Telangana Chicken Coriander Ginger Roast", snack: "Banana Lassi", dinner: "Ragi Thalipeeth with Dal" }
    ]
  },
  // Age 34 | underweight | plan1
  {
    age: 34, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Rava Kichadi with Peanuts", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Stuffed Brinjal with Roti" },
      { day: "Tuesday", breakfast: "Palak Besan Cheela", lunch: "Raw Banana Masala with Rice", snack: "Banana Sesame Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Moong Dal Dhokla", lunch: "Chicken Garlic Lemon Fry", snack: "Sattu Jaggery Balls", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Cowpea Masala with Roti", snack: "Roasted Mung Beans", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Methi Muthia", lunch: "Dal with Carrot and Beans", snack: "Homemade Poha Chivda", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Ragi Malt with Jaggery", lunch: "Maharashtrian Amti with Rice", snack: "Ragi Peanut Ladoo", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Andhra Fish Curry Leaf Roast with Red", snack: "Jeera Buttermilk", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 34 | underweight | plan2
  {
    age: 34, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Black-Eyed Pea Curry with Roti", snack: "Guava Peanut Chaat", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Jowar Kanji with Curd", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Beetroot Roti with Curd" },
      { day: "Wednesday", breakfast: "Bajra Ambli", lunch: "Chicken Coconut Garlic Roast", snack: "Puffed Rice Chana Mixture", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Thursday", breakfast: "Drumstick Leaves Adai", lunch: "Stuffed Tindora with Roti", snack: "Boiled Groundnut Salad", dinner: "Methi Muthia with Dal" },
      { day: "Friday", breakfast: "Ragi Thalipeeth", lunch: "Raw Mango Dal with Rice", snack: "Peanut Chikki", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Vegetable Thalipeeth", lunch: "Cabbage Moong Curry with Roti", snack: "Murmura Peanut Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Sunday", breakfast: "Bajra Thalipeeth", lunch: "Chicken Dry Sesame Roast with Rice", snack: "Raw Banana Chaat", dinner: "Bottle Gourd Handvo with Curd" }
    ]
  },
  // Age 34 | underweight | plan3
  {
    age: 34, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Sattu Cheela", lunch: "Brinjal Peanut Curry with Rice", snack: "Black Chana Sundal", dinner: "Sattu Cheela with Curd" },
      { day: "Tuesday", breakfast: "Jowar Muthia", lunch: "Potato Methi Curry with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Moong Dal Handvo" },
      { day: "Wednesday", breakfast: "Palak Dhokla", lunch: "Andhra Chicken Coastal Pepper Fry with", snack: "Roasted Peanuts with Curry Leaves", dinner: "Akki Rotti with Curd" },
      { day: "Thursday", breakfast: "Ragi Rotti with Chutney", lunch: "Lobia Curry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Friday", breakfast: "Jowar Methi Roti", lunch: "Amaranth Leaves Curry with Rice", snack: "Green Gram Sundal", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Moong Dal with Sweet Potato", snack: "Mint Buttermilk", dinner: "Green Peas Muthia with Curd" },
      { day: "Sunday", breakfast: "Guava Curd Bowl", lunch: "Andhra Chicken Drumstick Leaf Fry", snack: "Sattu Jaggery Ladoo", dinner: "Rice Flour Vegetable Pancake" }
    ]
  },
  // Age 34 | underweight | plan4
  {
    age: 34, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Yam Masala with Roti", snack: "Roasted Green Gram", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Onion Besan Cheela", lunch: "Moong Dal with Spinach", snack: "Papaya Peanut Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Wednesday", breakfast: "Bajra Rotti with Curd", lunch: "South Indian Chicken Peanut Pepper Roast", snack: "Banana Sattu Shake", dinner: "White Pea Curry with Phulka" },
      { day: "Thursday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Raw Banana Masala with Roti", snack: "Jowar Malt Drink", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Vegetable Muthia", lunch: "Spinach Corn Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Onion Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Green Peas Muthia", lunch: "Beetroot Coconut Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Kala Vatana Usal with Roti" },
      { day: "Sunday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Chicken Dry Garlic Roast", snack: "Ragi Peanut Chikki", dinner: "Urad Dal Cheela with Curd" }
    ]
  },
  // Age 34 | normal | plan1
  {
    age: 34, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Dill Leaves Curry with Roti", snack: "Ragi Banana Balls", dinner: "Radish Roti with Dal" },
      { day: "Tuesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Matki Usal with Rice", snack: "Homemade Corn Chivda", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "Chicken Peanut Pepper Roast", snack: "Bajra Malt Drink", dinner: "Methi Handvo with Chutney" },
      { day: "Thursday", breakfast: "Vegetable Adai", lunch: "Broad Beans Dal Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Dudhi Muthia with Curd" },
      { day: "Friday", breakfast: "Leftover Rice Paniyaram", lunch: "Tindora Peanut Curry with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Saturday", breakfast: "Ragi Paniyaram", lunch: "Potato Beans Curry with Rice", snack: "Curry Leaf Buttermilk", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Andhra Chicken Coriander Lemon Fry with", snack: "Corn Peanut Sundal", dinner: "Cabbage Besan Cheela with Chutney" }
    ]
  },
  // Age 34 | normal | plan2
  {
    age: 34, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "Gujarati Dal with Rice", snack: "Jaggery Ragi Milk", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Drumstick Leaves Dal with Roti", snack: "Green Gram Chaat", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Wednesday", breakfast: "Millet Vegetable Pancake", lunch: "Prawn Coconut Garlic Curry", snack: "Rice Kanji Drink", dinner: "Jowar Ambli with Roti" },
      { day: "Thursday", breakfast: "Sattu Roti with Curd", lunch: "Drumstick Leaves Curry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Sattu Curry with Phulka" },
      { day: "Friday", breakfast: "Bajra Malt with Jaggery", lunch: "White Peas Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Saturday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Carrot Chana Curry with Rice", snack: "Jowar Chikki", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "South Indian Chicken Konkan Fry", snack: "Banana Lassi", dinner: "Vegetable Thalipeeth with Curd" }
    ]
  },
  // Age 34 | normal | plan3
  {
    age: 34, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Broad Beans Masala with Roti", snack: "Papaya Coconut Bowl", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Onion Missi Roti", lunch: "Chana Dal with Spinach", snack: "Curd Banana Jaggery Bowl", dinner: "Chayote Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Mixed Dal Adai", lunch: "Kerala Fish Tamarind Pepper Fry with Red", snack: "Papaya Lassi", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Spinach Chana Curry with Roti", snack: "Curd Peanut Bowl", dinner: "Bajra Rotti with Dal" },
      { day: "Friday", breakfast: "Sweet Potato Roti", lunch: "Cauliflower Methi Curry with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Toor Dal with Raw Banana", snack: "Cowpea Sundal", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Telangana Chicken Garlic Lemon Fry with", snack: "Curd Sweet Potato Bowl", dinner: "Raw Banana Masala with Phulka" }
    ]
  },
  // Age 34 | normal | plan4
  {
    age: 34, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Onion Paniyaram", lunch: "Cluster Beans Dal Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Green Peas Roti with Curd" },
      { day: "Tuesday", breakfast: "Carrot Roti with Curd", lunch: "Chana Dal with Ridge Gourd", snack: "Homemade Peanut Bar", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Jowar Ambli", lunch: "South Indian Chicken Telangana Pepper", snack: "Homemade Jowar Savoury Balls", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Sattu Vegetable Pancake", lunch: "Dal with Fenugreek Leaves", snack: "Banana Jaggery Bowl", dinner: "Coconut Sevai with Peanuts" },
      { day: "Friday", breakfast: "Methi Besan Cheela", lunch: "Cowpea Curry with Rice", snack: "Ragi Buttermilk", dinner: "Onion Adai with Chutney" },
      { day: "Saturday", breakfast: "Jowar Vegetable Pancake", lunch: "Yam Pepper Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Rava Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Khaman Dhokla", lunch: "South Indian Chicken Methi Fry with Roti", snack: "Banana Jaggery Milk", dinner: "Green Peas Usal with Chapati" }
    ]
  },
  // Age 34 | overweight | plan1
  {
    age: 34, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Kozhukattai", lunch: "Andhra Mudda Pappu with Rice", snack: "Sesame Chikki", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Bajra Methi Roti", lunch: "Cabbage Carrot Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Rice Sevai", lunch: "Andhra Chicken Tawa Lemon Fry - 90-100", snack: "White Peas Sundal", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Mixed Dal Cheela", lunch: "Chayote Dal Curry with Roti", snack: "Murmura Onion Chaat", dinner: "Matki Usal with Bhakri" },
      { day: "Friday", breakfast: "Masoor Dal Cheela", lunch: "Dal with Amaranth Leaves", snack: "Roasted Chana Ladoo", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Saturday", breakfast: "Onion Adai", lunch: "Lobia Curry with Rice", snack: "Boiled Peanut Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Vegetable Paniyaram", lunch: "Chicken Dry Methi Roast with Rice", snack: "Cowpea Chaat", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 34 | overweight | plan2
  {
    age: 34, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Cauliflower Dal Curry with Roti", snack: "Banana Ragi Shake", dinner: "Stuffed Bhindi with Roti" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Carrot Moong Curry with Roti", snack: "Poha Jaggery Ladoo", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Wednesday", breakfast: "Methi Adai", lunch: "Andhra Chicken Green Chilli Fry", snack: "Lobia Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Green Gram Masala with Roti", snack: "Boiled Chana Chaat with Onion", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Potato Beans Curry with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Chana Usal with Bhakri" },
      { day: "Saturday", breakfast: "Aval Upma with Peanuts", lunch: "Bengali Masoor Dal with Rice", snack: "Murmura Black Chana Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Sunday", breakfast: "Jowar Malt with Milk", lunch: "Andhra Chicken Sesame Pepper Roast with", snack: "Puffed Rice Peanut Mixture", dinner: "Millet Vegetable Pancake with Curd" }
    ]
  },
  // Age 34 | overweight | plan3
  {
    age: 34, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Roti", lunch: "Carrot Peas Masala with Rice", snack: "Homemade Banana Shake", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Tuesday", breakfast: "Methi Akki Rotti", lunch: "Beetroot Masala with Roti", snack: "Boiled Corn with Lemon", dinner: "Ragi Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Banana Ragi Pancake", lunch: "South Indian Chicken Jeera Garlic Roast", snack: "Homemade Ragi Savoury Balls", dinner: "Jowar Kanji with Dal" },
      { day: "Thursday", breakfast: "Chana Dal Cheela", lunch: "Black-Eyed Pea Curry with Rice", snack: "Roasted Gram Balls", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Sattu Curry with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Yam Pepper Curry with Roti" },
      { day: "Saturday", breakfast: "Onion Thalipeeth", lunch: "Methi Peas Curry with Roti", snack: "Sattu Buttermilk", dinner: "Rice Kanji with Dal" },
      { day: "Sunday", breakfast: "Methi Handvo", lunch: "South Indian Chicken Telangana Fry", snack: "Dry Roasted Corn", dinner: "Chana Dal Roti with Curd" }
    ]
  },
  // Age 34 | overweight | plan4
  {
    age: 34, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Moong Dal Roti", lunch: "Cauliflower Peas Masala with Rice", snack: "Homemade Murmura Chaat", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Green Peas Usal with Roti", snack: "White Pea Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Cabbage Besan Cheela", lunch: "Andhra Chicken Dry Lemon Roast", snack: "Jaggery Lassi", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Thursday", breakfast: "Green Peas Roti", lunch: "Broad Beans Masala with Rice", snack: "Peanut Sundal", dinner: "Mixed Dal Adai with Curd" },
      { day: "Friday", breakfast: "Besan Dhokla", lunch: "Beerakaya Pappu with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Jowar Rotti with Dal" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Sweet Potato Peas Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Ragi Rotti with Curd" },
      { day: "Sunday", breakfast: "Urad Dal Cheela", lunch: "Chicken Dry Coriander Roast", snack: "Ginger Buttermilk", dinner: "Methi Missi Roti with Dal" }
    ]
  },
  // Age 35 | underweight | plan1
  {
    age: 35, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Akki Rotti", lunch: "Chana Dal with Ridge Gourd", snack: "Homemade Peanut Bar", dinner: "Radish Roti with Dal" },
      { day: "Tuesday", breakfast: "Millet Vegetable Pancake", lunch: "Masoor Dal with Methi", snack: "Homemade Poha Chivda", dinner: "Jowar Kanji with Dal" },
      { day: "Wednesday", breakfast: "Mixed Dal Cheela", lunch: "Chicken Dry Coriander Roast", snack: "Cucumber Roasted Chana Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "White Peas Masala with Roti", snack: "Roasted Chana Ladoo", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Green Peas Muthia", lunch: "Amaranth Dal with Roti", snack: "Sattu Jaggery Ladoo", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Saturday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Sattu Curry with Roti", snack: "Boiled Yam Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Sunday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "North Indian Chicken Gongura Roast - 150", snack: "Roasted Chana Chikki", dinner: "Beetroot Masala with Roti" }
    ]
  },
  // Age 35 | underweight | plan2
  {
    age: 35, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Tindora Peanut Curry with Rice", snack: "Cowpea Chaat", dinner: "Carrot Roti with Dal" },
      { day: "Tuesday", breakfast: "Vegetable Adai", lunch: "Potato Peas Curry with Rice", snack: "Cowpea Sundal", dinner: "Sweet Potato Roti with Curd" },
      { day: "Wednesday", breakfast: "Sattu Cheela", lunch: "Fish Curry Leaf Fry", snack: "Sweet Potato Sesame Balls", dinner: "Green Peas Roti with Curd" },
      { day: "Thursday", breakfast: "Jowar Vegetable Pancake", lunch: "Broad Beans Masala with Roti", snack: "Banana Jaggery Bowl", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Methi Handvo", lunch: "Broad Beans Masala with Rice", snack: "Homemade Corn Chivda", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Ragi Sevai Upma", lunch: "Tindora Sesame Curry with Roti", snack: "Curd Peanut Bowl", dinner: "Vegetable Adai with Curd" },
      { day: "Sunday", breakfast: "Onion Missi Roti", lunch: "Bengali Fish Bengali Jhol", snack: "Sesame Chikki", dinner: "Chana Usal with Bhakri" }
    ]
  },
  // Age 35 | underweight | plan3
  {
    age: 35, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bottle Gourd Handvo", lunch: "Carrot Peas Masala with Rice", snack: "Peanut Chikki", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Tuesday", breakfast: "Ragi Paniyaram", lunch: "Sattu Curry with Rice", snack: "Ragi Buttermilk", dinner: "Jowar Rotti with Dal" },
      { day: "Wednesday", breakfast: "Vegetable Thalipeeth", lunch: "South Indian Chicken Green Masala Fry", snack: "Ragi Peanut Chikki", dinner: "Dudhi Muthia with Curd" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Brinjal Peanut Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Khaman Dhokla", lunch: "Dosakaya Pappu with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Rava Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Jowar Kanji with Curd", lunch: "Green Gram Masala with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Sunday", breakfast: "Besan Dhokla", lunch: "Telangana Chicken Ginger Fry with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 35 | underweight | plan4
  {
    age: 35, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Sprouted Moong Curry with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Moong Dal with Spinach", snack: "Banana Jaggery Milk", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Carrot Besan Cheela", lunch: "Telangana Chicken Kasuri Methi Fry with", snack: "Puffed Rice Chikki", dinner: "Stuffed Brinjal with Roti" },
      { day: "Thursday", breakfast: "Ragi Vegetable Roti", lunch: "Drumstick Leaves Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Bajra Methi Roti", lunch: "Lobia Curry with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Methi Muthia with Dal" },
      { day: "Saturday", breakfast: "Drumstick Leaves Adai", lunch: "Bengali Masoor Dal with Rice", snack: "Bajra Malt Drink", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Andhra Chicken Dry Jeera Roast - 90-100", snack: "Curd Roasted Chana Bowl", dinner: "Green Gram Curry with Jowar Roti" }
    ]
  },
  // Age 35 | normal | plan1
  {
    age: 35, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Kozhukattai", lunch: "Dal with Drumstick Leaves", snack: "Papaya Coconut Bowl", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Bajra Thalipeeth", lunch: "Matki Usal with Bhakri", snack: "Ginger Buttermilk", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Wednesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Chicken Dry Green Masala Roast", snack: "Bajra Puffed Grain Chaat", dinner: "Methi Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Dal with Fenugreek Leaves", snack: "Homemade Murmura Chaat", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Vegetable Handvo", lunch: "Brinjal Dal Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Cabbage Besan Cheela", lunch: "Sprouted Moong Curry with Rice", snack: "Lobia Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Moong Dal Handvo", lunch: "Andhra Chicken Pepper Roast with Roti", snack: "Roasted Mung Beans", dinner: "Rice Kanji with Dal" }
    ]
  },
  // Age 35 | normal | plan2
  {
    age: 35, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Cauliflower Methi Curry with Roti", snack: "Sattu Buttermilk", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Ajwain Missi Roti", lunch: "Cabbage Moong Curry with Roti", snack: "Ragi Peanut Ladoo", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Wednesday", breakfast: "Vegetable Rice Sevai", lunch: "Chicken Tawa Coriander Fry with Roti", snack: "Jowar Malt Drink", dinner: "Onion Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Guava Curd Bowl", lunch: "Potato Beans Curry with Rice", snack: "Boiled Corn with Lemon", dinner: "Methi Adai with Curd" },
      { day: "Friday", breakfast: "Dudhi Muthia", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Moong Dal with Carrot", snack: "Ragi Banana Balls", dinner: "Lemon Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Ragi Dhokla", lunch: "Fish Coriander Fry", snack: "Green Gram Chaat", dinner: "Khaman Dhokla with Curd" }
    ]
  },
  // Age 35 | normal | plan3
  {
    age: 35, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Masoor Dal with Dill Leaves", snack: "Roasted Green Gram", dinner: "Ragi Ambli with Roti" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "Maharashtrian Amti with Rice", snack: "Banana Ragi Shake", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Onion Adai", lunch: "Telangana Chicken Punjabi Masala Fry with", snack: "Puffed Rice Peanut Mixture", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Methi Missi Roti", lunch: "Black-Eyed Pea Curry with Rice", snack: "Rice Kanji Drink", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Friday", breakfast: "Leftover Rice Paniyaram", lunch: "Stuffed Bhindi with Roti", snack: "Banana Ragi Balls", dinner: "Bajra Ambli with Curd" },
      { day: "Saturday", breakfast: "Jowar Muthia", lunch: "Drumstick Leaves Dal with Roti", snack: "Banana Lassi", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Ragi Thalipeeth", lunch: "Chicken Dry Coconut Roast", snack: "White Pea Chaat", dinner: "Masoor Dal Cheela with Chutney" }
    ]
  },
  // Age 35 | normal | plan4
  {
    age: 35, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Radish Roti with Curd", lunch: "Chayote Moong Curry with Rice", snack: "Jowar Chikki", dinner: "Aval Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Ragi Rotti with Chutney", lunch: "Potato Methi Curry with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Methi Handvo with Chutney" },
      { day: "Wednesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Prawn Tamarind Curry", snack: "Boiled Chana Chaat with Onion", dinner: "Ragi Rotti with Curd" },
      { day: "Thursday", breakfast: "Methi Thalipeeth", lunch: "Stuffed Brinjal with Rice", snack: "Carrot Peanut Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Green Peas Roti", lunch: "Amaranth Leaves Curry with Rice", snack: "Peanut Sundal", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Cauliflower Dal Curry with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Yam Pepper Curry with Roti" },
      { day: "Sunday", breakfast: "Rava Kichadi with Peanuts", lunch: "North Indian Chicken Kasuri Methi Fry with", snack: "Jeera Buttermilk", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 35 | overweight | plan1
  {
    age: 35, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Onion Besan Cheela", lunch: "Toor Dal with Raw Banana", snack: "Jaggery Ragi Milk", dinner: "Raw Banana Masala with Phulka" },
      { day: "Tuesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Sweet Potato Peas Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Jowar Ambli with Roti" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "Andhra Prawn Gongura Curry with Red", snack: "Black Chana Sundal", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Cowpea Masala with Roti", snack: "Boiled Peanut Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Friday", breakfast: "Jowar Ambli", lunch: "Dal with Amaranth Leaves", snack: "Guava Jaggery Bowl", dinner: "Palak Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Aval Upma with Peanuts", lunch: "Yam Masala with Roti", snack: "Guava Peanut Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Ragi Vegetable Pancake", lunch: "North Indian Chicken Ginger Fry", snack: "Roasted Cowpeas", dinner: "Stuffed Tindora with Roti" }
    ]
  },
  // Age 35 | overweight | plan2
  {
    age: 35, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Urad Dal Cheela", lunch: "Carrot Moong Curry with Roti", snack: "White Peas Sundal", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Palak Besan Cheela", lunch: "Cauliflower Peas Masala with Rice", snack: "Roasted Gram Balls", dinner: "Sattu Cheela with Curd" },
      { day: "Wednesday", breakfast: "Palak Dhokla", lunch: "North Indian Chicken Jeera Pepper Fry with", snack: "Black Chana Chaat with Lemon", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Thursday", breakfast: "Jowar Methi Roti", lunch: "Sweet Potato Peas Curry with Roti", snack: "Homemade Banana Shake", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Onion Paniyaram", lunch: "Bharli Vangi with Bhakri", snack: "Ragi Jaggery Ladoo", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Peas Potato Curry with Roti", snack: "Green Gram Sundal", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Fish Lemon Pepper Fry", snack: "Murmura Black Chana Chaat", dinner: "Chana Dal Roti with Curd" }
    ]
  },
  // Age 35 | overweight | plan3
  {
    age: 35, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Masoor Dal Cheela", lunch: "Dill Leaves Dal with Rice", snack: "Murmura Peanut Chaat", dinner: "Sattu Curry with Phulka" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Methi Peas Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Akki Rotti with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Muthia", lunch: "North Indian Chicken Green Masala Fry", snack: "Curd Banana Jaggery Bowl", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Thursday", breakfast: "Bajra Ambli", lunch: "Spinach Chana Curry with Roti", snack: "Roasted Sweet Corn", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Cabbage Carrot Curry with Rice", snack: "Dry Roasted Corn", dinner: "Onion Adai with Chutney" },
      { day: "Saturday", breakfast: "Ammini Kozhukattai", lunch: "Raw Banana Masala with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Palak Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Banana Ragi Pancake", lunch: "Telangana Chicken Malabar Fry", snack: "Papaya Lassi", dinner: "Onion Thalipeeth with Curd" }
    ]
  },
  // Age 35 | overweight | plan4
  {
    age: 35, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Urad Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Sweet Potato Roti", lunch: "Black-Eyed Pea Curry with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Moong Dal Roti", lunch: "South Indian Chicken Red Pepper Roast", snack: "Roasted Corn Peanut Mix", dinner: "Methi Missi Roti with Dal" },
      { day: "Thursday", breakfast: "Methi Adai", lunch: "Moong Dal with Sweet Potato", snack: "Banana Sesame Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Friday", breakfast: "Sattu Vegetable Roti", lunch: "Peas Potato Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Saturday", breakfast: "Papaya Curd Bowl", lunch: "Chana Dal with Spinach", snack: "Papaya Peanut Chaat", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Methi Muthia", lunch: "Chicken Coastal Pepper Fry", snack: "Puffed Rice Chana Mixture", dinner: "Mixed Dal Cheela with Curd" }
    ]
  },
  // Age 36 | underweight | plan1
  {
    age: 36, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Amaranth Dal with Roti", snack: "Banana Jaggery Bowl", dinner: "Khaman Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Ragi Paniyaram", lunch: "Matki Usal with Bhakri", snack: "White Pea Chaat", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Roti", lunch: "Fish Coconut Garlic Curry", snack: "Bajra Malt Drink", dinner: "Bharli Vangi with Bhakri" },
      { day: "Thursday", breakfast: "Boiled Yam with Curd", lunch: "Moong Dal with Carrot", snack: "Jowar Malt Drink", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Friday", breakfast: "Banana Ragi Pancake", lunch: "Raw Banana Masala with Roti", snack: "Banana Ragi Shake", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Tindora Peanut Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Lobia Curry with Roti" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Bengali Fish Methi Curry", snack: "Puffed Rice Chikki", dinner: "Tindora Peanut Curry with Roti" }
    ]
  },
  // Age 36 | underweight | plan2
  {
    age: 36, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Moong Dal Dhokla", lunch: "White Peas Masala with Roti", snack: "Green Gram Sundal", dinner: "Palak Missi Roti with Curd" },
      { day: "Tuesday", breakfast: "Jowar Thalipeeth", lunch: "Andhra Mudda Pappu with Rice", snack: "Papaya Lassi", dinner: "Rice Kanji with Dal" },
      { day: "Wednesday", breakfast: "Ragi Dhokla", lunch: "South Indian Chicken Dry Green Masala", snack: "Roasted Cowpeas", dinner: "Bajra Rotti with Dal" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Beetroot Masala with Roti", snack: "Boiled Yam Chaat", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Green Peas Roti", lunch: "Sattu Curry with Roti", snack: "Homemade Murmura Chaat", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Onion Paniyaram", lunch: "Chana Dal with Spinach", snack: "Jeera Buttermilk", dinner: "Stuffed Tindora with Roti" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Telangana Chicken Dry Green Masala", snack: "Sattu Jaggery Ladoo", dinner: "Green Peas Roti with Curd" }
    ]
  },
  // Age 36 | underweight | plan3
  {
    age: 36, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Palak Missi Roti", lunch: "Beetroot Coconut Curry with Rice", snack: "Roasted Sweet Corn", dinner: "Besan Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Peanut Banana Bowl", lunch: "Methi Peas Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Palak Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Roti", lunch: "Telangana Chicken Coconut Masala Fry", snack: "Sesame Chikki", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Ragi Vegetable Pancake", lunch: "Dal with Amaranth Leaves", snack: "Curd Sweet Potato Bowl", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Methi Besan Cheela", lunch: "Cluster Beans Dal Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Jowar Rotti with Dal" },
      { day: "Saturday", breakfast: "Beetroot Roti with Curd", lunch: "Beerakaya Pappu with Rice", snack: "Roasted Green Gram", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Andhra Chicken Cumin Coriander Roast", snack: "Ragi Peanut Chikki", dinner: "Jowar Kanji with Dal" }
    ]
  },
  // Age 36 | underweight | plan4
  {
    age: 36, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Methi Roti", lunch: "Carrot Chana Curry with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Chana Dal Cheela", lunch: "Cabbage Moong Curry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Andhra Prawn Jeera Fry", snack: "Homemade Jowar Savoury Balls", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Ragi Banana Malt", lunch: "Sprouted Moong Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Raw Banana Masala with Phulka" },
      { day: "Friday", breakfast: "Carrot Besan Cheela", lunch: "Sweet Potato Peas Curry with Rice", snack: "Ginger Buttermilk", dinner: "Bajra Ambli with Curd" },
      { day: "Saturday", breakfast: "Jowar Malt with Milk", lunch: "Drumstick Leaves Curry with Rice", snack: "Green Gram Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Sunday", breakfast: "Lemon Sevai with Peanuts", lunch: "Coastal Prawn Curry Leaf Roast - 90-100", snack: "Lobia Chaat", dinner: "Vegetable Rice Kozhukattai" }
    ]
  },
  // Age 36 | normal | plan1
  {
    age: 36, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Handvo", lunch: "Green Gram Masala with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Stuffed Bhindi with Roti" },
      { day: "Tuesday", breakfast: "Chana Dal Roti", lunch: "Masoor Dal with Methi", snack: "Banana Sattu Shake", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "Prawn Tamarind Curry", snack: "Roasted Peanuts with Curry Leaves", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Spinach Chana Curry with Roti", snack: "Raw Banana Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Carrot Peas Masala with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Ragi Thalipeeth", lunch: "Carrot Moong Curry with Roti", snack: "Jaggery Ragi Milk", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Sunday", breakfast: "Ragi Sevai Upma", lunch: "Chicken Garlic Pepper Fry", snack: "Banana Lassi", dinner: "Ragi Malt with Roti and Dal" }
    ]
  },
  // Age 36 | normal | plan2
  {
    age: 36, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Gujarati Dal with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Mixed Dal Cheela", lunch: "Yam Masala with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Ragi Malt with Jaggery", lunch: "North Indian Chicken Tawa Pepper Roast", snack: "Peanut Jaggery Ladoo", dinner: "Coconut Sevai with Peanuts" },
      { day: "Thursday", breakfast: "Boiled Raw Banana with Chutney", lunch: "White Peas Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Broad Beans Dal Curry with Rice", snack: "Cowpea Sundal", dinner: "Green Peas Usal with Chapati" },
      { day: "Saturday", breakfast: "Aval Upma with Peanuts", lunch: "Bengali Masoor Dal with Rice", snack: "Murmura Black Chana Chaat", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Andhra Fish Mangalorean Curry", snack: "Curry Leaf Buttermilk", dinner: "Urad Dal Cheela with Curd" }
    ]
  },
  // Age 36 | normal | plan3
  {
    age: 36, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Guava Curd Bowl", lunch: "Black-Eyed Pea Curry with Roti", snack: "Murmura Onion Chaat", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Tuesday", breakfast: "Vegetable Rice Sevai", lunch: "Broad Beans Masala with Rice", snack: "Homemade Poha Chivda", dinner: "Moong Dal Handvo" },
      { day: "Wednesday", breakfast: "Urad Dal Cheela", lunch: "Chicken Pepper Fry", snack: "Jowar Puffed Grain Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Thursday", breakfast: "Drumstick Leaves Adai", lunch: "Chana Usal with Bhakri", snack: "Roasted Peanut Jaggery Mix", dinner: "Methi Akki Rotti" },
      { day: "Friday", breakfast: "Vegetable Adai", lunch: "Maharashtrian Amti with Rice", snack: "Roasted Chana Chikki", dinner: "Ragi Dhokla with Curd" },
      { day: "Saturday", breakfast: "Bajra Malt with Jaggery", lunch: "Kala Vatana Usal with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Telangana Chicken Tawa Pepper Roast", snack: "Boiled Corn with Lemon", dinner: "Akki Rotti with Curd" }
    ]
  },
  // Age 36 | normal | plan4
  {
    age: 36, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bottle Gourd Handvo", lunch: "Peas Potato Curry with Roti", snack: "Rice Kanji Drink", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Tuesday", breakfast: "Rava Paniyaram", lunch: "Dill Leaves Curry with Roti", snack: "Plain Homemade Lassi", dinner: "Green Peas Muthia with Curd" },
      { day: "Wednesday", breakfast: "Mixed Dal Adai", lunch: "Andhra Chicken Dry Lemon Roast", snack: "Dry Roasted Corn", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Thursday", breakfast: "Rice Kanji with Curd", lunch: "Lobia Curry with Rice", snack: "Sattu Buttermilk", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Friday", breakfast: "Moong Dal Roti", lunch: "Cowpea Masala with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Vegetable Paniyaram", lunch: "Moong Dal with Sweet Potato", snack: "Poha Jaggery Ladoo", dinner: "Palak Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Methi Muthia", lunch: "Andhra Chicken Black Pepper Fry", snack: "Guava Peanut Chaat", dinner: "Methi Missi Roti with Dal" }
    ]
  },
  // Age 36 | overweight | plan1
  {
    age: 36, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Cauliflower Dal Curry with Roti", snack: "Roasted Corn Peanut Mix", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Potato Peas Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Chicken Pudina Fry", snack: "Black Chana Sundal", dinner: "Methi Handvo with Chutney" },
      { day: "Thursday", breakfast: "Ajwain Missi Roti", lunch: "Potato Beans Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Sattu Curry with Phulka" },
      { day: "Friday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Brinjal Peanut Curry with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Carrot Roti with Dal" },
      { day: "Saturday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Methi Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Banana with Roasted Peanuts", lunch: "Chicken Dry Garlic Roast", snack: "Sattu Jaggery Balls", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 36 | overweight | plan2
  {
    age: 36, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Adai", lunch: "Cowpea Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Jowar Ambli", lunch: "Brinjal Coconut Curry with Rice", snack: "Ragi Buttermilk", dinner: "Radish Roti with Dal" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Chicken Telangana Fry", snack: "Homemade Popcorn with Peanuts", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Jowar Vegetable Pancake", lunch: "Stuffed Brinjal with Roti", snack: "Roasted Gram Balls", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Friday", breakfast: "Rava Kichadi with Peanuts", lunch: "Yam Pepper Curry with Rice", snack: "Homemade Peanut Bar", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Sattu Vegetable Pancake", lunch: "Dal with Drumstick Leaves", snack: "Banana Jaggery Milk", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Sunday", breakfast: "Green Peas Muthia", lunch: "Chicken Onion Pepper Fry with Rice", snack: "Homemade Corn Chivda", dinner: "Mixed Dal Adai with Curd" }
    ]
  },
  // Age 36 | overweight | plan3
  {
    age: 36, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Muthia", lunch: "Chana Dal with Ridge Gourd", snack: "Papaya Coconut Bowl", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Besan Dhokla", lunch: "Toor Dal with Raw Banana", snack: "Ragi Peanut Ladoo", dinner: "Methi Adai with Curd" },
      { day: "Wednesday", breakfast: "Onion Adai", lunch: "Telangana Chicken Sukka", snack: "Cowpea Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Spinach Corn Curry with Rice", snack: "Jaggery Lassi", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Friday", breakfast: "Onion Missi Roti", lunch: "Dal with Carrot and Beans", snack: "Roasted Chana Jaggery Mix", dinner: "Onion Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Millet Vegetable Pancake", lunch: "Peas Potato Curry with Rice", snack: "Homemade Banana Shake", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Telangana Chicken Onion Pepper Fry", snack: "Corn Peanut Sundal", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 36 | overweight | plan4
  {
    age: 36, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "Green Gram Masala with Roti", snack: "Curd Peanut Bowl", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Ragi Kozhukattai", lunch: "Cauliflower Methi Curry with Roti", snack: "Boiled Peanut Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Wednesday", breakfast: "Sattu Roti with Curd", lunch: "Chicken Peanut Fry", snack: "Banana Ragi Balls", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Thursday", breakfast: "Jowar Kanji with Curd", lunch: "Moong Dal with Spinach", snack: "Black-Eyed Pea Sundal", dinner: "Aval Vegetable Kichadi" },
      { day: "Friday", breakfast: "Palak Dhokla", lunch: "Broad Beans Masala with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Rava Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Vegetable Thalipeeth", lunch: "Cauliflower Peas Masala with Rice", snack: "Peanut Chikki", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "North Indian Chicken Coastal Pepper Fry", snack: "Ragi Banana Balls", dinner: "Jowar Ambli with Roti" }
    ]
  },
  // Age 37 | underweight | plan1
  {
    age: 37, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Green Gram Masala with Rice", snack: "Jeera Buttermilk", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Carrot Peas Masala with Roti", snack: "Peanut Chikki", dinner: "Methi Muthia with Dal" },
      { day: "Wednesday", breakfast: "Bajra Rotti with Curd", lunch: "Chicken Tawa Curry Leaf Fry", snack: "Sesame Jaggery Ladoo", dinner: "Stuffed Tindora with Roti" },
      { day: "Thursday", breakfast: "Vegetable Rice Sevai", lunch: "Drumstick Leaves Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Sattu Vegetable Roti", lunch: "Toor Dal with Raw Banana", snack: "Roasted Sweet Corn", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Onion Besan Cheela", lunch: "Carrot Moong Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Carrot Roti with Dal" },
      { day: "Sunday", breakfast: "Vegetable Paniyaram", lunch: "Andhra Chicken Masala Fry", snack: "Ragi Peanut Ladoo", dinner: "Ragi Vegetable Pancake with Curd" }
    ]
  },
  // Age 37 | underweight | plan2
  {
    age: 37, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Vegetable Pancake", lunch: "Chana Dal with Ridge Gourd", snack: "Homemade Poha Chivda", dinner: "Beetroot Masala with Roti" },
      { day: "Tuesday", breakfast: "Chana Dal Cheela", lunch: "Amaranth Leaves Curry with Rice", snack: "Guava Peanut Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Telangana Chicken Punjabi Masala Fry", snack: "Curd Sweet Potato Bowl", dinner: "Aval Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Peanut Banana Bowl", lunch: "Spinach Corn Curry with Rice", snack: "Sesame Chikki", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Cauliflower Methi Curry with Roti", snack: "Banana Sesame Chaat", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Saturday", breakfast: "Vegetable Handvo", lunch: "Drumstick Leaves Dal with Roti", snack: "Curd Peanut Bowl", dinner: "Methi Handvo with Chutney" },
      { day: "Sunday", breakfast: "Moong Dal Handvo", lunch: "Kerala Fish Lemon Roast with Red Rice", snack: "Coconut Jaggery Ladoo", dinner: "Urad Dal Cheela with Curd" }
    ]
  },
  // Age 37 | underweight | plan3
  {
    age: 37, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Drumstick Leaves Adai", lunch: "Cluster Beans Dal Curry with Roti", snack: "Poha Jaggery Ladoo", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Tuesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Sweet Potato Peas Curry with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Stuffed Bhindi with Roti" },
      { day: "Wednesday", breakfast: "Jowar Kanji with Curd", lunch: "Chicken Dry Green Masala Roast", snack: "Bajra Malt Drink", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Carrot Chana Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Jowar Rotti with Dal" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Lemon Sevai with Peanuts" },
      { day: "Saturday", breakfast: "Carrot Besan Cheela", lunch: "Sweet Potato Peas Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Andhra Chicken Fenugreek Fry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 37 | underweight | plan4
  {
    age: 37, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Vegetable Thalipeeth", lunch: "Potato Beans Curry with Roti", snack: "Boiled Yam Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Tuesday", breakfast: "Banana with Roasted Peanuts", lunch: "Kala Vatana Usal with Rice", snack: "Homemade Peanut Bar", dinner: "Onion Adai with Chutney" },
      { day: "Wednesday", breakfast: "Rice Kanji with Curd", lunch: "Coastal Prawn Tawa Fry", snack: "Sattu Jaggery Ladoo", dinner: "White Pea Curry with Phulka" },
      { day: "Thursday", breakfast: "Leftover Rice Paniyaram", lunch: "Potato Methi Curry with Roti", snack: "Homemade Corn Chivda", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Methi Akki Rotti", lunch: "Dill Leaves Dal with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Chana Usal with Bhakri" },
      { day: "Saturday", breakfast: "Methi Besan Cheela", lunch: "Tindora Sesame Curry with Roti", snack: "Roasted Corn Peanut Mix", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Methi Thalipeeth", lunch: "Kerala Prawn Masala Fry with Red Rice", snack: "Ginger Buttermilk", dinner: "Bajra Rotti with Dal" }
    ]
  },
  // Age 37 | normal | plan1
  {
    age: 37, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Moong Dal Dhokla", lunch: "Masoor Dal with Dill Leaves", snack: "Sweet Potato Sesame Balls", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Banana Jowar Pancake", lunch: "Potato Beans Curry with Rice", snack: "Roasted Cowpeas", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Wednesday", breakfast: "Palak Besan Cheela", lunch: "North Indian Chicken Kasuri Methi Fry with", snack: "Roasted Gram Balls", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Thursday", breakfast: "Ragi Sevai Upma", lunch: "Sprouted Moong Curry with Roti", snack: "Rice Kanji Drink", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Banana Ragi Pancake", lunch: "Moong Dal with Sweet Potato", snack: "Puffed Rice Chana Mixture", dinner: "Stuffed Brinjal with Roti" },
      { day: "Saturday", breakfast: "Green Peas Roti", lunch: "Moong Dal with Spinach", snack: "Ragi Puffed Grain Chaat", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "North Indian Chicken Jeera Fry", snack: "Cowpea Sundal", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 37 | normal | plan2
  {
    age: 37, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Raw Banana Masala with Roti", snack: "Sattu Jaggery Balls", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Dal with Carrot and Beans", snack: "Homemade Ragi Savoury Balls", dinner: "Matki Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Carrot Muthia", lunch: "Prawn Coconut Garlic Curry with Rice", snack: "Mint Buttermilk", dinner: "Akki Rotti with Curd" },
      { day: "Thursday", breakfast: "Bottle Gourd Handvo", lunch: "Cauliflower Peas Masala with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Palak Missi Roti with Curd" },
      { day: "Friday", breakfast: "Jowar Muthia", lunch: "Green Peas Usal with Roti", snack: "Roasted Green Gram", dinner: "Green Peas Roti with Curd" },
      { day: "Saturday", breakfast: "Aval Upma with Peanuts", lunch: "Sattu Curry with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Ragi Malt with Jaggery", lunch: "Chicken Dry Coconut Roast with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Jowar Muthia with Dal" }
    ]
  },
  // Age 37 | normal | plan3
  {
    age: 37, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rava Kichadi with Peanuts", lunch: "Broad Beans Dal Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Green Peas Muthia with Curd" },
      { day: "Tuesday", breakfast: "Onion Thalipeeth", lunch: "Black-Eyed Pea Curry with Roti", snack: "Banana Ragi Balls", dinner: "Chana Dal Roti with Curd" },
      { day: "Wednesday", breakfast: "Sattu Cheela", lunch: "Telangana Chicken Telangana Pepper", snack: "Roasted Chana Chikki", dinner: "Jowar Kanji with Dal" },
      { day: "Thursday", breakfast: "Papaya Curd Bowl", lunch: "Peas Potato Curry with Rice", snack: "Murmura Onion Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Jowar Methi Roti", lunch: "Kala Vatana Usal with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "Tindora Peanut Curry with Rice", snack: "Homemade Banana Shake", dinner: "Bharli Vangi with Bhakri" },
      { day: "Sunday", breakfast: "Urad Dal Cheela", lunch: "Telangana Chicken Lemon Herb Roast with", snack: "Black Chana Chaat with Lemon", dinner: "Millet Vegetable Pancake with Curd" }
    ]
  },
  // Age 37 | normal | plan4
  {
    age: 37, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Cowpea Masala with Roti", snack: "Roasted Mung Beans", dinner: "Jowar Ambli with Roti" },
      { day: "Tuesday", breakfast: "Masoor Dal Cheela", lunch: "Maharashtrian Amti with Rice", snack: "Puffed Rice Chikki", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Vegetable Adai", lunch: "Chicken Fenugreek Fry", snack: "Raw Banana Chaat", dinner: "Khaman Dhokla with Curd" },
      { day: "Thursday", breakfast: "Mixed Dal Adai", lunch: "White Peas Curry with Rice", snack: "Peanut Sundal", dinner: "Ragi Rotti with Curd" },
      { day: "Friday", breakfast: "Methi Muthia", lunch: "Chayote Moong Curry with Rice", snack: "Banana Lassi", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Saturday", breakfast: "Moong Dal Roti", lunch: "Lobia Curry with Roti", snack: "Beetroot Peanut Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Ragi Kozhukattai", lunch: "Chicken Pudina Fry", snack: "Jaggery Ragi Milk", dinner: "Moong Dal Dhokla with Chutney" }
    ]
  },
  // Age 37 | overweight | plan1
  {
    age: 37, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Broad Beans Masala with Rice", snack: "Boiled Peanut Chaat", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Beerakaya Pappu with Rice", snack: "Plain Homemade Lassi", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Chana Dal Roti", lunch: "Telangana Chicken Sukka", snack: "Jaggery Lassi", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Boiled Yam with Curd", lunch: "Gongura Pappu with Rice", snack: "Green Gram Chaat", dinner: "Mixed Dal Adai with Curd" },
      { day: "Friday", breakfast: "Vegetable Muthia", lunch: "Cabbage Carrot Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Dudhi Muthia with Curd" },
      { day: "Saturday", breakfast: "Khaman Dhokla", lunch: "Dill Leaves Curry with Roti", snack: "Banana Jaggery Bowl", dinner: "Sattu Cheela with Curd" },
      { day: "Sunday", breakfast: "Guava Curd Bowl", lunch: "Fish Bengali Jhol with Red Rice - 90-100", snack: "Lobia Chaat", dinner: "Jowar Malt with Vegetable Curry" }
    ]
  },
  // Age 37 | overweight | plan2
  {
    age: 37, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Pancake", lunch: "Cowpea Curry with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Sattu Curry with Phulka" },
      { day: "Tuesday", breakfast: "Millet Vegetable Pancake", lunch: "Peas Potato Curry with Roti", snack: "Boiled Chana Chaat with Onion", dinner: "Radish Roti with Dal" },
      { day: "Wednesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Andhra Chicken Dry Coriander Roast", snack: "Murmura Peanut Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Chayote Dal Curry with Roti", snack: "Papaya Lassi", dinner: "Sweet Potato Roti with Curd" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Yam Masala with Roti", snack: "Ragi Peanut Chikki", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Bajra Thalipeeth", lunch: "Potato Peas Curry with Rice", snack: "Homemade Murmura Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Kerala Fish Green Masala Fry with Red", snack: "Cucumber Roasted Chana Chaat", dinner: "Vegetable Sevai with Chana Dal" }
    ]
  },
  // Age 37 | overweight | plan3
  {
    age: 37, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Missi Roti", lunch: "Andhra Mudda Pappu with Rice", snack: "Peanut Poha Chivda", dinner: "Chayote Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Ajwain Missi Roti", lunch: "Raw Mango Dal with Rice", snack: "Sattu Buttermilk", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Wednesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Andhra Chicken Mangalorean Fry", snack: "White Peas Sundal", dinner: "Bajra Ambli with Curd" },
      { day: "Thursday", breakfast: "Rava Paniyaram", lunch: "Masoor Dal with Methi", snack: "Curry Leaf Buttermilk", dinner: "Carrot Muthia with Dal" },
      { day: "Friday", breakfast: "Carrot Roti with Curd", lunch: "Dal with Fenugreek Leaves", snack: "Roasted Peanut Jaggery Mix", dinner: "Ragi Dhokla with Curd" },
      { day: "Saturday", breakfast: "Bajra Malt with Jaggery", lunch: "Moong Dal with Carrot", snack: "White Pea Chaat", dinner: "Rice Kanji with Dal" },
      { day: "Sunday", breakfast: "Green Peas Muthia", lunch: "Andhra Chicken Black Pepper Fry", snack: "Papaya Peanut Chaat", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 37 | overweight | plan4
  {
    age: 37, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Paniyaram", lunch: "Bengali Masoor Dal with Rice", snack: "Roasted Chana Ladoo", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Sweet Potato Roti", lunch: "Stuffed Brinjal with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Roti", lunch: "Telangana Chicken Tomato Pepper Fry with", snack: "Carrot Peanut Chaat", dinner: "Methi Adai with Curd" },
      { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Methi Corn Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Ragi Ambli with Jaggery", lunch: "Amaranth Dal with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Onion Paniyaram", lunch: "Yam Pepper Curry with Rice", snack: "Jowar Chikki", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Bajra Methi Roti", lunch: "Bengali Fish Garlic Pepper Fry", snack: "Ragi Buttermilk", dinner: "Raw Banana Masala with Phulka" }
    ]
  },
  // Age 38 | underweight | plan1
  {
    age: 38, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Guava Curd Bowl", lunch: "Beetroot Masala with Roti", snack: "White Peas Sundal", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Roti", lunch: "Chayote Dal Curry with Roti", snack: "Roasted Green Gram", dinner: "Green Peas Usal with Chapati" },
      { day: "Wednesday", breakfast: "Onion Thalipeeth", lunch: "North Indian Chicken Tomato Pepper Fry", snack: "Roasted Bengal Gram with Onion", dinner: "Methi Handvo with Chutney" },
      { day: "Thursday", breakfast: "Palak Besan Cheela", lunch: "Masoor Dal with Methi", snack: "Bajra Malt Drink", dinner: "Onion Adai with Chutney" },
      { day: "Friday", breakfast: "Bajra Rotti with Curd", lunch: "Potato Methi Curry with Roti", snack: "Jaggery Ragi Milk", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Saturday", breakfast: "Jowar Kanji with Curd", lunch: "Moong Dal with Spinach", snack: "Peanut Chikki", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Sunday", breakfast: "Bajra Malt with Jaggery", lunch: "Andhra Chicken Peanut Fry", snack: "Curd Cucumber Peanut Bowl", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 38 | underweight | plan2
  {
    age: 38, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Pancake", lunch: "Peas Potato Curry with Roti", snack: "Jaggery Lassi", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Drumstick Leaves Dal with Roti", snack: "Beetroot Peanut Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Besan Dhokla", lunch: "Andhra Chicken Drumstick Leaf Fry", snack: "Boiled Peanut Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Cabbage Moong Curry with Roti", snack: "Banana Sesame Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Millet Vegetable Pancake", lunch: "Spinach Corn Curry with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Akki Rotti with Curd" },
      { day: "Saturday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Yam Pepper Curry with Rice", snack: "Jowar Malt Drink", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Sunday", breakfast: "Green Peas Muthia", lunch: "Fish Jeera Fry", snack: "Boiled Corn with Lemon", dinner: "Ragi Vegetable Pancake with Curd" }
    ]
  },
  // Age 38 | underweight | plan3
  {
    age: 38, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Tindora Peanut Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Dudhi Muthia with Curd" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "North Indian Chicken Methi Garlic Roast", snack: "Rice Kanji Drink", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Leftover Rice Paniyaram", lunch: "Yam Masala with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Palak Missi Roti with Curd" },
      { day: "Friday", breakfast: "Moong Dal Roti", lunch: "Amaranth Dal with Roti", snack: "Roasted Gram Balls", dinner: "Sattu Roti with Dal" },
      { day: "Saturday", breakfast: "Rava Paniyaram", lunch: "Cabbage Carrot Curry with Rice", snack: "Green Gram Sundal", dinner: "Jowar Ambli with Roti" },
      { day: "Sunday", breakfast: "Palak Missi Roti", lunch: "Telangana Chicken Dry Pepper Roast with", snack: "Roasted Chana Jaggery Mix", dinner: "Ragi Rotti with Curd" }
    ]
  },
  // Age 38 | underweight | plan4
  {
    age: 38, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Boiled Yam with Curd", lunch: "Lobia Curry with Rice", snack: "Banana Ragi Shake", dinner: "Ragi Ambli with Roti" },
      { day: "Tuesday", breakfast: "Methi Akki Rotti", lunch: "Maharashtrian Amti with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Yam Pepper Curry with Roti" },
      { day: "Wednesday", breakfast: "Vegetable Adai", lunch: "North Indian Chicken Mustard Fry", snack: "Peanut Poha Chivda", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Bottle Gourd Handvo", lunch: "Gujarati Dal with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Ragi Malt with Jaggery", lunch: "Spinach Chana Curry with Roti", snack: "Roasted Chana Ladoo", dinner: "Methi Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Moong Dal Paniyaram", lunch: "Bengali Masoor Dal with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Sattu Cheela with Curd" },
      { day: "Sunday", breakfast: "Onion Missi Roti", lunch: "South Indian Chicken Lemon Ginger Roast", snack: "Ragi Puffed Grain Chaat", dinner: "Cabbage Besan Cheela with Chutney" }
    ]
  },
  // Age 38 | normal | plan1
  {
    age: 38, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Adai", lunch: "Matki Usal with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Tuesday", breakfast: "Bajra Thalipeeth", lunch: "Masoor Dal with Dill Leaves", snack: "Roasted Cowpeas", dinner: "Vegetable Adai with Curd" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "Telangana Chicken Garlic Fry", snack: "Roasted Rice Flake Mixture", dinner: "Chana Dal Roti with Curd" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Dill Leaves Dal with Rice", snack: "Poha Jaggery Ladoo", dinner: "Palak Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Onion Adai", lunch: "Sattu Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Sprouted Moong Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Chana Usal with Bhakri" },
      { day: "Sunday", breakfast: "Ragi Paniyaram", lunch: "Kerala Fish Lemon Roast", snack: "Dry Roasted Corn", dinner: "Ragi Dhokla with Curd" }
    ]
  },
  // Age 38 | normal | plan2
  {
    age: 38, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Carrot Moong Curry with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Rice Sevai", lunch: "Kala Vatana Usal with Roti", snack: "White Pea Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Jowar Thalipeeth", lunch: "Andhra Chicken Coconut Masala Fry with", snack: "Curd Sweet Potato Bowl", dinner: "Khaman Dhokla with Curd" },
      { day: "Thursday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Stuffed Bhindi with Roti", snack: "Ginger Buttermilk", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Beetroot Coconut Curry with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Sattu Curry with Phulka" },
      { day: "Saturday", breakfast: "Papaya Curd Bowl", lunch: "Cowpea Masala with Roti", snack: "Papaya Coconut Bowl", dinner: "Methi Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "South Indian Chicken Methi Fry with Roti", snack: "Homemade Murmura Chaat", dinner: "Moong Dal Dhokla with Chutney" }
    ]
  },
  // Age 38 | normal | plan3
  {
    age: 38, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Urad Dal Cheela", lunch: "Amaranth Leaves Curry with Rice", snack: "Ragi Buttermilk", dinner: "Lobia Curry with Roti" },
      { day: "Tuesday", breakfast: "Onion Paniyaram", lunch: "Brinjal Dal Curry with Roti", snack: "Boiled Yam Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Mixed Dal Cheela", lunch: "Kerala Fish Gongura Curry", snack: "Cowpea Chaat", dinner: "Green Peas Muthia with Curd" },
      { day: "Thursday", breakfast: "Jowar Vegetable Pancake", lunch: "Broad Beans Masala with Rice", snack: "Curd Peanut Bowl", dinner: "Lemon Sevai with Peanuts" },
      { day: "Friday", breakfast: "Banana Ragi Pancake", lunch: "Chayote Moong Curry with Rice", snack: "Roasted Sweet Corn", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Saturday", breakfast: "Onion Besan Cheela", lunch: "Green Gram Masala with Roti", snack: "Banana Lassi", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "South Indian Chicken Tawa Curry Leaf Fry", snack: "Papaya Peanut Chaat", dinner: "Onion Thalipeeth with Curd" }
    ]
  },
  // Age 38 | normal | plan4
  {
    age: 38, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Brinjal Coconut Curry with Rice", snack: "Homemade Poha Chivda", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Tuesday", breakfast: "Dudhi Muthia", lunch: "Brinjal Peanut Curry with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Bajra Ambli", lunch: "Prawn Tamarind Curry with Red Rice - 120", snack: "Homemade Banana Shake", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Sweet Potato Roti", lunch: "Green Gram Masala with Rice", snack: "Jeera Buttermilk", dinner: "Coconut Sevai with Peanuts" },
      { day: "Friday", breakfast: "Ragi Rotti with Chutney", lunch: "Cauliflower Methi Curry with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Jowar Muthia with Dal" },
      { day: "Saturday", breakfast: "Jowar Malt with Milk", lunch: "Cowpea Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Sunday", breakfast: "Ragi Ambli with Jaggery", lunch: "Chicken Methi Garlic Roast", snack: "Guava Peanut Chaat", dinner: "Vegetable Handvo with Curd" }
    ]
  },
  // Age 38 | overweight | plan1
  {
    age: 38, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Cauliflower Dal Curry with Roti", snack: "Ragi Banana Balls", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Vegetable Paniyaram", lunch: "Carrot Peas Masala with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "North Indian Chicken Dhaba Fry", snack: "Ragi Jaggery Ladoo", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Cauliflower Peas Masala with Rice", snack: "Murmura Onion Chaat", dinner: "Radish Roti with Dal" },
      { day: "Friday", breakfast: "Jowar Methi Roti", lunch: "Green Peas Usal with Roti", snack: "Roasted Peanuts with Curry Leaves", dinner: "Onion Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Aval Upma with Peanuts", lunch: "Stuffed Brinjal with Rice", snack: "Puffed Rice Chikki", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Ragi Dhokla", lunch: "Kerala Fish Jeera Fry with Red Rice - 150", snack: "Curry Leaf Buttermilk", dinner: "Green Peas Roti with Curd" }
    ]
  },
  // Age 38 | overweight | plan2
  {
    age: 38, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Carrot Peas Masala with Roti", snack: "Raw Banana Chaat", dinner: "Rice Kanji with Dal" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Ragi Peanut Ladoo", dinner: "Aval Vegetable Kichadi" },
      { day: "Wednesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Andhra Prawn Coconut Garlic Curry with", snack: "Roasted Peanut Jaggery Mix", dinner: "Palak Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Vegetable Handvo", lunch: "Raw Banana Masala with Rice", snack: "Roasted Chana Chikki", dinner: "Methi Adai with Curd" },
      { day: "Friday", breakfast: "Carrot Roti with Curd", lunch: "Broad Beans Dal Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Sattu Vegetable Pancake", lunch: "Moong Dal with Sweet Potato", snack: "Peanut Sundal", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Sunday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Andhra Chicken Mangalorean Fry", snack: "Sweet Potato Peanut Chaat", dinner: "Vegetable Sevai with Chana Dal" }
    ]
  },
  // Age 38 | overweight | plan3
  {
    age: 38, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Sattu Cheela", lunch: "Sweet Potato Peas Curry with Roti", snack: "Boiled Groundnut Salad", dinner: "Vegetable Muthia with Curd" },
      { day: "Tuesday", breakfast: "Mixed Dal Adai", lunch: "Methi Peas Curry with Roti", snack: "Banana Sattu Shake", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Banana Jowar Pancake", lunch: "South Indian Chicken Pan Fry with Roti", snack: "Sattu Buttermilk", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Ragi Banana Malt", lunch: "Sweet Potato Peas Curry with Rice", snack: "Black Chana Sundal", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Moong Dal with Carrot", snack: "Sesame Chikki", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Kala Vatana Usal with Rice", snack: "Banana Jaggery Milk", dinner: "Rava Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Chana Dal Cheela", lunch: "Andhra Chicken Garlic Pepper Fry", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 38 | overweight | plan4
  {
    age: 38, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Ambli", lunch: "Raw Banana Masala with Roti", snack: "Sesame Jaggery Ladoo", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Carrot Chana Curry with Rice", snack: "Sattu Jaggery Balls", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Wednesday", breakfast: "Methi Missi Roti", lunch: "South Indian Chicken Tawa Lemon Fry", snack: "Homemade Ragi Savoury Balls", dinner: "Methi Muthia with Dal" },
      { day: "Thursday", breakfast: "Chana Dal Roti", lunch: "Cluster Beans Dal Curry with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Methi Corn Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Bajra Ambli with Curd" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Sattu Curry with Roti", snack: "Roasted Mung Beans", dinner: "Mixed Dal Adai with Curd" },
      { day: "Sunday", breakfast: "Vegetable Muthia", lunch: "Telangana Chicken Green Pepper Roast", snack: "Puffed Rice Chana Mixture", dinner: "Bajra Rotti with Dal" }
    ]
  },
  // Age 39 | underweight | plan1
  {
    age: 39, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Vegetable Adai", lunch: "Cauliflower Dal Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Tuesday", breakfast: "Rice Kanji with Curd", lunch: "Spinach Chana Curry with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Methi Muthia with Dal" },
      { day: "Wednesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Chicken Tawa Pepper Roast", snack: "Boiled Peanut Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Thursday", breakfast: "Ragi Banana Malt", lunch: "Raw Banana Masala with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Vegetable Adai with Curd" },
      { day: "Friday", breakfast: "Palak Missi Roti", lunch: "Sprouted Moong Curry with Rice", snack: "Guava Peanut Chaat", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Tindora Sesame Curry with Roti", snack: "Papaya Coconut Bowl", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Sunday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "North Indian Chicken Ginger Pepper Fry", snack: "Banana Lassi", dinner: "Onion Besan Cheela with Curd" }
    ]
  },
  // Age 39 | underweight | plan2
  {
    age: 39, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Sevai", lunch: "Cluster Beans Dal Curry with Roti", snack: "Jaggery Ragi Milk", dinner: "Vegetable Muthia with Curd" },
      { day: "Tuesday", breakfast: "Bajra Methi Roti", lunch: "Dal with Fenugreek Leaves", snack: "Cucumber Roasted Chana Chaat", dinner: "Bajra Ambli with Curd" },
      { day: "Wednesday", breakfast: "Onion Besan Cheela", lunch: "South Indian Chicken Telangana Fry with", snack: "White Peas Sundal", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Thursday", breakfast: "Jowar Ambli", lunch: "Cabbage Carrot Curry with Rice", snack: "Jowar Malt Drink", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Friday", breakfast: "Moong Dal Paniyaram", lunch: "Potato Beans Curry with Roti", snack: "Puffed Rice Chikki", dinner: "Palak Missi Roti with Curd" },
      { day: "Saturday", breakfast: "Jowar Malt with Milk", lunch: "Yam Pepper Curry with Rice", snack: "Ginger Buttermilk", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Methi Handvo", lunch: "Prawn Curry Leaf Fry", snack: "Banana Jaggery Milk", dinner: "White Pea Curry with Phulka" }
    ]
  },
  // Age 39 | underweight | plan3
  {
    age: 39, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Onion Missi Roti", lunch: "Kala Vatana Usal with Rice", snack: "Papaya Peanut Chaat", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Dal with Drumstick Leaves", snack: "Jowar Puffed Grain Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Wednesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Chicken Lemon Fry", snack: "Boiled Groundnut Salad", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Carrot Besan Cheela", lunch: "Potato Beans Curry with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Onion Adai with Chutney" },
      { day: "Friday", breakfast: "Ammini Kozhukattai", lunch: "Maharashtrian Amti with Rice", snack: "Homemade Peanut Bar", dinner: "Beetroot Roti with Curd" },
      { day: "Saturday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Masoor Dal with Methi", snack: "Bajra Malt Drink", dinner: "Stuffed Tindora with Roti" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Andhra Chicken Onion Fry with Rice - 150", snack: "Murmura Onion Chaat", dinner: "Radish Roti with Dal" }
    ]
  },
  // Age 39 | underweight | plan4
  {
    age: 39, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Thalipeeth", lunch: "Bharli Vangi with Bhakri", snack: "Roasted Sweet Corn", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Peanut Banana Bowl", lunch: "Matki Usal with Bhakri", snack: "Poha Jaggery Ladoo", dinner: "Chana Dal Roti with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Paniyaram", lunch: "Chicken Coconut Pepper Fry with Roti", snack: "Ragi Banana Balls", dinner: "Khaman Dhokla with Curd" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Chayote Moong Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Friday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Toor Dal with Raw Banana", snack: "Roasted Cowpeas", dinner: "Besan Dhokla with Curd" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Green Gram Masala with Roti", snack: "Roasted Green Gram", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "Chicken Black Pepper Fry", snack: "Murmura Peanut Chaat", dinner: "Methi Besan Cheela with Curd" }
    ]
  },
  // Age 39 | normal | plan1
  {
    age: 39, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Roti", lunch: "Dal with Amaranth Leaves", snack: "Roasted Corn Peanut Mix", dinner: "Chana Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Boiled Yam with Curd", lunch: "Cabbage Moong Curry with Roti", snack: "Roasted Peanuts with Curry Leaves", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "Telangana Chicken Green Pepper Roast", snack: "Sweet Potato Sesame Balls", dinner: "Lobia Curry with Roti" },
      { day: "Thursday", breakfast: "Guava Curd Bowl", lunch: "Green Peas Usal with Roti", snack: "Jeera Buttermilk", dinner: "Palak Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Millet Vegetable Pancake", lunch: "Sattu Curry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Cowpea Masala with Roti", snack: "Peanut Sundal", dinner: "Sattu Cheela with Curd" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "Fish Coconut Pepper Curry", snack: "Homemade Banana Shake", dinner: "Stuffed Brinjal with Roti" }
    ]
  },
  // Age 39 | normal | plan2
  {
    age: 39, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Banana Ragi Pancake", lunch: "Brinjal Coconut Curry with Rice", snack: "White Pea Chaat", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Methi Adai", lunch: "Potato Methi Curry with Roti", snack: "Peanut Chikki", dinner: "Coconut Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Andhra Chicken Mangalorean Fry", snack: "Curd Peanut Bowl", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Thursday", breakfast: "Onion Paniyaram", lunch: "Chana Dal with Spinach", snack: "Roasted Peanut Jaggery Mix", dinner: "Green Peas Usal with Chapati" },
      { day: "Friday", breakfast: "Bajra Thalipeeth", lunch: "Amaranth Dal with Roti", snack: "Green Gram Sundal", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Saturday", breakfast: "Jowar Kanji with Curd", lunch: "Cauliflower Peas Masala with Rice", snack: "Homemade Poha Chivda", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Sunday", breakfast: "Methi Akki Rotti", lunch: "Prawn Tawa Fry", snack: "Roasted Mung Beans", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 39 | normal | plan3
  {
    age: 39, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Methi Corn Curry with Rice", snack: "Cowpea Chaat", dinner: "Raw Banana Masala with Phulka" },
      { day: "Tuesday", breakfast: "Palak Besan Cheela", lunch: "Matki Usal with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Dudhi Muthia with Curd" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Chicken Konkan Fry", snack: "Homemade Jowar Savoury Balls", dinner: "Urad Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Mixed Dal Adai", lunch: "Amaranth Leaves Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Jowar Rotti with Dal" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Stuffed Bhindi with Roti", snack: "Raw Banana Chaat", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Saturday", breakfast: "Banana Jowar Pancake", lunch: "Chayote Dal Curry with Roti", snack: "Jaggery Lassi", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Sunday", breakfast: "Methi Muthia", lunch: "Telangana Chicken Dry Lemon Roast with", snack: "Peanut Jaggery Ladoo", dinner: "Methi Adai with Curd" }
    ]
  },
  // Age 39 | normal | plan4
  {
    age: 39, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Moong Dal Dhokla", lunch: "Peas Potato Curry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Rice Kanji with Dal" },
      { day: "Tuesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "White Peas Masala with Roti", snack: "Sattu Jaggery Ladoo", dinner: "Palak Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Besan Dhokla", lunch: "Andhra Prawn Tamarind Curry", snack: "Bajra Puffed Grain Chaat", dinner: "Rava Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Chana Dal Roti", lunch: "Gongura Pappu with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Urad Dal Cheela", lunch: "Brinjal Dal Curry with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Saturday", breakfast: "Sattu Vegetable Pancake", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Ragi Ambli with Roti" },
      { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "Prawn Green Masala Fry with Red Rice", snack: "Carrot Peanut Chaat", dinner: "Rice Sevai Vegetable Bowl" }
    ]
  },
  // Age 39 | overweight | plan1
  {
    age: 39, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Green Peas Roti", lunch: "Moong Dal with Spinach", snack: "Puffed Rice Chana Mixture", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Ajwain Missi Roti", lunch: "Potato Peas Curry with Rice", snack: "Homemade Murmura Chaat", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Chicken Green Chilli Fry with Roti", snack: "Ragi Peanut Ladoo", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Jowar Thalipeeth", lunch: "Drumstick Leaves Curry with Rice", snack: "Banana Ragi Shake", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Sweet Potato Peas Curry with Roti", snack: "Mint Buttermilk", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Jowar Vegetable Pancake", lunch: "Yam Masala with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "North Indian Chicken Ginger Fry", snack: "Murmura Black Chana Chaat", dinner: "Sattu Curry with Phulka" }
    ]
  },
  // Age 39 | overweight | plan2
  {
    age: 39, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Paniyaram", lunch: "Spinach Corn Curry with Rice", snack: "Peanut Poha Chivda", dinner: "Kala Vatana Usal with Roti" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Carrot Peas Masala with Rice", snack: "Roasted Gram Balls", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Onion Thalipeeth", lunch: "Telangana Chicken Pudina Fry with Rice", snack: "Boiled Corn with Lemon", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Thursday", breakfast: "Carrot Roti with Curd", lunch: "Dill Leaves Curry with Roti", snack: "Sattu Buttermilk", dinner: "Chayote Moong Curry with Roti" },
      { day: "Friday", breakfast: "Ragi Vegetable Roti", lunch: "Tindora Peanut Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Bajra Rotti with Curd", lunch: "Cowpea Curry with Rice", snack: "Black Chana Sundal", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Telangana Chicken Pepper Fry with Roti", snack: "Banana Sattu Shake", dinner: "Vegetable Handvo with Curd" }
    ]
  },
  // Age 39 | overweight | plan3
  {
    age: 39, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Drumstick Leaves Adai", lunch: "Broad Beans Masala with Roti", snack: "Banana Sesame Chaat", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Radish Roti with Curd", lunch: "Andhra Mudda Pappu with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Bottle Gourd Handvo", lunch: "Telangana Chicken Cumin Coriander Roast", snack: "Sesame Jaggery Ladoo", dinner: "Mixed Dal Adai with Curd" },
      { day: "Thursday", breakfast: "Sattu Cheela", lunch: "Beetroot Masala with Roti", snack: "Boiled Yam Chaat", dinner: "Jowar Kanji with Dal" },
      { day: "Friday", breakfast: "Methi Besan Cheela", lunch: "Dill Leaves Dal with Rice", snack: "Cowpea Sundal", dinner: "Jowar Muthia with Dal" },
      { day: "Saturday", breakfast: "Moong Dal Roti", lunch: "Raw Banana Masala with Roti", snack: "Roasted Chana Ladoo", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Ragi Ambli with Jaggery", lunch: "North Indian Chicken Gongura Roast - 120", snack: "Roasted Rice Flake Mixture", dinner: "Jowar Thalipeeth with Dal" }
    ]
  },
  // Age 39 | overweight | plan4
  {
    age: 39, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Peas Potato Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Lemon Sevai with Peanuts" },
      { day: "Tuesday", breakfast: "Jowar Muthia", lunch: "Moong Dal with Sweet Potato", snack: "Ragi Buttermilk", dinner: "Methi Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Chicken Mint Coriander Fry with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Bajra Rotti with Dal" },
      { day: "Thursday", breakfast: "Ragi Vegetable Pancake", lunch: "Sweet Potato Peas Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Ragi Rotti with Curd" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Raw Mango Dal with Rice", snack: "Dry Roasted Corn", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Lobia Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Fish Coriander Lemon Fry", snack: "Coconut Jaggery Ladoo", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 40 | underweight | plan1
  {
    age: 40, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Sweet Potato Peas Curry with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "Methi Peas Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Green Peas Roti with Curd" },
      { day: "Wednesday", breakfast: "Jowar Malt with Milk", lunch: "Chicken Dry Pepper Roast", snack: "White Peas Sundal", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Rice Kanji with Curd", lunch: "Masoor Dal with Methi", snack: "Coconut Jaggery Ladoo", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Friday", breakfast: "Palak Besan Cheela", lunch: "Spinach Corn Curry with Rice", snack: "Banana Ragi Shake", dinner: "Palak Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Ragi Sevai Upma", lunch: "Carrot Peas Masala with Rice", snack: "Bajra Malt Drink", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Chicken Gongura Pepper Fry", snack: "Homemade Ragi Savoury Balls", dinner: "Yam Pepper Curry with Roti" }
    ]
  },
  // Age 40 | underweight | plan2
  {
    age: 40, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Pancake", lunch: "Broad Beans Masala with Rice", snack: "Jaggery Ragi Milk", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Bajra Methi Roti", lunch: "Lobia Curry with Rice", snack: "Curry Leaf Buttermilk", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Banana Ragi Pancake", lunch: "Chicken Jeera Garlic Roast", snack: "Homemade Jowar Savoury Balls", dinner: "Moong Dal Handvo" },
      { day: "Thursday", breakfast: "Bottle Gourd Handvo", lunch: "Cauliflower Methi Curry with Roti", snack: "Roasted Mung Beans", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Methi Adai", lunch: "Kala Vatana Usal with Rice", snack: "Ginger Buttermilk", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Saturday", breakfast: "Jowar Ambli", lunch: "Gongura Pappu with Rice", snack: "Rice Kanji Drink", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Chicken Green Pepper Roast with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Ragi Sevai Vegetable Bowl" }
    ]
  },
  // Age 40 | underweight | plan3
  {
    age: 40, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Pancake", lunch: "Black-Eyed Pea Curry with Rice", snack: "Roasted Green Gram", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Tuesday", breakfast: "Peanut Banana Bowl", lunch: "Peas Potato Curry with Rice", snack: "Poha Jaggery Ladoo", dinner: "Methi Adai with Curd" },
      { day: "Wednesday", breakfast: "Sattu Roti with Curd", lunch: "North Indian Chicken Pepper Roast with", snack: "Banana Jaggery Milk", dinner: "Methi Muthia with Dal" },
      { day: "Thursday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Bengali Masoor Dal with Rice", snack: "Boiled Yam Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Friday", breakfast: "Moong Dal Dhokla", lunch: "Broad Beans Dal Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Jowar Rotti with Dal" },
      { day: "Saturday", breakfast: "Sattu Cheela", lunch: "Potato Methi Curry with Roti", snack: "Black Chana Sundal", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Andhra Chicken Spinach Pepper Fry - 150", snack: "Homemade Popcorn with Peanuts", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 40 | underweight | plan4
  {
    age: 40, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Thalipeeth", lunch: "Drumstick Leaves Dal with Roti", snack: "Roasted Cowpeas", dinner: "Chayote Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Mixed Dal Adai", lunch: "Spinach Chana Curry with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Lobia Curry with Roti" },
      { day: "Wednesday", breakfast: "Ragi Paniyaram", lunch: "Andhra Chicken Pudina Fry with Rice", snack: "Boiled Groundnut Salad", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Thursday", breakfast: "Methi Missi Roti", lunch: "Beerakaya Pappu with Rice", snack: "Sesame Chikki", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Friday", breakfast: "Onion Missi Roti", lunch: "Moong Dal with Sweet Potato", snack: "Peanut Jaggery Ladoo", dinner: "Ragi Ambli with Roti" },
      { day: "Saturday", breakfast: "Green Peas Roti", lunch: "Bharli Vangi with Bhakri", snack: "Ragi Peanut Chikki", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Telangana Chicken Onion Fry with Roti", snack: "Carrot Peanut Chaat", dinner: "Sattu Curry with Phulka" }
    ]
  },
  // Age 40 | normal | plan1
  {
    age: 40, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Vegetable Paniyaram", lunch: "Methi Corn Curry with Rice", snack: "Green Gram Sundal", dinner: "Palak Missi Roti with Curd" },
      { day: "Tuesday", breakfast: "Carrot Muthia", lunch: "Potato Peas Curry with Rice", snack: "Roasted Bengal Gram with Onion", dinner: "Ragi Rotti with Curd" },
      { day: "Wednesday", breakfast: "Onion Thalipeeth", lunch: "Kerala Fish Garlic Pepper Fry with Rice", snack: "Cowpea Sundal", dinner: "Ragi Dhokla with Curd" },
      { day: "Thursday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Potato Beans Curry with Roti", snack: "Roasted Sweet Corn", dinner: "Onion Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Rava Kichadi with Peanuts", lunch: "Black-Eyed Pea Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Stuffed Bhindi with Roti" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Masoor Dal with Dill Leaves", snack: "Cowpea Chaat", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Sunday", breakfast: "Onion Besan Cheela", lunch: "Chicken Konkan Fry", snack: "Puffed Rice Chikki", dinner: "Methi Handvo with Chutney" }
    ]
  },
  // Age 40 | normal | plan2
  {
    age: 40, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Dosakaya Pappu with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Matki Usal with Bhakri", snack: "Roasted Black Chana with Lemon", dinner: "Vegetable Adai with Curd" },
      { day: "Wednesday", breakfast: "Green Peas Muthia", lunch: "Chicken Methi Garlic Roast with Rice", snack: "Banana Lassi", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Leftover Rice Paniyaram", lunch: "Stuffed Brinjal with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Jowar Ambli with Roti" },
      { day: "Friday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Sweet Potato Peas Curry with Rice", snack: "Mint Buttermilk", dinner: "Chana Dal Roti with Curd" },
      { day: "Saturday", breakfast: "Vegetable Rice Sevai", lunch: "Kala Vatana Usal with Roti", snack: "Green Gram Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Jowar Muthia", lunch: "South Indian Chicken Coconut Pepper Fry", snack: "Boiled Corn with Lemon", dinner: "Green Peas Muthia with Curd" }
    ]
  },
  // Age 40 | normal | plan3
  {
    age: 40, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Handvo", lunch: "Yam Masala with Roti", snack: "Murmura Black Chana Chaat", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Green Peas Usal with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Wednesday", breakfast: "Chana Dal Roti", lunch: "Chicken Methi Pepper Fry with Rice - 150", snack: "Guava Peanut Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Thursday", breakfast: "Bajra Ambli", lunch: "Gujarati Dal with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Khaman Dhokla with Curd" },
      { day: "Friday", breakfast: "Jowar Thalipeeth", lunch: "Amaranth Dal with Roti", snack: "Guava Jaggery Bowl", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Drumstick Leaves Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Aval Upma with Peanuts", lunch: "Andhra Chicken Methi Garlic Roast with", snack: "Homemade Poha Chivda", dinner: "Beetroot Masala with Roti" }
    ]
  },
  // Age 40 | normal | plan4
  {
    age: 40, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Banana with Roasted Peanuts", lunch: "Andhra Mudda Pappu with Rice", snack: "Papaya Peanut Chaat", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Sweet Potato Roti", lunch: "Cowpea Curry with Rice", snack: "Curd Peanut Bowl", dinner: "Raw Banana Masala with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Kozhukattai", lunch: "Telangana Chicken Mustard Fry", snack: "Curd Sweet Potato Bowl", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Raw Mango Dal with Rice", snack: "Peanut Sundal", dinner: "Methi Akki Rotti" },
      { day: "Friday", breakfast: "Vegetable Muthia", lunch: "Dill Leaves Dal with Rice", snack: "Lobia Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Saturday", breakfast: "Ragi Vegetable Roti", lunch: "Dal with Fenugreek Leaves", snack: "Roasted Chana Ladoo", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "South Indian Chicken Spinach Pepper Fry", snack: "Black Chana Chaat with Lemon", dinner: "Methi Missi Roti with Dal" }
    ]
  },
  // Age 40 | overweight | plan1
  {
    age: 40, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Thalipeeth", lunch: "Cabbage Moong Curry with Roti", snack: "Boiled Peanut Chaat", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Onion Paniyaram", lunch: "Cauliflower Dal Curry with Roti", snack: "Sattu Buttermilk", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Ragi Malt with Jaggery", lunch: "Telangana Chicken Onion Fry with Rice", snack: "Corn Peanut Sundal", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Ragi Ambli with Jaggery", lunch: "Brinjal Peanut Curry with Rice", snack: "Jowar Malt Drink", dinner: "Chana Usal with Bhakri" },
      { day: "Friday", breakfast: "Besan Dhokla", lunch: "Brinjal Coconut Curry with Rice", snack: "Homemade Corn Chivda", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Saturday", breakfast: "Dudhi Muthia", lunch: "Chana Dal with Ridge Gourd", snack: "Homemade Peanut Bar", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Drumstick Leaves Adai", lunch: "South Indian Chicken Tamarind Fry with", snack: "Jaggery Lassi", dinner: "Rice Kanji with Dal" }
    ]
  },
  // Age 40 | overweight | plan2
  {
    age: 40, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Murmura Peanut Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Tuesday", breakfast: "Jowar Vegetable Pancake", lunch: "Carrot Chana Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Carrot Roti with Curd", lunch: "Andhra Chicken Konkan Fry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Onion Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Raw Banana Masala with Rice", snack: "Banana Sattu Shake", dinner: "Green Peas Usal with Chapati" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Amaranth Leaves Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Sattu Roti with Dal" },
      { day: "Saturday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Raw Banana Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Jowar Methi Roti", lunch: "Prawn Tawa Fry", snack: "Puffed Rice Chana Mixture", dinner: "Chana Dal Cheela with Chutney" }
    ]
  },
  // Age 40 | overweight | plan3
  {
    age: 40, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "Maharashtrian Amti with Rice", snack: "White Pea Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Dill Leaves Curry with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Rava Vegetable Kichadi" },
      { day: "Wednesday", breakfast: "Moong Dal Roti", lunch: "Andhra Chicken Pepper Onion Roast - 120", snack: "Banana Sesame Chaat", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Thursday", breakfast: "Chana Dal Cheela", lunch: "Cluster Beans Dal Curry with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Moong Dal Paniyaram", lunch: "Chayote Dal Curry with Roti", snack: "Ragi Peanut Ladoo", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Saturday", breakfast: "Vegetable Thalipeeth", lunch: "Cabbage Carrot Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Beetroot Roti with Curd", lunch: "South Indian Chicken Andhra Fry - 90-100", snack: "Jeera Buttermilk", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 40 | overweight | plan4
  {
    age: 40, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Urad Dal Cheela", lunch: "Green Gram Masala with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Carrot Roti with Dal" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Toor Dal with Raw Banana", snack: "Homemade Banana Shake", dinner: "Jowar Muthia with Dal" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "South Indian Chicken Tawa Fry with Roti", snack: "Boiled Chana Chaat with Onion", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Sprouted Moong Curry with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Papaya Curd Bowl", lunch: "Stuffed Brinjal with Rice", snack: "Jowar Chikki", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Vegetable Adai", lunch: "Chayote Moong Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Sweet Potato Roti with Curd" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Fish Tomato Masala", snack: "Horse Gram Sundal", dinner: "Lemon Sevai with Peanuts" }
    ]
  },
  // Age 41 | underweight | plan1
  {
    age: 41, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Roasted Green Gram", dinner: "Moong Dal Handvo" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Dill Leaves Curry with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Palak Missi Roti with Curd" },
      { day: "Wednesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Chicken Black Pepper Fry", snack: "Puffed Rice Chikki", dinner: "Stuffed Bhindi with Roti" },
      { day: "Thursday", breakfast: "Ragi Vegetable Pancake", lunch: "Cowpea Curry with Rice", snack: "Boiled Corn with Lemon", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Friday", breakfast: "Lemon Sevai with Peanuts", lunch: "Masoor Dal with Dill Leaves", snack: "Homemade Banana Shake", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Gongura Pappu with Rice", snack: "Ragi Peanut Chikki", dinner: "Radish Roti with Dal" },
      { day: "Sunday", breakfast: "Ragi Banana Malt", lunch: "Kerala Fish Coriander Fry with Rice - 150", snack: "Puffed Rice Chana Mixture", dinner: "Vegetable Thalipeeth with Curd" }
    ]
  },
  // Age 41 | underweight | plan2
  {
    age: 41, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Cabbage Besan Cheela", lunch: "Bharli Vangi with Bhakri", snack: "Poha Jaggery Ladoo", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Drumstick Leaves Adai", lunch: "Chana Dal with Spinach", snack: "Papaya Lassi", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Chana Dal Cheela", lunch: "Andhra Fish Coconut Garlic Curry with Red", snack: "Sattu Jaggery Ladoo", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Thursday", breakfast: "Jowar Methi Roti", lunch: "Amaranth Leaves Curry with Rice", snack: "Murmura Peanut Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Friday", breakfast: "Bottle Gourd Handvo", lunch: "White Peas Masala with Roti", snack: "Jowar Malt Drink", dinner: "Methi Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Raw Banana Masala with Roti", snack: "Mint Buttermilk", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Khaman Dhokla", lunch: "Telangana Chicken Punjabi Masala Fry", snack: "Sesame Chikki", dinner: "Ragi Malt with Roti and Dal" }
    ]
  },
  // Age 41 | underweight | plan3
  {
    age: 41, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Sweet Potato Roti", lunch: "Carrot Peas Masala with Roti", snack: "Banana Sattu Shake", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Moong Dal Roti", lunch: "Matki Usal with Bhakri", snack: "Homemade Murmura Chaat", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Sattu Cheela", lunch: "South Indian Chicken Ginger Coriander", snack: "Roasted Cowpeas", dinner: "Bajra Rotti with Dal" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "White Peas Curry with Rice", snack: "Roasted Mung Beans", dinner: "Ragi Dhokla with Curd" },
      { day: "Friday", breakfast: "Urad Dal Cheela", lunch: "Broad Beans Masala with Roti", snack: "Peanut Sundal", dinner: "Sattu Cheela with Curd" },
      { day: "Saturday", breakfast: "Banana Jowar Pancake", lunch: "Cauliflower Methi Curry with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Raw Banana Masala with Phulka" },
      { day: "Sunday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Chicken Lemon Ginger Roast", snack: "Coconut Jaggery Ladoo", dinner: "Ragi Thalipeeth with Dal" }
    ]
  },
  // Age 41 | underweight | plan4
  {
    age: 41, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rava Kichadi with Peanuts", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Bajra Malt Drink", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Carrot Roti with Curd", lunch: "Tindora Peanut Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Dudhi Muthia with Curd" },
      { day: "Wednesday", breakfast: "Green Peas Roti", lunch: "Chicken Dry Sesame Roast", snack: "Boiled Peanut Chaat", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Peanut Banana Bowl", lunch: "Dal with Carrot and Beans", snack: "Ragi Banana Balls", dinner: "Rava Vegetable Kichadi" },
      { day: "Friday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Black-Eyed Pea Curry with Roti", snack: "Banana Sesame Chaat", dinner: "Jowar Muthia with Dal" },
      { day: "Saturday", breakfast: "Vegetable Adai", lunch: "Brinjal Dal Curry with Roti", snack: "Banana Ragi Shake", dinner: "Methi Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Kerala Fish Curry Leaf Fry with Rice", snack: "Guava Peanut Chaat", dinner: "Palak Besan Cheela with Curd" }
    ]
  },
  // Age 41 | normal | plan1
  {
    age: 41, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Onion Adai", lunch: "Dal with Drumstick Leaves", snack: "Roasted Bengal Gram with Onion", dinner: "Methi Handvo with Chutney" },
      { day: "Tuesday", breakfast: "Methi Handvo", lunch: "Amaranth Dal with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Methi Akki Rotti", lunch: "Chicken Coconut Pepper Fry", snack: "Cucumber Roasted Chana Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Thursday", breakfast: "Onion Missi Roti", lunch: "Sweet Potato Peas Curry with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Palak Missi Roti", lunch: "Potato Beans Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Moong Dal with Sweet Potato", snack: "Horse Gram Sundal", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Sunday", breakfast: "Banana with Roasted Peanuts", lunch: "Prawn Ginger Fry", snack: "Papaya Peanut Chaat", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 41 | normal | plan2
  {
    age: 41, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Moong Dal with Carrot", snack: "Curd Cucumber Peanut Bowl", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Tuesday", breakfast: "Ragi Kozhukattai", lunch: "Green Peas Usal with Roti", snack: "Black Chana Sundal", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Wednesday", breakfast: "Moong Dal Dhokla", lunch: "Chicken Lemon Garlic Roast", snack: "Homemade Peanut Bar", dinner: "Methi Adai with Curd" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Brinjal Coconut Curry with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Friday", breakfast: "Bajra Ambli", lunch: "Chana Dal with Ridge Gourd", snack: "Green Gram Chaat", dinner: "Beetroot Masala with Roti" },
      { day: "Saturday", breakfast: "Methi Adai", lunch: "Dosakaya Pappu with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Jowar Ambli with Roti" },
      { day: "Sunday", breakfast: "Vegetable Thalipeeth", lunch: "Prawn Tawa Fry", snack: "Curry Leaf Buttermilk", dinner: "Rice Kanji with Dal" }
    ]
  },
  // Age 41 | normal | plan3
  {
    age: 41, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Muthia", lunch: "Methi Corn Curry with Rice", snack: "Raw Banana Chaat", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Masoor Dal Cheela", lunch: "Carrot Peas Masala with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Wednesday", breakfast: "Jowar Vegetable Pancake", lunch: "South Indian Chicken Telangana Fry with", snack: "Curd Banana Jaggery Bowl", dinner: "Palak Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Boiled Yam with Curd", lunch: "Methi Peas Curry with Roti", snack: "Dry Roasted Corn", dinner: "Bajra Ambli with Curd" },
      { day: "Friday", breakfast: "Ragi Paniyaram", lunch: "Andhra Mudda Pappu with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Millet Vegetable Pancake", lunch: "Stuffed Tindora with Roti", snack: "Jeera Buttermilk", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Chicken Tawa Ginger Fry", snack: "Cowpea Chaat", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 41 | normal | plan4
  {
    age: 41, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Drumstick Leaves Dal with Roti", snack: "White Pea Chaat", dinner: "Sattu Curry with Phulka" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Lobia Curry with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Mixed Dal Adai with Curd" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "Chicken Ginger Fry", snack: "Roasted Gram Balls", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Potato Beans Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Beetroot Roti with Curd", lunch: "Carrot Chana Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Saturday", breakfast: "Ragi Malt with Jaggery", lunch: "Masoor Dal with Methi", snack: "Ragi Buttermilk", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Fish Ginger Garlic Fry", snack: "Boiled Yam Chaat", dinner: "Stuffed Brinjal with Roti" }
    ]
  },
  // Age 41 | overweight | plan1
  {
    age: 41, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Thalipeeth", lunch: "Potato Peas Curry with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Tuesday", breakfast: "Palak Dhokla", lunch: "Cabbage Carrot Curry with Rice", snack: "Sattu Jaggery Balls", dinner: "Chana Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Chicken Malabar Fry", snack: "Carrot Peanut Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Mixed Dal Cheela", lunch: "Sattu Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Carrot Muthia with Dal" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "Broad Beans Dal Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Toor Dal with Raw Banana", snack: "Homemade Popcorn with Peanuts", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Sunday", breakfast: "Methi Besan Cheela", lunch: "South Indian Chicken Tawa Lemon Fry", snack: "Papaya Coconut Bowl", dinner: "Methi Muthia with Dal" }
    ]
  },
  // Age 41 | overweight | plan2
  {
    age: 41, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Thalipeeth", lunch: "Moong Dal with Spinach", snack: "Curd Peanut Bowl", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Dal with Amaranth Leaves", snack: "Jowar Chikki", dinner: "Sattu Roti with Dal" },
      { day: "Wednesday", breakfast: "Methi Missi Roti", lunch: "Andhra Chicken Mustard Fry with Rice", snack: "Rice Kanji Drink", dinner: "Sweet Potato Roti with Curd" },
      { day: "Thursday", breakfast: "Ragi Ambli with Jaggery", lunch: "Kala Vatana Usal with Rice", snack: "Plain Homemade Lassi", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Friday", breakfast: "Ajwain Missi Roti", lunch: "Carrot Moong Curry with Roti", snack: "Roasted Peanuts with Curry Leaves", dinner: "Green Peas Muthia with Curd" },
      { day: "Saturday", breakfast: "Ragi Dhokla", lunch: "Sattu Curry with Roti", snack: "Beetroot Peanut Chaat", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Palak Besan Cheela", lunch: "Chicken Dry Peanut Roast", snack: "Murmura Black Chana Chaat", dinner: "Yam Pepper Curry with Roti" }
    ]
  },
  // Age 41 | overweight | plan3
  {
    age: 41, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Chana Dal Roti", lunch: "Raw Mango Dal with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Ragi Rotti with Curd" },
      { day: "Tuesday", breakfast: "Sattu Roti with Curd", lunch: "Stuffed Brinjal with Rice", snack: "Ragi Peanut Ladoo", dinner: "Akki Rotti with Curd" },
      { day: "Wednesday", breakfast: "Ammini Kozhukattai", lunch: "South Indian Chicken Punjabi Masala Fry", snack: "Black Chana Chaat with Lemon", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Onion Paniyaram", lunch: "Lobia Curry with Rice", snack: "Homemade Corn Chivda", dinner: "Vegetable Handvo with Curd" },
      { day: "Friday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Matki Usal with Rice", snack: "Banana Ragi Balls", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Gujarati Dal with Rice", snack: "Sattu Buttermilk", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Andhra Fish Gongura Curry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Ragi Vegetable Pancake with Curd" }
    ]
  },
  // Age 41 | overweight | plan4
  {
    age: 41, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Leftover Rice Paniyaram", lunch: "Cauliflower Dal Curry with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Aval Upma with Peanuts", lunch: "Green Gram Masala with Rice", snack: "Homemade Poha Chivda", dinner: "Green Peas Roti with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Muthia", lunch: "Chicken Dry Ginger Roast", snack: "Green Gram Sundal", dinner: "Kala Vatana Usal with Roti" },
      { day: "Thursday", breakfast: "Jowar Muthia", lunch: "Chayote Moong Curry with Rice", snack: "Jaggery Lassi", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Friday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Maharashtrian Amti with Rice", snack: "Banana Lassi", dinner: "Onion Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Jowar Ambli", lunch: "Black-Eyed Pea Curry with Rice", snack: "Murmura Onion Chaat", dinner: "Vegetable Muthia with Curd" },
      { day: "Sunday", breakfast: "Boiled Raw Banana with Chutney", lunch: "South Indian Chicken Coastal Pepper Fry", snack: "Banana Jaggery Bowl", dinner: "Jowar Kanji with Dal" }
    ]
  },
  // Age 42 | underweight | plan1
  {
    age: 42, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Sattu Cheela", lunch: "Yam Masala with Roti", snack: "Ginger Buttermilk", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Ragi Kozhukattai", lunch: "Cabbage Carrot Curry with Rice", snack: "Curry Leaf Buttermilk", dinner: "Lemon Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Carrot Besan Cheela", lunch: "South Indian Chicken Coconut Masala Fry", snack: "Guava Jaggery Bowl", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Thursday", breakfast: "Banana with Roasted Peanuts", lunch: "Green Peas Usal with Roti", snack: "Rice Kanji Drink", dinner: "Stuffed Bhindi with Roti" },
      { day: "Friday", breakfast: "Palak Dhokla", lunch: "Cowpea Masala with Roti", snack: "Ragi Peanut Chikki", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Onion Thalipeeth", lunch: "Cabbage Moong Curry with Roti", snack: "Green Gram Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Telangana Chicken Sukka with Rice", snack: "Papaya Lassi", dinner: "Carrot Roti with Dal" }
    ]
  },
  // Age 42 | underweight | plan2
  {
    age: 42, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Methi Roti", lunch: "Moong Dal with Carrot", snack: "Puffed Rice Peanut Mixture", dinner: "Sattu Curry with Phulka" },
      { day: "Tuesday", breakfast: "Methi Handvo", lunch: "Cauliflower Peas Masala with Rice", snack: "Roasted Mung Beans", dinner: "Methi Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Paniyaram", lunch: "Andhra Prawn Coriander Fry", snack: "Coconut Jaggery Ladoo", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Carrot Peas Masala with Rice", snack: "Bajra Malt Drink", dinner: "Sattu Roti with Dal" },
      { day: "Friday", breakfast: "Millet Vegetable Pancake", lunch: "Methi Corn Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Methi Akki Rotti" },
      { day: "Saturday", breakfast: "Onion Paniyaram", lunch: "Raw Banana Masala with Rice", snack: "Banana Sattu Shake", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Palak Besan Cheela", lunch: "Andhra Chicken Coriander Fry", snack: "Roasted Rice Flake Mixture", dinner: "Mixed Dal Adai with Curd" }
    ]
  },
  // Age 42 | underweight | plan3
  {
    age: 42, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Peas Potato Curry with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Jowar Ambli with Roti" },
      { day: "Tuesday", breakfast: "Vegetable Adai", lunch: "Chayote Moong Curry with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Wednesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Andhra Fish Tomato Masala", snack: "Black Chana Sundal", dinner: "Beetroot Roti with Curd" },
      { day: "Thursday", breakfast: "Boiled Yam with Curd", lunch: "Chana Usal with Bhakri", snack: "Murmura Peanut Chaat", dinner: "Bajra Rotti with Dal" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Moong Dal with Spinach", snack: "Roasted Cowpeas", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Dudhi Muthia", lunch: "Sprouted Moong Curry with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "North Indian Chicken Tawa Ginger Fry", snack: "Cucumber Roasted Chana Chaat", dinner: "Vegetable Adai with Curd" }
    ]
  },
  // Age 42 | underweight | plan4
  {
    age: 42, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Malt with Jaggery", lunch: "Dosakaya Pappu with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Mixed Dal Adai", lunch: "Peas Potato Curry with Rice", snack: "Mint Buttermilk", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "North Indian Chicken Tawa Garlic Fry", snack: "Plain Homemade Lassi", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "Dal with Carrot and Beans", snack: "Banana Ragi Shake", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Friday", breakfast: "Jowar Ambli", lunch: "Potato Peas Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Jowar Rotti with Dal" },
      { day: "Saturday", breakfast: "Besan Dhokla", lunch: "Masoor Dal with Methi", snack: "Bajra Puffed Grain Chaat", dinner: "Beetroot Masala with Roti" },
      { day: "Sunday", breakfast: "Masoor Dal Cheela", lunch: "Chicken Coastal Pepper Fry", snack: "Guava Peanut Chaat", dinner: "Broad Beans Dal Curry with Phulka" }
    ]
  },
  // Age 42 | normal | plan1
  {
    age: 42, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Green Peas Muthia", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Homemade Banana Shake", dinner: "Vegetable Handvo with Curd" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Yam Pepper Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Telangana Chicken Malabar Fry", snack: "Ragi Buttermilk", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Broad Beans Masala with Roti", snack: "Horse Gram Sundal", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Ragi Ambli with Jaggery", lunch: "Stuffed Brinjal with Roti", snack: "Roasted Chana Chikki", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Saturday", breakfast: "Onion Missi Roti", lunch: "Dal with Amaranth Leaves", snack: "Black Chana Chaat with Lemon", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Rava Kichadi with Peanuts", lunch: "Chicken Garlic Coriander Roast", snack: "Poha Jaggery Ladoo", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 42 | normal | plan2
  {
    age: 42, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Muthia", lunch: "Dill Leaves Curry with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Lobia Curry with Roti", snack: "Dry Roasted Corn", dinner: "Green Peas Muthia with Curd" },
      { day: "Wednesday", breakfast: "Methi Muthia", lunch: "South Indian Chicken Kasuri Methi Fry with", snack: "Corn Peanut Sundal", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Sweet Potato Roti", lunch: "Carrot Peas Masala with Roti", snack: "Homemade Murmura Chaat", dinner: "Palak Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Black-Eyed Pea Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Vegetable Muthia with Curd" },
      { day: "Saturday", breakfast: "Chana Dal Roti", lunch: "Brinjal Peanut Curry with Rice", snack: "White Pea Chaat", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Andhra Chicken Tawa Curry Leaf Fry with", snack: "Ragi Jaggery Ladoo", dinner: "Khaman Dhokla with Curd" }
    ]
  },
  // Age 42 | normal | plan3
  {
    age: 42, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Drumstick Leaves Adai", lunch: "Carrot Moong Curry with Roti", snack: "Banana Sesame Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Tuesday", breakfast: "Jowar Methi Roti", lunch: "Amaranth Dal with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Wednesday", breakfast: "Onion Adai", lunch: "Andhra Chicken Pudina Fry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Rava Paniyaram", lunch: "Toor Dal with Raw Banana", snack: "Homemade Poha Chivda", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Friday", breakfast: "Moong Dal Dhokla", lunch: "Tindora Peanut Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Radish Roti with Dal" },
      { day: "Saturday", breakfast: "Aval Upma with Peanuts", lunch: "Dal with Drumstick Leaves", snack: "Peanut Jaggery Ladoo", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Sunday", breakfast: "Methi Adai", lunch: "Andhra Chicken Pan Fry with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 42 | normal | plan4
  {
    age: 42, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Lobia Curry with Rice", snack: "Roasted Chana Ladoo", dinner: "Chana Dal Roti with Curd" },
      { day: "Tuesday", breakfast: "Urad Dal Cheela", lunch: "Bharli Vangi with Bhakri", snack: "Puffed Rice Chana Mixture", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Fish Jeera Fry", snack: "Homemade Peanut Bar", dinner: "Besan Dhokla with Curd" },
      { day: "Thursday", breakfast: "Sattu Roti with Curd", lunch: "Broad Beans Masala with Rice", snack: "Green Gram Sundal", dinner: "Methi Handvo with Chutney" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Moong Dal with Sweet Potato", snack: "Puffed Rice Chikki", dinner: "Methi Muthia with Dal" },
      { day: "Saturday", breakfast: "Banana Ragi Pancake", lunch: "Black-Eyed Pea Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Sunday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "South Indian Chicken Coconut Pepper Fry", snack: "Carrot Peanut Chaat", dinner: "Akki Rotti with Curd" }
    ]
  },
  // Age 42 | overweight | plan1
  {
    age: 42, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Sweet Potato Peas Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Carrot Muthia", lunch: "Methi Peas Curry with Roti", snack: "Sesame Chikki", dinner: "Yam Pepper Curry with Roti" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Pancake", lunch: "Fish Bengali Jhol with Red Rice - 90-100", snack: "Boiled Corn with Lemon", dinner: "Palak Missi Roti with Curd" },
      { day: "Thursday", breakfast: "Methi Besan Cheela", lunch: "Green Gram Masala with Roti", snack: "Ragi Peanut Ladoo", dinner: "Matki Usal with Bhakri" },
      { day: "Friday", breakfast: "Carrot Roti with Curd", lunch: "Cluster Beans Dal Curry with Roti", snack: "Peanut Chikki", dinner: "Ragi Ambli with Roti" },
      { day: "Saturday", breakfast: "Jowar Kanji with Curd", lunch: "Spinach Chana Curry with Roti", snack: "Cowpea Sundal", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Ragi Vegetable Pancake", lunch: "South Indian Chicken Dry Methi Roast with", snack: "Cowpea Chaat", dinner: "Cabbage Chana Dal Curry with Roti" }
    ]
  },
  // Age 42 | overweight | plan2
  {
    age: 42, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Cauliflower Dal Curry with Roti", snack: "Banana Lassi", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Tuesday", breakfast: "Rice Kanji with Curd", lunch: "Kala Vatana Usal with Rice", snack: "Peanut Sundal", dinner: "Sweet Potato Roti with Curd" },
      { day: "Wednesday", breakfast: "Jowar Thalipeeth", lunch: "Coastal Prawn Green Masala Fry", snack: "Homemade Corn Chivda", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Jowar Malt with Milk", lunch: "Drumstick Leaves Dal with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Palak Dhokla with Chutney" },
      { day: "Friday", breakfast: "Green Peas Roti", lunch: "Potato Beans Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Methi Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Broad Beans Dal Curry with Rice", snack: "Ragi Banana Balls", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Bajra Malt with Jaggery", lunch: "North Indian Chicken Pan Fry", snack: "Sweet Potato Sesame Balls", dinner: "Jowar Muthia with Dal" }
    ]
  },
  // Age 42 | overweight | plan3
  {
    age: 42, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Onion Besan Cheela", lunch: "Spinach Corn Curry with Rice", snack: "Roasted Gram Balls", dinner: "Bajra Ambli with Curd" },
      { day: "Tuesday", breakfast: "Bajra Thalipeeth", lunch: "Drumstick Leaves Curry with Rice", snack: "Roasted Sweet Corn", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Wednesday", breakfast: "Vegetable Handvo", lunch: "Andhra Prawn Ginger Garlic Fry with Red", snack: "Homemade Jowar Savoury Balls", dinner: "Onion Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Chana Dal with Ridge Gourd", snack: "Homemade Popcorn with Peanuts", dinner: "Onion Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Potato Beans Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Rava Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Bottle Gourd Handvo", lunch: "Dal with Fenugreek Leaves", snack: "Jeera Buttermilk", dinner: "Moong Dal Handvo" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Chicken Dry Sesame Roast with Rice", snack: "Roasted Green Gram", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 42 | overweight | plan4
  {
    age: 42, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Sevai Upma", lunch: "Green Gram Masala with Rice", snack: "Curd Peanut Bowl", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Bajra Ambli", lunch: "Raw Mango Dal with Rice", snack: "Papaya Coconut Bowl", dinner: "Methi Adai with Curd" },
      { day: "Wednesday", breakfast: "Ragi Rotti with Chutney", lunch: "Telangana Chicken Telangana Pepper", snack: "Murmura Black Chana Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Thursday", breakfast: "Vegetable Muthia", lunch: "Stuffed Brinjal with Rice", snack: "Jaggery Ragi Milk", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Friday", breakfast: "Leftover Rice Paniyaram", lunch: "Sweet Potato Peas Curry with Roti", snack: "Murmura Onion Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Saturday", breakfast: "Palak Missi Roti", lunch: "Sattu Curry with Rice", snack: "Lobia Chaat", dinner: "Stuffed Tindora with Roti" },
      { day: "Sunday", breakfast: "Moong Dal Paniyaram", lunch: "North Indian Chicken Lemon Garlic Roast", snack: "Banana Jaggery Milk", dinner: "Ragi Dhokla with Curd" }
    ]
  },
  // Age 43 | underweight | plan1
  {
    age: 43, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Leftover Rice Paniyaram", lunch: "White Peas Masala with Roti", snack: "Ragi Peanut Chikki", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Onion Besan Cheela", lunch: "Toor Dal with Raw Banana", snack: "Cowpea Sundal", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Wednesday", breakfast: "Ajwain Missi Roti", lunch: "North Indian Chicken Pan Fry", snack: "Papaya Peanut Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Bajra Methi Roti", lunch: "Sweet Potato Peas Curry with Rice", snack: "Jaggery Lassi", dinner: "White Pea Curry with Phulka" },
      { day: "Friday", breakfast: "Ragi Sevai Upma", lunch: "Stuffed Brinjal with Rice", snack: "Guava Peanut Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Saturday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Sattu Curry with Rice", snack: "Sesame Chikki", dinner: "Bajra Rotti with Dal" },
      { day: "Sunday", breakfast: "Vegetable Thalipeeth", lunch: "South Indian Chicken Curry Leaf Garlic", snack: "Murmura Onion Chaat", dinner: "Vegetable Rice Kozhukattai" }
    ]
  },
  // Age 43 | underweight | plan2
  {
    age: 43, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Palak Dhokla", lunch: "Gujarati Dal with Rice", snack: "Curd Peanut Bowl", dinner: "Aval Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Onion Thalipeeth", lunch: "Broad Beans Dal Curry with Rice", snack: "Bajra Malt Drink", dinner: "Chana Dal Roti with Curd" },
      { day: "Wednesday", breakfast: "Ragi Paniyaram", lunch: "Fish Curry Leaf Roast with Red Rice - 120", snack: "Puffed Rice Peanut Mixture", dinner: "Ragi Dhokla with Curd" },
      { day: "Thursday", breakfast: "Onion Adai", lunch: "Cauliflower Dal Curry with Roti", snack: "Carrot Peanut Chaat", dinner: "Stuffed Brinjal with Roti" },
      { day: "Friday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Beetroot Masala with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Jowar Muthia with Dal" },
      { day: "Saturday", breakfast: "Banana Jowar Pancake", lunch: "Chana Dal with Spinach", snack: "Roasted Peanut Jaggery Mix", dinner: "Sattu Cheela with Curd" },
      { day: "Sunday", breakfast: "Sattu Vegetable Pancake", lunch: "Andhra Chicken Dry Methi Roast", snack: "Poha Jaggery Ladoo", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 43 | underweight | plan3
  {
    age: 43, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Muthia", lunch: "Yam Pepper Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Moong Dal Roti", lunch: "Gongura Pappu with Rice", snack: "Banana Ragi Balls", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Telangana Chicken Coconut Masala Fry", snack: "Homemade Ragi Savoury Balls", dinner: "Raw Banana Masala with Phulka" },
      { day: "Thursday", breakfast: "Khaman Dhokla", lunch: "Andhra Mudda Pappu with Rice", snack: "Peanut Chikki", dinner: "Onion Adai with Chutney" },
      { day: "Friday", breakfast: "Ragi Malt with Jaggery", lunch: "Tindora Sesame Curry with Roti", snack: "Boiled Corn with Lemon", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Ragi Thalipeeth", lunch: "Chana Dal with Ridge Gourd", snack: "Roasted Corn Peanut Mix", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Chicken Pan Fry", snack: "Banana Lassi", dinner: "Yam Pepper Curry with Roti" }
    ]
  },
  // Age 43 | underweight | plan4
  {
    age: 43, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Masoor Dal Cheela", lunch: "Methi Peas Curry with Roti", snack: "Roasted Chana Ladoo", dinner: "Radish Roti with Dal" },
      { day: "Tuesday", breakfast: "Mixed Dal Adai", lunch: "Kala Vatana Usal with Rice", snack: "Murmura Black Chana Chaat", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Wednesday", breakfast: "Vegetable Handvo", lunch: "North Indian Chicken Tawa Pepper Roast", snack: "Roasted Rice Flake Mixture", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Rice Kanji with Curd", lunch: "Beerakaya Pappu with Rice", snack: "Roasted Cowpeas", dinner: "Palak Dhokla with Chutney" },
      { day: "Friday", breakfast: "Banana Ragi Pancake", lunch: "Chayote Moong Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Carrot Roti with Dal" },
      { day: "Saturday", breakfast: "Ragi Dhokla", lunch: "Dosakaya Pappu with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Ammini Kozhukattai", lunch: "Telangana Chicken Pepper Onion Roast", snack: "Plain Homemade Lassi", dinner: "Green Peas Muthia with Curd" }
    ]
  },
  // Age 43 | normal | plan1
  {
    age: 43, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Pancake", lunch: "Raw Banana Masala with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Mixed Dal Adai with Curd" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Kala Vatana Usal with Roti", snack: "Puffed Rice Chikki", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Mixed Dal Cheela", lunch: "Fish Mangalorean Curry", snack: "Banana Jaggery Milk", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Thursday", breakfast: "Sattu Vegetable Roti", lunch: "Stuffed Bhindi with Roti", snack: "Roasted Green Gram", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Amaranth Dal with Roti", snack: "Ragi Peanut Ladoo", dinner: "Khaman Dhokla with Curd" },
      { day: "Saturday", breakfast: "Green Peas Roti", lunch: "Brinjal Coconut Curry with Rice", snack: "Rice Kanji Drink", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "Andhra Prawn Mustard Curry", snack: "Sattu Jaggery Ladoo", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 43 | normal | plan2
  {
    age: 43, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Akki Rotti", lunch: "Raw Mango Dal with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Ragi Banana Malt", lunch: "Potato Beans Curry with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Bharli Vangi with Bhakri" },
      { day: "Wednesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "South Indian Chicken Ginger Coriander", snack: "Horse Gram Sundal", dinner: "Akki Rotti with Curd" },
      { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Moong Dal with Sweet Potato", snack: "Papaya Coconut Bowl", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Urad Dal Cheela", lunch: "Methi Corn Curry with Rice", snack: "Boiled Peanut Chaat", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Jowar Muthia", lunch: "Carrot Peas Masala with Rice", snack: "Peanut Sundal", dinner: "Ragi Ambli with Roti" },
      { day: "Sunday", breakfast: "Vegetable Paniyaram", lunch: "Prawn Coriander Lemon Fry", snack: "Black Chana Sundal", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 43 | normal | plan3
  {
    age: 43, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Lobia Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Jowar Ambli with Roti" },
      { day: "Tuesday", breakfast: "Banana with Roasted Peanuts", lunch: "Black-Eyed Pea Curry with Rice", snack: "Homemade Corn Chivda", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Wednesday", breakfast: "Methi Adai", lunch: "Andhra Fish Andhra Pulusu", snack: "Boiled Chana Chaat with Onion", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Masoor Dal with Dill Leaves", snack: "Homemade Banana Shake", dinner: "Sattu Roti with Dal" },
      { day: "Friday", breakfast: "Chana Dal Roti", lunch: "Cauliflower Methi Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Chana Usal with Bhakri" },
      { day: "Saturday", breakfast: "Dudhi Muthia", lunch: "Lobia Curry with Roti", snack: "Banana Sattu Shake", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Sunday", breakfast: "Carrot Roti with Curd", lunch: "Chicken Mint Coriander Fry with Roti", snack: "Roasted Peanuts with Curry Leaves", dinner: "Ammini Kozhukattai with Vegetables" }
    ]
  },
  // Age 43 | normal | plan4
  {
    age: 43, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Cluster Beans Dal Curry with Roti", snack: "Roasted Sweet Corn", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Tuesday", breakfast: "Chana Dal Cheela", lunch: "Cowpea Curry with Rice", snack: "Banana Sesame Chaat", dinner: "Onion Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Bottle Gourd Handvo", lunch: "North Indian Chicken Tawa Ginger Fry", snack: "Banana Jaggery Bowl", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Thursday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Carrot Peas Masala with Roti", snack: "Banana Ragi Shake", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Friday", breakfast: "Millet Vegetable Pancake", lunch: "Matki Usal with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Methi Adai with Curd" },
      { day: "Saturday", breakfast: "Moong Dal Handvo", lunch: "Green Gram Masala with Rice", snack: "Homemade Peanut Bar", dinner: "Green Peas Roti with Curd" },
      { day: "Sunday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "North Indian Chicken Dry Green Masala", snack: "Mint Buttermilk", dinner: "Millet Vegetable Pancake with Curd" }
    ]
  },
  // Age 43 | overweight | plan1
  {
    age: 43, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Dal with Carrot and Beans", snack: "Black Chana Chaat with Lemon", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Bajra Rotti with Curd", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Green Gram Sundal", dinner: "Besan Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Fish Coconut Pepper Curry", snack: "Roasted Gram Balls", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Green Gram Masala with Roti", snack: "Homemade Murmura Chaat", dinner: "Bajra Ambli with Curd" },
      { day: "Friday", breakfast: "Ragi Ambli with Jaggery", lunch: "Chayote Dal Curry with Roti", snack: "Cucumber Roasted Chana Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Saturday", breakfast: "Cabbage Besan Cheela", lunch: "Carrot Chana Curry with Rice", snack: "Sattu Buttermilk", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Andhra Chicken Spinach Pepper Fry with", snack: "Corn Peanut Sundal", dinner: "Green Peas Usal with Chapati" }
    ]
  },
  // Age 43 | overweight | plan2
  {
    age: 43, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Kozhukattai", lunch: "Matki Usal with Bhakri", snack: "Lobia Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Sattu Roti with Curd", lunch: "Masoor Dal with Methi", snack: "Murmura Peanut Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "South Indian Chicken Sesame Pepper", snack: "White Pea Chaat", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Thursday", breakfast: "Methi Thalipeeth", lunch: "Amaranth Leaves Curry with Rice", snack: "Cowpea Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Friday", breakfast: "Onion Paniyaram", lunch: "Cabbage Carrot Curry with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "Bengali Masoor Dal with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Sunday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Chicken Dry Lemon Roast with Rice - 120", snack: "Raw Banana Chaat", dinner: "Methi Missi Roti with Dal" }
    ]
  },
  // Age 43 | overweight | plan3
  {
    age: 43, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Palak Missi Roti", lunch: "Sprouted Moong Curry with Rice", snack: "Sattu Jaggery Balls", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Boiled Yam with Curd", lunch: "Moong Dal with Carrot", snack: "Curry Leaf Buttermilk", dinner: "Sattu Curry with Phulka" },
      { day: "Wednesday", breakfast: "Jowar Kanji with Curd", lunch: "Telangana Chicken Punjabi Masala Fry", snack: "Jowar Chikki", dinner: "Methi Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Broad Beans Masala with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Ragi Rotti with Curd" },
      { day: "Friday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Tindora Peanut Curry with Rice", snack: "Jeera Buttermilk", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Bajra Thalipeeth", lunch: "Sweet Potato Peas Curry with Roti", snack: "Homemade Poha Chivda", dinner: "Methi Handvo with Chutney" },
      { day: "Sunday", breakfast: "Vegetable Muthia", lunch: "Andhra Chicken Peanut Fry with Rice", snack: "Green Gram Chaat", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 43 | overweight | plan4
  {
    age: 43, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sweet Potato Roti", lunch: "Cabbage Moong Curry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Onion Missi Roti", lunch: "Potato Methi Curry with Roti", snack: "Ginger Buttermilk", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Jowar Malt with Milk", lunch: "Bengali Fish Lemon Roast", snack: "Roasted Chana Jaggery Mix", dinner: "Jowar Kanji with Dal" },
      { day: "Thursday", breakfast: "Ragi Vegetable Roti", lunch: "Potato Beans Curry with Rice", snack: "Roasted Mung Beans", dinner: "Dudhi Muthia with Curd" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Cowpea Masala with Roti", snack: "Ragi Buttermilk", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Bajra Ambli", lunch: "Potato Peas Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Vegetable Adai", lunch: "Telangana Chicken Lemon Fry with Rice", snack: "Boiled Groundnut Salad", dinner: "Palak Besan Cheela with Curd" }
    ]
  },
  // Age 44 | underweight | plan1
  {
    age: 44, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Sweet Potato Peas Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Bharli Vangi with Bhakri" },
      { day: "Tuesday", breakfast: "Ragi Kozhukattai", lunch: "Carrot Chana Curry with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Mixed Dal Cheela", lunch: "North Indian Chicken Mint Coriander Fry", snack: "Banana Lassi", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Thursday", breakfast: "Vegetable Handvo", lunch: "Stuffed Bhindi with Roti", snack: "Murmura Black Chana Chaat", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Friday", breakfast: "Jowar Malt with Milk", lunch: "Beetroot Masala with Roti", snack: "Homemade Peanut Bar", dinner: "Carrot Roti with Dal" },
      { day: "Saturday", breakfast: "Lemon Sevai with Peanuts", lunch: "Spinach Chana Curry with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Matki Usal with Bhakri" },
      { day: "Sunday", breakfast: "Beetroot Roti with Curd", lunch: "Telangana Chicken Green Pepper Roast", snack: "Curd Peanut Bowl", dinner: "Vegetable Adai with Curd" }
    ]
  },
  // Age 44 | underweight | plan2
  {
    age: 44, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Chana Dal Cheela", lunch: "Black-Eyed Pea Curry with Roti", snack: "Jeera Buttermilk", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Leftover Rice Paniyaram", lunch: "Chayote Dal Curry with Roti", snack: "White Pea Chaat", dinner: "Chana Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Roti", lunch: "Fish Coriander Lemon Fry with Red Rice", snack: "Sattu Jaggery Ladoo", dinner: "Vegetable Muthia with Curd" },
      { day: "Thursday", breakfast: "Bottle Gourd Handvo", lunch: "Broad Beans Dal Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Moong Dal Handvo" },
      { day: "Friday", breakfast: "Cabbage Besan Cheela", lunch: "Drumstick Leaves Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Ammini Kozhukattai", lunch: "Dill Leaves Dal with Rice", snack: "Roasted Sweet Corn", dinner: "Green Peas Roti with Curd" },
      { day: "Sunday", breakfast: "Carrot Besan Cheela", lunch: "Andhra Chicken Coriander Lemon Fry with", snack: "Papaya Lassi", dinner: "Jowar Rotti with Dal" }
    ]
  },
  // Age 44 | underweight | plan3
  {
    age: 44, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Thalipeeth", lunch: "Matki Usal with Rice", snack: "Plain Homemade Lassi", dinner: "Green Peas Muthia with Curd" },
      { day: "Tuesday", breakfast: "Bajra Rotti with Curd", lunch: "Masoor Dal with Methi", snack: "Ragi Peanut Chikki", dinner: "Methi Adai with Curd" },
      { day: "Wednesday", breakfast: "Palak Dhokla", lunch: "Andhra Fish Lemon Roast", snack: "Rice Kanji Drink", dinner: "Onion Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Onion Adai", lunch: "Masoor Dal with Dill Leaves", snack: "Roasted Bengal Gram with Onion", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Ragi Vegetable Pancake", lunch: "Dal with Fenugreek Leaves", snack: "Beetroot Peanut Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Spinach Corn Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Carrot Roti with Curd", lunch: "South Indian Chicken Lemon Garlic Roast", snack: "Guava Peanut Chaat", dinner: "Palak Besan Cheela with Curd" }
    ]
  },
  // Age 44 | underweight | plan4
  {
    age: 44, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Cauliflower Dal Curry with Roti", snack: "Jaggery Lassi", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Palak Missi Roti", lunch: "Cauliflower Peas Masala with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Jowar Ambli", lunch: "Telangana Chicken Coriander Ginger Roast", snack: "Curd Cucumber Peanut Bowl", dinner: "Ragi Dhokla with Curd" },
      { day: "Thursday", breakfast: "Sattu Roti with Curd", lunch: "Carrot Peas Masala with Roti", snack: "Jowar Malt Drink", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Palak Besan Cheela", lunch: "Lobia Curry with Rice", snack: "Poha Jaggery Ladoo", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Methi Besan Cheela", lunch: "Cluster Beans Dal Curry with Roti", snack: "Horse Gram Sundal", dinner: "Mixed Dal Adai with Curd" },
      { day: "Sunday", breakfast: "Sattu Cheela", lunch: "Chicken Dry Jeera Roast", snack: "Banana Jaggery Bowl", dinner: "Ammini Kozhukattai with Vegetables" }
    ]
  },
  // Age 44 | normal | plan1
  {
    age: 44, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Thalipeeth", lunch: "Dill Leaves Curry with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Tuesday", breakfast: "Vegetable Paniyaram", lunch: "Lobia Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Wednesday", breakfast: "Carrot Muthia", lunch: "Chicken Punjabi Masala Fry", snack: "Puffed Rice Peanut Mixture", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Methi Adai", lunch: "Chayote Moong Curry with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Methi Muthia with Dal" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "Carrot Moong Curry with Roti", snack: "Corn Peanut Sundal", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Brinjal Peanut Curry with Rice", snack: "Ginger Buttermilk", dinner: "Jowar Kanji with Dal" },
      { day: "Sunday", breakfast: "Methi Muthia", lunch: "Chicken Mint Coriander Fry", snack: "Black Chana Sundal", dinner: "Onion Adai with Chutney" }
    ]
  },
  // Age 44 | normal | plan2
  {
    age: 44, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Kala Vatana Usal with Rice", snack: "Puffed Rice Chikki", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Sprouted Moong Curry with Rice", snack: "Sattu Buttermilk", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Wednesday", breakfast: "Moong Dal Dhokla", lunch: "Coastal Prawn Curry Leaf Roast", snack: "Bajra Malt Drink", dinner: "Vegetable Handvo with Curd" },
      { day: "Thursday", breakfast: "Ragi Rotti with Chutney", lunch: "Cowpea Masala with Roti", snack: "Peanut Chikki", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Ragi Ambli with Jaggery", lunch: "Green Gram Masala with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Besan Dhokla with Curd" },
      { day: "Saturday", breakfast: "Vegetable Rice Sevai", lunch: "Beetroot Coconut Curry with Rice", snack: "Sesame Chikki", dinner: "Radish Roti with Dal" },
      { day: "Sunday", breakfast: "Rava Kichadi with Peanuts", lunch: "Andhra Prawn Jeera Fry", snack: "Mint Buttermilk", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 44 | normal | plan3
  {
    age: 44, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Roti", lunch: "Raw Mango Dal with Rice", snack: "Ragi Peanut Ladoo", dinner: "Sattu Roti with Dal" },
      { day: "Tuesday", breakfast: "Methi Thalipeeth", lunch: "Raw Banana Masala with Roti", snack: "Roasted Mung Beans", dinner: "Sattu Curry with Phulka" },
      { day: "Wednesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Chicken Methi Garlic Roast with Roti - 150", snack: "Roasted Green Gram", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Amaranth Dal with Roti", snack: "Roasted Chana Chikki", dinner: "Jowar Muthia with Dal" },
      { day: "Friday", breakfast: "Drumstick Leaves Adai", lunch: "Toor Dal with Raw Banana", snack: "Lobia Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "Beerakaya Pappu with Rice", snack: "Homemade Poha Chivda", dinner: "Bajra Ambli with Curd" },
      { day: "Sunday", breakfast: "Millet Vegetable Pancake", lunch: "Chicken Mint Pepper Roast", snack: "Peanut Sundal", dinner: "Chana Dal Cheela with Chutney" }
    ]
  },
  // Age 44 | normal | plan4
  {
    age: 44, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Dudhi Muthia", lunch: "Yam Masala with Roti", snack: "Roasted Chana Ladoo", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Methi Akki Rotti", lunch: "Gongura Pappu with Rice", snack: "Homemade Banana Shake", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Wednesday", breakfast: "Banana with Roasted Peanuts", lunch: "Fish Lemon Pepper Fry", snack: "Banana Ragi Balls", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Gujarati Dal with Rice", snack: "Papaya Peanut Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Maharashtrian Amti with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Sattu Vegetable Pancake", lunch: "Sprouted Moong Curry with Roti", snack: "Ragi Buttermilk", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Ragi Kanji with Buttermilk", lunch: "North Indian Chicken Dry Masala Fry with", snack: "Sweet Potato Peanut Chaat", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 44 | overweight | plan1
  {
    age: 44, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Cabbage Carrot Curry with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Chana Dal with Ridge Gourd", snack: "Cowpea Sundal", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Wednesday", breakfast: "Methi Missi Roti", lunch: "Telangana Chicken Dry Sesame Roast with", snack: "Homemade Corn Chivda", dinner: "Rava Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Brinjal Dal Curry with Roti", snack: "Dry Roasted Corn", dinner: "Rice Kanji with Dal" },
      { day: "Friday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Bengali Masoor Dal with Rice", snack: "Ragi Banana Balls", dinner: "Carrot Muthia with Dal" },
      { day: "Saturday", breakfast: "Moong Dal Paniyaram", lunch: "Moong Dal with Carrot", snack: "Cowpea Chaat", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Chana Dal Roti", lunch: "North Indian Chicken Dry Peanut Roast", snack: "Roasted Gram Balls", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 44 | overweight | plan2
  {
    age: 44, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sweet Potato Roti", lunch: "Amaranth Leaves Curry with Rice", snack: "Peanut Poha Chivda", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Onion Besan Cheela", lunch: "Potato Beans Curry with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Telangana Chicken Andhra Fry with Roti", snack: "Guava Jaggery Bowl", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Ragi Sevai Upma", lunch: "Chana Dal with Spinach", snack: "Boiled Chana Chaat with Onion", dinner: "Green Peas Usal with Chapati" },
      { day: "Friday", breakfast: "Bajra Malt with Jaggery", lunch: "Green Gram Masala with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Saturday", breakfast: "Ragi Paniyaram", lunch: "Potato Peas Curry with Rice", snack: "Murmura Onion Chaat", dinner: "Khaman Dhokla with Curd" },
      { day: "Sunday", breakfast: "Ragi Dhokla", lunch: "Chicken Gongura Fry", snack: "Curry Leaf Buttermilk", dinner: "Moong Dal Roti with Vegetable Curry" }
    ]
  },
  // Age 44 | overweight | plan3
  {
    age: 44, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Green Peas Roti", lunch: "Brinjal Coconut Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Tuesday", breakfast: "Banana Jowar Pancake", lunch: "Methi Corn Curry with Rice", snack: "Murmura Peanut Chaat", dinner: "Sattu Cheela with Curd" },
      { day: "Wednesday", breakfast: "Rava Paniyaram", lunch: "South Indian Chicken Methi Fry", snack: "Sattu Jaggery Balls", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Thursday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Green Peas Usal with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Masoor Dal Cheela", lunch: "Tindora Peanut Curry with Rice", snack: "Jowar Chikki", dinner: "Palak Missi Roti with Curd" },
      { day: "Saturday", breakfast: "Onion Missi Roti", lunch: "Sattu Curry with Rice", snack: "Boiled Corn with Lemon", dinner: "Chayote Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Jowar Kanji with Curd", lunch: "North Indian Chicken Dry Ginger Roast", snack: "Black Chana Chaat with Lemon", dinner: "Stuffed Tindora with Roti" }
    ]
  },
  // Age 44 | overweight | plan4
  {
    age: 44, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Peanut Banana Bowl", lunch: "Stuffed Brinjal with Rice", snack: "Roasted Cowpeas", dinner: "Chana Dal Roti with Curd" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Black-Eyed Pea Curry with Rice", snack: "White Peas Sundal", dinner: "Raw Banana Masala with Phulka" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Andhra Chicken Curry Leaf Fry with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Urad Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Bajra Methi Roti", lunch: "Cabbage Moong Curry with Roti", snack: "Banana Ragi Shake", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Jowar Vegetable Pancake", lunch: "Potato Beans Curry with Rice", snack: "Green Gram Sundal", dinner: "Stuffed Brinjal with Roti" },
      { day: "Saturday", breakfast: "Khaman Dhokla", lunch: "Raw Banana Masala with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Jowar Muthia", lunch: "North Indian Chicken Pan Fry", snack: "Roasted Chana Jaggery Mix", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 45 | underweight | plan1
  {
    age: 45, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Radish Roti with Curd", lunch: "Peas Potato Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Coconut Sevai with Peanuts" },
      { day: "Tuesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Cabbage Moong Curry with Roti", snack: "Ragi Buttermilk", dinner: "Vegetable Adai with Curd" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "South Indian Chicken Lemon Garlic Roast", snack: "Coconut Jaggery Ladoo", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Khaman Dhokla", lunch: "Brinjal Peanut Curry with Rice", snack: "Ragi Peanut Ladoo", dinner: "Akki Rotti with Curd" },
      { day: "Friday", breakfast: "Jowar Malt with Milk", lunch: "Carrot Moong Curry with Roti", snack: "Banana Sattu Shake", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Saturday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Spinach Chana Curry with Roti", snack: "Roasted Mung Beans", dinner: "Kala Vatana Usal with Roti" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Telangana Chicken Tawa Pepper Roast", snack: "Homemade Murmura Chaat", dinner: "Lemon Sevai with Peanuts" }
    ]
  },
  // Age 45 | underweight | plan2
  {
    age: 45, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Lobia Curry with Rice", snack: "Jeera Buttermilk", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Ragi Rotti with Chutney", lunch: "Dal with Drumstick Leaves", snack: "Papaya Coconut Bowl", dinner: "Vegetable Muthia with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Thalipeeth", lunch: "Andhra Chicken Jeera Pepper Fry", snack: "Ragi Jaggery Ladoo", dinner: "Bharli Vangi with Bhakri" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "Cluster Beans Dal Curry with Roti", snack: "Banana Lassi", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Green Peas Muthia", lunch: "Moong Dal with Carrot", snack: "White Pea Chaat", dinner: "Methi Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Brinjal Dal Curry with Roti", snack: "Jowar Puffed Grain Chaat", dinner: "Stuffed Bhindi with Roti" },
      { day: "Sunday", breakfast: "Carrot Roti with Curd", lunch: "South Indian Chicken Tamarind Fry with", snack: "Raw Banana Chaat", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 45 | underweight | plan3
  {
    age: 45, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Moong Dal Handvo", lunch: "Chana Dal with Ridge Gourd", snack: "Roasted Gram Balls", dinner: "Vegetable Handvo with Curd" },
      { day: "Tuesday", breakfast: "Bajra Rotti with Curd", lunch: "Moong Dal with Spinach", snack: "Banana Sesame Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Methi Missi Roti", lunch: "Andhra Chicken Dry Green Masala Roast", snack: "Carrot Peanut Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Thursday", breakfast: "Banana with Roasted Peanuts", lunch: "Carrot Peas Masala with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Cabbage Besan Cheela", lunch: "Black-Eyed Pea Curry with Roti", snack: "Homemade Corn Chivda", dinner: "Ragi Dhokla with Curd" },
      { day: "Saturday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Cabbage Carrot Curry with Rice", snack: "Peanut Chikki", dinner: "Chayote Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "South Indian Chicken Malabar Fry", snack: "Ragi Banana Balls", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 45 | underweight | plan4
  {
    age: 45, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Methi Akki Rotti", lunch: "Sweet Potato Peas Curry with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Matki Usal with Bhakri", snack: "Sattu Jaggery Ladoo", dinner: "Methi Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Vegetable Muthia", lunch: "North Indian Chicken Ginger Lemon Fry", snack: "Dry Roasted Corn", dinner: "Mixed Dal Adai with Curd" },
      { day: "Thursday", breakfast: "Sattu Cheela", lunch: "Chana Usal with Bhakri", snack: "Guava Jaggery Bowl", dinner: "Methi Handvo with Chutney" },
      { day: "Friday", breakfast: "Chana Dal Roti", lunch: "Dal with Carrot and Beans", snack: "Bajra Puffed Grain Chaat", dinner: "Rice Kanji with Dal" },
      { day: "Saturday", breakfast: "Moong Dal Roti", lunch: "White Peas Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Methi Handvo", lunch: "Chicken Pepper Fry", snack: "Roasted Peanut Jaggery Mix", dinner: "Jowar Muthia with Dal" }
    ]
  },
  // Age 45 | normal | plan1
  {
    age: 45, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Stuffed Brinjal with Rice", snack: "Jaggery Ragi Milk", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Bottle Gourd Handvo", lunch: "Broad Beans Masala with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Wednesday", breakfast: "Ajwain Missi Roti", lunch: "Chicken Garlic Coriander Roast", snack: "Cowpea Chaat", dinner: "Lobia Curry with Roti" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Potato Beans Curry with Rice", snack: "Boiled Peanut Chaat", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Chana Dal with Spinach", snack: "Green Gram Sundal", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Papaya Curd Bowl", lunch: "Potato Beans Curry with Roti", snack: "Plain Homemade Lassi", dinner: "Dudhi Muthia with Curd" },
      { day: "Sunday", breakfast: "Methi Adai", lunch: "Chicken Mustard Pepper Roast", snack: "Rice Kanji Drink", dinner: "Drumstick Leaves Dal with Roti" }
    ]
  },
  // Age 45 | normal | plan2
  {
    age: 45, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Moong Dal Dhokla", lunch: "Cauliflower Methi Curry with Roti", snack: "Curry Leaf Buttermilk", dinner: "Onion Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Beetroot Roti with Curd", lunch: "Chayote Dal Curry with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Kozhukattai", lunch: "Chicken Curry Leaf Onion Roast", snack: "Boiled Corn with Lemon", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Sattu Curry with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Stuffed Brinjal with Roti" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Dill Leaves Dal with Rice", snack: "Cowpea Sundal", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Amaranth Leaves Curry with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Bajra Ambli with Curd" },
      { day: "Sunday", breakfast: "Dudhi Muthia", lunch: "Andhra Chicken Ginger Pepper Fry with", snack: "Banana Jaggery Milk", dinner: "Ragi Sevai Vegetable Bowl" }
    ]
  },
  // Age 45 | normal | plan3
  {
    age: 45, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Matki Usal with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Jowar Muthia", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Papaya Lassi", dinner: "Yam Pepper Curry with Roti" },
      { day: "Wednesday", breakfast: "Onion Besan Cheela", lunch: "Chicken Mint Coriander Fry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Thursday", breakfast: "Palak Dhokla", lunch: "Methi Peas Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Sattu Vegetable Roti", lunch: "Masoor Dal with Dill Leaves", snack: "Puffed Rice Chikki", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Mixed Dal Adai", lunch: "Carrot Chana Curry with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Ragi Ambli with Roti" },
      { day: "Sunday", breakfast: "Palak Besan Cheela", lunch: "Chicken Coriander Lemon Fry", snack: "Roasted Bengal Gram with Onion", dinner: "Jowar Rotti with Dal" }
    ]
  },
  // Age 45 | normal | plan4
  {
    age: 45, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Yam Masala with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Jowar Vegetable Pancake", lunch: "Raw Banana Masala with Roti", snack: "Banana Ragi Balls", dinner: "Ragi Rotti with Curd" },
      { day: "Wednesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Andhra Chicken Garlic Fry with Roti - 120", snack: "Ginger Buttermilk", dinner: "Sattu Cheela with Curd" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Gongura Pappu with Rice", snack: "White Peas Sundal", dinner: "Green Peas Usal with Chapati" },
      { day: "Friday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Green Gram Masala with Roti", snack: "Murmura Onion Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Jowar Kanji with Curd", lunch: "Dosakaya Pappu with Rice", snack: "Banana Jaggery Bowl", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Chicken Lemon Garlic Roast with Roti", snack: "Corn Peanut Sundal", dinner: "Khaman Dhokla with Curd" }
    ]
  },
  // Age 45 | overweight | plan1
  {
    age: 45, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Methi Roti", lunch: "Cowpea Masala with Roti", snack: "Horse Gram Sundal", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Roti", lunch: "Raw Mango Dal with Rice", snack: "Roasted Sweet Corn", dinner: "Beetroot Masala with Roti" },
      { day: "Wednesday", breakfast: "Ragi Malt with Jaggery", lunch: "Kerala Fish Mustard Fry", snack: "Peanut Sundal", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Ragi Dhokla", lunch: "Dal with Fenugreek Leaves", snack: "Sweet Potato Sesame Balls", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Dal with Amaranth Leaves", snack: "Curd Roasted Chana Bowl", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Saturday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Andhra Mudda Pappu with Rice", snack: "Murmura Peanut Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Sunday", breakfast: "Methi Muthia", lunch: "Telangana Chicken Garlic Lemon Fry with", snack: "Puffed Rice Peanut Mixture", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 45 | overweight | plan2
  {
    age: 45, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Palak Missi Roti", lunch: "Potato Peas Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Tuesday", breakfast: "Vegetable Handvo", lunch: "Maharashtrian Amti with Rice", snack: "Sattu Buttermilk", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Drumstick Leaves Adai", lunch: "Chicken Dry Coconut Roast with Roti", snack: "Roasted Cowpeas", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Banana Ragi Pancake", lunch: "Dill Leaves Curry with Roti", snack: "Jowar Malt Drink", dinner: "Carrot Muthia with Dal" },
      { day: "Friday", breakfast: "Onion Paniyaram", lunch: "Potato Methi Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Sprouted Moong Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Sunday", breakfast: "Moong Dal Paniyaram", lunch: "Kerala Prawn Mustard Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Rava Vegetable Kichadi" }
    ]
  },
  // Age 45 | overweight | plan3
  {
    age: 45, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Ambli", lunch: "Spinach Corn Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Peas Potato Curry with Roti", snack: "Curd Peanut Bowl", dinner: "Carrot Roti with Dal" },
      { day: "Wednesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Chicken Coriander Pepper Fry", snack: "Peanut Poha Chivda", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Methi Besan Cheela", lunch: "Drumstick Leaves Curry with Rice", snack: "Sattu Jaggery Balls", dinner: "Sattu Curry with Phulka" },
      { day: "Friday", breakfast: "Aval Upma with Peanuts", lunch: "Amaranth Dal with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Green Peas Usal with Roti", snack: "Jowar Chikki", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Sunday", breakfast: "Vegetable Rice Sevai", lunch: "Coastal Prawn Curry Leaf Roast", snack: "Roasted Corn Peanut Mix", dinner: "Green Peas Roti with Curd" }
    ]
  },
  // Age 45 | overweight | plan4
  {
    age: 45, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sattu Roti with Curd", lunch: "Gujarati Dal with Rice", snack: "Guava Peanut Chaat", dinner: "Palak Missi Roti with Curd" },
      { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "Tindora Peanut Curry with Rice", snack: "Homemade Banana Shake", dinner: "Methi Muthia with Dal" },
      { day: "Wednesday", breakfast: "Onion Adai", lunch: "Chicken Onion Pepper Fry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Green Peas Muthia with Curd" },
      { day: "Thursday", breakfast: "Bajra Thalipeeth", lunch: "Cowpea Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Onion Missi Roti", lunch: "Raw Banana Masala with Rice", snack: "Jaggery Lassi", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Green Peas Roti", lunch: "Moong Dal with Sweet Potato", snack: "Ragi Peanut Chikki", dinner: "Palak Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Vegetable Adai", lunch: "Fish Coriander Fry with Red Rice - 90-100", snack: "Puffed Rice Chana Mixture", dinner: "Methi Adai with Curd" }
    ]
  },
  // Age 46 | underweight | plan1
  {
    age: 46, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Methi Roti", lunch: "Brinjal Dal Curry with Roti", snack: "Carrot Peanut Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Tuesday", breakfast: "Jowar Vegetable Pancake", lunch: "Potato Beans Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Andhra Prawn Tamarind Curry", snack: "Puffed Rice Chana Mixture", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Peas Potato Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Jowar Kanji with Dal" },
      { day: "Friday", breakfast: "Bajra Malt with Jaggery", lunch: "Chana Dal with Ridge Gourd", snack: "Beetroot Peanut Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Saturday", breakfast: "Ragi Ambli with Jaggery", lunch: "Carrot Chana Curry with Rice", snack: "Jowar Malt Drink", dinner: "Carrot Muthia with Dal" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Chicken Black Pepper Fry", snack: "Sesame Chikki", dinner: "Methi Adai with Curd" }
    ]
  },
  // Age 46 | underweight | plan2
  {
    age: 46, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Dal with Carrot and Beans", snack: "Coconut Jaggery Ladoo", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Ragi Dhokla", lunch: "Beetroot Masala with Roti", snack: "Raw Banana Chaat", dinner: "Carrot Roti with Dal" },
      { day: "Wednesday", breakfast: "Papaya Curd Bowl", lunch: "Andhra Chicken Peanut Fry with Rice", snack: "Roasted Gram Balls", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Onion Adai", lunch: "Potato Peas Curry with Rice", snack: "Cowpea Chaat", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Broad Beans Masala with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Sattu Roti with Dal" },
      { day: "Saturday", breakfast: "Vegetable Handvo", lunch: "Dill Leaves Dal with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Sweet Potato Roti with Curd" },
      { day: "Sunday", breakfast: "Ammini Kozhukattai", lunch: "Chicken Ginger Pepper Fry", snack: "Ragi Buttermilk", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 46 | underweight | plan3
  {
    age: 46, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Chana Dal Roti", lunch: "Cauliflower Dal Curry with Roti", snack: "Boiled Groundnut Salad", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Vegetable Muthia", lunch: "Cabbage Carrot Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Wednesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Chicken Coconut Fry", snack: "White Pea Chaat", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Spinach Chana Curry with Roti", snack: "Bajra Malt Drink", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Friday", breakfast: "Vegetable Adai", lunch: "Gujarati Dal with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Sweet Potato Peas Curry with Rice", snack: "Roasted Chana Ladoo", dinner: "Palak Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Sattu Roti with Curd", lunch: "Telangana Chicken Garlic Fry", snack: "Dry Roasted Corn", dinner: "Jowar Rotti with Dal" }
    ]
  },
  // Age 46 | underweight | plan4
  {
    age: 46, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Banana Jowar Pancake", lunch: "Potato Methi Curry with Roti", snack: "Murmura Black Chana Chaat", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Methi Adai", lunch: "Kala Vatana Usal with Roti", snack: "Homemade Corn Chivda", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Pancake", lunch: "Telangana Chicken Mangalorean Fry with", snack: "Ragi Puffed Grain Chaat", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Thursday", breakfast: "Methi Akki Rotti", lunch: "Matki Usal with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Palak Missi Roti with Curd" },
      { day: "Friday", breakfast: "Millet Vegetable Pancake", lunch: "Green Gram Masala with Rice", snack: "Jowar Chikki", dinner: "Bajra Rotti with Dal" },
      { day: "Saturday", breakfast: "Methi Muthia", lunch: "Dill Leaves Curry with Roti", snack: "Mint Buttermilk", dinner: "Bharli Vangi with Bhakri" },
      { day: "Sunday", breakfast: "Ragi Vegetable Pancake", lunch: "Chicken Tawa Coriander Fry", snack: "Green Gram Sundal", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 46 | normal | plan1
  {
    age: 46, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Roti", lunch: "Lobia Curry with Roti", snack: "Homemade Poha Chivda", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Yam Masala with Roti", snack: "Plain Homemade Lassi", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Rava Paniyaram", lunch: "Andhra Chicken Curry Leaf Fry with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Akki Rotti with Curd" },
      { day: "Thursday", breakfast: "Jowar Kanji with Curd", lunch: "Moong Dal with Spinach", snack: "Black Chana Sundal", dinner: "Onion Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Carrot Roti with Curd", lunch: "Potato Beans Curry with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Raw Banana Masala with Phulka" },
      { day: "Saturday", breakfast: "Banana Ragi Pancake", lunch: "Matki Usal with Bhakri", snack: "Bajra Puffed Grain Chaat", dinner: "Methi Muthia with Dal" },
      { day: "Sunday", breakfast: "Moong Dal Dhokla", lunch: "Chicken Dry Methi Roast with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 46 | normal | plan2
  {
    age: 46, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Palak Missi Roti", lunch: "Chayote Dal Curry with Roti", snack: "Green Gram Chaat", dinner: "Methi Handvo with Chutney" },
      { day: "Tuesday", breakfast: "Vegetable Thalipeeth", lunch: "Beetroot Coconut Curry with Rice", snack: "Rice Kanji Drink", dinner: "Aval Vegetable Kichadi" },
      { day: "Wednesday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Bengali Fish Jeera Fry", snack: "Homemade Banana Shake", dinner: "Jowar Muthia with Dal" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Andhra Mudda Pappu with Rice", snack: "Peanut Sundal", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Cabbage Besan Cheela", lunch: "Tindora Peanut Curry with Rice", snack: "Ginger Buttermilk", dinner: "Rice Kanji with Dal" },
      { day: "Saturday", breakfast: "Mixed Dal Adai", lunch: "Broad Beans Masala with Rice", snack: "Jaggery Lassi", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Green Peas Muthia", lunch: "Andhra Chicken Peanut Fry with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Stuffed Brinjal with Roti" }
    ]
  },
  // Age 46 | normal | plan3
  {
    age: 46, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Broad Beans Dal Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Chana Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Masoor Dal Cheela", lunch: "Green Gram Masala with Roti", snack: "Banana Ragi Shake", dinner: "Onion Adai with Chutney" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Roti", lunch: "South Indian Chicken Mangalorean Fry", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Ragi Banana Malt", lunch: "Dal with Drumstick Leaves", snack: "Lobia Chaat", dinner: "Moong Dal Handvo" },
      { day: "Friday", breakfast: "Ajwain Missi Roti", lunch: "Cabbage Moong Curry with Roti", snack: "Homemade Murmura Chaat", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Saturday", breakfast: "Jowar Malt with Milk", lunch: "Brinjal Peanut Curry with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Mixed Dal Adai with Curd" },
      { day: "Sunday", breakfast: "Sattu Cheela", lunch: "Chicken Onion Pepper Fry", snack: "White Peas Sundal", dinner: "Onion Besan Cheela with Curd" }
    ]
  },
  // Age 46 | normal | plan4
  {
    age: 46, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Muthia", lunch: "Carrot Moong Curry with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Moong Dal Paniyaram", lunch: "Moong Dal with Carrot", snack: "Roasted Green Gram", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Onion Thalipeeth", lunch: "Kerala Fish Tamarind Pepper Fry", snack: "Roasted Cowpeas", dinner: "Khaman Dhokla with Curd" },
      { day: "Thursday", breakfast: "Chana Dal Cheela", lunch: "Methi Corn Curry with Rice", snack: "Homemade Peanut Bar", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "White Peas Masala with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Beetroot Roti with Curd" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Toor Dal with Raw Banana", snack: "Guava Jaggery Bowl", dinner: "Bajra Ambli with Curd" },
      { day: "Sunday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "North Indian Chicken Ginger Coriander", snack: "Roasted Mung Beans", dinner: "Green Peas Roti with Curd" }
    ]
  },
  // Age 46 | overweight | plan1
  {
    age: 46, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Amaranth Leaves Curry with Rice", snack: "Poha Jaggery Ladoo", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Bottle Gourd Handvo", lunch: "Lobia Curry with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Urad Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Drumstick Leaves Adai", lunch: "Telangana Chicken Cumin Coriander Roast", snack: "Murmura Onion Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Dudhi Muthia", lunch: "Bengali Masoor Dal with Rice", snack: "Banana Jaggery Bowl", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Raw Banana Masala with Roti", snack: "Ragi Banana Balls", dinner: "Vegetable Muthia with Curd" },
      { day: "Saturday", breakfast: "Jowar Methi Roti", lunch: "Masoor Dal with Methi", snack: "Peanut Poha Chivda", dinner: "Dudhi Muthia with Curd" },
      { day: "Sunday", breakfast: "Green Peas Roti", lunch: "Prawn Coconut Curry", snack: "Cowpea Sundal", dinner: "Jowar Thalipeeth with Dal" }
    ]
  },
  // Age 46 | overweight | plan2
  {
    age: 46, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Leftover Rice Paniyaram", lunch: "Moong Dal with Sweet Potato", snack: "Banana Sesame Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Chayote Moong Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Wednesday", breakfast: "Khaman Dhokla", lunch: "Andhra Chicken Coastal Pepper Fry - 150", snack: "Curry Leaf Buttermilk", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Thursday", breakfast: "Onion Paniyaram", lunch: "Spinach Corn Curry with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Chana Dal with Spinach", snack: "Roasted Sweet Corn", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Green Peas Usal with Roti", snack: "Ragi Peanut Chikki", dinner: "Rava Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Kerala Prawn Coconut Garlic Curry with", snack: "Jaggery Ragi Milk", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 46 | overweight | plan3
  {
    age: 46, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Dal with Amaranth Leaves", snack: "Banana Sattu Shake", dinner: "Stuffed Bhindi with Roti" },
      { day: "Tuesday", breakfast: "Methi Thalipeeth", lunch: "Black-Eyed Pea Curry with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Fish Coconut Curry", snack: "Ragi Peanut Ladoo", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Thursday", breakfast: "Boiled Yam with Curd", lunch: "Methi Peas Curry with Roti", snack: "Banana Jaggery Milk", dinner: "Ragi Rotti with Curd" },
      { day: "Friday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Masoor Dal with Dill Leaves", snack: "Curd Peanut Bowl", dinner: "Chana Dal Roti with Curd" },
      { day: "Saturday", breakfast: "Moong Dal Roti", lunch: "Raw Mango Dal with Rice", snack: "Banana Ragi Balls", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Jowar Thalipeeth", lunch: "Prawn Ginger Garlic Fry", snack: "Puffed Rice Chikki", dinner: "Stuffed Tindora with Roti" }
    ]
  },
  // Age 46 | overweight | plan4
  {
    age: 46, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Dal with Fenugreek Leaves", snack: "Guava Peanut Chaat", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Ragi Malt with Jaggery", lunch: "Sattu Curry with Rice", snack: "Horse Gram Sundal", dinner: "Vegetable Adai with Curd" },
      { day: "Wednesday", breakfast: "Methi Handvo", lunch: "Telangana Chicken Peanut Fry", snack: "Curd Sweet Potato Bowl", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Brinjal Coconut Curry with Rice", snack: "Murmura Peanut Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Friday", breakfast: "Vegetable Paniyaram", lunch: "Peas Potato Curry with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Methi Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "White Peas Curry with Rice", snack: "Papaya Lassi", dinner: "Lemon Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Chicken Spinach Pepper Fry", snack: "Black-Eyed Pea Sundal", dinner: "Vegetable Sevai with Chana Dal" }
    ]
  },
  // Age 47 | underweight | plan1
  {
    age: 47, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Missi Roti", lunch: "Sprouted Moong Curry with Rice", snack: "Black Chana Sundal", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Vegetable Paniyaram", lunch: "Stuffed Bhindi with Roti", snack: "Jowar Chikki", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Telangana Chicken Dry Peanut Roast", snack: "White Pea Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Thursday", breakfast: "Sattu Vegetable Pancake", lunch: "Moong Dal with Carrot", snack: "Green Gram Chaat", dinner: "Lemon Sevai with Peanuts" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Dal with Amaranth Leaves", snack: "Puffed Rice Peanut Mixture", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Saturday", breakfast: "Moong Dal Roti", lunch: "Dal with Carrot and Beans", snack: "Mint Buttermilk", dinner: "Kala Vatana Usal with Roti" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Andhra Fish Lemon Pepper Fry", snack: "Poha Jaggery Ladoo", dinner: "Carrot Peas Masala with Phulka" }
    ]
  },
  // Age 47 | underweight | plan2
  {
    age: 47, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Malt with Jaggery", lunch: "Maharashtrian Amti with Rice", snack: "Carrot Peanut Chaat", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Tuesday", breakfast: "Jowar Methi Roti", lunch: "Sprouted Moong Curry with Roti", snack: "Jowar Puffed Grain Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Wednesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Chicken Mint Pepper Roast with Roti - 120", snack: "Papaya Lassi", dinner: "Akki Rotti with Curd" },
      { day: "Thursday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Aval Vegetable Kichadi" },
      { day: "Friday", breakfast: "Rice Kanji with Curd", lunch: "Dal with Fenugreek Leaves", snack: "Bajra Puffed Grain Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Saturday", breakfast: "Onion Adai", lunch: "Sweet Potato Peas Curry with Roti", snack: "Boiled Corn with Lemon", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Sunday", breakfast: "Jowar Kanji with Curd", lunch: "Andhra Fish Coriander Fry", snack: "Roasted Peanuts with Curry Leaves", dinner: "Ragi Dhokla with Curd" }
    ]
  },
  // Age 47 | underweight | plan3
  {
    age: 47, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Carrot Peas Masala with Roti", snack: "Banana Jaggery Bowl", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Ragi Paniyaram", lunch: "Lobia Curry with Rice", snack: "Cowpea Sundal", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "Telangana Chicken Malabar Fry", snack: "Sweet Potato Sesame Balls", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Thursday", breakfast: "Leftover Rice Paniyaram", lunch: "Peas Potato Curry with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Stuffed Brinjal with Roti" },
      { day: "Friday", breakfast: "Jowar Vegetable Pancake", lunch: "Gujarati Dal with Rice", snack: "Banana Lassi", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Vegetable Adai", lunch: "Cauliflower Peas Masala with Rice", snack: "Banana Jaggery Milk", dinner: "Raw Banana Masala with Phulka" },
      { day: "Sunday", breakfast: "Banana Ragi Pancake", lunch: "Prawn Green Masala Fry with Red Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Carrot Muthia with Dal" }
    ]
  },
  // Age 47 | underweight | plan4
  {
    age: 47, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Carrot Roti with Curd", lunch: "Sattu Curry with Roti", snack: "Guava Peanut Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Sattu Roti with Curd", lunch: "Yam Masala with Roti", snack: "Peanut Chikki", dinner: "Vegetable Adai with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Thalipeeth", lunch: "Chicken Curry Leaf Onion Roast", snack: "Homemade Murmura Chaat", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Spinach Corn Curry with Rice", snack: "Roasted Chana Ladoo", dinner: "Methi Adai with Curd" },
      { day: "Friday", breakfast: "Ragi Rotti with Chutney", lunch: "Dal with Drumstick Leaves", snack: "Lobia Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Bajra Rotti with Curd", lunch: "Brinjal Coconut Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Radish Roti with Dal" },
      { day: "Sunday", breakfast: "Ragi Vegetable Pancake", lunch: "Andhra Fish Curry Leaf Roast with Red", snack: "Murmura Black Chana Chaat", dinner: "Cabbage Besan Cheela with Chutney" }
    ]
  },
  // Age 47 | normal | plan1
  {
    age: 47, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Muthia", lunch: "Green Gram Masala with Rice", snack: "Ragi Buttermilk", dinner: "Sweet Potato Roti with Curd" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Moong Dal with Spinach", snack: "Sesame Chikki", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Wednesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "South Indian Chicken Mint Coriander Fry", snack: "Puffed Rice Chikki", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Bajra Methi Roti", lunch: "Stuffed Tindora with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Friday", breakfast: "Ragi Kozhukattai", lunch: "Potato Beans Curry with Rice", snack: "Horse Gram Sundal", dinner: "Ragi Ambli with Roti" },
      { day: "Saturday", breakfast: "Cabbage Besan Cheela", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Ragi Peanut Ladoo", dinner: "Bajra Rotti with Dal" },
      { day: "Sunday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Kerala Fish Coconut Pepper Curry", snack: "Ginger Buttermilk", dinner: "Methi Akki Rotti" }
    ]
  },
  // Age 47 | normal | plan2
  {
    age: 47, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Sattu Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Sattu Roti with Dal" },
      { day: "Tuesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Methi Peas Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Palak Missi Roti with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Rice Sevai", lunch: "Andhra Chicken Coriander Ginger Roast", snack: "Dry Roasted Corn", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Thursday", breakfast: "Onion Paniyaram", lunch: "Yam Pepper Curry with Rice", snack: "Banana Sattu Shake", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Palak Besan Cheela", lunch: "Cauliflower Dal Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Stuffed Brinjal with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Jowar Muthia with Dal" },
      { day: "Sunday", breakfast: "Aval Upma with Peanuts", lunch: "Fish Gongura Curry with Red Rice", snack: "Roasted Black Chana with Lemon", dinner: "Yam Pepper Curry with Roti" }
    ]
  },
  // Age 47 | normal | plan3
  {
    age: 47, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Brinjal Peanut Curry with Rice", snack: "Boiled Peanut Chaat", dinner: "Chana Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Besan Dhokla", lunch: "Peas Potato Curry with Roti", snack: "Homemade Banana Shake", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Wednesday", breakfast: "Carrot Muthia", lunch: "Andhra Chicken Garlic Fry with Roti - 120", snack: "Raw Banana Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Thursday", breakfast: "Green Peas Roti", lunch: "Chana Dal with Spinach", snack: "Rice Kanji Drink", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Friday", breakfast: "Ragi Dhokla", lunch: "Drumstick Leaves Curry with Rice", snack: "Peanut Sundal", dinner: "Lobia Curry with Roti" },
      { day: "Saturday", breakfast: "Sattu Cheela", lunch: "Carrot Chana Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Sunday", breakfast: "Ragi Malt with Jaggery", lunch: "North Indian Chicken Jeera Fry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Sweet Potato Peas Curry with Phulka" }
    ]
  },
  // Age 47 | normal | plan4
  {
    age: 47, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Cabbage Moong Curry with Roti", snack: "Sattu Buttermilk", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Tuesday", breakfast: "Mixed Dal Adai", lunch: "Raw Banana Masala with Rice", snack: "Bajra Malt Drink", dinner: "Coconut Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Roti", lunch: "South Indian Chicken Malabar Fry", snack: "Puffed Rice Chana Mixture", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Black-Eyed Pea Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Friday", breakfast: "Ajwain Missi Roti", lunch: "Carrot Moong Curry with Roti", snack: "Roasted Cowpeas", dinner: "Chana Dal Roti with Curd" },
      { day: "Saturday", breakfast: "Onion Thalipeeth", lunch: "Chana Dal with Ridge Gourd", snack: "White Peas Sundal", dinner: "Jowar Kanji with Dal" },
      { day: "Sunday", breakfast: "Peanut Banana Bowl", lunch: "Chicken Dry Peanut Roast", snack: "Sattu Jaggery Balls", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 47 | overweight | plan1
  {
    age: 47, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Thalipeeth", lunch: "Potato Beans Curry with Roti", snack: "Jaggery Ragi Milk", dinner: "Onion Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Green Peas Usal with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Wednesday", breakfast: "Bajra Ambli", lunch: "Andhra Chicken Pan Fry with Rice", snack: "Banana Sesame Chaat", dinner: "Matki Usal with Bhakri" },
      { day: "Thursday", breakfast: "Boiled Yam with Curd", lunch: "Methi Corn Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Onion Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Tindora Peanut Curry with Rice", snack: "Banana Ragi Balls", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Green Peas Muthia", lunch: "Raw Mango Dal with Rice", snack: "Plain Homemade Lassi", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Jowar Thalipeeth", lunch: "Chicken Red Chilli Fry", snack: "Peanut Jaggery Ladoo", dinner: "Chana Dal Cheela with Chutney" }
    ]
  },
  // Age 47 | overweight | plan2
  {
    age: 47, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Vegetable Muthia", lunch: "Cowpea Curry with Rice", snack: "Jaggery Lassi", dinner: "Carrot Roti with Dal" },
      { day: "Tuesday", breakfast: "Methi Besan Cheela", lunch: "Dosakaya Pappu with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Jowar Ambli", lunch: "Chicken Coriander Ginger Roast", snack: "Roasted Chana Chikki", dinner: "Beetroot Roti with Curd" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Toor Dal with Raw Banana", snack: "Papaya Peanut Chaat", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Bharli Vangi with Bhakri", snack: "Curd Peanut Bowl", dinner: "Chayote Moong Curry with Roti" },
      { day: "Saturday", breakfast: "Palak Dhokla", lunch: "Cluster Beans Dal Curry with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Palak Missi Roti", lunch: "North Indian Chicken Green Masala Fry", snack: "Roasted Gram Balls", dinner: "Vegetable Rice Kozhukattai" }
    ]
  },
  // Age 47 | overweight | plan3
  {
    age: 47, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "Dill Leaves Dal with Rice", snack: "Boiled Groundnut Salad", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Urad Dal Cheela", lunch: "Kala Vatana Usal with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Sattu Curry with Phulka" },
      { day: "Wednesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Andhra Prawn Ginger Fry with Rice - 150", snack: "Ragi Banana Balls", dinner: "Vegetable Muthia with Curd" },
      { day: "Thursday", breakfast: "Moong Dal Dhokla", lunch: "Sweet Potato Peas Curry with Rice", snack: "Curry Leaf Buttermilk", dinner: "Beetroot Masala with Roti" },
      { day: "Friday", breakfast: "Jowar Muthia", lunch: "Bengali Masoor Dal with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Chayote Dal Curry with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Sunday", breakfast: "Methi Adai", lunch: "Andhra Chicken Ginger Pepper Fry with", snack: "Jowar Malt Drink", dinner: "Rice Kanji with Dal" }
    ]
  },
  // Age 47 | overweight | plan4
  {
    age: 47, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Methi Handvo", lunch: "Carrot Peas Masala with Rice", snack: "Roasted Mung Beans", dinner: "Bajra Ambli with Curd" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Beerakaya Pappu with Rice", snack: "Green Gram Sundal", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Wednesday", breakfast: "Drumstick Leaves Adai", lunch: "Chicken Dry Methi Roast", snack: "Guava Jaggery Bowl", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Jowar Malt with Milk", lunch: "Brinjal Dal Curry with Roti", snack: "Corn Peanut Sundal", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Masoor Dal with Dill Leaves", snack: "Roasted Sweet Corn", dinner: "Khaman Dhokla with Curd" },
      { day: "Saturday", breakfast: "Vegetable Handvo", lunch: "Potato Methi Curry with Roti", snack: "Roasted Corn Peanut Mix", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Masoor Dal Cheela", lunch: "Prawn Methi Masala", snack: "Peanut Poha Chivda", dinner: "Ammini Kozhukattai with Vegetables" }
    ]
  },
  // Age 48 | underweight | plan1
  {
    age: 48, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Mixed Dal Adai", lunch: "Green Gram Masala with Roti", snack: "Boiled Groundnut Salad", dinner: "Coconut Sevai with Peanuts" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Spinach Chana Curry with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Akki Rotti with Curd" },
      { day: "Wednesday", breakfast: "Palak Besan Cheela", lunch: "Kerala Fish Jeera Fry with Red Rice - 150", snack: "Dry Roasted Corn", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Thursday", breakfast: "Sattu Cheela", lunch: "Peas Potato Curry with Rice", snack: "Puffed Rice Chikki", dinner: "Jowar Rotti with Dal" },
      { day: "Friday", breakfast: "Moong Dal Dhokla", lunch: "Masoor Dal with Dill Leaves", snack: "Roasted Peanut Jaggery Mix", dinner: "Palak Missi Roti with Curd" },
      { day: "Saturday", breakfast: "Onion Besan Cheela", lunch: "Raw Mango Dal with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Beetroot Masala with Roti" },
      { day: "Sunday", breakfast: "Green Peas Muthia", lunch: "Kerala Prawn Masala Fry with Red Rice", snack: "Murmura Onion Chaat", dinner: "Moong Dal Roti with Vegetable Curry" }
    ]
  },
  // Age 48 | underweight | plan2
  {
    age: 48, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Black-Eyed Pea Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Methi Peas Curry with Roti", snack: "Murmura Peanut Chaat", dinner: "Methi Adai with Curd" },
      { day: "Wednesday", breakfast: "Onion Adai", lunch: "Andhra Fish Lemon Roast with Rice", snack: "Jowar Chikki", dinner: "Jowar Ambli with Roti" },
      { day: "Thursday", breakfast: "Methi Thalipeeth", lunch: "Carrot Peas Masala with Rice", snack: "Ginger Buttermilk", dinner: "Onion Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Papaya Curd Bowl", lunch: "Stuffed Tindora with Roti", snack: "White Pea Chaat", dinner: "Rice Kanji with Dal" },
      { day: "Saturday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Carrot Moong Curry with Roti", snack: "Jaggery Ragi Milk", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Rava Kichadi with Peanuts", lunch: "Chicken Malabar Fry", snack: "Roasted Sweet Corn", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 48 | underweight | plan3
  {
    age: 48, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Cabbage Carrot Curry with Rice", snack: "Banana Lassi", dinner: "Methi Handvo with Chutney" },
      { day: "Tuesday", breakfast: "Carrot Muthia", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Chayote Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Ragi Thalipeeth", lunch: "Chicken Gongura Pepper Fry", snack: "Sesame Jaggery Ladoo", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Stuffed Bhindi with Roti", snack: "Boiled Yam Chaat", dinner: "Palak Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Potato Peas Curry with Rice", snack: "Homemade Peanut Bar", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Chana Dal Cheela", lunch: "Dosakaya Pappu with Rice", snack: "Beetroot Peanut Chaat", dinner: "Green Peas Muthia with Curd" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "South Indian Chicken Green Masala Fry", snack: "Roasted Green Gram", dinner: "Khaman Dhokla with Curd" }
    ]
  },
  // Age 48 | underweight | plan4
  {
    age: 48, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Methi Roti", lunch: "Yam Masala with Roti", snack: "Bajra Malt Drink", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Brinjal Coconut Curry with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Onion Thalipeeth", lunch: "Andhra Chicken Dry Coriander Roast", snack: "Cowpea Sundal", dinner: "Chana Dal Roti with Curd" },
      { day: "Thursday", breakfast: "Methi Akki Rotti", lunch: "Amaranth Dal with Roti", snack: "Plain Homemade Lassi", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Friday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Cauliflower Methi Curry with Roti", snack: "Papaya Coconut Bowl", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Jowar Malt with Milk", lunch: "Moong Dal with Spinach", snack: "Roasted Black Chana with Lemon", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Ajwain Missi Roti", lunch: "Chicken Dry Masala Fry", snack: "Carrot Peanut Chaat", dinner: "Yam Pepper Curry with Roti" }
    ]
  },
  // Age 48 | normal | plan1
  {
    age: 48, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Besan Cheela", lunch: "Sprouted Moong Curry with Roti", snack: "Corn Peanut Sundal", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Ragi Rotti with Chutney", lunch: "Green Peas Usal with Roti", snack: "Sesame Chikki", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Prawn Coconut Garlic Curry", snack: "Horse Gram Sundal", dinner: "Jowar Muthia with Dal" },
      { day: "Thursday", breakfast: "Sattu Vegetable Pancake", lunch: "Bengali Masoor Dal with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Bharli Vangi with Bhakri", snack: "Boiled Peanut Chaat", dinner: "Bajra Ambli with Curd" },
      { day: "Saturday", breakfast: "Bajra Ambli", lunch: "Stuffed Brinjal with Rice", snack: "Green Gram Sundal", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Carrot Roti with Curd", lunch: "Andhra Chicken Dry Pudina Roast", snack: "Poha Jaggery Ladoo", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 48 | normal | plan2
  {
    age: 48, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Sweet Potato Peas Curry with Roti", snack: "Sattu Buttermilk", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Chana Dal Roti", lunch: "Gujarati Dal with Rice", snack: "Roasted Cowpeas", dinner: "Vegetable Muthia with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Adai", lunch: "Prawn Coriander Fry", snack: "Banana Ragi Shake", dinner: "Sattu Cheela with Curd" },
      { day: "Thursday", breakfast: "Vegetable Muthia", lunch: "Cauliflower Dal Curry with Roti", snack: "Peanut Sundal", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Broad Beans Dal Curry with Rice", snack: "Jowar Malt Drink", dinner: "Sattu Roti with Dal" },
      { day: "Saturday", breakfast: "Dudhi Muthia", lunch: "Carrot Peas Masala with Roti", snack: "Roasted Chana Chikki", dinner: "Kala Vatana Usal with Roti" },
      { day: "Sunday", breakfast: "Millet Vegetable Pancake", lunch: "Chicken Peanut Fry", snack: "Roasted Gram Balls", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 48 | normal | plan3
  {
    age: 48, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Radish Roti with Curd", lunch: "Masoor Dal with Methi", snack: "Coconut Jaggery Ladoo", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Tuesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Toor Dal with Raw Banana", snack: "Papaya Lassi", dinner: "Carrot Roti with Dal" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Kerala Fish Tamarind Pepper Fry", snack: "Banana Ragi Balls", dinner: "Palak Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Palak Dhokla", lunch: "Lobia Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Green Peas Roti with Curd" },
      { day: "Friday", breakfast: "Cabbage Besan Cheela", lunch: "Cluster Beans Dal Curry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Carrot Chana Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Aval Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "South Indian Chicken Tawa Fry with Roti", snack: "Boiled Corn with Lemon", dinner: "Sweet Potato Peas Curry with Phulka" }
    ]
  },
  // Age 48 | normal | plan4
  {
    age: 48, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Malt with Jaggery", lunch: "Methi Corn Curry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Dal with Drumstick Leaves", snack: "Homemade Poha Chivda", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "North Indian Chicken Ginger Pepper Fry", snack: "Curd Roasted Chana Bowl", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "Dill Leaves Curry with Roti", snack: "Lobia Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Jowar Ambli", lunch: "Matki Usal with Bhakri", snack: "Jowar Puffed Grain Chaat", dinner: "Lobia Curry with Roti" },
      { day: "Saturday", breakfast: "Drumstick Leaves Adai", lunch: "Chayote Dal Curry with Roti", snack: "Jeera Buttermilk", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Sunday", breakfast: "Carrot Besan Cheela", lunch: "South Indian Chicken Peanut Pepper Roast", snack: "Rice Kanji Drink", dinner: "Ragi Sevai Vegetable Bowl" }
    ]
  },
  // Age 48 | overweight | plan1
  {
    age: 48, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "Brinjal Peanut Curry with Rice", snack: "Cowpea Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Sattu Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Rava Vegetable Kichadi" },
      { day: "Wednesday", breakfast: "Urad Dal Cheela", lunch: "Andhra Chicken Coconut Masala Fry - 150", snack: "Banana Sesame Chaat", dinner: "Moong Dal Handvo" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Chana Dal with Ridge Gourd", snack: "Puffed Rice Peanut Mixture", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Raw Banana Masala with Roti", snack: "Homemade Corn Chivda", dinner: "Methi Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Besan Dhokla", lunch: "Tindora Peanut Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Sunday", breakfast: "Tomato-Free Vegetable Adai", lunch: "North Indian Chicken Ginger Coriander", snack: "Murmura Black Chana Chaat", dinner: "Chana Usal with Bhakri" }
    ]
  },
  // Age 48 | overweight | plan2
  {
    age: 48, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Muthia", lunch: "Dal with Fenugreek Leaves", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Methi Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Onion Paniyaram", lunch: "Dill Leaves Dal with Rice", snack: "Homemade Murmura Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Paniyaram", lunch: "Telangana Chicken Coconut Masala Fry", snack: "Peanut Jaggery Ladoo", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Boiled Yam with Curd", lunch: "Sprouted Moong Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Friday", breakfast: "Jowar Thalipeeth", lunch: "Kala Vatana Usal with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Saturday", breakfast: "Sattu Roti with Curd", lunch: "White Peas Masala with Roti", snack: "Cucumber Roasted Chana Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "Chicken Andhra Garlic Roast", snack: "Homemade Banana Shake", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 48 | overweight | plan3
  {
    age: 48, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Moong Dal Roti", lunch: "Cabbage Moong Curry with Roti", snack: "Ragi Buttermilk", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Bottle Gourd Handvo", lunch: "Cauliflower Peas Masala with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Raw Banana Masala with Phulka" },
      { day: "Wednesday", breakfast: "Vegetable Handvo", lunch: "North Indian Chicken Ginger Fry", snack: "Ragi Banana Balls", dinner: "Vegetable Adai with Curd" },
      { day: "Thursday", breakfast: "Lemon Sevai with Peanuts", lunch: "Amaranth Leaves Curry with Rice", snack: "White Peas Sundal", dinner: "Stuffed Brinjal with Roti" },
      { day: "Friday", breakfast: "Ragi Sevai Upma", lunch: "Beetroot Coconut Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Saturday", breakfast: "Jowar Vegetable Pancake", lunch: "Broad Beans Masala with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Sunday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Chicken Pepper Onion Roast", snack: "Roasted Mung Beans", dinner: "Sattu Curry with Phulka" }
    ]
  },
  // Age 48 | overweight | plan4
  {
    age: 48, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Kanji with Curd", lunch: "Drumstick Leaves Curry with Rice", snack: "Raw Banana Chaat", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Moong Dal with Carrot", snack: "Ragi Jaggery Ladoo", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Palak Missi Roti", lunch: "Coastal Prawn Masala Fry", snack: "Ragi Peanut Ladoo", dinner: "Ragi Rotti with Curd" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Dal with Amaranth Leaves", snack: "Curd Sweet Potato Bowl", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Khaman Dhokla", lunch: "Beerakaya Pappu with Rice", snack: "Mint Buttermilk", dinner: "Bajra Rotti with Dal" },
      { day: "Saturday", breakfast: "Bajra Methi Roti", lunch: "Potato Beans Curry with Roti", snack: "Peanut Poha Chivda", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Methi Handvo", lunch: "Fish Coriander Fry", snack: "Guava Peanut Chaat", dinner: "Methi Muthia with Dal" }
    ]
  },
  // Age 49 | underweight | plan1
  {
    age: 49, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Moong Dal with Spinach", snack: "Roasted Chana Jaggery Mix", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Aval Upma with Peanuts", lunch: "Cowpea Masala with Roti", snack: "Plain Homemade Lassi", dinner: "Radish Roti with Dal" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "South Indian Chicken Pepper Roast with", snack: "Peanut Jaggery Ladoo", dinner: "Stuffed Tindora with Roti" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Raw Banana Masala with Roti", snack: "Jowar Chikki", dinner: "Chana Usal with Bhakri" },
      { day: "Friday", breakfast: "Methi Adai", lunch: "Broad Beans Dal Curry with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Carrot Muthia with Dal" },
      { day: "Saturday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Brinjal Peanut Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Sweet Potato Roti with Curd" },
      { day: "Sunday", breakfast: "Peanut Banana Bowl", lunch: "Kerala Prawn Masala Fry with Rice", snack: "Peanut Poha Chivda", dinner: "Yam Pepper Curry with Roti" }
    ]
  },
  // Age 49 | underweight | plan2
  {
    age: 49, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Broad Beans Masala with Rice", snack: "Banana Jaggery Bowl", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Bajra Methi Roti", lunch: "Beetroot Masala with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Lemon Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Jowar Vegetable Pancake", lunch: "Fish Coriander Fry with Red Rice - 90-100", snack: "Roasted Chana Ladoo", dinner: "Urad Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Jowar Muthia", lunch: "Chayote Moong Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Amaranth Dal with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Rava Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Potato Beans Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Lobia Curry with Roti" },
      { day: "Sunday", breakfast: "Millet Vegetable Pancake", lunch: "Prawn Curry Leaf Fry", snack: "Roasted Peanuts with Curry Leaves", dinner: "Moong Dal Dhokla with Chutney" }
    ]
  },
  // Age 49 | underweight | plan3
  {
    age: 49, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Sevai", lunch: "Yam Masala with Roti", snack: "Lobia Chaat", dinner: "Beetroot Roti with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Methi Peas Curry with Roti", snack: "Papaya Lassi", dinner: "Raw Banana Masala with Phulka" },
      { day: "Wednesday", breakfast: "Jowar Thalipeeth", lunch: "Prawn Coconut Garlic Curry", snack: "Sattu Buttermilk", dinner: "Kala Vatana Usal with Roti" },
      { day: "Thursday", breakfast: "Sattu Roti with Curd", lunch: "Peas Potato Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Jowar Muthia with Dal" },
      { day: "Friday", breakfast: "Moong Dal Roti", lunch: "Carrot Peas Masala with Rice", snack: "Cowpea Sundal", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Saturday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Dosakaya Pappu with Rice", snack: "Peanut Sundal", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Prawn Green Masala Fry", snack: "Sweet Potato Peanut Chaat", dinner: "Stuffed Bhindi with Roti" }
    ]
  },
  // Age 49 | underweight | plan4
  {
    age: 49, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Moong Dal Dhokla", lunch: "Masoor Dal with Dill Leaves", snack: "Roasted Sweet Corn", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Methi Missi Roti", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Methi Muthia with Dal" },
      { day: "Wednesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "North Indian Chicken Pepper Fry", snack: "Cowpea Chaat", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Raw Mango Dal with Rice", snack: "Banana Ragi Shake", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Dill Leaves Dal with Rice", snack: "Homemade Corn Chivda", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Saturday", breakfast: "Cabbage Besan Cheela", lunch: "Stuffed Brinjal with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Sunday", breakfast: "Ragi Paniyaram", lunch: "Telangana Chicken Coconut Masala Fry", snack: "Homemade Peanut Bar", dinner: "Moong Dal Roti with Vegetable Curry" }
    ]
  },
  // Age 49 | normal | plan1
  {
    age: 49, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Malt with Jaggery", lunch: "Peas Potato Curry with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Methi Adai with Curd" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Toor Dal with Raw Banana", snack: "Homemade Jowar Savoury Balls", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Chicken Dry Methi Roast", snack: "Jowar Malt Drink", dinner: "Methi Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Bengali Masoor Dal with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Friday", breakfast: "Green Peas Roti", lunch: "Spinach Chana Curry with Roti", snack: "Banana Ragi Balls", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Cabbage Carrot Curry with Rice", snack: "Ginger Buttermilk", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Sunday", breakfast: "Bajra Thalipeeth", lunch: "Fish Ginger Garlic Fry", snack: "Puffed Rice Chana Mixture", dinner: "Green Gram Curry with Jowar Roti" }
    ]
  },
  // Age 49 | normal | plan2
  {
    age: 49, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Onion Besan Cheela", lunch: "White Peas Curry with Rice", snack: "Jeera Buttermilk", dinner: "Bajra Ambli with Curd" },
      { day: "Tuesday", breakfast: "Ragi Malt with Jaggery", lunch: "Amaranth Leaves Curry with Rice", snack: "Jaggery Lassi", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Rava Kichadi with Peanuts", lunch: "South Indian Chicken Peanut Fry - 90-100", snack: "Murmura Onion Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Thursday", breakfast: "Banana Jowar Pancake", lunch: "White Peas Masala with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Ragi Dhokla with Curd" },
      { day: "Friday", breakfast: "Methi Thalipeeth", lunch: "Matki Usal with Rice", snack: "Roasted Green Gram", dinner: "Jowar Rotti with Dal" },
      { day: "Saturday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Masoor Dal with Methi", snack: "Puffed Rice Chikki", dinner: "Ragi Rotti with Curd" },
      { day: "Sunday", breakfast: "Onion Missi Roti", lunch: "Chicken Garlic Fry", snack: "Rice Kanji Drink", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 49 | normal | plan3
  {
    age: 49, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Carrot Muthia", lunch: "Stuffed Brinjal with Rice", snack: "Roasted Bengal Gram with Onion", dinner: "Akki Rotti with Curd" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Pancake", lunch: "Maharashtrian Amti with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Wednesday", breakfast: "Ragi Dhokla", lunch: "Andhra Fish Coconut Curry", snack: "Ragi Peanut Ladoo", dinner: "Palak Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Methi Akki Rotti", lunch: "Cowpea Curry with Rice", snack: "Homemade Murmura Chaat", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Dill Leaves Curry with Roti", snack: "White Pea Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Palak Dhokla", lunch: "Black-Eyed Pea Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Sunday", breakfast: "Vegetable Adai", lunch: "Telangana Chicken Mustard Pepper Roast", snack: "Curry Leaf Buttermilk", dinner: "Sprouted Moong Curry with Roti" }
    ]
  },
  // Age 49 | normal | plan4
  {
    age: 49, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Andhra Mudda Pappu with Rice", snack: "Sesame Chikki", dinner: "Sattu Roti with Dal" },
      { day: "Tuesday", breakfast: "Onion Paniyaram", lunch: "Carrot Peas Masala with Roti", snack: "Murmura Peanut Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Banana Ragi Pancake", lunch: "Chicken Tawa Coriander Fry with Roti", snack: "Raw Banana Chaat", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Carrot Besan Cheela", lunch: "Broad Beans Masala with Roti", snack: "Bajra Malt Drink", dinner: "Vegetable Muthia with Curd" },
      { day: "Friday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Yam Pepper Curry with Rice", snack: "Green Gram Sundal", dinner: "Dudhi Muthia with Curd" },
      { day: "Saturday", breakfast: "Guava Curd Bowl", lunch: "Sattu Curry with Rice", snack: "White Peas Sundal", dinner: "Moong Dal Handvo" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Prawn Coriander Fry", snack: "Homemade Banana Shake", dinner: "Carrot Besan Cheela with Chutney" }
    ]
  },
  // Age 49 | overweight | plan1
  {
    age: 49, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Carrot Moong Curry with Roti", snack: "Black Chana Sundal", dinner: "Palak Missi Roti with Curd" },
      { day: "Tuesday", breakfast: "Chana Dal Roti", lunch: "Cauliflower Methi Curry with Roti", snack: "Jowar Puffed Grain Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Wednesday", breakfast: "Methi Muthia", lunch: "Andhra Chicken Drumstick Leaf Fry - 150", snack: "Sesame Jaggery Ladoo", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Thursday", breakfast: "Ragi Ambli with Jaggery", lunch: "Matki Usal with Bhakri", snack: "Roasted Cowpeas", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Sweet Potato Roti", lunch: "Sweet Potato Peas Curry with Rice", snack: "Banana Lassi", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Jowar Ambli", lunch: "Brinjal Coconut Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Andhra Fish Green Masala Fry with Rice", snack: "Guava Peanut Chaat", dinner: "Green Peas Roti with Curd" }
    ]
  },
  // Age 49 | overweight | plan2
  {
    age: 49, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Green Peas Muthia", lunch: "Sweet Potato Peas Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Carrot Roti with Curd", lunch: "Bharli Vangi with Bhakri", snack: "Black Chana Chaat with Lemon", dinner: "Vegetable Adai with Curd" },
      { day: "Wednesday", breakfast: "Mixed Dal Adai", lunch: "North Indian Chicken Curry Leaf Garlic", snack: "Banana Sesame Chaat", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Vegetable Muthia", lunch: "Raw Banana Masala with Rice", snack: "Banana Jaggery Milk", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Ragi Sevai Upma", lunch: "Green Gram Masala with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Onion Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Ragi Thalipeeth", lunch: "Dal with Fenugreek Leaves", snack: "Ragi Buttermilk", dinner: "Khaman Dhokla with Curd" },
      { day: "Sunday", breakfast: "Ragi Kozhukattai", lunch: "Andhra Chicken Drumstick Leaf Fry", snack: "Jaggery Ragi Milk", dinner: "Ragi Sevai Vegetable Bowl" }
    ]
  },
  // Age 49 | overweight | plan3
  {
    age: 49, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bajra Rotti with Curd", lunch: "Cluster Beans Dal Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Urad Dal Cheela", lunch: "Potato Beans Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Wednesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Telangana Chicken Red Pepper Roast with", snack: "Carrot Peanut Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Methi Handvo", lunch: "Sprouted Moong Curry with Rice", snack: "Poha Jaggery Ladoo", dinner: "Onion Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Vegetable Handvo", lunch: "Chayote Dal Curry with Roti", snack: "Curd Peanut Bowl", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Jowar Kanji with Curd", lunch: "Kala Vatana Usal with Rice", snack: "Horse Gram Sundal", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Bajra Ambli", lunch: "Andhra Chicken Kasuri Methi Fry", snack: "Puffed Rice Peanut Mixture", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 49 | overweight | plan4
  {
    age: 49, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Boiled Yam with Curd", lunch: "Moong Dal with Carrot", snack: "Boiled Peanut Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Sattu Cheela", lunch: "Cauliflower Peas Masala with Rice", snack: "Peanut Chikki", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Drumstick Leaves Adai", lunch: "Fish Andhra Pulusu", snack: "Ragi Banana Balls", dinner: "Vegetable Handvo with Curd" },
      { day: "Thursday", breakfast: "Ajwain Missi Roti", lunch: "Potato Peas Curry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Jowar Ambli with Roti" },
      { day: "Friday", breakfast: "Jowar Methi Roti", lunch: "Tindora Peanut Curry with Rice", snack: "Roasted Gram Balls", dinner: "Methi Handvo with Chutney" },
      { day: "Saturday", breakfast: "Chana Dal Cheela", lunch: "Gujarati Dal with Rice", snack: "Boiled Corn with Lemon", dinner: "Chayote Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Palak Besan Cheela", lunch: "Kerala Fish Coconut Pepper Curry with", snack: "Roasted Rice Flake Mixture", dinner: "Sattu Cheela with Curd" }
    ]
  },
  // Age 50 | underweight | plan1
  {
    age: 50, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Banana with Roasted Peanuts", lunch: "Spinach Corn Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Tuesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Broad Beans Masala with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Methi Handvo with Chutney" },
      { day: "Wednesday", breakfast: "Moong Dal Dhokla", lunch: "Andhra Fish Coconut Curry", snack: "White Peas Sundal", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Ragi Vegetable Roti", lunch: "Black-Eyed Pea Curry with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Friday", breakfast: "Khaman Dhokla", lunch: "Raw Mango Dal with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Yam Pepper Curry with Roti" },
      { day: "Saturday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Peas Potato Curry with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Vegetable Handvo with Curd" },
      { day: "Sunday", breakfast: "Vegetable Paniyaram", lunch: "Andhra Chicken Green Chilli Fry", snack: "Boiled Groundnut Salad", dinner: "Lobia Curry with Roti" }
    ]
  },
  // Age 50 | underweight | plan2
  {
    age: 50, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Beerakaya Pappu with Rice", snack: "Peanut Sundal", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Masoor Dal with Dill Leaves", snack: "Boiled Peanut Chaat", dinner: "Beetroot Masala with Roti" },
      { day: "Wednesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Andhra Chicken Drumstick Leaf Fry - 150", snack: "Roasted Chana Jaggery Mix", dinner: "Urad Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Moong Dal with Sweet Potato", snack: "Cucumber Roasted Chana Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Chayote Moong Curry with Rice", snack: "Horse Gram Sundal", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Saturday", breakfast: "Ragi Kozhukattai", lunch: "Methi Corn Curry with Rice", snack: "Banana Sattu Shake", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Sunday", breakfast: "Ajwain Missi Roti", lunch: "Telangana Chicken Onion Pepper Fry", snack: "Sattu Jaggery Balls", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 50 | underweight | plan3
  {
    age: 50, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Muthia", lunch: "Lobia Curry with Rice", snack: "Homemade Corn Chivda", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Ragi Malt with Jaggery", lunch: "Drumstick Leaves Curry with Rice", snack: "Homemade Banana Shake", dinner: "Moong Dal Handvo" },
      { day: "Wednesday", breakfast: "Moong Dal Paniyaram", lunch: "North Indian Chicken Onion Pepper Fry", snack: "Murmura Black Chana Chaat", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Bajra Methi Roti", lunch: "Dill Leaves Curry with Roti", snack: "White Pea Chaat", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Friday", breakfast: "Cabbage Besan Cheela", lunch: "Tindora Sesame Curry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Rice Kanji with Dal" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "Potato Beans Curry with Rice", snack: "Curd Peanut Bowl", dinner: "Bharli Vangi with Bhakri" },
      { day: "Sunday", breakfast: "Urad Dal Cheela", lunch: "Kerala Fish Tamarind Pepper Fry with Red", snack: "Corn Peanut Sundal", dinner: "Cabbage Besan Cheela with Chutney" }
    ]
  },
  // Age 50 | underweight | plan4
  {
    age: 50, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Dudhi Muthia", lunch: "Broad Beans Dal Curry with Rice", snack: "Sattu Buttermilk", dinner: "Radish Roti with Dal" },
      { day: "Tuesday", breakfast: "Bajra Malt with Jaggery", lunch: "Moong Dal with Spinach", snack: "Peanut Chikki", dinner: "Methi Akki Rotti" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "Kerala Prawn Masala Fry with Rice", snack: "Papaya Lassi", dinner: "Coconut Sevai with Peanuts" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Kala Vatana Usal with Roti", snack: "Roasted Cowpeas", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Green Peas Muthia", lunch: "Green Gram Masala with Roti", snack: "Ragi Peanut Ladoo", dinner: "Onion Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Jowar Kanji with Curd", lunch: "Stuffed Bhindi with Roti", snack: "Black Chana Sundal", dinner: "Vegetable Muthia with Curd" },
      { day: "Sunday", breakfast: "Onion Thalipeeth", lunch: "Andhra Chicken Dry Pudina Roast", snack: "Green Gram Sundal", dinner: "Broad Beans Dal Curry with Phulka" }
    ]
  },
  // Age 50 | normal | plan1
  {
    age: 50, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Onion Paniyaram", lunch: "Potato Peas Curry with Rice", snack: "Homemade Murmura Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Handvo", lunch: "Green Peas Usal with Roti", snack: "Sesame Chikki", dinner: "Green Peas Muthia with Curd" },
      { day: "Wednesday", breakfast: "Palak Dhokla", lunch: "Fish Coriander Fry with Red Rice - 90-100", snack: "Papaya Peanut Chaat", dinner: "Sattu Curry with Phulka" },
      { day: "Thursday", breakfast: "Peanut Banana Bowl", lunch: "Chayote Dal Curry with Roti", snack: "Roasted Sweet Corn", dinner: "Akki Rotti with Curd" },
      { day: "Friday", breakfast: "Carrot Besan Cheela", lunch: "Amaranth Leaves Curry with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Methi Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Methi Muthia", lunch: "Potato Methi Curry with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Khaman Dhokla with Curd" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Prawn Tamarind Curry", snack: "Jaggery Lassi", dinner: "Chayote Moong Curry with Roti" }
    ]
  },
  // Age 50 | normal | plan2
  {
    age: 50, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Sevai", lunch: "Yam Masala with Roti", snack: "Lobia Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Carrot Peas Masala with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "South Indian Chicken Coriander Ginger", snack: "Murmura Onion Chaat", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Vegetable Adai", lunch: "Yam Pepper Curry with Rice", snack: "Ragi Buttermilk", dinner: "Palak Dhokla with Chutney" },
      { day: "Friday", breakfast: "Sweet Potato Roti", lunch: "Brinjal Peanut Curry with Rice", snack: "Jowar Chikki", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Ragi Dhokla", lunch: "Sattu Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Matki Usal with Bhakri" },
      { day: "Sunday", breakfast: "Bajra Ambli", lunch: "Chicken Tawa Lemon Fry with Roti", snack: "Banana Jaggery Milk", dinner: "Mixed Dal Adai with Curd" }
    ]
  },
  // Age 50 | normal | plan3
  {
    age: 50, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Moong Dal Roti", lunch: "Carrot Moong Curry with Roti", snack: "Mint Buttermilk", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Besan Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Sattu Cheela", lunch: "North Indian Chicken Green Masala Fry", snack: "Puffed Rice Chikki", dinner: "Jowar Rotti with Dal" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Andhra Mudda Pappu with Rice", snack: "Carrot Peanut Chaat", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Chana Dal with Spinach", snack: "Roasted Chana Ladoo", dinner: "Ragi Dhokla with Curd" },
      { day: "Saturday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Stuffed Brinjal with Rice", snack: "Banana Ragi Shake", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "Telangana Chicken Pepper Fry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Millet Vegetable Pancake with Curd" }
    ]
  },
  // Age 50 | normal | plan4
  {
    age: 50, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Carrot Muthia", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Tuesday", breakfast: "Ragi Rotti with Chutney", lunch: "Spinach Chana Curry with Roti", snack: "Guava Jaggery Bowl", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Roti", lunch: "Chicken Onion Pepper Fry", snack: "Roasted Mung Beans", dinner: "Methi Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Ragi Vegetable Pancake", lunch: "Cauliflower Peas Masala with Rice", snack: "Poha Jaggery Ladoo", dinner: "Lemon Sevai with Peanuts" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Cabbage Carrot Curry with Rice", snack: "Rice Kanji Drink", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Stuffed Brinjal with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "Stuffed Tindora with Roti" },
      { day: "Sunday", breakfast: "Vegetable Muthia", lunch: "North Indian Chicken Fenugreek Fry", snack: "Green Gram Chaat", dinner: "Chana Dal Roti with Curd" }
    ]
  },
  // Age 50 | overweight | plan1
  {
    age: 50, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Maharashtrian Amti with Rice", snack: "Homemade Peanut Bar", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Cowpea Masala with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "Bajra Ambli with Curd" },
      { day: "Wednesday", breakfast: "Ragi Thalipeeth", lunch: "Telangana Chicken Tawa Pepper Roast", snack: "Jaggery Ragi Milk", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Brinjal Dal Curry with Roti", snack: "Roasted Gram Balls", dinner: "Sweet Potato Roti with Curd" },
      { day: "Friday", breakfast: "Chana Dal Roti", lunch: "Dal with Amaranth Leaves", snack: "Roasted Green Gram", dinner: "Green Peas Usal with Chapati" },
      { day: "Saturday", breakfast: "Millet Vegetable Pancake", lunch: "Cluster Beans Dal Curry with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Jowar Vegetable Pancake", lunch: "Andhra Chicken Garlic Pepper Fry", snack: "Jeera Buttermilk", dinner: "Chana Usal with Bhakri" }
    ]
  },
  // Age 50 | overweight | plan2
  {
    age: 50, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Bengali Masoor Dal with Rice", snack: "Beetroot Peanut Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Chana Dal with Ridge Gourd", snack: "Homemade Popcorn with Peanuts", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Wednesday", breakfast: "Palak Besan Cheela", lunch: "Andhra Chicken Mustard Fry", snack: "Peanut Jaggery Ladoo", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Beetroot Coconut Curry with Rice", snack: "Peanut Poha Chivda", dinner: "Jowar Ambli with Roti" },
      { day: "Friday", breakfast: "Onion Adai", lunch: "Sattu Curry with Roti", snack: "Curry Leaf Buttermilk", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Sprouted Moong Curry with Rice", snack: "Dry Roasted Corn", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Sunday", breakfast: "Banana Jowar Pancake", lunch: "Andhra Chicken Methi Fry with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Beetroot Roti with Curd" }
    ]
  },
  // Age 50 | overweight | plan3
  {
    age: 50, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Sweet Potato Peas Curry with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Jowar Methi Roti", lunch: "Sweet Potato Peas Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Rava Paniyaram", lunch: "South Indian Chicken Coastal Pepper Fry", snack: "Banana Lassi", dinner: "Methi Adai with Curd" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "Raw Banana Masala with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Guava Curd Bowl", lunch: "White Peas Curry with Rice", snack: "Cowpea Sundal", dinner: "Sattu Roti with Dal" },
      { day: "Saturday", breakfast: "Onion Besan Cheela", lunch: "Peas Potato Curry with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Palak Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Vegetable Thalipeeth", lunch: "North Indian Chicken Mustard Fry", snack: "Boiled Corn with Lemon", dinner: "Jowar Thalipeeth with Dal" }
    ]
  },
  // Age 50 | overweight | plan4
  {
    age: 50, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Onion Missi Roti", lunch: "Kala Vatana Usal with Rice", snack: "Roasted Chana Chikki", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Matki Usal with Rice", snack: "Murmura Peanut Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Wednesday", breakfast: "Mixed Dal Adai", lunch: "North Indian Chicken Coconut Pepper Fry", snack: "Papaya Coconut Bowl", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Thursday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Cauliflower Methi Curry with Roti", snack: "Guava Peanut Chaat", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Friday", breakfast: "Sattu Vegetable Pancake", lunch: "Carrot Peas Masala with Roti", snack: "Plain Homemade Lassi", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Bottle Gourd Handvo", lunch: "White Peas Masala with Roti", snack: "Jowar Malt Drink", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Jowar Thalipeeth", lunch: "Telangana Chicken Tomato Pepper Fry with", snack: "Sweet Potato Peanut Chaat", dinner: "Raw Banana Masala with Phulka" }
    ]
  },
  // Age 51 | underweight | plan1
  {
    age: 51, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Roti", lunch: "Chayote Dal Curry with Roti", snack: "Lobia Chaat", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Gongura Pappu with Rice", snack: "Banana Ragi Balls", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Wednesday", breakfast: "Leftover Rice Paniyaram", lunch: "Home-Style Chicken Methi Garlic Roast", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Millet Vegetable Pancake", lunch: "Methi Corn Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Green Gram Masala with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Methi Handvo with Chutney" },
      { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Raw Mango Dal with Rice", snack: "Roasted Cowpeas", dinner: "Dudhi Muthia with Curd" },
      { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "Spicy Chicken Andhra Fry", snack: "Roasted Green Gram", dinner: "Aval Vegetable Kichadi" }
    ]
  },
  // Age 51 | underweight | plan2
  {
    age: 51, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Thalipeeth", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Onion Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Dal with Amaranth Leaves", snack: "Roasted Gram Balls", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Wednesday", breakfast: "Lemon Sevai with Peanuts", lunch: "Traditional Chicken Telangana Fry", snack: "Homemade Poha Chivda", dinner: "Ragi Dhokla with Curd" },
      { day: "Thursday", breakfast: "Guava Curd Bowl", lunch: "Dal with Drumstick Leaves", snack: "Sattu Buttermilk", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Ragi Rotti with Chutney", lunch: "Dill Leaves Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Saturday", breakfast: "Mixed Dal Adai", lunch: "Beetroot Coconut Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Onion Paniyaram", lunch: "Light Chicken Tawa Lemon Fry", snack: "Roasted Chana Ladoo", dinner: "Green Peas Muthia with Curd" }
    ]
  },
  // Age 51 | underweight | plan3
  {
    age: 51, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Handvo", lunch: "Chana Dal with Ridge Gourd", snack: "Roasted Bengal Gram with Onion", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Dudhi Muthia", lunch: "Spinach Chana Curry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Yam Pepper Curry with Roti" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Light Fish Andhra Pulusu", snack: "Poha Jaggery Ladoo", dinner: "Stuffed Brinjal with Roti" },
      { day: "Thursday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Carrot Chana Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Stuffed Tindora with Roti", snack: "White Peas Sundal", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Saturday", breakfast: "Sattu Vegetable Pancake", lunch: "Black-Eyed Pea Curry with Rice", snack: "Homemade Murmura Chaat", dinner: "Sweet Potato Roti with Curd" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Chicken Mint Pepper Roast", snack: "Roasted Corn Peanut Mix", dinner: "Carrot Besan Cheela with Chutney" }
    ]
  },
  // Age 51 | underweight | plan4
  {
    age: 51, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Paniyaram", lunch: "Stuffed Brinjal with Rice", snack: "Banana Sattu Shake", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Tuesday", breakfast: "Vegetable Adai", lunch: "Moong Dal with Sweet Potato", snack: "Sattu Jaggery Balls", dinner: "Sattu Roti with Dal" },
      { day: "Wednesday", breakfast: "Ragi Dhokla", lunch: "Traditional Prawn Tawa Fry", snack: "Banana Jaggery Milk", dinner: "Stuffed Bhindi with Roti" },
      { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Stuffed Bhindi with Roti", snack: "Ragi Buttermilk", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Cowpea Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Khaman Dhokla with Curd" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Kala Vatana Usal with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Methi Akki Rotti" },
      { day: "Sunday", breakfast: "Jowar Vegetable Pancake", lunch: "Spicy Chicken Mangalorean Fry", snack: "Boiled Groundnut Salad", dinner: "Black-Eyed Pea Curry with Roti" }
    ]
  },
  // Age 51 | normal | plan1
  {
    age: 51, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Broad Beans Dal Curry with Rice", snack: "Banana Ragi Shake", dinner: "Bharli Vangi with Bhakri" },
      { day: "Tuesday", breakfast: "Methi Missi Roti", lunch: "Sprouted Moong Curry with Rice", snack: "Bajra Malt Drink", dinner: "Onion Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Chicken Peanut Fry", snack: "Mint Buttermilk", dinner: "Jowar Rotti with Dal" },
      { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Green Peas Usal with Roti", snack: "Peanut Sundal", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Friday", breakfast: "Vegetable Muthia", lunch: "Cauliflower Peas Masala with Rice", snack: "Homemade Peanut Bar", dinner: "Vegetable Muthia with Curd" },
      { day: "Saturday", breakfast: "Banana Ragi Pancake", lunch: "Tindora Peanut Curry with Rice", snack: "Raw Banana Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Sunday", breakfast: "Bajra Malt with Jaggery", lunch: "Traditional Chicken Lemon Herb Roast", snack: "Green Gram Chaat", dinner: "Carrot Roti with Dal" }
    ]
  },
  // Age 51 | normal | plan2
  {
    age: 51, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Palak Dhokla", lunch: "Potato Methi Curry with Roti", snack: "Rice Kanji Drink", dinner: "Kala Vatana Usal with Roti" },
      { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "Sweet Potato Peas Curry with Roti", snack: "Curd Peanut Bowl", dinner: "Methi Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Methi Muthia", lunch: "Light Chicken Punjabi Masala Fry", snack: "Boiled Peanut Chaat", dinner: "Rava Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Beerakaya Pappu with Rice", snack: "Papaya Lassi", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Jowar Malt with Milk", lunch: "Raw Banana Masala with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Bajra Methi Roti", lunch: "Spinach Corn Curry with Rice", snack: "Roasted Mung Beans", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Traditional Chicken Sesame Pepper Roast", snack: "Plain Homemade Lassi", dinner: "Sattu Cheela with Curd" }
    ]
  },
  // Age 51 | normal | plan3
  {
    age: 51, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Adai", lunch: "Sweet Potato Peas Curry with Rice", snack: "Jowar Malt Drink", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Carrot Muthia", lunch: "Toor Dal with Raw Banana", snack: "Papaya Coconut Bowl", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Ragi Kozhukattai", lunch: "Traditional Prawn Coriander Fry", snack: "Jaggery Lassi", dinner: "Methi Muthia with Dal" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Carrot Peas Masala with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "Sattu Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Palak Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Chana Dal Cheela", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Sesame Chikki", dinner: "Chayote Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Light Chicken Garlic Pepper Fry", snack: "Ragi Banana Balls", dinner: "Bajra Rotti with Dal" }
    ]
  },
  // Age 51 | normal | plan4
  {
    age: 51, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Sprouted Moong Curry with Roti", snack: "Ragi Peanut Ladoo", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Dosakaya Pappu with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Wednesday", breakfast: "Ammini Kozhukattai", lunch: "Spicy Fish Pepper Roast", snack: "Boiled Chana Chaat with Onion", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Dal with Fenugreek Leaves", snack: "Cowpea Sundal", dinner: "Methi Adai with Curd" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Yam Masala with Roti", snack: "Curry Leaf Buttermilk", dinner: "Palak Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Jowar Muthia", lunch: "Dal with Carrot and Beans", snack: "Peanut Chikki", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Carrot Roti with Curd", lunch: "Light Chicken Andhra Fry", snack: "Black Chana Sundal", dinner: "Rice Sevai Vegetable Bowl" }
    ]
  },
  // Age 51 | overweight | plan1
  {
    age: 51, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Moong Dal Dhokla", lunch: "Yam Pepper Curry with Rice", snack: "Green Gram Sundal", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Tuesday", breakfast: "Urad Dal Cheela", lunch: "Bharli Vangi with Bhakri", snack: "Black Chana Chaat with Lemon", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Palak Besan Cheela", lunch: "Home-Style Chicken Dry Masala Fry", snack: "Sesame Jaggery Ladoo", dinner: "Bajra Ambli with Curd" },
      { day: "Thursday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Chayote Moong Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Friday", breakfast: "Vegetable Paniyaram", lunch: "Lobia Curry with Roti", snack: "Horse Gram Sundal", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Amaranth Dal with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "Chicken Curry Leaf Garlic Roast", snack: "Guava Jaggery Bowl", dinner: "Sattu Curry with Phulka" }
    ]
  },
  // Age 51 | overweight | plan2
  {
    age: 51, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Kala Vatana Usal with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Moong Dal Handvo" },
      { day: "Tuesday", breakfast: "Beetroot Roti with Curd", lunch: "Masoor Dal with Methi", snack: "Curd Banana Jaggery Bowl", dinner: "Lobia Curry with Roti" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Home-Style Prawn Jeera Fry", snack: "Peanut Poha Chivda", dinner: "Rice Kanji with Dal" },
      { day: "Thursday", breakfast: "Rava Paniyaram", lunch: "Moong Dal with Spinach", snack: "White Pea Chaat", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Papaya Curd Bowl", lunch: "Drumstick Leaves Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Saturday", breakfast: "Aval Upma with Peanuts", lunch: "Broad Beans Masala with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Raw Banana Masala with Phulka" },
      { day: "Sunday", breakfast: "Jowar Kanji with Curd", lunch: "Traditional Fish Coconut Garlic Curry", snack: "Boiled Yam Chaat", dinner: "Chana Dal Cheela with Chutney" }
    ]
  },
  // Age 51 | overweight | plan3
  {
    age: 51, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Moong Dal Roti", lunch: "Chana Usal with Bhakri", snack: "Roasted Chana Jaggery Mix", dinner: "Jowar Ambli with Roti" },
      { day: "Tuesday", breakfast: "Vegetable Thalipeeth", lunch: "Matki Usal with Bhakri", snack: "Peanut Jaggery Ladoo", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "Home-Style Prawn Coconut Curry", snack: "Murmura Peanut Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Thursday", breakfast: "Cabbage Besan Cheela", lunch: "Peas Potato Curry with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Jowar Kanji with Dal" },
      { day: "Friday", breakfast: "Ragi Sevai Upma", lunch: "Cluster Beans Dal Curry with Roti", snack: "Jowar Chikki", dinner: "Coconut Sevai with Peanuts" },
      { day: "Saturday", breakfast: "Sattu Cheela", lunch: "Lobia Curry with Rice", snack: "Banana Lassi", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Sunday", breakfast: "Onion Missi Roti", lunch: "Traditional Prawn Lemon Pepper Fry", snack: "Curd Cucumber Peanut Bowl", dinner: "Mixed Dal Adai with Curd" }
    ]
  },
  // Age 51 | overweight | plan4
  {
    age: 51, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Banana with Roasted Peanuts", lunch: "Methi Peas Curry with Roti", snack: "Ginger Buttermilk", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Cabbage Carrot Curry with Rice", snack: "Roasted Sweet Corn", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Coastal Chicken Dry Masala Fry", snack: "Banana Jaggery Bowl", dinner: "Akki Rotti with Curd" },
      { day: "Thursday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Cauliflower Methi Curry with Roti", snack: "Sattu Jaggery Ladoo", dinner: "Chana Usal with Bhakri" },
      { day: "Friday", breakfast: "Green Peas Roti", lunch: "Beetroot Masala with Roti", snack: "Dry Roasted Corn", dinner: "Besan Dhokla with Curd" },
      { day: "Saturday", breakfast: "Methi Besan Cheela", lunch: "Brinjal Peanut Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Beetroot Masala with Roti" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Traditional Chicken Curry Leaf Onion Roast", snack: "Jeera Buttermilk", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 52 | underweight | plan1
  {
    age: 52, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "White Peas Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Tuesday", breakfast: "Ragi Kozhukattai", lunch: "Kala Vatana Usal with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Ragi Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Methi Akki Rotti", lunch: "Traditional Chicken Curry Leaf Roast", snack: "Homemade Corn Chivda", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Thursday", breakfast: "Sattu Vegetable Pancake", lunch: "Spinach Chana Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Friday", breakfast: "Moong Dal Dhokla", lunch: "Raw Mango Dal with Rice", snack: "Ginger Buttermilk", dinner: "Palak Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Chana Usal with Bhakri", snack: "Guava Jaggery Bowl", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Sattu Vegetable Roti", lunch: "Traditional Chicken Dry Lemon Roast", snack: "Bajra Malt Drink", dinner: "Onion Besan Cheela with Curd" }
    ]
  },
  // Age 52 | underweight | plan2
  {
    age: 52, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Carrot Peas Masala with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Stuffed Brinjal with Roti" },
      { day: "Tuesday", breakfast: "Sweet Potato Roti", lunch: "Sweet Potato Peas Curry with Roti", snack: "Banana Jaggery Bowl", dinner: "Stuffed Tindora with Roti" },
      { day: "Wednesday", breakfast: "Khaman Dhokla", lunch: "Coastal Chicken Lemon Ginger Roast", snack: "Coconut Jaggery Ladoo", dinner: "Mixed Dal Adai with Curd" },
      { day: "Thursday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Carrot Chana Curry with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Jowar Muthia", lunch: "Toor Dal with Raw Banana", snack: "Homemade Murmura Chaat", dinner: "Methi Akki Rotti" },
      { day: "Saturday", breakfast: "Besan Dhokla", lunch: "Green Gram Masala with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Banana Jowar Pancake", lunch: "Light Fish Coriander Fry", snack: "Banana Ragi Balls", dinner: "Vegetable Sevai with Chana Dal" }
    ]
  },
  // Age 52 | underweight | plan3
  {
    age: 52, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rava Kichadi with Peanuts", lunch: "Potato Beans Curry with Rice", snack: "Boiled Corn with Lemon", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Bajra Thalipeeth", lunch: "Cluster Beans Dal Curry with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Wednesday", breakfast: "Jowar Vegetable Pancake", lunch: "Spicy Chicken Lemon Garlic Roast", snack: "Carrot Peanut Chaat", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Bajra Ambli", lunch: "Sprouted Moong Curry with Roti", snack: "Beetroot Peanut Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Friday", breakfast: "Ragi Thalipeeth", lunch: "Green Gram Masala with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Chana Usal with Bhakri" },
      { day: "Saturday", breakfast: "Guava Curd Bowl", lunch: "Potato Methi Curry with Roti", snack: "Roasted Corn Peanut Mix", dinner: "Aval Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Jowar Kanji with Curd", lunch: "Spicy Chicken Tawa Pepper Roast", snack: "White Pea Chaat", dinner: "Drumstick Leaves Dal with Roti" }
    ]
  },
  // Age 52 | underweight | plan4
  {
    age: 52, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Mixed Dal Adai", lunch: "Maharashtrian Amti with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Tuesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Tindora Peanut Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Moong Dal Roti", lunch: "Spicy Chicken Curry Leaf Fry", snack: "Ragi Banana Balls", dinner: "Bajra Ambli with Curd" },
      { day: "Thursday", breakfast: "Peanut Banana Bowl", lunch: "Amaranth Leaves Curry with Rice", snack: "Murmura Onion Chaat", dinner: "Methi Adai with Curd" },
      { day: "Friday", breakfast: "Jowar Malt with Milk", lunch: "Potato Peas Curry with Rice", snack: "Jowar Malt Drink", dinner: "Radish Roti with Dal" },
      { day: "Saturday", breakfast: "Carrot Muthia", lunch: "Peas Potato Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Sunday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Light Chicken Jeera Pepper Fry", snack: "Raw Banana Chaat", dinner: "Black-Eyed Pea Curry with Roti" }
    ]
  },
  // Age 52 | normal | plan1
  {
    age: 52, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Lemon Sevai with Peanuts", lunch: "Cauliflower Methi Curry with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Chana Dal Roti with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Rice Sevai", lunch: "Stuffed Bhindi with Roti", snack: "Jeera Buttermilk", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Wednesday", breakfast: "Methi Handvo", lunch: "Spicy Chicken Ginger Coriander Roast", snack: "Peanut Jaggery Ladoo", dinner: "Urad Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Brinjal Peanut Curry with Rice", snack: "Guava Peanut Chaat", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Green Peas Muthia", lunch: "Carrot Moong Curry with Roti", snack: "Lobia Chaat", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Saturday", breakfast: "Sattu Roti with Curd", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Black Chana Sundal", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Ragi Banana Malt", lunch: "Chicken Curry Leaf Garlic Roast", snack: "Jaggery Ragi Milk", dinner: "Sattu Cheela with Curd" }
    ]
  },
  // Age 52 | normal | plan2
  {
    age: 52, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "Andhra Mudda Pappu with Rice", snack: "Banana Jaggery Milk", dinner: "Lobia Curry with Roti" },
      { day: "Tuesday", breakfast: "Palak Besan Cheela", lunch: "Spinach Corn Curry with Rice", snack: "Green Gram Sundal", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Onion Besan Cheela", lunch: "Home-Style Chicken Coconut Pepper Fry", snack: "Homemade Jowar Savoury Balls", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Thursday", breakfast: "Jowar Methi Roti", lunch: "Drumstick Leaves Dal with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Bajra Malt with Jaggery", lunch: "Moong Dal with Carrot", snack: "Sattu Jaggery Ladoo", dinner: "Lemon Sevai with Peanuts" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Methi Peas Curry with Roti", snack: "Puffed Rice Chikki", dinner: "Palak Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Ragi Paniyaram", lunch: "Chicken Gongura Fry", snack: "Puffed Rice Chana Mixture", dinner: "Raw Banana Masala with Phulka" }
    ]
  },
  // Age 52 | normal | plan3
  {
    age: 52, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Onion Adai", lunch: "Cauliflower Dal Curry with Roti", snack: "Roasted Cowpeas", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Sesame Chikki", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Wednesday", breakfast: "Cabbage Besan Cheela", lunch: "Home-Style Chicken Lemon Ginger Roast", snack: "Homemade Peanut Bar", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Dill Leaves Curry with Roti", snack: "Banana Ragi Shake", dinner: "Dudhi Muthia with Curd" },
      { day: "Friday", breakfast: "Methi Muthia", lunch: "Bharli Vangi with Bhakri", snack: "Plain Homemade Lassi", dinner: "Matki Usal with Bhakri" },
      { day: "Saturday", breakfast: "Palak Missi Roti", lunch: "Black-Eyed Pea Curry with Rice", snack: "Roasted Sweet Corn", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Sunday", breakfast: "Chana Dal Roti", lunch: "Traditional Chicken Andhra Fry", snack: "Boiled Groundnut Salad", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 52 | normal | plan4
  {
    age: 52, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Stuffed Tindora with Roti", snack: "Roasted Chana Chikki", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Palak Dhokla", lunch: "Cowpea Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Ragi Rotti with Chutney", lunch: "Traditional Chicken Spinach Pepper Fry", snack: "Sweet Potato Sesame Balls", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Drumstick Leaves Adai", lunch: "Kala Vatana Usal with Rice", snack: "Banana Sesame Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Dill Leaves Dal with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Akki Rotti with Curd" },
      { day: "Saturday", breakfast: "Ragi Vegetable Roti", lunch: "White Peas Masala with Roti", snack: "Papaya Coconut Bowl", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Rava Paniyaram", lunch: "Coastal Chicken Sukka", snack: "Peanut Sundal", dinner: "Green Peas Muthia with Curd" }
    ]
  },
  // Age 52 | overweight | plan1
  {
    age: 52, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Banana Ragi Pancake", lunch: "Dosakaya Pappu with Rice", snack: "Roasted Mung Beans", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Carrot Roti with Curd", lunch: "Moong Dal with Sweet Potato", snack: "Ragi Peanut Ladoo", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "Light Chicken Dry Garlic Roast", snack: "Cowpea Sundal", dinner: "Vegetable Adai with Curd" },
      { day: "Thursday", breakfast: "Methi Adai", lunch: "Sattu Curry with Roti", snack: "Papaya Lassi", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Friday", breakfast: "Ragi Dhokla", lunch: "Lobia Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Saturday", breakfast: "Vegetable Muthia", lunch: "Sweet Potato Peas Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Bharli Vangi with Bhakri" },
      { day: "Sunday", breakfast: "Onion Missi Roti", lunch: "Spicy Fish Tawa Fry", snack: "Roasted Peanuts with Curry Leaves", dinner: "Kala Vatana Usal with Roti" }
    ]
  },
  // Age 52 | overweight | plan2
  {
    age: 52, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Urad Dal Cheela", lunch: "Drumstick Leaves Curry with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Methi Thalipeeth", lunch: "Beetroot Masala with Roti", snack: "Sattu Buttermilk", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Radish Roti with Curd", lunch: "Home-Style Chicken Dry Methi Roast", snack: "Ragi Puffed Grain Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Thursday", breakfast: "Papaya Curd Bowl", lunch: "Masoor Dal with Methi", snack: "Horse Gram Sundal", dinner: "Rava Vegetable Kichadi" },
      { day: "Friday", breakfast: "Bottle Gourd Handvo", lunch: "Masoor Dal with Dill Leaves", snack: "Homemade Poha Chivda", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Saturday", breakfast: "Green Peas Roti", lunch: "Potato Beans Curry with Roti", snack: "Curd Peanut Bowl", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Sunday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Spicy Chicken Fenugreek Fry", snack: "Roasted Chana Ladoo", dinner: "Masoor Dal Cheela with Chutney" }
    ]
  },
  // Age 52 | overweight | plan3
  {
    age: 52, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Gujarati Dal with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Khaman Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Bajra Rotti with Curd", lunch: "Cabbage Carrot Curry with Rice", snack: "Peanut Poha Chivda", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Coastal Chicken Jeera Fry", snack: "Homemade Ragi Savoury Balls", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Beerakaya Pappu with Rice", snack: "Mint Buttermilk", dinner: "Yam Pepper Curry with Roti" },
      { day: "Friday", breakfast: "Jowar Thalipeeth", lunch: "Methi Corn Curry with Rice", snack: "Roasted Gram Balls", dinner: "Onion Adai with Chutney" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Yam Pepper Curry with Rice", snack: "Poha Jaggery Ladoo", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "Spicy Chicken Tawa Coriander Fry", snack: "Sweet Potato Peanut Chaat", dinner: "Beetroot Masala with Roti" }
    ]
  },
  // Age 52 | overweight | plan4
  {
    age: 52, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Methi Roti", lunch: "Lobia Curry with Roti", snack: "Cowpea Chaat", dinner: "Methi Handvo with Chutney" },
      { day: "Tuesday", breakfast: "Moong Dal Handvo", lunch: "Broad Beans Masala with Roti", snack: "Jaggery Lassi", dinner: "Carrot Roti with Dal" },
      { day: "Wednesday", breakfast: "Jowar Ambli", lunch: "Chicken Pepper Roast", snack: "Boiled Peanut Chaat", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Thursday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Amaranth Dal with Roti", snack: "Ragi Buttermilk", dinner: "Stuffed Bhindi with Roti" },
      { day: "Friday", breakfast: "Ragi Sevai Upma", lunch: "Cabbage Moong Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Methi Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Carrot Besan Cheela", lunch: "Stuffed Brinjal with Rice", snack: "Roasted Green Gram", dinner: "Jowar Rotti with Dal" },
      { day: "Sunday", breakfast: "Ragi Ambli with Jaggery", lunch: "Home-Style Fish Ginger Garlic Fry", snack: "White Peas Sundal", dinner: "Ragi Thalipeeth with Dal" }
    ]
  },
  // Age 53 | underweight | plan1
  {
    age: 53, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Guava Curd Bowl", lunch: "Spinach Corn Curry with Rice", snack: "Peanut Sundal", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Methi Missi Roti", lunch: "Cluster Beans Dal Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Chana Dal Roti with Curd" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "Traditional Chicken Pepper Fry", snack: "Peanut Jaggery Ladoo", dinner: "Aval Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Black-Eyed Pea Curry with Rice", snack: "Roasted Mung Beans", dinner: "Kala Vatana Usal with Roti" },
      { day: "Friday", breakfast: "Palak Besan Cheela", lunch: "Chana Usal with Bhakri", snack: "Homemade Jowar Savoury Balls", dinner: "Chana Usal with Bhakri" },
      { day: "Saturday", breakfast: "Chana Dal Roti", lunch: "Lobia Curry with Roti", snack: "Curry Leaf Buttermilk", dinner: "Raw Banana Masala with Phulka" },
      { day: "Sunday", breakfast: "Drumstick Leaves Adai", lunch: "Spicy Prawn Jeera Fry", snack: "Roasted Cowpeas", dinner: "Chayote Moong Curry with Roti" }
    ]
  },
  // Age 53 | underweight | plan2
  {
    age: 53, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Ambli", lunch: "Matki Usal with Bhakri", snack: "Sweet Potato Peanut Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Banana Jowar Pancake", lunch: "Dal with Fenugreek Leaves", snack: "Murmura Black Chana Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Moong Dal Roti", lunch: "Spicy Chicken Jeera Pepper Fry", snack: "Roasted Gram Balls", dinner: "Bajra Rotti with Dal" },
      { day: "Thursday", breakfast: "Ragi Malt with Jaggery", lunch: "Cowpea Curry with Rice", snack: "Black Chana Sundal", dinner: "Yam Pepper Curry with Roti" },
      { day: "Friday", breakfast: "Jowar Muthia", lunch: "Beetroot Coconut Curry with Rice", snack: "Ragi Buttermilk", dinner: "Rice Kanji with Dal" },
      { day: "Saturday", breakfast: "Vegetable Adai", lunch: "Green Gram Masala with Roti", snack: "Raw Banana Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Bajra Ambli", lunch: "Chicken Dry Green Masala Roast", snack: "Papaya Lassi", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 53 | underweight | plan3
  {
    age: 53, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Cauliflower Dal Curry with Roti", snack: "Corn Peanut Sundal", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Tuesday", breakfast: "Vegetable Rice Sevai", lunch: "Carrot Peas Masala with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Wednesday", breakfast: "Onion Missi Roti", lunch: "Spicy Chicken Telangana Fry", snack: "Jowar Malt Drink", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Thursday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Gujarati Dal with Rice", snack: "Sattu Buttermilk", dinner: "Sattu Roti with Dal" },
      { day: "Friday", breakfast: "Bottle Gourd Handvo", lunch: "Cauliflower Methi Curry with Roti", snack: "Carrot Peanut Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Saturday", breakfast: "Onion Thalipeeth", lunch: "Beerakaya Pappu with Rice", snack: "Plain Homemade Lassi", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Light Chicken Cumin Coriander Roast", snack: "Dry Roasted Corn", dinner: "Ammini Kozhukattai with Vegetables" }
    ]
  },
  // Age 53 | underweight | plan4
  {
    age: 53, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Sevai Upma", lunch: "Raw Banana Masala with Rice", snack: "Guava Peanut Chaat", dinner: "Akki Rotti with Curd" },
      { day: "Tuesday", breakfast: "Masoor Dal Cheela", lunch: "Dal with Amaranth Leaves", snack: "Banana Sattu Shake", dinner: "Ragi Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Beetroot Roti with Curd", lunch: "Home-Style Chicken Coastal Pepper Fry", snack: "Roasted Peanut Jaggery Mix", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Brinjal Peanut Curry with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Ragi Dhokla", lunch: "Bharli Vangi with Bhakri", snack: "Puffed Rice Chana Mixture", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Saturday", breakfast: "Carrot Besan Cheela", lunch: "Amaranth Leaves Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Methi Muthia with Dal" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Traditional Chicken Dry Coconut Roast", snack: "Coconut Jaggery Ladoo", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 53 | normal | plan1
  {
    age: 53, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Besan Cheela", lunch: "Cabbage Carrot Curry with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Bharli Vangi with Bhakri" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Roasted Bengal Gram with Onion", dinner: "Lobia Curry with Roti" },
      { day: "Wednesday", breakfast: "Palak Dhokla", lunch: "Home-Style Fish Tawa Fry", snack: "Curd Banana Jaggery Bowl", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Thursday", breakfast: "Rice Kanji with Curd", lunch: "Peas Potato Curry with Rice", snack: "Homemade Murmura Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Bajra Rotti with Curd", lunch: "Potato Beans Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "Raw Mango Dal with Rice", snack: "Banana Ragi Shake", dinner: "Jowar Ambli with Roti" },
      { day: "Sunday", breakfast: "Chana Dal Cheela", lunch: "Traditional Fish Jeera Fry", snack: "Roasted Peanuts with Curry Leaves", dinner: "Vegetable Thalipeeth with Curd" }
    ]
  },
  // Age 53 | normal | plan2
  {
    age: 53, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Cabbage Besan Cheela", lunch: "Matki Usal with Rice", snack: "Peanut Poha Chivda", dinner: "Methi Akki Rotti" },
      { day: "Tuesday", breakfast: "Vegetable Handvo", lunch: "Peas Potato Curry with Roti", snack: "Banana Jaggery Milk", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Ragi Kozhukattai", lunch: "Coastal Chicken Mustard Fry", snack: "Peanut Chikki", dinner: "Lemon Sevai with Peanuts" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Stuffed Brinjal with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Jowar Kanji with Dal" },
      { day: "Friday", breakfast: "Ammini Kozhukattai", lunch: "Moong Dal with Sweet Potato", snack: "Sweet Potato Sesame Balls", dinner: "Ragi Ambli with Roti" },
      { day: "Saturday", breakfast: "Besan Dhokla", lunch: "Masoor Dal with Methi", snack: "Roasted Chana Jaggery Mix", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Ragi Paniyaram", lunch: "Traditional Fish Coriander Fry", snack: "Banana Jaggery Bowl", dinner: "Carrot Peas Masala with Phulka" }
    ]
  },
  // Age 53 | normal | plan3
  {
    age: 53, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "Potato Beans Curry with Roti", snack: "Ragi Banana Balls", dinner: "Bajra Ambli with Curd" },
      { day: "Tuesday", breakfast: "Carrot Muthia", lunch: "Sprouted Moong Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Mixed Dal Adai", lunch: "Traditional Chicken Pepper Onion Roast", snack: "Banana Ragi Balls", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Thursday", breakfast: "Jowar Vegetable Pancake", lunch: "Cowpea Masala with Roti", snack: "Rice Kanji Drink", dinner: "Moong Dal Handvo" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Sweet Potato Peas Curry with Rice", snack: "Sesame Chikki", dinner: "Stuffed Bhindi with Roti" },
      { day: "Saturday", breakfast: "Methi Muthia", lunch: "Maharashtrian Amti with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Sattu Vegetable Roti", lunch: "Chicken Ginger Pepper Fry", snack: "Green Gram Sundal", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 53 | normal | plan4
  {
    age: 53, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Kanji with Curd", lunch: "Carrot Chana Curry with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Green Peas Roti with Curd" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Stuffed Bhindi with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Green Peas Muthia with Curd" },
      { day: "Wednesday", breakfast: "Banana Ragi Pancake", lunch: "Coastal Chicken Tawa Pepper Roast", snack: "Puffed Rice Chikki", dinner: "Carrot Muthia with Dal" },
      { day: "Thursday", breakfast: "Lemon Sevai with Peanuts", lunch: "Dal with Drumstick Leaves", snack: "Cowpea Sundal", dinner: "Urad Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Carrot Moong Curry with Roti", snack: "Roasted Green Gram", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Stuffed Tindora with Roti", snack: "Lobia Chaat", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Methi Akki Rotti", lunch: "Light Chicken Tamarind Fry", snack: "Homemade Poha Chivda", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 53 | overweight | plan1
  {
    age: 53, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Adai", lunch: "Carrot Peas Masala with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Jowar Thalipeeth", lunch: "Moong Dal with Spinach", snack: "Sattu Jaggery Ladoo", dinner: "Carrot Roti with Dal" },
      { day: "Wednesday", breakfast: "Carrot Roti with Curd", lunch: "Home-Style Chicken Village-Style Fry", snack: "Boiled Peanut Chaat", dinner: "Beetroot Masala with Roti" },
      { day: "Thursday", breakfast: "Ajwain Missi Roti", lunch: "Stuffed Brinjal with Roti", snack: "Bajra Malt Drink", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Beetroot Masala with Roti", snack: "Horse Gram Sundal", dinner: "Jowar Rotti with Dal" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Bengali Masoor Dal with Rice", snack: "Boiled Corn with Lemon", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Sunday", breakfast: "Khaman Dhokla", lunch: "Coastal Prawn Gongura Curry", snack: "Homemade Corn Chivda", dinner: "Cabbage Chana Dal Curry with Roti" }
    ]
  },
  // Age 53 | overweight | plan2
  {
    age: 53, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Methi Peas Curry with Roti", snack: "Green Gram Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Vegetable Muthia", lunch: "Toor Dal with Raw Banana", snack: "Roasted Chana Ladoo", dinner: "Green Peas Usal with Chapati" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Light Chicken Fenugreek Fry", snack: "White Peas Sundal", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Green Peas Roti", lunch: "Green Gram Masala with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Palak Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Lobia Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Onion Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Vegetable Thalipeeth", lunch: "Potato Peas Curry with Rice", snack: "Ginger Buttermilk", dinner: "Ragi Rotti with Curd" },
      { day: "Sunday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Chicken Kasuri Methi Fry", snack: "Ragi Peanut Ladoo", dinner: "Sattu Cheela with Curd" }
    ]
  },
  // Age 53 | overweight | plan3
  {
    age: 53, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rava Kichadi with Peanuts", lunch: "Chayote Dal Curry with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Methi Corn Curry with Rice", snack: "White Pea Chaat", dinner: "Jowar Muthia with Dal" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Traditional Prawn Ginger Fry", snack: "Roasted Rice Flake Mixture", dinner: "Methi Adai with Curd" },
      { day: "Thursday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "White Peas Curry with Rice", snack: "Homemade Banana Shake", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Raw Banana Masala with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Chayote Moong Curry with Rice", snack: "Mint Buttermilk", dinner: "Khaman Dhokla with Curd" },
      { day: "Sunday", breakfast: "Bajra Malt with Jaggery", lunch: "Spicy Chicken Sukka", snack: "Jeera Buttermilk", dinner: "Sattu Curry with Phulka" }
    ]
  },
  // Age 53 | overweight | plan4
  {
    age: 53, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Brinjal Dal Curry with Roti", snack: "Roasted Sweet Corn", dinner: "Radish Roti with Dal" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Pancake", lunch: "Yam Masala with Roti", snack: "Murmura Onion Chaat", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Palak Missi Roti", lunch: "Coastal Prawn Coconut Curry", snack: "Curd Peanut Bowl", dinner: "Methi Handvo with Chutney" },
      { day: "Thursday", breakfast: "Sattu Vegetable Pancake", lunch: "Black-Eyed Pea Curry with Roti", snack: "Cucumber Roasted Chana Chaat", dinner: "Vegetable Muthia with Curd" },
      { day: "Friday", breakfast: "Jowar Methi Roti", lunch: "Chana Dal with Spinach", snack: "Ragi Puffed Grain Chaat", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Onion Adai", lunch: "Drumstick Leaves Dal with Roti", snack: "Banana Sesame Chaat", dinner: "Matki Usal with Bhakri" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Chicken Green Masala Fry", snack: "Papaya Coconut Bowl", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 54 | underweight | plan1
  {
    age: 54, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Vegetable Muthia", lunch: "Chana Dal with Ridge Gourd", snack: "Papaya Lassi", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Ragi Paniyaram", lunch: "Sprouted Moong Curry with Roti", snack: "Banana Ragi Shake", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Wednesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Coastal Chicken Coriander Lemon Fry", snack: "Cowpea Chaat", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Gujarati Dal with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Bajra Rotti with Dal" },
      { day: "Friday", breakfast: "Ragi Malt with Jaggery", lunch: "Stuffed Tindora with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Ragi Thalipeeth", lunch: "Chayote Dal Curry with Roti", snack: "Banana Sattu Shake", dinner: "Methi Adai with Curd" },
      { day: "Sunday", breakfast: "Chana Dal Roti", lunch: "Traditional Chicken Methi Garlic Roast", snack: "Ragi Peanut Ladoo", dinner: "Methi Akki Rotti" }
    ]
  },
  // Age 54 | underweight | plan2
  {
    age: 54, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Pancake", lunch: "Yam Pepper Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Beetroot Roti with Curd" },
      { day: "Tuesday", breakfast: "Boiled Yam with Curd", lunch: "Bengali Masoor Dal with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Coastal Fish Garlic Pepper Fry", snack: "Roasted Peanuts with Curry Leaves", dinner: "Methi Missi Roti with Dal" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Raw Banana Masala with Rice", snack: "Sattu Jaggery Balls", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Sweet Potato Peas Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Ragi Dhokla with Curd" },
      { day: "Saturday", breakfast: "Millet Vegetable Pancake", lunch: "Dosakaya Pappu with Rice", snack: "Guava Jaggery Bowl", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Banana Jowar Pancake", lunch: "Spicy Fish Bengali Jhol", snack: "Roasted Chana Ladoo", dinner: "Lemon Sevai with Peanuts" }
    ]
  },
  // Age 54 | underweight | plan3
  {
    age: 54, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Lemon Sevai with Peanuts", lunch: "Gongura Pappu with Rice", snack: "Corn Peanut Sundal", dinner: "Lobia Curry with Roti" },
      { day: "Tuesday", breakfast: "Onion Paniyaram", lunch: "Matki Usal with Bhakri", snack: "Boiled Chana Chaat with Onion", dinner: "Rava Vegetable Kichadi" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Home-Style Chicken Dry Coriander Roast", snack: "Jowar Chikki", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Green Gram Masala with Roti", snack: "Black Chana Sundal", dinner: "Palak Dhokla with Chutney" },
      { day: "Friday", breakfast: "Methi Akki Rotti", lunch: "Carrot Chana Curry with Rice", snack: "Banana Ragi Balls", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Carrot Muthia", lunch: "Masoor Dal with Methi", snack: "Curd Roasted Chana Bowl", dinner: "Stuffed Tindora with Roti" },
      { day: "Sunday", breakfast: "Sattu Roti with Curd", lunch: "Home-Style Chicken Tawa Curry Leaf Fry", snack: "Roasted Gram Balls", dinner: "Tindora Peanut Curry with Roti" }
    ]
  },
  // Age 54 | underweight | plan4
  {
    age: 54, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Moong Dal with Carrot", snack: "Dry Roasted Corn", dinner: "Aval Vegetable Kichadi" },
      { day: "Wednesday", breakfast: "Palak Missi Roti", lunch: "Traditional Chicken Pudina Fry", snack: "Homemade Murmura Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Methi Thalipeeth", lunch: "Cauliflower Dal Curry with Roti", snack: "Raw Banana Chaat", dinner: "Rice Kanji with Dal" },
      { day: "Friday", breakfast: "Sattu Vegetable Pancake", lunch: "Beerakaya Pappu with Rice", snack: "Murmura Onion Chaat", dinner: "Onion Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Onion Missi Roti", lunch: "Raw Mango Dal with Rice", snack: "Peanut Sundal", dinner: "Jowar Rotti with Dal" },
      { day: "Sunday", breakfast: "Methi Muthia", lunch: "Coastal Chicken Dry Lemon Roast", snack: "Roasted Cowpeas", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 54 | normal | plan1
  {
    age: 54, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Sattu Cheela", lunch: "Broad Beans Masala with Rice", snack: "Homemade Banana Shake", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Brinjal Peanut Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Wednesday", breakfast: "Banana Ragi Pancake", lunch: "Fish Pepper Roast", snack: "Roasted Green Gram", dinner: "Methi Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Dudhi Muthia", lunch: "Cauliflower Peas Masala with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Matki Usal with Bhakri" },
      { day: "Friday", breakfast: "Moong Dal Dhokla", lunch: "White Peas Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Moong Dal Paniyaram", lunch: "Chana Dal with Spinach", snack: "Ginger Buttermilk", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Sunday", breakfast: "Carrot Roti with Curd", lunch: "Home-Style Prawn Mustard Curry", snack: "Ragi Peanut Chikki", dinner: "Jowar Muthia with Dal" }
    ]
  },
  // Age 54 | normal | plan2
  {
    age: 54, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Adai", lunch: "Tindora Sesame Curry with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Sweet Potato Roti with Curd" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Tindora Peanut Curry with Rice", snack: "Homemade Peanut Bar", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Wednesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Traditional Chicken Coconut Ginger Roast", snack: "Jowar Malt Drink", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Vegetable Rice Sevai", lunch: "Brinjal Dal Curry with Roti", snack: "White Peas Sundal", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Bajra Thalipeeth", lunch: "Masoor Dal with Dill Leaves", snack: "Sattu Jaggery Ladoo", dinner: "Sattu Roti with Dal" },
      { day: "Saturday", breakfast: "Leftover Rice Paniyaram", lunch: "Stuffed Brinjal with Rice", snack: "Boiled Groundnut Salad", dinner: "Chayote Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Home-Style Chicken Jeera Pepper Fry", snack: "Roasted Mung Beans", dinner: "Mixed Dal Cheela with Curd" }
    ]
  },
  // Age 54 | normal | plan3
  {
    age: 54, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Cabbage Moong Curry with Roti", snack: "Poha Jaggery Ladoo", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Bajra Methi Roti", lunch: "Cowpea Masala with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Jowar Ambli with Roti" },
      { day: "Wednesday", breakfast: "Methi Missi Roti", lunch: "Light Chicken Dry Sesame Roast", snack: "Carrot Peanut Chaat", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Thursday", breakfast: "Rava Kichadi with Peanuts", lunch: "Yam Masala with Roti", snack: "Cowpea Sundal", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Kala Vatana Usal with Rice", snack: "Rice Kanji Drink", dinner: "Sattu Curry with Phulka" },
      { day: "Saturday", breakfast: "Bajra Rotti with Curd", lunch: "Green Peas Usal with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Methi Muthia with Dal" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Coastal Prawn Masala Fry", snack: "Cucumber Roasted Chana Chaat", dinner: "Ragi Rotti with Curd" }
    ]
  },
  // Age 54 | normal | plan4
  {
    age: 54, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Green Peas Muthia", lunch: "Dal with Fenugreek Leaves", snack: "Curd Cucumber Peanut Bowl", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Kala Vatana Usal with Roti", snack: "Banana Jaggery Milk", dinner: "Coconut Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Banana with Roasted Peanuts", lunch: "Light Chicken Lemon Pepper Fry", snack: "Puffed Rice Chana Mixture", dinner: "Akki Rotti with Curd" },
      { day: "Thursday", breakfast: "Peanut Banana Bowl", lunch: "Bharli Vangi with Bhakri", snack: "Black Chana Chaat with Lemon", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Friday", breakfast: "Ajwain Missi Roti", lunch: "Moong Dal with Spinach", snack: "Coconut Jaggery Ladoo", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Jowar Muthia", lunch: "White Peas Masala with Roti", snack: "Curry Leaf Buttermilk", dinner: "Sattu Cheela with Curd" },
      { day: "Sunday", breakfast: "Rava Paniyaram", lunch: "Traditional Chicken Spinach Pepper Fry", snack: "Papaya Coconut Bowl", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 54 | overweight | plan1
  {
    age: 54, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Sweet Potato Roti", lunch: "Cabbage Carrot Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Carrot Roti with Dal" },
      { day: "Tuesday", breakfast: "Vegetable Handvo", lunch: "Amaranth Dal with Roti", snack: "Boiled Peanut Chaat", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Wednesday", breakfast: "Chana Dal Cheela", lunch: "Home-Style Fish Green Masala Fry", snack: "Sweet Potato Peanut Chaat", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Thursday", breakfast: "Ragi Rotti with Chutney", lunch: "Raw Banana Masala with Roti", snack: "Jowar Puffed Grain Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Friday", breakfast: "Green Peas Roti", lunch: "Spinach Corn Curry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Green Peas Roti with Curd" },
      { day: "Saturday", breakfast: "Onion Thalipeeth", lunch: "Beetroot Coconut Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Carrot Besan Cheela", lunch: "Spicy Chicken Ginger Pepper Fry", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 54 | overweight | plan2
  {
    age: 54, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Handvo", lunch: "Sprouted Moong Curry with Rice", snack: "Ragi Buttermilk", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Vegetable Thalipeeth", lunch: "Beetroot Masala with Roti", snack: "Homemade Corn Chivda", dinner: "Urad Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Home-Style Fish Jeera Fry", snack: "Banana Jaggery Bowl", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Thursday", breakfast: "Drumstick Leaves Adai", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Peanut Chikki", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Brinjal Coconut Curry with Rice", snack: "Mint Buttermilk", dinner: "Methi Handvo with Chutney" },
      { day: "Saturday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Broad Beans Dal Curry with Rice", snack: "Boiled Corn with Lemon", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Sunday", breakfast: "Ammini Kozhukattai", lunch: "Traditional Fish Mangalorean Curry", snack: "Bajra Malt Drink", dinner: "Cabbage Besan Cheela with Chutney" }
    ]
  },
  // Age 54 | overweight | plan3
  {
    age: 54, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Cauliflower Methi Curry with Roti", snack: "Sesame Chikki", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Tuesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Dal with Drumstick Leaves", snack: "Roasted Chana Chikki", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Khaman Dhokla", lunch: "Light Chicken Dry Curry Leaf Roast", snack: "Green Gram Chaat", dinner: "Raw Banana Masala with Phulka" },
      { day: "Thursday", breakfast: "Jowar Thalipeeth", lunch: "Matki Usal with Rice", snack: "Curd Peanut Bowl", dinner: "Bajra Ambli with Curd" },
      { day: "Friday", breakfast: "Jowar Ambli", lunch: "Dill Leaves Curry with Roti", snack: "Guava Peanut Chaat", dinner: "Chana Dal Roti with Curd" },
      { day: "Saturday", breakfast: "Ragi Vegetable Roti", lunch: "Broad Beans Masala with Roti", snack: "Puffed Rice Chikki", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Methi Besan Cheela", lunch: "Chicken Andhra Garlic Roast", snack: "Papaya Peanut Chaat", dinner: "Stuffed Bhindi with Roti" }
    ]
  },
  // Age 54 | overweight | plan4
  {
    age: 54, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Mixed Dal Cheela", lunch: "Sweet Potato Peas Curry with Roti", snack: "Murmura Black Chana Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Tuesday", breakfast: "Jowar Malt with Milk", lunch: "Methi Corn Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Chana Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Beetroot Roti with Curd", lunch: "Prawn Tamarind Curry", snack: "Sattu Buttermilk", dinner: "Vegetable Handvo with Curd" },
      { day: "Thursday", breakfast: "Ragi Kozhukattai", lunch: "Carrot Peas Masala with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Jowar Kanji with Dal" },
      { day: "Friday", breakfast: "Papaya Curd Bowl", lunch: "Potato Beans Curry with Rice", snack: "White Pea Chaat", dinner: "Stuffed Brinjal with Roti" },
      { day: "Saturday", breakfast: "Ragi Sevai Upma", lunch: "Sattu Curry with Rice", snack: "Horse Gram Sundal", dinner: "Green Peas Muthia with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Adai", lunch: "Light Chicken Telangana Pepper Roast", snack: "Lobia Chaat", dinner: "Chana Dal Cheela with Chutney" }
    ]
  },
  // Age 55 | underweight | plan1
  {
    age: 55, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Broad Beans Masala with Roti", snack: "Papaya Peanut Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Khaman Dhokla", lunch: "Amaranth Leaves Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Wednesday", breakfast: "Onion Besan Cheela", lunch: "Coastal Chicken Gongura Pepper Fry", snack: "Cucumber Roasted Chana Chaat", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Thursday", breakfast: "Dudhi Muthia", lunch: "Potato Beans Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Stuffed Brinjal with Roti" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "Moong Dal with Spinach", snack: "Homemade Corn Chivda", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Sattu Roti with Curd", lunch: "Spinach Corn Curry with Rice", snack: "Ragi Buttermilk", dinner: "Urad Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Home-Style Prawn Curry Leaf Roast", snack: "Homemade Poha Chivda", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 55 | underweight | plan2
  {
    age: 55, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Vegetable Paniyaram", lunch: "Dosakaya Pappu with Rice", snack: "Jowar Chikki", dinner: "Methi Akki Rotti" },
      { day: "Tuesday", breakfast: "Bajra Ambli", lunch: "White Peas Curry with Rice", snack: "Cowpea Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Wednesday", breakfast: "Boiled Yam with Curd", lunch: "Coastal Chicken Jeera Fry", snack: "Curd Peanut Bowl", dinner: "Beetroot Masala with Roti" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Kala Vatana Usal with Roti", snack: "Banana Ragi Shake", dinner: "Palak Dhokla with Chutney" },
      { day: "Friday", breakfast: "Ragi Malt with Jaggery", lunch: "Beetroot Masala with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Lemon Sevai with Peanuts" },
      { day: "Saturday", breakfast: "Ragi Paniyaram", lunch: "Black-Eyed Pea Curry with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Carrot Muthia with Dal" },
      { day: "Sunday", breakfast: "Methi Akki Rotti", lunch: "Spicy Fish Jeera Fry", snack: "Cowpea Sundal", dinner: "Sprouted Moong Curry with Roti" }
    ]
  },
  // Age 55 | underweight | plan3
  {
    age: 55, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Handvo", lunch: "Dal with Amaranth Leaves", snack: "Roasted Bengal Gram with Onion", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Dal with Carrot and Beans", snack: "Ragi Peanut Ladoo", dinner: "Stuffed Tindora with Roti" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Light Chicken Lemon Herb Roast", snack: "Ragi Peanut Chikki", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Brinjal Peanut Curry with Rice", snack: "Mint Buttermilk", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Dill Leaves Curry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Sattu Curry with Phulka" },
      { day: "Saturday", breakfast: "Methi Besan Cheela", lunch: "Dill Leaves Dal with Rice", snack: "Roasted Sweet Corn", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Spicy Chicken Coriander Pepper Fry", snack: "Homemade Jowar Savoury Balls", dinner: "Methi Muthia with Dal" }
    ]
  },
  // Age 55 | underweight | plan4
  {
    age: 55, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Lemon Sevai with Peanuts", lunch: "Dal with Drumstick Leaves", snack: "Papaya Lassi", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Green Peas Usal with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Chana Dal Roti", lunch: "Coastal Chicken Sesame Fry", snack: "Roasted Chana Chikki", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Thursday", breakfast: "Bottle Gourd Handvo", lunch: "Methi Corn Curry with Rice", snack: "Rice Kanji Drink", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Ragi Kozhukattai", lunch: "Stuffed Tindora with Roti", snack: "Banana Ragi Balls", dinner: "Chana Dal Roti with Curd" },
      { day: "Saturday", breakfast: "Moong Dal Paniyaram", lunch: "Cauliflower Peas Masala with Rice", snack: "Sattu Buttermilk", dinner: "Bajra Ambli with Curd" },
      { day: "Sunday", breakfast: "Sattu Vegetable Roti", lunch: "Chicken Coriander Pepper Fry", snack: "Horse Gram Sundal", dinner: "Rava Vegetable Kichadi" }
    ]
  },
  // Age 55 | normal | plan1
  {
    age: 55, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Leftover Rice Paniyaram", lunch: "Carrot Peas Masala with Rice", snack: "Corn Peanut Sundal", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Potato Beans Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Methi Adai with Curd" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Light Fish Coconut Pepper Curry", snack: "Coconut Jaggery Ladoo", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Guava Curd Bowl", lunch: "Broad Beans Masala with Rice", snack: "Jaggery Lassi", dinner: "Palak Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Palak Missi Roti", lunch: "Matki Usal with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Sattu Cheela with Curd" },
      { day: "Saturday", breakfast: "Vegetable Muthia", lunch: "Stuffed Brinjal with Rice", snack: "Murmura Onion Chaat", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Roti", lunch: "Light Chicken Sesame Fry", snack: "Peanut Sundal", dinner: "Vegetable Rice Kozhukattai" }
    ]
  },
  // Age 55 | normal | plan2
  {
    age: 55, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Onion Paniyaram", lunch: "Cauliflower Methi Curry with Roti", snack: "Roasted Green Gram", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Tindora Sesame Curry with Roti", snack: "Banana Sesame Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Banana with Roasted Peanuts", lunch: "Home-Style Prawn Green Masala Fry", snack: "Roasted Rice Flake Mixture", dinner: "Lobia Curry with Roti" },
      { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Masoor Dal with Methi", snack: "Bajra Puffed Grain Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Friday", breakfast: "Ragi Vegetable Pancake", lunch: "Drumstick Leaves Dal with Roti", snack: "Sattu Jaggery Balls", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Dal with Fenugreek Leaves", snack: "Sesame Chikki", dinner: "Vegetable Adai with Curd" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Traditional Fish Mangalorean Curry", snack: "Beetroot Peanut Chaat", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 55 | normal | plan3
  {
    age: 55, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Thalipeeth", lunch: "Black-Eyed Pea Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Onion Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Rava Paniyaram", lunch: "Chayote Dal Curry with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Methi Handvo with Chutney" },
      { day: "Wednesday", breakfast: "Rice Kanji with Curd", lunch: "Traditional Chicken Spinach Pepper Fry", snack: "Lobia Chaat", dinner: "Moong Dal Handvo" },
      { day: "Thursday", breakfast: "Sweet Potato Roti", lunch: "Stuffed Bhindi with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Mixed Dal Adai", lunch: "Cluster Beans Dal Curry with Roti", snack: "Boiled Chana Chaat with Onion", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Vegetable Adai", lunch: "Cauliflower Dal Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Stuffed Bhindi with Roti" },
      { day: "Sunday", breakfast: "Masoor Dal Cheela", lunch: "Home-Style Chicken Curry Leaf Roast", snack: "Jowar Puffed Grain Chaat", dinner: "Radish Roti with Dal" }
    ]
  },
  // Age 55 | normal | plan4
  {
    age: 55, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Green Peas Roti", lunch: "Gongura Pappu with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Tuesday", breakfast: "Ragi Dhokla", lunch: "Carrot Chana Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Raw Banana Masala with Phulka" },
      { day: "Wednesday", breakfast: "Carrot Besan Cheela", lunch: "Prawn Lemon Fry", snack: "Murmura Peanut Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Thursday", breakfast: "Jowar Kanji with Curd", lunch: "Chana Dal with Ridge Gourd", snack: "Curry Leaf Buttermilk", dinner: "Green Peas Roti with Curd" },
      { day: "Friday", breakfast: "Methi Adai", lunch: "Gujarati Dal with Rice", snack: "Roasted Gram Balls", dinner: "Rice Kanji with Dal" },
      { day: "Saturday", breakfast: "Ragi Vegetable Roti", lunch: "Cowpea Curry with Rice", snack: "Homemade Murmura Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Traditional Chicken Pudina Fry", snack: "Peanut Jaggery Ladoo", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 55 | overweight | plan1
  {
    age: 55, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Moong Dal with Sweet Potato", snack: "Ginger Buttermilk", dinner: "Chayote Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Sattu Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Carrot Roti with Dal" },
      { day: "Wednesday", breakfast: "Palak Besan Cheela", lunch: "Coastal Chicken Curry Leaf Roast", snack: "Ragi Puffed Grain Chaat", dinner: "Jowar Muthia with Dal" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "Stuffed Brinjal with Roti", snack: "Papaya Coconut Bowl", dinner: "Yam Pepper Curry with Roti" },
      { day: "Friday", breakfast: "Drumstick Leaves Adai", lunch: "Beetroot Coconut Curry with Rice", snack: "Green Gram Sundal", dinner: "Khaman Dhokla with Curd" },
      { day: "Saturday", breakfast: "Millet Vegetable Pancake", lunch: "Sweet Potato Peas Curry with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "Traditional Fish Methi Curry", snack: "Raw Banana Chaat", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 55 | overweight | plan2
  {
    age: 55, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Moong Dal Dhokla", lunch: "Spinach Chana Curry with Roti", snack: "Jeera Buttermilk", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Ragi Banana Malt", lunch: "Carrot Peas Masala with Roti", snack: "White Pea Chaat", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Wednesday", breakfast: "Carrot Muthia", lunch: "Spicy Fish Coconut Curry", snack: "Guava Peanut Chaat", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "Bengali Masoor Dal with Rice", snack: "Roasted Chana Ladoo", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Peas Potato Curry with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Beetroot Roti with Curd" },
      { day: "Sunday", breakfast: "Urad Dal Cheela", lunch: "Coastal Chicken Andhra Fry", snack: "Dry Roasted Corn", dinner: "Kala Vatana Usal with Roti" }
    ]
  },
  // Age 55 | overweight | plan3
  {
    age: 55, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bajra Malt with Jaggery", lunch: "Chayote Moong Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Toor Dal with Raw Banana", snack: "Roasted Black Chana with Lemon", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Chicken Malabar Fry", snack: "Boiled Peanut Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Thursday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Broad Beans Dal Curry with Rice", snack: "Green Gram Chaat", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Sattu Vegetable Pancake", lunch: "Cowpea Masala with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Amaranth Dal with Roti", snack: "Ragi Banana Balls", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Jowar Muthia", lunch: "Chicken Dry Coconut Roast", snack: "Plain Homemade Lassi", dinner: "Masoor Dal Cheela with Chutney" }
    ]
  },
  // Age 55 | overweight | plan4
  {
    age: 55, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Beetroot Roti with Curd", lunch: "Peas Potato Curry with Rice", snack: "Roasted Cowpeas", dinner: "Ragi Ambli with Roti" },
      { day: "Tuesday", breakfast: "Cabbage Besan Cheela", lunch: "Raw Banana Masala with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Wednesday", breakfast: "Green Peas Muthia", lunch: "Chicken Spinach Pepper Fry", snack: "Bajra Malt Drink", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Moong Dal Handvo", lunch: "Chana Dal with Spinach", snack: "Puffed Rice Chikki", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Sweet Potato Peas Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Onion Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Vegetable Rice Sevai", lunch: "Andhra Mudda Pappu with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Mixed Dal Adai with Curd" },
      { day: "Sunday", breakfast: "Bajra Methi Roti", lunch: "Traditional Prawn Tamarind Curry", snack: "Boiled Yam Chaat", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 56 | underweight | plan1
  {
    age: 56, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Muthia", lunch: "Dal with Carrot and Beans", snack: "Ragi Jaggery Ladoo", dinner: "Aval Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Gujarati Dal with Rice", snack: "Papaya Peanut Chaat", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Sattu Cheela", lunch: "Chicken Tawa Fry", snack: "Roasted Bengal Gram with Onion", dinner: "Rava Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Dal with Fenugreek Leaves", snack: "Homemade Banana Shake", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Ragi Ambli with Jaggery", lunch: "Potato Beans Curry with Rice", snack: "Black Chana Sundal", dinner: "Onion Adai with Chutney" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Toor Dal with Raw Banana", snack: "Black-Eyed Pea Sundal", dinner: "Bharli Vangi with Bhakri" },
      { day: "Sunday", breakfast: "Sattu Roti with Curd", lunch: "Prawn Coconut Garlic Curry", snack: "Roasted Cowpeas", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 56 | underweight | plan2
  {
    age: 56, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Malt with Jaggery", lunch: "Green Peas Usal with Roti", snack: "Ginger Buttermilk", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Tuesday", breakfast: "Lemon Sevai with Peanuts", lunch: "Raw Banana Masala with Roti", snack: "Lobia Chaat", dinner: "Jowar Rotti with Dal" },
      { day: "Wednesday", breakfast: "Ajwain Missi Roti", lunch: "Home-Style Fish Mangalorean Curry", snack: "Homemade Peanut Bar", dinner: "Kala Vatana Usal with Roti" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "Cabbage Moong Curry with Roti", snack: "Ragi Banana Balls", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Moong Dal Dhokla", lunch: "Drumstick Leaves Curry with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Beerakaya Pappu with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Chayote Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Guava Curd Bowl", lunch: "Prawn Curry Leaf Roast", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 56 | underweight | plan3
  {
    age: 56, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Sevai", lunch: "Brinjal Dal Curry with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Stuffed Brinjal with Rice", snack: "Homemade Murmura Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Mixed Dal Cheela", lunch: "Home-Style Fish Tamarind Curry", snack: "Peanut Jaggery Ladoo", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Methi Handvo", lunch: "Methi Peas Curry with Roti", snack: "Roasted Corn Peanut Mix", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Vegetable Muthia", lunch: "Chayote Moong Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Khaman Dhokla with Curd" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Black-Eyed Pea Curry with Roti", snack: "Banana Jaggery Milk", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "Coastal Chicken Ginger Lemon Fry", snack: "Papaya Lassi", dinner: "Carrot Roti with Dal" }
    ]
  },
  // Age 56 | underweight | plan4
  {
    age: 56, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Vegetable Paniyaram", lunch: "Dal with Amaranth Leaves", snack: "Puffed Rice Peanut Mixture", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Beetroot Roti with Curd", lunch: "Andhra Mudda Pappu with Rice", snack: "Plain Homemade Lassi", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Coastal Fish Tawa Fry", snack: "Roasted Chana Ladoo", dinner: "Methi Akki Rotti" },
      { day: "Thursday", breakfast: "Ragi Kozhukattai", lunch: "Carrot Peas Masala with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Jowar Ambli", lunch: "Potato Beans Curry with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Sattu Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Sattu Cheela with Curd" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Chicken Sesame Fry", snack: "White Peas Sundal", dinner: "Besan Dhokla with Curd" }
    ]
  },
  // Age 56 | normal | plan1
  {
    age: 56, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Broad Beans Masala with Rice", snack: "Ragi Buttermilk", dinner: "Sattu Curry with Phulka" },
      { day: "Tuesday", breakfast: "Khaman Dhokla", lunch: "Peas Potato Curry with Roti", snack: "Roasted Sweet Corn", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Methi Thalipeeth", lunch: "Coastal Chicken Ginger Coriander Roast", snack: "Banana Ragi Shake", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Thursday", breakfast: "Sattu Vegetable Pancake", lunch: "Chana Usal with Bhakri", snack: "Jowar Chikki", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Sprouted Moong Curry with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Saturday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Cabbage Carrot Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Methi Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Coastal Chicken Coriander Ginger Roast", snack: "Banana Ragi Balls", dinner: "Beetroot Masala with Roti" }
    ]
  },
  // Age 56 | normal | plan2
  {
    age: 56, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Tuesday", breakfast: "Vegetable Handvo", lunch: "Maharashtrian Amti with Rice", snack: "Guava Peanut Chaat", dinner: "Stuffed Bhindi with Roti" },
      { day: "Wednesday", breakfast: "Cabbage Besan Cheela", lunch: "Chicken Mint Coriander Fry", snack: "Banana Sattu Shake", dinner: "Bajra Rotti with Dal" },
      { day: "Thursday", breakfast: "Palak Besan Cheela", lunch: "Spinach Chana Curry with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Friday", breakfast: "Mixed Dal Adai", lunch: "Stuffed Tindora with Roti", snack: "Bajra Malt Drink", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Saturday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Lobia Curry with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Yam Pepper Curry with Roti" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Spicy Chicken Dry Garlic Roast", snack: "Beetroot Peanut Chaat", dinner: "Vegetable Rice Kozhukattai" }
    ]
  },
  // Age 56 | normal | plan3
  {
    age: 56, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Onion Thalipeeth", lunch: "Cauliflower Peas Masala with Rice", snack: "Homemade Poha Chivda", dinner: "Methi Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Peanut Banana Bowl", lunch: "Broad Beans Dal Curry with Rice", snack: "Cowpea Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Drumstick Leaves Adai", lunch: "Chicken Lemon Fry", snack: "Banana Sesame Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Thursday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Yam Masala with Roti", snack: "Murmura Black Chana Chaat", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Friday", breakfast: "Rice Kanji with Curd", lunch: "Bharli Vangi with Bhakri", snack: "Corn Peanut Sundal", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Onion Paniyaram", lunch: "White Peas Masala with Roti", snack: "Carrot Peanut Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Sunday", breakfast: "Carrot Roti with Curd", lunch: "Light Chicken Kasuri Methi Fry", snack: "Jeera Buttermilk", dinner: "Drumstick Leaves Dal with Roti" }
    ]
  },
  // Age 56 | normal | plan4
  {
    age: 56, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Boiled Yam with Curd", lunch: "Matki Usal with Bhakri", snack: "Green Gram Sundal", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Jowar Malt with Milk", lunch: "Sprouted Moong Curry with Rice", snack: "Poha Jaggery Ladoo", dinner: "Stuffed Tindora with Roti" },
      { day: "Wednesday", breakfast: "Rava Paniyaram", lunch: "Light Chicken Jeera Fry", snack: "Curd Banana Jaggery Bowl", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Aval Upma with Peanuts", lunch: "Raw Banana Masala with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Palak Dhokla with Chutney" },
      { day: "Friday", breakfast: "Vegetable Adai", lunch: "Methi Corn Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Methi Handvo with Chutney" },
      { day: "Saturday", breakfast: "Carrot Muthia", lunch: "White Peas Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Green Peas Roti with Curd" },
      { day: "Sunday", breakfast: "Jowar Vegetable Pancake", lunch: "Light Chicken Mustard Fry", snack: "Jowar Malt Drink", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 56 | overweight | plan1
  {
    age: 56, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Methi Roti", lunch: "Cowpea Masala with Roti", snack: "Peanut Sundal", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Banana Jowar Pancake", lunch: "Chayote Dal Curry with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Ragi Rotti with Curd" },
      { day: "Wednesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Traditional Chicken Andhra Pepper Roast", snack: "Homemade Corn Chivda", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Sweet Potato Peas Curry with Rice", snack: "Banana Lassi", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Ragi Sevai Upma", lunch: "Cluster Beans Dal Curry with Roti", snack: "Sesame Chikki", dinner: "Beetroot Roti with Curd" },
      { day: "Saturday", breakfast: "Papaya Curd Bowl", lunch: "Masoor Dal with Dill Leaves", snack: "Raw Banana Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Sunday", breakfast: "Onion Besan Cheela", lunch: "Traditional Chicken Tamarind Fry", snack: "Curd Cucumber Peanut Bowl", dinner: "Radish Roti with Dal" }
    ]
  },
  // Age 56 | overweight | plan2
  {
    age: 56, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Vegetable Thalipeeth", lunch: "Stuffed Brinjal with Roti", snack: "Puffed Rice Chikki", dinner: "Lobia Curry with Roti" },
      { day: "Tuesday", breakfast: "Ragi Paniyaram", lunch: "Dosakaya Pappu with Rice", snack: "Horse Gram Sundal", dinner: "Dudhi Muthia with Curd" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Home-Style Prawn Andhra Curry", snack: "Boiled Chana Chaat with Onion", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Ragi Dhokla", lunch: "Tindora Sesame Curry with Roti", snack: "Roasted Green Gram", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Friday", breakfast: "Chana Dal Roti", lunch: "Brinjal Coconut Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Saturday", breakfast: "Chana Dal Cheela", lunch: "Broad Beans Masala with Roti", snack: "Curry Leaf Buttermilk", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Sunday", breakfast: "Palak Missi Roti", lunch: "Coastal Fish Coconut Pepper Curry", snack: "Sesame Jaggery Ladoo", dinner: "Black-Eyed Pea Curry with Roti" }
    ]
  },
  // Age 56 | overweight | plan3
  {
    age: 56, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bottle Gourd Handvo", lunch: "Amaranth Dal with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Chana Dal Roti with Curd" },
      { day: "Tuesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Stuffed Bhindi with Roti", snack: "Peanut Poha Chivda", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Wednesday", breakfast: "Bajra Malt with Jaggery", lunch: "Coastal Fish Andhra Pulusu", snack: "Sweet Potato Sesame Balls", dinner: "Onion Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Moong Dal Handvo", lunch: "Cowpea Curry with Rice", snack: "Sattu Jaggery Balls", dinner: "Jowar Muthia with Dal" },
      { day: "Friday", breakfast: "Sweet Potato Roti", lunch: "Dill Leaves Dal with Rice", snack: "Curd Peanut Bowl", dinner: "Vegetable Handvo with Curd" },
      { day: "Saturday", breakfast: "Moong Dal Roti", lunch: "Yam Pepper Curry with Rice", snack: "Mint Buttermilk", dinner: "Urad Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Traditional Prawn Ginger Garlic Fry", snack: "Peanut Chikki", dinner: "Sweet Potato Peas Curry with Phulka" }
    ]
  },
  // Age 56 | overweight | plan4
  {
    age: 56, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Methi Roti", lunch: "Tindora Peanut Curry with Rice", snack: "Green Gram Chaat", dinner: "Matki Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Rice Kanji with Dal" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Pancake", lunch: "Spicy Chicken Dry Methi Roast", snack: "Sattu Buttermilk", dinner: "Onion Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Jowar Muthia", lunch: "Green Gram Masala with Rice", snack: "Roasted Mung Beans", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Ragi Rotti with Chutney", lunch: "Gongura Pappu with Rice", snack: "Ragi Peanut Ladoo", dinner: "Stuffed Brinjal with Roti" },
      { day: "Saturday", breakfast: "Ragi Thalipeeth", lunch: "Green Gram Masala with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Palak Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Light Chicken Coriander Pepper Fry", snack: "Boiled Corn with Lemon", dinner: "Carrot Peas Masala with Phulka" }
    ]
  },
  // Age 57 | underweight | plan1
  {
    age: 57, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Masoor Dal Cheela", lunch: "Spinach Chana Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Jowar Methi Roti", lunch: "Peas Potato Curry with Rice", snack: "Homemade Poha Chivda", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Green Peas Muthia", lunch: "Spicy Fish Curry Leaf Roast", snack: "Green Gram Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Thursday", breakfast: "Banana Ragi Pancake", lunch: "Black-Eyed Pea Curry with Roti", snack: "Sattu Buttermilk", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Mixed Dal Adai", lunch: "Cauliflower Methi Curry with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Chana Usal with Bhakri" },
      { day: "Saturday", breakfast: "Jowar Muthia", lunch: "Cowpea Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Methi Handvo with Chutney" },
      { day: "Sunday", breakfast: "Guava Curd Bowl", lunch: "Home-Style Chicken Mustard Fry", snack: "Jowar Chikki", dinner: "Methi Akki Rotti" }
    ]
  },
  // Age 57 | underweight | plan2
  {
    age: 57, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Vegetable Paniyaram", lunch: "Raw Banana Masala with Rice", snack: "Banana Ragi Shake", dinner: "Jowar Ambli with Roti" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Chana Usal with Bhakri", snack: "Sesame Chikki", dinner: "Bajra Ambli with Curd" },
      { day: "Wednesday", breakfast: "Green Peas Roti", lunch: "Traditional Chicken Spinach Pepper Fry", snack: "Cowpea Sundal", dinner: "Chana Dal Roti with Curd" },
      { day: "Thursday", breakfast: "Moong Dal Dhokla", lunch: "Bharli Vangi with Bhakri", snack: "Roasted Black Chana with Lemon", dinner: "Sattu Curry with Phulka" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Raw Banana Masala with Roti", snack: "Mint Buttermilk", dinner: "Bharli Vangi with Bhakri" },
      { day: "Saturday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Chana Dal with Ridge Gourd", snack: "Roasted Chana Jaggery Mix", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Sunday", breakfast: "Methi Akki Rotti", lunch: "Traditional Fish Lemon Roast", snack: "Roasted Peanut Jaggery Mix", dinner: "Ajwain Missi Roti with Dal" }
    ]
  },
  // Age 57 | underweight | plan3
  {
    age: 57, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Green Peas Usal with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Tuesday", breakfast: "Ragi Thalipeeth", lunch: "Cauliflower Peas Masala with Rice", snack: "Papaya Lassi", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Spicy Chicken Coconut Garlic Roast", snack: "Banana Jaggery Bowl", dinner: "White Pea Curry with Phulka" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Methi Corn Curry with Rice", snack: "Boiled Peanut Chaat", dinner: "Methi Missi Roti with Dal" },
      { day: "Friday", breakfast: "Sattu Vegetable Roti", lunch: "Sweet Potato Peas Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "White Peas Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Palak Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Palak Missi Roti", lunch: "Spicy Chicken Green Masala Fry", snack: "Boiled Groundnut Salad", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 57 | underweight | plan4
  {
    age: 57, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Vegetable Muthia", lunch: "Methi Peas Curry with Roti", snack: "Murmura Peanut Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Drumstick Leaves Adai", lunch: "Chayote Dal Curry with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "Ragi Rotti with Curd" },
      { day: "Wednesday", breakfast: "Jowar Ambli", lunch: "Coastal Chicken Curry Leaf Lemon Fry", snack: "Ragi Peanut Chikki", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Thursday", breakfast: "Papaya Curd Bowl", lunch: "Broad Beans Dal Curry with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Urad Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Toor Dal with Raw Banana", snack: "Plain Homemade Lassi", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Cabbage Besan Cheela", lunch: "Dal with Drumstick Leaves", snack: "Curd Peanut Bowl", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Handvo", lunch: "Chicken Coriander Fry", snack: "Puffed Rice Chikki", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 57 | normal | plan1
  {
    age: 57, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Lobia Curry with Roti", snack: "Roasted Corn Peanut Mix", dinner: "Methi Adai with Curd" },
      { day: "Tuesday", breakfast: "Sweet Potato Roti", lunch: "Brinjal Dal Curry with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Wednesday", breakfast: "Bottle Gourd Handvo", lunch: "Home-Style Prawn Andhra Curry", snack: "Curd Banana Jaggery Bowl", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Gujarati Dal with Rice", snack: "Peanut Chikki", dinner: "Jowar Kanji with Dal" },
      { day: "Friday", breakfast: "Ragi Paniyaram", lunch: "Lobia Curry with Rice", snack: "Roasted Chana Ladoo", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Spinach Corn Curry with Rice", snack: "Raw Banana Chaat", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Sunday", breakfast: "Chana Dal Cheela", lunch: "Home-Style Fish Coconut Garlic Curry", snack: "Ragi Puffed Grain Chaat", dinner: "Moong Dal Dhokla with Chutney" }
    ]
  },
  // Age 57 | normal | plan2
  {
    age: 57, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Malt with Jaggery", lunch: "Peas Potato Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Aval Upma with Peanuts", lunch: "Dill Leaves Curry with Roti", snack: "Ragi Banana Balls", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Thalipeeth", lunch: "Light Prawn Ginger Fry", snack: "Sattu Jaggery Ladoo", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "Carrot Chana Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Friday", breakfast: "Onion Missi Roti", lunch: "Beerakaya Pappu with Rice", snack: "Papaya Coconut Bowl", dinner: "Palak Missi Roti with Curd" },
      { day: "Saturday", breakfast: "Peanut Banana Bowl", lunch: "Drumstick Leaves Curry with Rice", snack: "Ragi Buttermilk", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Chicken Lemon Garlic Roast", snack: "Roasted Rice Flake Mixture", dinner: "Chana Dal Cheela with Chutney" }
    ]
  },
  // Age 57 | normal | plan3
  {
    age: 57, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Vegetable Pancake", lunch: "White Peas Masala with Roti", snack: "Homemade Corn Chivda", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Ragi Kozhukattai", lunch: "Kala Vatana Usal with Roti", snack: "Banana Sesame Chaat", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Wednesday", breakfast: "Onion Paniyaram", lunch: "Coastal Chicken Andhra Pepper Roast", snack: "Roasted Sweet Corn", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Methi Thalipeeth", lunch: "Dill Leaves Dal with Rice", snack: "Dry Roasted Corn", dinner: "Green Peas Roti with Curd" },
      { day: "Friday", breakfast: "Vegetable Adai", lunch: "Broad Beans Masala with Rice", snack: "Poha Jaggery Ladoo", dinner: "Stuffed Bhindi with Roti" },
      { day: "Saturday", breakfast: "Ragi Sevai Upma", lunch: "Dosakaya Pappu with Rice", snack: "Jaggery Lassi", dinner: "Matki Usal with Bhakri" },
      { day: "Sunday", breakfast: "Onion Besan Cheela", lunch: "Traditional Chicken Coconut Garlic Roast", snack: "Black-Eyed Pea Sundal", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 57 | normal | plan4
  {
    age: 57, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Matki Usal with Bhakri", snack: "Boiled Yam Chaat", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Bajra Malt with Jaggery", lunch: "Dal with Carrot and Beans", snack: "Roasted Mung Beans", dinner: "Green Peas Usal with Chapati" },
      { day: "Wednesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Home-Style Chicken Dry Masala Fry", snack: "Sweet Potato Peanut Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Thursday", breakfast: "Bajra Methi Roti", lunch: "Chana Dal with Spinach", snack: "Banana Sattu Shake", dinner: "Carrot Roti with Dal" },
      { day: "Friday", breakfast: "Carrot Muthia", lunch: "Stuffed Brinjal with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Saturday", breakfast: "Beetroot Roti with Curd", lunch: "Black-Eyed Pea Curry with Rice", snack: "Homemade Murmura Chaat", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "Traditional Chicken Green Pepper Roast", snack: "Sweet Potato Sesame Balls", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 57 | overweight | plan1
  {
    age: 57, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Dudhi Muthia", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Homemade Banana Shake", dinner: "Palak Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Gongura Pappu with Rice", snack: "Homemade Peanut Bar", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Roti", lunch: "Light Prawn Methi Masala", snack: "Curry Leaf Buttermilk", dinner: "Vegetable Handvo with Curd" },
      { day: "Thursday", breakfast: "Jowar Malt with Milk", lunch: "Maharashtrian Amti with Rice", snack: "Rice Kanji Drink", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Amaranth Dal with Roti", snack: "Ragi Peanut Ladoo", dinner: "Green Peas Muthia with Curd" },
      { day: "Saturday", breakfast: "Methi Besan Cheela", lunch: "Dal with Fenugreek Leaves", snack: "Bajra Malt Drink", dinner: "Rice Kanji with Dal" },
      { day: "Sunday", breakfast: "Chana Dal Roti", lunch: "Chicken Dry Lemon Roast", snack: "Corn Peanut Sundal", dinner: "Beetroot Masala with Roti" }
    ]
  },
  // Age 57 | overweight | plan2
  {
    age: 57, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Beetroot Masala with Roti", snack: "White Pea Chaat", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Millet Vegetable Pancake", lunch: "Dal with Amaranth Leaves", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Methi Muthia", lunch: "Home-Style Chicken Kasuri Methi Fry", snack: "White Peas Sundal", dinner: "Stuffed Brinjal with Roti" },
      { day: "Thursday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Broad Beans Masala with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Rava Vegetable Kichadi" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Amaranth Leaves Curry with Rice", snack: "Roasted Cowpeas", dinner: "Yam Pepper Curry with Roti" },
      { day: "Saturday", breakfast: "Ragi Dhokla", lunch: "Sweet Potato Peas Curry with Rice", snack: "Roasted Gram Balls", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "Light Fish Green Masala Fry", snack: "Homemade Popcorn with Peanuts", dinner: "Akki Rotti with Curd" }
    ]
  },
  // Age 57 | overweight | plan3
  {
    age: 57, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Adai", lunch: "Beetroot Coconut Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Methi Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Rice Sevai", lunch: "Brinjal Coconut Curry with Rice", snack: "Boiled Corn with Lemon", dinner: "Moong Dal Handvo" },
      { day: "Wednesday", breakfast: "Palak Besan Cheela", lunch: "Home-Style Fish Mangalorean Curry", snack: "Jowar Puffed Grain Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Sattu Roti with Curd", lunch: "Sattu Curry with Roti", snack: "Horse Gram Sundal", dinner: "Lemon Sevai with Peanuts" },
      { day: "Friday", breakfast: "Ragi Vegetable Pancake", lunch: "Cauliflower Dal Curry with Roti", snack: "Guava Jaggery Bowl", dinner: "Onion Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Yam Pepper Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Lobia Curry with Roti" },
      { day: "Sunday", breakfast: "Sattu Cheela", lunch: "Light Chicken Methi Fry", snack: "Peanut Sundal", dinner: "Radish Roti with Dal" }
    ]
  },
  // Age 57 | overweight | plan4
  {
    age: 57, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Sattu Curry with Rice", snack: "Jeera Buttermilk", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Sprouted Moong Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Sattu Cheela with Curd" },
      { day: "Wednesday", breakfast: "Methi Handvo", lunch: "Spicy Chicken Ginger Fry", snack: "Sesame Jaggery Ladoo", dinner: "Bajra Rotti with Dal" },
      { day: "Thursday", breakfast: "Palak Dhokla", lunch: "Andhra Mudda Pappu with Rice", snack: "Banana Ragi Balls", dinner: "Methi Muthia with Dal" },
      { day: "Friday", breakfast: "Ajwain Missi Roti", lunch: "Stuffed Tindora with Roti", snack: "Guava Peanut Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Green Gram Masala with Rice", snack: "Banana Jaggery Milk", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Coastal Chicken Tawa Pepper Roast", snack: "Curd Cucumber Peanut Bowl", dinner: "Raw Banana Masala with Phulka" }
    ]
  },
  // Age 58 | underweight | plan1
  {
    age: 58, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Masoor Dal with Methi", snack: "Cowpea Sundal", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Muthia", lunch: "Kala Vatana Usal with Rice", snack: "Ragi Buttermilk", dinner: "Bajra Ambli with Curd" },
      { day: "Wednesday", breakfast: "Mixed Dal Cheela", lunch: "Light Chicken Lemon Fry", snack: "Roasted Peanut Jaggery Mix", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Sweet Potato Peas Curry with Rice", snack: "Sattu Buttermilk", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Green Peas Muthia", lunch: "Chana Usal with Bhakri", snack: "Boiled Chana Chaat with Onion", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Cabbage Moong Curry with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Methi Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "Home-Style Fish Andhra Pulusu", snack: "Homemade Poha Chivda", dinner: "Rice Kanji with Dal" }
    ]
  },
  // Age 58 | underweight | plan2
  {
    age: 58, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Lobia Curry with Rice", snack: "Homemade Banana Shake", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Tuesday", breakfast: "Moong Dal Handvo", lunch: "Dal with Carrot and Beans", snack: "Bajra Malt Drink", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Wednesday", breakfast: "Lemon Sevai with Peanuts", lunch: "Home-Style Chicken Curry Leaf Fry", snack: "Roasted Cowpeas", dinner: "Sweet Potato Roti with Curd" },
      { day: "Thursday", breakfast: "Sweet Potato Roti", lunch: "Moong Dal with Sweet Potato", snack: "Roasted Green Gram", dinner: "Rava Vegetable Kichadi" },
      { day: "Friday", breakfast: "Methi Muthia", lunch: "Dill Leaves Dal with Rice", snack: "Papaya Lassi", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Saturday", breakfast: "Ragi Sevai Upma", lunch: "Matki Usal with Rice", snack: "Banana Sesame Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Bajra Methi Roti", lunch: "Chicken Dry Coriander Roast", snack: "Lobia Chaat", dinner: "Beetroot Masala with Roti" }
    ]
  },
  // Age 58 | underweight | plan3
  {
    age: 58, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Adai", lunch: "Carrot Peas Masala with Rice", snack: "Jowar Malt Drink", dinner: "Dudhi Muthia with Curd" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Peas Potato Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Home-Style Prawn Coconut Curry", snack: "Carrot Peanut Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Thursday", breakfast: "Drumstick Leaves Adai", lunch: "Methi Peas Curry with Roti", snack: "Banana Lassi", dinner: "Jowar Muthia with Dal" },
      { day: "Friday", breakfast: "Jowar Vegetable Pancake", lunch: "Spinach Corn Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Sattu Cheela with Curd" },
      { day: "Saturday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Stuffed Brinjal with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Sunday", breakfast: "Onion Missi Roti", lunch: "Spicy Chicken Pepper Fry", snack: "White Pea Chaat", dinner: "Palak Besan Cheela with Curd" }
    ]
  },
  // Age 58 | underweight | plan4
  {
    age: 58, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Onion Paniyaram", lunch: "Sattu Curry with Rice", snack: "Ginger Buttermilk", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Palak Missi Roti", lunch: "Chayote Dal Curry with Roti", snack: "Jowar Chikki", dinner: "Lemon Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Peanut Banana Bowl", lunch: "Spicy Prawn Gongura Curry", snack: "Roasted Mung Beans", dinner: "Vegetable Muthia with Curd" },
      { day: "Thursday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Cauliflower Dal Curry with Roti", snack: "Peanut Sundal", dinner: "Carrot Roti with Dal" },
      { day: "Friday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Cluster Beans Dal Curry with Roti", snack: "Curry Leaf Buttermilk", dinner: "Ragi Ambli with Roti" },
      { day: "Saturday", breakfast: "Guava Curd Bowl", lunch: "Chana Dal with Spinach", snack: "Mint Buttermilk", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Sunday", breakfast: "Jowar Thalipeeth", lunch: "Spicy Fish Tawa Fry", snack: "Murmura Peanut Chaat", dinner: "Rice Flour Vegetable Pancake" }
    ]
  },
  // Age 58 | normal | plan1
  {
    age: 58, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Curd Peanut Bowl", dinner: "Methi Akki Rotti" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Broad Beans Masala with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Stuffed Brinjal with Roti" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Roti", lunch: "Prawn Ginger Fry", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "White Pea Curry with Phulka" },
      { day: "Thursday", breakfast: "Rava Paniyaram", lunch: "Spinach Chana Curry with Roti", snack: "Poha Jaggery Ladoo", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Ragi Paniyaram", lunch: "Tindora Sesame Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Methi Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Jowar Malt with Milk", lunch: "Raw Mango Dal with Rice", snack: "Murmura Onion Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Traditional Prawn Green Masala Fry", snack: "Guava Peanut Chaat", dinner: "Onion Thalipeeth with Curd" }
    ]
  },
  // Age 58 | normal | plan2
  {
    age: 58, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Thalipeeth", lunch: "Broad Beans Masala with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Tuesday", breakfast: "Jowar Kanji with Curd", lunch: "Carrot Chana Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Kala Vatana Usal with Roti" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Roti", lunch: "Coastal Chicken Andhra Pepper Roast", snack: "Boiled Groundnut Salad", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Chana Dal Roti", lunch: "Dal with Drumstick Leaves", snack: "Ragi Puffed Grain Chaat", dinner: "Methi Muthia with Dal" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Sprouted Moong Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Saturday", breakfast: "Palak Besan Cheela", lunch: "Stuffed Bhindi with Roti", snack: "Ragi Banana Balls", dinner: "Palak Dhokla with Chutney" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Home-Style Chicken Pepper Onion Roast", snack: "Peanut Chikki", dinner: "Akki Rotti with Curd" }
    ]
  },
  // Age 58 | normal | plan3
  {
    age: 58, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Paniyaram", lunch: "Potato Peas Curry with Rice", snack: "White Peas Sundal", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Radish Roti with Curd", lunch: "Stuffed Tindora with Roti", snack: "Beetroot Peanut Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Khaman Dhokla", lunch: "Traditional Prawn Lemon Pepper Fry", snack: "Puffed Rice Chikki", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Drumstick Leaves Dal with Roti", snack: "Roasted Corn Peanut Mix", dinner: "Urad Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Tindora Peanut Curry with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Bengali Masoor Dal with Rice", snack: "Raw Banana Chaat", dinner: "Khaman Dhokla with Curd" },
      { day: "Sunday", breakfast: "Onion Besan Cheela", lunch: "Traditional Chicken Tamarind Fry", snack: "Banana Ragi Balls", dinner: "Rice Sevai Vegetable Bowl" }
    ]
  },
  // Age 58 | normal | plan4
  {
    age: 58, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Gujarati Dal with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Palak Missi Roti with Curd" },
      { day: "Tuesday", breakfast: "Dudhi Muthia", lunch: "Carrot Moong Curry with Roti", snack: "Homemade Murmura Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Wednesday", breakfast: "Ragi Rotti with Chutney", lunch: "Light Fish Mangalorean Curry", snack: "Roasted Rice Flake Mixture", dinner: "Vegetable Adai with Curd" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Chana Dal with Ridge Gourd", snack: "Homemade Popcorn with Peanuts", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Dosakaya Pappu with Rice", snack: "Boiled Corn with Lemon", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Saturday", breakfast: "Masoor Dal Cheela", lunch: "White Peas Curry with Rice", snack: "Green Gram Chaat", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Sunday", breakfast: "Methi Thalipeeth", lunch: "Coastal Prawn Andhra Pepper Fry", snack: "Curd Sweet Potato Bowl", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 58 | overweight | plan1
  {
    age: 58, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Sattu Cheela", lunch: "Matki Usal with Bhakri", snack: "Roasted Sweet Corn", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Bajra Ambli", lunch: "Potato Methi Curry with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Banana with Roasted Peanuts", lunch: "Prawn Garlic Fry", snack: "Sattu Jaggery Ladoo", dinner: "Aval Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Ragi Banana Malt", lunch: "Kala Vatana Usal with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "Bajra Rotti with Dal" },
      { day: "Friday", breakfast: "Moong Dal Paniyaram", lunch: "Carrot Peas Masala with Roti", snack: "Jaggery Lassi", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Green Gram Masala with Rice", snack: "Murmura Black Chana Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Roti", lunch: "Coastal Chicken Dry Lemon Roast", snack: "Roasted Gram Balls", dinner: "Jowar Malt with Vegetable Curry" }
    ]
  },
  // Age 58 | overweight | plan2
  {
    age: 58, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Potato Beans Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Methi Adai with Curd" },
      { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "Yam Pepper Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Wednesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Chicken Tawa Fry", snack: "Ragi Peanut Ladoo", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Methi Corn Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Ragi Kozhukattai", lunch: "Cowpea Masala with Roti", snack: "Jowar Puffed Grain Chaat", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Saturday", breakfast: "Ragi Thalipeeth", lunch: "Sprouted Moong Curry with Roti", snack: "Boiled Yam Chaat", dinner: "Lobia Curry with Roti" },
      { day: "Sunday", breakfast: "Methi Handvo", lunch: "Traditional Chicken Mint Pepper Roast", snack: "Curd Cucumber Peanut Bowl", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 58 | overweight | plan3
  {
    age: 58, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Aval Upma with Peanuts", lunch: "Bharli Vangi with Bhakri", snack: "Black Chana Sundal", dinner: "Mixed Dal Adai with Curd" },
      { day: "Tuesday", breakfast: "Onion Thalipeeth", lunch: "Brinjal Dal Curry with Roti", snack: "Boiled Peanut Chaat", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Wednesday", breakfast: "Moong Dal Dhokla", lunch: "Light Chicken Andhra Fry", snack: "Horse Gram Sundal", dinner: "Raw Banana Masala with Phulka" },
      { day: "Thursday", breakfast: "Methi Besan Cheela", lunch: "Dal with Fenugreek Leaves", snack: "Sesame Jaggery Ladoo", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Friday", breakfast: "Bottle Gourd Handvo", lunch: "Maharashtrian Amti with Rice", snack: "Dry Roasted Corn", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Saturday", breakfast: "Bajra Rotti with Curd", lunch: "Beerakaya Pappu with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Jowar Muthia", lunch: "Light Chicken Coconut Ginger Roast", snack: "Corn Peanut Sundal", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 58 | overweight | plan4
  {
    age: 58, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Papaya Curd Bowl", lunch: "Cauliflower Methi Curry with Roti", snack: "Rice Kanji Drink", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Tuesday", breakfast: "Vegetable Thalipeeth", lunch: "Lobia Curry with Roti", snack: "Plain Homemade Lassi", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Ragi Malt with Jaggery", lunch: "Spicy Chicken Jeera Garlic Roast", snack: "Green Gram Sundal", dinner: "Methi Handvo with Chutney" },
      { day: "Thursday", breakfast: "Onion Adai", lunch: "Moong Dal with Spinach", snack: "Puffed Rice Chana Mixture", dinner: "Sattu Curry with Phulka" },
      { day: "Friday", breakfast: "Methi Missi Roti", lunch: "Brinjal Peanut Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Cabbage Carrot Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Chayote Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Coastal Fish Green Masala Fry", snack: "Roasted Chana Ladoo", dinner: "Chana Usal with Bhakri" }
    ]
  },
  // Age 59 | underweight | plan1
  {
    age: 59, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Guava Curd Bowl", lunch: "Black-Eyed Pea Curry with Roti", snack: "Homemade Corn Chivda", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Tuesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Chayote Moong Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Yam Pepper Curry with Roti" },
      { day: "Wednesday", breakfast: "Mixed Dal Cheela", lunch: "Chicken Konkan Fry", snack: "Rice Kanji Drink", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Thursday", breakfast: "Sattu Vegetable Pancake", lunch: "Cowpea Curry with Rice", snack: "Mint Buttermilk", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Friday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Dill Leaves Curry with Roti", snack: "Homemade Jowar Savoury Balls", dinner: "White Pea Curry with Phulka" },
      { day: "Saturday", breakfast: "Ragi Vegetable Roti", lunch: "Cauliflower Peas Masala with Rice", snack: "Roasted Green Gram", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Bajra Ambli", lunch: "Traditional Chicken Lemon Pepper Fry", snack: "Homemade Peanut Bar", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 59 | underweight | plan2
  {
    age: 59, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Onion Missi Roti", lunch: "Amaranth Leaves Curry with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Vegetable Muthia with Curd" },
      { day: "Tuesday", breakfast: "Ragi Banana Malt", lunch: "Stuffed Brinjal with Roti", snack: "Puffed Rice Chikki", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Leftover Rice Paniyaram", lunch: "Light Chicken Lemon Garlic Roast", snack: "Peanut Poha Chivda", dinner: "Methi Muthia with Dal" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Carrot Chana Curry with Rice", snack: "Papaya Lassi", dinner: "Chayote Moong Curry with Roti" },
      { day: "Friday", breakfast: "Ragi Dhokla", lunch: "Moong Dal with Sweet Potato", snack: "Banana Ragi Balls", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Potato Peas Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Aval Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Dudhi Muthia", lunch: "Spicy Chicken Dry Methi Roast", snack: "Dry Roasted Corn", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 59 | underweight | plan3
  {
    age: 59, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Sevai", lunch: "Dal with Amaranth Leaves", snack: "White Peas Sundal", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Methi Muthia", lunch: "Dal with Drumstick Leaves", snack: "Sesame Jaggery Ladoo", dinner: "Matki Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Methi Akki Rotti", lunch: "Spicy Chicken Mustard Pepper Roast", snack: "Ragi Buttermilk", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Carrot Muthia", lunch: "Maharashtrian Amti with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Friday", breakfast: "Bottle Gourd Handvo", lunch: "Bharli Vangi with Bhakri", snack: "Murmura Onion Chaat", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Drumstick Leaves Adai", lunch: "Stuffed Tindora with Roti", snack: "Beetroot Peanut Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Jowar Ambli", lunch: "Light Chicken Coconut Fry", snack: "Sattu Jaggery Ladoo", dinner: "Carrot Muthia with Dal" }
    ]
  },
  // Age 59 | underweight | plan4
  {
    age: 59, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Sattu Curry with Roti", snack: "Peanut Sundal", dinner: "Methi Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Amaranth Dal with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Coconut Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Onion Thalipeeth", lunch: "Light Chicken Garlic Fry", snack: "Roasted Rice Flake Mixture", dinner: "Onion Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Gongura Pappu with Rice", snack: "Banana Jaggery Milk", dinner: "Besan Dhokla with Curd" },
      { day: "Friday", breakfast: "Lemon Sevai with Peanuts", lunch: "Kala Vatana Usal with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Saturday", breakfast: "Masoor Dal Cheela", lunch: "Beetroot Masala with Roti", snack: "Jowar Malt Drink", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Onion Adai", lunch: "Traditional Chicken Curry Leaf Fry", snack: "Roasted Mung Beans", dinner: "Sattu Curry with Phulka" }
    ]
  },
  // Age 59 | normal | plan1
  {
    age: 59, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Malt with Jaggery", lunch: "Cabbage Moong Curry with Roti", snack: "Roasted Cowpeas", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Broad Beans Masala with Roti", snack: "Roasted Chana Ladoo", dinner: "Bajra Rotti with Dal" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "Chicken Dry Green Masala Roast", snack: "Peanut Chikki", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Thursday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Dosakaya Pappu with Rice", snack: "Guava Jaggery Bowl", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Bajra Methi Roti", lunch: "Tindora Peanut Curry with Rice", snack: "Black Chana Sundal", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Yam Pepper Curry with Rice", snack: "Ginger Buttermilk", dinner: "Vegetable Adai with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Adai", lunch: "Spicy Fish Coriander Lemon Fry", snack: "Lobia Chaat", dinner: "Radish Roti with Dal" }
    ]
  },
  // Age 59 | normal | plan2
  {
    age: 59, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Green Gram Masala with Roti", snack: "Curd Peanut Bowl", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Jowar Kanji with Curd", lunch: "Brinjal Peanut Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Banana Ragi Pancake", lunch: "Home-Style Fish Tamarind Pepper Fry", snack: "Roasted Bengal Gram with Onion", dinner: "Vegetable Handvo with Curd" },
      { day: "Thursday", breakfast: "Vegetable Muthia", lunch: "Beetroot Coconut Curry with Rice", snack: "Green Gram Sundal", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Methi Thalipeeth", lunch: "Broad Beans Masala with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Rice Kanji with Dal" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Black-Eyed Pea Curry with Rice", snack: "White Pea Chaat", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Sunday", breakfast: "Onion Paniyaram", lunch: "Traditional Chicken Dry Pepper Roast", snack: "Ragi Puffed Grain Chaat", dinner: "Bottle Gourd Handvo with Curd" }
    ]
  },
  // Age 59 | normal | plan3
  {
    age: 59, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Peanut Banana Bowl", lunch: "Matki Usal with Bhakri", snack: "Boiled Chana Chaat with Onion", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Tuesday", breakfast: "Ragi Malt with Jaggery", lunch: "Drumstick Leaves Dal with Roti", snack: "Roasted Chana Chikki", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Wednesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Spicy Chicken Sesame Fry", snack: "Roasted Chana Jaggery Mix", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Cabbage Carrot Curry with Rice", snack: "Green Gram Chaat", dinner: "Jowar Rotti with Dal" },
      { day: "Friday", breakfast: "Methi Missi Roti", lunch: "Toor Dal with Raw Banana", snack: "Cowpea Chaat", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Ragi Kozhukattai", lunch: "Andhra Mudda Pappu with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Lobia Curry with Roti" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Traditional Fish Curry Leaf Roast", snack: "Curry Leaf Buttermilk", dinner: "Cabbage Besan Cheela with Chutney" }
    ]
  },
  // Age 59 | normal | plan4
  {
    age: 59, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Thalipeeth", lunch: "Green Peas Usal with Roti", snack: "Homemade Poha Chivda", dinner: "Palak Missi Roti with Curd" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Gujarati Dal with Rice", snack: "Sesame Chikki", dinner: "Moong Dal Handvo" },
      { day: "Wednesday", breakfast: "Methi Handvo", lunch: "Light Chicken Peanut Pepper Roast", snack: "Roasted Gram Balls", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Jowar Thalipeeth", lunch: "Sprouted Moong Curry with Rice", snack: "Horse Gram Sundal", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Carrot Peas Masala with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Methi Handvo with Chutney" },
      { day: "Saturday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Spinach Corn Curry with Rice", snack: "Banana Sesame Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Fish Curry Leaf Fry", snack: "Homemade Banana Shake", dinner: "Methi Adai with Curd" }
    ]
  },
  // Age 59 | overweight | plan1
  {
    age: 59, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Palak Dhokla", lunch: "Cauliflower Dal Curry with Roti", snack: "Bajra Malt Drink", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Tuesday", breakfast: "Banana with Roasted Peanuts", lunch: "Peas Potato Curry with Rice", snack: "Jowar Chikki", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Chicken Tawa Coriander Fry", snack: "Boiled Corn with Lemon", dinner: "Sattu Roti with Dal" },
      { day: "Thursday", breakfast: "Green Peas Roti", lunch: "Sweet Potato Peas Curry with Roti", snack: "Cowpea Sundal", dinner: "Palak Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Bajra Rotti with Curd", lunch: "Dal with Fenugreek Leaves", snack: "Homemade Murmura Chaat", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Ragi Sevai Upma", lunch: "Spinach Chana Curry with Roti", snack: "Boiled Peanut Chaat", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Sunday", breakfast: "Ammini Kozhukattai", lunch: "Coastal Chicken Dry Pudina Roast", snack: "Curd Roasted Chana Bowl", dinner: "Lemon Sevai with Peanuts" }
    ]
  },
  // Age 59 | overweight | plan2
  {
    age: 59, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Aval Upma with Peanuts", lunch: "Beerakaya Pappu with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Ragi Rotti with Curd" },
      { day: "Tuesday", breakfast: "Chana Dal Roti", lunch: "Chana Dal with Ridge Gourd", snack: "Papaya Coconut Bowl", dinner: "Sattu Cheela with Curd" },
      { day: "Wednesday", breakfast: "Chana Dal Cheela", lunch: "Light Fish Garlic Pepper Fry", snack: "Sattu Jaggery Balls", dinner: "Methi Missi Roti with Dal" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Masoor Dal with Methi", snack: "Ragi Peanut Chikki", dinner: "Jowar Ambli with Roti" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Cluster Beans Dal Curry with Roti", snack: "Murmura Black Chana Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Saturday", breakfast: "Banana Jowar Pancake", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Sunday", breakfast: "Vegetable Adai", lunch: "Light Chicken Lemon Herb Roast", snack: "Roasted Black Chana with Lemon", dinner: "Ragi Ambli with Roti" }
    ]
  },
  // Age 59 | overweight | plan3
  {
    age: 59, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Methi Peas Curry with Roti", snack: "Roasted Sweet Corn", dinner: "Stuffed Brinjal with Roti" },
      { day: "Tuesday", breakfast: "Methi Adai", lunch: "Moong Dal with Carrot", snack: "Poha Jaggery Ladoo", dinner: "Green Peas Roti with Curd" },
      { day: "Wednesday", breakfast: "Ragi Paniyaram", lunch: "Light Chicken Sesame Pepper Roast", snack: "Jaggery Lassi", dinner: "Onion Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Carrot Besan Cheela", lunch: "Cowpea Masala with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Moong Dal Roti", lunch: "Stuffed Brinjal with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Jowar Kanji with Dal" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Kala Vatana Usal with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Handvo", lunch: "Chicken Dry Garlic Roast", snack: "Homemade Popcorn with Peanuts", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 59 | overweight | plan4
  {
    age: 59, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Yam Masala with Roti", snack: "Murmura Peanut Chaat", dinner: "Beetroot Masala with Roti" },
      { day: "Tuesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Matki Usal with Rice", snack: "Jaggery Ragi Milk", dinner: "Bajra Ambli with Curd" },
      { day: "Wednesday", breakfast: "Moong Dal Paniyaram", lunch: "Traditional Fish Mangalorean Curry", snack: "Sweet Potato Sesame Balls", dinner: "Raw Banana Masala with Phulka" },
      { day: "Thursday", breakfast: "Sattu Cheela", lunch: "Raw Mango Dal with Rice", snack: "Papaya Peanut Chaat", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Vegetable Handvo", lunch: "Chayote Dal Curry with Roti", snack: "Jeera Buttermilk", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Saturday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Methi Corn Curry with Rice", snack: "Sattu Buttermilk", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Dhokla", lunch: "Home-Style Chicken Curry Leaf Garlic Roast", snack: "Banana Sattu Shake", dinner: "Ragi Thalipeeth with Dal" }
    ]
  },
  // Age 60 | underweight | plan1
  {
    age: 60, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Banana Malt", lunch: "Chayote Moong Curry with Rice", snack: "Homemade Banana Shake", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "Yam Pepper Curry with Rice", snack: "Jowar Malt Drink", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Pancake", lunch: "Chicken Malabar Fry", snack: "Ragi Peanut Ladoo", dinner: "Methi Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Ragi Ambli with Jaggery", lunch: "Gongura Pappu with Rice", snack: "Mint Buttermilk", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Moong Dal with Carrot", snack: "Bajra Malt Drink", dinner: "Vegetable Muthia with Curd" },
      { day: "Saturday", breakfast: "Green Peas Muthia", lunch: "Lobia Curry with Roti", snack: "Plain Homemade Lassi", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Sunday", breakfast: "Bajra Methi Roti", lunch: "Home-Style Chicken Coriander Fry", snack: "Puffed Rice Chikki", dinner: "Ajwain Missi Roti with Dal" }
    ]
  },
  // Age 60 | underweight | plan2
  {
    age: 60, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Rotti with Chutney", lunch: "Cabbage Moong Curry with Roti", snack: "Banana Jaggery Bowl", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Stuffed Bhindi with Roti", snack: "Murmura Peanut Chaat", dinner: "Kala Vatana Usal with Roti" },
      { day: "Wednesday", breakfast: "Vegetable Muthia", lunch: "Spicy Chicken Pepper Roast", snack: "Banana Lassi", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Sattu Vegetable Roti", lunch: "Cauliflower Peas Masala with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Green Peas Roti with Curd" },
      { day: "Friday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Dal with Drumstick Leaves", snack: "Roasted Green Gram", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Methi Peas Curry with Roti", snack: "Boiled Peanut Chaat", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Light Chicken Ginger Lemon Fry", snack: "Homemade Jowar Savoury Balls", dinner: "Lobia Curry with Roti" }
    ]
  },
  // Age 60 | underweight | plan3
  {
    age: 60, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Thalipeeth", lunch: "Beetroot Masala with Roti", snack: "Murmura Black Chana Chaat", dinner: "Mixed Dal Adai with Curd" },
      { day: "Tuesday", breakfast: "Methi Akki Rotti", lunch: "Raw Banana Masala with Roti", snack: "Ragi Buttermilk", dinner: "Besan Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Carrot Roti with Curd", lunch: "Coastal Chicken Jeera Fry", snack: "Papaya Coconut Bowl", dinner: "Onion Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Green Peas Usal with Roti", snack: "Rice Kanji Drink", dinner: "Jowar Muthia with Dal" },
      { day: "Friday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Sattu Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Methi Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Chana Dal with Ridge Gourd", snack: "Papaya Peanut Chaat", dinner: "Chana Dal Roti with Curd" },
      { day: "Sunday", breakfast: "Carrot Besan Cheela", lunch: "Light Fish Andhra Pulusu", snack: "Ragi Banana Balls", dinner: "Mixed Dal Cheela with Curd" }
    ]
  },
  // Age 60 | underweight | plan4
  {
    age: 60, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Cauliflower Methi Curry with Roti", snack: "Murmura Onion Chaat", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Onion Paniyaram", lunch: "Moong Dal with Spinach", snack: "Homemade Popcorn with Peanuts", dinner: "Lemon Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Sweet Potato Roti", lunch: "Light Fish Green Masala Fry", snack: "Cowpea Sundal", dinner: "Palak Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Methi Muthia", lunch: "Spinach Corn Curry with Rice", snack: "White Pea Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Friday", breakfast: "Jowar Thalipeeth", lunch: "Dal with Carrot and Beans", snack: "Sesame Chikki", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Bajra Ambli", lunch: "Stuffed Brinjal with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Spicy Fish Andhra Pepper Fry", snack: "Homemade Corn Chivda", dinner: "Moong Dal Dhokla with Chutney" }
    ]
  },
  // Age 60 | normal | plan1
  {
    age: 60, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Thalipeeth", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Green Gram Chaat", dinner: "Sattu Curry with Phulka" },
      { day: "Tuesday", breakfast: "Sattu Cheela", lunch: "Amaranth Dal with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Methi Akki Rotti" },
      { day: "Wednesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Chicken Dry Jeera Roast", snack: "White Peas Sundal", dinner: "Stuffed Brinjal with Roti" },
      { day: "Thursday", breakfast: "Cabbage Besan Cheela", lunch: "Amaranth Leaves Curry with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Green Peas Usal with Chapati" },
      { day: "Friday", breakfast: "Beetroot Roti with Curd", lunch: "Toor Dal with Raw Banana", snack: "Ragi Peanut Chikki", dinner: "Khaman Dhokla with Curd" },
      { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Brinjal Peanut Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Bajra Ambli with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "Light Chicken Spinach Pepper Fry", snack: "Jowar Puffed Grain Chaat", dinner: "Rice Sevai Vegetable Bowl" }
    ]
  },
  // Age 60 | normal | plan2
  {
    age: 60, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Vegetable Pancake", lunch: "Methi Corn Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Brinjal Dal Curry with Roti", snack: "Lobia Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Jowar Ambli", lunch: "Coastal Chicken Tawa Pepper Roast", snack: "Black-Eyed Pea Sundal", dinner: "Vegetable Handvo with Curd" },
      { day: "Thursday", breakfast: "Banana Jowar Pancake", lunch: "Peas Potato Curry with Roti", snack: "Roasted Gram Balls", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Black-Eyed Pea Curry with Roti", snack: "Papaya Lassi", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Chana Dal Cheela", lunch: "Cluster Beans Dal Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "Spicy Chicken Konkan Fry", snack: "Sweet Potato Sesame Balls", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 60 | normal | plan3
  {
    age: 60, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Handvo", lunch: "Broad Beans Dal Curry with Rice", snack: "Jaggery Lassi", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Tuesday", breakfast: "Onion Missi Roti", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Beetroot Masala with Roti" },
      { day: "Wednesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Coastal Chicken Dry Sesame Roast", snack: "Jeera Buttermilk", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Ragi Sevai Upma", lunch: "Dosakaya Pappu with Rice", snack: "Black Chana Sundal", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Kala Vatana Usal with Rice", snack: "Roasted Chana Chikki", dinner: "Bharli Vangi with Bhakri" },
      { day: "Saturday", breakfast: "Sattu Roti with Curd", lunch: "Beerakaya Pappu with Rice", snack: "Ginger Buttermilk", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Jowar Vegetable Pancake", lunch: "Spicy Prawn Coriander Lemon Fry", snack: "Roasted Corn Peanut Mix", dinner: "Vegetable Adai with Curd" }
    ]
  },
  // Age 60 | normal | plan4
  {
    age: 60, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Paniyaram", lunch: "Drumstick Leaves Dal with Roti", snack: "Peanut Poha Chivda", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Aval Upma with Peanuts", lunch: "Dill Leaves Dal with Rice", snack: "Homemade Poha Chivda", dinner: "Radish Roti with Dal" },
      { day: "Wednesday", breakfast: "Lemon Sevai with Peanuts", lunch: "Traditional Chicken Malabar Fry", snack: "Green Gram Sundal", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Bharli Vangi with Bhakri", snack: "Sattu Jaggery Balls", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "Spinach Chana Curry with Roti", snack: "Corn Peanut Sundal", dinner: "Green Peas Muthia with Curd" },
      { day: "Saturday", breakfast: "Drumstick Leaves Adai", lunch: "Stuffed Tindora with Roti", snack: "Sattu Buttermilk", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Methi Besan Cheela", lunch: "Traditional Prawn Coconut Curry", snack: "Homemade Ragi Savoury Balls", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 60 | overweight | plan1
  {
    age: 60, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Kozhukattai", lunch: "Green Gram Masala with Roti", snack: "Beetroot Peanut Chaat", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Moong Dal Handvo", lunch: "Sweet Potato Peas Curry with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Wednesday", breakfast: "Methi Handvo", lunch: "Spicy Chicken Curry Leaf Fry", snack: "Bajra Puffed Grain Chaat", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Thursday", breakfast: "Green Peas Roti", lunch: "Sprouted Moong Curry with Roti", snack: "Jowar Chikki", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Friday", breakfast: "Bajra Thalipeeth", lunch: "Tindora Peanut Curry with Rice", snack: "Roasted Cowpeas", dinner: "Carrot Roti with Dal" },
      { day: "Saturday", breakfast: "Bottle Gourd Handvo", lunch: "Carrot Chana Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Sunday", breakfast: "Vegetable Adai", lunch: "Fish Lemon Roast", snack: "Banana Sattu Shake", dinner: "Bottle Gourd Handvo with Curd" }
    ]
  },
  // Age 60 | overweight | plan2
  {
    age: 60, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "Chana Dal with Spinach", snack: "Sattu Jaggery Ladoo", dinner: "Dudhi Muthia with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Rice Sevai", lunch: "Dal with Fenugreek Leaves", snack: "Banana Ragi Balls", dinner: "Palak Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Bajra Malt with Jaggery", lunch: "Spicy Chicken Red Pepper Roast", snack: "Roasted Bengal Gram with Onion", dinner: "Yam Pepper Curry with Roti" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Chana Usal with Bhakri", snack: "Ragi Jaggery Ladoo", dinner: "Sattu Roti with Dal" },
      { day: "Friday", breakfast: "Bajra Rotti with Curd", lunch: "Beetroot Coconut Curry with Rice", snack: "Horse Gram Sundal", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Millet Vegetable Pancake", lunch: "Black-Eyed Pea Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Sunday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Light Chicken Garlic Pepper Fry", snack: "Roasted Peanuts with Curry Leaves", dinner: "Green Gram Curry with Jowar Roti" }
    ]
  },
  // Age 60 | overweight | plan3
  {
    age: 60, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Mixed Dal Adai", lunch: "Green Gram Masala with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Raw Banana Masala with Phulka" },
      { day: "Tuesday", breakfast: "Jowar Kanji with Curd", lunch: "Potato Peas Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Jowar Rotti with Dal" },
      { day: "Wednesday", breakfast: "Guava Curd Bowl", lunch: "Coastal Prawn Tamarind Curry", snack: "Boiled Chana Chaat with Onion", dinner: "Chana Usal with Bhakri" },
      { day: "Thursday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Kala Vatana Usal with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Stuffed Bhindi with Roti" },
      { day: "Friday", breakfast: "Leftover Rice Paniyaram", lunch: "Cowpea Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Saturday", breakfast: "Besan Dhokla", lunch: "Lobia Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Khaman Dhokla", lunch: "Light Chicken Village-Style Fry", snack: "Boiled Yam Chaat", dinner: "Ragi Rotti with Curd" }
    ]
  },
  // Age 60 | overweight | plan4
  {
    age: 60, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Chana Dal Roti", lunch: "Dal with Amaranth Leaves", snack: "Curd Cucumber Peanut Bowl", dinner: "Matki Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Roti", lunch: "Drumstick Leaves Curry with Rice", snack: "Peanut Chikki", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Onion Besan Cheela", lunch: "Coastal Chicken Ginger Lemon Fry", snack: "Roasted Mung Beans", dinner: "Beetroot Roti with Curd" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Maharashtrian Amti with Rice", snack: "Homemade Murmura Chaat", dinner: "Methi Adai with Curd" },
      { day: "Friday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Raw Mango Dal with Rice", snack: "Cowpea Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "White Peas Curry with Rice", snack: "Raw Banana Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Sunday", breakfast: "Jowar Malt with Milk", lunch: "Chicken Coriander Fry", snack: "Ragi Puffed Grain Chaat", dinner: "Ragi Vegetable Pancake with Curd" }
    ]
  },
  // Age 61 | underweight | plan1
  {
    age: 61, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Sattu Cheela", lunch: "Raw Banana Masala with Roti", snack: "Bajra Malt Drink", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Masoor Dal with Methi", snack: "White Pea Chaat", dinner: "Palak Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Palak Dhokla", lunch: "Light Fish Coriander Fry", snack: "Curry Leaf Buttermilk", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Thursday", breakfast: "Vegetable Handvo", lunch: "Chayote Dal Curry with Roti", snack: "Jowar Chikki", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "Chayote Moong Curry with Rice", snack: "Curd Sweet Potato Bowl", dinner: "Dudhi Muthia with Curd" },
      { day: "Saturday", breakfast: "Vegetable Muthia", lunch: "Spinach Chana Curry with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Jowar Kanji with Curd", lunch: "Prawn Coriander Fry", snack: "Boiled Peanut Chaat", dinner: "Cabbage Chana Dal Curry with Roti" }
    ]
  },
  // Age 61 | underweight | plan2
  {
    age: 61, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Guava Curd Bowl", lunch: "Carrot Peas Masala with Roti", snack: "Banana Sattu Shake", dinner: "Coconut Sevai with Peanuts" },
      { day: "Tuesday", breakfast: "Dudhi Muthia", lunch: "Potato Methi Curry with Roti", snack: "Banana Ragi Balls", dinner: "Rice Kanji with Dal" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Home-Style Chicken Curry Leaf Garlic Roast", snack: "Homemade Popcorn with Peanuts", dinner: "Sattu Curry with Phulka" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Peas Potato Curry with Roti", snack: "Homemade Murmura Chaat", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Friday", breakfast: "Khaman Dhokla", lunch: "Toor Dal with Raw Banana", snack: "Jaggery Ragi Milk", dinner: "Jowar Muthia with Dal" },
      { day: "Saturday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Sattu Curry with Roti", snack: "Ragi Buttermilk", dinner: "Jowar Rotti with Dal" },
      { day: "Sunday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Home-Style Chicken Punjabi Masala Fry", snack: "Peanut Poha Chivda", dinner: "Ajwain Missi Roti with Dal" }
    ]
  },
  // Age 61 | underweight | plan3
  {
    age: 61, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Moong Dal with Carrot", snack: "Jowar Puffed Grain Chaat", dinner: "Stuffed Brinjal with Roti" },
      { day: "Tuesday", breakfast: "Ragi Thalipeeth", lunch: "Stuffed Brinjal with Roti", snack: "Jowar Malt Drink", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Methi Adai", lunch: "Light Chicken Green Chilli Fry", snack: "Banana Ragi Shake", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Cauliflower Methi Curry with Roti", snack: "Puffed Rice Chikki", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Jowar Malt with Milk", lunch: "Maharashtrian Amti with Rice", snack: "Peanut Chikki", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Saturday", breakfast: "Moong Dal Roti", lunch: "Masoor Dal with Dill Leaves", snack: "Bajra Puffed Grain Chaat", dinner: "Yam Pepper Curry with Roti" },
      { day: "Sunday", breakfast: "Aval Upma with Peanuts", lunch: "Home-Style Fish Green Masala Fry", snack: "Ragi Peanut Chikki", dinner: "Masoor Dal Cheela with Chutney" }
    ]
  },
  // Age 61 | underweight | plan4
  {
    age: 61, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sattu Roti with Curd", lunch: "Green Gram Masala with Roti", snack: "Roasted Gram Balls", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Raw Mango Dal with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Wednesday", breakfast: "Bajra Ambli", lunch: "Coastal Chicken Cumin Coriander Roast", snack: "Sesame Chikki", dinner: "Moong Dal Handvo" },
      { day: "Thursday", breakfast: "Jowar Thalipeeth", lunch: "Methi Corn Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Ragi Ambli with Roti" },
      { day: "Friday", breakfast: "Methi Missi Roti", lunch: "Cabbage Moong Curry with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Cabbage Carrot Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Sunday", breakfast: "Ragi Kozhukattai", lunch: "Home-Style Chicken Jeera Pepper Fry", snack: "Puffed Rice Peanut Mixture", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 61 | normal | plan1
  {
    age: 61, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Malt with Jaggery", lunch: "Spinach Corn Curry with Rice", snack: "Ginger Buttermilk", dinner: "Aval Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Methi Akki Rotti", lunch: "Dal with Drumstick Leaves", snack: "Homemade Jowar Savoury Balls", dinner: "Ragi Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Green Peas Roti", lunch: "Chicken Cumin Coriander Roast", snack: "Dry Roasted Corn", dinner: "Green Peas Roti with Curd" },
      { day: "Thursday", breakfast: "Ragi Malt with Jaggery", lunch: "Potato Beans Curry with Rice", snack: "Guava Peanut Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Friday", breakfast: "Lemon Sevai with Peanuts", lunch: "White Peas Masala with Roti", snack: "Black-Eyed Pea Sundal", dinner: "Bharli Vangi with Bhakri" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Green Peas Usal with Roti", snack: "Boiled Groundnut Salad", dinner: "Mixed Dal Adai with Curd" },
      { day: "Sunday", breakfast: "Onion Missi Roti", lunch: "Spicy Chicken Dry Green Masala Roast", snack: "Ragi Peanut Ladoo", dinner: "Mixed Dal Cheela with Curd" }
    ]
  },
  // Age 61 | normal | plan2
  {
    age: 61, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Moong Dal Dhokla", lunch: "Brinjal Coconut Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Sattu Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Wednesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Chicken Red Chilli Fry", snack: "Curd Roasted Chana Bowl", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Beerakaya Pappu with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Friday", breakfast: "Leftover Rice Paniyaram", lunch: "Sprouted Moong Curry with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "Black-Eyed Pea Curry with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Onion Besan Cheela", lunch: "Spicy Fish Gongura Curry", snack: "Beetroot Peanut Chaat", dinner: "Black-Eyed Pea Curry with Roti" }
    ]
  },
  // Age 61 | normal | plan3
  {
    age: 61, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Banana Ragi Pancake", lunch: "Cauliflower Peas Masala with Rice", snack: "Cowpea Sundal", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Methi Besan Cheela", lunch: "Potato Beans Curry with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Boiled Yam with Curd", lunch: "Home-Style Chicken Sukka", snack: "Roasted Corn Peanut Mix", dinner: "Stuffed Bhindi with Roti" },
      { day: "Thursday", breakfast: "Jowar Methi Roti", lunch: "Tindora Sesame Curry with Roti", snack: "Banana Lassi", dinner: "Bajra Ambli with Curd" },
      { day: "Friday", breakfast: "Green Peas Muthia", lunch: "Lobia Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Saturday", breakfast: "Bajra Thalipeeth", lunch: "Black-Eyed Pea Curry with Roti", snack: "Peanut Sundal", dinner: "Vegetable Adai with Curd" },
      { day: "Sunday", breakfast: "Beetroot Roti with Curd", lunch: "Traditional Chicken Pan Fry", snack: "Peanut Jaggery Ladoo", dinner: "Vegetable Handvo with Curd" }
    ]
  },
  // Age 61 | normal | plan4
  {
    age: 61, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Broad Beans Dal Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Methi Akki Rotti" },
      { day: "Tuesday", breakfast: "Ragi Paniyaram", lunch: "Green Gram Masala with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Sweet Potato Roti with Curd" },
      { day: "Wednesday", breakfast: "Methi Thalipeeth", lunch: "Home-Style Fish Bengali Jhol", snack: "White Peas Sundal", dinner: "Onion Adai with Chutney" },
      { day: "Thursday", breakfast: "Banana Jowar Pancake", lunch: "Broad Beans Masala with Rice", snack: "Horse Gram Sundal", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Friday", breakfast: "Papaya Curd Bowl", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Homemade Banana Shake", dinner: "Vegetable Muthia with Curd" },
      { day: "Saturday", breakfast: "Moong Dal Handvo", lunch: "Chana Usal with Bhakri", snack: "Murmura Onion Chaat", dinner: "Rava Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Fish Tawa Fry", snack: "Carrot Peanut Chaat", dinner: "Kala Vatana Usal with Roti" }
    ]
  },
  // Age 61 | overweight | plan1
  {
    age: 61, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Chana Dal Cheela", lunch: "Carrot Peas Masala with Rice", snack: "Roasted Chana Chikki", dinner: "Sattu Cheela with Curd" },
      { day: "Tuesday", breakfast: "Urad Dal Cheela", lunch: "Stuffed Bhindi with Roti", snack: "Homemade Poha Chivda", dinner: "Onion Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Roti", lunch: "Coastal Fish Pepper Roast", snack: "Papaya Lassi", dinner: "Urad Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Ragi Dhokla", lunch: "Matki Usal with Rice", snack: "Roasted Cowpeas", dinner: "Methi Adai with Curd" },
      { day: "Friday", breakfast: "Peanut Banana Bowl", lunch: "Potato Peas Curry with Rice", snack: "Curd Peanut Bowl", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Chana Dal Roti", lunch: "Lobia Curry with Roti", snack: "Roasted Mung Beans", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Rava Paniyaram", lunch: "Home-Style Chicken Coconut Fry", snack: "Black Chana Chaat with Lemon", dinner: "Jowar Kanji with Dal" }
    ]
  },
  // Age 61 | overweight | plan2
  {
    age: 61, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Rotti with Chutney", lunch: "Brinjal Peanut Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Mixed Dal Cheela", lunch: "Dal with Carrot and Beans", snack: "Roasted Green Gram", dinner: "Methi Handvo with Chutney" },
      { day: "Wednesday", breakfast: "Vegetable Adai", lunch: "Home-Style Chicken Tawa Fry", snack: "Boiled Yam Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Thursday", breakfast: "Onion Adai", lunch: "Brinjal Dal Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Chana Usal with Bhakri" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Amaranth Leaves Curry with Rice", snack: "Poha Jaggery Ladoo", dinner: "Khaman Dhokla with Curd" },
      { day: "Saturday", breakfast: "Rava Kichadi with Peanuts", lunch: "Drumstick Leaves Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Chicken Andhra Garlic Roast", snack: "Green Gram Sundal", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 61 | overweight | plan3
  {
    age: 61, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Cauliflower Dal Curry with Roti", snack: "Boiled Corn with Lemon", dinner: "Matki Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Rice Kanji with Curd", lunch: "Kala Vatana Usal with Roti", snack: "Papaya Coconut Bowl", dinner: "Palak Missi Roti with Curd" },
      { day: "Wednesday", breakfast: "Ragi Vegetable Pancake", lunch: "Coastal Fish Coconut Pepper Curry", snack: "Cowpea Chaat", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Carrot Besan Cheela", lunch: "Dill Leaves Dal with Rice", snack: "Black Chana Sundal", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Friday", breakfast: "Jowar Vegetable Pancake", lunch: "Matki Usal with Bhakri", snack: "Jeera Buttermilk", dinner: "Lemon Sevai with Peanuts" },
      { day: "Saturday", breakfast: "Cabbage Besan Cheela", lunch: "Chana Dal with Ridge Gourd", snack: "Roasted Rice Flake Mixture", dinner: "Lobia Curry with Roti" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Coastal Prawn Coriander Fry", snack: "Ragi Banana Balls", dinner: "Beetroot Masala with Roti" }
    ]
  },
  // Age 61 | overweight | plan4
  {
    age: 61, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Pancake", lunch: "Broad Beans Masala with Roti", snack: "Lobia Chaat", dinner: "Beetroot Roti with Curd" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Sprouted Moong Curry with Rice", snack: "Green Gram Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Home-Style Fish Ginger Garlic Fry", snack: "Ragi Puffed Grain Chaat", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Dal with Fenugreek Leaves", snack: "Murmura Black Chana Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Cowpea Masala with Roti", snack: "Roasted Sweet Corn", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Andhra Mudda Pappu with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Raw Banana Masala with Phulka" },
      { day: "Sunday", breakfast: "Carrot Muthia", lunch: "Coastal Prawn Gongura Curry", snack: "Roasted Bengal Gram with Onion", dinner: "Methi Missi Roti with Dal" }
    ]
  },
  // Age 62 | underweight | plan1
  {
    age: 62, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Banana Ragi Pancake", lunch: "Dal with Drumstick Leaves", snack: "Curd Roasted Chana Bowl", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Methi Handvo", lunch: "Brinjal Peanut Curry with Rice", snack: "Lobia Chaat", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Vegetable Adai", lunch: "Coastal Chicken Peanut Fry", snack: "Roasted Black Chana with Lemon", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Carrot Besan Cheela", lunch: "Broad Beans Dal Curry with Rice", snack: "Puffed Rice Chikki", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Friday", breakfast: "Jowar Ambli", lunch: "Cluster Beans Dal Curry with Roti", snack: "Cucumber Roasted Chana Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Saturday", breakfast: "Tomato-Free Vegetable Adai", lunch: "White Peas Masala with Roti", snack: "Poha Jaggery Ladoo", dinner: "Vegetable Handvo with Curd" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Prawn Lemon Fry", snack: "Roasted Chana Chikki", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 62 | underweight | plan2
  {
    age: 62, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Chana Dal Cheela", lunch: "Carrot Chana Curry with Rice", snack: "Homemade Banana Shake", dinner: "Onion Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Green Gram Masala with Rice", snack: "Boiled Corn with Lemon", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Green Peas Muthia", lunch: "Spicy Chicken Garlic Lemon Fry", snack: "Peanut Sundal", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Ragi Vegetable Roti", lunch: "Yam Masala with Roti", snack: "Banana Ragi Balls", dinner: "Onion Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Carrot Muthia", lunch: "Kala Vatana Usal with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Ragi Ambli with Jaggery", lunch: "Dosakaya Pappu with Rice", snack: "Roasted Mung Beans", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Besan Dhokla", lunch: "Traditional Chicken Dry Green Masala Roast", snack: "Raw Banana Chaat", dinner: "Yam Pepper Curry with Roti" }
    ]
  },
  // Age 62 | underweight | plan3
  {
    age: 62, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Paniyaram", lunch: "Potato Peas Curry with Rice", snack: "Guava Jaggery Bowl", dinner: "Jowar Kanji with Dal" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Pancake", lunch: "Stuffed Bhindi with Roti", snack: "Green Gram Chaat", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Banana Jowar Pancake", lunch: "Spicy Fish Curry Leaf Fry", snack: "Homemade Jowar Savoury Balls", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Cauliflower Methi Curry with Roti", snack: "Jowar Puffed Grain Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Friday", breakfast: "Methi Akki Rotti", lunch: "Brinjal Coconut Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Bajra Rotti with Dal" },
      { day: "Saturday", breakfast: "Urad Dal Cheela", lunch: "Potato Beans Curry with Roti", snack: "Papaya Coconut Bowl", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Jowar Thalipeeth", lunch: "Coastal Prawn Garlic Pepper Fry", snack: "Puffed Rice Chana Mixture", dinner: "Radish Roti with Dal" }
    ]
  },
  // Age 62 | underweight | plan4
  {
    age: 62, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Chana Dal Roti", lunch: "Chana Usal with Bhakri", snack: "Curd Sweet Potato Bowl", dinner: "Palak Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Sprouted Moong Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Stuffed Bhindi with Roti" },
      { day: "Wednesday", breakfast: "Radish Roti with Curd", lunch: "Chicken Dry Peanut Roast", snack: "Coconut Jaggery Ladoo", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Methi Besan Cheela", lunch: "Raw Banana Masala with Roti", snack: "Sesame Chikki", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Millet Vegetable Pancake", lunch: "Stuffed Brinjal with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Matki Usal with Bhakri" },
      { day: "Saturday", breakfast: "Jowar Muthia", lunch: "Kala Vatana Usal with Roti", snack: "Horse Gram Sundal", dinner: "Vegetable Muthia with Curd" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Home-Style Prawn Coriander Fry", snack: "Black Chana Chaat with Lemon", dinner: "Cabbage Besan Cheela with Chutney" }
    ]
  },
  // Age 62 | normal | plan1
  {
    age: 62, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Onion Missi Roti", lunch: "Carrot Peas Masala with Rice", snack: "Jaggery Ragi Milk", dinner: "Lobia Curry with Roti" },
      { day: "Tuesday", breakfast: "Vegetable Thalipeeth", lunch: "Maharashtrian Amti with Rice", snack: "Carrot Peanut Chaat", dinner: "Rava Vegetable Kichadi" },
      { day: "Wednesday", breakfast: "Guava Curd Bowl", lunch: "Light Chicken Sukka", snack: "Murmura Peanut Chaat", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Dal with Amaranth Leaves", snack: "Banana Ragi Shake", dinner: "Stuffed Brinjal with Roti" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Toor Dal with Raw Banana", snack: "Ragi Peanut Ladoo", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Yam Pepper Curry with Rice", snack: "Roasted Sweet Corn", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Onion Paniyaram", lunch: "Light Chicken Methi Fry", snack: "White Pea Chaat", dinner: "Khaman Dhokla with Curd" }
    ]
  },
  // Age 62 | normal | plan2
  {
    age: 62, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Lemon Sevai with Peanuts", lunch: "Beetroot Coconut Curry with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Jowar Kanji with Curd", lunch: "Raw Banana Masala with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Lemon Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Moong Dal Dhokla", lunch: "Traditional Chicken Dry Pepper Roast", snack: "Curd Peanut Bowl", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Thursday", breakfast: "Palak Besan Cheela", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Sattu Roti with Dal" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Gujarati Dal with Rice", snack: "Boiled Peanut Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Jowar Vegetable Pancake", lunch: "Matki Usal with Bhakri", snack: "Banana Sesame Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Traditional Chicken Punjabi Masala Fry", snack: "Homemade Corn Chivda", dinner: "Carrot Besan Cheela with Chutney" }
    ]
  },
  // Age 62 | normal | plan3
  {
    age: 62, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Peanut Banana Bowl", lunch: "Dill Leaves Curry with Roti", snack: "Corn Peanut Sundal", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Roti", lunch: "Gongura Pappu with Rice", snack: "Beetroot Peanut Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Bottle Gourd Handvo", lunch: "Home-Style Chicken Jeera Garlic Roast", snack: "Murmura Onion Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Bajra Methi Roti", lunch: "Potato Beans Curry with Rice", snack: "Jeera Buttermilk", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Masoor Dal with Methi", snack: "Peanut Chikki", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Saturday", breakfast: "Bajra Ambli", lunch: "Cabbage Carrot Curry with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Sunday", breakfast: "Rava Kichadi with Peanuts", lunch: "Coastal Chicken Garlic Pepper Fry", snack: "White Peas Sundal", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 62 | normal | plan4
  {
    age: 62, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Green Gram Masala with Roti", snack: "Cowpea Sundal", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Tuesday", breakfast: "Palak Dhokla", lunch: "Carrot Moong Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Sattu Cheela with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Rice Sevai", lunch: "Home-Style Chicken Coconut Pepper Fry", snack: "Murmura Black Chana Chaat", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Methi Muthia", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Carrot Roti with Dal" },
      { day: "Friday", breakfast: "Cabbage Besan Cheela", lunch: "Green Peas Usal with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Sattu Cheela", lunch: "Peas Potato Curry with Roti", snack: "Roasted Cowpeas", dinner: "Methi Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Light Chicken Tawa Lemon Fry", snack: "Homemade Murmura Chaat", dinner: "Bottle Gourd Handvo with Curd" }
    ]
  },
  // Age 62 | overweight | plan1
  {
    age: 62, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Sattu Curry with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Akki Rotti with Curd" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Beetroot Masala with Roti", snack: "Rice Kanji Drink", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Traditional Chicken Lemon Garlic Roast", snack: "Roasted Bengal Gram with Onion", dinner: "Mixed Dal Adai with Curd" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Masoor Dal with Dill Leaves", snack: "Ragi Banana Balls", dinner: "Chana Dal Roti with Curd" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Bengali Masoor Dal with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Green Peas Usal with Chapati" },
      { day: "Saturday", breakfast: "Leftover Rice Paniyaram", lunch: "Beerakaya Pappu with Rice", snack: "Boiled Yam Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Methi Adai", lunch: "Traditional Chicken Gongura Fry", snack: "Peanut Jaggery Ladoo", dinner: "Chana Usal with Bhakri" }
    ]
  },
  // Age 62 | overweight | plan2
  {
    age: 62, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Sprouted Moong Curry with Roti", snack: "Dry Roasted Corn", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Palak Missi Roti", lunch: "Dal with Carrot and Beans", snack: "Curd Banana Jaggery Bowl", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Drumstick Leaves Adai", lunch: "Coastal Chicken Tamarind Fry", snack: "Papaya Peanut Chaat", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Thursday", breakfast: "Ragi Kozhukattai", lunch: "Cowpea Curry with Rice", snack: "Mint Buttermilk", dinner: "Methi Handvo with Chutney" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Peas Potato Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Raw Banana Masala with Phulka" },
      { day: "Saturday", breakfast: "Green Peas Roti", lunch: "Spinach Corn Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Ragi Rotti with Curd" },
      { day: "Sunday", breakfast: "Vegetable Muthia", lunch: "Coastal Chicken Coriander Ginger Roast", snack: "Roasted Green Gram", dinner: "Methi Adai with Curd" }
    ]
  },
  // Age 62 | overweight | plan3
  {
    age: 62, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Drumstick Leaves Curry with Rice", snack: "Jaggery Lassi", dinner: "Green Peas Muthia with Curd" },
      { day: "Tuesday", breakfast: "Rava Paniyaram", lunch: "Chayote Moong Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Coastal Prawn Curry Leaf Roast", snack: "Roasted Chana Ladoo", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Methi Missi Roti", lunch: "Methi Corn Curry with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Friday", breakfast: "Moong Dal Paniyaram", lunch: "Raw Mango Dal with Rice", snack: "Homemade Poha Chivda", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Sweet Potato Peas Curry with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Bharli Vangi with Bhakri" },
      { day: "Sunday", breakfast: "Mixed Dal Adai", lunch: "Light Chicken Tawa Coriander Fry", snack: "Banana Sattu Shake", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 62 | overweight | plan4
  {
    age: 62, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Methi Roti", lunch: "Dill Leaves Dal with Rice", snack: "Guava Peanut Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Vegetable Handvo", lunch: "Chana Dal with Spinach", snack: "Homemade Peanut Bar", dinner: "Sattu Curry with Phulka" },
      { day: "Wednesday", breakfast: "Moong Dal Roti", lunch: "Home-Style Prawn Coriander Lemon Fry", snack: "Bajra Malt Drink", dinner: "Jowar Rotti with Dal" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Black-Eyed Pea Curry with Rice", snack: "Jowar Chikki", dinner: "Bajra Ambli with Curd" },
      { day: "Friday", breakfast: "Ragi Sevai Upma", lunch: "Lobia Curry with Roti", snack: "Banana Lassi", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Andhra Mudda Pappu with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Methi Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Aval Upma with Peanuts", lunch: "Coastal Prawn Gongura Curry", snack: "Curry Leaf Buttermilk", dinner: "Broad Beans Dal Curry with Phulka" }
    ]
  },
  // Age 63 | underweight | plan1
  {
    age: 63, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Thalipeeth", lunch: "Yam Pepper Curry with Rice", snack: "Mint Buttermilk", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Potato Beans Curry with Roti", snack: "White Pea Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Wednesday", breakfast: "Mixed Dal Cheela", lunch: "Chicken Mangalorean Fry", snack: "Homemade Ragi Savoury Balls", dinner: "Urad Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Drumstick Leaves Adai", lunch: "White Peas Curry with Rice", snack: "Banana Ragi Balls", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Moong Dal with Carrot", snack: "Sattu Jaggery Ladoo", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Guava Curd Bowl", lunch: "Sweet Potato Peas Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Leftover Rice Paniyaram", lunch: "Light Chicken Tomato Pepper Fry", snack: "Jaggery Ragi Milk", dinner: "Sprouted Moong Curry with Roti" }
    ]
  },
  // Age 63 | underweight | plan2
  {
    age: 63, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Kanji with Curd", lunch: "Sattu Curry with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Beetroot Roti with Curd", lunch: "Cauliflower Peas Masala with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Beetroot Masala with Roti" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Pancake", lunch: "Chicken Dry Sesame Roast", snack: "Bajra Malt Drink", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Rava Kichadi with Peanuts", lunch: "Dal with Drumstick Leaves", snack: "Curd Sweet Potato Bowl", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Friday", breakfast: "Jowar Muthia", lunch: "Stuffed Bhindi with Roti", snack: "Plain Homemade Lassi", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Saturday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Kala Vatana Usal with Rice", snack: "Banana Jaggery Bowl", dinner: "Rava Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Vegetable Rice Sevai", lunch: "Coastal Chicken Gongura Fry", snack: "Roasted Green Gram", dinner: "Carrot Roti with Dal" }
    ]
  },
  // Age 63 | underweight | plan3
  {
    age: 63, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Carrot Peas Masala with Roti", snack: "Murmura Black Chana Chaat", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Tuesday", breakfast: "Mixed Dal Adai", lunch: "Amaranth Dal with Roti", snack: "Green Gram Chaat", dinner: "Stuffed Brinjal with Roti" },
      { day: "Wednesday", breakfast: "Khaman Dhokla", lunch: "Coastal Chicken Sesame Fry", snack: "Peanut Jaggery Ladoo", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Ragi Vegetable Roti", lunch: "Dosakaya Pappu with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Onion Adai", lunch: "Maharashtrian Amti with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Vegetable Adai with Curd" },
      { day: "Saturday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Rice Kanji Drink", dinner: "Ragi Ambli with Roti" },
      { day: "Sunday", breakfast: "Methi Adai", lunch: "Traditional Chicken Coconut Ginger Roast", snack: "Roasted Peanut Jaggery Mix", dinner: "Vegetable Handvo with Curd" }
    ]
  },
  // Age 63 | underweight | plan4
  {
    age: 63, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Chana Usal with Bhakri", snack: "Jeera Buttermilk", dinner: "Green Peas Muthia with Curd" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "Chayote Dal Curry with Roti", snack: "Homemade Corn Chivda", dinner: "Methi Handvo with Chutney" },
      { day: "Wednesday", breakfast: "Onion Paniyaram", lunch: "Home-Style Chicken Garlic Fry", snack: "Lobia Chaat", dinner: "Methi Adai with Curd" },
      { day: "Thursday", breakfast: "Methi Handvo", lunch: "Amaranth Leaves Curry with Rice", snack: "Curd Peanut Bowl", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Beetroot Coconut Curry with Rice", snack: "Ginger Buttermilk", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Palak Besan Cheela", lunch: "Peas Potato Curry with Roti", snack: "Puffed Rice Chana Mixture", dinner: "White Pea Curry with Phulka" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Spicy Chicken Tawa Garlic Fry", snack: "Black-Eyed Pea Sundal", dinner: "Kala Vatana Usal with Roti" }
    ]
  },
  // Age 63 | normal | plan1
  {
    age: 63, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Cluster Beans Dal Curry with Roti", snack: "Jaggery Lassi", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Jowar Vegetable Pancake", lunch: "Potato Beans Curry with Rice", snack: "Peanut Sundal", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Carrot Besan Cheela", lunch: "Light Chicken Tawa Ginger Fry", snack: "Roasted Bengal Gram with Onion", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Thursday", breakfast: "Moong Dal Roti", lunch: "Dill Leaves Curry with Roti", snack: "Green Gram Sundal", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Bharli Vangi with Bhakri", snack: "Peanut Poha Chivda", dinner: "Carrot Muthia with Dal" },
      { day: "Saturday", breakfast: "Onion Besan Cheela", lunch: "Broad Beans Masala with Rice", snack: "Banana Ragi Shake", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Sunday", breakfast: "Methi Akki Rotti", lunch: "Spicy Chicken Methi Fry", snack: "Jowar Malt Drink", dinner: "Methi Akki Rotti" }
    ]
  },
  // Age 63 | normal | plan2
  {
    age: 63, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Green Peas Roti", lunch: "Matki Usal with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Coconut Sevai with Peanuts" },
      { day: "Tuesday", breakfast: "Vegetable Adai", lunch: "Toor Dal with Raw Banana", snack: "Puffed Rice Peanut Mixture", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Sattu Cheela", lunch: "Traditional Chicken Jeera Fry", snack: "Cowpea Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Thursday", breakfast: "Vegetable Muthia", lunch: "Gongura Pappu with Rice", snack: "Roasted Chana Ladoo", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Sattu Vegetable Roti", lunch: "Black-Eyed Pea Curry with Roti", snack: "Ragi Buttermilk", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Saturday", breakfast: "Papaya Curd Bowl", lunch: "Chana Dal with Spinach", snack: "Cowpea Sundal", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Sunday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Coastal Chicken Tawa Lemon Fry", snack: "Ragi Peanut Ladoo", dinner: "Methi Missi Roti with Dal" }
    ]
  },
  // Age 63 | normal | plan3
  {
    age: 63, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Carrot Muthia", lunch: "Spinach Chana Curry with Roti", snack: "Puffed Rice Chikki", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Dal with Amaranth Leaves", snack: "Homemade Murmura Chaat", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Urad Dal Cheela", lunch: "Light Chicken Pepper Roast", snack: "Beetroot Peanut Chaat", dinner: "Lobia Curry with Roti" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Stuffed Tindora with Roti", snack: "Murmura Onion Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Friday", breakfast: "Lemon Sevai with Peanuts", lunch: "Masoor Dal with Dill Leaves", snack: "Bajra Puffed Grain Chaat", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Saturday", breakfast: "Carrot Roti with Curd", lunch: "Drumstick Leaves Dal with Roti", snack: "Boiled Groundnut Salad", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Spicy Chicken Dry Garlic Roast", snack: "Homemade Poha Chivda", dinner: "Stuffed Tindora with Roti" }
    ]
  },
  // Age 63 | normal | plan4
  {
    age: 63, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Kala Vatana Usal with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Aval Upma with Peanuts", lunch: "Broad Beans Masala with Roti", snack: "Banana Lassi", dinner: "Onion Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Methi Muthia", lunch: "Spicy Chicken Dry Pudina Roast", snack: "Guava Jaggery Bowl", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Thursday", breakfast: "Jowar Malt with Milk", lunch: "Tindora Peanut Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Mixed Dal Adai with Curd" },
      { day: "Friday", breakfast: "Moong Dal Paniyaram", lunch: "Sprouted Moong Curry with Roti", snack: "Roasted Mung Beans", dinner: "Methi Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Jowar Methi Roti", lunch: "Spinach Corn Curry with Rice", snack: "Raw Banana Chaat", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Sunday", breakfast: "Bajra Methi Roti", lunch: "Traditional Chicken Gongura Pepper Fry", snack: "Jowar Chikki", dinner: "Carrot Besan Cheela with Chutney" }
    ]
  },
  // Age 63 | overweight | plan1
  {
    age: 63, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Thalipeeth", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Methi Missi Roti", lunch: "Beetroot Masala with Roti", snack: "Dry Roasted Corn", dinner: "Beetroot Roti with Curd" },
      { day: "Wednesday", breakfast: "Millet Vegetable Pancake", lunch: "Coastal Chicken Pepper Onion Roast", snack: "Boiled Yam Chaat", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "Sattu Curry with Roti", snack: "Murmura Peanut Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Friday", breakfast: "Onion Missi Roti", lunch: "Stuffed Brinjal with Rice", snack: "Carrot Peanut Chaat", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Saturday", breakfast: "Bajra Malt with Jaggery", lunch: "Moong Dal with Spinach", snack: "Curd Cucumber Peanut Bowl", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Moong Dal Handvo", lunch: "Coastal Chicken Drumstick Leaf Fry", snack: "Black Chana Sundal", dinner: "Chana Usal with Bhakri" }
    ]
  },
  // Age 63 | overweight | plan2
  {
    age: 63, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Cowpea Masala with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Sattu Roti with Dal" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Cauliflower Dal Curry with Roti", snack: "Papaya Coconut Bowl", dinner: "Jowar Ambli with Roti" },
      { day: "Wednesday", breakfast: "Peanut Banana Bowl", lunch: "Spicy Chicken Dry Pepper Roast", snack: "Roasted Peanuts with Curry Leaves", dinner: "Sattu Cheela with Curd" },
      { day: "Thursday", breakfast: "Chana Dal Cheela", lunch: "Lobia Curry with Roti", snack: "Peanut Chikki", dinner: "Raw Banana Masala with Phulka" },
      { day: "Friday", breakfast: "Vegetable Paniyaram", lunch: "Potato Methi Curry with Roti", snack: "Poha Jaggery Ladoo", dinner: "Jowar Kanji with Dal" },
      { day: "Saturday", breakfast: "Banana Jowar Pancake", lunch: "Dal with Fenugreek Leaves", snack: "Sesame Chikki", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Sunday", breakfast: "Ragi Banana Malt", lunch: "Coastal Chicken Andhra Garlic Roast", snack: "Coconut Jaggery Ladoo", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 63 | overweight | plan3
  {
    age: 63, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Besan Cheela", lunch: "Cabbage Carrot Curry with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Sattu Roti with Curd", lunch: "Peas Potato Curry with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Wednesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Traditional Chicken Punjabi Masala Fry", snack: "Curd Roasted Chana Bowl", dinner: "Besan Dhokla with Curd" },
      { day: "Thursday", breakfast: "Ragi Vegetable Pancake", lunch: "Yam Masala with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Friday", breakfast: "Dudhi Muthia", lunch: "Raw Mango Dal with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Bajra Rotti with Dal" },
      { day: "Saturday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Green Peas Usal with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Stuffed Bhindi with Roti" },
      { day: "Sunday", breakfast: "Vegetable Thalipeeth", lunch: "Chicken Coconut Pepper Fry", snack: "Cucumber Roasted Chana Chaat", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 63 | overweight | plan4
  {
    age: 63, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Boiled Yam with Curd", lunch: "Brinjal Peanut Curry with Rice", snack: "Papaya Lassi", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Tuesday", breakfast: "Palak Missi Roti", lunch: "White Peas Masala with Roti", snack: "Banana Sesame Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Masoor Dal Cheela", lunch: "Fish Andhra Pepper Fry", snack: "Horse Gram Sundal", dinner: "Palak Besan Cheela with Curd" },
      { day: "Thursday", breakfast: "Bajra Thalipeeth", lunch: "Brinjal Dal Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Radish Roti with Dal" },
      { day: "Friday", breakfast: "Ragi Paniyaram", lunch: "Sweet Potato Peas Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Palak Dhokla", lunch: "Methi Peas Curry with Roti", snack: "Boiled Peanut Chaat", dinner: "Vegetable Muthia with Curd" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Spicy Prawn Mustard Curry", snack: "Banana Jaggery Milk", dinner: "Chana Dal Roti with Curd" }
    ]
  },
  // Age 64 | underweight | plan1
  {
    age: 64, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Green Peas Muthia", lunch: "Masoor Dal with Methi", snack: "Homemade Banana Shake", dinner: "Palak Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Peanut Banana Bowl", lunch: "Stuffed Bhindi with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Methi Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Home-Style Chicken Chettinad Fry", snack: "Curry Leaf Buttermilk", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Bajra Methi Roti", lunch: "Stuffed Brinjal with Roti", snack: "Cowpea Sundal", dinner: "Vegetable Adai with Curd" },
      { day: "Friday", breakfast: "Vegetable Adai", lunch: "Black-Eyed Pea Curry with Rice", snack: "Ragi Peanut Ladoo", dinner: "Sattu Curry with Phulka" },
      { day: "Saturday", breakfast: "Ammini Kozhukattai", lunch: "Dal with Amaranth Leaves", snack: "Jaggery Lassi", dinner: "Radish Roti with Dal" },
      { day: "Sunday", breakfast: "Sattu Roti with Curd", lunch: "Light Prawn Andhra Pepper Fry", snack: "Curd Cucumber Peanut Bowl", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 64 | underweight | plan2
  {
    age: 64, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Radish Roti with Curd", lunch: "Cowpea Masala with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Tuesday", breakfast: "Methi Muthia", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Wednesday", breakfast: "Palak Missi Roti", lunch: "Home-Style Chicken Methi Garlic Roast", snack: "Coconut Jaggery Ladoo", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Masoor Dal with Dill Leaves", snack: "Sattu Buttermilk", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Friday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Chana Dal with Ridge Gourd", snack: "Peanut Poha Chivda", dinner: "Methi Akki Rotti" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Stuffed Brinjal with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Sunday", breakfast: "Vegetable Muthia", lunch: "Light Fish Ginger Garlic Fry", snack: "Ragi Puffed Grain Chaat", dinner: "Methi Muthia with Dal" }
    ]
  },
  // Age 64 | underweight | plan3
  {
    age: 64, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Chana Dal with Spinach", snack: "Jaggery Ragi Milk", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Chana Usal with Bhakri", snack: "Black Chana Chaat with Lemon", dinner: "Besan Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Chicken Masala Fry", snack: "Black-Eyed Pea Sundal", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Thursday", breakfast: "Palak Besan Cheela", lunch: "Dosakaya Pappu with Rice", snack: "Roasted Chana Ladoo", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Ragi Rotti with Chutney", lunch: "Cluster Beans Dal Curry with Roti", snack: "Homemade Corn Chivda", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Jowar Vegetable Pancake", lunch: "Potato Beans Curry with Roti", snack: "Boiled Groundnut Salad", dinner: "Bharli Vangi with Bhakri" },
      { day: "Sunday", breakfast: "Khaman Dhokla", lunch: "Home-Style Fish Tamarind Pepper Fry", snack: "Mint Buttermilk", dinner: "Aval Vegetable Kichadi" }
    ]
  },
  // Age 64 | underweight | plan4
  {
    age: 64, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sattu Cheela", lunch: "Broad Beans Dal Curry with Rice", snack: "Ginger Buttermilk", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Cabbage Besan Cheela", lunch: "Sattu Curry with Roti", snack: "Jowar Malt Drink", dinner: "Vegetable Muthia with Curd" },
      { day: "Wednesday", breakfast: "Rice Kanji with Curd", lunch: "Light Chicken Konkan Fry", snack: "Banana Ragi Shake", dinner: "Bajra Ambli with Curd" },
      { day: "Thursday", breakfast: "Methi Akki Rotti", lunch: "Tindora Peanut Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Stuffed Brinjal with Roti" },
      { day: "Friday", breakfast: "Ragi Thalipeeth", lunch: "Sweet Potato Peas Curry with Roti", snack: "Roasted Corn Peanut Mix", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Methi Handvo", lunch: "Peas Potato Curry with Rice", snack: "Homemade Murmura Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Sunday", breakfast: "Jowar Kanji with Curd", lunch: "Home-Style Prawn Tamarind Curry", snack: "Beetroot Peanut Chaat", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 64 | normal | plan1
  {
    age: 64, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Onion Paniyaram", lunch: "Beetroot Coconut Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Chana Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Banana Jowar Pancake", lunch: "Gongura Pappu with Rice", snack: "Raw Banana Chaat", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Rice Sevai", lunch: "Home-Style Chicken Fenugreek Fry", snack: "Ragi Peanut Chikki", dinner: "Raw Banana Masala with Phulka" },
      { day: "Thursday", breakfast: "Bajra Ambli", lunch: "Sprouted Moong Curry with Roti", snack: "Ragi Banana Balls", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Friday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Spinach Corn Curry with Rice", snack: "Roasted Sweet Corn", dinner: "Chana Dal Roti with Curd" },
      { day: "Saturday", breakfast: "Ragi Sevai Upma", lunch: "Moong Dal with Spinach", snack: "Peanut Chikki", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Sunday", breakfast: "Chana Dal Roti", lunch: "Chicken Mint Pepper Roast", snack: "White Peas Sundal", dinner: "Carrot Peas Masala with Phulka" }
    ]
  },
  // Age 64 | normal | plan2
  {
    age: 64, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Moong Dal Roti", lunch: "Toor Dal with Raw Banana", snack: "Cucumber Roasted Chana Chaat", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Palak Dhokla", lunch: "Moong Dal with Sweet Potato", snack: "Sweet Potato Peanut Chaat", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "Traditional Prawn Coriander Fry", snack: "Black Chana Sundal", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Green Peas Roti", lunch: "Peas Potato Curry with Roti", snack: "Roasted Green Gram", dinner: "Sattu Cheela with Curd" },
      { day: "Friday", breakfast: "Beetroot Roti with Curd", lunch: "Amaranth Leaves Curry with Rice", snack: "Banana Sattu Shake", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Chana Dal Cheela", lunch: "Raw Banana Masala with Roti", snack: "Roasted Cowpeas", dinner: "Stuffed Bhindi with Roti" },
      { day: "Sunday", breakfast: "Banana Ragi Pancake", lunch: "Spicy Chicken Dry Peanut Roast", snack: "Banana Jaggery Milk", dinner: "White Pea Curry with Phulka" }
    ]
  },
  // Age 64 | normal | plan3
  {
    age: 64, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Malt with Jaggery", lunch: "Kala Vatana Usal with Rice", snack: "Papaya Coconut Bowl", dinner: "Methi Handvo with Chutney" },
      { day: "Tuesday", breakfast: "Onion Besan Cheela", lunch: "Carrot Peas Masala with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Yam Pepper Curry with Roti" },
      { day: "Wednesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Light Prawn Coriander Fry", snack: "Jowar Puffed Grain Chaat", dinner: "Bajra Rotti with Dal" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Carrot Peas Masala with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Urad Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Methi Missi Roti", lunch: "Cauliflower Peas Masala with Rice", snack: "Lobia Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Saturday", breakfast: "Rava Paniyaram", lunch: "Yam Pepper Curry with Rice", snack: "Dry Roasted Corn", dinner: "Mixed Dal Adai with Curd" },
      { day: "Sunday", breakfast: "Jowar Muthia", lunch: "Chicken Punjabi Masala Fry", snack: "Puffed Rice Peanut Mixture", dinner: "Vegetable Thalipeeth with Curd" }
    ]
  },
  // Age 64 | normal | plan4
  {
    age: 64, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Drumstick Leaves Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Mixed Dal Adai", lunch: "Methi Corn Curry with Rice", snack: "Roasted Chana Chikki", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Jowar Thalipeeth", lunch: "Chicken Malabar Fry", snack: "Roasted Bengal Gram with Onion", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Carrot Chana Curry with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Friday", breakfast: "Millet Vegetable Pancake", lunch: "Bengali Masoor Dal with Rice", snack: "Boiled Corn with Lemon", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Spinach Chana Curry with Roti", snack: "Jeera Buttermilk", dinner: "Beetroot Roti with Curd" },
      { day: "Sunday", breakfast: "Onion Adai", lunch: "Coastal Chicken Coriander Fry", snack: "Guava Peanut Chaat", dinner: "Rice Kanji with Dal" }
    ]
  },
  // Age 64 | overweight | plan1
  {
    age: 64, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Ambli", lunch: "Methi Peas Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Jowar Malt with Milk", lunch: "Drumstick Leaves Dal with Roti", snack: "Roasted Mung Beans", dinner: "Palak Besan Cheela with Curd" },
      { day: "Wednesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Coastal Fish Tawa Fry", snack: "Sweet Potato Sesame Balls", dinner: "Beetroot Masala with Roti" },
      { day: "Thursday", breakfast: "Aval Upma with Peanuts", lunch: "Matki Usal with Bhakri", snack: "Puffed Rice Chana Mixture", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Friday", breakfast: "Bottle Gourd Handvo", lunch: "Chayote Moong Curry with Rice", snack: "Jowar Chikki", dinner: "Rava Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Brinjal Coconut Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Moong Dal Handvo", lunch: "Coastal Chicken Dry Coconut Roast", snack: "Boiled Yam Chaat", dinner: "Onion Adai with Chutney" }
    ]
  },
  // Age 64 | overweight | plan2
  {
    age: 64, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Thalipeeth", lunch: "Brinjal Dal Curry with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Matki Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Kala Vatana Usal with Roti", snack: "Plain Homemade Lassi", dinner: "Lobia Curry with Roti" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "Light Chicken Green Chilli Fry", snack: "Curd Roasted Chana Bowl", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Thursday", breakfast: "Ragi Paniyaram", lunch: "Dal with Fenugreek Leaves", snack: "Murmura Black Chana Chaat", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Cowpea Curry with Rice", snack: "Ragi Buttermilk", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Saturday", breakfast: "Ragi Vegetable Roti", lunch: "Dill Leaves Curry with Roti", snack: "Curd Peanut Bowl", dinner: "Lemon Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Traditional Chicken Mustard Fry", snack: "Ragi Jaggery Ladoo", dinner: "Ragi Rotti with Curd" }
    ]
  },
  // Age 64 | overweight | plan3
  {
    age: 64, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Green Peas Usal with Roti", snack: "Peanut Sundal", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Besan Dhokla", lunch: "Lobia Curry with Rice", snack: "Puffed Rice Chikki", dinner: "Onion Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Methi Adai", lunch: "Prawn Jeera Fry", snack: "Curd Banana Jaggery Bowl", dinner: "Coconut Sevai with Peanuts" },
      { day: "Thursday", breakfast: "Ragi Dhokla", lunch: "White Peas Masala with Roti", snack: "Cowpea Chaat", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Matki Usal with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Saturday", breakfast: "Ragi Kozhukattai", lunch: "Bharli Vangi with Bhakri", snack: "Boiled Peanut Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Light Chicken Andhra Garlic Roast", snack: "Homemade Jowar Savoury Balls", dinner: "Moong Dal Roti with Vegetable Curry" }
    ]
  },
  // Age 64 | overweight | plan4
  {
    age: 64, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Pancake", lunch: "Black-Eyed Pea Curry with Roti", snack: "Papaya Lassi", dinner: "Carrot Muthia with Dal" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Potato Beans Curry with Rice", snack: "Banana Ragi Balls", dinner: "Sweet Potato Roti with Curd" },
      { day: "Wednesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Coastal Chicken Coconut Garlic Roast", snack: "Guava Jaggery Bowl", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Mixed Dal Cheela", lunch: "Moong Dal with Carrot", snack: "Banana Lassi", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Friday", breakfast: "Carrot Muthia", lunch: "Sweet Potato Peas Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Yam Masala with Roti", snack: "Banana Sesame Chaat", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Onion Thalipeeth", lunch: "Chicken Ginger Coriander Roast", snack: "Green Gram Chaat", dinner: "Ragi Dhokla with Curd" }
    ]
  },
  // Age 65 | underweight | plan1
  {
    age: 65, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Stuffed Bhindi with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Dal with Carrot and Beans", snack: "Ragi Buttermilk", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Spicy Chicken Methi Garlic Roast", snack: "Homemade Peanut Bar", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Ragi Banana Malt", lunch: "Yam Pepper Curry with Rice", snack: "Cowpea Sundal", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Friday", breakfast: "Urad Dal Cheela", lunch: "Carrot Chana Curry with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Carrot Muthia with Dal" },
      { day: "Saturday", breakfast: "Ragi Vegetable Roti", lunch: "Cauliflower Methi Curry with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Jowar Rotti with Dal" },
      { day: "Sunday", breakfast: "Methi Adai", lunch: "Light Fish Bengali Jhol", snack: "Banana Jaggery Bowl", dinner: "Jowar Kanji with Dal" }
    ]
  },
  // Age 65 | underweight | plan2
  {
    age: 65, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Carrot Muthia", lunch: "Potato Peas Curry with Rice", snack: "Boiled Corn with Lemon", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Tuesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Black-Eyed Pea Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Banana Jowar Pancake", lunch: "Home-Style Chicken Spinach Pepper Fry", snack: "Sattu Buttermilk", dinner: "Palak Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Methi Akki Rotti", lunch: "Beetroot Coconut Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Lobia Curry with Roti" },
      { day: "Friday", breakfast: "Radish Roti with Curd", lunch: "Dal with Drumstick Leaves", snack: "Curd Banana Jaggery Bowl", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Ragi Thalipeeth", lunch: "Sweet Potato Peas Curry with Roti", snack: "Puffed Rice Chikki", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Peanut Banana Bowl", lunch: "Spicy Chicken Peanut Pepper Roast", snack: "Mint Buttermilk", dinner: "Ragi Dhokla with Curd" }
    ]
  },
  // Age 65 | underweight | plan3
  {
    age: 65, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Adai", lunch: "Cabbage Carrot Curry with Rice", snack: "Jeera Buttermilk", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Bharli Vangi with Bhakri", snack: "Carrot Peanut Chaat", dinner: "Beetroot Masala with Roti" },
      { day: "Wednesday", breakfast: "Moong Dal Roti", lunch: "Traditional Chicken Coriander Pepper Fry", snack: "Roasted Gram Balls", dinner: "Green Peas Roti with Curd" },
      { day: "Thursday", breakfast: "Bajra Methi Roti", lunch: "Potato Methi Curry with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "Coconut Sevai with Peanuts" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Peas Potato Curry with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Vegetable Handvo with Curd" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Green Gram Masala with Rice", snack: "Horse Gram Sundal", dinner: "Dudhi Muthia with Curd" },
      { day: "Sunday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Spicy Fish Bengali Jhol", snack: "Curd Roasted Chana Bowl", dinner: "Jowar Ambli with Roti" }
    ]
  },
  // Age 65 | underweight | plan4
  {
    age: 65, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Ambli", lunch: "Beerakaya Pappu with Rice", snack: "Beetroot Peanut Chaat", dinner: "Bharli Vangi with Bhakri" },
      { day: "Tuesday", breakfast: "Mixed Dal Cheela", lunch: "Carrot Moong Curry with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Onion Adai with Chutney" },
      { day: "Wednesday", breakfast: "Ragi Kozhukattai", lunch: "Traditional Chicken Mint Coriander Fry", snack: "Homemade Corn Chivda", dinner: "Chana Dal Roti with Curd" },
      { day: "Thursday", breakfast: "Ragi Rotti with Chutney", lunch: "Chana Usal with Bhakri", snack: "Murmura Peanut Chaat", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Sattu Vegetable Pancake", lunch: "Raw Banana Masala with Rice", snack: "Cowpea Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Dal with Amaranth Leaves", snack: "Sweet Potato Sesame Balls", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Sunday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Spicy Chicken Curry Leaf Garlic Roast", snack: "Banana Ragi Shake", dinner: "Ragi Malt with Roti and Dal" }
    ]
  },
  // Age 65 | normal | plan1
  {
    age: 65, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Masoor Dal with Methi", snack: "Homemade Poha Chivda", dinner: "Green Peas Muthia with Curd" },
      { day: "Tuesday", breakfast: "Jowar Methi Roti", lunch: "Raw Mango Dal with Rice", snack: "Corn Peanut Sundal", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Home-Style Chicken Curry Leaf Roast", snack: "Banana Jaggery Milk", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Moong Dal Paniyaram", lunch: "Stuffed Brinjal with Rice", snack: "Sattu Jaggery Balls", dinner: "Bajra Ambli with Curd" },
      { day: "Friday", breakfast: "Methi Muthia", lunch: "Cauliflower Dal Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Methi Adai with Curd" },
      { day: "Saturday", breakfast: "Bajra Ambli", lunch: "White Peas Curry with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "Chicken Garlic Coriander Roast", snack: "Ragi Peanut Ladoo", dinner: "Methi Akki Rotti" }
    ]
  },
  // Age 65 | normal | plan2
  {
    age: 65, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Gongura Pappu with Rice", snack: "Plain Homemade Lassi", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Tuesday", breakfast: "Bajra Thalipeeth", lunch: "Matki Usal with Bhakri", snack: "Green Gram Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Mixed Dal Adai", lunch: "Spicy Chicken Tawa Lemon Fry", snack: "Lobia Chaat", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "Lobia Curry with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Onion Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Carrot Roti with Curd", lunch: "Beetroot Masala with Roti", snack: "Raw Banana Chaat", dinner: "Akki Rotti with Curd" },
      { day: "Saturday", breakfast: "Rava Paniyaram", lunch: "Sweet Potato Peas Curry with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Mixed Dal Adai with Curd" },
      { day: "Sunday", breakfast: "Green Peas Roti", lunch: "Traditional Fish Mustard Fry", snack: "Boiled Peanut Chaat", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 65 | normal | plan3
  {
    age: 65, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Boiled Yam with Curd", lunch: "White Peas Masala with Roti", snack: "Murmura Black Chana Chaat", dinner: "Matki Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Raw Banana Masala with Roti", snack: "Murmura Onion Chaat", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Moong Dal Handvo", lunch: "Traditional Prawn Curry Leaf Roast", snack: "Black Chana Chaat with Lemon", dinner: "Jowar Muthia with Dal" },
      { day: "Thursday", breakfast: "Moong Dal Dhokla", lunch: "Lobia Curry with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Cowpea Masala with Roti", snack: "Boiled Yam Chaat", dinner: "Carrot Roti with Dal" },
      { day: "Saturday", breakfast: "Besan Dhokla", lunch: "Masoor Dal with Dill Leaves", snack: "Homemade Murmura Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Sunday", breakfast: "Chana Dal Roti", lunch: "Light Chicken Garlic Pepper Fry", snack: "Jaggery Lassi", dinner: "Methi Handvo with Chutney" }
    ]
  },
  // Age 65 | normal | plan4
  {
    age: 65, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Toor Dal with Raw Banana", snack: "Black Chana Sundal", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Tuesday", breakfast: "Jowar Malt with Milk", lunch: "Brinjal Peanut Curry with Rice", snack: "Roasted Green Gram", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Wednesday", breakfast: "Chana Dal Cheela", lunch: "Home-Style Chicken Tawa Pepper Roast", snack: "Poha Jaggery Ladoo", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Thursday", breakfast: "Sattu Vegetable Roti", lunch: "Green Gram Masala with Roti", snack: "Jowar Malt Drink", dinner: "Rice Kanji with Dal" },
      { day: "Friday", breakfast: "Sattu Cheela", lunch: "Gujarati Dal with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Drumstick Leaves Adai", lunch: "Amaranth Dal with Roti", snack: "Ragi Banana Balls", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Sunday", breakfast: "Ragi Ambli with Jaggery", lunch: "Traditional Chicken Konkan Fry", snack: "Roasted Cowpeas", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 65 | overweight | plan1
  {
    age: 65, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Sevai Upma", lunch: "Sprouted Moong Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Onion Missi Roti", lunch: "Bengali Masoor Dal with Rice", snack: "Papaya Lassi", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Bottle Gourd Handvo", lunch: "Traditional Chicken Pan Fry", snack: "Green Gram Sundal", dinner: "Sattu Curry with Phulka" },
      { day: "Thursday", breakfast: "Bajra Malt with Jaggery", lunch: "Chana Dal with Ridge Gourd", snack: "Bajra Malt Drink", dinner: "Vegetable Muthia with Curd" },
      { day: "Friday", breakfast: "Lemon Sevai with Peanuts", lunch: "Spinach Chana Curry with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Rava Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Onion Paniyaram", lunch: "Moong Dal with Spinach", snack: "Banana Lassi", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Sunday", breakfast: "Jowar Muthia", lunch: "Coastal Chicken Gongura Pepper Fry", snack: "Guava Peanut Chaat", dinner: "Ajwain Missi Roti with Dal" }
    ]
  },
  // Age 65 | overweight | plan2
  {
    age: 65, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Stuffed Brinjal with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Cabbage Besan Cheela", lunch: "Carrot Peas Masala with Rice", snack: "Rice Kanji Drink", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Palak Missi Roti", lunch: "Traditional Chicken Coconut Ginger Roast", snack: "Banana Ragi Balls", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Palak Dhokla", lunch: "Tindora Peanut Curry with Rice", snack: "Jowar Chikki", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Friday", breakfast: "Aval Upma with Peanuts", lunch: "Methi Corn Curry with Rice", snack: "Roasted Chana Ladoo", dinner: "Chana Usal with Bhakri" },
      { day: "Saturday", breakfast: "Green Peas Muthia", lunch: "Cabbage Moong Curry with Roti", snack: "Boiled Chana Chaat with Onion", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Traditional Chicken Telangana Pepper Roast", snack: "Homemade Banana Shake", dinner: "Sattu Cheela with Curd" }
    ]
  },
  // Age 65 | overweight | plan3
  {
    age: 65, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Thalipeeth", lunch: "Stuffed Tindora with Roti", snack: "Ragi Peanut Chikki", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Ragi Dhokla", lunch: "Green Peas Usal with Roti", snack: "Dry Roasted Corn", dinner: "Green Peas Usal with Chapati" },
      { day: "Wednesday", breakfast: "Jowar Vegetable Pancake", lunch: "Traditional Prawn Lemon Fry", snack: "Curd Sweet Potato Bowl", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Thursday", breakfast: "Vegetable Paniyaram", lunch: "Tindora Sesame Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Ragi Vegetable Pancake", lunch: "Spinach Corn Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Radish Roti with Dal" },
      { day: "Saturday", breakfast: "Ragi Paniyaram", lunch: "Cluster Beans Dal Curry with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Stuffed Brinjal with Roti" },
      { day: "Sunday", breakfast: "Vegetable Thalipeeth", lunch: "Chicken Malabar Fry", snack: "White Pea Chaat", dinner: "Stuffed Bhindi with Roti" }
    ]
  },
  // Age 65 | overweight | plan4
  {
    age: 65, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Masoor Dal Cheela", lunch: "Kala Vatana Usal with Roti", snack: "Roasted Mung Beans", dinner: "Besan Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Cowpea Curry with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Methi Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Light Chicken Tawa Curry Leaf Fry", snack: "Boiled Groundnut Salad", dinner: "Kala Vatana Usal with Roti" },
      { day: "Thursday", breakfast: "Sattu Roti with Curd", lunch: "Moong Dal with Carrot", snack: "Curd Peanut Bowl", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Dudhi Muthia", lunch: "Peas Potato Curry with Roti", snack: "Banana Sesame Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Saturday", breakfast: "Vegetable Handvo", lunch: "Potato Beans Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Sunday", breakfast: "Guava Curd Bowl", lunch: "Home-Style Fish Curry Leaf Fry", snack: "Sattu Jaggery Ladoo", dinner: "Onion Besan Cheela with Curd" }
    ]
  },
  // Age 66 | underweight | plan1
  {
    age: 66, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Masoor Dal Cheela", lunch: "Dal with Carrot and Beans", snack: "Poha Jaggery Ladoo", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Dill Leaves Curry with Roti", snack: "Curd Peanut Bowl", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Wednesday", breakfast: "Jowar Methi Roti", lunch: "Prawn Andhra Curry", snack: "Homemade Murmura Chaat", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Beerakaya Pappu with Rice", snack: "Boiled Groundnut Salad", dinner: "Onion Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Rice Kanji with Curd", lunch: "Lobia Curry with Rice", snack: "Banana Jaggery Milk", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Beetroot Roti with Curd", lunch: "Lobia Curry with Roti", snack: "Black Chana Sundal", dinner: "Kala Vatana Usal with Roti" },
      { day: "Sunday", breakfast: "Besan Dhokla", lunch: "Light Prawn Andhra Pepper Fry", snack: "Sattu Buttermilk", dinner: "Vegetable Rice Kozhukattai" }
    ]
  },
  // Age 66 | underweight | plan2
  {
    age: 66, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Bengali Masoor Dal with Rice", snack: "Jowar Malt Drink", dinner: "Rice Kanji with Dal" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Broad Beans Masala with Rice", snack: "Roasted Chana Ladoo", dinner: "Raw Banana Masala with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "Chicken Dry Peanut Roast", snack: "Sesame Jaggery Ladoo", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Brinjal Dal Curry with Roti", snack: "Mint Buttermilk", dinner: "Lemon Sevai with Peanuts" },
      { day: "Friday", breakfast: "Mixed Dal Cheela", lunch: "Potato Beans Curry with Roti", snack: "Boiled Corn with Lemon", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Methi Muthia", lunch: "Matki Usal with Bhakri", snack: "Boiled Yam Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Light Chicken Coconut Fry", snack: "White Pea Chaat", dinner: "Jowar Ambli with Roti" }
    ]
  },
  // Age 66 | underweight | plan3
  {
    age: 66, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Sevai", lunch: "Sprouted Moong Curry with Rice", snack: "Roasted Corn Peanut Mix", dinner: "Stuffed Brinjal with Roti" },
      { day: "Tuesday", breakfast: "Onion Besan Cheela", lunch: "Spinach Chana Curry with Roti", snack: "Green Gram Chaat", dinner: "Methi Akki Rotti" },
      { day: "Wednesday", breakfast: "Jowar Kanji with Curd", lunch: "Traditional Chicken Curry Leaf Fry", snack: "Cowpea Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Methi Adai", lunch: "Dosakaya Pappu with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Yam Masala with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Gongura Pappu with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Sattu Curry with Phulka" },
      { day: "Sunday", breakfast: "Methi Besan Cheela", lunch: "Coastal Chicken Tawa Pepper Roast", snack: "Banana Lassi", dinner: "Green Peas Muthia with Curd" }
    ]
  },
  // Age 66 | underweight | plan4
  {
    age: 66, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Malt with Jaggery", lunch: "Dal with Amaranth Leaves", snack: "Homemade Banana Shake", dinner: "Khaman Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Thalipeeth", lunch: "Peas Potato Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Onion Adai with Chutney" },
      { day: "Wednesday", breakfast: "Ragi Rotti with Chutney", lunch: "Light Chicken Masala Fry", snack: "Ragi Puffed Grain Chaat", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Thursday", breakfast: "Carrot Besan Cheela", lunch: "Raw Mango Dal with Rice", snack: "Homemade Peanut Bar", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Sweet Potato Peas Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Saturday", breakfast: "Bajra Thalipeeth", lunch: "Dal with Fenugreek Leaves", snack: "White Peas Sundal", dinner: "Carrot Muthia with Dal" },
      { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "Coastal Chicken Mangalorean Fry", snack: "Banana Ragi Balls", dinner: "Methi Besan Cheela with Curd" }
    ]
  },
  // Age 66 | normal | plan1
  {
    age: 66, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Boiled Yam with Curd", lunch: "Green Peas Usal with Roti", snack: "Carrot Peanut Chaat", dinner: "Methi Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Bajra Methi Roti", lunch: "Stuffed Tindora with Roti", snack: "Ragi Peanut Chikki", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Kozhukattai", lunch: "Chicken Tawa Pepper Roast", snack: "Roasted Black Chana with Lemon", dinner: "Vegetable Adai with Curd" },
      { day: "Thursday", breakfast: "Methi Thalipeeth", lunch: "Gujarati Dal with Rice", snack: "Sesame Chikki", dinner: "Sweet Potato Roti with Curd" },
      { day: "Friday", breakfast: "Rava Paniyaram", lunch: "Chana Dal with Spinach", snack: "Cucumber Roasted Chana Chaat", dinner: "Jowar Rotti with Dal" },
      { day: "Saturday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Peas Potato Curry with Roti", snack: "Banana Jaggery Bowl", dinner: "Sattu Cheela with Curd" },
      { day: "Sunday", breakfast: "Sattu Vegetable Roti", lunch: "Coastal Chicken Mint Pepper Roast", snack: "Black Chana Chaat with Lemon", dinner: "Methi Handvo with Chutney" }
    ]
  },
  // Age 66 | normal | plan2
  {
    age: 66, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Kala Vatana Usal with Roti", snack: "Peanut Chikki", dinner: "Ragi Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Methi Missi Roti", lunch: "Green Gram Masala with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Akki Rotti with Curd" },
      { day: "Wednesday", breakfast: "Sattu Roti with Curd", lunch: "Chicken Dry Curry Leaf Roast", snack: "Murmura Black Chana Chaat", dinner: "Onion Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Moong Dal Roti", lunch: "Potato Methi Curry with Roti", snack: "Dry Roasted Corn", dinner: "Methi Adai with Curd" },
      { day: "Friday", breakfast: "Palak Dhokla", lunch: "Broad Beans Masala with Roti", snack: "Guava Peanut Chaat", dinner: "Palak Missi Roti with Curd" },
      { day: "Saturday", breakfast: "Sweet Potato Roti", lunch: "Carrot Moong Curry with Roti", snack: "Peanut Sundal", dinner: "Beetroot Roti with Curd" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Fish Coconut Curry", snack: "Bajra Malt Drink", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 66 | normal | plan3
  {
    age: 66, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Onion Paniyaram", lunch: "Beetroot Coconut Curry with Rice", snack: "Puffed Rice Peanut Mixture", dinner: "Lobia Curry with Roti" },
      { day: "Tuesday", breakfast: "Moong Dal Paniyaram", lunch: "Bharli Vangi with Bhakri", snack: "Murmura Peanut Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Ajwain Missi Roti", lunch: "Traditional Chicken Lemon Pepper Fry", snack: "Curd Roasted Chana Bowl", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Thursday", breakfast: "Ragi Dhokla", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Ragi Peanut Ladoo", dinner: "Carrot Roti with Dal" },
      { day: "Friday", breakfast: "Dudhi Muthia", lunch: "Chayote Moong Curry with Rice", snack: "Papaya Peanut Chaat", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Vegetable Muthia", lunch: "Stuffed Brinjal with Roti", snack: "Roasted Chana Jaggery Mix", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Spicy Fish Coconut Garlic Curry", snack: "Banana Sattu Shake", dinner: "Moong Dal Roti with Vegetable Curry" }
    ]
  },
  // Age 66 | normal | plan4
  {
    age: 66, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Palak Missi Roti", lunch: "Sweet Potato Peas Curry with Rice", snack: "Roasted Mung Beans", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "Carrot Peas Masala with Roti", snack: "Rice Kanji Drink", dinner: "Stuffed Bhindi with Roti" },
      { day: "Wednesday", breakfast: "Khaman Dhokla", lunch: "Coastal Chicken Jeera Garlic Roast", snack: "Curry Leaf Buttermilk", dinner: "Bajra Rotti with Dal" },
      { day: "Thursday", breakfast: "Drumstick Leaves Adai", lunch: "Masoor Dal with Dill Leaves", snack: "Homemade Poha Chivda", dinner: "Beetroot Masala with Roti" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "Kala Vatana Usal with Rice", snack: "Guava Jaggery Bowl", dinner: "Jowar Kanji with Dal" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Maharashtrian Amti with Rice", snack: "Roasted Green Gram", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Banana Jowar Pancake", lunch: "Spicy Fish Tomato Masala", snack: "Green Gram Sundal", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 66 | overweight | plan1
  {
    age: 66, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Ambli", lunch: "Moong Dal with Carrot", snack: "Sweet Potato Sesame Balls", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Chana Dal Roti", lunch: "Black-Eyed Pea Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Wednesday", breakfast: "Mixed Dal Adai", lunch: "Home-Style Prawn Curry Leaf Fry", snack: "Roasted Peanuts with Curry Leaves", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Drumstick Leaves Curry with Rice", snack: "Jeera Buttermilk", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Rava Kichadi with Peanuts", lunch: "Sprouted Moong Curry with Roti", snack: "Murmura Onion Chaat", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Saturday", breakfast: "Leftover Rice Paniyaram", lunch: "Potato Peas Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Lemon Sevai with Peanuts", lunch: "Spicy Chicken Black Pepper Fry", snack: "Papaya Lassi", dinner: "Sweet Potato Peas Curry with Phulka" }
    ]
  },
  // Age 66 | overweight | plan2
  {
    age: 66, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Pancake", lunch: "Cauliflower Peas Masala with Rice", snack: "Ragi Banana Balls", dinner: "Radish Roti with Dal" },
      { day: "Tuesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Dill Leaves Dal with Rice", snack: "Peanut Poha Chivda", dinner: "Green Peas Roti with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Paniyaram", lunch: "Spicy Chicken Curry Leaf Roast", snack: "Peanut Jaggery Ladoo", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Methi Handvo", lunch: "Beetroot Masala with Roti", snack: "Homemade Corn Chivda", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Guava Curd Bowl", lunch: "Drumstick Leaves Dal with Roti", snack: "Raw Banana Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Cabbage Besan Cheela", lunch: "Amaranth Leaves Curry with Rice", snack: "Ragi Buttermilk", dinner: "Chana Usal with Bhakri" },
      { day: "Sunday", breakfast: "Chana Dal Cheela", lunch: "Home-Style Chicken Ginger Lemon Fry", snack: "Roasted Chana Chikki", dinner: "Yam Pepper Curry with Roti" }
    ]
  },
  // Age 66 | overweight | plan3
  {
    age: 66, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Sevai Upma", lunch: "Broad Beans Dal Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Vegetable Muthia with Curd" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Cabbage Moong Curry with Roti", snack: "Jaggery Lassi", dinner: "Matki Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Green Peas Muthia", lunch: "Traditional Chicken Dry Coconut Roast", snack: "Sattu Jaggery Ladoo", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Methi Peas Curry with Roti", snack: "Ginger Buttermilk", dinner: "Besan Dhokla with Curd" },
      { day: "Friday", breakfast: "Papaya Curd Bowl", lunch: "Amaranth Dal with Roti", snack: "Jowar Chikki", dinner: "Urad Dal Cheela with Curd" },
      { day: "Saturday", breakfast: "Ragi Paniyaram", lunch: "Stuffed Brinjal with Rice", snack: "Plain Homemade Lassi", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Jowar Muthia", lunch: "Spicy Fish Curry Leaf Fry", snack: "Boiled Chana Chaat with Onion", dinner: "Sprouted Moong Curry with Roti" }
    ]
  },
  // Age 66 | overweight | plan4
  {
    age: 66, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Sattu Curry with Roti", snack: "Boiled Peanut Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Ammini Kozhukattai", lunch: "Carrot Peas Masala with Rice", snack: "Roasted Sweet Corn", dinner: "Methi Muthia with Dal" },
      { day: "Wednesday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Spicy Prawn Tawa Fry", snack: "Banana Sesame Chaat", dinner: "Coconut Sevai with Peanuts" },
      { day: "Thursday", breakfast: "Banana with Roasted Peanuts", lunch: "Chana Usal with Bhakri", snack: "Horse Gram Sundal", dinner: "Ragi Rotti with Curd" },
      { day: "Friday", breakfast: "Methi Akki Rotti", lunch: "Potato Beans Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Ragi Ambli with Jaggery", lunch: "Brinjal Coconut Curry with Rice", snack: "Cowpea Sundal", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Jowar Malt with Milk", lunch: "Traditional Chicken Coriander Fry", snack: "Sweet Potato Peanut Chaat", dinner: "Bajra Ambli with Curd" }
    ]
  },
  // Age 67 | underweight | plan1
  {
    age: 67, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Dill Leaves Dal with Rice", snack: "Jeera Buttermilk", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Bajra Malt with Jaggery", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Roasted Chana Ladoo", dinner: "Chana Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "Coastal Chicken Dry Curry Leaf Roast", snack: "Mint Buttermilk", dinner: "Rava Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Ragi Vegetable Roti", lunch: "Potato Beans Curry with Roti", snack: "Murmura Black Chana Chaat", dinner: "Urad Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Cowpea Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Mixed Dal Cheela", lunch: "Cauliflower Methi Curry with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Adai", lunch: "Light Chicken Peanut Pepper Roast", snack: "Boiled Corn with Lemon", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 67 | underweight | plan2
  {
    age: 67, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Drumstick Leaves Adai", lunch: "Bharli Vangi with Bhakri", snack: "Roasted Rice Flake Mixture", dinner: "Ragi Rotti with Curd" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Stuffed Brinjal with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Coconut Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Home-Style Prawn Mustard Curry", snack: "Boiled Groundnut Salad", dinner: "Onion Adai with Chutney" },
      { day: "Thursday", breakfast: "Onion Paniyaram", lunch: "Matki Usal with Rice", snack: "Ginger Buttermilk", dinner: "Aval Vegetable Kichadi" },
      { day: "Friday", breakfast: "Carrot Besan Cheela", lunch: "Dill Leaves Curry with Roti", snack: "Green Gram Sundal", dinner: "Green Peas Muthia with Curd" },
      { day: "Saturday", breakfast: "Rice Kanji with Curd", lunch: "Broad Beans Masala with Rice", snack: "Corn Peanut Sundal", dinner: "Sweet Potato Roti with Curd" },
      { day: "Sunday", breakfast: "Peanut Banana Bowl", lunch: "Spicy Chicken Fenugreek Fry", snack: "Roasted Sweet Corn", dinner: "Ammini Kozhukattai with Vegetables" }
    ]
  },
  // Age 67 | underweight | plan3
  {
    age: 67, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Boiled Yam with Curd", lunch: "Moong Dal with Sweet Potato", snack: "Homemade Corn Chivda", dinner: "Green Peas Usal with Chapati" },
      { day: "Tuesday", breakfast: "Dudhi Muthia", lunch: "Raw Banana Masala with Roti", snack: "Homemade Murmura Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Green Peas Roti", lunch: "Coastal Chicken Dhaba Fry", snack: "Murmura Peanut Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Aval Upma with Peanuts", lunch: "Yam Masala with Roti", snack: "Roasted Black Chana with Lemon", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Black-Eyed Pea Curry with Roti", snack: "Homemade Banana Shake", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Saturday", breakfast: "Jowar Vegetable Pancake", lunch: "Methi Corn Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Sunday", breakfast: "Ammini Kozhukattai", lunch: "Light Chicken Dry Methi Roast", snack: "Roasted Green Gram", dinner: "Bajra Ambli with Curd" }
    ]
  },
  // Age 67 | underweight | plan4
  {
    age: 67, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Dhokla", lunch: "Toor Dal with Raw Banana", snack: "Jowar Malt Drink", dinner: "Khaman Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "Chayote Dal Curry with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Bajra Ambli", lunch: "Spicy Prawn Curry Leaf Roast", snack: "Black-Eyed Pea Sundal", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Cabbage Moong Curry with Roti", snack: "Sattu Jaggery Ladoo", dinner: "Matki Usal with Bhakri" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Lobia Curry with Roti", snack: "Jaggery Ragi Milk", dinner: "Vegetable Adai with Curd" },
      { day: "Saturday", breakfast: "Sattu Roti with Curd", lunch: "Brinjal Coconut Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Coastal Chicken Curry Leaf Roast", snack: "Ragi Banana Balls", dinner: "Ragi Ambli with Roti" }
    ]
  },
  // Age 67 | normal | plan1
  {
    age: 67, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Cabbage Carrot Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Potato Peas Curry with Rice", snack: "White Pea Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Wednesday", breakfast: "Khaman Dhokla", lunch: "Light Chicken Tawa Garlic Fry", snack: "Papaya Peanut Chaat", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Tindora Peanut Curry with Rice", snack: "Roasted Cowpeas", dinner: "Jowar Ambli with Roti" },
      { day: "Friday", breakfast: "Ajwain Missi Roti", lunch: "Chana Dal with Ridge Gourd", snack: "Raw Banana Chaat", dinner: "Vegetable Handvo with Curd" },
      { day: "Saturday", breakfast: "Urad Dal Cheela", lunch: "Brinjal Dal Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Sunday", breakfast: "Jowar Thalipeeth", lunch: "Home-Style Fish Pepper Roast", snack: "Roasted Chana Chikki", dinner: "Carrot Peas Masala with Phulka" }
    ]
  },
  // Age 67 | normal | plan2
  {
    age: 67, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Vegetable Handvo", lunch: "Peas Potato Curry with Roti", snack: "Banana Sesame Chaat", dinner: "Onion Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Moong Dal Handvo", lunch: "Bengali Masoor Dal with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Ragi Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Roti", lunch: "Coastal Chicken Kasuri Methi Fry", snack: "Homemade Poha Chivda", dinner: "Mixed Dal Adai with Curd" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Chayote Moong Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Friday", breakfast: "Ragi Kozhukattai", lunch: "Masoor Dal with Methi", snack: "Dry Roasted Corn", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Andhra Mudda Pappu with Rice", snack: "Sattu Buttermilk", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Palak Missi Roti", lunch: "Spicy Fish Tamarind Pepper Fry", snack: "Ragi Buttermilk", dinner: "Lemon Sevai with Peanuts" }
    ]
  },
  // Age 67 | normal | plan3
  {
    age: 67, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Green Peas Muthia", lunch: "White Peas Curry with Rice", snack: "Puffed Rice Chana Mixture", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Radish Roti with Curd", lunch: "Carrot Moong Curry with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Lobia Curry with Roti" },
      { day: "Wednesday", breakfast: "Sattu Cheela", lunch: "Chicken Methi Pepper Fry", snack: "Roasted Corn Peanut Mix", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Thursday", breakfast: "Lemon Sevai with Peanuts", lunch: "Raw Banana Masala with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Friday", breakfast: "Jowar Ambli", lunch: "Potato Beans Curry with Rice", snack: "Cowpea Chaat", dinner: "Jowar Kanji with Dal" },
      { day: "Saturday", breakfast: "Chana Dal Roti", lunch: "Carrot Chana Curry with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Sunday", breakfast: "Jowar Methi Roti", lunch: "Home-Style Chicken Chettinad Fry", snack: "Coconut Jaggery Ladoo", dinner: "Methi Adai with Curd" }
    ]
  },
  // Age 67 | normal | plan4
  {
    age: 67, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Masoor Dal Cheela", lunch: "Carrot Peas Masala with Rice", snack: "Guava Jaggery Bowl", dinner: "Dudhi Muthia with Curd" },
      { day: "Tuesday", breakfast: "Methi Muthia", lunch: "Sprouted Moong Curry with Roti", snack: "Jowar Puffed Grain Chaat", dinner: "Raw Banana Masala with Phulka" },
      { day: "Wednesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Traditional Chicken Pepper Roast", snack: "Peanut Sundal", dinner: "Carrot Roti with Dal" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Chana Dal with Spinach", snack: "Curd Sweet Potato Bowl", dinner: "Methi Muthia with Dal" },
      { day: "Friday", breakfast: "Vegetable Thalipeeth", lunch: "Amaranth Leaves Curry with Rice", snack: "Rice Kanji Drink", dinner: "Methi Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Banana Jowar Pancake", lunch: "Raw Mango Dal with Rice", snack: "Black Chana Sundal", dinner: "Chana Dal Roti with Curd" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "Chicken Mint Pepper Roast", snack: "Lobia Chaat", dinner: "Moong Dal Handvo" }
    ]
  },
  // Age 67 | overweight | plan1
  {
    age: 67, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Malt with Jaggery", lunch: "Lobia Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Methi Handvo", lunch: "Drumstick Leaves Curry with Rice", snack: "Bajra Malt Drink", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Sweet Potato Roti", lunch: "Prawn Tawa Fry", snack: "Ragi Peanut Ladoo", dinner: "Stuffed Brinjal with Roti" },
      { day: "Thursday", breakfast: "Millet Vegetable Pancake", lunch: "Methi Peas Curry with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Rava Kichadi with Peanuts", lunch: "Chana Usal with Bhakri", snack: "Homemade Popcorn with Peanuts", dinner: "Palak Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Vegetable Paniyaram", lunch: "Broad Beans Dal Curry with Rice", snack: "White Peas Sundal", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Onion Thalipeeth", lunch: "Chicken Tawa Garlic Fry", snack: "Papaya Lassi", dinner: "Carrot Muthia with Dal" }
    ]
  },
  // Age 67 | overweight | plan2
  {
    age: 67, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Bajra Thalipeeth", lunch: "Yam Pepper Curry with Rice", snack: "Jowar Chikki", dinner: "Green Peas Roti with Curd" },
      { day: "Tuesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Stuffed Bhindi with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Wednesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Spicy Fish Coconut Garlic Curry", snack: "Puffed Rice Peanut Mixture", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "Cluster Beans Dal Curry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Vegetable Muthia with Curd" },
      { day: "Friday", breakfast: "Bajra Methi Roti", lunch: "Sattu Curry with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Radish Roti with Dal" },
      { day: "Saturday", breakfast: "Methi Akki Rotti", lunch: "Stuffed Tindora with Roti", snack: "Roasted Gram Balls", dinner: "Methi Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Traditional Prawn Tomato Masala", snack: "Boiled Chana Chaat with Onion", dinner: "Sattu Roti with Dal" }
    ]
  },
  // Age 67 | overweight | plan3
  {
    age: 67, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Palak Dhokla", lunch: "Dal with Amaranth Leaves", snack: "Horse Gram Sundal", dinner: "Beetroot Masala with Roti" },
      { day: "Tuesday", breakfast: "Ragi Rotti with Chutney", lunch: "Green Gram Masala with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Stuffed Tindora with Roti" },
      { day: "Wednesday", breakfast: "Cabbage Besan Cheela", lunch: "Fish Coconut Pepper Curry", snack: "Cowpea Sundal", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Thursday", breakfast: "Jowar Muthia", lunch: "Sweet Potato Peas Curry with Rice", snack: "Ragi Jaggery Ladoo", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Dal with Carrot and Beans", snack: "Puffed Rice Chikki", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Tindora Sesame Curry with Roti", snack: "Guava Peanut Chaat", dinner: "Sattu Curry with Phulka" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Light Prawn Tamarind Curry", snack: "Peanut Poha Chivda", dinner: "Onion Thalipeeth with Curd" }
    ]
  },
  // Age 67 | overweight | plan4
  {
    age: 67, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Cauliflower Dal Curry with Roti", snack: "Sesame Chikki", dinner: "Sattu Cheela with Curd" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Dal with Drumstick Leaves", snack: "Plain Homemade Lassi", dinner: "Stuffed Bhindi with Roti" },
      { day: "Wednesday", breakfast: "Carrot Roti with Curd", lunch: "Home-Style Fish Tomato Masala", snack: "Jaggery Lassi", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Thursday", breakfast: "Vegetable Adai", lunch: "Sattu Curry with Roti", snack: "Boiled Peanut Chaat", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Friday", breakfast: "Methi Thalipeeth", lunch: "Beerakaya Pappu with Rice", snack: "Banana Sattu Shake", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Papaya Curd Bowl", lunch: "Moong Dal with Carrot", snack: "Carrot Peanut Chaat", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Sunday", breakfast: "Moong Dal Roti", lunch: "Traditional Fish Ginger Garlic Fry", snack: "Roasted Chana Jaggery Mix", dinner: "Vegetable Thalipeeth with Curd" }
    ]
  },
  // Age 68 | underweight | plan1
  {
    age: 68, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Carrot Besan Cheela", lunch: "Sweet Potato Peas Curry with Rice", snack: "Dry Roasted Corn", dinner: "Radish Roti with Dal" },
      { day: "Tuesday", breakfast: "Sattu Vegetable Pancake", lunch: "Cowpea Curry with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Traditional Prawn Coconut Garlic Curry", snack: "Sattu Jaggery Balls", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Thursday", breakfast: "Palak Missi Roti", lunch: "Drumstick Leaves Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Besan Dhokla", lunch: "Potato Peas Curry with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Methi Muthia with Dal" },
      { day: "Saturday", breakfast: "Sattu Roti with Curd", lunch: "Amaranth Leaves Curry with Rice", snack: "Jowar Malt Drink", dinner: "Matki Usal with Bhakri" },
      { day: "Sunday", breakfast: "Rava Paniyaram", lunch: "Light Fish Tawa Fry", snack: "Homemade Poha Chivda", dinner: "Drumstick Leaves Dal with Roti" }
    ]
  },
  // Age 68 | underweight | plan2
  {
    age: 68, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Handvo", lunch: "Dal with Fenugreek Leaves", snack: "Homemade Corn Chivda", dinner: "Rice Kanji with Dal" },
      { day: "Tuesday", breakfast: "Dudhi Muthia", lunch: "Matki Usal with Bhakri", snack: "Ginger Buttermilk", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Bottle Gourd Handvo", lunch: "Light Prawn Coconut Curry", snack: "Ragi Banana Balls", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Mixed Dal Adai", lunch: "Black-Eyed Pea Curry with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Onion Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Yam Pepper Curry with Rice", snack: "Cowpea Sundal", dinner: "Raw Banana Masala with Phulka" },
      { day: "Saturday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Carrot Chana Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Beetroot Masala with Roti" },
      { day: "Sunday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Spicy Chicken Garlic Fry", snack: "Boiled Corn with Lemon", dinner: "Green Peas Roti with Curd" }
    ]
  },
  // Age 68 | underweight | plan3
  {
    age: 68, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bajra Rotti with Curd", lunch: "Drumstick Leaves Dal with Roti", snack: "Raw Banana Chaat", dinner: "Green Peas Muthia with Curd" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Cauliflower Dal Curry with Roti", snack: "Puffed Rice Chikki", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Wednesday", breakfast: "Methi Missi Roti", lunch: "Chicken Tawa Coriander Fry", snack: "Roasted Black Chana with Lemon", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Jowar Kanji with Curd", lunch: "Gongura Pappu with Rice", snack: "Lobia Chaat", dinner: "Palak Missi Roti with Curd" },
      { day: "Friday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Raw Mango Dal with Rice", snack: "Boiled Groundnut Salad", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Peanut Banana Bowl", lunch: "Dal with Drumstick Leaves", snack: "Homemade Murmura Chaat", dinner: "Jowar Kanji with Dal" },
      { day: "Sunday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Home-Style Fish Mangalorean Curry", snack: "Homemade Banana Shake", dinner: "Ragi Rotti with Curd" }
    ]
  },
  // Age 68 | underweight | plan4
  {
    age: 68, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "White Peas Curry with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Toor Dal with Raw Banana", snack: "Jaggery Ragi Milk", dinner: "Lobia Curry with Roti" },
      { day: "Wednesday", breakfast: "Methi Thalipeeth", lunch: "Spicy Prawn Coriander Fry", snack: "Roasted Bengal Gram with Onion", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Brinjal Coconut Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Gujarati Dal with Rice", snack: "Mint Buttermilk", dinner: "Stuffed Brinjal with Roti" },
      { day: "Saturday", breakfast: "Palak Dhokla", lunch: "Moong Dal with Sweet Potato", snack: "Papaya Coconut Bowl", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Ragi Thalipeeth", lunch: "Spicy Chicken Coconut Garlic Roast", snack: "Peanut Jaggery Ladoo", dinner: "Stuffed Bhindi with Roti" }
    ]
  },
  // Age 68 | normal | plan1
  {
    age: 68, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Radish Roti with Curd", lunch: "Stuffed Brinjal with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Bajra Malt with Jaggery", lunch: "Green Gram Masala with Rice", snack: "Curry Leaf Buttermilk", dinner: "Methi Handvo with Chutney" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Roti", lunch: "Traditional Chicken Jeera Garlic Roast", snack: "Green Gram Chaat", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Cabbage Besan Cheela", lunch: "Cauliflower Peas Masala with Rice", snack: "Jaggery Lassi", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Friday", breakfast: "Moong Dal Dhokla", lunch: "Green Peas Usal with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Stuffed Brinjal with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Urad Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Masoor Dal Cheela", lunch: "Coastal Chicken Coconut Masala Fry", snack: "Sattu Buttermilk", dinner: "Kala Vatana Usal with Roti" }
    ]
  },
  // Age 68 | normal | plan2
  {
    age: 68, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Besan Cheela", lunch: "Brinjal Dal Curry with Roti", snack: "Ragi Buttermilk", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Vegetable Handvo", lunch: "Broad Beans Dal Curry with Rice", snack: "Boiled Peanut Chaat", dinner: "Ragi Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Ragi Paniyaram", lunch: "Traditional Prawn Garlic Fry", snack: "Roasted Chana Jaggery Mix", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Thursday", breakfast: "Rava Kichadi with Peanuts", lunch: "Peas Potato Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Vegetable Adai with Curd" },
      { day: "Friday", breakfast: "Onion Adai", lunch: "Bengali Masoor Dal with Rice", snack: "Curd Peanut Bowl", dinner: "Methi Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Beetroot Roti with Curd", lunch: "Beetroot Masala with Roti", snack: "Murmura Black Chana Chaat", dinner: "Carrot Muthia with Dal" },
      { day: "Sunday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Light Chicken Tamarind Fry", snack: "Black-Eyed Pea Sundal", dinner: "Rice Sevai Vegetable Bowl" }
    ]
  },
  // Age 68 | normal | plan3
  {
    age: 68, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Potato Beans Curry with Rice", snack: "Peanut Sundal", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Ragi Malt with Jaggery", lunch: "Methi Peas Curry with Roti", snack: "Papaya Peanut Chaat", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Methi Adai", lunch: "Home-Style Chicken Mint Coriander Fry", snack: "Banana Ragi Balls", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Thursday", breakfast: "Onion Besan Cheela", lunch: "Amaranth Dal with Roti", snack: "Roasted Chana Chikki", dinner: "Methi Adai with Curd" },
      { day: "Friday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Cabbage Moong Curry with Roti", snack: "Beetroot Peanut Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Saturday", breakfast: "Onion Missi Roti", lunch: "Carrot Peas Masala with Rice", snack: "Banana Jaggery Bowl", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Guava Curd Bowl", lunch: "Traditional Chicken Tawa Lemon Fry", snack: "Guava Jaggery Bowl", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 68 | normal | plan4
  {
    age: 68, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Kala Vatana Usal with Rice", snack: "Green Gram Sundal", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Tuesday", breakfast: "Boiled Yam with Curd", lunch: "Dill Leaves Dal with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Carrot Roti with Dal" },
      { day: "Wednesday", breakfast: "Ammini Kozhukattai", lunch: "Spicy Prawn Garlic Pepper Fry", snack: "Jowar Chikki", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Thursday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Beerakaya Pappu with Rice", snack: "Plain Homemade Lassi", dinner: "Sweet Potato Roti with Curd" },
      { day: "Friday", breakfast: "Palak Besan Cheela", lunch: "Masoor Dal with Dill Leaves", snack: "White Peas Sundal", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Saturday", breakfast: "Urad Dal Cheela", lunch: "Methi Corn Curry with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Methi Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Jowar Ambli", lunch: "Coastal Prawn Andhra Curry", snack: "Papaya Lassi", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 68 | overweight | plan1
  {
    age: 68, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Jowar Muthia", lunch: "Tindora Sesame Curry with Roti", snack: "Rice Kanji Drink", dinner: "Vegetable Handvo with Curd" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Roti", lunch: "Cowpea Masala with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Besan Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Papaya Curd Bowl", lunch: "Traditional Chicken Coconut Ginger Roast", snack: "Jeera Buttermilk", dinner: "Mixed Dal Adai with Curd" },
      { day: "Thursday", breakfast: "Ragi Vegetable Pancake", lunch: "Maharashtrian Amti with Rice", snack: "Banana Jaggery Milk", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Moong Dal Roti", lunch: "Carrot Moong Curry with Roti", snack: "Banana Ragi Shake", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Saturday", breakfast: "Chana Dal Roti", lunch: "Cluster Beans Dal Curry with Roti", snack: "Banana Sattu Shake", dinner: "Sattu Curry with Phulka" },
      { day: "Sunday", breakfast: "Moong Dal Handvo", lunch: "Chicken Malabar Fry", snack: "Curd Roasted Chana Bowl", dinner: "Jowar Rotti with Dal" }
    ]
  },
  // Age 68 | overweight | plan2
  {
    age: 68, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Banana Jowar Pancake", lunch: "Dal with Carrot and Beans", snack: "Ragi Peanut Chikki", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Onion Paniyaram", lunch: "Tindora Peanut Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Rice Kanji with Curd", lunch: "Spicy Fish Curry Leaf Roast", snack: "Roasted Gram Balls", dinner: "Moong Dal Handvo" },
      { day: "Thursday", breakfast: "Leftover Rice Paniyaram", lunch: "Black-Eyed Pea Curry with Roti", snack: "Banana Sesame Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Friday", breakfast: "Carrot Muthia", lunch: "Sattu Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Onion Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Jowar Malt with Milk", lunch: "Masoor Dal with Methi", snack: "Roasted Mung Beans", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Sunday", breakfast: "Onion Thalipeeth", lunch: "Traditional Chicken Coconut Garlic Roast", snack: "Roasted Green Gram", dinner: "Vegetable Thalipeeth with Curd" }
    ]
  },
  // Age 68 | overweight | plan3
  {
    age: 68, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Banana Ragi Pancake", lunch: "Sprouted Moong Curry with Rice", snack: "Bajra Malt Drink", dinner: "Bajra Ambli with Curd" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Potato Methi Curry with Roti", snack: "Jowar Puffed Grain Chaat", dinner: "Chana Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Ajwain Missi Roti", lunch: "Spicy Fish Andhra Pepper Fry", snack: "Roasted Chana Ladoo", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Vegetable Muthia", lunch: "Chayote Moong Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Friday", breakfast: "Sattu Cheela", lunch: "Sattu Curry with Rice", snack: "Guava Peanut Chaat", dinner: "Beetroot Roti with Curd" },
      { day: "Saturday", breakfast: "Vegetable Adai", lunch: "Raw Banana Masala with Roti", snack: "Cowpea Chaat", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Home-Style Chicken Lemon Herb Roast", snack: "Roasted Sweet Corn", dinner: "Aval Vegetable Kichadi" }
    ]
  },
  // Age 68 | overweight | plan4
  {
    age: 68, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Thalipeeth", lunch: "Carrot Peas Masala with Roti", snack: "Homemade Peanut Bar", dinner: "Jowar Muthia with Dal" },
      { day: "Tuesday", breakfast: "Lemon Sevai with Peanuts", lunch: "Chana Dal with Ridge Gourd", snack: "Curd Banana Jaggery Bowl", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Spicy Chicken Jeera Garlic Roast", snack: "Ragi Peanut Ladoo", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Thursday", breakfast: "Methi Akki Rotti", lunch: "Raw Banana Masala with Rice", snack: "Poha Jaggery Ladoo", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Vegetable Paniyaram", lunch: "Stuffed Bhindi with Roti", snack: "Sattu Jaggery Ladoo", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Methi Muthia", lunch: "Moong Dal with Carrot", snack: "Banana Lassi", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Bajra Methi Roti", lunch: "Prawn Masala Fry", snack: "Bajra Puffed Grain Chaat", dinner: "Vegetable Sevai with Chana Dal" }
    ]
  },
  // Age 69 | underweight | plan1
  {
    age: 69, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Banana Ragi Pancake", lunch: "Cauliflower Dal Curry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Mixed Dal Adai with Curd" },
      { day: "Tuesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Sprouted Moong Curry with Roti", snack: "Poha Jaggery Ladoo", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Cabbage Besan Cheela", lunch: "Fish Tawa Fry", snack: "Raw Banana Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Lemon Sevai with Peanuts", lunch: "Dosakaya Pappu with Rice", snack: "Homemade Murmura Chaat", dinner: "Green Peas Usal with Chapati" },
      { day: "Friday", breakfast: "Ragi Vegetable Pancake", lunch: "Stuffed Brinjal with Rice", snack: "Jeera Buttermilk", dinner: "Palak Missi Roti with Curd" },
      { day: "Saturday", breakfast: "Tomato-Free Vegetable Adai", lunch: "White Peas Curry with Rice", snack: "Guava Peanut Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Ajwain Missi Roti", lunch: "Home-Style Chicken Tawa Pepper Roast", snack: "Carrot Peanut Chaat", dinner: "Chana Dal Roti with Curd" }
    ]
  },
  // Age 69 | underweight | plan2
  {
    age: 69, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Sweet Potato Roti", lunch: "Chayote Moong Curry with Rice", snack: "Black Chana Sundal", dinner: "Lemon Sevai with Peanuts" },
      { day: "Tuesday", breakfast: "Ragi Sevai Upma", lunch: "Carrot Moong Curry with Roti", snack: "Boiled Corn with Lemon", dinner: "Stuffed Brinjal with Roti" },
      { day: "Wednesday", breakfast: "Onion Adai", lunch: "Light Prawn Tomato Masala", snack: "Corn Peanut Sundal", dinner: "Rava Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Moong Dal Dhokla", lunch: "Sweet Potato Peas Curry with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Friday", breakfast: "Banana Jowar Pancake", lunch: "Potato Methi Curry with Roti", snack: "Boiled Groundnut Salad", dinner: "Sattu Curry with Phulka" },
      { day: "Saturday", breakfast: "Moong Dal Handvo", lunch: "Brinjal Dal Curry with Roti", snack: "Papaya Coconut Bowl", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Sunday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Home-Style Prawn Coriander Fry", snack: "Banana Sesame Chaat", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 69 | underweight | plan3
  {
    age: 69, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Handvo", lunch: "Yam Pepper Curry with Rice", snack: "Sattu Buttermilk", dinner: "Ragi Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Leftover Rice Paniyaram", lunch: "Cowpea Curry with Rice", snack: "Lobia Chaat", dinner: "Stuffed Bhindi with Roti" },
      { day: "Wednesday", breakfast: "Urad Dal Cheela", lunch: "Traditional Chicken Lemon Ginger Roast", snack: "Beetroot Peanut Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Jowar Methi Roti", lunch: "Green Gram Masala with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Green Peas Muthia", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Roasted Sweet Corn", dinner: "Dudhi Muthia with Curd" },
      { day: "Saturday", breakfast: "Methi Muthia", lunch: "Spinach Corn Curry with Rice", snack: "Banana Ragi Shake", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Sunday", breakfast: "Sattu Cheela", lunch: "Coastal Chicken Spinach Pepper Fry", snack: "Curd Peanut Bowl", dinner: "Kala Vatana Usal with Roti" }
    ]
  },
  // Age 69 | underweight | plan4
  {
    age: 69, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Green Gram Masala with Rice", snack: "Banana Ragi Balls", dinner: "Akki Rotti with Curd" },
      { day: "Tuesday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Sattu Curry with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Wednesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Traditional Chicken Pepper Onion Roast", snack: "Papaya Peanut Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Banana with Roasted Peanuts", lunch: "Stuffed Tindora with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Friday", breakfast: "Bajra Thalipeeth", lunch: "Maharashtrian Amti with Rice", snack: "Ragi Peanut Ladoo", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Saturday", breakfast: "Bajra Methi Roti", lunch: "Cauliflower Peas Masala with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Rice Kanji with Dal" },
      { day: "Sunday", breakfast: "Bajra Ambli", lunch: "Home-Style Prawn Curry Leaf Roast", snack: "Curd Sweet Potato Bowl", dinner: "Matki Usal with Bhakri" }
    ]
  },
  // Age 69 | normal | plan1
  {
    age: 69, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Carrot Peas Masala with Rice", snack: "Ragi Puffed Grain Chaat", dinner: "Onion Adai with Chutney" },
      { day: "Tuesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Spinach Chana Curry with Roti", snack: "Homemade Corn Chivda", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Wednesday", breakfast: "Rice Kanji with Curd", lunch: "Light Fish Lemon Pepper Fry", snack: "Black Chana Chaat with Lemon", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Thursday", breakfast: "Carrot Besan Cheela", lunch: "Dill Leaves Curry with Roti", snack: "White Pea Chaat", dinner: "Raw Banana Masala with Phulka" },
      { day: "Friday", breakfast: "Ragi Kozhukattai", lunch: "Dill Leaves Dal with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Saturday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Cabbage Moong Curry with Roti", snack: "Roasted Cowpeas", dinner: "Moong Dal Handvo" },
      { day: "Sunday", breakfast: "Jowar Malt with Milk", lunch: "Coastal Chicken Garlic Fry", snack: "Peanut Sundal", dinner: "Lobia Curry with Roti" }
    ]
  },
  // Age 69 | normal | plan2
  {
    age: 69, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Palak Besan Cheela", lunch: "Chana Dal with Spinach", snack: "Banana Jaggery Milk", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Tuesday", breakfast: "Methi Akki Rotti", lunch: "Brinjal Peanut Curry with Rice", snack: "White Peas Sundal", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Wednesday", breakfast: "Sattu Roti with Curd", lunch: "Home-Style Fish Mustard Fry", snack: "Murmura Peanut Chaat", dinner: "Jowar Muthia with Dal" },
      { day: "Thursday", breakfast: "Chana Dal Cheela", lunch: "Matki Usal with Bhakri", snack: "Bajra Puffed Grain Chaat", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Friday", breakfast: "Mixed Dal Adai", lunch: "Kala Vatana Usal with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Saturday", breakfast: "Jowar Vegetable Pancake", lunch: "Amaranth Leaves Curry with Rice", snack: "Plain Homemade Lassi", dinner: "Jowar Kanji with Dal" },
      { day: "Sunday", breakfast: "Jowar Kanji with Curd", lunch: "Traditional Chicken Tawa Garlic Fry", snack: "Roasted Rice Flake Mixture", dinner: "Radish Roti with Dal" }
    ]
  },
  // Age 69 | normal | plan3
  {
    age: 69, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "White Peas Masala with Roti", snack: "Horse Gram Sundal", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Moong Dal Paniyaram", lunch: "Dal with Amaranth Leaves", snack: "Sweet Potato Sesame Balls", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Wednesday", breakfast: "Vegetable Thalipeeth", lunch: "Coastal Chicken Lemon Garlic Roast", snack: "Puffed Rice Chikki", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Methi Missi Roti", lunch: "Dal with Carrot and Beans", snack: "Boiled Peanut Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Bengali Masoor Dal with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Vegetable Handvo with Curd" },
      { day: "Saturday", breakfast: "Peanut Banana Bowl", lunch: "Sprouted Moong Curry with Rice", snack: "Jowar Chikki", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Sunday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Light Chicken Coriander Lemon Fry", snack: "Roasted Mung Beans", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 69 | normal | plan4
  {
    age: 69, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Dudhi Muthia", lunch: "Amaranth Dal with Roti", snack: "Homemade Ragi Savoury Balls", dinner: "Methi Handvo with Chutney" },
      { day: "Tuesday", breakfast: "Moong Dal Roti", lunch: "Gongura Pappu with Rice", snack: "Roasted Gram Balls", dinner: "Bajra Rotti with Dal" },
      { day: "Wednesday", breakfast: "Onion Besan Cheela", lunch: "Coastal Fish Curry Leaf Fry", snack: "Black-Eyed Pea Sundal", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Bharli Vangi with Bhakri", snack: "Sweet Potato Peanut Chaat", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Friday", breakfast: "Palak Dhokla", lunch: "Methi Corn Curry with Rice", snack: "Ragi Buttermilk", dinner: "Urad Dal Cheela with Curd" },
      { day: "Saturday", breakfast: "Ragi Dhokla", lunch: "Black-Eyed Pea Curry with Rice", snack: "Homemade Poha Chivda", dinner: "Methi Adai with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "Light Chicken Dry Sesame Roast", snack: "Homemade Peanut Bar", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 69 | overweight | plan1
  {
    age: 69, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Broad Beans Dal Curry with Rice", snack: "Murmura Onion Chaat", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Tuesday", breakfast: "Methi Thalipeeth", lunch: "Sweet Potato Peas Curry with Rice", snack: "Banana Sattu Shake", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Wednesday", breakfast: "Drumstick Leaves Adai", lunch: "Light Chicken Onion Pepper Fry", snack: "Homemade Jowar Savoury Balls", dinner: "Bajra Ambli with Curd" },
      { day: "Thursday", breakfast: "Ragi Malt with Jaggery", lunch: "Methi Peas Curry with Roti", snack: "Peanut Poha Chivda", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Masoor Dal with Dill Leaves", snack: "Banana Jaggery Bowl", dinner: "Sattu Cheela with Curd" },
      { day: "Saturday", breakfast: "Beetroot Roti with Curd", lunch: "Moong Dal with Carrot", snack: "Green Gram Sundal", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Light Chicken Gongura Pepper Fry", snack: "Banana Lassi", dinner: "Carrot Peas Masala with Phulka" }
    ]
  },
  // Age 69 | overweight | plan2
  {
    age: 69, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Paniyaram", lunch: "Cauliflower Methi Curry with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Chana Dal with Ridge Gourd", snack: "Boiled Yam Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Chicken Punjabi Masala Fry", snack: "Peanut Chikki", dinner: "Khaman Dhokla with Curd" },
      { day: "Thursday", breakfast: "Jowar Ambli", lunch: "Andhra Mudda Pappu with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Chana Usal with Bhakri" },
      { day: "Friday", breakfast: "Sattu Vegetable Roti", lunch: "Tindora Peanut Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Methi Akki Rotti" },
      { day: "Saturday", breakfast: "Ragi Rotti with Chutney", lunch: "Brinjal Coconut Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Sattu Roti with Dal" },
      { day: "Sunday", breakfast: "Sattu Vegetable Pancake", lunch: "Home-Style Chicken Curry Leaf Garlic Roast", snack: "Murmura Black Chana Chaat", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 69 | overweight | plan3
  {
    age: 69, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Green Peas Usal with Roti", snack: "Green Gram Chaat", dinner: "Bharli Vangi with Bhakri" },
      { day: "Tuesday", breakfast: "Ragi Thalipeeth", lunch: "Drumstick Leaves Curry with Rice", snack: "Sesame Chikki", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Wednesday", breakfast: "Methi Besan Cheela", lunch: "Traditional Chicken Punjabi Masala Fry", snack: "Ragi Banana Balls", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "Masoor Dal with Methi", snack: "Roasted Corn Peanut Mix", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Ragi Vegetable Roti", lunch: "Black-Eyed Pea Curry with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Vegetable Rice Sevai", lunch: "Kala Vatana Usal with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Beetroot Masala with Roti" },
      { day: "Sunday", breakfast: "Radish Roti with Curd", lunch: "Light Chicken Chettinad Fry", snack: "Bajra Malt Drink", dinner: "Onion Thalipeeth with Curd" }
    ]
  },
  // Age 69 | overweight | plan4
  {
    age: 69, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Carrot Roti with Curd", lunch: "Drumstick Leaves Dal with Roti", snack: "Rice Kanji Drink", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Broad Beans Masala with Rice", snack: "Ginger Buttermilk", dinner: "Stuffed Tindora with Roti" },
      { day: "Wednesday", breakfast: "Onion Paniyaram", lunch: "Light Chicken Lemon Ginger Roast", snack: "Cowpea Chaat", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Bottle Gourd Handvo", lunch: "Stuffed Bhindi with Roti", snack: "Curry Leaf Buttermilk", dinner: "Aval Vegetable Kichadi" },
      { day: "Friday", breakfast: "Guava Curd Bowl", lunch: "Carrot Chana Curry with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Yam Pepper Curry with Roti" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Tindora Sesame Curry with Roti", snack: "Cowpea Sundal", dinner: "Coconut Sevai with Peanuts" },
      { day: "Sunday", breakfast: "Vegetable Adai", lunch: "Spicy Chicken Mangalorean Fry", snack: "Jaggery Ragi Milk", dinner: "Methi Besan Cheela with Curd" }
    ]
  },
  // Age 70 | underweight | plan1
  {
    age: 70, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Ambli", lunch: "Chana Usal with Bhakri", snack: "White Pea Chaat", dinner: "Palak Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Sattu Cheela", lunch: "Dal with Carrot and Beans", snack: "Cowpea Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Bajra Thalipeeth", lunch: "Home-Style Chicken Green Masala Fry", snack: "Roasted Gram Balls", dinner: "Bajra Ambli with Curd" },
      { day: "Thursday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Spinach Corn Curry with Rice", snack: "Black Chana Chaat with Lemon", dinner: "Sweet Potato Roti with Curd" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Sprouted Moong Curry with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Saturday", breakfast: "Methi Besan Cheela", lunch: "Andhra Mudda Pappu with Rice", snack: "Banana Ragi Shake", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Sunday", breakfast: "Carrot Besan Cheela", lunch: "Fish Andhra Pulusu", snack: "Roasted Peanut Jaggery Mix", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 70 | underweight | plan2
  {
    age: 70, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Carrot Muthia", lunch: "Raw Banana Masala with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Brinjal Dal Curry with Roti", snack: "Banana Sesame Chaat", dinner: "Ragi Rotti with Curd" },
      { day: "Wednesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Home-Style Prawn Andhra Curry", snack: "Homemade Peanut Bar", dinner: "Carrot Muthia with Dal" },
      { day: "Thursday", breakfast: "Leftover Rice Paniyaram", lunch: "Lobia Curry with Rice", snack: "Peanut Poha Chivda", dinner: "Carrot Roti with Dal" },
      { day: "Friday", breakfast: "Onion Paniyaram", lunch: "Beetroot Masala with Roti", snack: "Cowpea Sundal", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Dal with Drumstick Leaves", snack: "Sesame Chikki", dinner: "Sattu Curry with Phulka" },
      { day: "Sunday", breakfast: "Ragi Kozhukattai", lunch: "Spicy Chicken Coriander Fry", snack: "Homemade Jowar Savoury Balls", dinner: "Jowar Muthia with Dal" }
    ]
  },
  // Age 70 | underweight | plan3
  {
    age: 70, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Boiled Raw Banana with Chutney", lunch: "White Peas Curry with Rice", snack: "Murmura Onion Chaat", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Aval Upma with Peanuts", lunch: "Amaranth Leaves Curry with Rice", snack: "Murmura Black Chana Chaat", dinner: "Raw Banana Masala with Phulka" },
      { day: "Wednesday", breakfast: "Chana Dal Roti", lunch: "Chicken Ginger Coriander Roast", snack: "Murmura Peanut Chaat", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Moong Dal Handvo", lunch: "Carrot Moong Curry with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Onion Thalipeeth", lunch: "Yam Masala with Roti", snack: "Guava Jaggery Bowl", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Saturday", breakfast: "Ragi Sevai Upma", lunch: "Amaranth Dal with Roti", snack: "Lobia Chaat", dinner: "Yam Pepper Curry with Roti" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Chicken Andhra Fry", snack: "Black-Eyed Pea Sundal", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 70 | underweight | plan4
  {
    age: 70, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Peanut Banana Bowl", lunch: "Green Gram Masala with Roti", snack: "Ragi Buttermilk", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Khaman Dhokla", lunch: "Kala Vatana Usal with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Coastal Chicken Andhra Pepper Roast", snack: "Boiled Yam Chaat", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Ammini Kozhukattai", lunch: "Tindora Peanut Curry with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "White Pea Curry with Phulka" },
      { day: "Friday", breakfast: "Carrot Roti with Curd", lunch: "Dill Leaves Curry with Roti", snack: "Curd Sweet Potato Bowl", dinner: "Urad Dal Cheela with Curd" },
      { day: "Saturday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Cauliflower Peas Masala with Rice", snack: "Boiled Peanut Chaat", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Mixed Dal Adai", lunch: "Spicy Chicken Peanut Pepper Roast", snack: "Peanut Chikki", dinner: "Ammini Kozhukattai with Vegetables" }
    ]
  },
  // Age 70 | normal | plan1
  {
    age: 70, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Potato Beans Curry with Roti", snack: "Roasted Corn Peanut Mix", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Tuesday", breakfast: "Sattu Roti with Curd", lunch: "Kala Vatana Usal with Roti", snack: "Beetroot Peanut Chaat", dinner: "Mixed Dal Adai with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Thalipeeth", lunch: "Spicy Chicken Tawa Garlic Fry", snack: "Roasted Black Chana with Lemon", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Thursday", breakfast: "Ragi Rotti with Chutney", lunch: "White Peas Masala with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Friday", breakfast: "Rava Paniyaram", lunch: "Sprouted Moong Curry with Roti", snack: "Banana Jaggery Bowl", dinner: "Akki Rotti with Curd" },
      { day: "Saturday", breakfast: "Onion Missi Roti", lunch: "Moong Dal with Spinach", snack: "Ragi Peanut Chikki", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Dhokla", lunch: "Home-Style Chicken Peanut Pepper Roast", snack: "Roasted Peanuts with Curry Leaves", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 70 | normal | plan2
  {
    age: 70, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Chana Dal Cheela", lunch: "Bengali Masoor Dal with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Aval Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Banana with Roasted Peanuts", lunch: "Dal with Fenugreek Leaves", snack: "Rice Kanji Drink", dinner: "Onion Adai with Chutney" },
      { day: "Wednesday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Traditional Chicken Garlic Lemon Fry", snack: "Homemade Popcorn with Peanuts", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Thursday", breakfast: "Green Peas Muthia", lunch: "Maharashtrian Amti with Rice", snack: "Carrot Peanut Chaat", dinner: "Vegetable Adai with Curd" },
      { day: "Friday", breakfast: "Ragi Vegetable Roti", lunch: "Stuffed Brinjal with Roti", snack: "Banana Sattu Shake", dinner: "Ragi Dhokla with Curd" },
      { day: "Saturday", breakfast: "Ragi Banana Malt", lunch: "Toor Dal with Raw Banana", snack: "Curd Roasted Chana Bowl", dinner: "Moong Dal Handvo" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Prawn Gongura Curry", snack: "Roasted Chana Ladoo", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 70 | normal | plan3
  {
    age: 70, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Cluster Beans Dal Curry with Roti", snack: "Roasted Green Gram", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Methi Handvo", lunch: "Sweet Potato Peas Curry with Roti", snack: "Ragi Peanut Ladoo", dinner: "Chayote Moong Curry with Roti" },
      { day: "Wednesday", breakfast: "Palak Besan Cheela", lunch: "Light Chicken Sesame Pepper Roast", snack: "Roasted Bengal Gram with Onion", dinner: "Vegetable Handvo with Curd" },
      { day: "Thursday", breakfast: "Methi Thalipeeth", lunch: "Sweet Potato Peas Curry with Rice", snack: "Puffed Rice Chikki", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Cabbage Besan Cheela", lunch: "Chayote Dal Curry with Roti", snack: "Sweet Potato Peanut Chaat", dinner: "Jowar Kanji with Dal" },
      { day: "Saturday", breakfast: "Vegetable Rice Sevai", lunch: "Broad Beans Masala with Rice", snack: "Bajra Malt Drink", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Methi Muthia", lunch: "Prawn Lemon Fry", snack: "Papaya Peanut Chaat", dinner: "Black-Eyed Pea Curry with Roti" }
    ]
  },
  // Age 70 | normal | plan4
  {
    age: 70, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Bajra Malt with Jaggery", lunch: "Cauliflower Dal Curry with Roti", snack: "Roasted Sweet Corn", dinner: "Dudhi Muthia with Curd" },
      { day: "Tuesday", breakfast: "Jowar Vegetable Pancake", lunch: "Beerakaya Pappu with Rice", snack: "Sattu Buttermilk", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Banana Ragi Pancake", lunch: "Home-Style Chicken Onion Pepper Fry", snack: "Ragi Puffed Grain Chaat", dinner: "Methi Missi Roti with Dal" },
      { day: "Thursday", breakfast: "Drumstick Leaves Adai", lunch: "Dill Leaves Dal with Rice", snack: "Mint Buttermilk", dinner: "Stuffed Bhindi with Roti" },
      { day: "Friday", breakfast: "Lemon Sevai with Peanuts", lunch: "Cabbage Moong Curry with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Saturday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Beetroot Coconut Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Rice Kanji with Dal" },
      { day: "Sunday", breakfast: "Ragi Vegetable Pancake", lunch: "Light Chicken Dry Coconut Roast", snack: "Homemade Ragi Savoury Balls", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 70 | overweight | plan1
  {
    age: 70, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Vegetable Handvo", lunch: "Gongura Pappu with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Lobia Curry with Roti" },
      { day: "Tuesday", breakfast: "Ajwain Missi Roti", lunch: "Dosakaya Pappu with Rice", snack: "Roasted Chana Chikki", dinner: "Bharli Vangi with Bhakri" },
      { day: "Wednesday", breakfast: "Urad Dal Cheela", lunch: "Coastal Fish Green Masala Fry", snack: "Sattu Jaggery Ladoo", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Raw Banana Masala with Roti", snack: "Curd Banana Jaggery Bowl", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Friday", breakfast: "Moong Dal Roti", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Curd Cucumber Peanut Bowl", dinner: "Stuffed Brinjal with Roti" },
      { day: "Saturday", breakfast: "Ragi Dhokla", lunch: "Potato Methi Curry with Roti", snack: "Curry Leaf Buttermilk", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Spicy Fish Lemon Pepper Fry", snack: "Roasted Rice Flake Mixture", dinner: "Lemon Sevai with Peanuts" }
    ]
  },
  // Age 70 | overweight | plan2
  {
    age: 70, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Akki Rotti", lunch: "Potato Beans Curry with Rice", snack: "Banana Ragi Balls", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Black-Eyed Pea Curry with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Wednesday", breakfast: "Onion Adai", lunch: "Traditional Chicken Pepper Roast", snack: "Ragi Jaggery Ladoo", dinner: "Onion Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Gujarati Dal with Rice", snack: "Papaya Coconut Bowl", dinner: "Ragi Ambli with Roti" },
      { day: "Friday", breakfast: "Vegetable Adai", lunch: "Methi Peas Curry with Roti", snack: "Black Chana Sundal", dinner: "Besan Dhokla with Curd" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Carrot Peas Masala with Roti", snack: "Green Gram Sundal", dinner: "Methi Akki Rotti" },
      { day: "Sunday", breakfast: "Vegetable Muthia", lunch: "Home-Style Chicken Garlic Coriander Roast", snack: "Jeera Buttermilk", dinner: "Sattu Cheela with Curd" }
    ]
  },
  // Age 70 | overweight | plan3
  {
    age: 70, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Paniyaram", lunch: "Sattu Curry with Roti", snack: "Plain Homemade Lassi", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Tuesday", breakfast: "Ragi Thalipeeth", lunch: "Potato Peas Curry with Rice", snack: "Jaggery Lassi", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Light Chicken Garlic Pepper Fry", snack: "Horse Gram Sundal", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Black-Eyed Pea Curry with Rice", snack: "Banana Lassi", dinner: "Green Peas Usal with Chapati" },
      { day: "Friday", breakfast: "Moong Dal Paniyaram", lunch: "Stuffed Tindora with Roti", snack: "Homemade Murmura Chaat", dinner: "Kala Vatana Usal with Roti" },
      { day: "Saturday", breakfast: "Boiled Yam with Curd", lunch: "Matki Usal with Rice", snack: "Ginger Buttermilk", dinner: "Vegetable Muthia with Curd" },
      { day: "Sunday", breakfast: "Banana Jowar Pancake", lunch: "Home-Style Chicken Lemon Fry", snack: "Roasted Mung Beans", dinner: "Jowar Ambli with Roti" }
    ]
  },
  // Age 70 | overweight | plan4
  {
    age: 70, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Pancake", lunch: "Lobia Curry with Roti", snack: "White Peas Sundal", dinner: "Methi Handvo with Chutney" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Chana Dal with Spinach", snack: "Banana Jaggery Milk", dinner: "Methi Adai with Curd" },
      { day: "Wednesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Light Chicken Dry Curry Leaf Roast", snack: "Raw Banana Chaat", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Jowar Malt with Milk", lunch: "Stuffed Bhindi with Roti", snack: "Homemade Poha Chivda", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Friday", breakfast: "Ragi Ambli with Jaggery", lunch: "Broad Beans Masala with Roti", snack: "Boiled Groundnut Salad", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Methi Adai", lunch: "Stuffed Brinjal with Rice", snack: "Poha Jaggery Ladoo", dinner: "Jowar Rotti with Dal" },
      { day: "Sunday", breakfast: "Rava Kichadi with Peanuts", lunch: "Coastal Chicken Methi Pepper Fry", snack: "Sattu Jaggery Balls", dinner: "Coconut Sevai with Peanuts" }
    ]
  },
  // Age 71 | underweight | plan1
  {
    age: 71, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Tindora Sesame Curry with Roti", snack: "Banana Jaggery Milk", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Tuesday", breakfast: "Ragi Kozhukattai", lunch: "Green Gram Masala with Roti", snack: "Boiled Peanut Chaat", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Onion Missi Roti", lunch: "Spicy Chicken Jeera Fry", snack: "Puffed Rice Chana Mixture", dinner: "Khaman Dhokla with Curd" },
      { day: "Thursday", breakfast: "Ragi Rotti with Chutney", lunch: "Maharashtrian Amti with Rice", snack: "Black-Eyed Pea Sundal", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Ragi Sevai Upma", lunch: "Dal with Drumstick Leaves", snack: "Sattu Jaggery Balls", dinner: "Palak Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Stuffed Tindora with Roti", snack: "Sattu Buttermilk", dinner: "Vegetable Adai with Curd" },
      { day: "Sunday", breakfast: "Vegetable Muthia", lunch: "Traditional Prawn Tamarind Curry", snack: "Puffed Rice Peanut Mixture", dinner: "Stuffed Bhindi with Roti" }
    ]
  },
  // Age 71 | underweight | plan2
  {
    age: 71, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Peas Potato Curry with Rice", snack: "Raw Banana Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Carrot Peas Masala with Rice", snack: "Banana Ragi Shake", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Wednesday", breakfast: "Chana Dal Roti", lunch: "Light Chicken Pudina Fry", snack: "Banana Lassi", dinner: "Yam Pepper Curry with Roti" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Spinach Chana Curry with Roti", snack: "Roasted Chana Chikki", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Friday", breakfast: "Khaman Dhokla", lunch: "Sattu Curry with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Methi Missi Roti with Dal" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Raw Mango Dal with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Bajra Ambli", lunch: "Spicy Chicken Mint Pepper Roast", snack: "Sattu Jaggery Ladoo", dinner: "Ragi Dhokla with Curd" }
    ]
  },
  // Age 71 | underweight | plan3
  {
    age: 71, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Green Peas Roti", lunch: "Brinjal Coconut Curry with Rice", snack: "Banana Ragi Balls", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Tuesday", breakfast: "Ragi Thalipeeth", lunch: "Chana Usal with Bhakri", snack: "Roasted Sweet Corn", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Banana Jowar Pancake", lunch: "Coastal Chicken Dhaba Fry", snack: "Curd Cucumber Peanut Bowl", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Thursday", breakfast: "Bottle Gourd Handvo", lunch: "Black-Eyed Pea Curry with Roti", snack: "Green Gram Sundal", dinner: "Coconut Sevai with Peanuts" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Amaranth Dal with Roti", snack: "Roasted Cowpeas", dinner: "Ragi Rotti with Curd" },
      { day: "Saturday", breakfast: "Methi Adai", lunch: "White Peas Curry with Rice", snack: "Roasted Green Gram", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Drumstick Leaves Adai", lunch: "Traditional Chicken Tawa Ginger Fry", snack: "Puffed Rice Chikki", dinner: "Carrot Muthia with Dal" }
    ]
  },
  // Age 71 | underweight | plan4
  {
    age: 71, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Sattu Roti with Curd", lunch: "Raw Banana Masala with Rice", snack: "Boiled Yam Chaat", dinner: "Vegetable Muthia with Curd" },
      { day: "Tuesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Brinjal Dal Curry with Roti", snack: "Mint Buttermilk", dinner: "Matki Usal with Bhakri" },
      { day: "Wednesday", breakfast: "Banana Ragi Pancake", lunch: "Light Chicken Coconut Masala Fry", snack: "Plain Homemade Lassi", dinner: "Methi Adai with Curd" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Stuffed Brinjal with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Chayote Moong Curry with Roti" },
      { day: "Friday", breakfast: "Bajra Methi Roti", lunch: "Beetroot Coconut Curry with Rice", snack: "Jeera Buttermilk", dinner: "Dudhi Muthia with Curd" },
      { day: "Saturday", breakfast: "Vegetable Adai", lunch: "Broad Beans Masala with Rice", snack: "Guava Peanut Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Spicy Chicken Dry Sesame Roast", snack: "Boiled Corn with Lemon", dinner: "Kala Vatana Usal with Roti" }
    ]
  },
  // Age 71 | normal | plan1
  {
    age: 71, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bajra Thalipeeth", lunch: "Moong Dal with Sweet Potato", snack: "Roasted Mung Beans", dinner: "Raw Banana Masala with Phulka" },
      { day: "Tuesday", breakfast: "Peanut Banana Bowl", lunch: "Beetroot Masala with Roti", snack: "Black Chana Chaat with Lemon", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Wednesday", breakfast: "Moong Dal Roti", lunch: "Coastal Chicken Ginger Fry", snack: "Roasted Chana Jaggery Mix", dinner: "Jowar Kanji with Dal" },
      { day: "Thursday", breakfast: "Bajra Rotti with Curd", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Peanut Poha Chivda", dinner: "Bajra Ambli with Curd" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Carrot Moong Curry with Roti", snack: "Roasted Bengal Gram with Onion", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Saturday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Cauliflower Methi Curry with Roti", snack: "Ginger Buttermilk", dinner: "Bajra Rotti with Dal" },
      { day: "Sunday", breakfast: "Palak Missi Roti", lunch: "Fish Coriander Lemon Fry", snack: "Carrot Peanut Chaat", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 71 | normal | plan2
  {
    age: 71, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Methi Roti", lunch: "Moong Dal with Spinach", snack: "Banana Sattu Shake", dinner: "Rava Vegetable Kichadi" },
      { day: "Tuesday", breakfast: "Methi Besan Cheela", lunch: "Stuffed Brinjal with Roti", snack: "Papaya Peanut Chaat", dinner: "Palak Missi Roti with Curd" },
      { day: "Wednesday", breakfast: "Methi Muthia", lunch: "Home-Style Fish Pepper Roast", snack: "Curd Sweet Potato Bowl", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Cowpea Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Bharli Vangi with Bhakri" },
      { day: "Friday", breakfast: "Carrot Roti with Curd", lunch: "Spinach Corn Curry with Rice", snack: "Black Chana Sundal", dinner: "Chana Dal Roti with Curd" },
      { day: "Saturday", breakfast: "Carrot Besan Cheela", lunch: "Chana Dal with Ridge Gourd", snack: "Sesame Jaggery Ladoo", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Sunday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Coastal Prawn Garlic Fry", snack: "Homemade Poha Chivda", dinner: "Tindora Sesame Curry with Roti" }
    ]
  },
  // Age 71 | normal | plan3
  {
    age: 71, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Sweet Potato Roti", lunch: "Raw Banana Masala with Roti", snack: "Cucumber Roasted Chana Chaat", dinner: "Lobia Curry with Roti" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Potato Beans Curry with Rice", snack: "Curry Leaf Buttermilk", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Wednesday", breakfast: "Jowar Vegetable Pancake", lunch: "Light Chicken Kasuri Methi Fry", snack: "Ragi Banana Balls", dinner: "Onion Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Matki Usal with Bhakri", snack: "Roasted Corn Peanut Mix", dinner: "Green Peas Roti with Curd" },
      { day: "Friday", breakfast: "Sattu Vegetable Roti", lunch: "Chana Dal with Spinach", snack: "White Peas Sundal", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Saturday", breakfast: "Ajwain Missi Roti", lunch: "Potato Peas Curry with Rice", snack: "Lobia Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Sunday", breakfast: "Ragi Paniyaram", lunch: "Home-Style Prawn Gongura Curry", snack: "Peanut Chikki", dinner: "Drumstick Leaves Dal with Roti" }
    ]
  },
  // Age 71 | normal | plan4
  {
    age: 71, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Chana Dal Cheela", lunch: "Broad Beans Dal Curry with Rice", snack: "Dry Roasted Corn", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Mixed Dal Cheela", lunch: "Cabbage Moong Curry with Roti", snack: "Banana Jaggery Bowl", dinner: "Carrot Roti with Dal" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Spicy Chicken Sukka", snack: "Roasted Gram Balls", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Thursday", breakfast: "Onion Adai", lunch: "Drumstick Leaves Curry with Rice", snack: "White Pea Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Friday", breakfast: "Vegetable Rice Sevai", lunch: "Dill Leaves Curry with Roti", snack: "Curd Peanut Bowl", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Sattu Vegetable Pancake", lunch: "Andhra Mudda Pappu with Rice", snack: "Ragi Peanut Chikki", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Sunday", breakfast: "Moong Dal Dhokla", lunch: "Fish Andhra Pulusu", snack: "Ragi Puffed Grain Chaat", dinner: "Akki Rotti with Curd" }
    ]
  },
  // Age 71 | overweight | plan1
  {
    age: 71, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Green Peas Muthia", lunch: "Green Gram Masala with Rice", snack: "Poha Jaggery Ladoo", dinner: "Sattu Curry with Phulka" },
      { day: "Tuesday", breakfast: "Methi Akki Rotti", lunch: "Kala Vatana Usal with Rice", snack: "Homemade Murmura Chaat", dinner: "Methi Akki Rotti" },
      { day: "Wednesday", breakfast: "Urad Dal Cheela", lunch: "Traditional Chicken Curry Leaf Fry", snack: "Roasted Chana Ladoo", dinner: "Beetroot Masala with Roti" },
      { day: "Thursday", breakfast: "Dudhi Muthia", lunch: "Bharli Vangi with Bhakri", snack: "Sesame Chikki", dinner: "Rice Kanji with Dal" },
      { day: "Friday", breakfast: "Sattu Cheela", lunch: "Potato Methi Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Jowar Muthia with Dal" },
      { day: "Saturday", breakfast: "Leftover Rice Paniyaram", lunch: "Gujarati Dal with Rice", snack: "Murmura Peanut Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Onion Paniyaram", lunch: "Light Chicken Ginger Pepper Fry", snack: "Bajra Malt Drink", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 71 | overweight | plan2
  {
    age: 71, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Lemon Sevai with Peanuts", lunch: "Amaranth Leaves Curry with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Tuesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Sweet Potato Peas Curry with Roti", snack: "Green Gram Chaat", dinner: "Beetroot Roti with Curd" },
      { day: "Wednesday", breakfast: "Banana with Roasted Peanuts", lunch: "Traditional Chicken Sukka", snack: "Jowar Puffed Grain Chaat", dinner: "Stuffed Brinjal with Roti" },
      { day: "Thursday", breakfast: "Methi Handvo", lunch: "Chayote Dal Curry with Roti", snack: "Peanut Sundal", dinner: "Urad Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Ragi Ambli with Jaggery", lunch: "Carrot Chana Curry with Rice", snack: "Homemade Banana Shake", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Saturday", breakfast: "Carrot Muthia", lunch: "Broad Beans Masala with Roti", snack: "Horse Gram Sundal", dinner: "Sweet Potato Roti with Curd" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Traditional Fish Tawa Fry", snack: "Papaya Lassi", dinner: "Methi Handvo with Chutney" }
    ]
  },
  // Age 71 | overweight | plan3
  {
    age: 71, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Vegetable Handvo", lunch: "Potato Beans Curry with Roti", snack: "Jowar Malt Drink", dinner: "Methi Muthia with Dal" },
      { day: "Tuesday", breakfast: "Jowar Ambli", lunch: "Green Peas Usal with Roti", snack: "Jowar Chikki", dinner: "Jowar Rotti with Dal" },
      { day: "Wednesday", breakfast: "Methi Missi Roti", lunch: "Spicy Fish Tamarind Curry", snack: "Sweet Potato Sesame Balls", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Ragi Vegetable Pancake", lunch: "Cauliflower Peas Masala with Rice", snack: "Jaggery Ragi Milk", dinner: "Chana Usal with Bhakri" },
      { day: "Friday", breakfast: "Jowar Muthia", lunch: "Methi Peas Curry with Roti", snack: "Ragi Buttermilk", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Bajra Malt with Jaggery", lunch: "Carrot Peas Masala with Roti", snack: "Cowpea Sundal", dinner: "Sattu Cheela with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Adai", lunch: "Spicy Fish Mangalorean Curry", snack: "Ragi Peanut Ladoo", dinner: "Vegetable Sevai with Chana Dal" }
    ]
  },
  // Age 71 | overweight | plan4
  {
    age: 71, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Dal with Amaranth Leaves", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Onion Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Moong Dal Handvo", lunch: "Methi Corn Curry with Rice", snack: "Banana Sesame Chaat", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "Traditional Chicken Ginger Lemon Fry", snack: "Homemade Corn Chivda", dinner: "Lemon Sevai with Peanuts" },
      { day: "Thursday", breakfast: "Boiled Yam with Curd", lunch: "Dal with Carrot and Beans", snack: "Peanut Jaggery Ladoo", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Moong Dal Paniyaram", lunch: "Black-Eyed Pea Curry with Rice", snack: "Beetroot Peanut Chaat", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Cabbage Carrot Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Sunday", breakfast: "Jowar Thalipeeth", lunch: "Traditional Chicken Dry Green Masala Roast", snack: "Homemade Jowar Savoury Balls", dinner: "Ragi Thalipeeth with Dal" }
    ]
  },
  // Age 72 | underweight | plan1
  {
    age: 72, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Lobia Curry with Rice", snack: "Homemade Peanut Bar", dinner: "Chana Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Papaya Curd Bowl", lunch: "Cowpea Curry with Rice", snack: "Roasted Peanut Jaggery Mix", dinner: "Methi Akki Rotti" },
      { day: "Wednesday", breakfast: "Jowar Ambli", lunch: "Home-Style Fish Garlic Pepper Fry", snack: "Peanut Jaggery Ladoo", dinner: "Ragi Rotti with Curd" },
      { day: "Thursday", breakfast: "Ragi Thalipeeth", lunch: "Chana Dal with Spinach", snack: "Banana Lassi", dinner: "Kala Vatana Usal with Roti" },
      { day: "Friday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Dill Leaves Dal with Rice", snack: "Beetroot Peanut Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Saturday", breakfast: "Moong Dal Dhokla", lunch: "Sattu Curry with Roti", snack: "Roasted Green Gram", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Sunday", breakfast: "Onion Paniyaram", lunch: "Fish Mangalorean Curry", snack: "Homemade Murmura Chaat", dinner: "Sattu Curry with Phulka" }
    ]
  },
  // Age 72 | underweight | plan2
  {
    age: 72, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Khaman Dhokla", lunch: "Carrot Chana Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Methi Adai with Curd" },
      { day: "Tuesday", breakfast: "Palak Missi Roti", lunch: "Chana Usal with Bhakri", snack: "Guava Peanut Chaat", dinner: "Stuffed Bhindi with Roti" },
      { day: "Wednesday", breakfast: "Methi Muthia", lunch: "Coastal Chicken Coriander Lemon Fry", snack: "Homemade Corn Chivda", dinner: "Sattu Cheela with Curd" },
      { day: "Thursday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Moong Dal with Sweet Potato", snack: "Murmura Black Chana Chaat", dinner: "Jowar Muthia with Dal" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Beetroot Coconut Curry with Rice", snack: "Banana Ragi Balls", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Bottle Gourd Handvo", lunch: "Brinjal Dal Curry with Roti", snack: "Homemade Banana Shake", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Ragi Kozhukattai", lunch: "Light Chicken Punjabi Masala Fry", snack: "Boiled Chana Chaat with Onion", dinner: "Ragi Kozhukattai with Chutney" }
    ]
  },
  // Age 72 | underweight | plan3
  {
    age: 72, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Millet Vegetable Pancake", lunch: "Chayote Dal Curry with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Methi Adai", lunch: "Tindora Peanut Curry with Rice", snack: "Jaggery Ragi Milk", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Moong Dal Handvo", lunch: "Prawn Ginger Garlic Fry", snack: "Roasted Bengal Gram with Onion", dinner: "Beetroot Roti with Curd" },
      { day: "Thursday", breakfast: "Onion Missi Roti", lunch: "Potato Beans Curry with Roti", snack: "White Peas Sundal", dinner: "Jowar Rotti with Dal" },
      { day: "Friday", breakfast: "Chana Dal Roti", lunch: "Yam Pepper Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Saturday", breakfast: "Bajra Rotti with Curd", lunch: "Stuffed Brinjal with Roti", snack: "Papaya Peanut Chaat", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Bajra Ambli", lunch: "Chicken Ginger Pepper Fry", snack: "Puffed Rice Chikki", dinner: "Green Peas Usal with Chapati" }
    ]
  },
  // Age 72 | underweight | plan4
  {
    age: 72, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "Brinjal Coconut Curry with Rice", snack: "Jowar Chikki", dinner: "Vegetable Handvo with Curd" },
      { day: "Tuesday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Broad Beans Masala with Roti", snack: "Roasted Rice Flake Mixture", dinner: "Raw Banana Masala with Phulka" },
      { day: "Wednesday", breakfast: "Vegetable Paniyaram", lunch: "Coastal Chicken Lemon Garlic Roast", snack: "Carrot Peanut Chaat", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Thursday", breakfast: "Moong Dal Roti", lunch: "Lobia Curry with Roti", snack: "Puffed Rice Peanut Mixture", dinner: "Green Peas Roti with Curd" },
      { day: "Friday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Kala Vatana Usal with Rice", snack: "Roasted Peanuts with Curry Leaves", dinner: "Bharli Vangi with Bhakri" },
      { day: "Saturday", breakfast: "Banana with Roasted Peanuts", lunch: "Methi Peas Curry with Roti", snack: "Sattu Jaggery Ladoo", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Sunday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Coastal Chicken Dry Ginger Roast", snack: "Jowar Puffed Grain Chaat", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 72 | normal | plan1
  {
    age: 72, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Vegetable Rice Sevai", lunch: "Potato Methi Curry with Roti", snack: "Roasted Corn Peanut Mix", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Methi Corn Curry with Rice", snack: "Peanut Sundal", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Wednesday", breakfast: "Green Peas Muthia", lunch: "Home-Style Chicken Green Masala Fry", snack: "Papaya Lassi", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Thursday", breakfast: "Onion Thalipeeth", lunch: "Kala Vatana Usal with Roti", snack: "Banana Sesame Chaat", dinner: "Bajra Rotti with Dal" },
      { day: "Friday", breakfast: "Ragi Banana Malt", lunch: "Carrot Moong Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Raw Banana Masala with Rice", snack: "Green Gram Sundal", dinner: "Green Peas Muthia with Curd" },
      { day: "Sunday", breakfast: "Boiled Yam with Curd", lunch: "Coastal Chicken Sukka", snack: "Ragi Buttermilk", dinner: "Ragi Vegetable Pancake with Curd" }
    ]
  },
  // Age 72 | normal | plan2
  {
    age: 72, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Handvo", lunch: "Stuffed Tindora with Roti", snack: "Curd Peanut Bowl", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Matki Usal with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Stuffed Tindora with Roti" },
      { day: "Wednesday", breakfast: "Bajra Methi Roti", lunch: "Light Chicken Dry Pudina Roast", snack: "Black-Eyed Pea Sundal", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Thursday", breakfast: "Jowar Malt with Milk", lunch: "Masoor Dal with Methi", snack: "Mint Buttermilk", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Friday", breakfast: "Beetroot Roti with Curd", lunch: "Cauliflower Peas Masala with Rice", snack: "Roasted Cowpeas", dinner: "Moong Dal Handvo" },
      { day: "Saturday", breakfast: "Vegetable Muthia", lunch: "Raw Banana Masala with Roti", snack: "Cucumber Roasted Chana Chaat", dinner: "Cauliflower Methi Curry with Phulka" },
      { day: "Sunday", breakfast: "Bajra Thalipeeth", lunch: "Spicy Chicken Sukka", snack: "Homemade Poha Chivda", dinner: "Bajra Thalipeeth with Curd" }
    ]
  },
  // Age 72 | normal | plan3
  {
    age: 72, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Cauliflower Dal Curry with Roti", snack: "Cowpea Chaat", dinner: "Palak Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "Toor Dal with Raw Banana", snack: "Black Chana Chaat with Lemon", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Lemon Sevai with Peanuts", lunch: "Spicy Chicken Garlic Coriander Roast", snack: "Roasted Mung Beans", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Thursday", breakfast: "Urad Dal Cheela", lunch: "Yam Masala with Roti", snack: "Banana Sattu Shake", dinner: "Khaman Dhokla with Curd" },
      { day: "Friday", breakfast: "Jowar Kanji with Curd", lunch: "Dal with Carrot and Beans", snack: "Bajra Malt Drink", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Ragi Malt with Jaggery", lunch: "Broad Beans Dal Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Palak Missi Roti with Curd" },
      { day: "Sunday", breakfast: "Drumstick Leaves Adai", lunch: "Spicy Prawn Gongura Curry", snack: "Boiled Peanut Chaat", dinner: "Methi Muthia with Dal" }
    ]
  },
  // Age 72 | normal | plan4
  {
    age: 72, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Radish Roti with Curd", lunch: "Chayote Moong Curry with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Carrot Roti with Curd", lunch: "Matki Usal with Bhakri", snack: "Curd Banana Jaggery Bowl", dinner: "Urad Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Dudhi Muthia", lunch: "Coastal Fish Methi Curry", snack: "Ragi Jaggery Ladoo", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Thursday", breakfast: "Vegetable Adai", lunch: "Sweet Potato Peas Curry with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Friday", breakfast: "Sattu Cheela", lunch: "White Peas Curry with Rice", snack: "Sattu Jaggery Balls", dinner: "Coconut Sevai with Peanuts" },
      { day: "Saturday", breakfast: "Palak Besan Cheela", lunch: "Gujarati Dal with Rice", snack: "Roasted Chana Ladoo", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Sunday", breakfast: "Rice Kanji with Curd", lunch: "Spicy Chicken Coconut Masala Fry", snack: "Plain Homemade Lassi", dinner: "Sweet Potato Roti with Curd" }
    ]
  },
  // Age 72 | overweight | plan1
  {
    age: 72, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Sattu Vegetable Roti", lunch: "Stuffed Bhindi with Roti", snack: "Boiled Groundnut Salad", dinner: "Rice Kanji with Dal" },
      { day: "Tuesday", breakfast: "Mixed Dal Cheela", lunch: "Gongura Pappu with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Wednesday", breakfast: "Ragi Dhokla", lunch: "Coastal Chicken Onion Fry", snack: "Roasted Sweet Corn", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Thursday", breakfast: "Ragi Vegetable Roti", lunch: "Bengali Masoor Dal with Rice", snack: "Boiled Yam Chaat", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Dal with Amaranth Leaves", snack: "Sattu Buttermilk", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Saturday", breakfast: "Bajra Malt with Jaggery", lunch: "Cabbage Moong Curry with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Vegetable Handvo", lunch: "Spicy Chicken Tomato Pepper Fry", snack: "Ginger Buttermilk", dinner: "Lobia Curry with Roti" }
    ]
  },
  // Age 72 | overweight | plan2
  {
    age: 72, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Banana Ragi Pancake", lunch: "Beetroot Masala with Roti", snack: "Banana Jaggery Milk", dinner: "Chana Dal Roti with Curd" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Spinach Chana Curry with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Sattu Roti with Dal" },
      { day: "Wednesday", breakfast: "Sattu Vegetable Pancake", lunch: "Spicy Fish Jeera Fry", snack: "Curry Leaf Buttermilk", dinner: "Bajra Ambli with Curd" },
      { day: "Thursday", breakfast: "Rava Kichadi with Peanuts", lunch: "Sattu Curry with Rice", snack: "Rice Kanji Drink", dinner: "Jowar Kanji with Dal" },
      { day: "Friday", breakfast: "Carrot Muthia", lunch: "Cauliflower Methi Curry with Roti", snack: "Ragi Peanut Ladoo", dinner: "Aval Vegetable Kichadi" },
      { day: "Saturday", breakfast: "Sattu Roti with Curd", lunch: "Green Gram Masala with Roti", snack: "Ragi Peanut Chikki", dinner: "Stuffed Brinjal with Roti" },
      { day: "Sunday", breakfast: "Cabbage Besan Cheela", lunch: "Traditional Fish Methi Curry", snack: "Jeera Buttermilk", dinner: "Methi Missi Roti with Dal" }
    ]
  },
  // Age 72 | overweight | plan3
  {
    age: 72, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Dill Leaves Curry with Roti", snack: "Murmura Peanut Chaat", dinner: "White Pea Curry with Phulka" },
      { day: "Tuesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Potato Peas Curry with Rice", snack: "Corn Peanut Sundal", dinner: "Carrot Muthia with Dal" },
      { day: "Wednesday", breakfast: "Guava Curd Bowl", lunch: "Chicken Drumstick Leaf Fry", snack: "Jaggery Lassi", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Thursday", breakfast: "Jowar Methi Roti", lunch: "Peas Potato Curry with Rice", snack: "Dry Roasted Corn", dinner: "Lemon Sevai with Peanuts" },
      { day: "Friday", breakfast: "Methi Missi Roti", lunch: "Andhra Mudda Pappu with Rice", snack: "Jowar Malt Drink", dinner: "Methi Handvo with Chutney" },
      { day: "Saturday", breakfast: "Rava Paniyaram", lunch: "Dosakaya Pappu with Rice", snack: "Murmura Onion Chaat", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Light Fish Tawa Fry", snack: "Horse Gram Sundal", dinner: "Ragi Ambli with Roti" }
    ]
  },
  // Age 72 | overweight | plan4
  {
    age: 72, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Leftover Rice Paniyaram", lunch: "Stuffed Brinjal with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Tuesday", breakfast: "Banana Jowar Pancake", lunch: "Chana Dal with Ridge Gourd", snack: "Roasted Chana Chikki", dinner: "Beetroot Masala with Roti" },
      { day: "Wednesday", breakfast: "Methi Akki Rotti", lunch: "Home-Style Chicken Lemon Fry", snack: "Black Chana Sundal", dinner: "Akki Rotti with Curd" },
      { day: "Thursday", breakfast: "Peanut Banana Bowl", lunch: "Masoor Dal with Dill Leaves", snack: "Roasted Gram Balls", dinner: "Carrot Roti with Dal" },
      { day: "Friday", breakfast: "Vegetable Thalipeeth", lunch: "Drumstick Leaves Curry with Rice", snack: "Cowpea Sundal", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Saturday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Black-Eyed Pea Curry with Roti", snack: "Sesame Chikki", dinner: "Jowar Ambli with Roti" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Light Chicken Jeera Fry", snack: "Curd Cucumber Peanut Bowl", dinner: "Vegetable Adai with Curd" }
    ]
  },
  // Age 73 | underweight | plan1
  {
    age: 73, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Bottle Gourd Handvo", lunch: "Raw Banana Masala with Rice", snack: "Raw Banana Chaat", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Tuesday", breakfast: "Khaman Dhokla", lunch: "Potato Methi Curry with Roti", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Wednesday", breakfast: "Bajra Ambli", lunch: "Traditional Prawn Lemon Fry", snack: "Roasted Cowpeas", dinner: "Akki Rotti with Curd" },
      { day: "Thursday", breakfast: "Ragi Kozhukattai", lunch: "Broad Beans Masala with Roti", snack: "White Peas Sundal", dinner: "Sattu Cheela with Curd" },
      { day: "Friday", breakfast: "Green Peas Roti", lunch: "Sattu Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Bajra Methi Roti", lunch: "Cowpea Masala with Roti", snack: "Mint Buttermilk", dinner: "Methi Adai with Curd" },
      { day: "Sunday", breakfast: "Jowar Ambli", lunch: "Coastal Chicken Dry Curry Leaf Roast", snack: "Jeera Buttermilk", dinner: "Palak Dhokla with Chutney" }
    ]
  },
  // Age 73 | underweight | plan2
  {
    age: 73, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ammini Kozhukattai", lunch: "Cabbage Carrot Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Methi Besan Cheela with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Rice Sevai", lunch: "Sweet Potato Peas Curry with Roti", snack: "Roasted Chana Ladoo", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Palak Missi Roti", lunch: "Spicy Chicken Telangana Pepper Roast", snack: "Guava Jaggery Bowl", dinner: "Sweet Potato Roti with Curd" },
      { day: "Thursday", breakfast: "Banana Jowar Pancake", lunch: "Drumstick Leaves Curry with Rice", snack: "Bajra Malt Drink", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Friday", breakfast: "Boiled Yam with Curd", lunch: "Black-Eyed Pea Curry with Roti", snack: "Banana Jaggery Bowl", dinner: "Stuffed Tindora with Roti" },
      { day: "Saturday", breakfast: "Ragi Banana Malt", lunch: "Chana Usal with Bhakri", snack: "Roasted Mung Beans", dinner: "Green Peas Usal with Chapati" },
      { day: "Sunday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Traditional Chicken Tawa Ginger Fry", snack: "Ragi Jaggery Ladoo", dinner: "Carrot Peas Masala with Phulka" }
    ]
  },
  // Age 73 | underweight | plan3
  {
    age: 73, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Sattu Cheela", lunch: "Tindora Peanut Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Vegetable Muthia with Curd" },
      { day: "Tuesday", breakfast: "Bajra Rotti with Curd", lunch: "Yam Pepper Curry with Rice", snack: "Roasted Black Chana with Lemon", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Light Chicken Pan Fry", snack: "Ragi Peanut Ladoo", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Sprouted Moong Curry with Rice", snack: "Roasted Gram Balls", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Friday", breakfast: "Jowar Muthia", lunch: "Stuffed Brinjal with Roti", snack: "Jowar Malt Drink", dinner: "Jowar Ambli with Roti" },
      { day: "Saturday", breakfast: "Ragi Malt with Jaggery", lunch: "Dal with Amaranth Leaves", snack: "Homemade Jowar Savoury Balls", dinner: "Kala Vatana Usal with Roti" },
      { day: "Sunday", breakfast: "Moong Dal Paniyaram", lunch: "Traditional Chicken Andhra Fry", snack: "Curd Sweet Potato Bowl", dinner: "Khaman Dhokla with Curd" }
    ]
  },
  // Age 73 | underweight | plan4
  {
    age: 73, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Carrot Muthia", lunch: "Chana Dal with Ridge Gourd", snack: "Black Chana Sundal", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Tuesday", breakfast: "Onion Adai", lunch: "Yam Masala with Roti", snack: "Peanut Jaggery Ladoo", dinner: "Methi Handvo with Chutney" },
      { day: "Wednesday", breakfast: "Banana Ragi Pancake", lunch: "Light Chicken Chettinad Fry", snack: "Dry Roasted Corn", dinner: "Bajra Ambli with Curd" },
      { day: "Thursday", breakfast: "Moong Dal Roti", lunch: "Maharashtrian Amti with Rice", snack: "Beetroot Peanut Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Friday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Raw Banana Masala with Roti", snack: "Peanut Sundal", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Saturday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Gongura Pappu with Rice", snack: "Jowar Puffed Grain Chaat", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Sunday", breakfast: "Vegetable Muthia", lunch: "Coastal Chicken Gongura Pepper Fry", snack: "Lobia Chaat", dinner: "Vegetable Adai with Curd" }
    ]
  },
  // Age 73 | normal | plan1
  {
    age: 73, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Methi Thalipeeth", lunch: "Potato Beans Curry with Roti", snack: "Murmura Onion Chaat", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Tuesday", breakfast: "Onion Paniyaram", lunch: "Peas Potato Curry with Roti", snack: "Poha Jaggery Ladoo", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Wednesday", breakfast: "Rava Paniyaram", lunch: "Coastal Chicken Garlic Pepper Fry", snack: "Boiled Peanut Chaat", dinner: "Chana Usal with Bhakri" },
      { day: "Thursday", breakfast: "Onion Besan Cheela", lunch: "Beetroot Masala with Roti", snack: "Jowar Chikki", dinner: "Rice Flour Vegetable Pancake" },
      { day: "Friday", breakfast: "Moong Dal Dhokla", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Guava Peanut Chaat", dinner: "Green Peas Roti with Curd" },
      { day: "Saturday", breakfast: "Ragi Dhokla", lunch: "Amaranth Leaves Curry with Rice", snack: "Sesame Jaggery Ladoo", dinner: "Moong Dal Handvo" },
      { day: "Sunday", breakfast: "Sattu Vegetable Pancake", lunch: "Home-Style Chicken Pepper Fry", snack: "Roasted Peanut Jaggery Mix", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
  // Age 73 | normal | plan2
  {
    age: 73, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Rice Kanji with Curd", lunch: "Brinjal Dal Curry with Roti", snack: "Sweet Potato Sesame Balls", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Tuesday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Cauliflower Dal Curry with Roti", snack: "Puffed Rice Chikki", dinner: "Lemon Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Coastal Chicken Coriander Lemon Fry", snack: "Banana Ragi Balls", dinner: "Methi Missi Roti with Dal" },
      { day: "Thursday", breakfast: "Methi Akki Rotti", lunch: "Dal with Carrot and Beans", snack: "Curd Cucumber Peanut Bowl", dinner: "Rice Kanji with Dal" },
      { day: "Friday", breakfast: "Lemon Sevai with Peanuts", lunch: "Bharli Vangi with Bhakri", snack: "Curd Roasted Chana Bowl", dinner: "Onion Besan Cheela with Curd" },
      { day: "Saturday", breakfast: "Palak Dhokla", lunch: "Spinach Corn Curry with Rice", snack: "Rice Kanji Drink", dinner: "Carrot Muthia with Dal" },
      { day: "Sunday", breakfast: "Ragi Rotti with Chutney", lunch: "Home-Style Chicken Dhaba Fry", snack: "Cowpea Chaat", dinner: "Moong Dal Roti with Vegetable Curry" }
    ]
  },
  // Age 73 | normal | plan3
  {
    age: 73, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Dill Leaves Dal with Rice", snack: "Jaggery Ragi Milk", dinner: "Green Peas Muthia with Curd" },
      { day: "Tuesday", breakfast: "Jowar Kanji with Curd", lunch: "Lobia Curry with Rice", snack: "Boiled Chana Chaat with Onion", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Ragi Thalipeeth", lunch: "Prawn Andhra Curry", snack: "Sweet Potato Peanut Chaat", dinner: "Radish Roti with Dal" },
      { day: "Thursday", breakfast: "Jowar Methi Roti", lunch: "Cauliflower Peas Masala with Rice", snack: "Murmura Peanut Chaat", dinner: "Chayote Moong Curry with Roti" },
      { day: "Friday", breakfast: "Sweet Potato Roti", lunch: "Raw Mango Dal with Rice", snack: "Jaggery Lassi", dinner: "Methi Muthia with Dal" },
      { day: "Saturday", breakfast: "Palak Besan Cheela", lunch: "Cabbage Moong Curry with Roti", snack: "Homemade Banana Shake", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Boiled Raw Banana with Chutney", lunch: "Home-Style Prawn Ginger Garlic Fry", snack: "Green Gram Sundal", dinner: "Mixed Dal Cheela with Curd" }
    ]
  },
  // Age 73 | normal | plan4
  {
    age: 73, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ragi Ambli with Jaggery", lunch: "Matki Usal with Bhakri", snack: "Banana Sesame Chaat", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Tuesday", breakfast: "Carrot Besan Cheela", lunch: "Amaranth Dal with Roti", snack: "Horse Gram Sundal", dinner: "Ragi Ambli with Roti" },
      { day: "Wednesday", breakfast: "Mixed Dal Adai", lunch: "Traditional Chicken Garlic Lemon Fry", snack: "Black-Eyed Pea Sundal", dinner: "Dudhi Muthia with Curd" },
      { day: "Thursday", breakfast: "Jowar Thalipeeth", lunch: "Sattu Curry with Roti", snack: "Plain Homemade Lassi", dinner: "Onion Adai with Chutney" },
      { day: "Friday", breakfast: "Sattu Roti with Curd", lunch: "Masoor Dal with Dill Leaves", snack: "Ragi Banana Balls", dinner: "Stuffed Bhindi with Roti" },
      { day: "Saturday", breakfast: "Sattu Vegetable Roti", lunch: "Cowpea Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Sunday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Fish Lemon Pepper Fry", snack: "Sesame Chikki", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 73 | overweight | plan1
  {
    age: 73, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Masoor Dal Cheela", lunch: "Brinjal Coconut Curry with Rice", snack: "Boiled Corn with Lemon", dinner: "Jowar Rotti with Dal" },
      { day: "Tuesday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Chayote Dal Curry with Roti", snack: "Banana Ragi Shake", dinner: "Ragi Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Millet Vegetable Pancake", lunch: "Chicken Dry Sesame Roast", snack: "Banana Jaggery Milk", dinner: "Beetroot Masala with Roti" },
      { day: "Thursday", breakfast: "Vegetable Adai", lunch: "Green Peas Usal with Roti", snack: "Green Gram Chaat", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Friday", breakfast: "Banana with Roasted Peanuts", lunch: "Lobia Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Onion Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Urad Dal Cheela", lunch: "Dosakaya Pappu with Rice", snack: "Roasted Chana Chikki", dinner: "Carrot Roti with Dal" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "Home-Style Chicken Village-Style Fry", snack: "Black Chana Chaat with Lemon", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 73 | overweight | plan2
  {
    age: 73, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Methi Besan Cheela", lunch: "Chana Dal with Spinach", snack: "Curry Leaf Buttermilk", dinner: "Matki Usal with Bhakri" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Beetroot Coconut Curry with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Sattu Vegetable Roti with Curd" },
      { day: "Wednesday", breakfast: "Onion Thalipeeth", lunch: "Home-Style Prawn Tawa Fry", snack: "Homemade Ragi Savoury Balls", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Thursday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Tindora Sesame Curry with Roti", snack: "Puffed Rice Chana Mixture", dinner: "Coconut Sevai with Peanuts" },
      { day: "Friday", breakfast: "Methi Handvo", lunch: "Green Gram Masala with Roti", snack: "Papaya Coconut Bowl", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Saturday", breakfast: "Dudhi Muthia", lunch: "Chayote Moong Curry with Rice", snack: "Sattu Buttermilk", dinner: "Jowar Muthia with Dal" },
      { day: "Sunday", breakfast: "Vegetable Paniyaram", lunch: "Coastal Chicken Lemon Fry", snack: "Roasted Bengal Gram with Onion", dinner: "Sattu Curry with Phulka" }
    ]
  },
  // Age 73 | overweight | plan3
  {
    age: 73, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Methi Adai", lunch: "Carrot Peas Masala with Rice", snack: "Papaya Peanut Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Tuesday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Cauliflower Methi Curry with Roti", snack: "Peanut Chikki", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Chana Dal Roti", lunch: "Coastal Chicken Coriander Ginger Roast", snack: "Roasted Corn Peanut Mix", dinner: "Bharli Vangi with Bhakri" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Moong Dal with Carrot", snack: "Homemade Murmura Chaat", dinner: "Beetroot Roti with Curd" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Green Gram Masala with Rice", snack: "Sattu Jaggery Ladoo", dinner: "White Pea Curry with Phulka" },
      { day: "Saturday", breakfast: "Jowar Malt with Milk", lunch: "Brinjal Peanut Curry with Rice", snack: "Boiled Groundnut Salad", dinner: "Ragi Rotti with Curd" },
      { day: "Sunday", breakfast: "Guava Curd Bowl", lunch: "Home-Style Prawn Coriander Lemon Fry", snack: "Corn Peanut Sundal", dinner: "Bajra Rotti with Dal" }
    ]
  },
  // Age 73 | overweight | plan4
  {
    age: 73, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Drumstick Leaves Adai", lunch: "Andhra Mudda Pappu with Rice", snack: "Roasted Rice Flake Mixture", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Ajwain Missi Roti", lunch: "Drumstick Leaves Dal with Roti", snack: "White Pea Chaat", dinner: "Sattu Roti with Dal" },
      { day: "Wednesday", breakfast: "Leftover Rice Paniyaram", lunch: "Light Fish Curry Leaf Fry", snack: "Banana Lassi", dinner: "Chana Dal Roti with Curd" },
      { day: "Thursday", breakfast: "Besan Dhokla", lunch: "Kala Vatana Usal with Roti", snack: "Bajra Puffed Grain Chaat", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Friday", breakfast: "Ragi Vegetable Pancake", lunch: "Methi Peas Curry with Roti", snack: "Coconut Jaggery Ladoo", dinner: "Lobia Curry with Roti" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Beerakaya Pappu with Rice", snack: "Ginger Buttermilk", dinner: "Jowar Kanji with Dal" },
      { day: "Sunday", breakfast: "Ragi Sevai Upma", lunch: "Spicy Prawn Ginger Fry", snack: "Papaya Lassi", dinner: "Ragi Thalipeeth with Dal" }
    ]
  },
  // Age 74 | underweight | plan1
  {
    age: 74, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Dudhi Muthia", lunch: "Black-Eyed Pea Curry with Roti", snack: "Curd Roasted Chana Bowl", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Tuesday", breakfast: "Palak Besan Cheela", lunch: "Chana Dal with Ridge Gourd", snack: "Coconut Jaggery Ladoo", dinner: "Ragi Kanji with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Light Prawn Coriander Fry", snack: "Jowar Puffed Grain Chaat", dinner: "Ragi Ambli with Roti" },
      { day: "Thursday", breakfast: "Vegetable Thalipeeth", lunch: "Raw Mango Dal with Rice", snack: "Homemade Jowar Savoury Balls", dinner: "Sattu Roti with Dal" },
      { day: "Friday", breakfast: "Sattu Cheela", lunch: "Broad Beans Masala with Rice", snack: "Homemade Popcorn with Peanuts", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Saturday", breakfast: "Green Peas Roti", lunch: "Green Gram Masala with Roti", snack: "Murmura Peanut Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Sunday", breakfast: "Methi Missi Roti", lunch: "Spicy Chicken Konkan Fry", snack: "Peanut Sundal", dinner: "Cabbage Chana Dal Curry with Roti" }
    ]
  },
  // Age 74 | underweight | plan2
  {
    age: 74, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Moong Dal Paniyaram", lunch: "Masoor Dal with Dill Leaves", snack: "Plain Homemade Lassi", dinner: "Moong Dal Dhokla with Chutney" },
      { day: "Tuesday", breakfast: "Vegetable Rice Sevai", lunch: "Cowpea Masala with Roti", snack: "Homemade Banana Shake", dinner: "Lemon Sevai with Peanuts" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "Coastal Chicken Curry Leaf Fry", snack: "Roasted Green Gram", dinner: "Methi Akki Rotti" },
      { day: "Thursday", breakfast: "Green Peas Muthia", lunch: "Drumstick Leaves Curry with Rice", snack: "Sattu Jaggery Balls", dinner: "Sattu Cheela with Curd" },
      { day: "Friday", breakfast: "Ragi Rotti with Chutney", lunch: "Stuffed Brinjal with Rice", snack: "Papaya Lassi", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Lemon Sevai with Peanuts", lunch: "Yam Masala with Roti", snack: "Puffed Rice Chikki", dinner: "Rava Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Home-Style Chicken Ginger Coriander Roast", snack: "Green Gram Chaat", dinner: "Sattu Vegetable Roti with Curd" }
    ]
  },
  // Age 74 | underweight | plan3
  {
    age: 74, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Thalipeeth", lunch: "Potato Beans Curry with Roti", snack: "Mint Buttermilk", dinner: "Moong Dal Roti with Vegetable Curry" },
      { day: "Tuesday", breakfast: "Banana Ragi Pancake", lunch: "Lobia Curry with Rice", snack: "Dry Roasted Corn", dinner: "Green Peas Usal with Chapati" },
      { day: "Wednesday", breakfast: "Rava Paniyaram", lunch: "Light Chicken Sukka", snack: "Boiled Chana Chaat with Onion", dinner: "White Pea Curry with Phulka" },
      { day: "Thursday", breakfast: "Moong Dal Handvo", lunch: "Cauliflower Peas Masala with Rice", snack: "Banana Jaggery Milk", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Methi Akki Rotti", lunch: "Masoor Dal with Methi", snack: "Roasted Black Chana with Lemon", dinner: "Onion Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Methi Thalipeeth", lunch: "Beetroot Masala with Roti", snack: "Ginger Buttermilk", dinner: "Akki Rotti with Curd" },
      { day: "Sunday", breakfast: "Palak Dhokla", lunch: "Chicken Dry Lemon Roast", snack: "Ragi Jaggery Ladoo", dinner: "Stuffed Brinjal with Roti" }
    ]
  },
  // Age 74 | underweight | plan4
  {
    age: 74, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rice Flour Vegetable Pancake", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Tuesday", breakfast: "Vegetable Paniyaram", lunch: "Yam Pepper Curry with Rice", snack: "Boiled Corn with Lemon", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Wednesday", breakfast: "Vegetable Handvo", lunch: "Traditional Chicken Dry Pepper Roast", snack: "Papaya Peanut Chaat", dinner: "Stuffed Tindora with Roti" },
      { day: "Thursday", breakfast: "Ragi Ambli with Jaggery", lunch: "Cabbage Moong Curry with Roti", snack: "Curd Cucumber Peanut Bowl", dinner: "Green Peas Muthia with Curd" },
      { day: "Friday", breakfast: "Sattu Vegetable Pancake", lunch: "Gongura Pappu with Rice", snack: "Black Chana Sundal", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Saturday", breakfast: "Bajra Thalipeeth", lunch: "Tindora Sesame Curry with Roti", snack: "Homemade Peanut Bar", dinner: "Onion Adai with Chutney" },
      { day: "Sunday", breakfast: "Ragi Kozhukattai", lunch: "Prawn Mustard Curry", snack: "Roasted Sweet Corn", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 74 | normal | plan1
  {
    age: 74, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Leftover Rice Paniyaram", lunch: "Sweet Potato Peas Curry with Roti", snack: "Sesame Jaggery Ladoo", dinner: "Ragi Dhokla with Curd" },
      { day: "Tuesday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Methi Corn Curry with Rice", snack: "Papaya Coconut Bowl", dinner: "Moong Dal Handvo" },
      { day: "Wednesday", breakfast: "Carrot Besan Cheela", lunch: "Light Prawn Jeera Fry", snack: "Banana Lassi", dinner: "Vegetable Handvo with Curd" },
      { day: "Thursday", breakfast: "Beetroot Roti with Curd", lunch: "Chayote Dal Curry with Roti", snack: "Sattu Jaggery Ladoo", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Friday", breakfast: "Onion Besan Cheela", lunch: "Andhra Mudda Pappu with Rice", snack: "Banana Ragi Balls", dinner: "Palak Dhokla with Chutney" },
      { day: "Saturday", breakfast: "Millet Vegetable Pancake", lunch: "Brinjal Peanut Curry with Rice", snack: "Cucumber Roasted Chana Chaat", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Coastal Prawn Andhra Pepper Fry", snack: "Ragi Buttermilk", dinner: "Palak Missi Roti with Curd" }
    ]
  },
  // Age 74 | normal | plan2
  {
    age: 74, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Drumstick Leaves Adai", lunch: "Moong Dal with Carrot", snack: "Raw Banana Chaat", dinner: "Dudhi Muthia with Curd" },
      { day: "Tuesday", breakfast: "Carrot Muthia", lunch: "Green Gram Masala with Rice", snack: "Homemade Poha Chivda", dinner: "Carrot Roti with Dal" },
      { day: "Wednesday", breakfast: "Boiled Yam with Curd", lunch: "Traditional Chicken Dry Sesame Roast", snack: "Banana Ragi Shake", dinner: "Chana Usal with Bhakri" },
      { day: "Thursday", breakfast: "Masoor Dal Cheela", lunch: "Kala Vatana Usal with Rice", snack: "Roasted Mung Beans", dinner: "Stuffed Bhindi with Roti" },
      { day: "Friday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Beerakaya Pappu with Rice", snack: "White Pea Chaat", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Saturday", breakfast: "Ragi Thalipeeth", lunch: "Dal with Fenugreek Leaves", snack: "Jowar Chikki", dinner: "Rice Kanji with Dal" },
      { day: "Sunday", breakfast: "Onion Paniyaram", lunch: "Coastal Chicken Tawa Lemon Fry", snack: "Roasted Peanut Jaggery Mix", dinner: "Broad Beans Dal Curry with Phulka" }
    ]
  },
  // Age 74 | normal | plan3
  {
    age: 74, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Jowar Kanji with Curd", lunch: "Dosakaya Pappu with Rice", snack: "Ragi Peanut Ladoo", dinner: "Ragi Malt with Roti and Dal" },
      { day: "Tuesday", breakfast: "Methi Besan Cheela", lunch: "Sattu Curry with Roti", snack: "Curry Leaf Buttermilk", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Wednesday", breakfast: "Sweet Potato Roti", lunch: "Light Chicken Tamarind Fry", snack: "Lobia Chaat", dinner: "Beetroot Roti with Curd" },
      { day: "Thursday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Stuffed Brinjal with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Sattu Curry with Phulka" },
      { day: "Friday", breakfast: "Banana Curd Bowl with Jaggery", lunch: "Green Peas Usal with Roti", snack: "Banana Sattu Shake", dinner: "Mixed Dal Adai with Curd" },
      { day: "Saturday", breakfast: "Aval Upma with Peanuts", lunch: "Stuffed Tindora with Roti", snack: "Curd Peanut Bowl", dinner: "Chana Dal Cheela with Chutney" },
      { day: "Sunday", breakfast: "Jowar Vegetable Pancake", lunch: "Traditional Chicken Dry Curry Leaf Roast", snack: "Black-Eyed Pea Sundal", dinner: "Bottle Gourd Handvo with Curd" }
    ]
  },
  // Age 74 | normal | plan4
  {
    age: 74, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Carrot Peas Masala with Rice", snack: "Ragi Banana Balls", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Moong Dal with Sweet Potato", snack: "Poha Jaggery Ladoo", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Home-Style Fish Tamarind Curry", snack: "Bajra Malt Drink", dinner: "Bajra Rotti with Dal" },
      { day: "Thursday", breakfast: "Vegetable Adai", lunch: "White Peas Masala with Roti", snack: "Guava Peanut Chaat", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Friday", breakfast: "Palak Missi Roti", lunch: "Toor Dal with Raw Banana", snack: "Black Chana Chaat with Lemon", dinner: "Jowar Rotti with Dal" },
      { day: "Saturday", breakfast: "Bajra Ambli", lunch: "Carrot Moong Curry with Roti", snack: "Homemade Corn Chivda", dinner: "Jowar Muthia with Dal" },
      { day: "Sunday", breakfast: "Urad Dal Cheela", lunch: "Traditional Chicken Jeera Pepper Fry", snack: "Peanut Jaggery Ladoo", dinner: "Rice Sevai Vegetable Bowl" }
    ]
  },
  // Age 74 | overweight | plan1
  {
    age: 74, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Moong Dal Roti", lunch: "Sweet Potato Peas Curry with Rice", snack: "Roasted Gram Balls", dinner: "Bharli Vangi with Bhakri" },
      { day: "Tuesday", breakfast: "Ragi Vegetable Roti", lunch: "Kala Vatana Usal with Roti", snack: "Jowar Malt Drink", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Wednesday", breakfast: "Jowar Muthia", lunch: "Coastal Prawn Lemon Pepper Fry", snack: "Corn Peanut Sundal", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Thursday", breakfast: "Cabbage Besan Cheela", lunch: "Peas Potato Curry with Roti", snack: "Murmura Black Chana Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Chana Dal with Spinach", snack: "Guava Jaggery Bowl", dinner: "Bajra Ambli with Curd" },
      { day: "Saturday", breakfast: "Jowar Methi Roti", lunch: "White Peas Curry with Rice", snack: "Curd Banana Jaggery Bowl", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Sunday", breakfast: "Ragi Sevai Upma", lunch: "Coastal Chicken Dry Sesame Roast", snack: "Beetroot Peanut Chaat", dinner: "Chana Dal Roti with Curd" }
    ]
  },
  // Age 74 | overweight | plan2
  {
    age: 74, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Jowar Malt with Milk", lunch: "Sattu Curry with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Yam Pepper Curry with Roti" },
      { day: "Tuesday", breakfast: "Onion Thalipeeth", lunch: "Cabbage Carrot Curry with Rice", snack: "Roasted Chana Ladoo", dinner: "Beetroot Masala with Roti" },
      { day: "Wednesday", breakfast: "Bajra Malt with Jaggery", lunch: "Spicy Chicken Tawa Pepper Roast", snack: "Horse Gram Sundal", dinner: "Aval Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Chana Dal Cheela", lunch: "Spinach Corn Curry with Rice", snack: "Banana Jaggery Bowl", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Friday", breakfast: "Moong Dal Dhokla", lunch: "Brinjal Dal Curry with Roti", snack: "Jaggery Ragi Milk", dinner: "Ragi Rotti with Curd" },
      { day: "Saturday", breakfast: "Radish Roti with Curd", lunch: "Stuffed Bhindi with Roti", snack: "Roasted Cowpeas", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Sunday", breakfast: "Bajra Rotti with Curd", lunch: "Home-Style Fish Coriander Fry", snack: "Roasted Bengal Gram with Onion", dinner: "Methi Missi Roti with Dal" }
    ]
  },
  // Age 74 | overweight | plan3
  {
    age: 74, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Mixed Dal Adai", lunch: "Lobia Curry with Roti", snack: "Peanut Chikki", dinner: "Chayote Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Ragi Dhokla", lunch: "Dal with Amaranth Leaves", snack: "Roasted Peanuts with Curry Leaves", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Wednesday", breakfast: "Carrot Roti with Curd", lunch: "Traditional Chicken Tawa Pepper Roast", snack: "Boiled Peanut Chaat", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Thursday", breakfast: "Sattu Vegetable Roti", lunch: "Moong Dal with Spinach", snack: "Rice Kanji Drink", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Friday", breakfast: "Ajwain Missi Roti", lunch: "Brinjal Coconut Curry with Rice", snack: "Sweet Potato Peanut Chaat", dinner: "Jowar Thalipeeth with Dal" },
      { day: "Saturday", breakfast: "Ragi Malt with Jaggery", lunch: "Cluster Beans Dal Curry with Roti", snack: "Boiled Groundnut Salad", dinner: "Matki Usal with Bhakri" },
      { day: "Sunday", breakfast: "Jowar Ambli", lunch: "Traditional Chicken Mustard Fry", snack: "Sesame Chikki", dinner: "Vegetable Adai with Curd" }
    ]
  },
  // Age 74 | overweight | plan4
  {
    age: 74, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Onion Missi Roti", lunch: "Amaranth Dal with Roti", snack: "Cowpea Chaat", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Banana with Roasted Peanuts", lunch: "Bharli Vangi with Bhakri", snack: "Roasted Rice Flake Mixture", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Banana Jowar Pancake", lunch: "Coastal Chicken Tawa Pepper Roast", snack: "Peanut Poha Chivda", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Thursday", breakfast: "Boiled Tapioca with Coconut Chutney", lunch: "Raw Banana Masala with Rice", snack: "Ragi Peanut Chikki", dinner: "Urad Dal Cheela with Curd" },
      { day: "Friday", breakfast: "Vegetable Muthia", lunch: "Potato Peas Curry with Rice", snack: "Carrot Peanut Chaat", dinner: "Methi Muthia with Dal" },
      { day: "Saturday", breakfast: "Papaya Curd Bowl", lunch: "Chayote Moong Curry with Rice", snack: "Roasted Chana Jaggery Mix", dinner: "Sweet Potato Roti with Curd" },
      { day: "Sunday", breakfast: "Mixed Dal Cheela", lunch: "Home-Style Chicken Dry Jeera Roast", snack: "Puffed Rice Peanut Mixture", dinner: "Vegetable Muthia with Curd" }
    ]
  },
  // Age 75 | underweight | plan1
  {
    age: 75, category: "underweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Moong Dal Roti", lunch: "Stuffed Bhindi with Roti", snack: "Jaggery Lassi", dinner: "Ajwain Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Rava Kichadi with Peanuts", lunch: "Tindora Peanut Curry with Rice", snack: "Peanut Chikki", dinner: "Rice Kanji with Dal" },
      { day: "Wednesday", breakfast: "Millet Vegetable Pancake", lunch: "Light Fish Curry Leaf Roast", snack: "Papaya Coconut Bowl", dinner: "Methi Akki Rotti" },
      { day: "Thursday", breakfast: "Methi Muthia", lunch: "Masoor Dal with Methi", snack: "Curd Cucumber Peanut Bowl", dinner: "Palak Missi Roti with Curd" },
      { day: "Friday", breakfast: "Sweet Potato with Curd and Peanuts", lunch: "Cauliflower Methi Curry with Roti", snack: "Ragi Jaggery Ladoo", dinner: "Tindora Sesame Curry with Roti" },
      { day: "Saturday", breakfast: "Bajra Thalipeeth", lunch: "Sattu Curry with Roti", snack: "Boiled Peanut Chaat", dinner: "Green Peas Muthia with Curd" },
      { day: "Sunday", breakfast: "Dudhi Muthia", lunch: "Spicy Chicken Coriander Lemon Fry", snack: "White Peas Sundal", dinner: "Ragi Rotti with Curd" }
    ]
  },
  // Age 75 | underweight | plan2
  {
    age: 75, category: "underweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Ragi Paniyaram", lunch: "Raw Banana Masala with Rice", snack: "Ragi Peanut Ladoo", dinner: "Cabbage Chana Dal Curry with Roti" },
      { day: "Tuesday", breakfast: "Vegetable Paniyaram", lunch: "Cabbage Carrot Curry with Rice", snack: "Sweet Potato Sesame Balls", dinner: "Bajra Thalipeeth with Curd" },
      { day: "Wednesday", breakfast: "Ragi Banana Malt", lunch: "Light Chicken Gongura Roast", snack: "Roasted Corn Peanut Mix", dinner: "Sattu Roti with Dal" },
      { day: "Thursday", breakfast: "Ragi Malt with Jaggery", lunch: "Stuffed Brinjal with Roti", snack: "Roasted Chana Ladoo", dinner: "Bajra Ambli with Curd" },
      { day: "Friday", breakfast: "Jowar Vegetable Pancake", lunch: "Tindora Sesame Curry with Roti", snack: "Cowpea Chaat", dinner: "Bottle Gourd Handvo with Curd" },
      { day: "Saturday", breakfast: "Khaman Dhokla", lunch: "Potato Beans Curry with Roti", snack: "Homemade Poha Chivda", dinner: "Carrot Roti with Dal" },
      { day: "Sunday", breakfast: "Sweet Potato Roti", lunch: "Coastal Prawn Coconut Garlic Curry", snack: "Roasted Chana Chikki", dinner: "Moong Dal Handvo" }
    ]
  },
  // Age 75 | underweight | plan3
  {
    age: 75, category: "underweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Peanut Banana Bowl", lunch: "Sprouted Moong Curry with Roti", snack: "Homemade Banana Shake", dinner: "Vegetable Thalipeeth with Curd" },
      { day: "Tuesday", breakfast: "Onion Thalipeeth", lunch: "Sweet Potato Peas Curry with Rice", snack: "Papaya Lassi", dinner: "Mixed Dal Cheela with Curd" },
      { day: "Wednesday", breakfast: "Aval Upma with Peanuts", lunch: "Light Chicken Tawa Garlic Fry", snack: "Roasted Rice Flake Mixture", dinner: "Green Peas Roti with Curd" },
      { day: "Thursday", breakfast: "Palak Dhokla", lunch: "Black-Eyed Pea Curry with Roti", snack: "Sattu Jaggery Balls", dinner: "Radish Roti with Dal" },
      { day: "Friday", breakfast: "Moong Dal Handvo", lunch: "Gongura Pappu with Rice", snack: "Green Gram Chaat", dinner: "Green Gram Curry with Jowar Roti" },
      { day: "Saturday", breakfast: "Carrot Muthia", lunch: "Drumstick Leaves Curry with Rice", snack: "Raw Banana Chaat", dinner: "Besan Dhokla with Curd" },
      { day: "Sunday", breakfast: "Vegetable Adai", lunch: "Traditional Fish Mangalorean Curry", snack: "Black Chana Chaat with Lemon", dinner: "Moong Dal Roti with Vegetable Curry" }
    ]
  },
  // Age 75 | underweight | plan4
  {
    age: 75, category: "underweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Ajwain Missi Roti", lunch: "Lobia Curry with Rice", snack: "Ragi Peanut Chikki", dinner: "Methi Missi Roti with Dal" },
      { day: "Tuesday", breakfast: "Onion Besan Cheela", lunch: "Moong Dal with Sweet Potato", snack: "Papaya Peanut Chaat", dinner: "Carrot Besan Cheela with Chutney" },
      { day: "Wednesday", breakfast: "Vegetable Rice Sevai", lunch: "Fish Green Masala Fry", snack: "Banana Sesame Chaat", dinner: "Aval Vegetable Kichadi" },
      { day: "Thursday", breakfast: "Onion Missi Roti", lunch: "Beetroot Coconut Curry with Rice", snack: "Cowpea Sundal", dinner: "Methi Besan Cheela with Curd" },
      { day: "Friday", breakfast: "Jowar Malt with Milk", lunch: "Dal with Carrot and Beans", snack: "Homemade Murmura Chaat", dinner: "Sattu Curry with Phulka" },
      { day: "Saturday", breakfast: "Carrot Besan Cheela", lunch: "Raw Banana Masala with Roti", snack: "Banana Ragi Shake", dinner: "Vegetable Sevai with Chana Dal" },
      { day: "Sunday", breakfast: "Vegetable Rice Kozhukattai", lunch: "Traditional Prawn Tamarind Curry", snack: "Corn Peanut Sundal", dinner: "Cauliflower Methi Curry with Phulka" }
    ]
  },
  // Age 75 | normal | plan1
  {
    age: 75, category: "normal", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Besan Dhokla", lunch: "Gujarati Dal with Rice", snack: "Seasonal Fruit Roasted Chana Bowl", dinner: "Ammini Kozhukattai with Vegetables" },
      { day: "Tuesday", breakfast: "Ragi Ambli with Jaggery", lunch: "Green Peas Usal with Roti", snack: "Jowar Chikki", dinner: "Methi Adai with Curd" },
      { day: "Wednesday", breakfast: "Vegetable Thalipeeth", lunch: "Chicken Jeera Pepper Fry", snack: "Curd Sweet Potato Bowl", dinner: "Carrot Muthia with Dal" },
      { day: "Thursday", breakfast: "Banana Jowar Pancake", lunch: "White Peas Curry with Rice", snack: "Sesame Chikki", dinner: "Ragi Dhokla with Curd" },
      { day: "Friday", breakfast: "Vegetable Handvo", lunch: "Stuffed Tindora with Roti", snack: "Puffed Rice Chikki", dinner: "Cowpea Curry with Ragi Roti" },
      { day: "Saturday", breakfast: "Ragi Thalipeeth", lunch: "Drumstick Leaves Dal with Roti", snack: "Banana Sattu Shake", dinner: "Urad Dal Cheela with Curd" },
      { day: "Sunday", breakfast: "Tomato-Free Vegetable Adai", lunch: "Coastal Chicken Pepper Roast", snack: "Horse Gram Sundal", dinner: "Matki Usal with Bhakri" }
    ]
  },
  // Age 75 | normal | plan2
  {
    age: 75, category: "normal", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Onion Paniyaram", lunch: "Cluster Beans Peanut Curry with Rice", snack: "Peanut Poha Chivda", dinner: "Beetroot Masala with Roti" },
      { day: "Tuesday", breakfast: "Green Peas Muthia", lunch: "Dill Leaves Curry with Roti", snack: "Peanut Sundal", dinner: "Khaman Dhokla with Curd" },
      { day: "Wednesday", breakfast: "Bajra Malt with Jaggery", lunch: "Spicy Chicken Red Chilli Fry", snack: "Puffed Rice Peanut Mixture", dinner: "Sweet Potato Roti with Curd" },
      { day: "Thursday", breakfast: "Jowar Muthia", lunch: "Sprouted Moong Curry with Rice", snack: "Coconut Jaggery Ladoo", dinner: "Akki Rotti with Curd" },
      { day: "Friday", breakfast: "Masoor Dal Cheela", lunch: "Toor Dal with Raw Banana", snack: "Roasted Peanuts with Curry Leaves", dinner: "Vegetable Rice Kozhukattai" },
      { day: "Saturday", breakfast: "Urad Dal Cheela", lunch: "Cowpea Curry with Rice", snack: "Puffed Rice Chana Mixture", dinner: "Rava Vegetable Kichadi" },
      { day: "Sunday", breakfast: "Beetroot Roti with Curd", lunch: "Chicken Lemon Fry", snack: "Banana Ragi Balls", dinner: "Jowar Rotti with Dal" }
    ]
  },
  // Age 75 | normal | plan3
  {
    age: 75, category: "normal", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Bajra Rotti with Curd", lunch: "Chayote Moong Curry with Rice", snack: "Boiled Yam Chaat", dinner: "Sattu Cheela with Curd" },
      { day: "Tuesday", breakfast: "Rice Kanji with Curd", lunch: "Spinach Corn Curry with Rice", snack: "Homemade Ragi Savoury Balls", dinner: "Palak Dhokla with Chutney" },
      { day: "Wednesday", breakfast: "Boiled Yam with Curd", lunch: "Coastal Chicken Coriander Pepper Fry", snack: "Roasted Mung Beans", dinner: "Onion Adai with Chutney" },
      { day: "Thursday", breakfast: "Radish Roti with Curd", lunch: "Sweet Potato Peas Curry with Roti", snack: "Murmura Black Chana Chaat", dinner: "Cabbage Besan Cheela with Chutney" },
      { day: "Friday", breakfast: "Chana Dal Cheela", lunch: "Brinjal Dal Curry with Roti", snack: "Ragi Puffed Grain Chaat", dinner: "Jowar Malt with Vegetable Curry" },
      { day: "Saturday", breakfast: "Jowar Rotti with Onion Chutney", lunch: "Chayote Dal Curry with Roti", snack: "Murmura Peanut Chaat", dinner: "Millet Vegetable Pancake with Curd" },
      { day: "Sunday", breakfast: "Papaya Curd Bowl", lunch: "Light Chicken Methi Fry", snack: "Lobia Chaat", dinner: "Palak Besan Cheela with Curd" }
    ]
  },
  // Age 75 | normal | plan4
  {
    age: 75, category: "normal", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Rava Paniyaram", lunch: "Broad Beans Masala with Rice", snack: "Carrot Peanut Chaat", dinner: "Sweet Potato Peas Curry with Phulka" },
      { day: "Tuesday", breakfast: "Vegetable Muthia", lunch: "Beerakaya Pappu with Rice", snack: "Roasted Green Gram", dinner: "Drumstick Leaves Dal with Roti" },
      { day: "Wednesday", breakfast: "Ragi Kozhukattai", lunch: "Traditional Chicken Sesame Fry", snack: "Jowar Puffed Grain Chaat", dinner: "Chana Dal Roti with Curd" },
      { day: "Thursday", breakfast: "Methi Thalipeeth", lunch: "Carrot Chana Curry with Rice", snack: "Bajra Puffed Grain Chaat", dinner: "Rice Sevai Vegetable Bowl" },
      { day: "Friday", breakfast: "Ragi Kanji with Buttermilk", lunch: "Dal with Fenugreek Leaves", snack: "Boiled Groundnut Salad", dinner: "Chana Usal with Bhakri" },
      { day: "Saturday", breakfast: "Methi Besan Cheela", lunch: "Matki Usal with Bhakri", snack: "Sweet Potato Peanut Chaat", dinner: "Yam Pepper Curry with Roti" },
      { day: "Sunday", breakfast: "Ragi Vegetable Roti", lunch: "Traditional Chicken Malabar Fry", snack: "Rice Kanji Drink", dinner: "Vegetable Adai with Curd" }
    ]
  },
  // Age 75 | overweight | plan1
  {
    age: 75, category: "overweight", plan: "plan1",
    days: [
      { day: "Monday", breakfast: "Seasonal Fruit with Roasted Chana", lunch: "Chana Dal with Ridge Gourd", snack: "Roasted Bengal Gram with Onion", dinner: "Bajra Rotti with Dal" },
      { day: "Tuesday", breakfast: "Green Peas Roti", lunch: "Carrot Moong Curry with Roti", snack: "Boiled Corn with Lemon", dinner: "Vegetable Handvo with Curd" },
      { day: "Wednesday", breakfast: "Palak Besan Cheela", lunch: "Coastal Fish Pepper Roast", snack: "Murmura Onion Chaat", dinner: "Masoor Dal Cheela with Chutney" },
      { day: "Thursday", breakfast: "Carrot Roti with Curd", lunch: "Methi Peas Curry with Roti", snack: "Cucumber Roasted Chana Chaat", dinner: "Kala Vatana Usal with Roti" },
      { day: "Friday", breakfast: "Drumstick Leaves Adai", lunch: "Moong Dal with Carrot", snack: "Poha Jaggery Ladoo", dinner: "Bharli Vangi with Bhakri" },
      { day: "Saturday", breakfast: "Bajra Methi Roti", lunch: "Dill Leaves Dal with Rice", snack: "Roasted Cowpeas", dinner: "Onion Thalipeeth with Curd" },
      { day: "Sunday", breakfast: "Methi Akki Rotti", lunch: "Home-Style Chicken Coriander Fry", snack: "Sattu Buttermilk", dinner: "Dudhi Muthia with Curd" }
    ]
  },
  // Age 75 | overweight | plan2
  {
    age: 75, category: "overweight", plan: "plan2",
    days: [
      { day: "Monday", breakfast: "Chana Dal Roti", lunch: "Black-Eyed Pea Curry with Rice", snack: "Sattu Jaggery Ladoo", dinner: "Chayote Moong Curry with Roti" },
      { day: "Tuesday", breakfast: "Moong Dal Dhokla", lunch: "Cauliflower Dal Curry with Roti", snack: "Dry Roasted Corn", dinner: "Ragi Kozhukattai with Chutney" },
      { day: "Wednesday", breakfast: "Lemon Sevai with Peanuts", lunch: "Prawn Mustard Curry", snack: "Homemade Peanut Bar", dinner: "Tindora Peanut Curry with Roti" },
      { day: "Thursday", breakfast: "Banana with Roasted Peanuts", lunch: "Carrot Peas Masala with Rice", snack: "Homemade Corn Chivda", dinner: "Black-Eyed Pea Curry with Roti" },
      { day: "Friday", breakfast: "Coconut Sevai with Dal Chutney", lunch: "Cluster Beans Dal Curry with Roti", snack: "Mint Buttermilk", dinner: "Ragi Vegetable Pancake with Curd" },
      { day: "Saturday", breakfast: "Methi Missi Roti", lunch: "Spinach Chana Curry with Roti", snack: "Homemade Popcorn with Peanuts", dinner: "Onion Besan Cheela with Curd" },
      { day: "Sunday", breakfast: "Bottle Gourd Handvo", lunch: "Fish Ginger Garlic Fry", snack: "Jaggery Ragi Milk", dinner: "Lemon Sevai with Peanuts" }
    ]
  },
  // Age 75 | overweight | plan3
  {
    age: 75, category: "overweight", plan: "plan3",
    days: [
      { day: "Monday", breakfast: "Akki Rotti with Onion Chutney", lunch: "Sattu Curry with Rice", snack: "Curd Roasted Chana Bowl", dinner: "Stuffed Tindora with Roti" },
      { day: "Tuesday", breakfast: "Ragi Rotti with Chutney", lunch: "Broad Beans Dal Curry with Rice", snack: "Peanut Jaggery Ladoo", dinner: "Broad Beans Dal Curry with Phulka" },
      { day: "Wednesday", breakfast: "Methi Handvo", lunch: "Home-Style Prawn Lemon Fry", snack: "Boiled Chana Chaat with Onion", dinner: "Jowar Vegetable Pancake with Chutney" },
      { day: "Thursday", breakfast: "Methi Adai", lunch: "Chana Dal with Spinach", snack: "Roasted Sweet Corn", dinner: "Jowar Muthia with Dal" },
      { day: "Friday", breakfast: "Jowar Thalipeeth", lunch: "Cabbage Moong Curry with Roti", snack: "Black Chana Sundal", dinner: "Carrot Peas Masala with Phulka" },
      { day: "Saturday", breakfast: "Ammini Kozhukattai", lunch: "Cowpea Masala with Roti", snack: "Roasted Peanut Jaggery Mix", dinner: "Jowar Kanji with Dal" },
      { day: "Sunday", breakfast: "Sattu Vegetable Pancake", lunch: "Chicken Gongura Roast", snack: "Bajra Malt Drink", dinner: "Chana Dal Cheela with Chutney" }
    ]
  },
  // Age 75 | overweight | plan4
  {
    age: 75, category: "overweight", plan: "plan4",
    days: [
      { day: "Monday", breakfast: "Palak Missi Roti", lunch: "Chana Usal with Bhakri", snack: "Curry Leaf Buttermilk", dinner: "Raw Banana Masala with Phulka" },
      { day: "Tuesday", breakfast: "Guava Curd Bowl", lunch: "Carrot Peas Masala with Roti", snack: "Banana Lassi", dinner: "Jowar Ambli with Roti" },
      { day: "Wednesday", breakfast: "Jowar Kanji with Curd", lunch: "Coastal Chicken Chettinad Fry", snack: "Curd Peanut Bowl", dinner: "Sprouted Moong Curry with Roti" },
      { day: "Thursday", breakfast: "Ragi Dhokla", lunch: "Stuffed Brinjal with Rice", snack: "Banana Jaggery Bowl", dinner: "Ragi Thalipeeth with Dal" },
      { day: "Friday", breakfast: "Banana Ragi Pancake", lunch: "Andhra Mudda Pappu with Rice", snack: "Green Gram Sundal", dinner: "Ragi Sevai Vegetable Bowl" },
      { day: "Saturday", breakfast: "Ragi Vegetable Pancake", lunch: "Cabbage Chana Dal Curry with Rice", snack: "Guava Peanut Chaat", dinner: "Vegetable Muthia with Curd" },
      { day: "Sunday", breakfast: "Ragi Sevai Upma", lunch: "Coastal Prawn Jeera Fry", snack: "Plain Homemade Lassi", dinner: "Ragi Kanji with Vegetable Curry" }
    ]
  },
];
async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Database connected for seeding...');

    // Convert the current format:
    // { age, category, plan, days }
    //
    // into the format required by dietplanModel.js:
    // {
    //   age,
    //   categories: {
    //     underweight: { plan1: { days: [...] } },
    //     normal: { plan1: { days: [...] } },
    //     overweight: { plan1: { days: [...] } }
    //   }
    // }

    const mergedDietPlans = Object.values(
      dietPlansData.reduce((acc, item) => {
        if (
          !item.age ||
          !item.category ||
          !item.plan ||
          !Array.isArray(item.days)
        ) {
          throw new Error(
            `Invalid diet data found: ${JSON.stringify(item).substring(0, 300)}`
          );
        }

        if (!acc[item.age]) {
          acc[item.age] = {
            age: item.age,
            categories: {
              underweight: {},
              normal: {},
              overweight: {}
            }
          };
        }

        if (!acc[item.age].categories[item.category]) {
          acc[item.age].categories[item.category] = {};
        }

        acc[item.age].categories[item.category][item.plan] = {
          days: item.days
        };

        return acc;
      }, {})
    );

    console.log(
      `Preparing ${mergedDietPlans.length} age-group documents...`
    );

    // Check that every age has all 3 required categories
    for (const plan of mergedDietPlans) {
      const missingCategories = [];

      if (
        !plan.categories.underweight ||
        Object.keys(plan.categories.underweight).length === 0
      ) {
        missingCategories.push('underweight');
      }

      if (
        !plan.categories.normal ||
        Object.keys(plan.categories.normal).length === 0
      ) {
        missingCategories.push('normal');
      }

      if (
        !plan.categories.overweight ||
        Object.keys(plan.categories.overweight).length === 0
      ) {
        missingCategories.push('overweight');
      }

      if (missingCategories.length > 0) {
        throw new Error(
          `Age ${plan.age} is missing category(s): ${missingCategories.join(', ')}`
        );
      }
    }

    console.log(
      'All age groups contain underweight, normal and overweight categories.'
    );

    // Delete old data only after validation succeeds
    await DietPlan.deleteMany({});

    console.log('Old diet plans cleared.');

    await DietPlan.insertMany(mergedDietPlans);

    console.log(
      `Successfully seeded ${mergedDietPlans.length} age-group documents into MongoDB Atlas!`
    );

    await mongoose.connection.close();

  } catch (err) {
    console.error('Error seeding data:', err);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedDB();
