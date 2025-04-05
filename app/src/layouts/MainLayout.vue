<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header">
      <img :src="isDark ? logo_dark : logo" />

      <div class="row no-wrap" style="gap: 10px">
        <q-btn
          flat
          rounded
          size="sm"
          class="switch"
          :icon="isDark ? 'light_mode' : 'dark_mode'"
          @click="toggleDark"
        />
        <q-btn
          unelevated
          no-caps
          rounded
          color="accent"
          style="border-radius: 16px !important"
          @click="handleLogout"
        >
          <p class="new-chat">Выйти</p>
        </q-btn>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// @ts-nocheck //
/* eslint-disable */
import { computed, onMounted } from 'vue';
import logo from 'src/assets/logo.svg';
import logo_dark from 'src/assets/logo_dark.svg';
import { Cookies, useQuasar } from 'quasar';

const $q = useQuasar();

const handleLogout = () => {
  Cookies.remove('id');
  Cookies.remove('username');
  window.location.href = '/auth';
};

const isDark = computed(() => $q.dark.isActive);

function toggleDark() {
  $q.dark.toggle();
}

onMounted(() => {
  if (!Cookies.get('id') && Cookies.get('id') != 'undefined') {
    window.location.href = '/auth';
  }
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 7vw;
  padding-right: 7vw;
  align-items: center;

  .new-chat {
    color: #ffffff;
    margin: 0;
    font-weight: 400;
    padding: 0 15px;
  }

  img {
    padding-top: 10px;
    height: 50px;
    padding-bottom: 10px;
  }

  .switch {
    height: 40px;
    width: 40px;
    border-radius: 15px !important;
  }
}
.body--light {
  .header {
    background-color: #fff;
    color: #333333;
  }
}

.body--dark {
  .header {
    background-color: #333;
    color: #fff;
  }
}
</style>
