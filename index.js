const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class CrossMailWarrior{
	constructor(opts) {
		if (opts.cloneToAttrs) {
			this.setToAttrs = opts.cloneToAttrs
		} else {
			this.setToAttrs = ['data-lang']
		}
		if (opts.valuePrefix) {
			this.valuePrefix = opts.valuePrefix
		} else {
			this.valuePrefix = ''
		}
		if (opts.setImportants !== undefined) {
			this.setImportants = opts.setImportants
		} else {
			this.setImportants = true;
		}
		if (!opts.paths) {
			this.srcDir = path.join(__dirname, 'source');
			this.destDir = path.join(__dirname, 'dest');
		} else {
			this.srcDir = opts.paths.source ? opts.paths.source : path.join(__dirname, 'source');
			this.destDir = opts.paths.dest ? opts.paths.dest : path.join(__dirname, 'dest');
		}
		
		this.srcFiles = fs.readdirSync(this.srcDir, 'utf-8');
		for (let file of this.srcFiles) {
			this._replace(file);
		}
	}
	_replace(file) {
		const $ = cheerio.load(fs.readFileSync(path.join(this.srcDir, file)))
		for (let element of $('body *').toArray()) {
			if (element.attribs.class) {
				for (let attr of this.setToAttrs) {
					$(element).attr(attr, this.valuePrefix + element.attribs.class);
				}
			}
		}
		let str = $('style').html();
		if (this.setImportants) {
			str = str.replace(/[\;]\n/g, ' !important;\n');
		}
		const regex = /\.([^{.]+)/g;
		let m;
		while ((m = regex.exec(str)) !== null) {
				if (m.index === regex.lastIndex) {
						regex.lastIndex++;
				}
				str = this._replaceStyleString(str, m)
		}
		$('style').html(str);
		fs.writeFileSync(path.join(this.destDir, file), $.html(), 'utf-8');
	}
	_replaceStyleString(styles, entities) {
		const currentClass = entities[0]
		let strToReplace = '';
		for (let attr of this.setToAttrs) {
			if (Number(strToReplace.length) === 0) {
				strToReplace = `[${attr}=${this.valuePrefix}${currentClass.replace('.', '')}]`;
			} else {
				strToReplace += `, [${attr}=${this.valuePrefix}${currentClass.replace('.', '')}]`;
			}
		}
		let replaced = styles.replace(new RegExp(currentClass, 'g'), strToReplace);
		return replaced;
	}
}

module.exports = CrossMailWarrior