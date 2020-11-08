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
      font-size: 34px;
      font-weight: bold;
      color: #3f3d56;
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
  min-height: 420px;
  color: #949494;

  img {
    float: left;
    align-self: flex-start;
    height: 360px;
    margin-right: 10px;
  }

  strong {
    margin-top: 20px;
    display: block;
    color: #3f3d56;
  }

  span {
    font-weight: bold;
  }

  #title {
    margin-top: 0px;
    font-size: 28px;
  }

  #subtitle {
    color: #949494;
    font-size: 20px;
    margin-top: 5px;
  }
`
