
const actionList = {
    // 展示五线谱
    'btn-show-staff': showStaff,
    // 开始练习
    'btn-start-practise': startPractise,
    // 点击音名
    'div-answer-cell': clickMusicName,
    // 删除答案, 音名
    // 需要注意, 点击伪元素的时候, 是没有 div-answer-for-show::after 的 class 的, 只有 div-answer-for-show
    'div-answer-for-show': delAnswer,
    // 提交答案
    'div-answer-btn': onSubmit,
    'div-answer-btn-reflash': reflashQuiz,
    'btn-show-error-history': toggleErrorHistory,
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

const __main = () => {
    // let notes = ['CPP', 'BP', 'AP', 'GP', 'FP']
    initLocalStorage()
    bindAll()
    reflashQuiz()
}

__main()