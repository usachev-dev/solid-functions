var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function rand(n) {
    return Math.floor(Math.random() * n);
}
function rollFlat() {
    var result = [1, 2, 3][rand(3)];
    return result;
}
function rollSkewed() {
    return [1, 2, 2, 2, 2, 3][rand(6)];
}
var morales = new Array(18).fill(null).map(function (_, i) { return i + 6; }); //6-24
function getRollsToFail(startMorale, roll) {
    var result = 0;
    var morale = startMorale;
    while (morale > 0) {
        morale -= roll();
        result++;
    }
    return result;
}
var numberOfTries = 1000;
function getRollsToFailSkewed(startMorale) {
    return new Array(numberOfTries)
        .fill(null)
        .map(function () { return getRollsToFail(startMorale, rollSkewed); });
}
function getRollsToFailFlat(startMorale) {
    return new Array(numberOfTries)
        .fill(null)
        .map(function () { return getRollsToFail(startMorale, rollFlat); });
}
function getResults(getRolls) {
    return morales.reduce(function (acc, startMorale, index) {
        var _a;
        return __assign(__assign({}, acc), (_a = {}, _a[startMorale] = getRolls(startMorale), _a));
    }, {});
}
function getResultsFlat() {
    return getResults(getRollsToFailFlat);
}
function getResultsSkewed() {
    return getResults(getRollsToFailSkewed);
}
function getReport(getResults) {
    var results = getResults();
    return Object.keys(results)
        .map(Number)
        .reduce(function (acc, startMorale, index) {
        var _a;
        return __assign(__assign({}, acc), (_a = {}, _a[startMorale] = results[startMorale].reduce(function (ac, rolls, index) {
            if (Object.keys(ac).includes(rolls.toString())) {
                ac[rolls]++;
            }
            else {
                ac[rolls] = 1;
            }
            return ac;
        }, {}), _a));
    }, {});
}
var reportFlat = getReport(getResultsFlat);
var reportSkewed = getReport(getResultsSkewed);
console.log(reportFlat);
console.log(reportSkewed);
var Chart = window["Chart"];
var container = document.getElementById("container");
Object.keys(reportFlat).forEach(function (startMorale) {
    var header = document.createElement("h2");
    header.innerText = "Мораль: " + startMorale;
    var canvas = document.createElement("canvas");
    container.appendChild(header);
    container.appendChild(canvas);
    var dataFlat = Object.keys(reportFlat[startMorale]).map(function (key) { return reportFlat[startMorale][key]; });
    var dataSkewed = Object.keys(reportSkewed[startMorale]).map(function (key) { return reportSkewed[startMorale][key]; });
    var labels = Object.keys(reportFlat[startMorale]);
    console.log(dataFlat, labels);
    var chart = new Chart(canvas.getContext("2d"), {
        type: "bar",
        data: {
            datasets: [
                {
                    data: dataFlat,
                    label: "flat",
                    backgroundColor: labels.map(function () { return "rgba(255, 99, 132, 0.2)"; }),
                    borderColor: labels.map(function () { return "rgba(255,99,132,1)"; })
                },
                {
                    data: dataSkewed,
                    label: "skewed",
                    backgroundColor: labels.map(function () { return "rgba(54, 162, 235, 0.2)"; }),
                    borderColor: labels.map(function () { return "rgba(54, 162, 235)"; })
                }
            ],
            labels: labels
        }
    });
});
