export const fetchCharacters = async () => {
  try {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data = await response.json();
    // Return only the first 10 characters
    return data.results.slice(0, 10);
  } catch (error) {
    console.error('Error fetching characters from the API:', error);
    return []; // Return an empty array in case of an error
  }
};