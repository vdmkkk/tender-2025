<template>
  <div class="chart" id="container1" />
  <div class="chart" id="container2" />
  <div class="chart" id="container3" />
  <div class="chart" id="container4" />
</template>

<script setup lang="ts">
// @ts-nocheck //
/* eslint-disable */
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import Highcharts from 'highcharts';

const $q = useQuasar();
const csvData = ref<any[]>([]);

const generateOptions = () => {
  console.log(csvData.value);
  const dates = [...new Set(csvData.value.map((row) => row['Date']))]
    .filter((date) => date)
    .sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
  const clientNames = [...new Set(csvData.value.map((row) => row['Client']))].filter(
    (client) => client,
  );

  const seriesClicks = clientNames.map((client) => {
    return {
      name: client,
      data: dates.map((date) => {
        return csvData.value
          .filter((row) => row['Client'] === client && row['Date'] === date)
          .reduce((sum, row) => sum + (row['Clicks'] as number), 0);
      }),
    };
  });

  const seriesCost = clientNames.map((client) => {
    return {
      name: client,
      data: dates.map((date) => {
        return csvData.value
          .filter((row) => row['Client'] === client && row['Date'] === date)
          .reduce((sum, row) => sum + parseFloat(row['Cost']), 0);
      }),
    };
  });

  const seriesConversion = clientNames.map((client) => {
    return {
      name: client,
      data: dates.map((date) => {
        return csvData.value
          .filter((row) => row['Client'] === client && row['Date'] === date)
          .reduce((sum, row) => sum + (row['Conversions'] as number), 0);
      }),
    };
  });

  const seriesShow = clientNames.map((client) => {
    return {
      name: client,
      data: dates.map((date) => {
        return csvData.value
          .filter((row) => row['Client'] === client && row['Date'] === date)
          .reduce((sum, row) => sum + (row['Shows'] as number), 0);
      }),
    };
  });

  console.log(seriesShow);

  Highcharts.chart('container1', {
    title: { text: 'Clicks Per Date (Filtered by Client)' },
    xAxis: { categories: dates, title: { text: 'Date' } },
    yAxis: { title: { text: 'Clicks' } },
    series: seriesClicks,
    legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    plotOptions: { series: { label: { connectorAllowed: false } } },
  });
  Highcharts.chart('container2', {
    title: { text: 'Cost Per Date (Filtered by Client)' },
    xAxis: { categories: dates, title: { text: 'Date' } },
    yAxis: { title: { text: 'Cost' } },
    series: seriesCost,
    legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    plotOptions: { series: { label: { connectorAllowed: false } } },
  });
  Highcharts.chart('container3', {
    title: { text: 'Conversion Per Date (Filtered by Client)' },
    xAxis: { categories: dates, title: { text: 'Date' } },
    yAxis: { title: { text: 'Conversion' } },
    series: seriesConversion,
    legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    plotOptions: { series: { label: { connectorAllowed: false } } },
  });
  Highcharts.chart('container4', {
    title: { text: 'Shows Per Date (Filtered by Client)' },
    xAxis: { categories: dates, title: { text: 'Date' } },
    yAxis: { title: { text: 'Shows' } },
    series: seriesShow,
    legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    plotOptions: { series: { label: { connectorAllowed: false } } },
  });
};

onMounted(() => {
  generateOptions();
  //   loadCSVData().then((res) => {
  //     csvData.value = res;
  //     generateOptions();
  //   });
});
</script>
