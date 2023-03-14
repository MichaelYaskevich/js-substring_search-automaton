let fs = require('fs');
let arg = process.argv;
let i = 0;
let strLen;
let subStrLen;
let len;
let res = "";
let previous;
let alphabit;
let str;
let subStr;
let curState;
let resArray;

function read(inFile) {
    try {
        inText = fs.readFileSync(inFile, "utf-8");
        return inText;
    }
    catch (e) {
        return undefined;
    }
}

function ShowTable(jumpTable, alphabit, subStrLen) {
    res = "";
    len = jumpTable.length;
    let maxLen = String(subStrLen).length;
    for (j = -1; j < len; j++) {
        if (j == -1) {
            res = "";
            for (let i = 0; i < maxLen + 1; i++)
                res += " ";
            for (key in alphabit) {
                let spacesCount = maxLen - key.length + 1;
                let space = "";
                for (let i = 0; i < spacesCount; i++)
                    space += " ";
                res += key + space;
            }    
            console.log(res);
        }
        else {
            res = `${j})`;
            let spacesCount = maxLen - res.length + 1;
            let space = "";
            for (let i = 0; i < spacesCount; i++)
                space += " ";
            res += space;
            for (i in alphabit) {
                let spacesCount = maxLen - String(jumpTable[j][i]).length + 1;
                let space = "";
                for (let i = 0; i < spacesCount; i++)
                    space += " ";
                res += jumpTable[j][i] + space;
            }    
            console.log(res);
        }
    }
}

function MakeJumpTable(subStr, alphabit) {
    subStrLen = subStr.length;
    let jumpTable = new Array(subStrLen + 1);
    for (j = 0; j <= subStrLen; j++)
        jumpTable[j] = new Array();
    for (i in alphabit)
        jumpTable[0][i] = 0;
    for (j = 0; j < subStrLen; j++) {
        previous = jumpTable[j][subStr.charAt(j)];
        jumpTable[j][subStr.charAt(j)] = j + 1;
        for (i in alphabit)
            jumpTable[j + 1][i] = jumpTable[previous][i];
    }

    return jumpTable;
}

function MakeAlphabit(subStr) {
    alphabit = new Array();
    subStrLen = subStr.length;
    for (i = 0; i < subStrLen; i++)
        alphabit[subStr.charAt(i)] = 0;
    return alphabit
}

function TurnOnTheAutomat(strFile, subStrFile) {
    str = read(strFile);
    if (str == undefined || str == "")
        return undefined;
    subStr = read(subStrFile);
    if (subStr == undefined || subStr == "")
        return undefined;
    strLen = str.length;
    subStrLen = subStr.length;
    alphabit = MakeAlphabit(subStr);
    jumpTable = MakeJumpTable(subStr, alphabit);
    curState = 0;
    resArray = new Array();
    i = 0;

    const start = new Date().getTime();
    while (i < strLen) {
        if (jumpTable[curState][str.charAt(i)] == undefined) {
            curState = 0;
        }
        else {
            curState = jumpTable[curState][str.charAt(i)]
        }
        if (curState == subStrLen) {
            resArray[resArray.length] = i - subStrLen + 1;
            if (howManyEntriesShow == resArray.length)
                break;
        }
        i++;
    }
    const end = new Date().getTime();

    if (time == true) console.log(`WorkTime: ${end - start}ms`);
    if (showTable == true) ShowTable(jumpTable, alphabit, subStrLen);

    return resArray;
}

let flagsCount = 0;
let howManyEntriesShow;
let time = false;
let showTable = false;
function CheckFlags() {
    if (arg[2 + flagsCount] == "-a") {
        flagsCount++;
        showTable = true;
        CheckFlags();
    }
    else if (arg[2 + flagsCount] == "-n") {
        howManyEntriesShow = arg[2 + flagsCount + 1];
        flagsCount++;
        flagsCount++;
        CheckFlags();
    }
    else if (arg[2 + flagsCount] == "-t") {
        flagsCount++;
        time = true;
        CheckFlags();
    }
}
CheckFlags();

if (howManyEntriesShow == undefined || howManyEntriesShow > 0)
    resArray = TurnOnTheAutomat(arg[2 + flagsCount], arg[3 + flagsCount]);

if (resArray == undefined) console.log("One of the files is empty or not exit");
else if (howManyEntriesShow == undefined || howManyEntriesShow > 0) {
    console.log("------First n entries-----");
    if (howManyEntriesShow == undefined || howManyEntriesShow > resArray.length)
        howManyEntriesShow = resArray.length;
    for (let i = 0; i < howManyEntriesShow; i++) {
        console.log(`|            ${resArray[i]}           |`);
    }
    console.log("--------------------------");
}
