<template>
  <div class="header">
    <div v-if="isLoading" class="loading">Uploading data, please wait...</div>
    <form>
      <input ref="fileInput" type="file" class="file_input" @change="handleFileUpload">
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import * as XLSX from "xlsx";

interface Response {
  Player: string;
  ErrCode: string;
  ErrMessage: string;
  Cause: string;
  CustomerSolution: string;
  DeveloperSolution: string;
  Note: string;
  Platform: string;
}


const isLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const CHUNK_SIZE = 1000;

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    isLoading.value = true;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils
          .sheet_to_json<Response>(worksheet)
          .map((item) => ({
            ...item,
            Platform: sheetName,
          }));

        await chunkAndUploadData(parsedData);
      }

      isLoading.value = false;
      resetFileInput();
    };
    reader.readAsArrayBuffer(file);
  }
};

const chunkAndUploadData = async (data: Response[]) => {
  const chunkData: Response[][] = [];

  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    chunkData.push(data.slice(i, i + CHUNK_SIZE));
  }

  for (const chunk of chunkData) {
    try {
      const response = await axios.post("/api/upload", chunk);
      if (!response.data.success) {
        alert("Failed to upload data: " + response.data.message);
        break;
      }
    } catch (error) {
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert("Error uploading data: " + errorMessage);
      break;
    }
  }
};

// Hàm reset input file
const resetFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};
</script>

<style>
.header {
  width: 100%;
  border: 2px black;
  border-style: none none solid;
  height: 30%;
  color: black;
}

.file_input {
  color: black;
}
</style>
