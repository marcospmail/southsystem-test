import styled from 'styled-components'

export const Container = styled.div`
  background: #3f3d56;
  width: 100%;
  height: 60px;
  padding: 35px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  > a {
    text-decoration: none;

    > strong {
      color: #fff;
      font-weight: bold;
      font-size: 30px;
    }
  }

  @media (max-width: 400px) {
    & {
      padding: 30px 14px;

      > a {
        > strong {
          font-size: 24px;
        }
      }
    }
  }
`
