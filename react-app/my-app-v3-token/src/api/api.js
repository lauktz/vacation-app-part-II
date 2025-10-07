export const API_URL = "http://localhost:5003";

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

export const register = async (userData) => {
        console.log(userData)
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        if(!response.ok){
            throw new Error("Failed to register");
        }
        let data = await response.json();
        return data;//
}

export const login = async (userData) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    if(!response.ok){
        throw new Error("Failed to login");
    }
    let data = await response.json();
    return data;
}

// Example of a protected API call that uses the token
export const getProtectedData = async () => {
    const response = await fetch(`${API_URL}/protected-endpoint`, {
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
        throw new Error("Failed to fetch protected data");
    }
    
    return await response.json();
};

// Export the helper functions for use in other components
export { getAuthToken, getAuthHeaders };

// Upload image (multipart/form-data)
export const uploadImage = async (file) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload-image`, {
    method: 'POST',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
      // Do NOT set Content-Type here; browser will set multipart boundary
    },
    body: formData
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Authentication failed - please login again');
    }
    throw new Error('Failed to upload image');
  }

  return await response.json();
}

