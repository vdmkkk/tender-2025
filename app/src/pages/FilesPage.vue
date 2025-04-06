<template>
  <input
    ref="fileInput"
    type="file"
    accept=".pdf, .xls, .xlsx, .docx, .doc"
    style="display: none"
    @change="onFileChange"
  />
  <div class="column" style="margin-top: 30px">
    <div class="file" v-for="(file, index) in files" :key="index">
      <img :src="fileIcon" alt="file icon" />
      <p>{{ file }}</p>
    </div>
  </div>
  <q-btn
    class="q-mt-md"
    label="Загрузить файл"
    color="primary"
    text-color="black"
    style="margin-left: 100px; margin-bottom: 100px"
    @click="openFileExplorer"
  />
</template>

<script setup lang="ts">
// @ts-nocheck //
/* eslint-disable */
import fileIcon from 'src/assets/icons/file.svg';
import { ref, useTemplateRef } from 'vue';

const files = ref([
  'Инструкция_по_работе_с_Порталом_для_заказчика.pdf',
  'Инструкция_по_работе_с_Порталом_для_поставщика.pdf',
  'Инструкция_по_электронному_актированию.pdf',
  'Регламент_информационного_взаимодействия.pdf',
  'Статьи.xls',
]);

const fileInput = useTemplateRef('fileInput');

function openFileExplorer() {
  fileInput.value?.click();
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    files.value.push(file.name);
    // Save the file name.
    const reader = new FileReader();
    reader.onload = () => {
      //   base64Image.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
</script>

<style lang="scss" scoped>
.file {
  background-color: $secondary;
  width: fit-content;
  border-radius: 15px;
  margin-bottom: 20px;
  padding: 10px;
  margin-left: 100px;
  img {
    width: 60px;
    height: 60px;
  }
}
</style>
