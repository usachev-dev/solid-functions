// Новое требование: сравнивать несколько разных кубиков
var numberOfTries = 1000;
var morales = new Array(18).fill(null).map(function(_, i) {
  return i + 6;
}); // 6-24
function getRoller(die) {
  return function() {
    return die[Math.floor(Math.random() * 6)];
  };
}
function getRollToFail(totalMorale, roll) {
  var rollToFail = 0;
  var morale = totalMorale;
  while (morale > 0) {
    morale -= roll();
    rollToFail++;
  }
  return rollToFail;
}
function getRollsToFail(totalMorale, roll) {
  var rollsToFail = [];
  for (var tryNumber = 0; tryNumber < numberOfTries; tryNumber++) {
    rollsToFail.push(getRollToFail(totalMorale, roll));
  }
  return rollsToFail;
}
function getGroupedRolls(rollsToFail) {
  return rollsToFail.reduce(function(acc, rollsToFail, index) {
    var key = String(rollsToFail);
    if (acc[rollsToFail]) {
      acc[key]++;
    } else {
      acc[key] = 1;
    }
    return acc;
  }, {});
}
function getLabels(rollsToFailGrouped) {
  return Object.keys(rollsToFailGrouped).sort(function(key) {
    return Number(key);
  });
}
function getChartDatas(roll) {
  return morales.map(function(totalMorale) {
    var rollsToFail = getRollsToFail(totalMorale, roll);
    var rollsToFailGrouped = getGroupedRolls(rollsToFail);
    var labels = getLabels(rollsToFailGrouped);
    var chartData = {
      type: "bar",
      data: {
        datasets: [
          {
            data: labels.map(function(label) {
              return rollsToFailGrouped[label];
            }),
            label: "flat",
            backgroundColor: labels.map(function() {
              return "rgba(255, 99, 132, 0.2)";
            }),
            borderColor: labels.map(function() {
              return "rgba(255,99,132,1)";
            })
          }
        ],
        labels: labels
      }
    };
    return chartData;
  });
}
function main(faces) {
  if (faces === void 0) {
    faces = [1, 1, 2, 2, 3, 3];
  }
  function drawCharts(chartDatas) {
    var container = document.createElement("div");
    container.id = "container";
    var Chart = window["Chart"];
    chartDatas.forEach(function(chartData, index) {
      var header = document.createElement("h2");
      header.innerText = "Мораль: " + morales[index];
      var canvas = document.createElement("canvas");
      container.appendChild(header);
      container.appendChild(canvas);
      var chart = new Chart(canvas.getContext("2d"), chartData);
    });
    var oldContainer = document.getElementById("container");
    if (oldContainer) {
      document.body.removeChild(oldContainer);
    }
    document.body.appendChild(container);
  }
  function onInputChange(event, faceIndex) {
    var value = Number(event.target.value);
    faces[faceIndex] = value;
    onParamsChange(faces);
  }
  function onParamsChange(die) {
    var roller = getRoller(die);
    var chartDatas = getChartDatas(roller);
    drawCharts(chartDatas);
  }
  function bindToInputs(onInputChange) {
    var _loop_1 = function(face) {
      var input = document.getElementById("face" + face);
      input.addEventListener("input", function(event) {
        return onInputChange(event, face);
      });
    };
    for (var face = 0; face <= 5; face++) {
      _loop_1(face);
    }
  }
  bindToInputs(onInputChange);
  onParamsChange(faces);
}
main();
