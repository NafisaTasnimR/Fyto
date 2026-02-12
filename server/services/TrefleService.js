import axios from "axios";

const TREFLE_BASE_URL = "https://trefle.io/api/v1";

// Helper function to normalize scientific names
const normalizeScientificName = (scientificName) => {
    if (!scientificName) return "";

    let normalized = scientificName
        .toLowerCase()
        .replace(/\([^)]*\)/g, '') // Remove parentheses and content
        .replace(/\b(subsp\.|var\.|f\.|cv\.|x)\b.*$/i, '') // Remove subspecies notation
        .replace(/[''`]/g, '') // Remove quotes
        .trim()
        .split(/\s+/)
        .slice(0, 2) // Keep only genus and species
        .join(' ');

    return normalized;
};

// Helper function to extract genus
const extractGenus = (scientificName) => {
    if (!scientificName) return "";
    return scientificName.split(/\s+/)[0];
};

// Calculate match score between search term and scientific name
const calculateMatchScore = (searchTerm, scientificName) => {
    const normalizedSearch = normalizeScientificName(searchTerm);
    const normalizedName = normalizeScientificName(scientificName);

    // Exact match
    if (normalizedSearch === normalizedName) {
        return 1000;
    }

    const searchWords = normalizedSearch.split(/\s+/).filter(w => w);
    const nameWords = normalizedName.split(/\s+/).filter(w => w);
    let score = 0;

    // Genus match (most important)
    if (searchWords[0] && nameWords[0] && searchWords[0] === nameWords[0]) {
        score += 10;
    }

    // Species match
    if (searchWords[1] && nameWords[1] && searchWords[1] === nameWords[1]) {
        score += 8;
    }

    return score;
};

// Format care information from Trefle data
const formatCareInfo = (plantData) => {
    const data = plantData.main_species || plantData;

    // Helper to check if an object has any non-null values
    const hasValue = (obj) => {
        if (!obj || typeof obj !== 'object') return false;
        return Object.values(obj).some(val => val !== null && val !== undefined);
    };

    // Helper to format measurement objects (e.g., {cm: 100}, {deg_f: 70, deg_c: 21})
    const formatMeasurement = (measurement) => {
        if (!measurement || typeof measurement !== 'object') return null;
        if (!hasValue(measurement)) return null;

        // Try different unit formats
        if (measurement.cm !== null && measurement.cm !== undefined) {
            return `${measurement.cm} cm`;
        }
        if (measurement.mm !== null && measurement.mm !== undefined) {
            return `${measurement.mm} mm`;
        }
        if (measurement.deg_c !== null && measurement.deg_c !== undefined) {
            const celsius = `${measurement.deg_c}°C`;
            if (measurement.deg_f !== null && measurement.deg_f !== undefined) {
                return `${celsius} (${measurement.deg_f}°F)`;
            }
            return celsius;
        }
        if (measurement.deg_f !== null && measurement.deg_f !== undefined) {
            return `${measurement.deg_f}°F`;
        }

        // Fallback for other units
        const entries = Object.entries(measurement).filter(([_, v]) => v !== null && v !== undefined);
        if (entries.length > 0) {
            return entries.map(([unit, val]) => `${val} ${unit}`).join(', ');
        }

        return null;
    };

    // Helper to format simple values
    const formatValue = (value, defaultValue = null) => {
        if (value === null || value === undefined) return defaultValue;
        if (Array.isArray(value)) {
            const filtered = value.filter(v => v !== null && v !== undefined);
            return filtered.length > 0 ? filtered.join(", ") : defaultValue;
        }
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return String(value);
        if (typeof value === 'object') return formatMeasurement(value);
        return String(value);
    };

    // Helper to format boolean
    const formatBoolean = (value) => {
        if (value === true) return "Yes";
        if (value === false) return "No";
        return null;
    };

    // Build comprehensive care guide
    const careGuide = {};

    // Growth information - extract key parameters
    let growthParameters = null;

    if (data.growth) {
        const g = data.growth;

        if (g.description) careGuide.growth = g.description;
        if (g.sowing) careGuide.sowing = g.sowing;
        if (g.days_to_harvest) careGuide.daysToHarvest = `${g.days_to_harvest} days`;

        const rowSpacing = formatMeasurement(g.row_spacing);
        if (rowSpacing) careGuide.rowSpacing = rowSpacing;

        const spread = formatMeasurement(g.spread);
        if (spread) careGuide.spread = spread;

        // Build growth parameters object for prominent display
        growthParameters = {
            // Light requirement (1-10 scale)
            light: g.light !== null && g.light !== undefined ? {
                value: g.light,
                scale: "1-10",
                description: `${g.light}/10 light requirement`
            } : null,

            // Atmospheric humidity (1-10 scale)
            atmosphericHumidity: g.atmospheric_humidity !== null && g.atmospheric_humidity !== undefined ? {
                value: g.atmospheric_humidity,
                scale: "1-10",
                description: `${g.atmospheric_humidity}/10 humidity level`
            } : null,

            // Soil pH range
            soilPH: (g.ph_minimum !== null || g.ph_maximum !== null) ? {
                minimum: g.ph_minimum,
                maximum: g.ph_maximum,
                range: `${g.ph_minimum || 'N/A'} - ${g.ph_maximum || 'N/A'}`
            } : null,

            // Temperature range
            temperature: null,

            // Soil texture (1-4 scale)
            soilTexture: g.soil_texture !== null && g.soil_texture !== undefined ? {
                value: g.soil_texture,
                scale: "1-4",
                description: `Level ${g.soil_texture}/4`
            } : null
        };

        // pH range (also add to care guide for backward compatibility)
        if (g.ph_minimum !== null || g.ph_maximum !== null) {
            const min = g.ph_minimum !== null ? g.ph_minimum : 'N/A';
            const max = g.ph_maximum !== null ? g.ph_maximum : 'N/A';
            if (min !== 'N/A' || max !== 'N/A') {
                careGuide.soilPH = `${min} - ${max}`;
            }
        }

        // Light requirement (also in care guide)
        if (g.light !== null && g.light !== undefined) {
            careGuide.light = `${g.light}/10`;
        }

        // Humidity (also in care guide)
        if (g.atmospheric_humidity !== null && g.atmospheric_humidity !== undefined) {
            careGuide.humidity = `${g.atmospheric_humidity}/10`;
        }

        // Precipitation
        const minPrecip = formatMeasurement(g.minimum_precipitation);
        if (minPrecip) careGuide.minPrecipitation = minPrecip;

        const maxPrecip = formatMeasurement(g.maximum_precipitation);
        if (maxPrecip) careGuide.maxPrecipitation = maxPrecip;

        // Temperature - format and add to both places
        const minTemp = formatMeasurement(g.minimum_temperature);
        const maxTemp = formatMeasurement(g.maximum_temperature);

        if (minTemp) careGuide.minTemperature = minTemp;
        if (maxTemp) careGuide.maxTemperature = maxTemp;

        if (minTemp || maxTemp) {
            growthParameters.temperature = {
                minimum: minTemp,
                maximum: maxTemp,
                range: `${minTemp || 'N/A'} to ${maxTemp || 'N/A'}`
            };
        }

        // Soil texture (also in care guide)
        if (g.soil_texture !== null && g.soil_texture !== undefined) {
            careGuide.soilTexture = `${g.soil_texture}/4`;
        }

        // Other soil properties
        if (g.soil_nutriments !== null && g.soil_nutriments !== undefined) {
            careGuide.soilNutrients = `${g.soil_nutriments}/10`;
        }
        if (g.soil_salinity !== null && g.soil_salinity !== undefined) {
            careGuide.soilSalinity = `${g.soil_salinity}/10`;
        }
        if (g.soil_humidity !== null && g.soil_humidity !== undefined) {
            careGuide.soilHumidity = `${g.soil_humidity}/10`;
        }

        // Clean up null values from growth parameters
        Object.keys(growthParameters).forEach(key => {
            if (growthParameters[key] === null) {
                delete growthParameters[key];
            }
        });

        if (Object.keys(growthParameters).length === 0) {
            growthParameters = null;
        }
    }

    // Build specifications object
    const specifications = {};
    if (data.specifications) {
        const spec = data.specifications;

        if (spec.toxicity) specifications.toxicity = spec.toxicity;
        if (spec.growth_rate) specifications.growthRate = spec.growth_rate;
        if (spec.growth_form) specifications.growthForm = spec.growth_form;
        if (spec.growth_habit) specifications.growthHabit = spec.growth_habit;

        const avgHeight = formatMeasurement(spec.average_height);
        if (avgHeight) specifications.averageHeight = avgHeight;

        const maxHeight = formatMeasurement(spec.maximum_height);
        if (maxHeight) specifications.maximumHeight = maxHeight;

        if (spec.nitrogen_fixation) specifications.nitrogenFixation = formatBoolean(spec.nitrogen_fixation);
        if (spec.shape_and_orientation) specifications.shapeAndOrientation = spec.shape_and_orientation;
    }

    return {
        scientificName: data.scientific_name || "Unknown",
        commonName: data.common_name || data.scientific_name || "Unknown",
        family: data.family_common_name || data.family || null,

        // Key Growth Parameters (prominently displayed)
        growthParameters: growthParameters,

        // Basic characteristics
        duration: formatValue(data.duration),
        edible: formatBoolean(data.edible),
        vegetable: formatBoolean(data.vegetable),

        // Detailed care requirements
        careGuide: Object.keys(careGuide).length > 0 ? careGuide : null,

        // Additional info
        observations: data.observations || null,
        year: data.year || null,
        bibliography: data.bibliography || null,

        // Images
        imageUrl: data.image_url || plantData.image_url || null,

        // Specifications
        specifications: Object.keys(specifications).length > 0 ? specifications : null
    };
};

export const getPlantCareInfo = async (scientificName) => {
    try {
        console.log("🌿 Searching Trefle for:", scientificName);

        const genus = extractGenus(scientificName);
        console.log("Extracted genus:", genus);

        // Step 1: Search with full scientific name
        let searchResponse = await axios.get(
            `${TREFLE_BASE_URL}/plants/search`,
            {
                params: {
                    q: scientificName,
                    token: process.env.TREFLE_API_KEY
                }
            }
        );

        let plants = searchResponse.data?.data;

        // If no results, try with genus only
        if (!plants || plants.length === 0) {
            console.log("No results with full name, trying genus:", genus);
            searchResponse = await axios.get(
                `${TREFLE_BASE_URL}/plants/search`,
                {
                    params: {
                        q: genus,
                        token: process.env.TREFLE_API_KEY
                    }
                }
            );
            plants = searchResponse.data?.data;
        }

        console.log("Search results:", plants?.length || 0, "plants found");

        if (!plants || plants.length === 0) {
            console.log("❌ No plants found for:", scientificName);
            return null;
        }

        // Step 2: Find best match
        let bestMatch = null;
        let bestScore = 0;

        plants.forEach(plant => {
            if (plant.scientific_name) {
                const score = calculateMatchScore(scientificName, plant.scientific_name);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = plant;
                }
            }
        });

        if (!bestMatch) {
            console.log("No good match found, using first result");
            bestMatch = plants[0];
        }

        console.log("✅ Best match:", bestMatch.common_name || bestMatch.scientific_name, "(Score:", bestScore, ")");
        console.log("Match quality:", bestScore >= 10 ? "Excellent" : bestScore >= 5 ? "Good" : bestScore > 0 ? "Fair" : "Poor");

        // Step 3: Get detailed information
        const plantId = bestMatch.id;
        console.log("📋 Fetching details for plant ID:", plantId);

        const detailResponse = await axios.get(
            `${TREFLE_BASE_URL}/plants/${plantId}`,
            {
                params: {
                    token: process.env.TREFLE_API_KEY
                }
            }
        );

        const plantData = detailResponse.data?.data;
        console.log("✓ Plant details received");

        // Step 4: Format and return care information
        const careInfo = formatCareInfo(plantData);
        console.log("✓ Care information formatted");

        // Log growth parameters if available
        if (careInfo.growthParameters) {
            console.log("\n📊 Growth Parameters Found:");
            if (careInfo.growthParameters.light) {
                console.log(`  💡 Light: ${careInfo.growthParameters.light.description}`);
            }
            if (careInfo.growthParameters.atmosphericHumidity) {
                console.log(`  💧 Humidity: ${careInfo.growthParameters.atmosphericHumidity.description}`);
            }
            if (careInfo.growthParameters.temperature) {
                console.log(`  🌡️  Temperature: ${careInfo.growthParameters.temperature.range}`);
            }
            if (careInfo.growthParameters.soilPH) {
                console.log(`  🧪 Soil pH: ${careInfo.growthParameters.soilPH.range}`);
            }
            if (careInfo.growthParameters.soilTexture) {
                console.log(`  🏔️  Soil Texture: ${careInfo.growthParameters.soilTexture.description}`);
            }
        } else {
            console.log("⚠️  No growth parameters available for this plant");
        }

        return careInfo;

    } catch (error) {
        console.error("❌ Trefle API error:", error.message);
        if (error.response) {
            console.error("API response:", error.response.status, error.response.data?.message || error.response.data);
        }
        return null;
    }
};