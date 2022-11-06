/**
 This script is adds time spent in the page to the title of the page
*/
var originalTitle = document.title;
function renderTimeSpent() {
    t = timeSpent;
    var sec = (t / 1000);
    var min = sec / 60;
    var hr = min / 60;
    s = parseInt(hr % 24) + ":" + parseInt(min % 60) + ":" + parseInt(sec % 60);
    document.title = s + " | " + originalTitle;
}
var timeSpent = 0;
var interval = 1000;
var lastKeyActivityTime = Date.now();
var lastMouseActivityTime = Date.now();
function onKeyActivity() { 
	lastKeyActivityTime = Date.now();
}
function onMouseActivity() {
	lastMouseActivityTime = Date.now();
}
document.addEventListener('keydown', onKeyActivity);
document.addEventListener('mousemove', onMouseActivity);
document.addEventListener('mousedown', onMouseActivity);
document.addEventListener('mousewheel', onMouseActivity);
setInterval(function () {
    var now = Date.now();
    if (!document.hidden && (document.hasFocus() || now - lastKeyActivityTime < 1000 || now - lastMouseActivityTime < 1000)) {
        timeSpent += interval;
    }
    renderTimeSpent();
}, interval);
