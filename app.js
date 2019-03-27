const CrossMailWarrior = require('./index');
new CrossMailWarrior({
	cloneToAttrs: ['data-lang', 'data-etc'],
	valuePrefix: 'x-'
})