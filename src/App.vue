<template>
  <div id="app">
    <Header title="Homerus" @meterIdChanged="meterIdChanged" />

    <div class="w3-row">
      <div class="w3-third w3-container" style="min-width: 320px">
        <Weather title="Weer" class="w3-panel w3-light-grey" />
        <Dust title="Fijnstof" class="w3-panel w3-light-grey" />
      </div>
      <div class="w3-third w3-container w3-margin-top" style="min-width: 320px">
        <Energy title="Energie" class="w3-container w3-light-grey" ref="childEnergy"/>
      </div>
      <div class="w3-third w3-container w3-margin-top" style="min-width: 320px">
        <Sensor title="Sensoren" class="w3-container w3-light-grey" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Weather from "./components/Weather.vue";
import Energy from "./components/Energy.vue";
import Sensor from "./components/Sensor.vue";
import Dust from "./components/Dust.vue";

export default {
  name: "App",
  components: {
    Header,
    Energy,
    Weather,
    Dust,
    Sensor,
  },
  methods: {
    meterIdChanged: function () {
      this.$refs.childEnergy.dataChanged();
    },
  },
};
</script>

<style>
</style>
