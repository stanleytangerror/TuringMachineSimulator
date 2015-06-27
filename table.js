var actions = {};
var tape = [];

function addRow() {
      var tbody = document.getElementById("action-table-body");

      var row = document.createElement("tr");
      row.setAttribute("class", "row-action");
      tbody.appendChild(row);

      if (tbody.children != null) {
            var len = tbody.children.length;
      } else {
            var len = 0;
      }

      var state = row.appendChild(document.createElement("th"));
      state.innerHTML = len.toString();
      var i = 1;
      for (; i <= 2; ++i) {
            row.insertCell(i).innerHTML =
            "<input type=\"text\" " +
            "class=\"form-control\" " +
            "maxlength=\"4\" " +
            "onchange=\"register(this, " + len + ", " + (i - 1) + ")\">" +
            "</input>";
      }
}

function rmRow() {
      var tbody = document.getElementById("action-table-body");
      debugger
      if (tbody.children.length > 0) {
            clearTableCell(tbody.children.length, 0);
            clearTableCell(tbody.children.length, 1);
            tbody.removeChild(tbody.lastElementChild);
      }
}

function action(value) {
      return {
            setMark: value[0],
            move: value[1],
            nextState: value.slice(2, value.length)
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

function getTableCell(state, mark) {
      var tbody = document.getElementById("action-table-body");
      debugger
      while (tbody.children === null
            || tbody.children.length < state) {
            addRow();
      }
      var tr = tbody.children[state - 1];
      var td = tr.children[mark + 1];
      return td.children[0];
}

function setTableCell(state, mark, value) {
      var input = getTableCell(state, mark);
      input.value = value;
      input.onchange();
}

function clearTableCell(state, mark) {
      if (state in actions
            && mark in actions[state]) {
            delete actions[state][mark];
      }
      var input = getTableCell(state, mark);
      input.value = "";
}

function clearTable() {
      document.getElementById("next-button").disabled = true;
      actions = {};
      var tbody = document.getElementById("action-table-body");
      var i;
      //      debugger
      for (i = 0; i < tbody.children.length; ++i) {
            tbody.children[i].children[1].children[0].value = "";
            tbody.children[i].children[2].children[0].value = "";
      }
}

function Z() {
      clearTable();
      setTableCell(1, 0, "1O2");
      setTableCell(1, 1, "0R1");
      document.getElementById("tape-value").value = "011100";
}

function S() {
      clearTable();
      setTableCell(1, 0, "1L2");
      setTableCell(1, 1, "1R1");
      setTableCell(2, 0, "0R3");
      setTableCell(2, 1, "1L2");
      document.getElementById("tape-value").value = "011100";
}

function K() {
      clearTable();
      setTableCell(1, 0, "0R2");
      setTableCell(1, 1, "1R1");
      setTableCell(2, 0, "0L3");
      setTableCell(2, 1, "0R2");
      setTableCell(3, 0, "0L3");
      setTableCell(3, 1, "1L4");
      setTableCell(4, 0, "0R5");
      document.getElementById("tape-value").value = "01110111110";
}

function L() {
      clearTable();
      setTableCell(1, 0, "0R2");
      setTableCell(1, 1, "0R1");
      document.getElementById("tape-value").value = "01110111110";
}

function pred() {
      clearTable();
      setTableCell(1, 1, "0R2");
      setTableCell(2, 0, "1O3");
      document.getElementById("tape-value").value = "01110";
}

function add() {
      clearTable();
      setTableCell(1, 0, "1L2");
      setTableCell(1, 1, "1R1");
      setTableCell(2, 0, "0R3");
      setTableCell(2, 1, "1L2");
      setTableCell(3, 1, "0R4");
      setTableCell(4, 1, "0R5");
      document.getElementById("tape-value").value = "01110111110";
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
      painter.fillText("↑", baseX + 20 * index, baseY + 20 * 1, 20);
      //      painter.fillText(String.fromCharCode(8593), baseX + 20 * index, baseY + 20 * 1, 20);
      painter.fillText(state, baseX + 20 * index, baseY + 20 * 2, 20);
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