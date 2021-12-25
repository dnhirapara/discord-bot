const getDateByDay = (_day, _currentDate, _startTime) => {
	const __date = new Date(_currentDate);
	const [__hour, __min, ..._] = _startTime.split(':');
	__date.setDate(__date.getDate() + _day);
	if (_day) {
		__date.setHours(__hour);
		__date.setMinutes(__min);
	}
	return __date;
};

const parseString = (_text, __date) => {
	const day = __date.getDate();
	const month = __date.getMonth() + 1;
	const year = __date.getFullYear();
	const res = eval(`\`${_text}\``);
	console.log('PARSE STRING------------------------------------------------');
	console.log(res);
	return res;
};

const toCode = (_text) => {
	return '\`\`\`' + _text + '\`\`\`';
};

const toInlineCode = (_text) => {
	return '\`' + _text + '\`';
};

module.exports = {
	parseString,
	toCode,
	getDateByDay,
	toInlineCode,
};