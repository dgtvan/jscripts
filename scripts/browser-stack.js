//**************************************
// Show pocker point
//**************************************

const FixBrowserStackUI = () => {
    const packageListView = document.getElementById('app-testing-content');
    packageListView.style.width = '470px';
}

RegisterFixBrowserStackUI = () => {
    setInterval(FixBrowserStackUI, 1000);
}

RegisterFixBrowserStackUI();