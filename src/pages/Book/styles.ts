import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

export const Content = styled.div`
  width: 100%;
  max-width: 980px;
  height: 100vh;
  margin: 0 auto;
  padding: 30px;

  header {
    display: flex;
    align-items: center;

    strong {
      font-size: 24px;
      font-weight: bold;
      color: #949494;
      margin-left: 30px;
    }

    button:first-child {
      margin-right: 10px;
    }
  }

  @media (max-width: 480px) {
    header {
      flex-direction: column;

      * {
        width: 100%;
        margin-top: 5px;
      }
    }
  }
`

export const BackButton = styled.button`
  padding: 10px;
  background: transparent;
  border: 0;
`

export const Details = styled.main`
  font-size: 18px;
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  margin-top: 20px;
  line-height: 26px;

  img {
    float: left;
    align-self: flex-start;
    height: 360px;
    margin-right: 10px;
  }

  #detailsText {
    min-height: 360px;

    strong {
      margin-top: 20px;
      display: block;
    }

    span {
      font-weight: bold;
      color: #949494;
    }

    #title {
      margin-top: 0px;
      font-size: 28px;
    }

    #subtitle {
      font-size: 20px;
      margin-top: 5px;
      color: #949494;
    }
  }
`
