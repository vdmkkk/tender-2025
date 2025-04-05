<template>
  <q-page class="column app">
    <div class="messages">
      <div v-for="message in messages" v-bind:key="message.text">
        <UserMessageComponent v-if="message.fromUser == 'user'" :message="message" />
        <div v-else>
          <BotMessageComponent :message="message" />
        </div>
      </div>
      <div v-if="loading">
        <q-spinner-dots size="50px" color="grey-5" />
        <p style="color: #a9a9a9">Ищем ответ на ваш вопрос...</p>
      </div>
    </div>
    <div class="input">
      <q-input
        v-model="inputText"
        type="textarea"
        autogrow
        rounded
        flat
        placeholder="Напишите сообщение"
        class="q-input"
        color="transparent"
        @keydown.enter.prevent="handlerSend"
      >
        <template v-slot:append>
          <div class="row buttons">
            <q-btn
              :disable="loading || inputText == ''"
              @click="handlerSend"
              class="send-btn"
              flat
              round
              dense
            >
              <img :src="arrowUpIcon" />
            </q-btn>
          </div>
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// @ts-nocheck //
/* eslint-disable */
import BotMessageComponent from 'src/components/BotMessageComponent.vue';
import UserMessageComponent from 'src/components/UserMessageComponent.vue';
import { BotMessage, Icons, UserMessage } from 'src/types/Message';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import arrowUpIcon from 'src/assets/icons/arrow_up.svg';
import { Cookies, useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const $q = useQuasar();

const inputText = ref<string>('');

const loading = ref<boolean>(false);
const messages = ref<(UserMessage | BotMessage)[]>([]);

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const handlerSend = () => {
  if (!inputText.value) {
    return;
  }
  messages.value.push({
    text: inputText.value,
    fromUser: true,
  });
  const prompt = inputText.value;
  inputText.value = '';
  loading.value = true;
  api
    .post('http://109.73.206.70:8004/message', {
      sender_type: 'user',
      user_id: Cookies.get('id'),
      content: {
        text: prompt,
      },
    })
    .then((response) => {
      //
    })
    .finally(() => {
      loading.value = false;
    });
};

const isDark = computed(() => $q.dark.isActive);

onMounted(() => {
  api
    .get(`http://109.73.206.70:8004/chat?offset=${0}&limit=${9999}&user_id=${Cookies.get('id')}`)
    .then((res) => {
      messages.value = res.data.map((res) => {
        return {
          id: res.id,
          text: res.content.text,
          fromUser: res.sender_type,
        };
      });
    });
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 576px) {
  .app {
    .messages {
      width: 95vw !important;
      margin: 20px;
    }

    .input {
      width: 95vw !important;
    }
  }
}
.app {
  .messages {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 700px;
    margin: 70px auto;
    margin-bottom: 350px;
  }
}
.body--light {
  .app {
    background-color: $primary;
    color: $text;
  }

  .q-input ::v-deep .q-field__native {
    color: $text !important;
  }
}

.body--dark {
  .app {
    background-color: $primary-dark;
    color: $text-dark;
  }

  .input {
    .q-input ::v-deep .q-field__control {
      background-color: #333 !important;
      border: 1px solid #414141;
    }

    .q-input ::v-deep .q-field__native {
      color: #fff !important;
    }

    .reply {
      background-color: #242424 !important;
      border-color: #414141 !important;
    }
  }

  .buttons {
    .other-btn {
      background-color: #333;
      color: white;
      border: 1px solid #414141;
    }

    .other-btn:hover {
      background-color: #353535;
      color: white;
    }

    .other-btn-active {
      background-color: #fff;
      color: black;
      border: 1px solid #e5e5e5;
    }

    .other-btn-active:hover {
      background-color: #f4f4f4;
      color: black;
    }
  }

  .filter {
    background-color: #333 !important;
    border-color: #414141 !important;
  }
}

.buttons {
  gap: 8px;
  padding-right: 18px;
  .send-btn {
    background-color: $accent;
  }

  .send-btn:hover {
    background-color: $accent-hover;
    color: black;
  }

  .other-btn {
    background-color: $secondary;
    border: 1px solid #e5e5e5;
  }

  .other-btn:hover {
    background-color: $secondary-hover;
  }
}

.input {
  width: 700px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;

  .attachment {
    position: relative;
    padding-left: 20px;
    img {
      max-width: 200px;
      max-height: 300px;
      object-fit: contain;
      border-radius: 12px;
    }

    .close {
      position: absolute;
      right: -15px;
      top: -15px;
    }

    width: fit-content;
    height: fit-content;
  }
}

.q-input ::v-deep .q-field__control {
  border-radius: 20px !important;
  background-color: #fff !important;
  border: 1px solid #deeaed;
}

.q-input ::v-deep .q-field__control-container {
  display: flex;
  flex-direction: column-reverse;
}

.q-input ::v-deep .q-field__append {
  align-self: end;
}

.q-input ::v-deep .q-field__native {
  resize: none !important;
  color: white !important;
  font-size: 16px !important;
  font-weight: 400 !important;
  line-height: 24px !important;
  max-height: 200px !important;
  padding-top: 14px;
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

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(40px);
  opacity: 0;
}
</style>
