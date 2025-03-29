import styled from 'styled-components'

export const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid grey;

  button {
    padding: 10px 20px;
    font-size: 15px;
    border: none;
    cursor: pointer;
  }
`

export const FileButton = styled.button`
  color: blueviolet;
  border: 1px solid blueviolet;
  background-color: white;
`

export const MoreFileButton = styled.button`
  background-color: blueviolet;
  color: white;
  font-size: 20px;
  margin-right: 130px;
`

export const RunButton = styled.button`
  background-color: blueviolet;
  color: white;
  font-size: 20px;
`

export const Container = styled.div`
  display: flex;
  height: calc(100vh - 150px);
`

export const Editor = styled.div`
  flex: 1;
  padding: 20px;
  border-right: 1px solid grey;

  textarea {
    width: 100%;
    height: 100%;
    padding: 10px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 14px;
    border: 1px solid #ccc;
    resize: none;
    outline: none;
  }
`

export const Output = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;

  pre {
    width: 100%;
    height: 100%;
    padding: 10px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 14px;
    background-color: #fff;
    border: 1px solid #ccc;
    overflow: auto;
  }
`
