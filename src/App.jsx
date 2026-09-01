import { useState } from 'react'
import axios from 'axios'

function App() {
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    axios.post("http://localhost:8080/api/auth/login",
      {
        loginId,
        password
      }
    ).then((response)=>{
      localStorage.setItem("token", response.data.accessToken)
    }).catch((error)=>{
      console.log(error)
    })
  }
  return (
    <div>
      <h1>Login</h1>
      
      {/*
        e = 이벤트 객체 (무슨 일이 일어났는지 정보)
        e.target.value = 사용자가 입력창에 친 글자들
      */}

      <input type='text' value={loginId} onChange={(e)=>setLoginId(e.target.value)}></input>
      <br />
      <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
      <br />
      <button type='button' onClick={handleLogin}>로그인</button>
    </div>
  )
}

export default App
