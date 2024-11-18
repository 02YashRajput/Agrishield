import axios from "axios";
import dotenv from "dotenv";
const apiKey = process.env.OPENCAGE_LOCATION_API_KEY

export async function getLocationCoordinates(fullAddress) {
  try {
    // Construct the API URL
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
    
    // Make the HTTP request to OpenCage API
    const response = await axios.get(url);
    
    if (response.data.results.length > 0) {
      // Get latitude and longitude from the response
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lng };
    } else {
      return null;  // Location not found
    }
  } catch (error) {
    return null;  // Error in fetching location data
  }
}

