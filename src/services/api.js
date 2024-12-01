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

// Fetch filtered characters based on query parameters
export const fetchFilteredCharacters = async (filters) => {
  const { name = '', status = '', species = '', type = '', gender = '' } = filters;

  // Constructing the query string based on provided filters
  //Still in progess
  const query = new URLSearchParams({
    name,
    status,
    species,
    type,
    gender,
  }).toString();

  try {
    console.log("fetching by query");
    const response = await fetch(`https://rickandmortyapi.com/api/character/?${query}`);
    const data = await response.json();
    return data.results || []; // Return filtered results or empty array
  } catch (error) {
    console.error('Error fetching filtered characters:', error);
    return [];
  }
};
