const Create = require('./Create');
const Ping = require('./Ping');

exports.getCommands = () => {
	return {
		'create': Create,
		'ping': Ping,
	};
};