import axios from "axios";
import FormData from "form-data";

export const identifyPlant = async (imageBuffer) => {
    const formData = new FormData();
    formData.append("images", imageBuffer, {
        filename: "plant.jpg"
    });
    formData.append("organs", "leaf");

    const response = await axios.post(
        "https://my-api.plantnet.org/v2/identify/all",
        formData,
        {
            params: {
                "api-key": process.env.PLANTNET_API_KEY
            },
            headers: formData.getHeaders()
        }
    );

    const bestMatch = response.data.results[0];

    return {
        plantName: bestMatch.species.commonNames?.[0] ||
            bestMatch.species.scientificName,
        scientificName: bestMatch.species.scientificName,
        confidence: bestMatch.score
    };
};