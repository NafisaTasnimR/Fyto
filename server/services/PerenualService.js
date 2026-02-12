import axios from "axios";

const PERENUAL_BASE_URL = "https://perenual.com/api/species-list";

const normalizeScientificName = (scientificName) => {
    if (!scientificName) return "";

    let normalized = scientificName
        .toLowerCase()
        .replace(/\([^)]*\)/g, '')
        .replace(/\b(subsp\.|var\.|f\.|cv\.|x)\b.*$/i, '')
        .replace(/[''`]/g, '')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .join(' ');

    return normalized;
};

const extractGenus = (scientificName) => {
    if (!scientificName) return "";
    return scientificName.split(/\s+/)[0];
};

const calculateMatchScore = (searchTerm, scientificNames) => {
    const normalizedSearch = normalizeScientificName(searchTerm);
    const searchWords = normalizedSearch.split(/\s+/).filter(w => w);
    let maxScore = 0;

    scientificNames.forEach(name => {
        const normalizedName = normalizeScientificName(name);

        if (normalizedSearch === normalizedName) {
            maxScore = Math.max(maxScore, 1000);
            return;
        }

        const nameWords = normalizedName.split(/\s+/).filter(w => w);
        let score = 0;

        if (searchWords[0] && nameWords[0] && searchWords[0] === nameWords[0]) {
            score += 10;
        }

        if (searchWords[1] && nameWords[1] && searchWords[1] === nameWords[1]) {
            score += 8;
        }

        searchWords.forEach(searchWord => {
            nameWords.forEach(nameWord => {
                if (searchWord === nameWord && searchWords.indexOf(searchWord) > 1) {
                    score += 2;
                } else if (searchWord.includes(nameWord) || nameWord.includes(searchWord)) {
                    score += 1;
                }
            });
        });

        maxScore = Math.max(maxScore, score);
    });

    return maxScore;
};

export const getPlantCareGuide = async (speciesId) => {
    try {
        const pageNumber = Math.ceil(speciesId / 30);

        console.log(`Fetching care guide for species ID ${speciesId} from page ${pageNumber}`);

        const response = await axios.get(
            "https://www.perenual.com/api/species-care-guide-list",
            {
                params: {
                    key: process.env.PERENUAL_API_KEY,
                    species_id: speciesId,
                    page: pageNumber
                }
            }
        );

        const data = response.data?.data;
        if (!data || data.length === 0) {
            console.log(`No care guide found on page ${pageNumber} for species ID ${speciesId}`);
            return null;
        }

        // Find the specific species in the page results
        const speciesCare = data.find(item => item.species_id === speciesId);

        if (!speciesCare) {
            console.log(`Species ID ${speciesId} not found in page ${pageNumber} results`);
            return null;
        }

        // Each species can have multiple sections 
        const sections = speciesCare.section;

        const care = {};
        sections.forEach((s) => {
            care[s.type] = s.description;
        });

        return {
            commonName: speciesCare.common_name,
            scientificName: speciesCare.scientific_name?.join(", "),
            careGuide: care
        };
    } catch (err) {
        if (err.response?.status === 429) {
            console.warn("Perenual API rate limit reached (429). Using basic info instead.");
        } else {
            console.error("Perenual care guide error:", err.message);
        }
        return null;
    }
};

export const getPlantCareInfo = async (scientificName) => {
    try {
        console.log("Searching Perenual for:", scientificName);

        // Extract genus for broader search (improves match rate)
        const genus = extractGenus(scientificName);
        console.log("Extracted genus:", genus);

        // Step 1: Search for the species to get its ID
        // Try with full scientific name first
        let response = await axios.get(PERENUAL_BASE_URL, {
            params: {
                key: process.env.PERENUAL_API_KEY,
                q: scientificName
            }
        });

        let plants = response.data?.data;

        // If no results, try searching with genus only
        if (!plants || plants.length === 0) {
            console.log("No results with full name, trying genus:", genus);
            response = await axios.get(PERENUAL_BASE_URL, {
                params: {
                    key: process.env.PERENUAL_API_KEY,
                    q: genus
                }
            });
            plants = response.data?.data;
        }

        if (!plants || plants.length === 0) {
            console.log("No species found for:", scientificName);
            return null;
        }

        console.log(`Found ${plants.length} potential matches`);

        // Find the best matching plant based on word matching
        let bestMatch = null;
        let bestScore = 0;

        plants.forEach(plant => {
            // Handle scientific_name as either array or string
            let scientificNames = [];
            if (Array.isArray(plant.scientific_name)) {
                scientificNames = plant.scientific_name;
            } else if (typeof plant.scientific_name === 'string') {
                scientificNames = [plant.scientific_name];
            } else if (plant.common_name) {
                // Fallback to using common name if no scientific name
                scientificNames = [plant.common_name];
            }

            if (scientificNames.length > 0) {
                const score = calculateMatchScore(scientificName, scientificNames);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = plant;
                }
            }
        });

        if (!bestMatch) {
            console.log("No good match found, using first result as fallback");
            bestMatch = plants[0];
        }

        console.log("Best match for", scientificName, ":", bestMatch.common_name, "(Score:", bestScore, ") with ID:", bestMatch.id);
        console.log("Scientific names:", bestMatch.scientific_name);
        console.log("Match quality:", bestScore >= 10 ? "Excellent" : bestScore >= 5 ? "Good" : bestScore > 0 ? "Fair" : "Poor - using first result");

        // Step 2: Get detailed care guide using the species ID
        const careGuide = await getPlantCareGuide(bestMatch.id);

        // Helper function to format sunlight data
        const formatSunlight = (sunlight) => {
            if (!sunlight) return "Not available";
            if (Array.isArray(sunlight)) return sunlight.join(", ");
            if (typeof sunlight === 'string') return sunlight;
            return "Not available";
        };

        // Helper function to get scientific name
        const getScientificName = () => {
            if (Array.isArray(bestMatch.scientific_name)) {
                return bestMatch.scientific_name[0] || scientificName;
            } else if (typeof bestMatch.scientific_name === 'string') {
                return bestMatch.scientific_name;
            }
            return scientificName;
        };

        if (!careGuide) {
            console.log("No care guide available for species ID:", bestMatch.id);
            console.log("Returning basic care info from species list");
            // Fallback to basic info from species list
            return {
                scientificName: getScientificName(),
                commonName: bestMatch.common_name || scientificName,
                watering: bestMatch.watering || "Not available",
                sunlight: formatSunlight(bestMatch.sunlight),
                cycle: bestMatch.cycle || "Not available",
                // Add any other available basic info
                description: bestMatch.description || "No description available",
                careLevel: bestMatch.care_level || "Not available",
                careGuide: null
            };
        }

        // Step 3: Combine species info with care guide
        console.log("Returning complete care guide");
        return {
            scientificName: careGuide.scientificName || getScientificName(),
            commonName: careGuide.commonName || bestMatch.common_name || scientificName,
            watering: bestMatch.watering || "Not available",
            sunlight: formatSunlight(bestMatch.sunlight),
            cycle: bestMatch.cycle || "Not available",
            description: bestMatch.description || "No description available",
            careLevel: bestMatch.care_level || "Not available",
            careGuide: careGuide.careGuide
        };

    } catch (error) {
        console.error("Perenual API error:", error.message);
        return null;
    }
};