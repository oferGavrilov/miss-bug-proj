import { userService } from "../services/user.service.js"

const {useState} = React

export function LoginForm({onLogin , isSignup}) {

    const [credentials , setCredentials] = useState(userService.getEmptyCredentials())

    function handleChange({target}) {
        let {value , name:field} =target
        setCredentials((prevCreds) => ({...prevCreds, [field]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        onLogin(credentials)
    }

    return (
        <form className="login-form" onSubmit={onSubmit}>
            <input type="text"
                name="username"
                value={credentials.username}
                placeholder="Username.."
                onChange={handleChange} />

            <input type="password"
                name="password"
                value={credentials.password}
                placeholder="Password.."
                onChange={handleChange}
            />
            {isSignup && <input 
                type="text"
                name="fullname"
                value={credentials.fullname}
                placeholder="Full Name.."
                onChange={handleChange}
            />}
            <button>{isSignup ? 'Signup' : 'Login'}</button>
        </form>
    )
}