import styled from 'styled-components'

export const Header = styled.header`
  border-bottom: 1px solid grey;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f8f8;
  height: 80px;

  img {
    height: 60px;
    margin-right: 20px;
  }

  h1 {
    font-size: 1.5rem;
    color: #333;
    flex-grow: 1;
  }

  nav ul {
    display: flex;
    list-style: none;
  }

  nav ul li {
    margin-left: 20px;
  }

  nav ul li a {
    text-decoration: none;
    color: blueviolet;
    font-weight: bold;
  }

  nav ul li a:hover {
    text-decoration: underline;
  }
`
