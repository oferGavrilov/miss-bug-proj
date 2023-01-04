const fs = require('fs')

const Cryptr = require('cryptr')
const cryptr = new Cryptr('secret-bug-1234')

var users = require('../data/user.json')


module.exports = {
    query,
    get,
    login,
    remove,
    signup,
    validateToken,
    getLoginToken
}

function query() {
    return Promise.resolve(users)
}

function get(userId) {
    const user = users.find(user => user.id === userId)
    if (!user) return Promise.reject('User not found')
    return Promise.resolve(user)
}

//Login
function login(credentials) {
    const user = users.find(u => u.username === credentials.username)
    if (!user) return Promise.reject('Login failed')
    return Promise.resolve(user)
}

function remove(userId) {
    const idx = users.findIndex(user => user.id === userId)
    if (idx === -1) return Promise.reject('User not found')
    users.splice(idx, 1)
    return Promise.resolve('User removed successfully')
}

function signup({fullname , username , password}){
    const userToSave = {
        _id: _makeId(),
        fullname,
        username,
        password
    }
    users.push(userToSave)
    return _writeUsersToFile().then(() => userToSave)
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedUser = JSON.parse(json)
        return loggedUser
    } catch(err){
        console.log('Invalid login token')
    }
    return null
}


function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


function _writeUsersToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) return rej(err)
            // console.log("File written successfully\n");
            res()
        })
    })
}