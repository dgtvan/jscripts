// Show the pocker's point
const RegisterPockerPoints = () => {
    if (!window.location.href.includes('scrumpoker-online.org'))
        return;

    setInterval(ShowPockerPoints, 1000);
}

const ShowPockerPoints = () => {
    const PockerMagic = 'pocker-magic';

    const isShowPointConfig = localStorage.getItem('showpointtoggle') == 'true' ? true : false;

    //
    // Add a button to quickly hide/show points
    //

    const showPointToggleElement = document.querySelector('.results-title div input[type="checkbox"]')
    if (showPointToggleElement == null) {
        const resultTitleElement = document.querySelector('.results-title span');
        if (resultTitleElement == null)
            return;

        const showPointToggle = document.createElement("input");
        showPointToggle.type = "checkbox";
            showPointToggle.checked = isShowPointConfig;

        showPointToggle.addEventListener('click', () => {
            localStorage.setItem('showpointtoggle', showPointToggle.checked ? 'true' : 'false');
            window.location.reload();
        });

        const containerElement = document.createElement("div");
        containerElement.appendChild(resultTitleElement.cloneNode(true));
        containerElement.appendChild(showPointToggle);

        resultTitleElement.parentNode.replaceChild(containerElement, resultTitleElement);
    }

    //
    // Retrieve and show points
    //

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

        if (isShowPointConfig) {
            paticipantNode.innerText = paticipantNode.innerText + ' (' + point + ')';
        } else {
            paticipantNode.innerText = paticipantNode.innerText;
        }

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

    if (isShowPointConfig) {
        highestPoint.nodes.forEach(vote => {
            vote.style.fontWeight = 600;
        });
    }
}

RegisterPockerPoints();