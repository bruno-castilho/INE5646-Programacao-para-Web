import styled from 'styled-components'

export const PageContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid grey;
  background-color: #f0f0f0;
  height: 50px;

  button {
    padding: 10px 20px;
    font-size: 15px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s;
  }

  button:hover {
    opacity: 0.8;
    transform: scale(1.05);
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
  flex: 1;
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
    border-radius: 4px;
    resize: none;
    outline: none;
    background-color: #fff;
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
    border-radius: 4px;
    overflow: auto;
  }
`
