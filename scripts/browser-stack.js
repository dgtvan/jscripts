//**************************************
// Show pocker point
//**************************************

RegisterTotalStoryPointCalculation();

const FixBrowserStackUI = () => {
    const packageListView = document.getElementById('app-testing-content');
    packageListView.style.width = '470px';
}

RegisterFixBrowserStackUI = () => {
    if 
    (
        !window.location.href.includes('https://app-live.browserstack.com/') 
    ) 
    {
        return;
    }
    
    setInterval(FixBrowserStackUI, 1000);
}

RegisterFixBrowserStackUI();