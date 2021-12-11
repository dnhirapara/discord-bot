const parseString = (_text, _days, _currentDate) => {
    let __date = new Date(_currentDate);
    __date.setDate(__date.getDate() + _days)
    if (_days) {
        __date.setHours(5);
        __date.setMinutes(0);
    }
    const day = __date.getDate();
    const month = __date.getMonth() + 1;
    const year = __date.getFullYear();
    const res = eval(`\`${_text}\``);
    console.log("PARSE STRING------------------------------------------------")
    console.log(res);
    return res;
}

const toCode = (_text) => {
    return "\`\`\`" + _text + "\`\`\`";
}

const toInlineCode = (_text) => {
    return "\`" + _text + "\`";
}

module.exports = {
    parseString,
    toCode,
    toInlineCode
}