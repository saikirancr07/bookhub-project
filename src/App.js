import {Component} from 'react'

import {Switch, Route, Redirect} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import Bookshelves from './components/Bookshelves'
import BookDetails from './components/BookDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import popupContext from './context/popupContext'

import './App.css'

// use the below bookshelvesList for rendering read status of book items in Bookshelves Route

class App extends Component {
  state = {showPopup: false}

  changeThePopupValue = () => {
    this.setState(prevState => ({showPopup: !prevState.showPopup}))
  }

  render() {
    const {showPopup} = this.state
    console.log(showPopup)
    return (
      <popupContext.Provider
        value={{
          showPopup,
          changeThePopupValue: this.changeThePopupValue,
        }}
      >
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute path="/shelf" component={Bookshelves} />
          <ProtectedRoute path="/books/:id" component={BookDetails} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </popupContext.Provider>
    )
  }
}

export default App
