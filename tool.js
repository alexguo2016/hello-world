const log = console.log.bind(console)

const find = str => {
    return document.querySelector(str)
}

// 自定义 localStorage 的操作
// 自动 stringify
const setStorage = (name, value) => {
    let v = JSON.stringify(value)
    window.localStorage.setItem(name, v)
}
// 自定义 get localStorage 操作
// 自动 parse
// 如果没有相应的值, 返回空
const getStorage = name => {
    let v = window.localStorage.getItem(name)
    if (v) {
        return JSON.parse(v)
    } else {
        return ''
    }
}