//// VARIABLES ////
const SORT_TIME = 10000;
const SOUND_UPPER_BOUND = 600;
const SOUND_LOWER_BOUND = 200;

var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");

var slider = document.getElementById("slider");
var slider_value = document.getElementById("slider-value");

var rainbow_switch = document.getElementById("rainbow-switch");

var pipe_switch = document.getElementById("pipe-switch");
var pipe = new Audio('pipe.mp3');

const audioCtx = new AudioContext();
const oscillator = audioCtx.createOscillator();
oscillator.type = "triangle";
oscillator.connect(audioCtx.destination);

var cWidth  = ctx.canvas.width  = window.innerWidth;
var cHeight = ctx.canvas.height = Math.floor(window.innerHeight / 2);

var array   = [];
var states = [];
var rainbow_vals = [];
createArray(128);

var sorting = false;




//// HELPER FUNCTIONS ////
function createArray(arraySize) {
    array = [];
    states = [];
    for (let i=0; i<arraySize; i++) {
        array.push(i+1);
        states.push(-1);
    }
    createRainbowVals();
}

function isSorted() {
    for (let i=0; i<array.length; i++) {
        if (!(array[i] == i + 1)) {
            return false;
        }
    }
    return true;
}

function drawCurrentArray() {
    var elem;
    var hRatio = cHeight / array.length;
    var wRatio = cWidth  / array.length;
    
    ctx.fillStyle = "lightgray";
    ctx.rect(0, 0, cWidth, cHeight);

    for (let i=0; i<array.length; i++) {
        elem = array[i];

        switch (states[i]) {
            case 0: 
            case 1:
                playSound(Math.floor(i * 5));
                break;
        }

        if (states[i] == 0) {
            ctx.fillStyle = '#E04444';
        } else if (states[i] == 1) {
            ctx.fillStyle = '#77E077';
        } else if (rainbow_switch.checked) {
            ctx.fillStyle = getRainbowVal(elem); // Get rainbow value
        } else {
            ctx.fillStyle = "black";
        }

        ctx.beginPath();
        ctx.rect(i*wRatio, cHeight-(elem*hRatio), wRatio, elem*hRatio);
        ctx.fill();
    }
    
}

async function swap(pos1, pos2, del) {
    states[pos1] = 0;
    states[pos2] = 0;

    var temp = array[pos1];
    array[pos1] = array[pos2];
    array[pos2] = temp;

    await delay(del);

    states[pos1] = -1;
    states[pos2] = -1;
}

function playSound(hz) {
    let hertz = parseFloat(hz);
    if (pipe_switch.checked) {
        pipe.play();
    } else if (isFinite(hertz)) {
        let interval = (SOUND_UPPER_BOUND - SOUND_LOWER_BOUND) / array.length;
        hertz = SOUND_LOWER_BOUND + (hertz * interval);
        oscillator.frequency.setValueAtTime(hertz, audioCtx.currentTime);
    }
    if (audioCtx.state === 'suspended') {
        oscillator.start();
    }
}

function createRainbowVals(){
    rainbow_vals = [];
    let interval = 360 / array.length;
    for (let i=0; i<array.length; i++) {
        rainbow_vals.push('hsl('+ Math.floor(i*interval) +',100%,50%)');
    }
}

function getRainbowVal(num) {
    return rainbow_vals[num-1];
}

function delay(delayInms) {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}




//// LOOP ////
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




//// SORTING ALGORITHMS ////
async function startSort() {
    sorting = true;
    oscillator.connect(audioCtx.destination);
    for (let i=0; i<states.length; i++) {
        states[i] = -1;
    }
}

async function showSorted() {
    for (let i=0; i<states.length; i++) {
        states[i] = 1;
        await delay(Math.floor(SORT_TIME / Math.pow(array.length, 2)));
    }
}

async function endSort() {
    sorting = false;
    oscillator.disconnect(audioCtx.destination);
}

async function resetArray() {
    if (sorting) {return}
    await startSort();

    var randomNum;
    for (let i=0; i<array.length; i++) {
        randomNum = Math.floor((Math.random() * array.length));
        selected = randomNum;
        await swap(i, randomNum, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
    }

    await endSort(); 
}

async function bubbleSort() {
    if (sorting) {return}
    await startSort();

    for (let i=0; i<array.length; i++) {
        for (let j=0; j<array.length-1; j++) {
            if (array[j] > array[j+1]) {
                await swap(j, j+1, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
            }
        }
    }

    await showSorted();
    await endSort();
}

async function insertionSort() {
    if (sorting) {return}
    await startSort();

    for (let i=0; i<array.length; i++) {
        for (let j=0; j<i; j++) {
            if (array[i] < array[j]) {
                await swap(i, j, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
            }
        }
    }

    await showSorted();
    await endSort();
}


async function cocktailSort() {
    if (sorting) {return}
    await startSort();

    for (let i=0; i<array.length; i++) {
        for (let j=0; j<array.length-1; j++) {
            if (array[j] > array[j+1]) {
                await swap(j, j+1, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
            }
        }
        for (let j=array.length - i - 1; j>0; j--) {
            if (array[j-1] > array[j]) {
                await swap(j-1, j, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
            }
        }
    }

    await showSorted();
    await endSort();
}


async function selectionSort() {
    if (sorting) {return}
    await startSort();
 
    for (let i = 0; i < array.length; i++)
    {
        let min_idx = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[min_idx]) {
                min_idx = j;
                await delay(1);
            }
        }

        if (min_idx != i) {
            await swap(min_idx, i, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
        }
    }

    await showSorted();
    await endSort();
}

async function quickSort() {
    if (sorting) {return}
    await startSort();

    if (!isSorted()) {
        await quick_sort(0, array.length - 1)
    };

    await showSorted();
    await endSort();
}

async function quick_sort(start, end) {
    if (start >= end) {
      return;
    }
    let index = await partition(start, end);
    states[index] = -1;
  
    await quick_sort(start, index - 1),
    await quick_sort(index + 1, end)
  }
  
  async function partition(start, end) {
    let pivotValue = array[end];
    let pivotIndex = start;
    states[pivotIndex] = 0;
    for (let i = start; i < end; i++) {
      if (array[i] < pivotValue) {
        await swap(i, pivotIndex, Math.floor(SORT_TIME / (array.length * Math.log2(array.length))));
        pivotIndex++;
      }
    }
    await swap(pivotIndex, end, Math.floor(SORT_TIME / (array.length * Math.log2(array.length))));
  
    for (let i = start; i < end; i++) {
      if (i != pivotIndex) {
        states[i] = -1;
      }
    }
  
    return pivotIndex;
  }


  async function mergeSort() {
    if (sorting) {return}
    await startSort();

    if (!isSorted()) {
        await merge_sort(0, array.length - 1);
    }

    await showSorted();
    await endSort();
}

async function merge_sort(start, end) {
    // Base Case
    if (start >= end) {
        return;
    }

    // Recursive Case
    let middle = Math.floor((start + end) / 2);
    await merge_sort(start, middle);
    await merge_sort(middle + 1, end);
    await merge_arrays(start, middle, end);
}

async function merge_arrays(start, middle, end) {
    var left = [];
    var right = [];
    for (let i = start; i <= middle; i++) {
        left.push(array[i]);
    }
    for (let j = middle+1; j <= end; j++) {
        right.push(array[j]);
    }

    let arr = [];
    
    while (left.length && right.length) {
        if (left[0] < right[0]) {
           arr.push(left.shift())
        } else {
           arr.push(right.shift())
        }
    }

    arr = [ ...arr, ...left, ...right]

    console.log("this is arr: ", arr)
    for (let k=start; k<=end; k++) {
        states[k] = 0;
        array[k] = arr.shift();
        await delay(SORT_TIME / (array.length * Math.log2(array.length)));
        states[k] = -1;
    }
}
