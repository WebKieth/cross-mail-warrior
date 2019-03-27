# Cross Mail Warrior

Small Class for inlined html email template cross-client responsibility.

### problem
The most email mobile client apps automatically remove all className selectors from your template and responsibility won't work

### solution
After inlining all basic styles by packages like 'inline-css' you need to set all styles with breakpoints inside <style></style> tag and call new instance of Cross Mail Warrior to replace all className selectors into any attributes. Also you can specify a prefix for new attributes value.

### usage
Firstly, install the package
```sh
$ npm install cross-mail-warroir --save-dev
```

Import it to your script, which compile your email template

```javascript
const CrossMailWarrior = require('cross-mail-warrior');
```

Call it for your source/dest folders
```javascript
new CrossMailWarrior({
    /*required. Array of strings. Specify which attribute(s) you want to replace from classNames*/
	cloneToAttrs: ['data-lang', 'data-etc'],
	/*not required. String. Prefix of attribule value. 
	Default: ""
	Exapmle: <div class='block'> will replace to <div data-attr='x-block'>*/
	valuePrefix: 'x-',
	/*not required. Boolean. Directive, which found end of css rule and sets the important to reinherit inline styles*/
	setImportants: true,
	/*not required.
	Defaults:
	path.source: path.join(__dirname, 'source')
	path.dest: path.join(__dirname, 'dest')*/
	paths: {
	    source: "path/to/source",
	    dest: 'path/to/dest'
	}
})
```

### notes
- Do not minify your code into style tag. You need to \n for !important automatical sets.
