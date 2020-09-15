*updated 15th September, 2020*

## I'm using Chrome

Read up on the docs here: https://support.google.com/chrome/answer/95314?hl=en

## I'm using Firefox

In Firefox you can set your homepage and new window page: https://support.mozilla.org/en-US/kb/how-to-set-the-home-page

But this will not open a new tab with your selected page. Unfortunately a extension is needed to set this functionality.

I recommend using either of these 2 extensions:

### Custom New Tab Page

https://addons.mozilla.org/en-US/firefox/addon/custom-new-tab-page

Newer extension which leaves the URL bar empty.

There's a caveat mentioned:

> Links on the site you choose will open in the iframe (issue #1). If you control the site add target="_top" to the links to make them open in the top frame.

I have injected `<base target="_top">` into each start page hosted here which should solve this problem.

### New Tab Override

https://addons.mozilla.org/de/firefox/addon/new-tab-override/

Older extension which mostly works but unfocuses the URL bar so you'll have to select it before typing.
