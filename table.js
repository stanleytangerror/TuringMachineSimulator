var actions = {};
var tape = [];

function addRow() {
      var table = document.getElementById("action-table");
      var tbody = table.children[0];
      var len = tbody.children.length;

      var row = document.createElement("tr");
      row.setAttribute("class", "row-action");
      tbody.insertBefore(row, tbody.children[len - 1].nextSibling);

      var state = row.insertCell(0);
      state.innerHTML = len.toString();
      var i = 1;
      for (; i <= 2; ++i) {
            row.insertCell(i).innerHTML =
            "<input " +
            "type=\"text\"" +
            "onchange=\"register(this, " + len + ", " + (i - 1) + ")\">" +
            "</input>";
      }
}

function rmRow() {
      var table = document.getElementById("action-table");
      var tbody = table.children[0];
      tbody.removeChild(tbody.lastElementChild);
}

function action(value) {
      return {
            setMark: value[0],
            move: value[1],
            nextState: value[2]
      }
}

function register(element, state, mark) {
      console.log("register (" + mark + ":" + state + ") = " + element.value);
      if (state in actions) {
            actions[state][mark] = action(element.value);
      } else {
            var line = {};
            line[mark] = action(element.value);
            actions[state] = line;
      }
}

function pageLoaded(lineCount) {
      var i = 0;
      for (; i < lineCount; ++i) {
            addRow();
      }
      document.getElementById("next-button").disabled = true;
//         drawMachine();
}

function machine(tapeValue) {
      var tape = tapeValue;
      var scanner = 1;
      var state = 1;
      drawMachine(tape, scanner, state);

      return (function () {
//            debugger
            if (!(state in actions
                  && tape[scanner] in actions[state])) {
                  drawMachine(tape, scanner, state);
                  return false;
            }
            var action = actions[state][tape[scanner]];
            tape[scanner] = action["setMark"];
            switch (action["move"]) {
                  case "L":
                        scanner--;
                        break;
                  case "R":
                        scanner++;
                        break;
                  default:
                        break;
            }
            state = action["nextState"];
            console.log(tape.toString());

            drawMachine(tape, scanner, state);
            return true;
      });
}

var nextStep;

function getNewMachine() {
      var input = document.getElementById("tape-value").value;
      var tapeValue = [];
      var i = 0;
      for (; i < input.length; ++i) {
            switch (input[i]) {
                  case "0":
                        tapeValue.push(0);
                        break;
                  case "1":
                        tapeValue.push(1);
                        break;
                  default:
                        break;
            }
      }
      nextStep = machine(tapeValue);
      document.getElementById("next-button").disabled = false;
}

function next(button) {
      if (!nextStep()) {
            document.getElementById("next-button").disabled = true;
      }
}

function drawMachine(tapeValue, scanner, state) {
      var tape = tapeValue;
//      var tape = [0, 1, 1, 1, 0, 0];
      var canvas = document.getElementById("machine-canvas");
      var painter = canvas.getContext("2d");
      painter.clearRect(0, 0, canvas.width, canvas.height);
      painter.fillStyle = "#000000";
      var i = 0;
//      debugger
      for (; i < tape.length; ++i) {
            drawTapeCell(painter, 10, 50, i, tape[i]);
      }
      drawScanner(painter, 10, 50, scanner, state);
//      debugger
//      painter.clearRect(0, 0, canvas.width, canvas.height);
}

function drawScanner(painter, baseX, baseY, index, state) {
      painter.fillText("^", baseX + 20 * index, baseY + 20 * 2, 20);
      painter.fillText(state, baseX + 20 * index, baseY + 20 * 3, 20);
}

function drawTapeCell(painter, baseX, baseY, index, value) {
      switch (value) {
            case 0:
            case "0":
                  painter.fillText("0", baseX + 20 * index, baseY, 20, 20);
                  break;
            case 1:
            case "1":
                  painter.fillText("1", baseX + 20 * index, baseY, 20, 20);
                  break;
            default:
                  break;
      }
}

//function drawTapeCell(painter, baseX, baseY, index, value) {
//      switch (value) {
//            case 0:
//            case "0":
//                  var grd0 = painter.createLinearGradient(0, 0, 20, 0);
//                  grd0.addColorStop(0, "#CCCCCC");
//                  grd0.addColorStop(1, "#EEEEEE");
//                  painter.fillStyle = grd0;
//                  break;
//            case 1:
//            case "1":
//                  var grd1 = painter.createLinearGradient(0, 0, 20, 0);
//                  grd1.addColorStop(0, "#0A0A0A");
//                  grd1.addColorStop(1, "#AAAAAA");
//                  painter.fillStyle = grd1;
//                  break;
//            default:
//                  break;
//      }
//      painter.fillRect(baseX + 20 * index, baseY, 20, 20);
//}