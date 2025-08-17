# NutriByte API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Description**: Register a new user
- **Auth required**: No
- **Request body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Success Response**: 201 Created
```json
{
    "success": true,
    "data": {
        "userId": "123...",
        "email": "user@example.com",
        "token": "jwt_token..."
    }
}
```

#### Login
- **POST** `/auth/login`
- **Description**: Login user
- **Auth required**: No
- **Request body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": {
        "userId": "123...",
        "email": "user@example.com",
        "token": "jwt_token..."
    }
}
```

#### Logout
- **POST** `/auth/logout`
- **Description**: Logout user (invalidate current token)
- **Auth required**: Yes
- **Headers**:
```
Authorization: Bearer <your_jwt_token>
```
- **Success Response**: 200 OK
```json
{
    "success": true,
    "message": "Successfully logged out"
}
```
- **Error Response**: 401 Unauthorized
```json
{
    "success": false,
    "error": {
        "message": "Authentication token required"
    }
}
```

### User Profile

#### Get Profile
- **GET** `/profile`
- **Description**: Get user's profile
- **Auth required**: Yes
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": {
        "name": "John Doe",
        "age": 30,
        "gender": "male",
        "height": 1.75,
        "weight": 70,
        "activenessLevel": "moderately_active",
        "healthConditions": ["diabetes"],
        "healthGoals": ["weight_loss"]
    }
}
```

#### Create Profile
- **POST** `/profile`
- **Description**: Create user profile
- **Auth required**: Yes
- **Request body**:
```json
{
    "name": "John Doe",
    "age": 30,
    "gender": "male",
    "height": 1.75,
    "weight": 70,
    "activenessLevel": "moderately_active",
    "healthConditions": ["diabetes"],
    "healthGoals": ["weight_loss"]
}
```
- **Success Response**: 201 Created

#### Update Profile
- **PUT** `/profile`
- **Description**: Update user profile
- **Auth required**: Yes
- **Request body**: Same as Create Profile
- **Success Response**: 200 OK

### Meals

#### Search Meals
- **GET** `/meals/search?query=omelette`
- **Description**: Search meals by name or ingredients
- **Auth required**: No
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": [
        {
            "_id": "65f3a24d8e21c37a91f3c2b4",
            "name": "Cheese Omelette",
            "category": "breakfast",
            "ingredients": ["eggs", "cheese", "butter"],
            "nutrients": {
                "calories": 300,
                "protein": 15,
                ...
            }
        }
    ]
}
```

#### Get All Meals
- **GET** `/meals`
- **Description**: Get all meals
- **Auth required**: No

#### Get Meals by Category
- **GET** `/meals/category/:category`
- **Description**: Get meals by category
- **Auth required**: No

#### Create Meal
- **POST** `/meals`
- **Description**: Create a new meal (admin only)
- **Auth required**: Yes
- **Request body**:
```json
{
    "name": "Cheese Omelette",
    "category": "breakfast",
    "ingredients": ["eggs", "cheese", "butter"],
    "nutrients": {
        "calories": 300,
        "protein": 15,
        "fat": 22,
        "carbs": 2,
        ...
    }
}
```

### Meal Logging

#### Log Meal
- **POST** `/meal-logs`
- **Description**: Log a meal
- **Auth required**: Yes
- **Request body**:
```json
{
    "date": "2024-02-20T08:00:00Z",
    "mealType": "breakfast",
    "meals": [
        {
            "mealId": "meal_id_here",
            "portionSize": 250,
            "portionSizeUnit": "g"
        }
    ]
}
```

#### Get Meal Logs
- **GET** `/meal-logs`
- **Description**: Get all meal logs
- **Auth required**: Yes

#### Get Meal Logs by Date
- **GET** `/meal-logs/date/:date`
- **Description**: Get meal logs for a specific date
- **Auth required**: Yes

#### Get Meal Logs by Date Range
- **GET** `/meal-logs/range?startDate=2024-02-01&endDate=2024-02-20`
- **Description**: Get meal logs for a date range
- **Auth required**: Yes

### Analysis

#### Request Analysis
- **POST** `/analysis/request`
- **Description**: Request nutritional analysis for a specific period using AI
- **Auth required**: Yes
- **Request body**:
```json
{
    "period": "week" // one of: "1day", "3days", "week", "2weeks", "month"
}
```
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": {
        "analysisSummary": "Comprehensive nutritional analysis completed",
        "recommendations": [
            "Consider increasing protein intake if below recommended levels",
            "Monitor your daily calorie consumption",
            "Ensure adequate fiber intake for digestive health"
        ],
        "nutritionalDeficiencies": [
            "Low vitamin D levels detected"
        ],
        "nutritionalExcesses": [
            "Sodium intake exceeds recommended daily limit"
        ],
        "healthRisks": [
            "High sodium intake may increase blood pressure"
        ],
        "positivePoints": [
            "Good protein intake for muscle maintenance",
            "Adequate fiber consumption"
        ]
    }
}
```

#### Get Analysis by Period
- **GET** `/analysis/period/:period`
- **Description**: Get analyses for a specific period
- **Auth required**: Yes

#### Get Daily Breakdown
- **GET** `/analysis/daily`
- **Description**: Get or create daily nutritional breakdown for the current date
- **Auth required**: Yes
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": {
        "userId": "user_id_here",
        "startDate": "2024-03-14T00:00:00.000Z",
        "endDate": "2024-03-14T00:00:00.000Z",
        "period": "1day",
        "nutritionalStatus": "Good",
        "calorieGoal": 2200,
        "currentCalorie": 1500,
        "goalAnalysis": "You're meeting your goal",
        "healthAnalysis": "You're eating healthy",
        "analysis": {
            "analysisSummary": "Daily nutritional analysis",
            "recommendations": [],
            "nutritionalDeficiencies": [],
            "nutritionalExcesses": [],
            "healthRisks": [],
            "positivePoints": []
        },
        "nutrientBreakdown": {
            "calories": 1500,
            "protein": 75,
            "fat": 55,
            "carbs": 180,
            "fiber": 25,
            "sugar": 45,
            "sodium": 1200,
            "calcium": 800,
            "iron": 12,
            "potassium": 2800,
            "vitaminC": 60
        }
    }
}
```
- **Error Response**: 404 Not Found
```json
{
    "success": false,
    "message": "User profile not found. Please complete your profile first."
}
```

### Reports

#### Generate Report
- **POST** `/reports/generate`
- **Description**: Generate a comprehensive nutritional report for a specific period using AI analysis
- **Auth required**: Yes
- **Request body**:
```json
{
    "period": "week" // one of: "1day", "3days", "week", "2weeks", "month"
}
```
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": {
        "reportId": "report_id_here",
        "period": "week",
        "dateRange": {
            "start": "2024-03-08T00:00:00.000Z",
            "end": "2024-03-14T23:59:59.999Z",
            "days": 7
        },
        "profile": {
            "age": 30,
            "gender": "male",
            "weight": 70,
            "height": 1.75,
            "activenessLevel": "moderately_active",
            "weightGoal": "maintain",
            "healthConditions": ["diabetes"]
        },
        "nutritionalData": {
            "breakdown": {
                "calories": 15400,
                "protein": 525,
                "fat": 385,
                "carbs": 1890,
                "fiber": 175,
                "sugar": 315,
                "sodium": 8400,
                "calcium": 5600,
                "iron": 84,
                "potassium": 19600,
                "vitaminC": 420
            },
            "dailyAverages": {
                "calories": 2200,
                "protein": 75,
                "fat": 55,
                "carbs": 270,
                "fiber": 25,
                "sugar": 45,
                "sodium": 1200,
                "calcium": 800,
                "iron": 12,
                "potassium": 2800,
                "vitaminC": 60
            },
            "goalProgress": {
                "calorieGoal": 2200,
                "recommendedNutrients": {
                    "calories": 2200,
                    "protein": 56,
                    "fat": 61,
                    "carbs": 247,
                    "fiber": 25,
                    "sugar": 55,
                    "sodium": 2300,
                    "calcium": 1000,
                    "iron": 8,
                    "potassium": 3500,
                    "vitaminC": 90
                },
                "progress": {
                    "calories": {
                        "current": 2200,
                        "recommended": 2200,
                        "percentage": 100,
                        "status": "On Track"
                    }
                }
            },
            "trends": {
                "previousPeriod": "3days",
                "previousNutrients": {
                    "calories": 6600,
                    "protein": 225,
                    "fat": 165,
                    "carbs": 810
                },
                "trends": {
                    "calories": {
                        "change": 0,
                        "trend": "Stable",
                        "direction": "stable"
                    }
                }
            }
        },
        "analytics": {
            "mostEatenMeal": "Cheese Omelette",
            "leastEatenMeal": "Salad",
            "mealCounts": {
                "Cheese Omelette": 5,
                "Salad": 1,
                "Chicken Rice": 2,
                "Fruit Bowl": 2,
                "Pasta": 1
            },
            "totalMeals": 11,
            "averageMealsPerDay": "1.6"
        },
        "aiAnalysis": {
            "summary": "Comprehensive nutritional report analysis completed",
            "nutritionalAssessment": "Nutritional assessment completed with available data",
            "goalProgressInsights": "Goal progress evaluation completed",
            "trendInsights": "Trend analysis insights provided",
            "personalizedRecommendations": [
                "Continue monitoring your nutrition",
                "Stay hydrated throughout the day",
                "Maintain consistent meal timing"
            ],
            "healthConditionAdvice": [
                "Consult with healthcare provider for specific dietary needs",
                "Monitor any food sensitivities or allergies"
            ],
            "actionItems": [
                "Review your meal planning weekly",
                "Track progress against your goals"
            ]
        }
    }
}
```

#### Get Reports by Period
- **GET** `/reports/period/:period`
- **Description**: Get reports for a specific period with summary statistics
- **Auth required**: Yes
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": {
        "reports": [
            {
                "_id": "report_id_here",
                "userId": "user_id_here",
                "startDate": "2024-03-08T00:00:00.000Z",
                "endDate": "2024-03-14T23:59:59.999Z",
                "period": "week",
                "totalNutrients": {
                    "calories": 15400,
                    "protein": 525,
                    "fat": 385,
                    "carbs": 1890
                },
                "aiAnalysis": {
                    "summary": "Comprehensive nutritional report analysis completed",
                    "personalizedRecommendations": [
                        "Continue monitoring your nutrition",
                        "Stay hydrated throughout the day"
                    ]
                }
            }
        ],
        "summaryStats": {
            "totalReports": 1,
            "averageNutrients": {
                "calories": 15400,
                "protein": 525,
                "fat": 385,
                "carbs": 1890
            },
            "mostCommonRecommendations": [
                {
                    "recommendation": "Continue monitoring your nutrition",
                    "frequency": 1
                }
            ],
            "period": "week"
        }
    }
}
```

#### Get All Reports
- **GET** `/reports`
- **Description**: Get all reports with comprehensive summary statistics
- **Auth required**: Yes
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": {
        "reports": [
            {
                "_id": "report_id_here",
                "userId": "user_id_here",
                "period": "week",
                "totalNutrients": {
                    "calories": 15400,
                    "protein": 525,
                    "fat": 385,
                    "carbs": 1890
                },
                "aiAnalysis": {
                    "summary": "Comprehensive nutritional report analysis completed",
                    "personalizedRecommendations": [
                        "Continue monitoring your nutrition",
                        "Stay hydrated throughout the day"
                    ]
                }
            }
        ],
        "summaryStats": {
            "totalReports": 1,
            "reportsByPeriod": {
                "week": 1
            },
            "averageNutrients": {
                "calories": 15400,
                "protein": 525,
                "fat": 385,
                "carbs": 1890
            },
            "mostCommonRecommendations": [
                {
                    "recommendation": "Continue monitoring your nutrition",
                    "frequency": 1
                }
            ],
            "progressTrends": {
                "calories": {
                    "increasing": 0,
                    "decreasing": 0,
                    "stable": 100
                }
            },
            "lastUpdated": "2024-03-14T12:00:00.000Z"
        }
    }
}
```

#### Get Comparative Report
- **GET** `/reports/comparative?period1=week&period2=month`
- **Description**: Compare nutritional data between two periods
- **Auth required**: Yes
- **Query Parameters**:
  - `period1`: First period to compare (required)
  - `period2`: Second period to compare (required)
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": {
        "period1": {
            "period": "week",
            "data": {
                "totalNutrients": {
                    "calories": 15400,
                    "protein": 525,
                    "fat": 385,
                    "carbs": 1890
                }
            }
        },
        "period2": {
            "period": "month",
            "data": {
                "totalNutrients": {
                    "calories": 66000,
                    "protein": 2250,
                    "fat": 1650,
                    "carbs": 8100
                }
            }
        },
        "differences": {
            "nutrients": {
                "calories": {
                    "period1": 15400,
                    "period2": 66000,
                    "difference": 50600,
                    "percentageChange": 328.57,
                    "trend": "increased"
                },
                "protein": {
                    "period1": 525,
                    "period2": 2250,
                    "difference": 1725,
                    "percentageChange": 328.57,
                    "trend": "increased"
                }
            },
            "goals": {
                "calories": {
                    "period1": 100,
                    "period2": 100,
                    "difference": 0,
                    "improvement": "maintained"
                }
            }
        }
    }
}
```

### Nutrition Tips

#### Get Random Tip
- **GET** `/nutrition-tips/random-tip`
- **Description**: Get a random nutrition tip
- **Auth required**: No
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": {
        "_id": "65f3a24d8e21c37a91f3c2b4",
        "title": "Did you know?",
        "content": "Honey is the only food that doesn't spoil. A pot of honey found in an ancient Egyptian tomb was proved to be as wholesome as fresh honey.",
        "source": "Spoonacular",
        "category": "general",
        "tags": ["food", "nutrition"],
        "createdAt": "2024-03-14T12:00:00Z",
        "updatedAt": "2024-03-14T12:00:00Z"
    }
}
```

#### Get Random Fact
- **GET** `/nutrition-tips/random-fact`
- **Description**: Get a random nutrition fact
- **Auth required**: No
- **Success Response**: 200 OK
```json
{
    "success": true,
    "data": {
        "_id": "65f3a24d8e21c37a91f3c2b5",
        "title": "Nutrition Fact",
        "content": "One cup of kale contains more vitamin C than an orange and more calcium than a cup of milk.",
        "source": "Spoonacular",
        "category": "nutrients",
        "tags": ["fact", "nutrition"],
        "createdAt": "2024-03-14T12:00:00Z",
        "updatedAt": "2024-03-14T12:00:00Z"
    }
}
```

### Feedback

#### Submit Feedback or Meal Suggestion
- **POST** `/feedback`
- **Description**: Submit general feedback or suggest a meal to the system
- **Auth required**: Yes
- **Request body** (choose one type):

**General Feedback:**
```json
{
    "type": "general",
    "message": "I love this app!"
}
```

**Meal Suggestion:**
```json
{
    "type": "meal_suggestion",
    "name": "Avocado Toast",
    "ingredients": ["avocado", "bread", "olive oil"],
    "origin": "California"
}
```
- Only `type` and `name` are required for meal suggestions; all other fields are optional.
- Only `type` and `message` are required for general feedback.

- **Success Response**: 201 Created
```json
{
    "success": true,
    "message": "Feedback submitted successfully."
}
```
- **Error Response**: 400 Bad Request (missing required fields)
```json
{
    "success": false,
    "error": {
        "message": "Meal name is required for meal suggestions."
    }
}
```

## Error Responses

All error responses follow this format:
```json
{
    "success": false,
    "error": {
        "message": "Error message here",
        "stack": "Error stack trace (development only)"
    }
}
```

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting
- 100 requests per 15 minutes per IP address 