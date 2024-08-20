<template>
  <div></div>
</template>

<script lang="ts" setup>
const url =
  "https://script.google.com/macros/s/AKfycbwo7u98iVTLvfljMAOx-VlYwuKWBIkPsojjm4HlHmvFj_4CnX0N4PnfzGLN0jSd8jVZXA/exec";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => console.error("Error:", error));
</script>

<style></style>
