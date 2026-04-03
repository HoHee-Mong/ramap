interface Props {
  value: number
  onChange?: (rating: number) => void
}

// 별점 표시 및 선택 컴포넌트 (onChange 없으면 읽기 전용)
function StarRating({ value, onChange }: Props) {
  const isReadOnly = !onChange

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange?.(star)}
          style={{
            fontSize: isReadOnly ? '14px' : '26px',
            cursor: isReadOnly ? 'default' : 'pointer',
            color: star <= value ? '#E8001C' : '#E0E0E0',
            lineHeight: 1,
            transition: 'color 0.1s',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default StarRating
