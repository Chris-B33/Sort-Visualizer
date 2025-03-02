//// VARIABLES ////
const SORT_TIME = 10000;
const SOUND_UPPER_BOUND = 1500;
const SOUND_LOWER_BOUND = 100;

var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");

var slider = document.getElementById("slider");
var slider_value = document.getElementById("slider-value");

var rainbow_switch = document.getElementById("rainbow-switch");

const audioCtx = new AudioContext();
var volume = audioCtx.createGain();
volume.gain.value = 0.05;

const oscillator = audioCtx.createOscillator();
oscillator.type = "triangle";
oscillator.connect(volume);
volume.connect(audioCtx.destination);

var cWidth  = ctx.canvas.width  = window.innerWidth;
var cHeight = ctx.canvas.height = Math.floor(window.innerHeight / 2);

var array = [];
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
                playSound(Math.floor(array[i]));
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
    if (isFinite(hertz)) {
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
    volume.connect(audioCtx.destination);
    for (let i=0; i<states.length; i++) {
        states[i] = -1;
    }
}

async function updateInfo(sort_name) {
    let ip_name = sort_name + "-ip";
    let table = document.getElementById("table-information");

    for (let i = 0; i < table.rows.length; i++) { 
        if (table.rows[i].classList.contains(ip_name) || table.rows[i].classList.contains("table-heading")) {
            setTimeout(() => {
                table.rows[i].style.display = "table-row";
                table.rows[i].classList.add("ip-shown");
                table.rows[i].classList.remove("ip-hidden");
            }, 500);
        } else {
            table.rows[i].classList.add("ip-hidden");
            table.rows[i].classList.remove("ip-shown");

            setTimeout(() => {
                table.rows[i].style.display = "none";
            }, 500);
        }
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
    volume.disconnect(audioCtx.destination);
}

async function resetArray() {
    if (sorting) {return}
    await startSort();

    for (let i=0; i<array.length; i++) {
        states[i] = 0;
        array[i] = i+1;
        await delay(1);
        states[i] = -1;
    }

    await endSort(); 
}

async function randomizeArray() {
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

async function reverseArray() {
    if (sorting) {return}
    await startSort();

    flip(0, array.length);

    await endSort(); 
}

async function bubbleSort() {
    if (sorting) {return}
    await startSort();
    await updateInfo("bubble");

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
    await updateInfo("insertion");

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
    await updateInfo("cocktail");

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
    await updateInfo("selection");
 
    for (let i = 0; i < array.length; i++)
    {
        let min_idx = i;
        for (let j = i + 1; j < array.length; j++) {
            states[j] = 0;
            if (array[j] < array[min_idx]) {
                min_idx = j;
                await delay(1);
            }
            states[j] = -1;
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
    await updateInfo("quick");

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
    await updateInfo("merge");

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
    var left = [], right = [];
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

    for (let k=start; k<=end; k++) {
        states[k] = 0;
        array[k] = arr.shift();
        await delay(SORT_TIME / (array.length * Math.log2(array.length)));
        states[k] = -1;
    }
}

async function radixSort() {
    if (sorting) {return}
    await startSort();
    await updateInfo("radix");

    if (!isSorted()) {
        await radix_sort();
    }

    await showSorted();
    await endSort();
}

async function radix_sort() {
    let maxDigitCount = mostDigits(array)
    for (let k = 0; k < maxDigitCount; k++) {
        let digitBuckets = Array.from({ length: 10 }, () => [])
        for (let i = 0; i < array.length; i++) {
            let digit = getDigit(array[i], k)
            digitBuckets[digit].push(array[i])
        }

        arr = [].concat(...digitBuckets)
        for (let k=0; k<array.length; k++) {
            states[k] = 0;
            array[k] = arr.shift();
            await delay(SORT_TIME / (maxDigitCount * (array.length + 10)));
            states[k] = -1;
        }
    }
}

function mostDigits(nums) {
    let maxDigits = 0
    for (let i = 0; i < nums.length; i++) {
      maxDigits = Math.max(maxDigits, digitCount(nums[i]))
    }
    return maxDigits
}

function digitCount(num) {
    if (num === 0) return 1
    return Math.floor(Math.log10(Math.abs(num))) + 1
}

function getDigit(num, place) {
    return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10
}

async function bucketSort() {
    if (sorting) {return}
    await startSort();
    await updateInfo("bucket");

    if (!isSorted()) {
        await bucket_sort(Math.floor(Math.sqrt(array.length)));
    }

    await showSorted();
    await endSort();
}
  
async function bucket_sort(bs) {
    var minIndex = 0;
    var maxIndex = 0;
    var bucketSize = bs || 5;

    for (let i=0; i<array.length; i++) {
        states[i] = 0;
        states[minIndex] = 0;
        states[maxIndex] = 0;

        if (array[i] < array[minIndex]) {
            states[minIndex] = -1;
            minIndex = i;
        }
        if (array[i] > array[maxIndex]) {
            states[maxIndex] = -1;
            maxIndex = i;
        }
        
        await delay(1);

        states[i] = -1;
        states[minIndex] = -1;
        states[maxIndex] = -1;
    }

    var bucketCount = Math.floor((array[maxIndex] - array[minIndex]) / bucketSize) + 1;
    var allBuckets = new Array(bucketCount);
    
    for (let j = 0; j < allBuckets.length; j++) {
      allBuckets[j] = [];
    }

    array.forEach(function (currentVal) {
        allBuckets[Math.floor((currentVal - array[minIndex]) / bucketSize)].push(currentVal);
    });

    count = 0;
    for (let k=0; k<allBuckets.length; k++) {
        for (let l=0; l<allBuckets[k].length; l++) {
            states[count] = 0;

            array[count] = allBuckets[k][l];

            await delay(Math.floor(SORT_TIME / Math.pow((array.length + bucketCount), 2)));
            states[count] = -1;
            count++;
        }
    }
    
    var start = 0, end = bucketSize;
    for (let m=0; m<allBuckets.length - 1; m++) {
        await insertionSort2(start, end)
        start += allBuckets[m].length;
        end += allBuckets[m+1].length;
    }
    await insertionSort2(start, end);
}

async function insertionSort2(start, end) {
    for (let i=start; i<end; i++) {
        for (let j=start; j<i; j++) {
            if (array[i] < array[j]) {
                await swap(i, j, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
            }
        }
    }
}

async function shellSort() {
    if (sorting) {return}
    await startSort();
    await updateInfo("shell");

    if (!isSorted()) {
        await shell_sort();
    }

    await showSorted();
    await endSort();
}

async function shell_sort() {
    for (let gap = Math.floor(array.length/2); gap > 0; gap = Math.floor(gap/2))	{
        for (let i = gap; i < array.length; i += 1)  {
            let temp = array[i];
			for (let j = i; j >= gap && array[j-gap] > temp; j-=gap)  {
                swap(j, j-gap, 1);
			}
            await delay(SORT_TIME / (array.length * Math.log2(array.length)))
		}
	}
}

async function pancakeSort() {
    if (sorting) {return}
    await startSort();
    await updateInfo("pancake");

    if (!isSorted()) {
        await pancake_sort();
    }

    await showSorted();
    await endSort();
}

async function pancake_sort() {
    for (let curr_size = array.length - 1; curr_size > 1; curr_size--) {
        let mi = await findMax(0, curr_size + 1);
        await flip(0, mi + 1);
        await flip(0, curr_size + 1);
    }
}

async function flip(start, end) {
    for (let i=0; i<Math.floor((end-start) / 2); i++) {
        await swap(start + i, end - i - 1, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
    }
}

async function findMax(start, end) {
    let i, mi;
    for (i = start, mi = start; i < end; i++) {
        if (array[i] > array[mi]) {
            mi = i;
        }
    }   
    return mi;
}

async function heapSort() {
    if (sorting) {return}
    await startSort();
    await updateInfo("heap");

    if (!isSorted()) {
        await heap_sort();
    }

    await showSorted();
    await endSort();
}

async function heap_sort() {
    // Build heap (rearrange array)
    for (var i = Math.floor(array.length / 2) - 1; i >= 0; i--)
        await heapify(array.length, i);

    // One by one extract an element from heap
    for (var i = array.length - 1; i > 0; i--) {
        // Move current root to end
        await swap(0, i, SORT_TIME / (array.length * array.length));

        // call max heapify on the reduced heap
        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    var largest = i; // Initialize largest as root
    var l = 2 * i + 1; // left child index = 2*i + 1
    var r = 2 * i + 2; // right child index = 2*i + 2

    // If left child is larger than root
    if (l < n && array[l] > array[largest])
        largest = l;

    // If right child is larger than largest so far
    if (r < n && array[r] > array[largest])
        largest = r;

    // If largest is not root
    if (largest != i) {
        await swap(largest, i, SORT_TIME / (array.length * array.length));

        // Recursively heapify the affected sub-tree
        await heapify(n, largest);
    }
}