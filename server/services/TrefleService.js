import axios from "axios";

const TREFLE_BASE_URL = "https://trefle.io/api/v1";

// Determine plant type based on characteristics
const determinePlantType = (mainSpecies) => {
    if (!mainSpecies) return 'Unknown';

    const specs = mainSpecies.specifications || {};
    const flower = mainSpecies.flower || {};
    const foliage = mainSpecies.foliage || {};

    // Check growth form and growth habit
    const growthForm = specs.growth_form?.toLowerCase() || '';
    const growthHabit = specs.growth_habit?.toLowerCase() || '';

    // Categorize based on growth characteristics
    if (growthForm.includes('tree') || growthHabit.includes('tree')) {
        return 'Tree';
    }
    if (growthForm.includes('shrub') || growthHabit.includes('shrub') || growthHabit.includes('bush')) {
        return 'Bush/Shrub';
    }
    if (growthForm.includes('vine') || growthHabit.includes('vine') || growthHabit.includes('climber')) {
        return 'Vine';
    }
    if (growthForm.includes('grass') || growthHabit.includes('graminoid')) {
        return 'Grass';
    }

    // Check if it has prominent flowers
    const hasFlowers = flower.color || flower.conspicuous === true;
    if (hasFlowers) {
        return 'Flower Plant';
    }

    // Check if it's primarily foliage-based
    const hasProminentFoliage = foliage.color || foliage.texture;
    if (hasProminentFoliage && !hasFlowers) {
        return 'Foliage Plant';
    }

    // Check if it's a succulent or cactus
    if (growthForm.includes('succulent') || growthForm.includes('cactus')) {
        return 'Succulent';
    }

    // Check if it's herbaceous
    if (growthHabit.includes('herb') || mainSpecies.duration === 'Annual' || mainSpecies.duration === 'Biennial') {
        return 'Herbaceous Plant';
    }

    // Default categorization
    return 'Plant';
};

// Search for plants by name
export const searchPlants = async (searchQuery, page = 1, limit = 20) => {
    try {
        console.log(" Searching plants for:", searchQuery, `(Page ${page})`);

        const response = await axios.get(
            `${TREFLE_BASE_URL}/plants/search`,
            {
                params: {
                    q: searchQuery,
                    token: process.env.TREFLE_API_KEY,
                    page: page,
                    limit: Math.min(limit, 100) // Trefle max is 100
                }
            }
        );

        const data = response.data;
        const plants = data?.data || [];

        console.log(` Found ${plants.length} plants (Total: ${data?.meta?.total || 0})`);

        // Format the results with minimal information
        const formattedPlants = plants.map(plant => ({
            id: plant.id,
            scientificName: plant.scientific_name,
            commonName: plant.common_name || plant.scientific_name,
            imageUrl: plant.image_url || null,
            plantType: 'Plant' // Basic type for search results, detailed type available in getPlantById
        }));

        return {
            success: true,
            data: formattedPlants,
            pagination: {
                total: data?.meta?.total || 0,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil((data?.meta?.total || 0) / limit)
            }
        };
    } catch (error) {
        console.error(" Trefle search error:", error.message);
        if (error.response) {
            console.error("API response:", error.response.status, error.response.data?.message || error.response.data);
        }
        throw new Error(`Failed to search plants: ${error.message}`);
    }
};

// Get detailed plant information by ID
export const getPlantById = async (plantId) => {
    try {
        console.log(" Fetching plant details for ID:", plantId);

        const response = await axios.get(
            `${TREFLE_BASE_URL}/plants/${plantId}`,
            {
                params: {
                    token: process.env.TREFLE_API_KEY
                }
            }
        );

        const plantData = response.data?.data;

        if (!plantData) {
            console.log(" No plant data found");
            return null;
        }

        console.log(" Plant details fetched:", plantData.common_name || plantData.scientific_name);

        // Extract main species data
        const mainSpecies = plantData.main_species || {};

        // Build simplified plant information
        const plantInfo = {
            id: plantData.id,
            scientificName: plantData.scientific_name,
            commonName: plantData.common_name || plantData.scientific_name,
            imageUrl: plantData.image_url || mainSpecies.image_url || null,
            plantType: determinePlantType(mainSpecies)
        };

        return {
            success: true,
            data: plantInfo
        };
    } catch (error) {
        console.error(" Trefle get plant error:", error.message);
        if (error.response) {
            console.error("API response:", error.response.status, error.response.data?.message || error.response.data);
        }
        throw new Error(`Failed to get plant details: ${error.message}`);
    }
};
