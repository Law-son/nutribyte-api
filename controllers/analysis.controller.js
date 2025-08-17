const Analysis = require('../models/analysis.model');
const MealLog = require('../models/meallog.model');
const UserProfile = require('../models/profile.model');
const Meal = require('../models/meal.model');

// Langflow API configuration
const LANGFLOW_API_URL = 'https://api.langflow.astra.datastax.com/lf/38dccd86-de59-4001-b993-6d2eb72a7279/api/v1/run/c8a36d56-21c0-4e64-8c27-693e816c9840';
const APPLICATION_TOKEN = process.env.APPLICATION_TOKEN;

const calculateNutrientTotals = (mealLogs) => {
    const totals = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        calcium: 0,
        iron: 0,
        potassium: 0,
        vitaminC: 0
    };

    console.log(`[calculateNutrientTotals] Processing ${mealLogs.length} meal logs`);

    mealLogs.forEach((log, logIndex) => {
        console.log(`[calculateNutrientTotals] Processing meal log ${logIndex + 1} with ${log.meals.length} meals`);
        log.meals.forEach((meal, mealIndex) => {
            console.log(`[calculateNutrientTotals] Processing meal ${mealIndex + 1}: ${meal.mealId?.name || 'Unknown'}`);
            
            if (!meal.mealId) {
                console.log(`[calculateNutrientTotals] Warning: Meal ${mealIndex + 1} has no mealId`);
                return;
            }

            const nutrients = meal.mealId.nutrients;
            if (!nutrients) {
                console.log(`[calculateNutrientTotals] Warning: Meal ${mealIndex + 1} has no nutrients data`);
                return;
            }

            // Debug carbs specifically
            console.log(`[calculateNutrientTotals] Meal ${mealIndex + 1} nutrients:`, {
                name: meal.mealId.name,
                carbs: nutrients.carbs,
                hasCarbs: 'carbs' in nutrients,
                allNutrientKeys: Object.keys(nutrients)
            });

            const portionMultiplier = meal.portionSize / 100; // Assuming standard portion is 100g
            console.log(`[calculateNutrientTotals] Portion size: ${meal.portionSize}g, multiplier: ${portionMultiplier}`);

            Object.keys(totals).forEach(nutrient => {
                const nutrientValue = nutrients[nutrient] || 0;
                const calculatedValue = nutrientValue * portionMultiplier;
                totals[nutrient] += calculatedValue;
                
                // Extra debugging for carbs
                if (nutrient === 'carbs') {
                    console.log(`[calculateNutrientTotals] CARBS DEBUG: ${nutrientValue} * ${portionMultiplier} = ${calculatedValue} (total: ${totals[nutrient]})`);
                } else {
                    console.log(`[calculateNutrientTotals] ${nutrient}: ${nutrientValue} * ${portionMultiplier} = ${calculatedValue} (total: ${totals[nutrient]})`);
                }
            });
        });
    });

    console.log(`[calculateNutrientTotals] Final totals:`, totals);
    console.log(`[calculateNutrientTotals] Final carbs total: ${totals.carbs}`);
    return totals;
};

// Real AI analysis using Langflow API
const generateAIAnalysis = async (nutrientTotals, userProfile, period, mealLogs) => {
    try {
        // Format the data as a readable string for the AI
        const analysisText = `
Nutritional Analysis Request for ${period} period:

User Profile:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Weight: ${userProfile.weight}kg
- Height: ${userProfile.height}m
- Activity Level: ${userProfile.activenessLevel}
- Weight Goal: ${userProfile.weightGoal || 'maintain'}
- Health Conditions: ${userProfile.healthConditions?.join(', ') || 'None'}

${period} Period Nutrient Totals:
- Calories: ${nutrientTotals.calories.toFixed(2)}
- Protein: ${nutrientTotals.protein.toFixed(2)}g
- Fat: ${nutrientTotals.fat.toFixed(2)}g
- Carbohydrates: ${nutrientTotals.carbs.toFixed(2)}g
- Fiber: ${nutrientTotals.fiber.toFixed(2)}g
- Sugar: ${nutrientTotals.sugar.toFixed(2)}g
- Sodium: ${nutrientTotals.sodium.toFixed(2)}mg
- Calcium: ${nutrientTotals.calcium.toFixed(2)}mg
- Iron: ${nutrientTotals.iron.toFixed(2)}mg
- Potassium: ${nutrientTotals.potassium.toFixed(2)}mg
- Vitamin C: ${nutrientTotals.vitaminC.toFixed(2)}mg

Meals Consumed:
${mealLogs.map(log => `- ${log.date.toDateString()}: ${log.meals.map(meal => meal.mealId.name).join(', ')}`).join('\n')}

Please provide a comprehensive nutritional analysis including:
1. Analysis summary
2. Recommendations for improvement
3. Nutritional deficiencies detected
4. Nutritional excesses detected
5. Potential health risks
6. Positive points about the diet

Respond in JSON format with these fields: analysisSummary, recommendations, nutritionalDeficiencies, nutritionalExcesses, healthRisks, positivePoints.
        `.trim();

        const payload = {
            input_value: analysisText,
            output_type: "chat",
            input_type: "chat",
            session_id: `user_${userProfile.userId}_${Date.now()}`
        };

        console.log(`[AI Analysis] Sending payload to Langflow API for ${period} analysis:`, payload);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${APPLICATION_TOKEN}`
            },
            body: JSON.stringify(payload)
        };

        const response = await fetch(LANGFLOW_API_URL, options);
        
        if (!response.ok) {
            throw new Error(`Langflow API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        // Improved logging: print the full, expanded response for clarity
        console.log(`[AI Analysis] Raw Langflow API response for ${period} analysis:`);
        console.dir(result, { depth: null, colors: true });

        // Try to extract the actual AI output from the nested structure
        let aiAnalysis;
        try {
            // Langflow 1.0+ returns outputs in a nested array structure
            let outputString = null;
            if (result && Array.isArray(result.outputs) && result.outputs.length > 0) {
                // Try to find a string output in the nested outputs
                const outputsArr = result.outputs[0].outputs;
                if (Array.isArray(outputsArr)) {
                    for (const out of outputsArr) {
                        if (typeof out === 'string') {
                            outputString = out;
                            break;
                        } else if (out && typeof out === 'object' && out.text) {
                            outputString = out.text;
                            break;
                        }
                    }
                }
            }
            if (!outputString && result.data && typeof result.data === 'string') {
                outputString = result.data;
            }
            if (!outputString && typeof result === 'string') {
                outputString = result;
            }
            if (outputString) {
                aiAnalysis = JSON.parse(outputString);
            } else {
                aiAnalysis = result;
            }
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            // Fallback to default structure if parsing fails
            aiAnalysis = {
                analysisSummary: "AI analysis completed successfully",
                recommendations: ["Continue monitoring your nutrition", "Stay hydrated"],
                nutritionalDeficiencies: [],
                nutritionalExcesses: [],
                healthRisks: [],
                positivePoints: []
            };
        }

        // Ensure the response has the expected structure
        const finalResponse = {
            analysisSummary: aiAnalysis.analysisSummary || "Nutritional analysis completed",
            recommendations: Array.isArray(aiAnalysis.recommendations) ? aiAnalysis.recommendations : [],
            nutritionalDeficiencies: Array.isArray(aiAnalysis.nutritionalDeficiencies) ? aiAnalysis.nutritionalDeficiencies : [],
            nutritionalExcesses: Array.isArray(aiAnalysis.nutritionalExcesses) ? aiAnalysis.nutritionalExcesses : [],
            healthRisks: Array.isArray(aiAnalysis.healthRisks) ? aiAnalysis.healthRisks : [],
            positivePoints: Array.isArray(aiAnalysis.positivePoints) ? aiAnalysis.positivePoints : []
        };
        console.log("[AI Analysis] Final AI Analysis response:", JSON.stringify(finalResponse, null, 2));
        return finalResponse;

    } catch (error) {
        console.error('Error calling Langflow API:', error);
        // Fallback to basic analysis if AI fails
        return {
            analysisSummary: "Analysis completed with basic insights",
            recommendations: [
                "Consider increasing protein intake if below recommended levels",
                "Monitor your daily calorie consumption",
                "Ensure adequate fiber intake for digestive health"
            ],
            nutritionalDeficiencies: [],
            nutritionalExcesses: [],
            healthRisks: [],
            positivePoints: []
        };
    }
};

const requestAnalysis = async (req, res, next) => {
    try {
        const { period } = req.body;
        const userId = req.user.userId;

        // Calculate startDate and endDate based on period
        const now = new Date();
        let startDate, endDate;
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        switch (period) {
            case '1day':
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);
                break;
            case '3days':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 2);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
                break;
            case '2weeks':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 13);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 1);
                startDate.setHours(0, 0, 0, 0);
                break;
            default:
                return res.status(400).json({ success: false, error: { message: 'Invalid period' } });
        }

        // Fetch meal logs for the period
        const mealLogs = await MealLog.find({
            userId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('meals.mealId');

        if (mealLogs.length === 0) {
            return res.status(404).json({ success: false, error: { message: 'No meal logs found for the specified period' } });
        }

        // Fetch user profile
        const userProfile = await UserProfile.findOne({ userId });
        if (!userProfile) {
            return res.status(404).json({ success: false, error: { message: 'User profile not found. Please complete your profile first.' } });
        }

        // Get nutrient totals for the period
        const nutrientTotals = calculateNutrientTotals(mealLogs);

        // Generate AI analysis
        const aiAnalysis = await generateAIAnalysis(nutrientTotals, userProfile, period, mealLogs);

        res.status(200).json({
            success: true,
            data: aiAnalysis
        });
    } catch (error) {
        next(error);
    }
};

const getAnalysisByPeriod = async (req, res, next) => {
    try {
        const { period } = req.params;
        const analyses = await Analysis.find({
            userId: req.user.userId,
            period
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: analyses
        });
    } catch (error) {
        next(error);
    }
};

const getAllAnalyses = async (req, res, next) => {
    try {
        const analyses = await Analysis.find({
            userId: req.user.userId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: analyses
        });
    } catch (error) {
        next(error);
    }
};


// AI analysis function for daily breakdown
const getAIAnalysis = async (nutrientTotals, userProfile) => {
    try {
        // Format the data as a readable string for the AI
        const analysisText = `
Daily Nutritional Analysis Request:

User Profile:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Weight: ${userProfile.weight}kg
- Height: ${userProfile.height}m
- Activity Level: ${userProfile.activenessLevel}
- Weight Goal: ${userProfile.weightGoal || 'maintain'}
- Health Conditions: ${userProfile.healthConditions?.join(', ') || 'None'}

Today's Nutrient Intake:
- Calories: ${nutrientTotals.calories.toFixed(2)}
- Protein: ${nutrientTotals.protein.toFixed(2)}g
- Fat: ${nutrientTotals.fat.toFixed(2)}g
- Carbohydrates: ${nutrientTotals.carbs.toFixed(2)}g
- Fiber: ${nutrientTotals.fiber.toFixed(2)}g
- Sugar: ${nutrientTotals.sugar.toFixed(2)}g
- Sodium: ${nutrientTotals.sodium.toFixed(2)}mg
- Calcium: ${nutrientTotals.calcium.toFixed(2)}mg
- Iron: ${nutrientTotals.iron.toFixed(2)}mg
- Potassium: ${nutrientTotals.potassium.toFixed(2)}mg
- Vitamin C: ${nutrientTotals.vitaminC.toFixed(2)}mg

Please provide a comprehensive daily nutritional analysis including:
1. Analysis summary
2. Recommendations for improvement
3. Nutritional deficiencies detected
4. Nutritional excesses detected
5. Potential health risks
6. Positive points about the diet

Respond in JSON format with these fields: analysisSummary, recommendations, nutritionalDeficiencies, nutritionalExcesses, healthRisks, positivePoints.
        `.trim();

        const payload = {
            input_value: analysisText,
            output_type: "chat",
            input_type: "chat",
            session_id: `user_${userProfile.userId}_daily_${Date.now()}`
        };

        console.log(`[AI Analysis] Sending payload to Langflow API:`, payload);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${APPLICATION_TOKEN}`
            },
            body: JSON.stringify(payload)
        };

        const response = await fetch(LANGFLOW_API_URL, options);
        
        if (!response.ok) {
            throw new Error(`Langflow API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`[AI Analysis] Langflow API response:`, result);
        
        let aiAnalysis;
        try {
            // Handle the new Langflow API response format
            if (result.outputs && result.outputs.length > 0 && result.outputs[0].outputs) {
                const outputData = result.outputs[0].outputs;
                if (outputData.length > 0 && outputData[0].data) {
                    // Try to parse the data field
                    if (typeof outputData[0].data === 'string') {
                        aiAnalysis = JSON.parse(outputData[0].data);
                    } else {
                        aiAnalysis = outputData[0].data;
                    }
                } else {
                    // Fallback: try to parse the entire output
                    const outputText = JSON.stringify(outputData);
                    aiAnalysis = JSON.parse(outputText);
                }
            } else if (typeof result === 'string') {
                aiAnalysis = JSON.parse(result);
            } else if (result.data && typeof result.data === 'string') {
                aiAnalysis = JSON.parse(result.data);
            } else {
                aiAnalysis = result;
            }
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            console.log('Raw response for debugging:', JSON.stringify(result, null, 2));
            aiAnalysis = {
                analysisSummary: "Daily nutritional analysis completed",
                recommendations: ["Continue monitoring your nutrition", "Stay hydrated"],
                nutritionalDeficiencies: [],
                nutritionalExcesses: [],
                healthRisks: [],
                positivePoints: []
            };
        }

        return {
            analysisSummary: aiAnalysis.analysisSummary || "Daily nutritional analysis completed",
            recommendations: Array.isArray(aiAnalysis.recommendations) ? aiAnalysis.recommendations : [],
            nutritionalDeficiencies: Array.isArray(aiAnalysis.nutritionalDeficiencies) ? aiAnalysis.nutritionalDeficiencies : [],
            nutritionalExcesses: Array.isArray(aiAnalysis.nutritionalExcesses) ? aiAnalysis.nutritionalExcesses : [],
            healthRisks: Array.isArray(aiAnalysis.healthRisks) ? aiAnalysis.healthRisks : [],
            positivePoints: Array.isArray(aiAnalysis.positivePoints) ? aiAnalysis.positivePoints : []
        };

    } catch (error) {
        console.error('Error calling Langflow API for daily analysis:', error);
        return {
            analysisSummary: "Daily nutritional analysis completed",
            recommendations: ["Continue monitoring your nutrition", "Stay hydrated"],
            nutritionalDeficiencies: [],
            nutritionalExcesses: [],
            healthRisks: [],
            positivePoints: []
        };
    }
};

/**
 * Get daily nutritional breakdown
 * Analysis will be automatically recalculated when meal logs change
 * Query parameter ?force=true will force recreation regardless of changes
 */
const getDailyBreakdown = async (req, res) => {
    try {
        const userId = req.user.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const forceRefresh = req.query.force === 'true';

        console.log(`[Daily Breakdown] Processing for user: ${userId}, date: ${today.toISOString()}, force refresh: ${forceRefresh}`);

        // Check if analysis exists for today
        let analysis = await Analysis.findOne({
            userId,
            startDate: today,
            endDate: today,
            period: '1day'
        });

        // Get today's meal logs to check for changes
        const mealLogs = await MealLog.find({
            userId,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        }).populate('meals.mealId');

        console.log(`[Daily Breakdown] Found ${mealLogs.length} meal logs for today`);

        // Determine if recalculation is needed
        let needsRecalculation = false;
        let recalculationReason = '';

        if (!analysis) {
            needsRecalculation = true;
            recalculationReason = 'No existing analysis found';
        } else if (forceRefresh) {
            needsRecalculation = true;
            recalculationReason = 'Force refresh requested';
        } else {
            // Check if meal logs have changed since analysis was created
            const latestMealLogUpdate = mealLogs.length > 0 ? 
                Math.max(...mealLogs.map(log => log.updatedAt.getTime())) : 0;
            const analysisUpdateTime = analysis.updatedAt.getTime();

            if (latestMealLogUpdate > analysisUpdateTime) {
                needsRecalculation = true;
                recalculationReason = 'Meal logs have been updated since last analysis';
                console.log(`[Daily Breakdown] Meal logs updated at ${new Date(latestMealLogUpdate)}, analysis at ${new Date(analysisUpdateTime)}`);
            } else {
                console.log(`[Daily Breakdown] Analysis is up to date, no recalculation needed`);
            }
        }

        if (needsRecalculation) {
            if (analysis) {
                console.log(`[Daily Breakdown] Deleting existing analysis: ${analysis._id} (Reason: ${recalculationReason})`);
                await Analysis.findByIdAndDelete(analysis._id);
            }
            
            console.log(`[Daily Breakdown] Creating new analysis (Reason: ${recalculationReason})`);
            
            // Get user profile for calorie goal calculation
            const userProfile = await UserProfile.findOne({ userId });
            if (!userProfile) {
                return res.status(404).json({
                    success: false,
                    message: 'User profile not found. Please complete your profile first.'
                });
            }

            // Calculate calorie goal
            const calorieGoal = await Analysis.calculateCalorieGoal(userId);
            console.log(`[Daily Breakdown] Calculated calorie goal: ${calorieGoal}`);

            // Calculate current calories from meal logs
            let currentCalorie = 0;
            mealLogs.forEach((log, logIndex) => {
                console.log(`[Daily Breakdown] Processing meal log ${logIndex + 1}: ${log.mealType}`);
                log.meals.forEach((meal, mealIndex) => {
                    console.log(`[Daily Breakdown] Processing meal ${mealIndex + 1}: ${meal.mealId?.name || 'Unknown'}`);
                    if (meal.mealId && meal.mealId.nutrients) {
                        const portionMultiplier = meal.portionSize / 100; // Assuming nutrients are per 100g
                        const mealCalories = meal.mealId.nutrients.calories * portionMultiplier;
                        currentCalorie += mealCalories;
                        console.log(`[Daily Breakdown] Meal calories: ${meal.mealId.nutrients.calories} * ${portionMultiplier} = ${mealCalories}`);
                    } else {
                        console.log(`[Daily Breakdown] Warning: Meal ${mealIndex + 1} has no nutrient data`);
                    }
                });
            });

            console.log(`[Daily Breakdown] Total current calories: ${currentCalorie}`);

            // Calculate nutrient totals for today
            const nutrientTotals = calculateNutrientTotals(mealLogs);
            console.log(`[Daily Breakdown] Calculated nutrient totals:`, nutrientTotals);
            
            // Get AI analysis
            const { analysisSummary, recommendations, nutritionalDeficiencies, nutritionalExcesses, healthRisks, positivePoints } = await getAIAnalysis(nutrientTotals, userProfile);

            // Determine goal analysis based on calorie comparison
            const goalAnalysis = currentCalorie >= calorieGoal * 0.9 ? "You're meeting your goal" : "Not meeting your goal";
            
            // Determine health analysis based on nutrient balance
            const hasGoodProtein = nutrientTotals.protein >= 50; // At least 50g protein
            const hasGoodFiber = nutrientTotals.fiber >= 25; // At least 25g fiber
            const hasReasonableCalories = currentCalorie >= 1200 && currentCalorie <= calorieGoal * 1.2; // Between 1200 and 120% of goal
            
            const healthAnalysis = (hasGoodProtein && hasGoodFiber && hasReasonableCalories) ? 
                "You're eating healthy" : "Not eating healthy";

            // Create new analysis with calculated nutrient totals
            analysis = await Analysis.create({
                userId,
                startDate: today,
                endDate: today,
                period: '1day',
                nutritionalStatus: 'Good', // Default status
                calorieGoal,
                currentCalorie,
                goalAnalysis,
                healthAnalysis,
                analysis: {
                    summary: analysisSummary,
                    recommendations,
                    nutritionalDeficiencies,
                    nutritionalExcesses,
                    healthRisks,
                    positivePoints
                },
                nutrientBreakdown: {
                    calories: Math.round(nutrientTotals.calories * 100) / 100,
                    protein: Math.round(nutrientTotals.protein * 100) / 100,
                    fat: Math.round(nutrientTotals.fat * 100) / 100,
                    carbs: Math.round(nutrientTotals.carbs * 100) / 100,
                    fiber: Math.round(nutrientTotals.fiber * 100) / 100,
                    sugar: Math.round(nutrientTotals.sugar * 100) / 100,
                    sodium: Math.round(nutrientTotals.sodium * 100) / 100,
                    calcium: Math.round(nutrientTotals.calcium * 100) / 100,
                    iron: Math.round(nutrientTotals.iron * 100) / 100,
                    potassium: Math.round(nutrientTotals.potassium * 100) / 100,
                    vitaminC: Math.round(nutrientTotals.vitaminC * 100) / 100
                }
            });

            console.log(`[Daily Breakdown] Created new analysis with ID: ${analysis._id}`);
        } else {
            console.log(`[Daily Breakdown] Using existing analysis: ${analysis._id}`);
        }

        res.status(200).json({
            success: true,
            data: analysis,
            recalculated: needsRecalculation,
            recalculationReason: needsRecalculation ? recalculationReason : null
        });
    } catch (error) {
        console.error('Error in getDailyBreakdown:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching daily breakdown',
            error: error.message
        });
    }
};

/**
 * Debug endpoint to check meal logs and nutrient data
 * This helps identify issues with meal data population and nutrient calculations
 */
const debugMealLogs = async (req, res) => {
    try {
        const userId = req.user.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log(`[Debug] Checking meal logs for user: ${userId}, date: ${today.toISOString()}`);

        // Get today's meal logs
        const mealLogs = await MealLog.find({
            userId,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        }).populate('meals.mealId');

        console.log(`[Debug] Found ${mealLogs.length} meal logs`);

        const debugData = {
            userId,
            date: today.toISOString(),
            mealLogsCount: mealLogs.length,
            mealLogs: mealLogs.map((log, logIndex) => ({
                logIndex,
                logId: log._id,
                date: log.date,
                mealType: log.mealType,
                mealsCount: log.meals.length,
                meals: log.meals.map((meal, mealIndex) => ({
                    mealIndex,
                    mealId: meal.mealId?._id,
                    mealName: meal.mealId?.name,
                    portionSize: meal.portionSize,
                    portionSizeUnit: meal.portionSizeUnit,
                    hasNutrients: !!meal.mealId?.nutrients,
                    nutrients: meal.mealId?.nutrients || null,
                    calculatedCalories: meal.mealId?.nutrients ? 
                        (meal.mealId.nutrients.calories * meal.portionSize / 100) : 0
                }))
            }))
        };

        console.log(`[Debug] Debug data:`, JSON.stringify(debugData, null, 2));

        res.status(200).json({
            success: true,
            data: debugData
        });
    } catch (error) {
        console.error('Error in debugMealLogs:', error);
        res.status(500).json({
            success: false,
            message: 'Error debugging meal logs',
            error: error.message
        });
    }
};

/**
 * Test endpoint to check meal data and verify carbs field
 * This helps identify if the issue is with meal data or calculation
 */
const testMealData = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        console.log(`[Test] Checking meal data for user: ${userId}`);

        // Get a few sample meals to check their structure
        const sampleMeals = await Meal.find().limit(5);
        
        // Get today's meal logs
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const mealLogs = await MealLog.find({
            userId,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        }).populate('meals.mealId');

        const testData = {
            sampleMeals: sampleMeals.map(meal => ({
                name: meal.name,
                nutrients: meal.nutrients,
                hasCarbs: 'carbs' in meal.nutrients,
                carbsValue: meal.nutrients.carbs
            })),
            todayMealLogs: mealLogs.map(log => ({
                logId: log._id,
                mealType: log.mealType,
                meals: log.meals.map(meal => ({
                    mealId: meal.mealId?._id,
                    mealName: meal.mealId?.name,
                    hasNutrients: !!meal.mealId?.nutrients,
                    hasCarbs: meal.mealId?.nutrients ? 'carbs' in meal.mealId.nutrients : false,
                    carbsValue: meal.mealId?.nutrients?.carbs,
                    allNutrientKeys: meal.mealId?.nutrients ? Object.keys(meal.mealId.nutrients) : []
                }))
            }))
        };

        console.log(`[Test] Test data:`, JSON.stringify(testData, null, 2));

        res.status(200).json({
            success: true,
            data: testData
        });
    } catch (error) {
        console.error('Error in testMealData:', error);
        res.status(500).json({
            success: false,
            message: 'Error testing meal data',
            error: error.message
        });
    }
};

module.exports = {
    requestAnalysis,
    getAnalysisByPeriod,
    getAllAnalyses,
    getDailyBreakdown,
    debugMealLogs,
    testMealData
}; 

//hhh