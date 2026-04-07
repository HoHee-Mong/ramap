import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createShop } from '../api/shopApi'
import useCategories from '../hooks/useCategories'
import { useAuthContext } from '../context/AuthContext'
import { ChevronLeftIcon } from '../components/common/Icons'

// 가게 등록 페이지 (로그인 필요)
function RegisterShopPage() {
  const navigate = useNavigate()
  const { token } = useAuthContext()
  const { categories } = useCategories()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
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

  // 카테고리 선택 토글 (중복 선택 가능)
  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds(previous =>
      previous.includes(categoryId)
        ? previous.filter(id => id !== categoryId)
        : [...previous, categoryId]
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
    if (selectedCategoryIds.length === 0) {
      setError('카테고리를 하나 이상 선택해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      await createShop({
        name,
        address,
        location: { lat, lng },
        categoryIds: selectedCategoryIds,
        phone,
        businessHours,
      }, token!)
      alert('제보가 접수됐습니다! 관리자 검토 후 지도에 표시됩니다.')
      navigate('/')
    } catch {
      setError('가게 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={pageStyle}>
      {/* 헤더 */}
      <div style={headerStyle}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          <ChevronLeftIcon size={24} color="#1A1A1A" />
        </button>
        <h1 style={pageTitleStyle}>새로운 라멘집 제보 🍜</h1>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <Field label="가게 이름 *">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={inputStyle}
            placeholder="예: 오레노라멘 본점"
          />
        </Field>

        <Field label="주소 *">
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={address}
              readOnly
              placeholder="주소 검색을 눌러주세요"
              style={{ ...inputStyle, flex: 1, backgroundColor: '#F0F0F0', cursor: 'default' }}
            />
            <button type="button" onClick={openAddressSearch} style={searchButtonStyle}>
              검색
            </button>
          </div>
        </Field>

        <Field label="카테고리 *">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
            {categories.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                style={catButtonStyle(selectedCategoryIds.includes(category.id))}
              >
                {category.name}
              </button>
            ))}
          </div>
        </Field>

        <Field label="전화번호">
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={inputStyle}
            placeholder="02-000-0000"
          />
        </Field>

        <Field label="영업시간">
          <input
            value={businessHours}
            onChange={e => setBusinessHours(e.target.value)}
            style={inputStyle}
            placeholder="예: 11:00 - 21:00"
          />
        </Field>

        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button type="button" onClick={() => navigate(-1)} style={cancelButtonStyle}>
            취소
          </button>
          <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
            {isSubmitting ? '등록 중...' : '관리자에게 제보하기'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>{label}</label>
      <div>{children}</div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflowY: 'auto',
  backgroundColor: '#F2EFE9',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '48px 16px 16px',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #F0F0F0',
}

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
}

const pageTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 800,
  color: '#1A1A1A',
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  margin: '16px',
  padding: '24px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid #E0E0E0',
  borderRadius: '12px',
  fontSize: '14px',
  color: '#1A1A1A',
  backgroundColor: '#FFFFFF',
}

const searchButtonStyle: React.CSSProperties = {
  padding: '12px 16px',
  backgroundColor: '#1A1A1A',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

function catButtonStyle(isSelected: boolean): React.CSSProperties {
  return {
    padding: '8px 16px',
    borderRadius: '100px',
    border: isSelected ? 'none' : '1.5px solid #E0E0E0',
    backgroundColor: isSelected ? '#2BA8A0' : '#FFFFFF',
    color: isSelected ? '#FFFFFF' : '#666666',
    fontSize: '13px',
    fontWeight: isSelected ? 700 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
  }
}

const errorStyle: React.CSSProperties = {
  color: '#DC2626',
  fontSize: '13px',
}

const submitButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '14px',
  backgroundColor: '#2BA8A0',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(43,168,160,0.3)',
}

const cancelButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '14px',
  backgroundColor: '#F0F0F0',
  color: '#666666',
  border: 'none',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
}

export default RegisterShopPage
