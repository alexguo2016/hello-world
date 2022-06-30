const showStaff = (event) => {
    // log('showStaff')
    // log(event)
    // 改变的是 div-show-staff 的显示与否
    let div = find('.div-show-staff')
    div.classList.toggle('hidden')
    // 顺便改变按钮的文本
    let target = event.target
    if (div.classList.contains('hidden')) {
        target.innerHTML = '展示五线谱'
    } else {
        target.innerHTML = '隐藏五线谱'
    }
}

const startPractise = (event) => {
    // log('startPractise')
    reflashQuiz()
}

const clickMusicName = (event) => {
    // log('clickMusicName', event.target.dataset)
    // event.target.dataset 里面, 存的 answer
    let answer = event.target.dataset.answer
    // 点击之后, 推入结果数组
    // 另外用一个函数来做
    addAnswer(answer)
}

const addAnswer = answer => {
    // 读取 元素的值, 修改元素的值
    let answerDiv = find('.div-answer-for-show')
    let oriAnswer = answerDiv.innerHTML
    // log(answer, `(${oriAnswer})`, 'ans')
    let answerLenLimit = 5
    // oriAnswer 应该转换为 数组, 因为现在有 CP CM 等情况了
    // 有问题, innerHTML 为 空的时候, 是一个空字符串, split 出来的是一个 [''] 数组
    // 做一个 hack
    if (oriAnswer == '') {
        oriAnswer = []
    } else {
        oriAnswer = oriAnswer.split(',')
    }
    // log('oriAnswer', oriAnswer, oriAnswer.length)
    if (oriAnswer.length >= answerLenLimit) {
        // log('too much')
        alert(`答案太多了, 最多 ${answerLenLimit} 个`)
        return
    } else {
        // 修改, oriAnswer 变成数组形式, 最后 join 一下
        // let newAnswer = oriAnswer + answer
        // answerDiv.innerHTML = newAnswer
        oriAnswer.push(answer)
        let newAnswer = oriAnswer.join(',')
        // log('text??', newAnswer, oriAnswer)
        answerDiv.innerHTML = newAnswer
    }
}

const delAnswer = () => {
    let answerDiv = find('.div-answer-for-show')
    let oriAnswer = answerDiv.innerHTML
    if (oriAnswer.length < 1) {
        return
    } else {
        let newAnswer = oriAnswer.slice(0, oriAnswer.length - 1)
        answerDiv.innerHTML = newAnswer
    }
}

const onSubmit = event => {
    // 如果已经提交过, hasSubmitted true, 则return
    // 防止过度提交, 扰乱 ErrorHistory 的记录
    let hasSubmitted = getStorage('hasSubmitted')
    if (hasSubmitted) {
        return
    }
    // log('submit')
    // 有两个功能
    // 1, 对答案
    // 2, 刷新题目
    // 如果答题区 innerHTML 为空, 则刷新题目
    let answerZone = find('.div-answer-for-show')
    let text = answerZone.innerHTML
    if (!text) {
        // reflashQuiz()
    } else {
        setStorage('hasSubmitted', true)
        let res = ensureAnswer(text)
        // log('text', res, text)
        if (res) {
            // 如果完全答对了, 显示 "答对了" 到 canvas 上面
            drawResult('答对了')
        } else {
            // 如果错了, 打印答案到 canvas 上面
            let ans = getStorage('currentQuizAnswer').join('-')
            drawResult('答案是: ' + ans)
            // 补充功能, 统计错误
            addErrorHistory(text)
        }
    }
}

// 统计错误功能
const  addErrorHistory = (inputAnswer) => {
    // log('addErrorHistory')
    // 对比 realAnswerStr 和 inputAnswer
    // 将错误的次数更新
    // 错误的总次数, 记录在 localStorage 里面的 errorHistory
    // 要在项目初始化的时候, 初始化一个 errorHistory, 是一个对象
    // realAnswerStr 也从 storage 里面取好了
    let eh = getStorage('errorHistory')
    let realAns = getStorage('currentQuizAnswer')
    let ans = inputAnswer.split('')
    // 遍历 realAns
    for (let i = 0; i < realAns.length; i++) {
        let item = realAns[i]
        let item_ans = ans[i]
        if (!item.includes(item_ans)) {
            // 记录
            if (!eh[item]) {
                eh[item] = 1
            } else {
                eh[item] += 1
            }
        }
    }
    // 最后, 更新 errorHistory
    setStorage('errorHistory', eh)
}

const drawResult = text => {
    let c = find('.canvas-for-show')
    var ctx = c.getContext("2d")
    ctx.font = "18px Times New Roman"
    ctx.fillText(text, 5, 210)
}

const reflashQuiz = () => {
    let notes = genRandomNotes()
    // let notes = ["A","DP","DP","G","E"]
    // log(notes, 'notes')
    showQuestion_quizStaffName(notes)
    // 每次刷新的时候, 将答案保存在 localStorage 里面
    setStorage('currentQuizAnswer', notes)
    // 也得刷新答题区
    clearAnswerZone()
    // 刷新 hasSubmitted
    setStorage('hasSubmitted', false)
}

// 刷新答题区
const clearAnswerZone = () => {
    let answerZone = find('.div-answer-for-show')
    answerZone.innerHTML = ""
}

const ensureAnswer = (text) => {
    // log('ensureAnswer')
    // 对答案
    // 从 localStorage 里面获取答案
    // 从 答题区获取作答内容
    // 对比
    // 注意, 只需要回答 ABC 之类就可以, 不需要管 P 或是 M
    let ans = getStorage('currentQuizAnswer') || []
    if (ans.length < 1) {
        alert('请刷新题目')
    }

    // 转换成数组, 一一比较
    // 注意, 分隔符变成 , 了
    let myAns = text.split(',')
    // log('myAns', myAns, text)
    // 一一比较
    if (myAns.length != ans.length) {
        return false
    }

    for (let i = 0; i < ans.length; i++) {
        let real_ans = ans[i]
        let my_ans = myAns[i]
        if (real_ans.includes(my_ans)) {
            // 字符串里面包含, 证明是正确答案, 不用管
            // 例如, 答案是 AM, 回答的是 A
        } else {
            // log('in for??')
            return false
        }
    }
    // 循环结束之后, 说明都对了
    return true
}

const toggleErrorHistory = (event) => {
    // 显示 or 隐藏区域
    let divForShow = find('.div-error-outer')
    divForShow.classList.toggle('none')
    let text = event.target.innerHTML
    if (text === '显示错误统计') {
        event.target.innerHTML = '隐藏错误统计'
        // log('errorHistory')
        // 在 div-error-history div 里面插入 errorHistory
        // 1, 读取 errorHistory
        let eh = getStorage('errorHistory')
        // log('eh', eh)
        genDivFromObject(eh, '.div-error-history')
    } else {
        event.target.innerHTML = '显示错误统计'
    }
    
}

const genDivFromObject = (object, divClassName) => {
    let target = find(divClassName)
    // 先清空上次结果
    target.innerHTML = ''
    let res = ``
    for (let k in object) {
        let v = object[k]
        let template = `
            <div class="div-error-cell">
                <span>${k}</span>: <span>${v}</span>
            </div>
        `
        res += template
    }
    target.insertAdjacentHTML('beforeend', res)
}

// 展示题目, 回答音名部分
const showQuestion_quizStaffName = (notes) => {
    // 在 canvas 上面画题目
    let c = find('.canvas-for-show')
    var ctx = c.getContext("2d")
    // 画之前, 清除上一个画布
    ctx.clearRect(0, 0, 300, 250)
    let start = [20, 40]
    for (let i = 0; i < notes.length; i++) {
        // 注意, 每个 note 的 drawStart[0], += 45
        let start_x = start[0] + 55*i
        let drawStart = [
            start_x,
            start[1],
        ]
        let note = notes[i]
        drawOneQuiz(ctx, note, drawStart)
    }
}

const drawOneQuiz = (ctx, note, drawStart) => {
    var x = drawStart[0]
    var y = drawStart[1]
    var noteStart = [x, y]
    // 无线谱, 包含上加一线 上加二线 下加一线 下加二线, 共 9 条
    let lineCount = 9
    for (let i = 0; i < lineCount; i++) {
        y += 15
        let start = [x, y]
        let end = [x + 40, y]
        drawLine(start, end, ctx, i)
    }
    // let note = 'EP'
    // let start = [x, y]
    drawNote(noteStart, note, ctx)
}

const drawNote = (start, note, ctx) => {
    // log('arc')
    // 根据 note, 决定在哪个位置画图
    // 上加二线 的 y 是 +0, 上加一线的 y 是 +20
    let noteMap = {
        CPP: 0,

        BP: 0.5,
        AP: 1,
        GP: 1.5,
        FP: 2,
        EP: 2.5,
        DP: 3,
        CP: 3.5,

        B: 4,
        A: 4.5,
        G: 5,
        F: 5.5,
        E: 6,
        D: 6.5,
        C: 7,

        BM: 7.5,
        AM: 8,
    }
    // notePostion 代表这个 note 在 y 上面 +20*i 的 i
    let notePosition = noteMap[note]
    let y = start[1]
    let x = start[0]
    // log('before, xy', x, y, notePosition)
    y = y + 15 * notePosition + 15
    x = x + 20
    // log('??', y)
    
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    // 绘制圆的路径**
    // log(x, y, 'after')
    ctx.arc(x, y, 5, 0, Math.PI * 2, false)
    // 0°是从三点钟方向开始的

    // 描边路径
    ctx.stroke();
}

const drawLine = (start, end, ctx, i) => {
    ctx.beginPath();
    if (i > 1 && i < 7) {
        // 中间的五条线
        ctx.strokeStyle = "#FF0000"
    } else if (i <= 1) {
        // 上加一线 和 上加二线
        ctx.strokeStyle = "#00FF00"
    } else {
        // 下加一线 和 下加二线
        ctx.strokeStyle = "#00FF00"
    }
    // ctx.moveTo(0,0);
    ctx.moveTo(start[0], start[1])
    // ctx.lineTo(300,150);
    ctx.lineTo(end[0], end[1])
    ctx.stroke();
}

const genRandomNotes = () => {
    let notesList = [
        'CPP', 'BP', 'AP', 'GP', 'FP', 'EP', 'DP',
        'CP', 'B', 'A', 'G', 'F', 'E', 'D', 'C',
        'BM', 'AM'
    ]
    let result = []
    let i = 0
    while (i < 5) {
        // log('while')
        let num = notesList.length + 3
        let index = Math.ceil(Math.random() * num)
        // log('index', index)
        if (index < notesList.length) {
            let note = notesList[index]
            result.push(note)
            i++
        } else {
        }
        // i++
    }
    return result
}

// 初始化本地 localStorage
const initLocalStorage = () => {
    // 1, 初始化一个 errorHistory, 用于记录错误次数
    let eh = getStorage('errorHistory')
    if (!eh) {
        // errorHistory 是一个对象, 形如
        /*
        {
            C: 3,
            D: 4,
        }
        */
        setStorage('errorHistory', {})
    }
    // 2, 初始化一个 currentQuizAnswer
    let cqa = getStorage('currentQuizAnswer')
    if (!cqa) {
        setStorage('currentQuizAnswer', [])
    }
    // 3, 初始化一个代表是否提交了答案的全局变量
    setStorage('hasSubmitted', false)

}