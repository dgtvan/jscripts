# the-lazy-learners

Occationally, for some reasons, I have to complete a chain of courses on [learn.microsoft.com](https://learn.microsoft.com). Even though I can easily go through each course by simply clicking the button continue on the bottom of each page, randomly answer to questions till it completes, I am too lazy that can not stand to repeatedly click the buttons, it is freaking boring, and yeah, it still takes time.

Here we go, the simple toolkit helps to... click continue buttons, and brain-lessly answer to questions on the way.

## Setup

1/ Install extension [Script executer](https://github.com/aneelkkhatri/script-executor) on Chrom browser.
The extension is very simple and works very well, I really like it so that I made a copy of it, and put it on the folder `script-executor`.

2/ Open the the extension and load the script below.
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

3/ Navigate to your learning courses and enjoy.