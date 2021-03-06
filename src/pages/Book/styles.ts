import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const Content = styled.div`
  width: 100%;
  max-width: 980px;
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

  @media (max-width: 400px) {
    & {
      padding: 14px;

      > header {
        > strong {
          font-size: 24px;
        }
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
  line-height: 26px;
  min-height: 420px;
  color: #949494;

  > img {
    float: left;
    align-self: flex-start;
    width: 260px;
    max-height: 360px;
    object-fit: cover;
    margin-right: 10px;

    &.fallback {
      height: 360px;
    }
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

  @media (max-width: 640px) {
    & {
      display: flex;
      flex-direction: column;

      #title {
        margin-top: 20px;
      }
    }
  }

  @media (max-width: 400px) {
    & {
      > img {
        width: 100%;
      }
    }
  }
`
