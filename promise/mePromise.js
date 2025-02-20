// 实现Promise构造器

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class mePromise {
    #state = PENDING
    #result = undefined
    #handlers = []

    constructor(executor){
        const resolve = (data) => {
            this.#changeState(FULFILLED,data)
        }
        const reject = (reason) => {        
            this.#changeState(REJECTED,reason)
        }
        try{
            executor(resolve,reject)
        }
        catch (err) {
            reject(err)
        }

        
    }

    #changeState(state , result ) {
        if (this.#state !== PENDING) return
        this.#state = state
        this.#result = result
        this.#run()
    }

    #isPromiseLike(value) {
        if (
            value !== null && 
            (typeof value ==='object' || typeof value === 'function')
        ) {
            return typeof value.then === 'function'
        }

        return false
    }

    #runTask(func) {
        if (typeof process === 'object' && typeof process.nextTick === 'function') {
            process.nextTick(func)
        }
        else if (typeof MutationObserver === 'function') {
            const ob = new MutationObserver(func)
            const textNode = document.createTextNode('1')
            ob.observe(textNode, {
                characterData: true
            })
            textNode.data = '2'
        }
        else {
            setTimeout(func,0)
        }
    }

    #runOne(callback,resolve,reject) {
        this.#runTask(() => {
            if ( typeof callback !== 'function'){
                const settled = this.#state === FULFILLED ?
                resolve : reject;
                settled(this.#result)
                return
            }
            try {
                const data = callback(this.#result)
                if (this.#isPromiseLike(data)) {
                    data.then(resolve.reject)
                }
                else {
                    resolve(data)
                }
            }
            catch (err) {
                reject(err)
            }
        })
    }


    #run() {
        if (this.#state !== PENDING) return
        while(this.#handlers.length) {
            const {
                onFulfilled,
                onRejected,
                resolve,
                reject
             } = this.#handlers.shift()
            if (this.#state === FULFILLED) {
               this.#runOne(onFulfilled,resolve,reject)
            }
            else {
               this.#runOne(onRejected,resolve,reject)
            }
        }
    }

    then(onFulfilled , onRejected) {
        return new mePromise((resolve,reject) => {
            this.#handlers.push({
                onFulfilled,
                onRejected,
                resolve,
                reject
            })
            this.#run()
        })
    }
}




