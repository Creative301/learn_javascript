// Get Our Elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// Build out functions
/* function togglePlay() {
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
} */

// ternary
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

// Change the play/pause button
function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

// Skip the video function
function skip() {
    console.log(this.dataset.skip);
    video.currentTime += parseFloat(this.dataset.skip);   
}

// Detect the range change
function handleRangeUpdate() {
    // console.log(this.name);
    // console.log(this.value);

    video[this.name] = this.value;
}

// Progress bar function
function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

// Change the progressbar progress
function scrub(e) {
    // console.log(e);
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}


// Hook up the event listeners

// Play the video
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

// Detect if the video is play or paused
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// listen to skip button change
skipButtons.forEach(button => button.addEventListener('click', skip));

// listen to range button change
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

// listen to the progress bar change
video.addEventListener('timeupdate', handleProgress);

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);














