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
    title: { text: 'Clicks Per Date (Filtered by Client)' },
    xAxis: {
      categories: classes.value.map((res) => {
        return res.class_varvara;
      }),
      title: { text: 'Date' },
    },
    yAxis: { title: { text: 'Кол-во запросов' } },
    series: {
      name: 'client',
      data: classes.value.map((res) => {
        return res.count;
      }),
    },
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
  generateOptions();
  api.get('http://109.73.206.70:8004/count').then((response) => {
    classes.value = response.data;
    // console.log(csvData.value);
    generateOptions();
  });
});
</script>
