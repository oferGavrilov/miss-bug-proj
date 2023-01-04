
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { LoginForm } from './login-form.jsx'
const {useState} = React

export function LoginSignup({onChangeLoginStatus}) {

    const [isSignup , setIsSignup] = useState(false)

    function onLogin(credentials){
        isSignup ? signup(credentials) : login(credentials)
    }

    function login(credentials) {
        userService.login(credentials)
            .then(() => onChangeLoginStatus(credentials))
            .then(() => showSuccessMsg('Login successful'))
            .catch(err => showErrorMsg('Oops try again!'))
    }

    function signup(credentials) {
        userService.signup(credentials)
           .then(() => onChangeLoginStatus(credentials))
           .then(() => showSuccessMsg('Signup successful'))
           .catch(err => showErrorMsg('Oops try again!'))
    }

    return <div className="login-page">
        <LoginForm onLogin={onLogin} isSignup={isSignup} />
        <div className='btns'>
            <a href="#" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Already a member ? Login' : 'New user? Signup here'}
            </a>
        </div>
    </div>

}