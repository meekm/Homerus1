<template>
  <div id="Header">
    <div class="w3-bar w3-blue">
      <div class="w3-bar-item w3-xlarge">{{ title }}</div>
      <div class="w3-bar-item w3-button w3-right w3-round-large" @click="show">
        <i class="fa fa-tachometer fa-2x"></i> {{ $root.cookieMeterid }}
      </div>
    </div>

    <!--div class="w3-bar w3-white">
      <div class="w3-bar-item w3-button">Dashboard</div>
      <div class="w3-bar-item w3-button">Energie</div>
      <div class="w3-bar-item w3-button">Fijnstof</div>
    </div-->

    <div class="w3-modal" ref="id01">
      <div class="w3-modal-content" style="width: 280px">
        <div class="w3-container w3-blue">
          <span class="w3-button w3-display-topright" @click="cancel"
            ><i class="fa fa-window-close fa-1x"></i
          ></span>

          <h4>Slimmemeter nummer</h4>
        </div>
        <div class="w3-container w3-light-grey">
          <p>
            Om je eigen verbruik te kunnen zien, voer de laatste 9 cijfers van
            je meter in:
          </p>

          <div class="w3-bar">
            <input
              class="w3-bar-item w3-input w3-border w3-round-large w3-margin"
              style="width: 120px"
              type="text"
              v-model="inputTxt"
            />
            <button
              class="w3-bar-item w3-button w3-blue w3-round-large w3-margin"
              :disabled="disableBtn"
              @click="ok"
            >
              ok
            </button>
          </div>
          <p style="color: red">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Header",
  props: {
    title: String,
  },
  data() {
    return {
      inputTxt: "",
      btnDisabled: true,
      error: "",
    };
  },
  computed: {
    disableBtn: function () {
      //this.error = "";
      let pattern = /^\d{9}$/;
      return !pattern.test(this.inputTxt);
    },
  },
  methods: {
    show: function () {
      this.error = "";
      this.$refs.id01.style.display = "block";
    },
    ok: function () {
      this.getMeterId(this);
    },
    cancel: function () {
      this.$refs.id01.style.display = "none";
    },
    getMeterId: function (me) {
      var query = { topic: "meterid", meterid: me.inputTxt };
      var ws = new WebSocket(this.$root.urlWebSocket);
      ws.onopen = function () {
        ws.send(JSON.stringify(query));
      };
      ws.onmessage = function (event) {
        var json = JSON.parse(event.data);
        //console.log("meterid data:");
        //console.log(json);

        if (json === undefined || json.topic !== "meterid") {
          console.log("invalid meterid message");
          return;
        }
        if (json.meterid !== "") {
          me.setCookie("meterid", json.meterid, 30);
          me.inputTxt = me.$root.cookieMeterid = json.meterid;
          me.$emit('meterIdChanged', json.meterid);   // fire event to parent
          me.$refs.id01.style.display = "none";
        } else {
          me.error = "nummer is onbekend in het systeem";
        }
      }; // end onmessage
    },
    setCookie: function (cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getCookie: function (cname) {
      let regex = cname + "=(\\w+)";
      let cookies = decodeURIComponent(document.cookie);
      let found = cookies.match(new RegExp(regex));
      //console.log(found);
      return found !== null ? found[1] : "";
    },
  },
  mounted() {
    // check cookie
    this.inputTxt = this.$root.cookieMeterid = this.getCookie("meterid");
    //this.setCookie("marcel meek", "test123", 3);
  },
};
</script>
