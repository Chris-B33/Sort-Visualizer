const SORT_TIME = 10000; // Aim to be 10 seconds.
let sorting = false;

const actions = {
    "resetArray": resetArray,
    "randomizeArray": randomizeArray,
    "reverseArray": reverseArray,
    "bubbleSort": bubbleSort,
    "insertionSort": insertionSort,
    "selectionSort": selectionSort,
    "cocktailSort": cocktailSort,
    "pancakeSort": pancakeSort,
    "shellSort": shellSort,
    "quickSort": quickSort,
    "mergeSort": mergeSort,
    "heapSort": heapSort,
    "bucketSort": bucketSort,
    "radixSort": radixSort
}

document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', async (event) => {
        if (sorting) {
            event.stopImmediatePropagation();
            return;
        }

        sorting = true;
        volume.connect(audioCtx.destination);
        for (let i=0; i<states.length; i++) {
            states[i] = -1;
        }
        if (button.classList.contains("sort-button")) {
            updateInfo(button.dataset.action)
        }

        await actions[button.dataset.action](0, array.length - 1);

        sorting = false;
        volume.disconnect(audioCtx.destination);
        if (button.classList.contains("sort-button")) {
            await highlightSortedArray();
        }
      });
});

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

async function flip(start, end) {
    for (let i=0; i<Math.floor((end-start) / 2); i++) {
        await swap(start + i, end - i - 1, 1);
    }
}

async function findMinElem(start, end) {
    let i, mi;
    for (i = start, mi = start; i < end; i++) {
        states[mi] = -1;
        if (array[i] < array[mi]) {
            mi = i;
        }
        states[mi] = 0;
    }
    states[mi] = -1   
    return mi;
}

async function findMaxElem(start, end) {
    let i, mi;
    for (i = start, mi = start; i < end; i++) {
        states[mi] = -1;
        if (array[i] > array[mi]) {
            mi = i;
        }
        states[mi] = 0;
    }
    states[mi] = -1   
    return mi;
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

async function randomizeArray() {
    var randomNum;
    for (let i=0; i<array.length; i++) {
        randomNum = Math.floor((Math.random() * array.length));
        selected = randomNum;
        await swap(i, randomNum, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
    }
}

async function resetArray() {
    for (let i=0; i<array.length; i++) {
        states[i] = 0;
        array[i] = i+1;
        await delay(0);
        states[i] = -1;
    }
}

async function reverseArray() {
    flip(0, array.length);
}

async function bubbleSort() {
    for (let i=0; i<array.length; i++) {
        for (let j=0; j<array.length-1; j++) {
            if (array[j] > array[j+1]) {
                await swap(j, j+1, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
            }
        }
    }
}

async function insertionSort(start, end) {
    for (let i=start; i<=end; i++) {
        for (let j=start; j<=i; j++) {
            if (array[i] < array[j]) {
                await swap(i, j, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
            }
        }
    }
}

async function selectionSort() {
    for (let i = 0; i < array.length; i++)
    {
        let min_idx = await findMinElem(i, array.length);
        await delay(Math.floor(SORT_TIME / Math.pow(array.length, 2)));
        if (min_idx != i) {
            await swap(min_idx, i, Math.floor(SORT_TIME / Math.pow(array.length, 2)));
        }
    }
}

async function cocktailSort() {
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
}

async function pancakeSort() {
    for (let curr_size = array.length - 1; curr_size > 1; curr_size--) {
        let mi = await findMaxElem(0, curr_size + 1);
        await flip(0, mi + 1);
        await flip(0, curr_size + 1);
    }
}

async function shellSort() {
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

async function quickSort(start, end) {
    if (start >= end) {
        return;
    }
    let index = await partition(start, end);
    states[index] = -1;

    await quickSort(start, index - 1),
    await quickSort(index + 1, end)
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

async function mergeSort(start, end) {
    // Base Case
    if (start >= end) {
        return;
    }

    // Recursive Case
    let middle = Math.floor((start + end) / 2);
    await mergeSort(start, middle);
    await mergeSort(middle + 1, end);
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

async function heapSort() {
    for (var i = Math.floor(array.length / 2) - 1; i >= 0; i--)
        await heapify(array.length, i);

    for (var i = array.length - 1; i > 0; i--) {
        await swap(0, i, SORT_TIME / (array.length * array.length));
        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    var largest = i;
    var l = 2 * i + 1; // left child index = 2*i + 1
    var r = 2 * i + 2; // right child index = 2*i + 2

    if (l < n && array[l] > array[largest])
        largest = l;

    if (r < n && array[r] > array[largest])
        largest = r;

    if (largest != i) {
        await swap(largest, i, SORT_TIME / (array.length * array.length));
        await heapify(n, largest);
    }
}
  
async function bucketSort() {
    var minIndex = 0;
    var maxIndex = 0;
    var bucketSize = Math.floor(Math.sqrt(array.length)) || 5;

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
        await insertionSort(start, end)
        start += allBuckets[m].length;
        end += allBuckets[m+1].length;
    }
    await insertionSort(start, end);
}

async function radixSort() {
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