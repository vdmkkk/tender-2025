<template>
  <q-input v-model="login" />
  <q-input v-model="password" />
  <q-btn @click="handleSubmit" />
</template>

<script setup lang="ts">
import { Cookies, Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const login = ref('');
const password = ref('');
const handleSubmit = () => {
  api
    .put('http://109.73.206.70:8004/login', { username: login.value, password: password.value })
    .then((res) => {
      Cookies.set('id', res.data.id, { path: '/' });
      Cookies.set('username', res.data.username, { path: '/' });
      window.location.href = '/';
    })
    .catch((res) => {
      if (res.status == 403) {
        Notify.create({ color: 'negative', message: 'Неверный пароль!', position: 'top' });
      } else {
        Notify.create({
          color: 'negative',
          message: 'Произошла ошибка на сервере',
          position: 'top',
        });
      }
    });
};
</script>
