import {Component} from 'react'

import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorShow: false, errMsg: ''}

  changeTheUsername = event => {
    this.setState({username: event.target.value})
  }

  changeThePassword = event => {
    this.setState({password: event.target.value})
  }

  renderSuccessView = token => {
    const {history} = this.props
    Cookies.set('jwt_token', token, {expires: 30})
    history.replace('/')
  }

  submitTheForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.renderSuccessView(data.jwt_token)
    } else {
      this.setState({errorShow: true, errMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, errorShow, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <div className="mobile-view">
          <img
            src="https://res.cloudinary.com/dknazoxuw/image/upload/v1680671555/Ellipse_99_d7naxn.jpg"
            alt="website login"
            className="mobile-image"
          />
          <img
            src="https://res.cloudinary.com/dknazoxuw/image/upload/v1680973707/Rectangle_1467_1_xmasdj.png"
            alt="website login"
            className="desktop-image"
          />
          <div className="login-bottom-container">
            <img
              src="https://res.cloudinary.com/dknazoxuw/image/upload/v1680672503/Group_7732_b6msll.png"
              alt="login website logo"
              className="mobile-icon"
            />
            <form className="form" onSubmit={this.submitTheForm}>
              <label htmlFor="username" className="label">
                Username*
              </label>
              <input
                type="text"
                id="username"
                value={username}
                className="input"
                placeholder="USERNAME"
                onChange={this.changeTheUsername}
              />
              <label htmlFor="password" className="label">
                Password*
              </label>
              <input
                type="password"
                id="password"
                value={password}
                className="input"
                placeholder="PASSWORD"
                onChange={this.changeThePassword}
              />
              {errorShow && <p className="error-msg">{errMsg}</p>}
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
