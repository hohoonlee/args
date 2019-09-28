const assert = require('assert');

const args = require('../args');
const argv = [ 
	'/usr/local/Cellar/node@10/10.16.3/bin/node',
	'/Users/hohoonlee/study/args/args.js',
	'-l',
	'-p',
	'300',
	'-d',
	'test' 
];

describe('args test!',  () => {
	const parsedArgs = args('l,p#,d*,a##,b[*]', argv);

	it('스키마 파싱 테스트', ()=>{
		const schema = parsedArgs.getSchema();
		assert.equal('boolean', schema['l']);
		assert.equal('int', 	schema['p']);
		assert.equal('string', 	schema['d']);
		assert.equal('float', 	schema['a']);
		assert.equal('array', 	schema['b']);
	});

	it('boolean test', ()=>{
		assert.equal(true,		parsedArgs.getBoolean('l'));
		assert.equal(300,		parsedArgs.getInt('p'));
		assert.equal('test',	parsedArgs.getString('d'));
	});
});