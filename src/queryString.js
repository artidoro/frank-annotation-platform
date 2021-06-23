const queryString = require('query-string');

let queryDict = queryString.parse(window.location.search);
if (!Object.keys(queryDict).includes('hash')) {
    queryDict = {
        host:"",
        assignmentId:1,
        workerId:0,
        hitId:1,
        hash: "ac45385d07d6a241c11b45cfaa2bb5daea79ad7c",
        trapsMode: 'sequence',
        testOnly:"mainTaskOnly",
        entityTest: "", //"continue"
        bonus: 1,
        bonusMomentum: 1,
        trapsNum: 0,
        minTrap: 0.75,
        minTime: 0,
        maxHitsNum: 30
    };
    console.warn('Wrong number of arguments in query string QueryDict: '+ JSON.stringify(queryDict));
}

export { queryDict };