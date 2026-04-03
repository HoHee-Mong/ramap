import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createShop } from '../api/shopApi'
import { RAMEN_TYPES } from '../constants/ramenTypes'
import { useAuthContext } from '../context/AuthContext'

// 가게 등록 페이지
function RegisterShopPage() {
  const navigate = useNavigate()
  const { token } = useAuthContext()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [selectedRamenTypes, setSelectedRamenTypes] = useState<string[]>([])
  const [phone, setPhone] = useState('')
  const [businessHours, setBusinessHours] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Daum Postcode 스크립트 동적 로드
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [])

  // 주소 검색 팝업 열기 → 선택 시 주소 저장 후 Kakao Geocoder로 좌표 변환
  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        const selectedAddress = data.roadAddress || data.jibunAddress
        setAddress(selectedAddress)
        // Daum Postcode는 좌표를 빈 문자열로 반환할 수 있어 Geocoder로 별도 변환
        const geocoder = new window.kakao.maps.services.Geocoder()
        geocoder.addressSearch(selectedAddress, (result: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            setLat(parseFloat(result[0].y))
            setLng(parseFloat(result[0].x))
          }
        })
      },
    }).open()
  }

  // 라멘 종류 체크박스 토글
  const toggleRamenType = (type: string) => {
    setSelectedRamenTypes((previous) =>
      previous.includes(type)
        ? previous.filter((t) => t !== type)
        : [...previous, type]
    )
  }

  // 폼 제출
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!lat || !lng) {
      setError('주소 검색으로 위치를 설정해주세요.')
      return
    }
    if (selectedRamenTypes.length === 0) {
      setError('라멘 종류를 하나 이상 선택해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      await createShop({
        name,
        address,
        location: { lat, lng },
        ramenTypes: selectedRamenTypes,
        phone,
        businessHours,
      }, token!)
      navigate('/')
    } catch {
      setError('가게 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={pageStyle}>
      <h1 style={pageTitleStyle}>가게 등록</h1>

      <form onSubmit={handleSubmit} style={formStyle}>
        <Field label="가게 이름 *">
          <input value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="가게 이름을 입력하세요" />
        </Field>

        <Field label="주소 *">
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={address}
              readOnly
              placeholder="주소 검색을 눌러주세요"
              style={{ ...inputStyle, flex: 1, backgroundColor: '#F5F5F5', cursor: 'default' }}
            />
            <button type="button" onClick={openAddressSearch} style={searchButtonStyle}>
              주소 검색
            </button>
          </div>
        </Field>

        <Field label="라멘 종류 *">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
            {RAMEN_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleRamenType(type)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: selectedRamenTypes.includes(type) ? 'none' : '1.5px solid #E0E0E0',
                  backgroundColor: selectedRamenTypes.includes(type) ? '#E8001C' : '#FFFFFF',
                  color: selectedRamenTypes.includes(type) ? '#FFFFFF' : '#666666',
                  fontSize: '13px',
                  fontWeight: selectedRamenTypes.includes(type) ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </Field>

        <Field label="전화번호">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="02-000-0000" />
        </Field>

        <Field label="영업시간">
          <input value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} style={inputStyle} placeholder="예: 11:00 - 21:00" />
        </Field>

        {error && <p style={{ color: '#E8001C', fontSize: '13px' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button type="button" onClick={() => navigate('/')} style={cancelButtonStyle}>
            취소
          </button>
          <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', letterSpacing: '0.2px' }}>{label}</label>
      <div>{children}</div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '80px 16px 40px',
}

const pageTitleStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#1A1A1A',
  marginBottom: '28px',
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  backgroundColor: '#FFFFFF',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #E0E0E0',
  borderRadius: 'var(--radius-md)',
  fontSize: '14px',
  color: '#1A1A1A',
  backgroundColor: '#FFFFFF',
}

const searchButtonStyle: React.CSSProperties = {
  padding: '11px 16px',
  backgroundColor: '#1A1A1A',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const submitButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '13px',
  backgroundColor: '#E8001C',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  letterSpacing: '0.3px',
}

const cancelButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '13px',
  backgroundColor: '#F5F5F5',
  color: '#666666',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
}

export default RegisterShopPage
