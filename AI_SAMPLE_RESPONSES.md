# AI Integration Sample JSON Responses

This document contains sample JSON responses for all AI integrations in the NutriByte API codebase. The AI uses the Langflow API for nutritional analysis and reporting.

## 1. Analysis Controller AI Responses

### 1.1 Period-Based Analysis Response
**Endpoint:** `POST /analysis/request`
**AI Function:** `generateAIAnalysis()`

#### Sample Request Payload:
```json
{
  "input_value": "Nutritional Analysis Request for week period:\n\nUser Profile:\n- Age: 28\n- Gender: Female\n- Weight: 65kg\n- Height: 1.65m\n- Activity Level: Moderate\n- Weight Goal: maintain\n- Health Conditions: None\n\nWeek Period Nutrient Totals:\n- Calories: 1250.50\n- Protein: 45.20g\n- Fat: 35.80g\n- Carbohydrates: 180.30g\n- Fiber: 22.50g\n- Sugar: 45.20g\n- Sodium: 2100.00mg\n- Calcium: 850.00mg\n- Iron: 12.50mg\n- Potassium: 2800.00mg\n- Vitamin C: 65.00mg\n\nMeals Consumed:\n- Mon Dec 16 2024: Jollof Rice, Grilled Chicken\n- Tue Dec 17 2024: Banku with Okro Soup\n- Wed Dec 18 2024: Fufu with Light Soup\n\nPlease provide a comprehensive nutritional analysis including:\n1. Analysis summary\n2. Recommendations for improvement\n3. Nutritional deficiencies detected\n4. Nutritional excesses detected\n5. Potential health risks\n6. Positive points about the diet\n\nRespond in JSON format with these fields: analysisSummary, recommendations, nutritionalDeficiencies, nutritionalExcesses, healthRisks, positivePoints.",
  "output_type": "chat",
  "input_type": "chat",
  "session_id": "user_123_1703123456789"
}
```

#### Expected AI Response Format:
```json
{
  "analysisSummary": "Your weekly nutritional intake shows a generally balanced diet with some areas for improvement. You're consuming adequate protein and fiber, but your calorie intake is below recommended levels for your activity level. Your sodium intake is within acceptable limits, and you're getting good amounts of potassium and vitamin C.",
  "recommendations": [
    "Increase your daily calorie intake by 200-300 calories to meet your energy needs",
    "Consider adding more healthy fats like avocados, nuts, and olive oil",
    "Include more calcium-rich foods like dairy products or fortified alternatives",
    "Try to reduce added sugar intake by choosing whole fruits over processed snacks",
    "Maintain your current protein and fiber intake levels"
  ],
  "nutritionalDeficiencies": [
    "Calories: You're consuming about 400 calories less than recommended for your activity level",
    "Calcium: Slightly below the recommended 1000mg daily intake",
    "Healthy Fats: Could benefit from more unsaturated fats in your diet"
  ],
  "nutritionalExcesses": [
    "Sugar: Your added sugar intake is slightly above the recommended 10% of daily calories"
  ],
  "healthRisks": [
    "Low calorie intake may lead to fatigue and difficulty maintaining energy levels",
    "Insufficient calcium intake could affect bone health over time"
  ],
  "positivePoints": [
    "Excellent protein intake relative to your body weight",
    "Good fiber consumption supporting digestive health",
    "Adequate potassium intake helping with blood pressure regulation",
    "Sufficient vitamin C supporting immune function",
    "Well-balanced meal timing throughout the week"
  ]
}
```

### 1.2 Daily Breakdown Analysis Response
**Endpoint:** `GET /analysis/daily-breakdown`
**AI Function:** `getAIAnalysis()`

#### Sample Request Payload:
```json
{
  "input_value": "Daily Nutritional Analysis Request:\n\nUser Profile:\n- Age: 28\n- Gender: Female\n- Weight: 65kg\n- Height: 1.65m\n- Activity Level: Moderate\n- Weight Goal: maintain\n- Health Conditions: None\n\nToday's Nutrient Intake:\n- Calories: 1850.75\n- Protein: 68.40g\n- Fat: 52.30g\n- Carbohydrates: 245.60g\n- Fiber: 28.90g\n- Sugar: 38.50g\n- Sodium: 1850.00mg\n- Calcium: 950.00mg\n- Iron: 15.20mg\n- Potassium: 3200.00mg\n- Vitamin C: 85.00mg\n\nPlease provide a comprehensive daily nutritional analysis including:\n1. Analysis summary\n2. Recommendations for improvement\n3. Nutritional deficiencies detected\n4. Nutritional excesses detected\n5. Potential health risks\n6. Positive points about the diet\n\nRespond in JSON format with these fields: analysisSummary, recommendations, nutritionalDeficiencies, nutritionalExcesses, healthRisks, positivePoints.",
  "output_type": "chat",
  "input_type": "chat",
  "session_id": "user_123_daily_1703123456789"
}
```

#### Expected AI Response Format:
```json
{
  "analysisSummary": "Today's nutritional intake is excellent and well-balanced! You've met most of your daily nutritional needs and are on track with your health goals. Your calorie intake is appropriate for your activity level, and you've achieved a good balance of macronutrients.",
  "recommendations": [
    "Maintain this level of nutritional balance in your daily routine",
    "Consider adding a small serving of nuts or seeds for additional healthy fats",
    "Keep up with your current hydration habits",
    "Continue with your current meal timing and portion control"
  ],
  "nutritionalDeficiencies": [],
  "nutritionalExcesses": [],
  "healthRisks": [],
  "positivePoints": [
    "Perfect calorie intake for your daily energy needs",
    "Excellent protein intake supporting muscle maintenance",
    "Great fiber consumption promoting digestive health",
    "Balanced macronutrient distribution (carbs: 53%, protein: 15%, fat: 32%)",
    "Adequate intake of all essential vitamins and minerals",
    "Good sodium levels within healthy limits",
    "Strong potassium intake supporting cardiovascular health"
  ]
}
```

## 2. Report Controller AI Responses

### 2.1 Comprehensive Report Analysis Response
**Endpoint:** `POST /reports/generate`
**AI Function:** `generateAIReportAnalysis()`

#### Sample Request Payload:
```json
{
  "input_value": "{\"reportType\":\"comprehensive_report\",\"period\":\"week\",\"userProfile\":{\"age\":28,\"gender\":\"Female\",\"weight\":65,\"height\":1.65,\"activenessLevel\":\"Moderate\",\"weightGoal\":\"maintain\",\"healthConditions\":[]},\"nutritionalData\":{\"currentNutrients\":{\"calories\":8750.25,\"protein\":315.60,\"fat\":245.80,\"carbs\":1260.40,\"fiber\":158.90,\"sugar\":245.60,\"sodium\":12950.00,\"calcium\":6650.00,\"iron\":89.50,\"potassium\":22400.00,\"vitaminC\":595.00},\"goalProgress\":{\"calorieGoal\":1750,\"recommendedNutrients\":{\"calories\":1750,\"protein\":52,\"fat\":48.6,\"carbs\":196.9,\"fiber\":25,\"sugar\":43.8,\"sodium\":2300,\"calcium\":1000,\"iron\":18,\"potassium\":3500,\"vitaminC\":75},\"progress\":{\"calories\":{\"current\":1250,\"recommended\":1750,\"percentage\":71,\"status\":\"Below Target\"},\"protein\":{\"current\":45.1,\"recommended\":52,\"percentage\":87,\"status\":\"On Track\"}}},\"trends\":{\"previousPeriod\":\"3days\",\"previousNutrients\":{\"calories\":3750.50,\"protein\":135.20,\"fat\":105.80,\"carbs\":540.30,\"fiber\":68.50,\"sugar\":105.20,\"sodium\":5550.00,\"calcium\":2850.00,\"iron\":38.50,\"potassium\":9600.00,\"vitaminC\":255.00},\"trends\":{\"calories\":{\"change\":133.33,\"trend\":\"Increasing\",\"direction\":\"up\"},\"protein\":{\"change\":133.33,\"trend\":\"Increasing\",\"direction\":\"up\"}}},\"mealPatterns\":{\"mostEatenMeal\":\"Jollof Rice\",\"leastEatenMeal\":\"Banku with Okro Soup\",\"mealCounts\":{\"Jollof Rice\":5,\"Grilled Chicken\":4,\"Fufu with Light Soup\":3,\"Banku with Okro Soup\":2,\"Red Red\":1}}},\"analysisRequirements\":[\"comprehensive_nutritional_assessment\",\"goal_progress_evaluation\",\"trend_analysis_insights\",\"personalized_recommendations\",\"health_condition_specific_advice\"]}",
  "output_type": "json",
  "input_type": "chat",
  "session_id": "user_123_report_1703123456789"
}
```

#### Expected AI Response Format:
```json
{
  "summary": "Your weekly nutritional report shows positive trends with increasing intake across most nutrients. While you're making good progress, there are opportunities to optimize your diet for better health outcomes and goal achievement.",
  "nutritionalAssessment": "Your overall nutritional profile is improving week-over-week. You've increased your calorie intake by 133% compared to the previous 3-day period, which is positive for your maintenance goals. Protein intake is strong at 87% of your target, and fiber consumption is excellent at 158.9g for the week. However, your daily calorie average of 1,250 is still below the recommended 1,750 for your activity level.",
  "goalProgressInsights": "You're making excellent progress toward your nutritional goals. Protein intake is on track at 87% of target, and fiber consumption exceeds recommendations. The main area for improvement is increasing daily calorie intake to meet your energy needs. Your sodium intake is well-managed, and you're getting adequate amounts of essential vitamins and minerals.",
  "trendInsights": "Your nutritional trends are very positive, showing significant increases in most nutrients compared to the previous period. Calorie intake increased by 133%, protein by 133%, and other nutrients show similar positive trends. This suggests you're successfully implementing dietary improvements and maintaining consistency in your meal planning.",
  "personalizedRecommendations": [
    "Gradually increase daily calorie intake by 200-300 calories to reach your target of 1,750 calories",
    "Continue with your current protein-rich meal choices as they're supporting your goals well",
    "Maintain your excellent fiber intake by continuing to include whole grains and vegetables",
    "Consider adding healthy fats like avocados, nuts, or olive oil to boost calorie intake healthily",
    "Diversify your meal choices to include more calcium-rich foods like dairy or fortified alternatives",
    "Keep up with your current meal timing and portion control habits"
  ],
  "healthConditionAdvice": [
    "Since you have no specific health conditions, focus on maintaining a balanced diet for overall wellness",
    "Your current fiber intake is excellent for digestive health and cholesterol management",
    "Consider regular exercise to complement your nutritional improvements",
    "Monitor your energy levels and adjust calorie intake based on activity and hunger cues"
  ],
  "actionItems": [
    "Plan meals to include 200-300 additional calories daily",
    "Add one serving of healthy fats to your daily routine",
    "Include calcium-rich foods in 2-3 meals per week",
    "Continue tracking your progress weekly",
    "Consider consulting with a nutritionist for personalized meal planning"
  ]
}
```

## 3. Error Handling and Fallback Responses

### 3.1 Analysis Fallback Response
When the AI service is unavailable or returns an error:

```json
{
  "analysisSummary": "Analysis completed with basic insights",
  "recommendations": [
    "Consider increasing protein intake if below recommended levels",
    "Monitor your daily calorie consumption",
    "Ensure adequate fiber intake for digestive health"
  ],
  "nutritionalDeficiencies": [],
  "nutritionalExcesses": [],
  "healthRisks": [],
  "positivePoints": []
}
```

### 3.2 Report Fallback Response
When the AI service is unavailable or returns an error:

```json
{
  "summary": "Comprehensive nutritional report analysis completed",
  "nutritionalAssessment": "Nutritional assessment completed with available data",
  "goalProgressInsights": "Goal progress evaluation completed",
  "trendInsights": "Trend analysis insights provided",
  "personalizedRecommendations": [
    "Continue monitoring your nutrition",
    "Stay hydrated throughout the day",
    "Maintain consistent meal timing",
    "Consider diversifying your meal choices",
    "Monitor portion sizes for better control"
  ],
  "healthConditionAdvice": [
    "Consult with healthcare provider for specific dietary needs",
    "Monitor any food sensitivities or allergies"
  ],
  "actionItems": [
    "Review your meal planning weekly",
    "Track progress against your goals",
    "Adjust portion sizes based on recommendations"
  ]
}
```

## 4. API Configuration

### 4.1 Langflow API Configuration
```javascript
const LANGFLOW_API_URL = 'https://api.langflow.astra.datastax.com/lf/38dccd86-de59-4001-b993-6d2eb72a7279/api/v1/run/c8a36d56-21c0-4e64-8c27-693e816c9840';
const APPLICATION_TOKEN = process.env.APPLICATION_TOKEN;
```

### 4.2 Request Headers
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${APPLICATION_TOKEN}`
}
```

## 5. Response Processing

The AI responses are processed to ensure they follow the expected format:

1. **String Parsing**: If the response is a string, it's parsed as JSON
2. **Nested Data Extraction**: For complex response structures, data is extracted from nested fields
3. **Array Validation**: All array fields are validated to ensure they contain arrays
4. **Fallback Values**: Default values are provided for missing fields
5. **Error Handling**: Graceful fallback responses when AI service fails

## 6. Data Flow

1. **User Request** → Controller receives analysis/report request
2. **Data Preparation** → User profile and nutritional data are formatted
3. **AI Request** → Formatted data is sent to Langflow API
4. **Response Processing** → AI response is parsed and validated
5. **Fallback Handling** → If AI fails, fallback response is used
6. **User Response** → Processed data is returned to user

This ensures reliable AI-powered nutritional analysis even when the external AI service experiences issues.
