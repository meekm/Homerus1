const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec"
];

export function getEnergyData(me, updateFunc) {
  var ws = new WebSocket(me.$root.urlWebSocket);
  
  ws.onopen = function () {
    var query = { topic: "energy", devid: me.devid, days: me.days };
    ws.send(JSON.stringify(query));
  };

  // message received
  ws.onmessage = function (event) {
    //console.log("ws.onmessage");
    var json = JSON.parse(event.data);

    if (
      json === undefined ||
      json.topic !== "energy" ||
      json.stamps.length === 0
    ) {
      console.log("invalid energy message");
      return;
    }
    //jsonToCSV( json);

    // convert stamps
    var tmp = [];
    json.stamps.forEach((s) => {
      var d = new Date(s);
      if (me.days < 3) tmp.push(d.getHours().toString());
      //("0" + d.getHours().toString()).slice(-2)
      else if (me.days < 90)
        tmp.push(d.getDate().toString() + " " + months[d.getMonth()]);
      else {
        tmp.push(d.getFullYear().toString() + " " + months[d.getMonth()]);
        //console.log( d.getFullYear().toString() + "-" + ("0" + (d.getMonth()+1).toString()).slice(-2) )
      }
    });
    json.stamps = tmp;

    /*var tmp2 = [];
    // convert to negative numbers
    for (let i = 0; i < json.terug.length; i++) {
      tmp2.push(-json.terug[i]);
    }
    json.terug = tmp2;
    var tmp3 = [];
    // convert to negative numbers
    for (let i = 0; i < json.mijnterug.length; i++) {
      tmp3.push(-json.mijnterug[i]);
    }
    json.mijnterug = tmp3; */

    updateFunc(json);
  }; // end onmessage
}
/*
function jsonToCSV( json) {

  for( var i=0; i< json.stamps.length; i++ ) {
    var line = json.stamps[i].toString();
    line += "," + json.verbruik[i].toString() + "," + json.terug[i] + "," + json.gas[i];
    console.log( line);
  }
}
*/
