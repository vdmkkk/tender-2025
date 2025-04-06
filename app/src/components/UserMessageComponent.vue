<template>
  <div class="message" :style="left ? { alignItems: 'start' } : { alignItems: 'end' }">
    <div v-if="message.flag == 2" class="btns">
      <div v-for="btn in message.response">
        <q-btn
          :label="btn.button"
          unelevated
          no-caps
          rounded
          color="accent"
          @click="handleBtnClick(btn)"
        />
      </div>
    </div>
    <div class="text" v-if="message.parse_web">
      <div v-for="link in message.parse_web">
        <p v-if="!link.text.includes('No info')" class="link" @click="handleRedirect(link.url)">
          · {{ link.text }}
        </p>
      </div>
    </div>
    <div
      v-else
      class="text"
      :style="left ? { borderBottomRightRadius: '15px' } : { borderBottomLeftRadius: '15px' }"
    >
      <div v-html="compiledMarkdown" class="markdown-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck //
/* eslint-disable */
import { UserMessage } from 'src/types/Message';
import { computed, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';

const { left, message } = defineProps<{ message: UserMessage; left: boolean }>();

const emits = defineEmits(['btn-click']);
const handleBtnClick = (btn) => {
  emits('btn-click', btn);
};

const md = new MarkdownIt();

const compiledMarkdown = computed(() => {
  return md.render(
    message.flag == 1 || message.flag == 0
      ? message.response
      : message.web
        ? message.web
        : message.button
          ? message.button.button
          : message.response?.output
            ? message.response.output
            : message.text,
  );
});

const handleRedirect = (url) => {
  window.location.replace(url);
};

onMounted(() => {
  console.log(message);
});
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

.btns {
  display: flex;
  flex-direction: row;
  width: 60%;
  flex-wrap: wrap;
  gap: 6px;

  .q-btn {
    width: max-content;
  }
}

.message {
  display: flex;
  flex-direction: column;
  // align-items: end;
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
    max-width: 70%;
    background-color: white;
    padding: 16px 24px;
    border-top-left-radius: 15px;
    // border-bottom-left-radius: 15px;
    border-top-right-radius: 15px;

    .markdown-content {
      p {
        margin: 0 !important;
        font-size: 16px;
        line-height: 24px;
      }
    }

    p {
      margin: 0 !important;
      font-size: 16px;
      line-height: 24px;
    }

    .link {
      color: #007bff;
      text-decoration: underline;
      cursor: pointer;
      font-size: 16px;
      line-height: 24px;
    }
  }
}
</style>
