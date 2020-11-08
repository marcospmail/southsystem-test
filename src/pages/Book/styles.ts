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

export const Loading = styled.span`
  background: #fff;
  margin-top: 20px;
  padding: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  color: #3f3d56;
  min-height: 420px;
`

export const EmptyData = styled.div`
  background: #fff;
  margin-top: 20px;
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: 300px;
  }

  > span {
    width: 270px;
    margin: 0 0 100px 30px;
    color: #3f3d56;
    font-size: 40px;
    font-weight: bold;
  }
`
