// Fetch default characters 
export const fetchDefaultCharacters = async () => {
  try {
    const response = await fetch('https://rickandmortyapi.com/api/character/?page=1');
    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error('Error fetching default characters:', error);
    return [];
  }
};

// Fetch filtered characters based on name
export const fetchFilteredCharacters = async (filters) => {
  const { name } = filters; // Only filter by name now

  // Build the query string with only the 'name' filter
  const queryParams = new URLSearchParams();
  if (name) queryParams.append('name', name); // Only append 'name' if it's not empty

  try {
    console.log("Fetching characters by query: ", queryParams.toString());
    const response = await fetch(`https://rickandmortyapi.com/api/character/?${queryParams.toString()}`);
    const data = await response.json();
    return data.results || []; // Return filtered results or empty array
  } catch (error) {
    console.error('Error fetching filtered characters:', error);
    return [];
  }
};
