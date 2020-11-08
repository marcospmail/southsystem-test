import styled from 'styled-components'

export const Container = styled.div`
  background: #fff;
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: 300px;
  }

  > span {
    color: #3f3d56;
    font-size: 40px;
    font-weight: bold;
    padding: 20px;
  }

  @media (max-width: 640px) {
    flex-direction: column;

    > span {
      padding: 0;
      padding-bottom: 40px;
      font-size: 36px;
    }

    > img {
      width: 180px;
    }
  }

  @media (max-width: 480px) {
    padding: 30px;
    font-size: 26px;

    > span {
      font-size: 26px;
    }

    > img {
      width: 150px;
    }
  }
`
