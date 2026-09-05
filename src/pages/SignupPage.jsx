import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Form, Input, Button, Card, Typography, Checkbox, Row, Col, Space, Alert, App as AntdApp } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Title, Text, Paragraph } = Typography

// shouldUpdate 가 감지해야할 칸들 설정
const CHECKABLE_FIELDS = ['name', 'loginId', 'password', 'passwordConfirm', 'agreeTerms']

function SignupPage() {
  const [form] = Form.useForm()
  const [idCheckStatus, setIdCheckStatus] = useState(null) // null | 'available' | 'duplicate'
  const [submitError, setSubmitError] = useState("")
  const navigate = useNavigate()
  const { message } = AntdApp.useApp()

  const handleSignup = (values) => {
    if (idCheckStatus !== 'available') {
      setSubmitError('아이디 중복확인을 먼저 수행해주세요.')
      return
    }
    setSubmitError("")
    console.log(values)
    axios.post('http://localhost:8080/api/members',{
      loginId:values.loginId, 
      name:values.name, 
      password:values.password
    }).then(()=>{
      message.success('회원가입이 완료되었습니다. 로그인해주세요.')
      navigate('/login')
    }).catch((error)=>{
      const msg = error.response?.data?.message || '잠시 후 다시 시도해주세요.'
      setSubmitError(msg)
    })
  }

  const handleCheckDuplicateId = () => {
    const loginId = form.getFieldValue('loginId')
    if (!loginId) {
      form.validateFields(['loginId'])
      return
    }
    axios.get('http://localhost:8080/api/members/dup', {
      params:{
        loginId:loginId
      }
    }).then((response)=>{
      if(response.data.available){
        setIdCheckStatus('available')
      }
      else{
        setIdCheckStatus('duplicate')
      }
      setSubmitError("")
    }).catch((error)=>{
      console.log(error)
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
          몇 분이면 청약 준비 완료
        </Title>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 16, marginTop: 16 }}>
          회원가입하고 증권계좌를 등록하면<br />
          공모주 청약부터 배정 결과 확인까지<br />
          IPOHub에서 한 번에 관리할 수 있어요.
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
            <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>회원가입</Title>
            <Text type="secondary">공모주 청약을 시작하려면 계정을 만드세요</Text>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSignup}>
            <Form.Item
              label="이름"
              name="name"
              rules={[{ required: true, message: '이름을 입력해주세요.' }]}
            >
              <Input placeholder="이름" />
            </Form.Item>

            <Form.Item label="아이디" required>
              <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              name="loginId"
                  noStyle
              rules={[{ required: true, message: '아이디를 입력해주세요.' }]}
            >
                  <Input
                    placeholder="아이디"
                    onChange={() => setIdCheckStatus(null)}
                  />
                </Form.Item>
                <Button onClick={handleCheckDuplicateId}>중복확인</Button>
              </Space.Compact>
              {idCheckStatus === 'available' && (
                <Text type="success">사용 가능한 아이디입니다.</Text>
              )}
              {idCheckStatus === 'duplicate' && (
                <Text type="danger">이미 사용 중인 아이디입니다.</Text>
              )}
            </Form.Item>

            {/* rules : 입력값 검증 룰
              required: ture: 입력값 옆에 빨간색 별표 붙게 하는 것
            */}
            <Form.Item
              label="비밀번호"
              name="password"
              rules={[
                { required: true, message: '비밀번호는 필수입니다.' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
                  message: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각 1개 이상 포함한 8~20자여야 합니다',
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="비밀번호 (8~20자, 대/소문자·숫자·특수문자 포함)" />
            </Form.Item>
            
            {/* 
              dependencies : password필드 입력값에 의존한다
              rules를 함수형으로 쓴 이유? 다른 필드의 값('password') 의 값을 알아야하기 때문에
              hasFeedback : 검증 상태를 아이콘으로 시각적으로 표시해주는 기능
              Promise : "검증 결과를 담아 antd에게 돌려주는 봉투"
                validator는 반드시 통과/탈락 도장으로만 반환값을 줘야함 Promise 그것이 약속이야!!
                 - Promise.resolve() = "통과" 
                 - Promise.reject(new Error('메시지')) = "탈락"
            */}
            <Form.Item
              label="비밀번호 확인"
              name="passwordConfirm"
              dependencies={['password']}
              hasFeedback 
              rules={[
                { required: true, message: '비밀번호를 한 번 더 입력해주세요.' },
                ({ getFieldValue }) => ({
                  validator(_, value) { // _ 는 룰 객체가 들어가는 부분인데 지금은 안써서 대체문자로 _를 쓴것
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'))
                  },
                }),
              ]}
            >
              <Input.Password placeholder="비밀번호 확인" />
            </Form.Item>

            <Form.Item
              name="agreeTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, checked) =>
                    checked
                      ? Promise.resolve()
                      : Promise.reject(new Error('약관에 동의해주세요.')),
                },
              ]}
            >
              <Checkbox>이용약관 및 개인정보 처리방침에 동의합니다.</Checkbox>
            </Form.Item>
            {/* shouldUpdate가 붙은 Form.Item은 다른 칸들을 계속 지켜보는 감시카메라
              다른 item의 값이 바뀔 때마다 ()={} 이 함수 내부가 계속 돌면서 변경될 값을 변경해줌
              form.getFieldsError() :: 모든 에러필드의 값을 가져옴
              isFieldsTouched(필드목록, true) — 지정한 필드들을 사용자가 건드렸는지 확인, 다 건드렸을 때만 true
            */}
            <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
              {() => {
                const hasErrors = form
                  .getFieldsError()
                  .some(({ errors }) => errors.length > 0)
                const isTouched = form.isFieldsTouched(CHECKABLE_FIELDS, true)
                return (
                  <>
                    {submitError && (
                      <Alert
                        type="error"
                        message={submitError}
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                    )}
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        disabled={!isTouched || hasErrors}
                      >
                        가입하기
                      </Button>
                    </Form.Item>
                  </>
                )
              }}
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">이미 계정이 있으신가요? </Text>
            <Link to="/login">로그인</Link>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default SignupPage
