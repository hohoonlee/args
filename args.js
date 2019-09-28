const _ = require('underscore');
const types = {
	'': 'boolean',
	'#': 'int',
	'##': 'float',
	'*': 'string',
	'[*]': 'array'
};

const parseSchema = schema => {
	return _.reduce(schema.split(','), (m, v)=>{
		const key = v.substring(0,1);
		const val = v.substring(1);
		if(!types[val]) throw new Error(`Unknown pattern (${val}).`);

		m[key] = types[val];
		return m;
	}, {});
};

const parseArgument = (parsedSchema, args) => {
	const result 	= {};
	let lastKey 	= null;
	let lastType 	= null;
	args.forEach((val, index, all) => {
		if(typeof val !== 'string' || !val.startsWith('-')) {
			if(lastKey != null && lastType === 'array') result[lastKey].push(val);
			return;
		}	

		lastKey 	= val.substring(1);
		lastType 	= parsedSchema[lastKey]; 
		if(!lastType) throw new Error(`Not Found schema for ${lastKey}.`);

		result[lastKey] = (lastType === 'array')?[]:all[index+1];
	});
	return result;
};

const parse =  (schema, args) => {
	const parsedSchema 	= parseSchema(schema);
	const parsedArgs	= parseArgument(parsedSchema, args);
	// console.log(parsedSchema, parsedArgs);
	return {
		getSchema() {
			return parsedSchema;
		},
		useage() {
			return _.map(_.keys(parsedSchema), key=> `-${key} [${parsedSchema[key]}]`).join(' ');
		},
		getBoolean(p) {
			if(parsedSchema[p] !== 'boolean') throw new Error(`${p} paramenter is not boolean.`);
			return parsedArgs[p] === 'true';
		},
		getInt(p) {
			if(parsedSchema[p] !== 'int') throw new Error(`${p} paramenter is not int.`);
			return parseInt(parsedArgs[p], 10);
		},
		getFloat(p) {
			if(parsedSchema[p] !== 'float') throw new Error(`${p} paramenter is not float.`);
			return parseFloat(parsedArgs[p]);
		},
		getString(p) {
			if(parsedSchema[p] !== 'string') throw new Error(`${p} paramenter is not string.`);
			return parsedArgs[p];
		},
		getArray(p) {
			if(parsedSchema[p] !== 'array') throw new Error(`${p} paramenter is not array.`);
			return parsedArgs[p];
		}
	};
};

module.exports = parse;

// console.log(parse('l,p#,d*,a##,b[*]', process.argv).getArray('b'));