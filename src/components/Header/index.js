import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import popupContext from '../../context/popupContext'

import './index.css'

const Header = props => {
  const clickTheLogoutButton = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <popupContext.Consumer>
      {value => {
        const {changeThePopupValue} = value
        const clickTheHumbergButton = () => {
          changeThePopupValue()
        }
        return (
          <nav className="navbar">
            <Link to="/" className="normal-link-item">
              <img
                src="https://res.cloudinary.com/dknazoxuw/image/upload/v1680672503/Group_7732_b6msll.png"
                alt="website logo"
                className="header-mobile-icon"
              />
            </Link>
            <button
              type="button"
              className="humberg-button"
              onClick={clickTheHumbergButton}
            >
              <img
                src="https://res.cloudinary.com/dknazoxuw/image/upload/v1680714638/icon_se6vld.png"
                alt=""
                className="humberg-menu"
              />
            </button>
            <div className="header-right-container">
              <Link to="/" className="normal-link-item">
                <p className="home">Home</p>
              </Link>
              <Link to="/shelf" className="normal-link-item">
                <p className="book-shelves">Bookshelves</p>
              </Link>
              <button
                type="button"
                className="logout-button"
                onClick={clickTheLogoutButton}
              >
                Logout
              </button>
            </div>
          </nav>
        )
      }}
    </popupContext.Consumer>
  )
}
export default withRouter(Header)
