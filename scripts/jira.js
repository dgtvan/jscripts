// Show total points on Jira
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