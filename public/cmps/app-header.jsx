const { NavLink , Link} = ReactRouterDOM
const { useState } = React

import { UserMsg } from './user-msg.jsx'
import { LoginSignup } from './login-signup.jsx'
import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
export function AppHeader() {

    const [user, setUser] = useState(userService.getLoggingUser())

    function onChangeLoginStatus(user) {
        setUser(user)
    }

    function onLogout() {
        userService.logout()
            .then(() => {
                showSuccessMsg('Logged out successfully')
                setUser(null)
            })
            .catch(err => showErrorMsg(`Try again later`))
    }

    return <header>
        <UserMsg />
        <div className='header-container'>

            <h1>Bugs are Forever</h1>
            <nav>
                <NavLink to="/">Home</NavLink> |
                <NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink> |
                {user && <NavLink to="/users">Users</NavLink>}
            </nav>
            {user ? (
                <section>
                    <h2>Hello {user.fullname}</h2>
                    <Link to={'/bug'}><button onClick={onLogout}>Logout</button></Link>
                </section>
            ) : (
                <section>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}
        </div>
    </header>
}
