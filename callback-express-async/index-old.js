const fs = require('fs')
const path = require('path')

// 模拟 Callback 过程
// const fullFilename = path.resolve(__dirname,'files','a.json')

// fs.readFile(fullFilename, (err,data) => {
//     if (err) {
//         console.error(err)
//         return
//     }

//     console.log(data.toString())
// })

// callback 方式获取文件内容
function getFileContent(fileName,callback) {
    const fullFilename = path.resolve(__dirname,'files',fileName)

    fs.readFile(fullFilename, (err,data) => {
        if (err) {
            console.error(err)
            return
        }

        callback(
            JSON.parse(data.toString())
        )
    })
}

// 测试 getFileContent 
// Callback - hell 
getFileContent('a.json', aData => {
    console.log('aData: ', aData)
    getFileContent(aData.next , bData => {
        console.log('bData:', bData)
        getFileContent(bData.next, cData => {
            console.log('cData: ', cData)
        })
    })
})