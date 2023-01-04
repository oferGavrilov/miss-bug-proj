function createEventEmitter() {
    const listenersMap = {}
    return {
        on(evName, listener){
            listenersMap[evName] = (listenersMap[evName])? [...listenersMap[evName], listener] : [listener]
            return ()=>{
                listenersMap[evName] = listenersMap[evName].filter(func => func !== listener)
            }
        },
        emit(evName, data) {
            if (!listenersMap[evName]) return
            listenersMap[evName].forEach(listener => listener(data))
        }
    }
}

export const eventBusService = createEventEmitter()

export function showUserMsg(msg) {
    eventBusService.emit('show-user-msg', msg)
}

export function showSuccessMsg(txt) {
    showUserMsg({txt, type: 'success'})
}
export function showErrorMsg(txt) {
    showUserMsg({txt, type: 'error'})
}


// Service Testing:
// eventBus.on('muk', console.log)
// eventBus.on('puk', console.log)
// const unsubscribe = eventBus.on('puk', data=>{
//     console.log('Mee too:', data)
// })

// setTimeout(()=>{
//     unsubscribe()
// }, 5000)
// eventBus.emit('puk', 'Buuuu!')
// setTimeout(()=>{
//     eventBus.emit('puk', 'Buuuu!')
// }, 5500)
