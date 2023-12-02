
const CalculateTotalStoryPoint = () => {	
	//
	// Find the index of column Story Points
	//
	
	let storyPointColumnIndex = -1;
	const issueColumns = Array.from(document.querySelectorAll('table[aria-label=Issues] thead tr:first-child th'))
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
		
    const tickets = Array.from(document.querySelectorAll('table[aria-label=Issues] tbody tr'));
	if (tickets.length == 0) {
		return;
	}
	
	tickets.forEach(ticket => {
		const storyPointText = Array.from(ticket.querySelectorAll('td'))[storyPointColumnIndex].querySelector('div')?.innerText;
		const storyPoint = parseInt(storyPointText);
		
		totalStoryPoint += isNaN(storyPoint) ? 0 : storyPoint;
	});

    //
	// Add new row for the total story point
	//
	
	const lastRow =  tickets[tickets.length - 1];
	
	let totalStoryPointRow = lastRow;
	
	if (!totalStoryPointRow.hasAttribute('StoryPointAttribute')) {
		totalStoryPointRow = lastRow.cloneNode(true);
		
		lastRow.parentNode.appendChild(totalStoryPointRow);
		
		totalStoryPointRow.setAttribute('StoryPointAttribute', '');		
	}
	
	totalStoryPointRow.childNodes.forEach((column, index) => {
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
        !window.location.href.includes('https://employersmutual.atlassian.net/jira/software/c/projects/') 
        && window.location.href.includes('/issues/')
    )
        return;

    setInterval(CalculateTotalStoryPoint, 1000);
}

RegisterTotalStoryPointCalculation();