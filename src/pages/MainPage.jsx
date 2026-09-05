import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Layout, Menu, Button, Card, Table, Tag, Alert } from 'antd'
import axios from 'axios'

const { Header, Content } = Layout

const menuItems = [
  { key: '/main', label: <Link to="/main">홈</Link> },
  { key: '/main/ipo-list', label: <Link to="/main/ipo-list">청약목록</Link> },
  { key: '/main/subscriptions', label: <Link to="/main/subscriptions">청약내역</Link> },
  { key: '/main/mypage', label: <Link to="/main/mypage">마이페이지</Link> },
]

function formatDateTime(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })
}

function formatNumber(value) {
  if (value === null || value === undefined) return '-'
  return Number(value).toLocaleString('ko-KR')
}

const SUBSCRIPTION_STATUS_COLOR = {
  PENDING: 'gold',
  APPROVED: 'green',
  REJECTED: 'red',
  CANCELLED: 'default',
}

function MainPage() {
  const navigate = useNavigate()

  const [ipoStocks, setIpoStocks] = useState([])
  const [ipoLoading, setIpoLoading] = useState(true)
  const [ipoError, setIpoError] = useState("")

  const [subscriptions, setSubscriptions] = useState([])
  const [subLoading, setSubLoading] = useState(true)
  const [subError, setSubError] = useState("")

  useEffect(() => {
    axios.get("http://localhost:8080/api/ipo-stocks")
      .then((response) => {
        setIpoStocks(response.data)
      }).catch((error) => {
        setIpoError(error.response?.data?.message || "청약 목록을 불러오지 못했습니다.")
      }).finally(() => {
        setIpoLoading(false)
      })
  }, [])

  useEffect(() => {
    axios.get("http://localhost:8080/api/subscriptions", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then((response) => {
      setSubscriptions(response.data)
    }).catch((error) => {
      setSubError(error.response?.data?.message || "청약 내역을 불러오지 못했습니다.")
    }).finally(() => {
      setSubLoading(false)
    })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const ipoColumns = [
    { title: '종목명', dataIndex: 'name', key: 'name', width: '18%' },
    {
      title: '공모가',
      dataIndex: 'offerPrice',
      key: 'offerPrice',
      width: '13%',
      render: (value) => `${formatNumber(value)}원`,
    },
    {
      title: '청약수량(최소~최대)',
      key: 'qtyRange',
      width: '16%',
      render: (_, record) => `${formatNumber(record.minQty)} ~ ${formatNumber(record.maxQty)}`,
    },
    {
      title: '경쟁률',
      dataIndex: 'competitionRate',
      key: 'competitionRate',
      width: '13%',
      render: (value) => {
        if (value === null || value === undefined) return '-'
        if (value === 0) return '-'
        if (value < 1) return `${value.toFixed(2)} : 1 (미달)`
        return `${value.toFixed(2)} : 1`
      },
    },
    {
      title: '증거금률',
      dataIndex: 'depositRate',
      key: 'depositRate',
      width: '10%',
      render: (value) => `${value}%`,
    },
    {
      title: '청약기간',
      key: 'period',
      width: '20%',
      render: (_, record) => `${formatDateTime(record.startDate)} ~ ${formatDateTime(record.endDate)}`,
    },
    {
      title: '상태',
      dataIndex: 'isClosed',
      key: 'isClosed',
      width: '10%',
      render: (isClosed) => (
        isClosed ? <Tag>마감</Tag> : <Tag color="green">청약중</Tag>
      ),
    },
  ]

  const subscriptionColumns = [
    { title: '종목명', dataIndex: 'ipoStockName', key: 'ipoStockName', width: '30%' },
    {
      title: '공모가',
      dataIndex: 'offerPrice',
      key: 'offerPrice',
      width: '25%',
      render: (value) => `${formatNumber(value)}원`,
    },
    {
      title: '청약수량',
      dataIndex: 'qty',
      key: 'qty',
      width: '20%',
      render: (value) => formatNumber(value),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: '25%',
      render: (status) => (
        <Tag color={SUBSCRIPTION_STATUS_COLOR[status] || 'default'}>{status}</Tag>
      ),
    },
  ]

  const sectionCardStyle = {
    width: '100%',
    marginBottom: 32,
    borderRadius: 8,
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#0B1B3A',
          padding: '0 40px',
        }}
      >
        <Link
          to="/main"
          style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginRight: 40 }}
        >
          <span style={{ color: '#00C896' }}>IPO</span>Hub
        </Link>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={['/main']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0, background: 'transparent', borderBottom: 'none' }}
        />

        <Button onClick={handleLogout}>로그아웃</Button>
      </Header>

      <Content style={{ padding: '32px 40px', background: '#F4F6FA', width: '100%', boxSizing: 'border-box' }}>
        <Card title="청약 목록" style={sectionCardStyle}>
          {ipoError && <Alert type="error" message={ipoError} showIcon style={{ marginBottom: 16 }} />}
          <Table
            rowKey="id"
            columns={ipoColumns}
            dataSource={ipoStocks}
            loading={ipoLoading}
            pagination={false}
            tableLayout="fixed"
          />
        </Card>

        <Card title="내 청약 내역" style={sectionCardStyle}>
          {subError && <Alert type="error" message={subError} showIcon style={{ marginBottom: 16 }} />}
          <Table
            rowKey="id"
            columns={subscriptionColumns}
            dataSource={subscriptions}
            loading={subLoading}
            pagination={false}
            tableLayout="fixed"
          />
        </Card>
      </Content>
    </Layout>
  )
}

export default MainPage
