import { StrictMode } from 'react' // 화면을 어떻게 그릴지 계산하는 담당
import { createRoot } from 'react-dom/client' // 계산 결과를 실제 브라우저 DOM에 붙이는 담당
import { ConfigProvider } from 'antd' // antd 컴포넌트 전체에 테마(색상 등)를 내려주는 provider
import './index.css'
import App from './App.jsx' // 최상위 컴포넌트
/* main.jsx : 리액트 앱 전체를 실제 웹페이지(html)에 연결하는 단 하나의 지점! */
/* createRoot : react앱을 실제 html에 붙이는 함수
 createRoot(document.getElementById('root')) : index.html 파일의 id가 root 인 것을 찾아서 그 자리를 react가 관리할 루트로 지정
 .render : 그 루트안에 App 를 그려 넣음
  StrictMode : 개발 중에 작동하는 안전검사기, 화면에 아무것도 그리지는 않고 코드에 잠재적 문제가 있을 시 콘솔에 경고를 띄워주는 역할을 함

  ConfigProvider : 앱 전체의 UI 설정을 한 곳에서 통일하는 컴포넌트, 이 선언된 곳 안의 모든 컴포넌트가 같은 테마/언어/전역 기본값 등의 공통설정을 물려받음
  (antd 컴포넌트들)
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00C896',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
