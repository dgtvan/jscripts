const CalculateTotalStoryPoint = () => {	
	//
	// Find the index of column Story Points
	//
	
	let storyPointColumnIndex = -1;
	
	const issueColumns = 
	    [
	        ...Array.from(document.querySelectorAll('table[aria-label=Issues] thead tr:first-child th')),
	        ...Array.from(document.querySelectorAll('table[id=issuetable] thead tr:first-child th'))
	    ]

	issueColumns.forEach((column, index) => {
		const isStoryPointColumn = Array.from(column.querySelectorAll('span')).some(span => span.innerText.includes('Story Points'));
		if (isStoryPointColumn) {
			storyPointColumnIndex = index;
			return;
		}
	});
	

	if (storyPointColumnIndex == -1) {
		return;
	}

	//
	// Calculate total story point
	//
	
	let totalStoryPoint = 0;
		
    const tickets = 
        [
            ...Array.from(document.querySelectorAll('table[aria-label=Issues] tbody tr')),
            ...Array.from(document.querySelectorAll('table[id=issuetable] tbody tr')),
        ]
        
	if (tickets.length == 0) {
		return;
	}
	
	tickets.forEach(ticket => {
	    if (ticket.hasAttribute('StoryPointAttribute')) {
	        // Skip it because it's the row showing the total point.
	        return;
	    }
	    
		const storyPointTexts = 
		    [
		        Array.from(ticket.querySelectorAll('td'))[storyPointColumnIndex]?.innerText,
		        Array.from(ticket.querySelectorAll('td'))[storyPointColumnIndex].querySelector('div')?.innerText
	        ]
	        
		const storyPoint = storyPointTexts.map(text => parseInt(text)).find(point => !isNaN(point));
		
		totalStoryPoint += storyPoint == null ? 0 : storyPoint;
	});
	
    //
	// Add new row for the total story point
	//
	
	const lastRow =  tickets[tickets.length - 1];
	
	let totalStoryPointRow = lastRow;
	
	if (!totalStoryPointRow.hasAttribute('StoryPointAttribute')) {
		totalStoryPointRow = lastRow.cloneNode(true);
		totalStoryPointRow.setAttribute('StoryPointAttribute', '');		
		lastRow.parentNode.appendChild(totalStoryPointRow);
	}
	
	Array.from(totalStoryPointRow.children).forEach((column, index) => {
		if (index == storyPointColumnIndex) {
			column.innerHTML = totalStoryPoint;''
			column.style.backgroundColor = '#ffbf00';
		} else {
		
			column.innerHTML = '';
		}
	});
}

const RegisterTotalStoryPointCalculation = () => {
    if 
    (
        !window.location.href.includes('https://employersmutual.atlassian.net/') 
        && !window.location.href.includes('/issues/')
    ) 
    {
        return;
    }

    setInterval(CalculateTotalStoryPoint, 1000);
}

RegisterTotalStoryPointCalculation();