import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`
export const Content = styled.main`
  width: 100%;
  max-width: 860px;
  padding: 30px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    strong {
      font-size: 24px;
      font-weight: bold;
      color: #949494;
    }

    button:first-child {
      margin-right: 10px;
    }
  }
`

export const SubHeader = styled.form`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  input {
    flex: 1;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`

export const BooksContainer = styled.section`
  article {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 8px;
    padding: 20px;

    display: flex;

    background: #fff;
    transition: border 0.2s;
    cursor: pointer;

    &:hover {
      border: 1px solid #666;
    }

    > img {
      width: 110px;
      object-fit: cover;
    }

    .image-placeholder {
      width: 110px;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      background: #e9e8e8;
      padding: 10px;
    }

    .book-details {
      flex: 1;
      margin-left: 10px;

      font-size: 16px;
      color: #9c9c9c;

      display: flex;
      flex-direction: column;

      width: 100%;

      .book-title {
        max-height: 50%;
        font-weight: bold;
        color: #666;
        font-size: 18px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      span:nth-child(2) {
        margin-top: 10px;
      }

      > span {
        margin-top: 2px;
      }
    }
  }
`

export const Paginator = styled.ul`
  list-style-type: none;

  margin: 20px auto;

  display: flex;
  flex-direction: row;

  > li {
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    padding: 12px;
    margin-left: 3px;
    color: #9c9c9c;
    font-weight: bold;

    &.active {
      background-color: #ddd;
    }
  }
`

export const EmptyData = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    color: #666;
  }
`