import { useState } from 'react' // 컴포넌트가 값을 기억하게 해주는 도구
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, Alert, Row, Col } from 'antd'
import axios from 'axios'

/* antd의 Typography 컴포넌트에 속하는 하위 컴포넌트들 구조분해 
   <Title level={1} : h1 태그 크기 제목
   <Text : 일반제목

   const navigate = useNavigate() : 특정 로직을 끝내고 화면을 이동시키고 싶을 때 사용 - 코드 흐름 안에서 페이지를 이동해야할 때

*/
const { Title, Text, Paragraph } = Typography

function LoginPage() {
  const navigate = useNavigate()
  // useState로 만든 값은 리렌더링돼도 유지되고, 값이 바뀌면 React가 화면을 자동으로 다시 그려줌
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = ({ loginId, password }) => {
    setLoading(true)
    setErrorMessage("")
    axios.post("http://localhost:8080/api/auth/login",
      {
        loginId,
        password
      }
    ).then((response)=>{
      localStorage.setItem("token", response.data.accessToken)
      navigate("/main")
    }).catch((error)=>{
      setErrorMessage(error.response?.data?.message || "로그인에 실패했습니다. 다시 시도해주세요.")
    }).finally(()=>{
      setLoading(false)
    })
  }

  return (
    <Row style={{ minHeight: '100vh' }}>
      <Col
        xs={0}
        md={13}
        style={{
          background: '#0B1B3A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 72px',
        }}
      >
        <Title level={1} style={{ color: '#fff', marginBottom: 16 }}>
          <span style={{ color: '#00C896' }}>IPO</span>Hub
        </Title>
        <Title level={2} style={{ color: '#fff', marginTop: 0, fontWeight: 400 }}>
          공모주 청약을 한 곳에서
        </Title>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 16, marginTop: 16 }}>
          공모주 일정 확인부터 청약, 배정 결과 조회까지<br />
          IPOHub 하나로 간편하게 관리하세요.<br />
          지금 바로 로그인하고 다음 공모주 기회를 놓치지 마세요.
        </Paragraph>
      </Col>

      <Col
        xs={24}
        md={11}
        style={{
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <Card variant={false} style={{ width: 360, boxShadow: 'none' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 4 }}>
              <span style={{ color: '#00C896' }}>IPO</span>Hub
            </Title>
            <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>로그인</Title>
            <Text type="secondary">공모주 청약을 시작하려면 로그인하세요</Text>
          </div>

          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item
              label="아이디"
              name="loginId"
              rules={[{ required: true, message: '아이디를 입력해주세요.' }]}
            >
              <Input placeholder="아이디" />
            </Form.Item>

            <Form.Item
              label="비밀번호"
              name="password"
              rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
            >
              <Input.Password placeholder="비밀번호" />
            </Form.Item>

            {errorMessage && (
              <Form.Item>
                <Alert type="error" message={errorMessage} showIcon />
              </Form.Item>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                로그인
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">아직 회원이 아니신가요? </Text>
            <Link to="/signup">회원가입</Link>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginPage
