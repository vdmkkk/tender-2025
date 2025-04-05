<template>
  <div class="message">
    <div class="text">
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
  align-items: start;
  margin-top: 20px;

  .text {
    width: 40%;
    background-color: white;
    padding: 16px 24px;
    border-top-left-radius: 15px;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;

    p {
      margin: 0;
      font-size: 16px;
      line-height: 24px;
    }
  }
}
</style>
