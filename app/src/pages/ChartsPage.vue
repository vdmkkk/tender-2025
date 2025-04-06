<template>
  <div class="chart" id="container1" />
  <div class="chart" id="container2" />
  <!-- <div class="chart" id="container3" />
  <div class="chart" id="container4" /> -->
</template>

<script setup lang="ts">
// @ts-nocheck //
/* eslint-disable */
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import Highcharts from 'highcharts';
import { api } from 'src/boot/axios';

const $q = useQuasar();
const classes = ref();
const classes2 = ref();

const generateOptions = () => {
  // const seriesClicks = clientNames.map((client) => {
  //   return;
  // });

  // const seriesCost = clientNames.map((client) => {
  //   return {
  //     name: client,
  //     data: dates.map((date) => {
  //       return csvData.value
  //         .filter((row) => row['Client'] === client && row['Date'] === date)
  //         .reduce((sum, row) => sum + parseFloat(row['Cost']), 0);
  //     }),
  //   };
  // });
  console.log(classes.value);
  Highcharts.chart('container1', {
    chart: { type: 'column' },
    title: { text: 'Частотность категорий' },
    xAxis: {
      categories: classes.value.map((res) => {
        return res.class_varvara ?? 'Нет';
      }),
    },
    yAxis: { title: { text: 'Кол-во запросов' } },
    series: [
      {
        name: 'Категории',
        data: classes.value.map((res) => {
          return res.count;
        }),
      },
    ],
    credits: { enabled: false },
    legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    plotOptions: { series: { label: { connectorAllowed: false } } },
  });
  Highcharts.chart('container2', {
    chart: { type: 'column' },
    title: { text: 'Средний рейтинг категорий' },
    xAxis: {
      categories: classes2.value.map((res) => {
        return res.class_varvara ?? 'Нет';
      }),
    },
    yAxis: { title: { text: 'Средний рейтинг категорий' } },
    series: [
      {
        name: 'Категории',
        data: classes2.value.map((res) => {
          return res.avg_rating ?? 0;
        }),
      },
    ],
    credits: { enabled: false },
    legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    plotOptions: { series: { label: { connectorAllowed: false } } },
  });
  // Highcharts.chart('container2', {
  //   title: { text: 'Cost Per Date (Filtered by Client)' },
  //   xAxis: { categories: dates, title: { text: 'Date' } },
  //   yAxis: { title: { text: 'Cost' } },
  //   series: seriesCost,
  //   legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
  //   plotOptions: { series: { label: { connectorAllowed: false } } },
  // });
  // Highcharts.chart('container3', {
  //   title: { text: 'Conversion Per Date (Filtered by Client)' },
  //   xAxis: { categories: dates, title: { text: 'Date' } },
  //   yAxis: { title: { text: 'Conversion' } },
  //   series: seriesConversion,
  //   legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
  //   plotOptions: { series: { label: { connectorAllowed: false } } },
  // });
  // Highcharts.chart('container4', {
  //   title: { text: 'Shows Per Date (Filtered by Client)' },
  //   xAxis: { categories: dates, title: { text: 'Date' } },
  //   yAxis: { title: { text: 'Shows' } },
  //   series: seriesShow,
  //   legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
  //   plotOptions: { series: { label: { connectorAllowed: false } } },
  // });
};

onMounted(() => {
  // generateOptions();
  const first = api.get('http://109.73.206.70:8004/count').then((response) => {
    classes.value = response.data;
    // console.log(csvData.value);
  });
  const second = api.get('http://109.73.206.70:8004/avg').then((response) => {
    classes2.value = response.data;
    // console.log(csvData.value);
  });
  Promise.all([first, second]).then(() => {
    generateOptions();
  });
});
</script>
