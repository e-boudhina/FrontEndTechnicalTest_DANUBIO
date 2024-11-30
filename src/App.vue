<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchCharacters } from './services/api'; // Your API fetching service
import * as bootstrap from 'bootstrap';

const characters = ref([]); // Reactive state to store fetched characters
const searchQuery = ref(''); // Search query to filter characters
const selectedCharacter = ref(null); // To store the selected character for the modal

// Fetch the characters when the component mounts
onMounted(async () => {
  try {
    const data = await fetchCharacters();
    console.log('Fetched characters:', data); // Log the data to the console
    characters.value = data; // Store the data in the characters array
  } catch (error) {
    console.error('Error fetching characters:', error);
  }
});

// Computed property to filter characters based on search query
const filteredCharacters = computed(() => {
  return characters.value.filter((character) => {
    return character.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Function to open the modal with the clicked character's details
const openModal = (character) => {
  selectedCharacter.value = character;
  window.bootstrap = bootstrap;
  // Check if Bootstrap JS is loaded properly
  if (window.bootstrap && window.bootstrap.Modal) {
    const modalElement = document.getElementById('characterModal');
    const modal = new window.bootstrap.Modal(modalElement);  // Initialize modal using window.bootstrap.Modal
    modal.show();  // Show the modal
  } else {
    console.error('Bootstrap Modal is not loaded correctly.');
  }
};

</script>

<template>
  <div id="app" class="container">
    <h1 class="my-5 text-center">Rick and Morty Characters</h1>

    <!-- Search Bar with Bootstrap styling -->
    <div class="d-flex justify-content-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control w-50 p-3 rounded-pill"
        placeholder="Search characters by name"
      />
    </div>

    <!-- Display filtered characters in cards -->
    <div class="row">
  <div v-for="(character, index) in filteredCharacters" :key="index" class="col-md-4 mb-4">
    <div class="card" style="width: 18rem;" @click="openModal(character)">
      <!-- Card Image Container (relative positioning) -->
      <div class="card-img-container position-relative">
        <img :src="character.image" class="card-img-top" :alt="character.name" />

        <!-- Status Button in the top-right corner with dynamic classes -->
        <button type="button" 
                :class="{
                  'btn': true, 
                  'btn-sm': true,
                  'btn-success': character.status === 'Alive', 
                  'btn-secondary': character.status === 'unknown', 
                  'btn-danger': character.status === 'Dead', 
                }"
                class="position-absolute top-0 end-0 m-2">
          {{ character.status }}
        </button>
      </div>

      <!-- Card Body Content -->
      <div class="card-body">
        <h5 class="card-title">{{ character.name }}</h5>
        <p class="card-text">Location: {{ character.location.name }}</p>
      </div>
    </div>
  </div>
</div>


<!-- Modal for character details -->
<!-- Modal for character details -->
<div class="modal fade" id="characterModal" tabindex="-1" aria-labelledby="characterModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="characterModalLabel">{{ selectedCharacter?.name }}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
  <div v-if="selectedCharacter">
    <!-- Image with full width -->
    <img :src="selectedCharacter.image" class="img-fluid mb-3" alt="Character image" />

    <!-- Status inside a success button with the same width as the image -->
    <button type="button" class="btn btn-success d-block w-50 mx-auto mb-3">
      {{ selectedCharacter.status }}
    </button>

    <!-- Other character information -->
    <p><strong>Gender:</strong> {{ selectedCharacter.gender }}</p>
    <p><strong>Location:</strong> {{ selectedCharacter.location.name }}</p>
    <p><strong>Origin:</strong> {{ selectedCharacter.origin.name }}</p>
    <p><strong>Species:</strong> {{ selectedCharacter.species }}</p>
  </div>
</div>


      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
