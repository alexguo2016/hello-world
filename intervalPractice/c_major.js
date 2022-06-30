// c 大调音程练习
// 音程分 4 种类型
// 1, 1 4 5 8 纯音程, 而纯音程可以有 增, 倍增, 减, 倍减变化
// 2, 大小二度, 大小三度
// 3, 大小六度, 大小七度
// 大度有增, 倍增变化; 小度有减, 倍减变化
// 4, 特殊音程, 例如 4-7, 增四度; 7-高音4, 减五度

/*
结果形如:
{
    type: 'pure',
    len: 5,
    change: -1,
}
代表的是 纯五度, 变化为少一个半音, 所以结果是  减五度
*/
const marksRelation = function(begin, end) {
    // 变化程度
    let change = scaleOfChange(begin, end)
    let b = markWithoutChange(begin)
    let e = markWithoutChange(end)
    // 基础音程
    let r = intervalRelation(b, e)
    // 结果 = 基础音程 + 变化程度
    r = {...r, change}

    // 翻译成中文
    let result = translate(r)
    return result
}


// 翻译数据结构为中文意思
/*
例如
{
    type: 'pure',
    len: 5,
    change: -1,
}
代表的是 纯五度, 变化为少一个半音, 所以结果是  减五度
*/
const translate = function(object) {
    // type 有 pure, major, minor, special 4种
    // pure 的 change 有 1 -- 增, 2 -- 倍增, -1 -- 减, -2 -- 倍减, 0 -- 纯
    // major 的 change 有 1 -- 增, 2 -- 倍增, 0 -- 大
    // minor 的 change 有 -1 -- 减, -2 -- 倍减, 0 -- 小
    // special 中, 如果 len 是 4, change 有 0 -- 增, 1 -- 倍增
    // special 中, 如果 len 是 5, change 有 0 --- 减, -1 -- 倍减
    let {type, change, len} = object
    if (type == 'pure') {
        if (change == 0) {
            return `纯 ${len} 度`
        } else if (change == 1) {
            return `增 ${len} 度`
        } else if (change == 2) {
            return `倍增 ${len} 度`
        } else if (change == -1) {
            return `减 ${len} 度`
        } else if (change == -2) {
            return `倍减 ${len} 度`
        }
    } else if (type == 'major') {
        if (change == 0) {
            return `大 ${len} 度`
        } else if (change == 1) {
            return `增 ${len} 度`
        } else if (change == 2) {
            return `倍增 ${len} 度`
        }
    } else if (type == 'minor'){
        if (change == 0) {
            return `小 ${len} 度`
        } else if (change == 1) {
            return `减 ${len} 度`
        } else if (change == 2) {
            return `倍减 ${len} 度`
        }
    } else if (type == 'special'){
        if (len == 4) {
            if (change == 0) {
                return `增 ${len} 度`
            } else if (change == 1) {
                return `倍增 ${len} 度`
            }
        }
        if (len == 5) {
            if (change == 0) {
                return `减 ${len} 度`
            } else if (change == 1) {
                return `倍减 ${len} 度`
            }
        }
    }
    return '未知??'
}


// 对应音名和唱名
// 低音3 低音4 低音5 低音6 低音7 1  2  3  4  5  6  7  高音1  高音2  高音3  高音4  高音5  高音6
// EM    FM    GM   AM   BM  C  D  E  F  G  A   B   CP    DP    EP    FP     GP    AP
// 自定义, 用于计算音程的数字, 假设低音3为0
// 0     1     2    3    4   5  6  7  8  9  10  11  12    13    14    15     16    17
const numberOfMusicalAlphabet = function(alphabet) {
    const mapper = {
        EM: 0, FM: 1, GM: 2, AM: 3, BM: 4, C: 5, D: 6, E: 7, F: 8, G: 9, A: 10, B: 11, CP: 12,
        DP: 13, EP: 14, FP: 15, GP: 16, AP: 17,
    }
    return mapper[alphabet]
}

// 记录下变化的程度
// 记号有这些 
// 1、升记号（♯）表示将基本音级升高半音。
// 2、降记号（♭）表示将基本音级降低半音。
// 3、重升记号（×）表示将基本音级升高两个半音（一个全音）。
// 4、重降记号（♭♭）表示将基本音级降低两个半音（一个全音）。
// 5、还原记号(♮)表示将已经升高或降低的音还原。 还原记号先不管
// 例如, 如果 begin 有 # 记号, 记为变化 -1
// 如果 end 有 # 记号, 记为变化 +1
const scaleOfChange = function(begin, end) {
    let result = 0
    let markMap = {
        '♯': 1,
        '♭': -1,
        '×': 2,
        '♭♭': -2,
    }
    for (const k in markMap) {
        let v = markMap[k]
        if (begin.includes(k)) {
            result -= v
        }
        if (end.includes(k)) {
            result += v
        }
    }
    return result
}

// 去除所有变化记号
const markWithoutChange = function(mark) {
    let changes = ['♯', '♭', '×', '♭♭']
    let result = mark
    for (let i = 0; i < changes.length; i++) {
        if (mark.includes(changes[i])) {
            // 如果包含变化, 则去除变化记号
            result = mark.replace(changes[i], '')
            break
        }
    }
    return result
}

// 计算没有变化记号的音程
// 0, 最初一步, 看看是不是最特殊的增四度和减五度
// 1, 然后开始计算
// 2, 计算音程第一步, 计算基础距离, 例如 3-5 的基础距离是 3 4 5, 3度
// 3, 如果是 1 4 5 8 度, 就开始计算增减
// 4, 如果是 2 3 6 7 度, 继续计算是大度还是小度
// 4.1, 然后看是大度还是小度
// 4.2, 其中, 2 3 度的时候, 有一个半音关系, 就是小度
// 4.3, 6 7 度的时候, 有两个半音关系, 就是小度
// 4.4, 其他的 2 3 6 7 都是大度
const intervalRelation = function(begin, end) {
    // 首先, 看看是不是特殊的两个, 增四度和减五度
    let c = checkSpecialInterval(begin, end)
    if (c) {
        return c
    }
    
    // 然后, 计算音程基本长度
    let len = lenOfInterval(begin, end)
    // 纯 1458, 23, 67
    let pure = [1, 4, 5, 8]
    let bl = [2, 3, 6, 7]
    if (pure.includes(len)) {
        // 如果是纯音程, 1458
        return {
            type: 'pure',
            change: 0,
            len,
        }
    } else if (bl.includes(len)) {
        // 23 67
        // 计算是大度还是小度
        // 检查半音个数
        let n = countSemitone(begin, end)
        // log('半音个数', n, begin, end)
        if (n === 0) {
            // return `大${len}度`
            return {
                type: 'major',
                change: 0,
                len,
            }
        } else if (n === 1) {
            if (len <= 3) {
                // return `小${len}度`
                // 小二度, 小三度的情况, 有一个半音
                return {
                    type: 'minor',
                    change: 0,
                    len,
                }
            } else {
                // return `大${len}度`
                // 大六度, 大七度的情况, 有一个半音
                return {
                    type: 'major',
                    change: 0,
                    len,
                }
            }
        } else if (n === 2) {
            // return `小${len}度`
            // 小六度, 小七度的情况, 有两个半音
            return {
                type: 'minor',
                change: 0,
                len,
            }
        }
    }
}

// 特殊音程, 直接写死就好了
// 如果符合关系, 返回字符串, 否则返回空字符串
const checkSpecialInterval = function(begin, end) {
    // 特殊关系有这么几个
    // 4-7, 低音4-低音7  增4度
    // 低音7-4, 7-高音4  减5度
    if ((begin == 'F' && end == 'B') || (begin == 'FM' && end == 'BM')) {
        // return '增4度'
        return {
            type: 'special',
            change: 1,
            len: 4
        }
    }
    if ((begin == 'BM' && end == 'F') || (begin == 'B' && end == 'FP')) {
        // return '减5度'
        return {
            type: 'special',
            change: -1,
            len: 5
        }
    }
    return ''
}

// 半音关系
// EM-FM    BM-C    E-F    B-CP    EP-FP
const isSemitone = function(current, next) {
    let semi1 = current == 'EM' && next == 'FM'
    let semi2 = current == 'BM' && next == 'C'
    let semi3 = current == 'E' && next == 'F'
    let semi4 = current == 'B' && next == 'CP'
    let semi5 = current == 'EP' && next == 'FP'
    if (semi1 || semi2 || semi3 || semi4 || semi5) {
        return true
    } else {
        return false
    }
}
// 计算半音个数
// 首先, 补全整个关系, 例如 E-高音F 的话, 补全为 E F G A B CP DP EP FP
// 然后遍历, 找半音个数
const countSemitone = function(begin, end) {
    // log('countSemitone', begin, end)
    let aList = [
        'EM', 'FM', 'GM', 'AM', 'BM', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'CP', 'DP', 'EP', 'FP', 'GP', 'AP',
    ]
    let i_begin = aList.indexOf(begin)
    let i_end = aList.indexOf(end)
    let result = 0
    // log('i_begin', i_begin, i_end, aList[i_begin], aList[i_end])
    for (let i = i_begin; i < i_end; i++) {
        // 判断每次循环里面的本音和下一个音
        // 如果符合半音规则, 则半音数量 + 1
        let current = aList[i]
        let next = aList[i+1]
        // log(current, next, "next and current")
        if (isSemitone(current, next)) {
            result += 1
        }
    }
    return result
}

// 计算基本音程
// 公式是: end - begin + 1
// 传入音名, 找到对应计算音程的数字, 然后计算
// 例如, begin 是 C, end 是 G
// 对应的音程数字是 5 9
// 套入公式之后是, 9-5+1 = 5, 结果是 5度
const lenOfInterval = function(begin, end) {
    let b = numberOfMusicalAlphabet(begin)
    let e = numberOfMusicalAlphabet(end)
    let len = e - b + 1
    return len
}

const testLenOfInterval = () => {
    let b1 = 'C'
    let e1 = 'G'
    let res = lenOfInterval(b1, e1)
    let except1 = 5
    if (except1 == res) {
        console.log('success')
    }
}

const testIntervalRelation = () => {
    let begin = 'D'
    let end = 'F'
    let r = intervalRelation(begin, end)
    log(r, 'RRR**')
}

// testIntervalRelation()

// testLenOfInterval()