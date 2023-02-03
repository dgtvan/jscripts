# jscripts

Scripts I use to add additional functions on specific websites for personal purposes.

## Setup

1/ Install extension [Script executer](https://github.com/aneelkkhatri/script-executor) on Chrom browser.
The extension is very simple and works very well, I really like it so that I made a copy of it, and put it on the folder `script-executor`, just in case it disappears someday.

2/ Open the the extension and load necessary script, then Save. (Check the section `Scripts` down below)

3/ Done.

## Scripts

### Lazy learn ar learn.microsoft.com
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

### Lazy learn at coursera.org
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

### Show total points on Jira
```
//**************************************
// Show total points on Jira
//**************************************
const RegisterTotalStoryPointCalculation = () => {
    if (!window.location.href.includes('jira.eml.com.au'))
        return;

    setInterval(CalculateTotalStoryPoint, 1000);
}

const CalculateTotalStoryPoint = () => {
    const StoryPointClass = 'customfield_10004';
    const StoryPointAttribute = 'StoryPointRow'

    const tbody = document.querySelector('#issuetable tbody');

    if (tbody === null)
        return;

    if (tbody.childNodes.length === 0)
        return;

    const rows = tbody.childNodes;

    // Exit if total story point exists
    if (rows[rows.length -1].hasAttribute(StoryPointAttribute))
        return;

    // Sum story points
    let totalStoryPoint = 0;
    rows.forEach(row => {
        row.childNodes.forEach(column => {
            if (column.getAttribute('class') === StoryPointClass) {
                const point = parseFloat(column.innerText);
                totalStoryPoint += isNaN(point) ? 0 : point;
            }
        });
    });

    // Create total story point row
    const totalStoryPointRow = rows[0].cloneNode(true);
    totalStoryPointRow.setAttribute(StoryPointAttribute, '');
    totalStoryPointRow.childNodes.forEach(column => {
        const columnClass = column.getAttribute('class');

        // Clear all columns except the total story point
        column.innerHTML = '';

        if (columnClass === StoryPointClass) {
            column.innerHTML = totalStoryPoint;''
            column.style.backgroundColor = '#ffbf00';
        }
    });

    // Append the total story point to the view
    tbody.appendChild(totalStoryPointRow);
}

RegisterTotalStoryPointCalculation();
```

### Show pocker points at scrumpoker-online.org
```
//**************************************
// Show pocker point
//**************************************
const RegisterPockerPoints = () => {
    if (!window.location.href.includes('scrumpoker-online.org'))
        return;

    setInterval(ShowPockerPoints, 1000);
}

const ShowPockerPoints = () => {
    const PockerMagic = 'pocker-magic';

    const voteGroup = document.querySelector('tbody[role="rowgroup"]');

    if (voteGroup === null)
        return;

    const votes = voteGroup.childNodes;

    let highestPoint = {
        nodes: [],
        point: -1
    }

    votes.forEach(vote => {
        if (vote.nodeName === '#comment')
            return;

        if (vote.hasAttribute(PockerMagic))
            return;

        const paticipantNode = vote.querySelector('td[class*=mat-column-displayName]');
        const pointNode = vote.querySelector('div[class*=flip-card-back]').querySelectorAll(':scope > span')[0];

        const pointRaw = parseFloat(pointNode.innerText);
        const point = isNaN(pointRaw) ? '-' : pointRaw;

        paticipantNode.innerText = paticipantNode.innerText + ' (' + point + ')';

        console.log(pointRaw);
        console.log(point);

        if (point !== '-') {
            if (highestPoint.point < point) {
                highestPoint.nodes = [];
                highestPoint.point = point;
            }

            if (highestPoint.point == point) {
                highestPoint.nodes.push(vote);
            }
        }

        vote.setAttribute(PockerMagic, '');
    });

    highestPoint.nodes.forEach(vote => {
        vote.style.fontWeight = 600;
    });
}

RegisterPockerPoints();
```

### Enable blocked text selection
https://stackoverflow.com/questions/7101982/enabling-blocked-text-selection-using-javascript
```
//**************************************
// Enable blocked text selection
//**************************************
javascript:
(function(){
  function allowTextSelection(){
    var style=document.createElement('style');
    style.type='text/css';
    style.innerHTML='*,p,div{user-select:text !important;-moz-user-select:text !important;-webkit-user-select:text !important;}';
    document.head.appendChild(style);
    var elArray=document.body.getElementsByTagName('*');
    for(var i=0;i<elArray.length;i++){
      var el=elArray[i];
      el.onselectstart=el.ondragstart=el.ondrag=el.oncontextmenu=el.onmousedown=el.onmouseup=function(){
        return true;
      }
      ;
      if(el instanceof HTMLInputElement&&['text','password','email','number','tel','url'].indexOf(el.type.toLowerCase())>-1){
        el.removeAttribute('disabled');
        el.onkeydown=el.onkeyup=function(){
          return true;
        }
        ;
      }
    }
  }
  allowTextSelection();
}
)();
```

### Clean User Management UI for Ease of Development
```
//**************************************
// Clean User Management UI for Ease of Development
//**************************************
const ClearUserManagementUI = () => {
    if (!window.location.href.includes('https://usermanagement.mnlaswig.int/'))
        return;

    setInterval(ClearUserManagementUI, 500);
}

const ClearUserManagementUI = () => {
    const whiteInstances = [
        'UserManagement (Local)',
        'UserManagement (PreQA)',
        'Weekly Earnings Calculator (Local)',
        'Weekly Earnings Calculator (PreUAT)'
    ];
    const instances = document.querySelectorAll('#UserInstanceGroups > table > tbody > tr');
    instances.forEach(instance => {
        const instanceName = instance.querySelector('td').innerText;
        if (!whiteInstances.includes(instanceName))
            instance?.remove();
    });  
    
    const whiteGroups = [
        'User Management',
        'WEC BAS User',
        'WEC Employer Super User',
        'WEC Employer User'
    ];
    const groups = document.querySelectorAll('#UserGroupDialogForm > .box-body > div.mb-2');
    groups.forEach(group => {
        const groupName = group.querySelector('label').innerText;
        if (!whiteGroups.includes(groupName))
            group?.remove();
    });  
    
    document.getElementById('subscriptionarea')?.remove();
    
    document.getElementById('UserTeams')?.remove();
    
    document.querySelector('.wiki-toolbar-container')?.remove();
}

RegisterClearUserManagementUI();
```
