import { useState } from 'react'
import type { MatchRule } from '../../MatchLogic'
import MatchLogic from '../../MatchLogic'

interface CustomCategoriesFormProps {
  onNavigateToProfile: (type: string) => void
  onSubmit: () => void
}

export default function CustomCategoriesForm({
  onNavigateToProfile,
  onSubmit,
}: CustomCategoriesFormProps) {
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [, setMatchRules] = useState<MatchRule[]>([])

  const handleSubmit = () => {
    if (categoryName.trim()) {
      console.log('Creating custom category:', { categoryName, categoryDescription })
      alert(`Custom Category created!\nName: ${categoryName}`)
      onSubmit()
    }
  }

  return (
    <div className="form-section">
      <div className="form-group">
        <label htmlFor="category-name">Custom Category Name</label>
        <input
          id="category-name"
          type="text"
          placeholder="Enter custom category name"
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category-desc">Description (Optional)</label>
        <textarea
          id="category-desc"
          placeholder="Enter description"
          value={categoryDescription}
          onChange={e => setCategoryDescription(e.target.value)}
          className="form-textarea"
          rows={3}
        />
      </div>

      <div className="form-group">
        <MatchLogic onRulesChange={setMatchRules} onNavigateToProfile={onNavigateToProfile} />
      </div>

      <button className="create-btn" onClick={handleSubmit} disabled={!categoryName.trim()}>
        Save
      </button>
    </div>
  )
}
