const fs = require('fs')
const PDFDocument = require('pdfkit')
var bugs = require('../data/bugs.json')

module.exports = {
    query,
    save,
    get,
    remove,
    createPDF
}


function query(filterBy , sortBy) {
    console.log('bugs from server' ,bugs)
    let filteredBugs = bugs
    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        filteredBugs = filteredBugs.filter(bug => regex.test(bug.title))
    }
    if(filterBy.severity){
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.severity)
    }
    if(+sortBy.createdAt === 1){
        filteredBugs = filteredBugs.sort((a, b) => a.createdAt - b.createdAt)
    }
    if(+sortBy.createdAt === -1){
        filteredBugs = filteredBugs.sort((a, b) => b.createdAt - a.createdAt)
    }
    if(filterBy.labels){
        const labels = filterBy.labels.split(',')
        filteredBugs = filteredBugs.filter(bug => bug.labels.some(label => labels.some(currLabel => label === currLabel)))
    }
    // Paging
    const totalPages = Math.ceil(filteredBugs.length / +filterBy.pageSize)
    if(filterBy.pageIdx !== undefined){
        const startIdx = filterBy.pageIdx * +filterBy.pageSize
        filteredBugs = filteredBugs.slice(startIdx , +filterBy.pageSize + startIdx)
    }
    return Promise.resolve({totalPages , bugs:filteredBugs})
}

function save(bug) {
    if (bug._id) {
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        bugToUpdate.title = bug.title
        bugToUpdate.description = bug.description
        bugToUpdate.severity = +bug.severity
        // bugToUpdate.data = +bug.data
    } else {
        bug._id = _makeId()
        bugs.push(bug)
    }
    return _writeBugsToFile().then(() => bug)
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug not found: ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    bugs = bugs.filter(bug => bug._id !== bugId)
    return _writeBugsToFile()
}





function createPDF() {
    console.log('pdf service backend')
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.font('Times-Bold').fontSize(31).text('List of current Bugs:', {
        align: 'center'
    })
    bugs.map((bug, idx) => {
        doc.pipe(fs.createWriteStream('output.pdf'))
        doc.font('Times-Bold').fontSize(21).text(`${idx}. ${bug.title}:`)
        doc.font('Times-Roman').fontSize(15).text(`${bug.description}. Severity of bug: ${bug.severity}`).moveDown(1.5)
    })
    doc.end()
}
//private functions
function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function _writeBugsToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return rej(err)

            res()
        })
    })
} 
