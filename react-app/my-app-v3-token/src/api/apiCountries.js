import { getAuthToken, getAuthHeaders } from './api';

const API_URL = "http://localhost:5003";

export const getCountries = async () => {
  try {
    const response = await fetch(`${API_URL}/countries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const addCountry = async (countryName) => {
  try {
    const response = await fetch(`${API_URL}/countries`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ country_name: countryName })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Authentication failed - please login again');
      }
      if (response.status === 409) {
        throw new Error('Country already exists');
      }
      throw new Error(`Failed to add country: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding country:', error);
    throw error;
  }
};
