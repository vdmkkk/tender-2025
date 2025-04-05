<template>
  <div class="message">
    <img v-if="!!message.image" :src="message.image" alt="User message" />
    <div class="text">
      <div class="reply" v-if="!!message.replying">
        <p class="title">Олежа Стилист</p>
        <p>{{ message.replying.text }}</p>
      </div>
      <p>{{ message.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck //
/* eslint-disable */
import { UserMessage } from 'src/types/Message';

const {} = defineProps<{ message: UserMessage }>();
</script>

<style lang="scss" scoped>
@media screen and (max-width: 572px) {
  .message {
    .text {
      width: 80% !important;
    }

    img {
      max-width: 280px !important;
    }
  }
}
.body--dark {
  .message {
    .text {
      background-color: #333;
      p {
        color: #fff;
      }
    }

    .reply {
      background-color: #242424 !important;
      color: white;
      border-left: 3px solid #414141 !important;
    }
  }
}

.message {
  display: flex;
  flex-direction: column;
  align-items: end;
  margin-top: 20px;

  .reply {
    display: flex;
    flex-direction: column;
    background-color: #f4f8f9;
    border-left: 3px solid #deeaed;
    border-radius: 8px;
    margin-bottom: 10px;

    .title {
      font-weight: 600;
    }

    p {
      margin-left: 12px !important;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      line-clamp: 1;
      -webkit-box-orient: vertical;
      padding: 4px 0;
    }
  }

  img {
    max-width: 200px;
    max-height: 300px;
    border-radius: 10px;
    object-fit: contain;
    margin-bottom: 10px;
  }

  .text {
    width: 60%;
    background-color: white;
    padding: 16px 24px;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    border-top-right-radius: 15px;

    p {
      margin: 0;
      font-size: 16px;
      line-height: 24px;
    }
  }
}
</style>
