import { bugService } from '../services/bug.service.js'
const { useState, useEffect } = React

export function BugFilter({ onSetFilter, onSetSort, maxPages }) {

    const [filterByToEdit, setFilterByToEdit] = useState(bugService.getDefaultFilter())
    const [sortByToEdit, setSortByToEdit] = useState(bugService.getDefaultSort())
    const [isSorted, setIsSorted] = useState(false)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    useEffect(() => {
        onSetSort(sortByToEdit)
    }, [sortByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = (type === 'severity') ? +value : value
        setFilterByToEdit((prevFilter) => {
            return { ...prevFilter, [field]: value }
        })
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    function onChangePage(number) {
        if (filterByToEdit.pageIdx + number < 0 || filterByToEdit.pageIdx + number > maxPages - 1) return
        setFilterByToEdit((prevFilter) => {
            return { ...prevFilter, pageIdx: prevFilter.pageIdx + number }
        })

    }

    function handleSortChange() {
        setIsSorted(!isSorted)
        var value =  (isSorted ? 1 : -1) 
        // let { value, name: field, type } = target
        setSortByToEdit((prevFilter) => {
            return { ...prevFilter, createdAt: value }
        })
    }



    return <section className="bug-filter">
        <h2>Bug filter:</h2>
        <form onSubmit={onSubmitFilter}>
            <label htmlFor="title-filter">Title:</label>
            <input type="text"
                id="title-filter"
                name="title"
                placeholder="Title..."
                value={filterByToEdit.title}
                onChange={handleChange} />

            <label htmlFor="severity-filter">Severity:</label>
            <input type="number"
                id='severity-filter'
                name='severity'
                placeholder="0"
                value={filterByToEdit.severity}
                onChange={handleChange} />

            <label htmlFor="label-filter">Label:</label>
            <input type="text"
                id='label-filter'
                name='labels'
                placeholder='labels..'
                value={filterByToEdit.labels}
                onChange={handleChange} />

            <button>Filter</button>
        </form>
        <div className='paging-container'>
            <button className='prev-btn btn' onClick={() => onChangePage(-1)}>Prev</button>
            <span className='curr-page-num'>{filterByToEdit.pageIdx + 1}</span>
            <button className='next-btn btn' onClick={() => onChangePage(1)}>Next</button>
            <button onClick={handleSortChange}>Sort by date</button>
        </div>
    </section>
}