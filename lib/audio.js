const SOUND_UPPER_BOUND = 1500; // Frequency upper bound
const SOUND_LOWER_BOUND = 100;  // Frequency lower bound

const audioCtx = new AudioContext();
var volume = audioCtx.createGain();
volume.gain.value = 0.05;

const oscillator = audioCtx.createOscillator();
oscillator.type = "triangle";
oscillator.connect(volume);
volume.connect(audioCtx.destination);

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