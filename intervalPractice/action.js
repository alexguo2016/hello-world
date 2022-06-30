const submit = function(event) {
    renderRealAnswer()
}
const reflash = function(event) {
    custAnswer = ''
    custChange = ''
    custLen = ''
    newQuestionAnswer = makeQuestion_canUse()
    render()
    renderYourAnswer()
    clearLastAnswer()
}

const clickChange = function(event) {
    // log(event)
    let {target} = event
    let {dataset} = target
    let {change} = dataset
    // log(change, '**')
    custChange = change
    renderYourAnswer()
}

const clickLen = function(event) {
    let {target} = event
    let {dataset} = target
    let {len} = dataset
    // log(len, '**')
    custLen = len
    renderYourAnswer()
}

const translateToSimple = function(mark) {
    let arr = [
        {CP: '高音1'}, {DP: '高音2'}, {EP: '高音3'}, {FP: '高音4'},
        {C: '1'}, {D: '2'}, {E: '3'}, {F: '4'}, {G: '5'}, {A: '6'}, {B: '7'},
    ]
    let result = mark
    for (let i = 0; i < arr.length; i++) {
        let keys = Object.keys(arr[i])
        let k = keys[0]
        let v = arr[i][k]
        if (mark.includes(k)) {
            result = result.replace(k, v)
        }
    }
    return result
}

// 将问题显示到页面上面
const render = () => {
    if (newQuestionAnswer.length > 0) {
        let [question, answer] = newQuestionAnswer
        // log(newQuestionAnswer)
        // question 是一个数组, [begin, end] 形式
        let [begin, end] = question
        begin = translateToSimple(begin)
        end = translateToSimple(end)
        let template = `
        <h1 style="text-align: center;">${begin} 到 ${end}</h1>
        `
        let questionDiv = find('.div-question-cell')
        questionDiv.innerHTML = template
    }
}

const renderYourAnswer = () => {
    let ans = `${custChange} ${custLen} 度`
    let template = `
        <h2 style="text-align: center;">回答: ${ans}</h2>
    `
    let yourAnswerDiv = find('.div-your-answer-cell')
    yourAnswerDiv.innerHTML = template
}

const renderRealAnswer = () => {
    let [question, answer] = newQuestionAnswer
    let template = `
        <h2 style="text-align: center;color: #58a5de">答案: ${answer}</h2>
    `
    let yourAnswerDiv = find('.div-real-answer-cell')
    yourAnswerDiv.innerHTML = template
}

const clearLastAnswer = () => {
    let yourAnswerDiv = find('.div-real-answer-cell')
    yourAnswerDiv.innerHTML = ''
}