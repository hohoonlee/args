const assert = require('assert');

const args = require('../args');
const argv = [ 
	'/usr/local/Cellar/node@10/10.16.3/bin/node',
	'/Users/hohoonlee/study/args/args.js',
	'-l',
	'true',
	'-p',
	'300',
	'-d',
	'test',
	'-a',
	4.5,
	'-b',
	'a',
	'b',
	'c'
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

	it('정상 값 확인', ()=>{
		assert.equal(true,				parsedArgs.getBoolean('l'));
		assert.equal(300,				parsedArgs.getInt('p'));
		assert.equal('test',			parsedArgs.getString('d'));
		assert.equal(4.5,				parsedArgs.getFloat('a'));
		assert.deepEqual(['a','b', 'c'],	parsedArgs.getArray('b'));
	});

	it('사용법 확인', ()=>{
		assert.equal('-l [boolean] -p [int] -d [string] -a [float] -b [array]', parsedArgs.useage());
	});
	
	it('오류 상황 확인', ()=>{
		assert.throws(() => {
			parsedArgs.getArray('l');
		});	
		assert.throws(() => {
			parsedArgs.getBoolean('p');
		});	
		assert.throws(() => {
			parsedArgs.getInt('d');
		});	
		assert.throws(() => {
			parsedArgs.getString('a');
		});	
		assert.throws(() => {
			parsedArgs.getFloat('b');
		});	

		assert.throws(() => {
			args('p#,d*,a##,b[*]', argv);
		});
		assert.throws(() => {
			args('p#,d**,a##,b[*]', argv);
		});
	});
});