import axios from 'axios';

export const generateMealPlan = async ({ preferences, allergies, age , gender , country, goal}) => {
  const prompt = `Generate a healthy and personalized daily meal plan for the following person:
  - Age: ${age}
  - Gender: ${gender}
  - Country: ${country}
  - Preferences: ${preferences.join(", ")}
  - Allergies: ${allergies.join(", ")}
  - Goal: ${goal}

  Output Format:
  - Use the following exact structure (no markdown or asterisks **):
  - Breakfast:
    List each food item as a new bullet starting with "•"
  - Lunch:
    Use "•" for each item on a new line
  - Snacks:
    Use "•" for each item on a new line
  - Dinner:
    Use "•" for each item on a new line

  After listing meals, provide a summary of total nutritional values for the entire day as:
  Summary of Total Nutritional Values:
  - Breakfast Calories: (numeric kcal)
  - Lunch Calories:
  - Snacks Calories:
  - Dinner Calories:
    please note give Total Calories as 2000 not 2000kcal similarly protein,carb and fats as eg.40 not 40 g
  - Total Calories: (numeric value)
  - Total Protein (g): 
  - Total Carbohydrates (g): 
  - Total Fats (g): 

  Ensure the meal plan is clean, realistic, balanced, culturally relevant to ${country}, and avoids any formatting characters like asterisks or markdown.`;


    const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,

    {
      contents: [{ parts: [{ text: prompt }] }],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
    );
  
  const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || "No Meal plan generated";
}