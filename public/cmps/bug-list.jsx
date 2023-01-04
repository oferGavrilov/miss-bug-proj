const { Link } = ReactRouterDOM

import { BugPreview } from "./bug-preview.jsx"

export function BugList({ bugs, onRemoveBug, user }) {
    var userBugs = bugs
    if (user) {
        userBugs = userBugs.filter(bug => bug.creator._id === user._id)
    }
    return <ul className="bug-list">
        {userBugs.map(bug =>
            <li className="bug-preview" key={bug._id}>
                <BugPreview bug={bug} />
                <div className="btns-container">
                    <button className="remove-btn btn" onClick={() => { onRemoveBug(bug) }}>x</button>
                    <Link to={`/bug/edit/${bug._id}`}><button className="edit-btn btn">Edit</button></Link>
                    <Link to={`/bug/${bug._id}`}><button className="details-btn btn">Details</button></Link>
                </div>
            </li>)}
    </ul>
}