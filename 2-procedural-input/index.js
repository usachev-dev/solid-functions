// Дадим пользователю возможность менять параметры
// Array<number>(6) => chart.js
var numberOfTries = 1000;
var morales = new Array(18).fill(null).map(function (_, i) { return i + 6; }); // 6-24
function onParamsChange(die) {
    var roll = function () { return die[Math.floor(Math.random() * 6)]; };
    var chartDatas = [];
    var _loop_2 = function (totalMorale) {
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
        var labels = Object.keys(rollsToFailGrouped).sort(function (key) { return Number(key); });
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
        chartDatas.push(chartData);
    };
    for (var totalMorale = 6; totalMorale <= 24; totalMorale++) {
        _loop_2(totalMorale);
    }
    var oldContainer = document.getElementById("container");
    if (oldContainer) {
        document.body.removeChild(oldContainer);
    }
    var container = document.createElement("div");
    container.id = "container";
    var Chart = window["Chart"];
    chartDatas.forEach(function (chartData, index) {
        var header = document.createElement("h2");
        header.innerText = "Мораль: " + morales[index];
        var canvas = document.createElement("canvas");
        container.appendChild(header);
        container.appendChild(canvas);
        var chart = new Chart(canvas.getContext("2d"), chartData);
    });
    document.body.appendChild(container);
}
var faces = [1, 1, 2, 2, 3, 3];
onParamsChange(faces);
var _loop_1 = function (face) {
    var input = document.getElementById("face" + face);
    console.log(face, "face" + face, input);
    input.addEventListener("input", function (event) { return onInputChange(event, face); });
};
for (var face = 0; face <= 5; face++) {
    _loop_1(face);
}
function onInputChange(event, faceIndex) {
    var value = Number(event.target.value);
    faces[faceIndex] = value;
    onParamsChange(faces);
}
