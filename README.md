# the-lazy-learners

Occationally, for some reasons, I have to complete a chain of courses on [learn.microsoft.com](https://learn.microsoft.com) or [coursera](https://coursera.org). Even though I can easily go through each course by simply clicking the `continue` button on the bottom of each page, randomly answer to questions till it completes, I am too lazy that can not stand to repeatedly click the buttons, it is freaking boring, and yeah, it still takes time.

Here we go, the simple toolkit helps to... click continue buttons, and brain-lessly answer to questions on the way.

## Setup

1/ Install extension [Script executer](https://github.com/aneelkkhatri/script-executor) on Chrom browser.
The extension is very simple and works very well, I really like it so that I made a copy of it, and put it on the folder `script-executor`, just in case it disappears someday.

2/ Open the the extension and load necesary script. (Check the section `Scripts` down below).

3/ Navigate to your learning courses and enjoy.

## Scripts

### Learn.microsoft.com
```
setInterval(() =>
{
	if (document.URL.includes('learn.microsoft.com'))
	{
		document.querySelector('a[data-bi-name*=continue]')?.click(); 
		document.querySelectorAll('input[class*=choice-input]').forEach(choice => choice.click())
		document.querySelector('button[data-bi-name*=check-answers]')?.click();
		document.querySelector('button[data-bi-name*=unlock-achievement]')?.click(); 
		document.querySelector('a[data-bi-name*=start]')?.click(); 
	}
},
1000)
```

### Coursera.org
```
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
```
