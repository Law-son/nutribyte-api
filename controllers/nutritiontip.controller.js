const NutritionTip = require('../models/nutritiontip.model');
const { nutritionFacts, nutritionTips } = require('../data/nutrition.data');

// Get multiple random items from an array
const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Combine and shuffle tips and facts
const getCombinedRandomItems = (count) => {
    // Combine all items into one array
    const allItems = [...nutritionFacts, ...nutritionTips];
    return getRandomItems(allItems, count);
};

const getRandomTip = async (req, res, next) => {
    try {
        // Get 5 random items (combination of tips and facts)
        const randomItems = getCombinedRandomItems(5);

        // Save items to database if they don't exist
        const savedItems = await Promise.all(
            randomItems.map(async (item) => {
                const newTip = new NutritionTip({
                    title: item.title,
                    content: item.content,
                    source: 'NutriByte',
                    category: item.category,
                    tags: item.tags
                });
                return await newTip.save();
            })
        );

        res.json({
            success: true,
            count: savedItems.length,
            data: savedItems
        });
    } catch (error) {
        next(error);
    }
};

const getRandomFact = async (req, res, next) => {
    try {
        // Get 5 random items (combination of tips and facts)
        const randomItems = getCombinedRandomItems(5);

        // Save items to database if they don't exist
        const savedItems = await Promise.all(
            randomItems.map(async (item) => {
                const newTip = new NutritionTip({
                    title: item.title,
                    content: item.content,
                    source: 'NutriByte',
                    category: item.category,
                    tags: item.tags
                });
                return await newTip.save();
            })
        );

        res.json({
            success: true,
            count: savedItems.length,
            data: savedItems
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRandomTip,
    getRandomFact
}; 