<template>
  <div class="Dust">
    <h3>{{ title }}</h3>
    <div class="w3-cell-row">
      <div class="w3-border-0 w3-cell" style="width: 50%">
        <Gauge title="PM2.5 laatste 24 uur" ranges="5,20,30" ref="pm25day" />
      </div>
      <div class="w3-border-0 w3-cell">
        <Gauge title="PM10 laatste 24 uur" ranges="15,40,60" ref="pm10day" />
      </div>
    </div>
    <div class="w3-cell-row">
      <div class="w3-border-0 w3-cell" style="width: 50%">
        <Gauge title="PM2.5 laatste 4 weken" ranges="5,20,30" ref="pm25month" />
      </div>
      <div class="w3-border-0 w3-cell">
        <Gauge title="PM10 laatste 4 weken" ranges="15,40,60" ref="pm10month" />
      </div>
    </div>
    <div class="w3-panel">Advieswaarden fijnstof gem. per dag:</div>
    <table class="w3-table" style="line-height: 0.5">
      <tr>
        <th></th>
        <th>PM 2,5</th>
        <th>PM 10</th>
      </tr>
      <tr>
        <td>WHO</td>
        <td>5 µ/m³</td>
        <td>15 µ/m³</td>
      </tr>
      <tr>
        <td>EU</td>
        <td>20 µ/m³</td>
        <td>40 µ/m³</td>
      </tr>
    </table>
    <ul>
      <li>onder grenswaarde WHO: groen</li>
      <li>tussen grenswaarden WHO en EU: geel</li>
      <li>boven grenswaarde EU: rood</li>
    </ul>
  </div>
</template>

<script>
import Gauge from "./Gauge";

export default {
  name: "Dust",
  components: {
    Gauge,
  },
  props: {
    title: String,
  },
  data() {
    return {};
  },
  methods: {
    getDust: function (me) {
      var q = { topic: "dust" };
      var ws = new WebSocket(me.$root.urlWebSocket);
      ws.onopen = function () {
        ws.send(JSON.stringify(q));
      };
      ws.onmessage = function (event) {
        var json = JSON.parse(event.data);
        //console.log(json);

        if (json === undefined || json.topic !== "dust") {
          console.log("invalid dust message");
          return;
        }
        me.$refs.pm25day.setValue(json.pm25Day);
        me.$refs.pm10day.setValue(json.pm10Day);
        me.$refs.pm25month.setValue(json.pm25Month);
        me.$refs.pm10month.setValue(json.pm10Month);
      };
    },
  },
  mounted() {
    this.getDust(this);
  },
};
</script>
<style scoped/>

