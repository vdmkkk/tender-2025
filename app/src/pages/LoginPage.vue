<template>
  <div class="app">
    <p class="title">Войти</p>
    <q-input v-model="login" rounded flat placeholder="Логин" class="q-input" color="transparent" />
    <q-input
      v-model="password"
      rounded
      flat
      placeholder="Пароль"
      class="q-input"
      color="transparent"
      style="margin-top: 10px"
    />
    <q-btn class="submit" label="Войти" flat rounded @click="handleSubmit" />
    <q-btn
      class="other-btn"
      label="Зарегестрироваться"
      flat
      rounded
      no-caps
      @click="handleRedirect"
    />
  </div>
</template>

<script setup lang="ts">
import { Cookies, Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const login = ref('');
const password = ref('');

const handleRedirect = () => {
  window.location.href = '/auth/register';
};

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

<style lang="scss" scoped>
.app {
  background-color: $primary;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-size: 30px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 40px;
  }

  .submit {
    background-color: $accent;
    color: white;
    width: 100px;
    margin-top: 20px;
  }

  .other-btn {
    margin-top: 10px;
  }
}

.q-input {
  width: 300px;
}

.q-input ::v-deep .q-field__control {
  border-radius: 20px !important;
  background-color: #fff !important;
  border: 1px solid #deeaed;
}

.q-input ::v-deep .q-field__control-container {
  display: flex;
  // flex-direction: column-reverse;
}

.q-input ::v-deep .q-field__append {
  align-self: end;
}

.q-input ::v-deep .q-field__native {
  resize: none !important;
  color: $text !important;
  font-size: 16px !important;
  font-weight: 400 !important;
  line-height: 24px !important;
  max-height: 200px !important;
  padding-top: 4px !important;
  padding-left: 20px;
}

.q-input ::v-deep .q-field__native::-webkit-outer-spin-button,
.q-input ::v-deep .q-field__native::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

.q-input ::v-deep .q-field__control:before {
  border: 0;
}

.q-input ::v-deep .standout-class {
  background-color: #fff !important;
  border: 1px solid #deeaed;
}
</style>
