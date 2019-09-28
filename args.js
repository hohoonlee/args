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
		if(!types[val]) throw new Error(`Unknown pattern (${val})`);

		m[key] = types[val];
		return m;
	}, {});
};

const parseArgument = (parsedSchema, args) => {
	const result = {};
	args.forEach((val, index, all) => {
		if(!val.startsWith('-')) return;

		const key 	= val.substring(1);
		const type 	= parsedSchema[key]; 
		if(!type) throw new Error(`Not Found schema for ${key}`);

		result[key] = all[index+1];
	});
	return result;
};

const parse =  (schema, args) => {
	const parsedSchema 	= parseSchema(schema);
	const parsedArgs	= parseArgument(parsedSchema, args);
	
	return {
		getSchema() {
			return parsedSchema;
		},
		getParsedArgs() {
			return parsedArgs;
		},
		getBoolean(p) {
			return parsedArgs[p] === 'true';
		},
		getInt(p) {
			return parseInt(parsedArgs[p], 10);
		},
		getFloat(p) {
			return parseFloat(parsedArgs[p]);
		},
		getString(p) {
			return parsedArgs[p];
		}
	};
};

module.exports = parse;

// console.log(parse('l,p#,d*,a##,b[*]', process.argv).getParsedArgs());