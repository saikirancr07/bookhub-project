import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import {AiFillCloseCircle} from 'react-icons/ai'

import Header from '../Header'
import popupContext from '../../context/popupContext'
import Footer from '../Footer'

import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1439,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1800,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {status: '', relatedBooksList: []}

  componentDidMount() {
    this.getTheBooks()
  }

  getTheBooks = async () => {
    this.setState({status: 'INPROGRESS'})
    const jwtToken = Cookies.get('jwt_token')
    const relatedBooksUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(relatedBooksUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.books.map(eachItem => ({
        id: eachItem.id,
        title: eachItem.title,
        authorName: eachItem.author_name,
        coverPic: eachItem.cover_pic,
      }))
      this.setState({relatedBooksList: updatedData, status: 'SUCCESS'})
    } else {
      this.setState({status: 'FAILURE'})
    }
  }

  renderTheRelatedBooksList = () => {
    const {relatedBooksList} = this.state
    return (
      <ul className="home-slider-list-container">
        <Slider {...settings} className="slider">
          {relatedBooksList.map(eachItem => {
            const {id} = eachItem
            return (
              <li key={eachItem.id} className="slider-content">
                <Link to={`/books/${id}`} className="home-normal-link-item">
                  <img
                    src={eachItem.coverPic}
                    alt={eachItem.title}
                    className="cover-pic"
                  />
                  <p className="author-name">{eachItem.authorName}</p>
                  <h1 className="title">{eachItem.title}</h1>
                </Link>
              </li>
            )
          })}
        </Slider>
      </ul>
    )
  }

  renderTheLoading = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderTheSuccessView = () => (
    <>
      <div className="slider-container">
        <div className="desktop-heading-button">
          <h1 className="desktop-slider-container-heading">Top Rated Books</h1>
          <Link to="/shelf">
            <button type="button" className="desktop-find-books">
              Find Books
            </button>
          </Link>
        </div>
        {this.renderTheRelatedBooksList()}
      </div>
      <Footer />
    </>
  )

  clickTheTryAgainButton = () => {
    this.getTheBooks()
  }

  renderTheFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dknazoxuw/image/upload/v1680834979/Group_7522_d1vu1e.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="some-thing-went-wrong">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="try-again"
        onClick={this.clickTheTryAgainButton}
      >
        Try Again
      </button>
    </div>
  )

  renderTheStatus = () => {
    const {status} = this.state

    switch (status) {
      case 'INPROGRESS':
        return this.renderTheLoading()
      case 'SUCCESS':
        return this.renderTheSuccessView()
      case 'FAILURE':
        return this.renderTheFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <popupContext.Consumer>
        {value => {
          const {showPopup, changeThePopupValue} = value
          const clickTheCloseButton = () => {
            changeThePopupValue()
          }
          const clickTheLogoutButtonInPopup = () => {
            const {history} = this.props
            Cookies.remove('jwt_token')
            history.replace('/login')
          }
          return (
            <div className="home-bg-container">
              <Header />
              {showPopup && (
                <div className="popup-container">
                  <Link to="/" className="normal-link-item">
                    <p className="popup-home">Home</p>
                  </Link>
                  <Link to="/shelf" className="normal-link-item">
                    <p className="popup-bookshelves">Bookshelves</p>
                  </Link>
                  <button
                    type="button"
                    className="popup-logout"
                    onClick={clickTheLogoutButtonInPopup}
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    className="close-button"
                    onClick={clickTheCloseButton}
                  >
                    <AiFillCloseCircle size="20" />
                  </button>
                </div>
              )}
              <h1 className="home-heading">Find Your Next Favorite Books?</h1>
              <p className="home-para">
                You are in the right place. Tell us what titles or genres you
                have enjoyed in the past, and we will give you surprisingly
                insightful recommendations.
              </p>
              <Link to="/shelf">
                <button type="button" className="find-books">
                  Find Books
                </button>
              </Link>
              {this.renderTheStatus()}
            </div>
          )
        }}
      </popupContext.Consumer>
    )
  }
}

export default Home
