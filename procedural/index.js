// Задача: грани кубика => график бросков для 6-24
// Array<number>(6) => chart.js
var numberOfTries = 1000;
var morales = new Array(18).fill(null).map(function (_, i) { return i + 6; }); // 6-24
var die = [1, 1, 2, 2, 3, 3];
var roll = function () { return die[Math.floor(Math.random() * 6)]; };
var _loop_1 = function (totalMorale) {
    var rollsToFail = [];
    for (var tryNumber = 0; tryNumber < numberOfTries; tryNumber++) {
        var rollToFail = 0;
        var morale = totalMorale;
        while (morale > 0) {
            morale -= roll();
            rollToFail++;
        }
        rollsToFail.push(rollToFail);
    }
    var rollsToFailGrouped = rollsToFail.reduce(function (acc, rollsToFail, index) {
        var key = String(rollsToFail);
        if (acc[rollsToFail]) {
            acc[key]++;
        }
        else {
            acc[key] = 1;
        }
        return acc;
    }, {});
    var labels = Object.keys(rollsToFailGrouped).sort(function (key) {
        return Number(key);
    });
    var chartData = {
        type: "bar",
        data: {
            datasets: [
                {
                    data: labels.map(function (label) { return rollsToFailGrouped[label]; }),
                    label: "flat",
                    backgroundColor: labels.map(function () { return "rgba(255, 99, 132, 0.2)"; }),
                    borderColor: labels.map(function () { return "rgba(255,99,132,1)"; })
                }
            ],
            labels: labels
        }
    };
    var container = document.getElementById("container");
    var header = document.createElement("h2");
    header.innerText = "Мораль: " + totalMorale;
    var canvas = document.createElement("canvas");
    container.appendChild(header);
    container.appendChild(canvas);
    var Chart = window["Chart"];
    var chart = new Chart(canvas.getContext("2d"), chartData);
};
for (var totalMorale = 6; totalMorale <= 24; totalMorale++) {
    _loop_1(totalMorale);
}
