import { RAMEN_TYPES } from '../../constants/ramenTypes'

interface Props {
  selectedType: string | null
  onSelect: (type: string | null) => void
}

// 라멘 종류별 필터 버튼 UI
function RamenTypeFilter({ selectedType, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      <FilterButton
        label="전체"
        isActive={selectedType === null}
        onClick={() => onSelect(null)}
      />
      {RAMEN_TYPES.map((type) => (
        <FilterButton
          key={type}
          label={type}
          isActive={selectedType === type}
          onClick={() => onSelect(selectedType === type ? null : type)}
        />
      ))}
    </div>
  )
}

function FilterButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 'var(--radius-pill)',
        border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)',
        backgroundColor: isActive ? '#E8001C' : 'transparent',
        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
        fontSize: '13px',
        fontWeight: isActive ? 700 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s',
        letterSpacing: '0.3px',
      }}
    >
      {label}
    </button>
  )
}

export default RamenTypeFilter
