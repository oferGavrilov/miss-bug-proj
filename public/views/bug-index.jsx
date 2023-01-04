import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'

const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function BugIndex() {

    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [inLoading, setInLoading] = useState(false)
    const [sortBy, setSortBy] = useState(bugService.getDefaultSort())
    const [maxPages , setMaxPages] = useState(0)
    // const [user , setUser] = useState(userService.getLoggingUser() || null)

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy])

    function loadBugs() {
        setInLoading(true)
        bugService.query(filterBy, sortBy)
            .then((bugsData) => {

                setBugs(bugsData.bugs)
                setMaxPages(bugsData.totalPages)
                setInLoading(false)
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
    }
    function onSetSort(sortBy) {
        setSortBy(sortBy)
    }
    function onRemoveBug(bugToDelete) {
        const {_id , username , password} = userService.getLoggingUser()
        if(_id !== bugToDelete.creator._id && username !== 'admin' && password !== 'admin') {
            showErrorMsg('Its not your business!')
            return
        }
        bugService.remove(bugToDelete._id)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugToDelete._id)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }



    return (
        <section className='main-bugs-container'>
            <BugFilter onSetFilter={onSetFilter} onSetSort={onSetSort} bugs={bugs} maxPages={maxPages} />

            <main>
                <div className='additional-btns'>
                    <Link to={`/bug/edit`}><button  className='add-btn'>Add Bug ⛐</button></Link>
                    <button className='export-btn' onClick={() => bugService.getPDF()}>Export bug to PDF</button>
                </div>

                {!inLoading && <BugList bugs={bugs} onRemoveBug={onRemoveBug} />}
                {inLoading && <div className='loading'>Loading...</div>}
                {!bugs.length && <div>No more bugs to show...</div>}
            </main>
        </section>
    )


}
