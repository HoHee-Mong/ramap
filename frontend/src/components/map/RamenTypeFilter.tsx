import useCategories from '../../hooks/useCategories'

interface Props {
  selectedCategoryId: string | null
  onSelect: (categoryId: string | null) => void
}

// 카테고리별 필터 버튼 UI (API에서 동적으로 카테고리 로드)
function RamenTypeFilter({ selectedCategoryId, onSelect }: Props) {
  const { categories } = useCategories()

  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      <FilterButton
        label="전체"
        isActive={selectedCategoryId === null}
        onClick={() => onSelect(null)}
      />
      {categories.map((category) => (
        <FilterButton
          key={category.id}
          label={category.name}
          isActive={selectedCategoryId === category.id}
          onClick={() => onSelect(selectedCategoryId === category.id ? null : category.id)}
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
