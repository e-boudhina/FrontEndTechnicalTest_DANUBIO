<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { fetchDefaultCharacters, fetchFilteredCharacters } from './services/api';
import * as bootstrap from 'bootstrap';

const characters = ref([]); // Store all fetched characters
const searchQuery = ref(''); // Search query to filter characters
const selectedCharacter = ref(null); // Store the selected character for the modal

const filters = ref({
  name: '',
  //status: '',
  //species: '',
  //type: '',
  //gender: '',
});

// Fetch all characters when the component mounts
onMounted(async () => {
  try {
    const data = await fetchDefaultCharacters();
    console.log('Fetched characters:', data); // Log the fetched data
    characters.value = data; // Store all characters
  } catch (error) {
    console.error('Error fetching characters:', error);
  }
});

// Watch for changes in the searchQuery and trigger the search
watch(searchQuery, async (newQuery) => {
  console.log('Search query updated:', newQuery);
  filters.value.name = newQuery; // Update the name filter with the search query

  // Fetch the filtered characters based on the updated query
  characters.value = await fetchFilteredCharacters(filters.value);
});

// Computed property to filter characters based on the search query and filters
const filteredCharacters = computed(() => {
  return characters.value.filter((character) =>
    character.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Limit the displayed characters to 10
const displayedCharacters = computed(() => {
  return filteredCharacters.value.slice(0, 10); // Show only the first 10 results
});

// Open the modal with the selected character's details
const openModal = (character) => {
  selectedCharacter.value = character;
  // Check if Bootstrap Modal is loaded properly
  if (bootstrap.Modal) {
    const modalElement = document.getElementById('characterModal');
    const modal = new bootstrap.Modal(modalElement); // Initialize modal
    modal.show(); // Show the modal
  } else {
    console.error('Bootstrap Modal is not loaded correctly.');
  }
};
</script>

<template>
  <div id="app" class="container">
    <h1 class="my-5 text-center">Rick and Morty Characters</h1>

    <!-- Search Bar -->
    <div class="d-flex justify-content-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control w-50 p-3 rounded-pill"
        placeholder="Search for characters"
      />
    </div>

    <!-- Character Cards -->
    <div class="row">
      <div
        v-for="(character, index) in displayedCharacters"
        :key="index"
        class="col-md-4 mb-4"
      >
        <div class="card" style="width: 18rem;" @click="openModal(character)">
          <!-- Image and Status -->
          <div class="card-img-container position-relative">
            <img :src="character.image" class="card-img-top" :alt="character.name" />
            <button
              type="button"
              :class="{
                'btn': true,
                'btn-sm': true,
                'btn-success': character.status === 'Alive',
                'btn-secondary': character.status === 'unknown',
                'btn-danger': character.status === 'Dead',
              }"
              class="position-absolute top-0 end-0 m-2"
            >
              {{ character.status }}
            </button>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <h5 class="card-title">{{ character.name }}</h5>
            <p class="card-text">Location: {{ character.location.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="characterModal"
      tabindex="-1"
      aria-labelledby="characterModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="characterModalLabel">{{ selectedCharacter?.name }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedCharacter">
              <img
                :src="selectedCharacter.image"
                class="img-fluid mb-3"
                alt="Character image"
              />
              <button
                type="button"
                :class="{
                  'btn': true,
                  'btn-success': selectedCharacter.status === 'Alive',
                  'btn-secondary': selectedCharacter.status === 'unknown',
                  'btn-danger': selectedCharacter.status === 'Dead',
                }"
                class="btn d-block mx-auto mb-3 w-50"
                style="pointer-events: none;"
              >
                {{ selectedCharacter.status }}
              </button>
              <p><strong>Gender:</strong> {{ selectedCharacter.gender }}</p>
              <p><strong>Location:</strong> {{ selectedCharacter.location.name }}</p>
              <p><strong>Origin:</strong> {{ selectedCharacter.origin.name }}</p>
              <p><strong>Species:</strong> {{ selectedCharacter.species }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
