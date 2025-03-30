import styled from 'styled-components'

export const Main = styled.main`
  display: flex;
  height: calc(100vh - 80px);
`

export const SideBar = styled.aside`
  width: 250px;
  padding: 20px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow-y: auto;

  h3 {
    margin-bottom: 20px;
    color: blueviolet;
  }

  section {
    margin-bottom: 20px;
  }

  h4 {
    margin-bottom: 10px;
    font-size: 1rem;
  }

  a {
    color: blueviolet;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  ul {
    padding-left: 20px;
  }
`

export const Footer = styled.footer`
  padding: 20px;
  background-color: #333;
  color: white;
  text-align: center;

  address {
    font-style: normal;
  }

  a {
    color: #aaa;
    text-decoration: none;
  }

  footer a:hover {
    color: white;
  }
`
