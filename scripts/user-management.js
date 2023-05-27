// Clean User Management UI for Ease of Development
const RegisterClearUserManagementUI = () => {
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
            instance?.setAttribute('style', 'display: none;');
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
            group.setAttribute('style', 'display: none;');
    });

    document.getElementById('subscriptionarea')?.setAttribute('style', 'display: none;');

    document.getElementById('UserTeams')?.setAttribute('style', 'display: none;');

    document.querySelector('.wiki-toolbar-container')?.setAttribute('style', 'display: none;');
}

RegisterClearUserManagementUI();