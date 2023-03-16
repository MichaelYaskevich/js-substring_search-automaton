let fs = require('fs');
let arg = process.argv;
let str;
let substr;
let res_array;

function read(input_file) {
    try {
        return fs.readFileSync(input_file, "utf-8");
    }
    catch (e) {
        return undefined;
    }
}

function showTable(jump_table, alphabit, substr_len) {
    // Выводит таблицу переходов ДКА.
    let res = "";
    let len = jump_table.length;
    // На случай если длина подстроки имеет несколько знаков, вычисляем shift
    let shift = String(substr_len).length;
    for (let row = -1; row < len; row++) {
        if (row == -1) {
            for (let i = 0; i < shift + 1; i++)
                res += " ";
            for (const col of alphabit.keys()) {
                let spacesCount = shift - col.length + 1;
                let space = "";
                for (let i = 0; i < spacesCount; i++)
                    space += " ";
                res += col + space;
            }    
            console.log(res);
        }
        else {
            res = `${row})`;
            let spacesCount = shift - res.length + 1;
            let space = "";
            for (let i = 0; i < spacesCount; i++)
                space += " ";
            res += space;
            for (const col of alphabit.keys()) {
                let spacesCount = shift - String(jump_table[row][col]).length + 1;
                let space = "";
                for (let i = 0; i < spacesCount; i++)
                    space += " ";
                res += jump_table[row][col] + space;
            }    
            console.log(res);
        }
    }
}

function makeJumpTable(substr, alphabit) {
    // Строим таблицу переходов ДКА.
    // Состояния - префиксы, включая пустой и всю строку
    // Алфавит - алфавит подстроки и * для символа вне алфавита
    let substr_len = substr.length;
    let jump_table = new Array(substr_len + 1);
    for (j = 0; j <= substr_len; j++)
        jump_table[j] = new Array();
    for (const i of alphabit.keys())
        jump_table[0][i] = 0;
    let previous;
    for (j = 0; j < substr_len; j++) {
        // previous - номер строки таблицы перехода, для префикса, являющегося наибольшим суффиксом накопленной на шаге j строки
        previous = jump_table[j][substr.charAt(j)];
        jump_table[j][substr.charAt(j)] = j + 1;
        for (const i of alphabit.keys())
            jump_table[j + 1][i] = jump_table[previous][i];
    }

    return jump_table;
}

function makeAlphabit(substr) {
    let alphabit = new Set()
    let substr_len = substr.length
    for (let i = 0; i < substr_len; i++)
        alphabit.add(substr.charAt(i));
    return alphabit
}

function turnOnTheAutomat(str, substr) {
    let str_len = str.length;
    let substr_len = substr.length;
    let alphabit = makeAlphabit(substr);
    let jump_table = makeJumpTable(substr, alphabit);
    let cur_state = 0;
    let res_array = new Array();
    let i = 0;

    const start = new Date().getTime();
    while (i < str_len) {
        if (jump_table[cur_state][str.charAt(i)] == undefined) {
            cur_state = 0;
        }
        else {
            cur_state = jump_table[cur_state][str.charAt(i)]
        }
        if (cur_state == substr_len) {
            res_array[res_array.length] = i - substr_len + 1;
            if (count_of_entries == res_array.length)
                break;
        }
        i++;
    }
    const end = new Date().getTime();

    if (time == true) console.log(`WorkTime: ${end - start}ms`);
    if (show_table == true) showTable(jump_table, alphabit, substr_len);

    return res_array;
}

let flags_count = 0;
let count_of_entries;
let time = false;
let show_table = false;
function checkFlags() {
    if (arg[2 + flags_count] == "-a") {
        flags_count++;
        show_table = true;
        checkFlags();
    }
    else if (arg[2 + flags_count] == "-n") {
        count_of_entries = arg[2 + flags_count + 1];
        flags_count++;
        flags_count++;
        checkFlags();
    }
    else if (arg[2 + flags_count] == "-t") {
        flags_count++;
        time = true;
        checkFlags();
    }
}
checkFlags();

if (count_of_entries == undefined || count_of_entries > 0) {
    str = read(arg[2 + flags_count]);
    substr = read(arg[3 + flags_count]);
    if (str == undefined || str == "" || substr == undefined || substr == "")
        res_array = undefined;
    else
        res_array = turnOnTheAutomat(str, substr);
}
if (res_array == undefined) console.log("One of the files is empty or not exit");
else if (count_of_entries == undefined || count_of_entries > 0) {
    console.log("------First n entries-----");
    if (count_of_entries == undefined || count_of_entries > res_array.length)
        count_of_entries = res_array.length;
    for (let i = 0; i < count_of_entries; i++) {
        console.log(`|            ${res_array[i]}           |`);
    }
    console.log("--------------------------");
}
