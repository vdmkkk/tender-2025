<template>
  <q-page class="column app">
    <div class="messages">
      <div v-for="message in messages" v-bind:key="message.text">
        <UserMessageComponent
          :left="message.fromUser != 'user'"
          :message="message"
          @btn-click="handleButtonClick"
        />
      </div>
      <div v-if="isFinal" class="feedback">
        <div class="stars">
          <img
            v-for="star in maxStars"
            :key="star"
            :src="
              (hoverRating > 0 ? star <= hoverRating : star <= rating) ? star_icon : unfilled_star
            "
            @mouseenter="setHoverRating(star)"
            @mouseleave="resetHoverRating"
            @click="setRating(star)"
            alt="star"
            class="star"
          />
        </div>
        <q-input
          v-model="feedback"
          type="textarea"
          autogrow
          rounded
          flat
          placeholder="Напишите отзыв о работе ассистента"
          class="q-input"
          color="transparent"
        />
        <div class="row no-wrap" style="margin-top: 10px">
          <q-btn
            label="Вопрос не решен. Позвать оператора"
            no-caps
            class="other-btn"
            @click="handleCallAssistant"
            flat
          />
          <q-btn
            label="Отправить обратную связь"
            no-caps
            class="other-btn"
            :disable="rating == 0"
            @click="handlerSendFeedback"
            flat
          />
        </div>
      </div>
      <div v-if="loading">
        <q-spinner-dots size="50px" color="grey-5" />
        <p style="color: #a9a9a9">Ищем ответ на ваш вопрос...</p>
      </div>
    </div>
    <div v-if="goingToInternet" class="choice">
      <q-btn label="Нет" no-caps class="other-btn" @click="handleInternet(false)" flat />
      <q-btn label="Да" no-caps class="other-btn" @click="handleInternet(true)" flat />
    </div>
    <div v-else class="input">
      <div v-if="hints.length > 0" class="hints">
        <p v-for="(hint, i) in hints" :key="i" @click="handleHint(hint)">{{ hint }}</p>
      </div>
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
import UserMessageComponent from 'src/components/UserMessageComponent.vue';
import { BotMessage, Icons, UserMessage } from 'src/types/Message';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import arrowUpIcon from 'src/assets/icons/arrow_up.svg';
import { Cookies, useQuasar, debounce } from 'quasar';
import { api } from 'src/boot/axios';
import star_icon from 'src/assets/icons/star.svg';
import unfilled_star from 'src/assets/icons/star_unfilled.svg';

const maxStars = 5;
const rating = ref(0);
const hoverRating = ref(0);
const feedback = ref<string>('');

const setRating = (value: number) => {
  rating.value = value;
};

const setHoverRating = (value: number) => {
  hoverRating.value = value;
};

const resetHoverRating = () => {
  hoverRating.value = 0;
};

const $q = useQuasar();

const inputText = ref<string>('');

const loading = ref<boolean>(false);
const messages = ref<(UserMessage | BotMessage)[]>([]);

const goingToInternet = ref<boolean>(false);
const isFinal = ref<boolean>(false);

const hints = ref([]);

const handleInputChange = debounce((newInput) => {
  if (newInput == '') {
    return;
  }
  api
    .post('http://109.73.206.70:8009/get_relevant_questions', { query: inputText.value })
    .then((res) => {
      hints.value = res.data;
    });
}, 300);

// Watch the rating ref and call the debounced function whenever it changes
watch(inputText, (newValue) => {
  handleInputChange(newValue);
});

const handleHint = (hint) => {
  loading.value = true;
  messages.value.push({
    fromUser: 'user',
    button: { button: hint, question: hint },
  });
  inputText.value = '';
  hints.value = [];
  isFinal.value = false;
  rating.value = 0;
  feedback.value = '';
  api
    .post('http://109.73.206.70:8004/message', {
      sender_type: 'user',
      user_id: Cookies.get('id'),
      content: {
        button: { button: hint, question: hint },
      },
    })
    .then((response) => {
      messages.value.push({
        fromUser: 'bot',
        id: response.data.id,
        ...response.data.content,
      });
      if (response.data.content.flag == 0) {
        goingToInternet.value = true;
      } else if (response.data.content.flag == 1 || response.data.content.response?.output) {
        isFinal.value = true;
      } else {
        isFinal.value = false;
      }
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages');
        messagesContainer?.children[messagesContainer?.children.length - 1].scrollIntoView({
          behavior: 'smooth',
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleButtonClick = (button) => {
  messages.value.push({
    fromUser: 'user',
    button,
  });
  if (loading.value) {
    return;
  }
  hints.value = [];
  loading.value = true;
  isFinal.value = false;
  rating.value = 0;
  feedback.value = '';
  api
    .post('http://109.73.206.70:8004/message', {
      sender_type: 'user',
      user_id: Cookies.get('id'),
      content: {
        button,
      },
    })
    .then((response) => {
      messages.value.push({
        fromUser: 'bot',
        id: response.data.id,
        ...response.data.content,
      });
      if (response.data.content.flag == 0) {
        goingToInternet.value = true;
      } else if (response.data.content.flag == 1 || response.data.content.response?.output) {
        isFinal.value = true;
      } else {
        isFinal.value = false;
      }
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages');
        messagesContainer?.children[messagesContainer?.children.length - 1].scrollIntoView({
          behavior: 'smooth',
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handlerSend = () => {
  if (!inputText.value) {
    return;
  }
  messages.value.push({
    text: inputText.value,
    fromUser: 'user',
  });
  const prompt = inputText.value;
  inputText.value = '';
  loading.value = true;
  hints.value = [];
  isFinal.value = false;
  rating.value = 0;
  feedback.value = '';
  api
    .post('http://109.73.206.70:8004/message', {
      sender_type: 'user',
      user_id: Cookies.get('id'),
      content: {
        text: prompt,
      },
    })
    .then((response) => {
      messages.value.push({
        fromUser: 'bot',
        id: response.data.id,
        ...response.data.content,
      });
      if (response.data.content.flag == 0) {
        goingToInternet.value = true;
      } else if (response.data.content.flag == 1 || response.data.content.response?.output) {
        isFinal.value = true;
      } else {
        isFinal.value = false;
      }
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages');
        messagesContainer?.children[messagesContainer?.children.length - 1].scrollIntoView({
          behavior: 'smooth',
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    })
    .finally(() => {
      loading.value = false;
    });
};

const isDark = computed(() => $q.dark.isActive);

const handleInternet = (ans) => {
  goingToInternet.value = false;
  messages.value.push({
    fromUser: 'user',
    button: { button: ans ? 'Да' : 'Нет', question: ans ? 'Да' : 'Нет' },
  });
  hints.value = [];
  loading.value = true;
  isFinal.value = false;
  rating.value = 0;
  feedback.value = '';
  api
    .post('http://109.73.206.70:8004/message', {
      sender_type: 'user',
      user_id: Cookies.get('id'),
      content: {
        web: ans ? 'да' : 'нет',
        web_text: messages.value.at(-3).text,
      },
    })
    .then((response) => {
      messages.value.push({
        fromUser: 'bot',
        id: response.data.id,
        ...response.data.content,
      });
      if (response.data.content.flag == 0) {
        goingToInternet.value = true;
      } else if (response.data.content.flag == 1 || response.data.content.response?.output) {
        isFinal.value = true;
      } else {
        isFinal.value = false;
      }
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages');
        messagesContainer?.children[messagesContainer?.children.length - 1].scrollIntoView({
          behavior: 'smooth',
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  api
    .get(`http://109.73.206.70:8004/chat?offset=${0}&limit=${9999}&user_id=${Cookies.get('id')}`)
    .then((res) => {
      messages.value = res.data
        .map((res) => {
          return {
            id: res.id,
            fromUser: res.sender_type,
            ...res.content,
          };
        })
        .reverse();
      const msg = messages.value.at(-1);
      if (msg?.flag == 0) {
        goingToInternet.value = true;
      } else if (msg?.flag == 1 || msg?.response?.output) {
        isFinal.value = true;
      } else {
        isFinal.value = false;
      }
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages');
        // scroll to the bottom of the messages container and offset it for 200 px
        messagesContainer?.children[messagesContainer?.children.length - 1]?.scrollIntoView({
          behavior: 'smooth',
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    });
});

const handlerSendFeedback = () => {
  api
    .post(`http://109.73.206.70:8004/feedback`, {
      rating: rating.value,
      description: feedback.value,
      message_id: messages.value.at(-1).id,
    })
    .then((res) => {
      isFinal.value = false;
    });
};

const handleCallAssistant = () => {
  api
    .put(`http://109.73.206.70:8004/status?user_id=${Cookies.get('id')}&status=${true}`)
    .then(() => {
      isFinal.value = false;
    });
};
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
    width: 800px;
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

.choice {
  display: flex;
  flex-direction: row;
  width: 700px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);

  .q-btn {
    width: 100%;
    margin: 0 10px;
    background-color: #fff;
    color: black;
    border: 1px solid #e5e5e5;
    border-radius: 15px;
  }
}

.feedback {
  display: flex;
  flex-direction: column;
  margin-top: 70px;

  .star {
    cursor: pointer;
    width: 44px;
    height: 44px;
    padding-right: 4px;
    padding-left: 4px;
  }

  .q-btn {
    width: 100%;
    margin: 0 10px;
    background-color: #fff;
    color: black;
    border: 1px solid #e5e5e5;
    border-radius: 15px;
  }
}

.hints {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
  padding-left: 5px;

  p {
    margin: 0;
    padding: 10px 20px;
    background-color: $accent;
    width: fit-content;
    color: white;
    border-radius: 15px;
  }
}
</style>
