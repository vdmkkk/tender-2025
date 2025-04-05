<template>
  <div class="column item">
    <div class="row" style="gap: 20px">
      <div class="image" v-if="item.image">
        <img :src="'data:image/png;base64,' + item.image" alt="Item image" />
      </div>

      <div class="column description">
        <p class="price">{{ item.price }} руб.</p>
        <p>{{ item.name }}</p>
        <div class="row rating">
          <img :src="star" alt="star" />
          <p>
            {{ item.rating }} · <span>{{ item.reviewsCount }} отзывов</span>
          </p>
        </div>
      </div>
    </div>
    <p class="reasoning">{{ item.reasoning }}</p>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck //
/* eslint-disable */
import { GoodType } from 'src/types/Message';

const links = {
  0: 'https://www.wildberries.ru/',
  1: 'https://www.ozon.ru/',
  2: 'https://www.lamoda.ru/',
  3: 'https://market.yandex.ru/',
};

const {} = defineProps<{ item: GoodType }>();
</script>

<style lang="scss" scoped>
.body--dark {
  .item {
    .link {
      color: #418af9;
    }

    .link:hover {
      color: #3a7dcf;
    }
  }
}

.item {
  display: flex;
  flex-direction: column;
  align-items: start;

  .reasoning {
    font-size: 16px;
    line-height: 24px;
    margin-top: 16px;
  }

  .image {
    display: flex;
    flex-direction: column;
    max-width: 140px;
    max-height: 250px;

    img {
      align-self: start;
      width: 140px;
      object-fit: contain;
      border-radius: 12px;
    }
  }

  p,
  a {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    text-decoration: none;
  }

  .link:visited {
    color: #126df7;
  }

  .description {
    gap: 8px;
    .price {
      font-size: 20px;
      line-height: 32px;
      font-weight: 600;
      color: #ecb306;
    }

    .rating {
      img {
        width: 24px;
        height: 24px;
      }

      p {
        font-size: 16px;
        line-height: 24px;

        span {
          color: #a9a9a9;
        }
      }
    }
    .link {
      color: #126df7;
      cursor: pointer;
    }

    .link:hover {
      color: #156ed4;
    }
  }
}
</style>
