<template>
  <div class="message">
    <p class="title">{{ message.text }}</p>
    <img
      v-if="!!message.image"
      :src="'data:image/png;base64,' + message.image"
      alt="User message"
    />
    <p class="title">Список вещей:</p>
    <div class="column" style="gap: 24px; margin-top: 20px">
      <ItemComponent v-for="item in message.items" v-bind:key="item.name" :item="item" />
    </div>
    <div class="separator" />
    <div class="row price">
      <q-icon name="shopping_cart" />
      <p>
        {{
          message.items.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0) +
          ' '
        }}
        руб.
      </p>
    </div>
    <div class="separator" />
    <p class="title">
      Надеюсь, эти варианты помогут тебе собрать желаемый образ. Обрати внимание на размеры и
      наличие товаров перед заказом.
    </p>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck //
/* eslint-disable */
import { BotMessage } from 'src/types/Message';
import ItemComponent from './ItemComponent.vue';

const {} = defineProps<{ message: BotMessage }>();
</script>

<style lang="scss" scoped>
.body--dark {
  .message {
    .separator {
      background-color: #414141;
    }
  }
}

.message {
  display: flex;
  flex-direction: column;
  align-items: start;

  .title {
    font-size: 16px;
    line-height: 24px;
    margin-top: 20px;
    margin-bottom: 0px;
  }

  .separator {
    width: 100%;
    height: 1px;
    background-color: #deeaed;
    margin-top: 24px;
    margin-bottom: 24px;
  }

  img {
    max-width: 300px;
    max-height: 400px;
    object-fit: contain;
    border-radius: 12px;
    margin-top: 20px;
  }

  .price {
    align-items: center;

    gap: 8px;

    p {
      margin: 0;
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
    }
  }
}
</style>
