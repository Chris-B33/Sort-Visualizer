var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");

var cWidth  = ctx.canvas.width  = window.innerWidth;
var cHeight = ctx.canvas.height = Math.floor(window.innerHeight / 2);

var slider = document.getElementById("slider");
var slider_value = document.getElementById("slider-value");

var rainbow_switch = document.getElementById("rainbow-switch");

var array = [];
var states = [];
var rainbow_vals = [];
createArray(128);

setInterval(async function() {
    cWidth  = ctx.canvas.width  = Math.floor(window.innerWidth * 0.9);
    cHeight = ctx.canvas.height = Math.floor((window.innerHeight / 2) * 0.9);

    slider_value.innerHTML = slider.value;

    if (sorting) {
        slider.disabled = true;
    } else {
        slider.disabled = false;
    }

    drawCurrentArray();
}, 0);

slider.onchange = function() {
    if (!sorting) {
        createArray(slider.value);
    }
}