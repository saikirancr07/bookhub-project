import {Component} from 'react'

import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillCloseCircle} from 'react-icons/ai'
import {BsFillStarFill} from 'react-icons/bs'

import Header from '../Header'
import popupContext from '../../context/popupContext'
import Footer from '../Footer'

import './index.css'

class BookDetails extends Component {
  state = {status: '', bookDetailsList: []}

  componentDidMount() {
    this.getTheBookDetails()
  }

  getTheBookDetails = async () => {
    this.setState({status: 'INPROGRESS'})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        id: data.book_details.id,
        title: data.book_details.title,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        readStatus: data.book_details.read_status,
        rating: data.book_details.rating,
        aboutAuthor: data.book_details.about_author,
        aboutBook: data.book_details.about_book,
      }
      this.setState({bookDetailsList: updatedData, status: 'SUCCESS'})
    } else {
      this.setState({status: 'FAILURE'})
    }
  }

  renderTheLoading = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderTheSuccessView = () => {
    const {bookDetailsList} = this.state
    return (
      <div>
        <div className="book-details-bottom-container">
          <div className="book-details-top-container">
            <img
              src={bookDetailsList.coverPic}
              alt={bookDetailsList.title}
              className="book-details-image"
            />
            <div className="book-details-content">
              <h1 className="success-title">{bookDetailsList.title}</h1>
              <p className="success-author-name">
                {bookDetailsList.authorName}
              </p>
              <div className="average-rating-container">
                <p className="average-rating">Avg Rating</p>
                <BsFillStarFill size={15} className="star-image" />
                <p className="rating">{bookDetailsList.rating}</p>
              </div>
              <p className="status">
                Status:
                <span className="success-span">
                  {bookDetailsList.readStatus}
                </span>
              </p>
            </div>
          </div>
          <hr />
          <div className="book-details-low-container">
            <h1 className="about-author">About Author</h1>
            <p className="about-author-para">{bookDetailsList.aboutAuthor}</p>
            <h1 className="about-author">About Book</h1>
            <p className="about-author-para">{bookDetailsList.aboutBook}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  clickTheTryAgainButton = () => {
    this.getTheBookDetails()
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
            <div className="book-details-bg-container">
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
              {this.renderTheStatus()}
            </div>
          )
        }}
      </popupContext.Consumer>
    )
  }
}

export default BookDetails
