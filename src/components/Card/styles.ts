import styled from 'styled-components'

export const Container = styled.div`
  background: #fff;
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    flex: 1;
    font-size: 40px;
    color: #3f3d56;
    font-weight: bold;
    padding: 20px;
  }

  > img {
    flex: 1;
    width: 300px;
  }

  @media (max-width: 640px) {
    flex-direction: column;

    > span {
      width: auto;
      padding: 0;
      padding-bottom: 40px;
      font-size: 36px;
    }

    > img {
      width: 220px;
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
