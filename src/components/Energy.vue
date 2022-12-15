<template>
  <div class="Energy">
    <h3>{{ title }}</h3>
    <select
      class="w3-select"
      style="width: 150px"
      v-model="days"
      @change="dataChanged"
    >
      <option
        v-for="period in periods"
        v-bind:key="period.label"
        v-bind:value="period.val"
      >
        {{ period.label }}
      </option>
    </select>
    &nbsp;
    <!--select
      class="w3-select"
      style="width: 150px; display: none"
      v-model="devid"
      @change="sensorChange"
    >
      <option
        v-for="devid in devids"
        v-bind:key="devid.label"
        v-bind:value="devid.val"
      >
        {{ devid.label }}
      </option>
    </select-->

    <div>
      <canvas id="eChart" style="width: 100%; height: 400px"></canvas>
    </div>
    <div>
      <canvas id="gChart" style="width: 100%; height: 380px"></canvas>
    </div>
    <p>Gemiddelde verbruik van {{ count }} woningen</p>
  </div>
</template>

<script>
import Chart from "chart.js";
import { getEnergyData } from "./EnergyData.js";

export default {
  name: "Energy",
  props: {
    title: String,
  },
  data() {
    return {
      eChart: Chart,
      gChart: Chart,
      devid: "",
      days: 1,
      count: 0,
      periods: [
        { label: "laatste 24 uur", val: 1 },
        { label: "laatste 48 uur", val: 2 },
        { label: "laatste week", val: 7 },
        { label: "laatste maand", val: 28 },
        { label: "laatste jaar", val: 800 },
      ],
      /*devids: [
        { label: "meter-id geen", val: "" },
        { label: "meter-id 039012210", val: "039012210" },
        { label: "meter-id 031920210", val: "031920210" },
        { label: "meter-id 031912410", val: "031912410" },
        { label: "meter-id 617357320", val: "617357320" },
        { label: "meter-id 149037213", val: "149037213" },
        { label: "meter-id 574938114", val: "574938114" },
        { label: "meter-id 860344517", val: "860344517" },
        { label: "meter-id 039028010", val: "039028010" },
        { label: "meter-id 825275117", val: "825275117" },
        { label: "meter-id 039027310", val: "039027310" },
        { label: "meter-id 128532115", val: "128532115" },
      ],*/
    };
  },
  methods: {
    dataChanged: function () {
      this.devid = this.$root.cookieMeterid;
      getEnergyData(this, this.updateCharts);
    },
    updateCharts: function (json) {
      this.setDataSets();

      this.gChart.data.labels = json.stamps;
      this.eChart.data.labels = json.stamps;

      if (this.devid !== "") {
        this.eChart.data.datasets[2].data = json.verbruik;
        this.eChart.data.datasets[3].data = json.terug;
        this.eChart.data.datasets[0].data = json.mijnverbruik;
        this.eChart.data.datasets[1].data = json.mijnterug;
        this.gChart.data.datasets[1].data = json.gas;
        this.gChart.data.datasets[0].data = json.mijngas;
      } else {
        this.eChart.data.datasets[0].data = json.verbruik;
        this.eChart.data.datasets[1].data = json.terug;
        this.gChart.data.datasets[0].data = json.gas;
      }

      this.count = 0;
      for (let x = 0; x < json.count.length; x++) this.count += json.count[x];
      this.count /= json.count.length;
      this.count = Math.round(10 * this.count) / 10;

      /*let label;
      this.devids.forEach((option) => {
        if (option.val === this.devid) label = option.label;
      });*/

      this.eChart.options.title.text = "Electriciteit [kWh]";
      this.gChart.options.title.text = "Gas [m3]";
      this.eChart.update();
      this.gChart.update();
    },
    setDataSets: function () {
      let e = [];
      let g = [];
      //if (this.$root.cookieMeterid !== "") {
      if (this.devid !== "") {
        e.push({
          type: "line",
          borderWidth: 1,
          pointRadius: 2,
          fill: false,
          data: [],
          label: "verbruik meter " + this.devid,
          borderColor: "#038",
        });
        e.push({
          type: "line",
          borderWidth: 1,
          pointRadius: 2,
          fill: false,
          data: [],
          label: "teruglevering meter " + this.devid,
          borderColor: "#c30",
        });
        g.push({
          type: "line",
          borderWidth: 1,
          pointRadius: 2,
          fill: false,
          data: [],
          label: "verbruik meter " + this.devid,
          borderColor: "#151",
          //backgroundColor: "#161",
        });
      }

      e.push({
        data: [],
        label: "gemiddeld verbruik homerus",
        backgroundColor: "#1f77b4",
      });
      e.push({
        data: [],
        label: "gemiddeld teruglevering homerus",
        backgroundColor: "#ff7f0e",
      });
      g.push({
        data: [],
        label: "gemiddeld verbruik homerus",
        backgroundColor: "#2ca02c",
      });
      this.eChart.data.datasets = e;
      this.gChart.data.datasets = g;
    },

    createCharts: function () {
      this.eChart = new Chart("eChart", {
        type: "bar",
        data: {
          labels: [],
          datasets: [],
        },
        options: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            fontSize: 16,
          },
        },
      });
      this.gChart = new Chart("gChart", {
        type: "bar",
        data: {
          labels: [],
          datasets: [],
        },
        options: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            fontSize: 16,
          },
        },
      });
    },
  },
 
  mounted() {
    this.devid = this.$root.cookieMeterid;
    this.createCharts();
    getEnergyData(this, this.updateCharts);
  },
  updated() {},
  destroyed() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
