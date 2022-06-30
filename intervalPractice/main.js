
const actionList = {
    // 提交回答
    'btn-answer': submit,
    // 刷新问题
    'btn-reflash': reflash,
    // 点击变化程度
    'div-change-cell': clickChange,
    // 点击基本音程
    'div-len-cell': clickLen,
}

// 触发绑定动作
const triggerAction = (classList, event) => {
    // log('triggerAction', classList)
    let actionArr = Object.keys(actionList)
    // 遍历触发
    for (let i = 0; i < actionArr.length; i++) {
        let item = actionArr[i]
        if (classList.includes(item)) {
            actionList[item](event)
        }
    }
}

// 在页面的最上层, 绑定事件委托
// 所有事件, 通过事件冒泡来, 根据被点击的 class 名字来判断是哪个元素发出的动作
// 判断 e.target.classList 里面是否包含特定 class
const bindAll = () => {
    let ele = find('.div-outer')
    ele.addEventListener('click', e => {
        // log(e)
        // 需要注意的是, 点击伪元素, 其实就是伪元素前面的 class
        // log(e.target.classList)
        // 注意, classList 是一个类数组对象, 需要转成 数组, 否则无法使用 array.includes
        let cl = Array.from(e.target.classList)
        triggerAction(cl, e)
    })
}

// 答案 和 问题
var custAnswer = ''
var custChange = ''
var custLen = ''
var newQuestionAnswer = []
const __main = () => {
    // let notes = ['CPP', 'BP', 'AP', 'GP', 'FP']
    // initLocalStorage()
    bindAll()
    // reflashQuiz()
}

__main()