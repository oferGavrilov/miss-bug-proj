import { bugService } from "../services/bug.service.js"
import {userService} from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
const { Link } = ReactRouterDOM


const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM
export function BugEdit() {

    const [bugToEdit, setBugToEdit] = useState(bugService.createEmptyBug())
    const navigate = useNavigate()
    const { bugId } = useParams()

    useEffect(() => {
        console.log('bugId: ', bugId)
        if (!bugId) return
        loadBug()
    }, [])

    function loadBug() {
        bugService.get(bugId)
            .then(bug => {
                setBugToEdit(bug)
            })
            .catch((err) => {
                console.log(err)
                navigate('/bug')
            })
    }

    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = type === 'number' ? +value : value
        setBugToEdit((prevBug) => ({ ...prevBug, [field]: value }))
    }

    function onSaveBug(ev) {
        ev.preventDefault()
        const loggedUser = userService.getLoggingUser() || null
        if (!loggedUser ) return showErrorMsg('Please login first')
        if(bugId && loggedUser._id !== bugToEdit.creator._id && loggedUser.username !== 'admin' && loggedUser.password !== 'admin') return showErrorMsg('Its not your business!')
        
        bugToEdit.creator ={
            fullname : loggedUser.fullname,
            _id: loggedUser._id
        }
        bugService.save(bugToEdit).then((bug) => {
            showSuccessMsg('Bug updated')
            navigate(`/bug/`)
        })
        .catch((err)=> {
            console.log(err)
            showErrorMsg('Bug could not be saved')
        })
    }


    return <section className="bug-edit">
        <h2>{bugToEdit._id ? 'Edit this bug' : 'Add a new bug'}</h2>

        <form onSubmit={onSaveBug}>
            <label htmlFor="title">Title:</label>
            <input type="text"
                id="title"
                name="title"
                placeholder="Title.."
                value={bugToEdit.title}
                onChange={handleChange} />

            <label htmlFor="description">Description</label>
            <input type="text"
                id="description"
                name="description"
                placeholder="Description.."
                value={bugToEdit.description}
                onChange={handleChange} />

            <label htmlFor="severity">Severity</label>
            <input type="number"
                id="severity"
                name="severity"
                placeholder="Severity..."
                value={parseInt( bugToEdit.severity)}
                onChange={handleChange} />

            <button>{bugToEdit._id ? 'Save' : 'Add'}</button>
            <Link className="back-btn" to="/bug">Cancel</Link>
        </form>
    </section>
}