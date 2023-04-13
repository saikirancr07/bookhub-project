import React from 'react'

const popupContext = React.createContext({
  showPopup: false,
  changeThePopupValue: () => {},
})

export default popupContext
