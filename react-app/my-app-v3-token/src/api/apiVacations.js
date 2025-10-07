const API_URL = "http://localhost:5003";

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};


// Create new vacation (POST /vacations) - Requires authentication
export const createVacation = async (vacationData) => {
  try {
    const response = await fetch(`${API_URL}/vacations`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(vacationData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Authentication failed - please login again');
      }
      throw new Error(`Failed to create vacation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating vacation:', error);
    throw error;
  }
};

// Get all vacations (GET /vacations) - Requires authentication
export const getVacations = async () => {
  try {
    const response = await fetch(`${API_URL}/vacations`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Authentication failed - please login again');
      }
      throw new Error(`Failed to fetch vacations: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching vacations:', error);
    throw error;
  }
};

// Update vacation (PUT /vacations/:id) - Requires authentication
export const updateVacation = async (vacationId, vacationData) => {
  try {
    const response = await fetch(`${API_URL}/vacations/${vacationId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(vacationData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Authentication failed - please login again');
      }
      if (response.status === 404) {
        throw new Error('Vacation not found');
      }
      throw new Error(`Failed to update vacation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating vacation:', error);
    throw error;
  }
};

// Delete vacation (DELETE /vacations/:id) - Requires admin role
export const deleteVacation = async (vacationId) => {
  try {
    const response = await fetch(`${API_URL}/vacations/${vacationId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Authentication failed - please login again');
      }
      if (response.status === 403) {
        throw new Error('Access denied - Admin role required');
      }
      if (response.status === 404) {
        throw new Error('Vacation not found');
      }
      throw new Error(`Failed to delete vacation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting vacation:', error);
    throw error;
  }
};

// Get vacation by ID (GET /vacations/:id) - Public route (no authentication required)
export const getVacationById = async (vacationId) => {
  try {
    const response = await fetch(`${API_URL}/vacations/${vacationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Vacation not found');
      }
      throw new Error(`Failed to fetch vacation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching vacation by ID:', error);
    throw error;
  }
};

// Export helper functions for use in other components
export { getAuthToken, getAuthHeaders };
