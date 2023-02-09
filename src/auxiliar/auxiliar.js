function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


function convUsToArDate(date) {
    const dateArray = date.split("/");
    return `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;
};


function diffDateToday(date) {
    const diff = (new Date() - new Date(date)) / 1000 / 60 / 60 / 24;
    return Math.round(diff).toString();
};

function groupArrayByKey(array, key) {
    return array.reduce((group, item) => {
        group[item[key]] = group[item[key]] ?? [];
        group[item[key]].push(item);
        return group;
    }, {});
}

module.exports = { delay, convUsToArDate, diffDateToday, groupArrayByKey }