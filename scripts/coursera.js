var __is_running = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isPlaying(videoEle) {
    return !!(
        videoEle.currentTime > 0 &&
        !videoEle.paused &&
        !videoEle.ended &&
        videoEle.readyState > 2
    );
}

function isExam() {
    return document.URL.includes('/exam/');
}

async function fastForwardVideo() {
    const lazyVideo = document.querySelector('video[class*=vjs-tech]');
    if (!lazyVideo) return;

    if (!lazyVideo.muted)
        lazyVideo.muted = true;

    if (!isPlaying(lazyVideo))
        lazyVideo.play();

    if (!isFinite(lazyVideo.duration) || isNaN(lazyVideo.duration)) return;

    if (lazyVideo.currentTime < lazyVideo.duration) {
        lazyVideo.currentTime = lazyVideo.duration - 0.01;
    }
}

function clickButtons() {
    document.querySelector('a[data-track-component*=video_next_item_overlay]')?.click();
    document.querySelector('button[data-testid*=mark-complete]')?.click();
    document.querySelector('button[data-testid*=next-item]')?.click();
    document.querySelector('button[data-test*=continue-button]')?.click();
    document.querySelector('button[data-test*=action-button]')?.click();
}

async function quiz() {
    document.querySelector('button[data-test*=action-button]')?.click();
    await sleep(2000);
    document.querySelector('input[type*=radio')?.click();
    await sleep(2000);
    if (!document.querySelector('input[aria-labelledby*=check-agree')?.checked)
        document.querySelector('input[aria-labelledby*=check-agree')?.click();
    await sleep(2000);
    document.querySelector('button[data-test*=submit-button]')?.click();
    await sleep(2000);
    document.querySelector('a[data-track-action*=close]')?.click();
    document.querySelectorAll('button')?.forEach(btn => {
        if (btn.innerText == 'Go to next item')
            btn.click();
    });
}

async function main() {
    if (__is_running) return;
    __is_running = true;

    if (!isExam()) {
        await fastForwardVideo();
        clickButtons();

    }

    if (isExam())
        await quiz();

    __is_running = false;
}

this.setInterval(main, 1000);