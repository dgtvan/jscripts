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