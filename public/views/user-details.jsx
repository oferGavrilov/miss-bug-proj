import { bugService } from "../services/bug.service.js"
import { userService } from "../services/user.service.js"
import { BugList } from "../cmps/bug-list.jsx"

const { useState, useEffect} = React
const { Link } = ReactRouterDOM

export function UserDetails() {
    const [user, setUser] = useState(userService.getLoggingUser())
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [maxPages , setMaxPages] = useState(0)
    const [bugs, setBugs] = useState([])


    useEffect(() => {
        loadBugs()
    }, [])


    function loadBugs() {
        // setInLoading(true)
        bugService.query()
            .then((bugsData) => {
                setBugs(bugsData.bugs)
                setMaxPages(bugsData.totalPages)
                // setInLoading(false)
            })
    }

    function onChangePage(number) {
        if (filterBy.pageIdx + number < 0 || filterBy.pageIdx + number > maxPages - 1) return
        setFilterBy((prevFilter) => {
            return { ...prevFilter, pageIdx: prevFilter.pageIdx + number }
        })
    }

    console.log(user)
    return <section className="user-details">
        <h2>Welcome back {user.fullname}</h2>
        <BugList bugs={bugs} user={user} />

        <button className='prev-btn btn' onClick={() => onChangePage(-1)}>Prev</button>
        <span className='curr-page-num'>{filterBy.pageIdx + 1}</span>
        <button className='next-btn btn' onClick={() => onChangePage(1)}>Next</button>

        <Link to={'/bug'}>Back</Link>
    </section>
}