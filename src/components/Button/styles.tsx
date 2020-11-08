import styled from 'styled-components'
import { darken } from 'polished'

export const Button = styled.button`
  border-radius: 4px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  font-weight: bold;
  color: #fff;
  font-size: 20px;
  transition: background 0.2s;

  background: #ddd;

  &:hover {
    background: ${darken(0.1, '#ddd')};
  }

  &.primary {
    background: #4167df;

    &:hover {
      background: ${darken(0.1, '#4167df')};
    }
  }
`
