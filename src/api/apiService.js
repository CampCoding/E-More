// apiService.js
import  API  from './index';
// Example: Fetch data
export const fetchData = (endpoint, params = {}) => {
  return API.get(endpoint, { params  });
};

// Example: Create data
export const postData = (endpoint, data) => {
  return API.post(endpoint, data);
};

// Example: Update data
export const updateData = (endpoint, data) => {
  return API.put(endpoint, data);
};

// Example: Delete data
export const deleteData = (endpoint) => {
  return API.delete(endpoint);
};

