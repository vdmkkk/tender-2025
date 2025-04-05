<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { Cookies } from 'quasar';
import { onMounted, watch } from 'vue';

// @ts-nocheck //
/* eslint-disable */
onMounted(() => {
  //   console.log(Cookies.get('id'));
  if (!!Cookies.get('id') && Cookies.get('id') != 'undefined') {
    window.location.href = '/';
  }
});
</script>

<style lang="scss" scoped></style>
