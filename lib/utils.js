function delay(delayInms) {
    return new Promise(resolve => setTimeout(resolve, delayInms));
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

function isArraySorted() {
    for (let i=0; i<array.length; i++) {
        if (!(array[i] == i + 1)) {
            return false;
        }
    }
    return true;
}

async function highlightSortedArray() {
    for (let i=0; i<states.length; i++) {
        states[i] = 1;
        await delay(Math.floor(SORT_TIME / Math.pow(array.length, 2)));
    }
}

function createArray(arraySize) {
    array = [];
    states = [];
    for (let i=0; i<arraySize; i++) {
        array.push(i+1);
        states.push(-1);
    }
    createRainbowVals();
}

function createRainbowVals(){
    rainbow_vals = [];
    let interval = 360 / array.length;
    for (let i=0; i<array.length; i++) {
        rainbow_vals.push('hsl('+ Math.floor(i*interval) +',100%,50%)');
    }
}

function drawCurrentArray() {
    var elem;
    var hRatio = cHeight / array.length;
    var wRatio = cWidth  / array.length;
    
    ctx.fillStyle = "lightgray";
    ctx.rect(0, 0, cWidth, cHeight);

    for (let i=0; i<array.length; i++) {
        elem = array[i];

        if (states[i] == 0 || states[i] == 1) {
            playSound(Math.floor(array[i]));
        }

        if (states[i] == 0) {
            ctx.fillStyle = '#E04444';
        } else if (states[i] == 1) {
            ctx.fillStyle = '#77E077';
        } else if (rainbow_switch.checked) {
            ctx.fillStyle = rainbow_vals[elem-1]; // Get rainbow value
        } else {
            ctx.fillStyle = "black";
        }

        ctx.beginPath();
        ctx.rect(i*wRatio, cHeight-(elem*hRatio), wRatio, elem*hRatio);
        ctx.fill();
    } 
}