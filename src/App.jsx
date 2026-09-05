import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import MainPage from './pages/MainPage.jsx'
/* App.jsx : 최상위 컴포넌트
  여기에다가 작은 컴포넌트들을 끼워 넣는 것!!

  React는 SPA(Single Page Application) 방식 사용
  SPA 방식 : HTML 문서가 딱 하나(index.html)뿐이어서 페이지를 이동해도 서버에서 새 HTML을 받지 않고, JavaScript가 화면의 필요한 부분만 바꿔치기함

  react-router-dom : 리액트에서 route를 사용하기 위해 외부 라이브러리를 가지고 온 것

  <BrowserRouter> : 브라우저에서 라우팅 기능을 쓰려면 이 걸로 앱을 다 감싸야함, 이 안에서 URL 화면전환을 하겠다고 선언하는 것
  <Routes> : 경로 규칙을 담는 상자
  path="/" : / 주소일 때 
  element={<화면 />} : 이 화면으로 전환
  Navigate : /login 으로 자동 이동시켜라
  replace 
   - 있으면 / 기록을 /login이 덮어써서 뒤로가기 눌러도 안감
   - 없으면 history에 /와 /login 둘 다 쌓임 
*/
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
