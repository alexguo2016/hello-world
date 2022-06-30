// const log = console.log.bind(console)


const C = 'C'
const D = 'D'
const E = 'E'
const F = 'F'
const G = 'G'
const A = 'A'
const B = 'B'
const CP = 'CP'
const DP = 'DP'
const EP = 'EP'
const FP = 'FP'
// 1  2  3  4  5  6  7 高音1 高音2 高音3 高音4
// C, D, E, F, G, A, B, CP,  DP,  EP,  FP,

// 所有大七度
const major7 = [
    [C, B], [F, EP]
]

// 所有小七度
const minor7 = [
    [D, CP], [E, DP], [G, FP]
]

// 所有大六度
const major6 = [
    [C, A], [D, B], [F, DP], [G, EP]
]

// 所有小六度
const minor6 = [
    [E, CP], [A, FP]
]

// 所有纯八度
const pure8 = [
    [C, CP], [D, DP], [E, EP], [F, FP]
]

// 所有纯五度
const pure5 = [
    [C, G], [D, A], [E, B], [F, CP], [G, DP], [A, EP]
]

// 所有纯四度
const pure4 = [
    [C, F], [D, G], [E, A], [G, CP], [A, DP], [B, EP], [CP, FP]
]

// 所有纯一度
const pure1 = [
    [C, C], [D, D], [E, E], [F, F], [G, G], [A, A], [B, B], [CP, CP], [DP, DP], [EP, EP], [FP, FP]
]

// 所有增四度
const special4 = [
    [F, B]
]

// 所有减五度
const special5 = [
    [B, FP]
]

// 所有大二度
const major2 = [
    [C, D], [D, E], [F, G], [G, A], [A, B], [CP, DP], [DP, EP],
]

// 所有小二度
const minor2 = [
    [E, F], [B, CP], [EP, FP]
]

// 所有大三度
const major3 = [
    [C, E], [F, A], [G, B], [CP, EP]
]

// 所有小三度
const minor3 = [
    [D, F], [E, G], [A, CP], [B, DP], [DP, FP]
]

// 利用 js 数组的 "特性"
major2.name = 'major2'
major3.name = 'major3'
major6.name = 'major6'
major7.name = 'major7'

minor2.name = 'minor2'
minor3.name = 'minor3'
minor6.name = 'minor6'
minor7.name = 'minor7'

pure1.name = 'pure1'
pure4.name = 'pure4'
pure5.name = 'pure5'
pure8.name = 'pure8'

special4.name = 'special4'
special5.name = 'special5'

const makeQuestion_canUse = function() {
    while(true) {
        // 生成一个有答案的问题
        let [question, answer] = makeQuestion()
        if (answer !== '未知??') {
            return [question, answer]
        }
    }
}

// 产生一个随机问题
// 结果是 [问题, 答案]
// 从上面所有的题目库里面, 随机抽一个系列
// 从系列里面随机抽一个题目
// 然后增加变化
const makeQuestion = function() {
    const seriesList = [
        pure1, pure4, pure5, pure8, minor2, minor3, minor6, minor7, major2, major3, major6, major7, special4, special5,
    ]
    let s = randomOne(seriesList)
    let m = randomOne(s) // 这是题目, 没有变化的情况
    // 然后, 算出这个题目在哪个系列
    // 这里利用 js 的数组数据结构 "特性"
    let seriesName = s.name
    // 然后随机增加变化
    // question 的格式是 [A, B]
    let question = addChange(m, seriesName)
    let answer = marksRelation(...question)
    return [question, answer]
}

const addChange = function(originQuestion, seriesName) {
    let changeValue = randomChange(seriesName)
    // while 循序, 得到符合要求的题目
    // 原题目是 [begin, end] 的形式
    // 如果 begin 有一个 ♯, 则记为 -1
    // 如果 end 有一个 ♯, 则记为 1
    // begin + end == changeValue 就是符合要求的题目
    let markMap = {
        '♯': 1,
        '♭': -1,
        '×': 2,
        '♭♭': -2,
    }
    let marks = ['♯', '♭', '×', '♭♭', '']
    let i = 0
    while(i < 4000) {
        let begin = randomOne(marks)
        let end = randomOne(marks)
        let beginValue = (markMap[begin] || 0) * -1
        let endValue = markMap[end] || 0
        if (changeValue == beginValue + endValue) {
            let result = [
                `${begin}${originQuestion[0]}`,
                `${end}${originQuestion[1]}`
            ]
            return result
        }
        // log()
        i++
    }
    // log('change***', changeValue)
    return 'ddd'
}

const randomChange = function(seriesName) {
    let pures = ['pure1', 'pure4', 'pure5', 'pure8']
    let minors = ['minor2', 'minor3', 'minor6', 'minor7']
    let majors = ['major2', 'major3', 'major6', 'major7']
    let special4 = 'special4'
    let special5 = 'special5'
    let changeList = [0]
    if (pures.includes(seriesName)) {
        changeList = [-2, -1, 0, 1, 2]
    } else if (minors.includes(seriesName)) {
        changeList = [-2, -1, 0,]
    } else if (majors.includes(seriesName)) {
        changeList = [2, 1, 0,]
    } else if (special4 == seriesName) {
        changeList = [1, 0,]
    } else if (special5 == seriesName) {
        changeList = [-1, 0,]
    }
    let change = randomOne(changeList)
    return change
}

const randomOne = function(array) {
    // 随机一个结果
    let len = array.length
    while(true) {
        let index = Math.floor(Math.random() * (len + 1))
        if (index > len - 1) {
            continue
        } else {
            return array[index]
        }
    }
}

const test_addChange = () => {
    let s = addChange(['C', 'F'], 'pure4')
    log(s)
}

const _testQuestions = () => {
    let arr1 = [1,3,4,5,6,7,8,]
    let r1 = randomOne(arr1)
    log(r1)
}

// test_addChange()