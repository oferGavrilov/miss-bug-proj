

export function BugPreview({ bug }) {
    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <h3>Owner: {bug.creator.fullname}</h3>
    </article>
}