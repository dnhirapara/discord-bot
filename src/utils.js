const getDateByDay = (_day, _currentDate) => {
	const __date = new Date(_currentDate);
	__date.setDate(__date.getDate() + _day);
	if (_day) {
		__date.setHours(5);
		__date.setMinutes(0);
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