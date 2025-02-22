const fs = require('fs')
const path = require('path')


// 使用 Promise 获取文件
function getFileContent(fileName) {
    const promise = new Promise((resolve,reject)=> {
            const fullFilename = path.resolve(__dirname,'files',fileName)
        
            fs.readFile(fullFilename, (err,data) => {
                if (err) {
                    reject(err)
                    return
                }
        
                resolve(
                    JSON.parse(data.toString())
                )
        })
    })
    return promise
}

// // Promise 链式引用 和 then操作
getFileContent('a.json').then(aData => {
    console.log('a Data:', aData)
    return getFileContent(aData.next)
}).then(bData => {
    console.log("b Data: ", bData)
    return getFileContent(bData.next)
}).then(cData => {
    console.log("c Data:" ,cData)
})


// 异步函数 async / await 处理
async function readFileData() {
    const aData = await getFileContent('a.json')
    console.log(aData)
    const bData = await getFileContent(aData.next)
    console.log(bData)
    const cData = await getFileContent(bData.next)
    console.log(cData)
}

console.log(readFileData())  // readFileData（） 返回的也是 promise 

// Promise 函数的基本框架
// function getFileContent(fileName) {
//     const promise = new Promise((resolve,reject)=> {

//     })
//     return promise
// }


// 测试 getFileContent 
// Callback - hell 
// getFileContent('a.json', aData => {
//     console.log('aData: ', aData)
//     getFileContent(aData.next , bData => {
//         console.log('bData:', bData)
//         getFileContent(bData.next, cData => {
//             console.log('cData: ', cData)
//         })
//     })
// })

// async / await 的规则：
// 1. await 后面可以追加 promise 对象，获取 resolve 的值
// 2. await 必须在 async 函数中
// 3. async 返回的也是 promise 
// 4. try catch 能捕获 promise 中 reject 的值

// try catch 和 async / await 一起使用
async function readFileData() {
    try{
        const aData = await getFileContent('a.json')
        console.log(aData)
        const bData = await getFileContent(aData.next)
        console.log(bData)
        const cData = await getFileContent(bData.next)
        console.log(cData)
    }
    catch (err) {
        console.error(err)
    }
}