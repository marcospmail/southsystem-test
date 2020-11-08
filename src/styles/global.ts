import { createGlobalStyle } from 'styled-components'

import 'react-toastify/dist/ReactToastify.css'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    -webkit-font-smoothing: antialised;
    background: #f2f2f2;
  }

  body, input, button {
    font-family: 'Roboto', serif;
    font-size: 16px;
  }

  button {
    cursor: pointer;
  }
`
