const Create = require('./Create');

exports.getCommands = () => {
	return {
		create: Create,
	};
};