import { useState, useEffect, useRef } from 'react'
import type { Profile, SortField } from '../Profiles'
import { TYPE_ICONS, TYPE_COLORS, SUBTYPE_ICONS } from '../typeConfig'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

const formatDate = (dateString: string): string => {
  try {
    const [datePart, timePart] = dateString.split('T')
    const [year, month, day] = datePart.split('-')
    const timeWithoutSeconds = timePart.split(':').slice(0, 2).join(':')
    const shortYear = year.slice(-2)
    return `${month}/${day}/${shortYear} ${timeWithoutSeconds}`
  } catch {
    return dateString
  }
}

interface ProfilesTableProps {
  paginatedProfiles: Profile[]
  filteredCount: number
  startIndex: number
  endIndex: number
  currentPage: number
  totalPages: number
  pageSize: number
  sortField: SortField
  sortDirection: 'asc' | 'desc'
  isLoading?: boolean
  onSort: (field: SortField) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onEditProfile?: (profile: Profile) => void
  onDeleteProfile?: (profileId: string) => void
}

export default function ProfilesTable({
  paginatedProfiles,
  filteredCount,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  pageSize,
  sortField,
  sortDirection,
  isLoading = false,
  onSort,
  onPageChange,
  onPageSizeChange,
  onEditProfile,
  onDeleteProfile,
}: ProfilesTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [openMenuId])

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return ''
    return sortDirection === 'asc' ? ' ↑' : ' ↓'
  }

  const handleMenuToggle = (profileId: string) => {
    setOpenMenuId(openMenuId === profileId ? null : profileId)
  }

  const handleEdit = (profile: Profile) => {
    onEditProfile?.(profile)
    setOpenMenuId(null)
  }

  const handleDelete = (profileId: string) => {
    onDeleteProfile?.(profileId)
    setOpenMenuId(null)
  }

  return (
    <>
      <div className="profiles-table-wrapper" ref={tableRef}>
        <table className="profiles-table">
          <thead>
            <tr>
              <th onClick={() => onSort('name')} className="sortable">
                Profile Name{getSortIndicator('name')}
              </th>
              <th onClick={() => onSort('type')} className="sortable">
                Type{getSortIndicator('type')}
              </th>
              <th onClick={() => onSort('subtype')} className="sortable">
                Subtype{getSortIndicator('subtype')}
              </th>
              <th onClick={() => onSort('category')} className="sortable">
                Category{getSortIndicator('category')}
              </th>
              <th onClick={() => onSort('created')} className="sortable">
                Created{getSortIndicator('created')}
              </th>
              <th onClick={() => onSort('createdBy')} className="sortable">
                Created By{getSortIndicator('createdBy')}
              </th>
              <th className="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="loading-row">
                <td colSpan={7}>Loading...</td>
              </tr>
            ) : paginatedProfiles.length > 0 ? (
              paginatedProfiles.map(profile => (
                <tr key={profile.id}>
                  <td>{profile.name}</td>
                  <td>
                    <span
                      className="type-pill"
                      style={{
                        color: TYPE_COLORS[profile.type]?.color || '#555',
                        backgroundColor: TYPE_COLORS[profile.type]?.bg || '#f0f0f0',
                      }}
                    >
                      <span className="type-pill-icon">{TYPE_ICONS[profile.type]}</span>
                      {profile.type}
                    </span>
                  </td>
                  <td>
                    {profile.subtype !== 'N/A' ? (
                      <span className="subtype-cell">
                        {SUBTYPE_ICONS[profile.subtype] && (
                          <span
                            className="subtype-cell-icon"
                            style={{ color: TYPE_COLORS[profile.type]?.color || '#555' }}
                          >
                            {SUBTYPE_ICONS[profile.subtype]}
                          </span>
                        )}
                        {profile.subtype}
                      </span>
                    ) : (
                      <span className="subtype-na">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`category-badge ${profile.category.toLowerCase()}`}>
                      {profile.category}
                    </span>
                  </td>
                  <td>{formatDate(profile.created)}</td>
                  <td>{profile.createdBy}</td>
                  <td className="action-cell">
                    <div className="action-menu-wrapper">
                      <button
                        className="action-menu-btn"
                        onClick={() => handleMenuToggle(profile.id)}
                        title={profile.name}
                      >
                        ⋯
                      </button>
                      {openMenuId === profile.id && (
                        <div className="action-dropdown">
                          <button
                            className="action-dropdown-item edit"
                            onClick={() => handleEdit(profile)}
                          >
                            ✎ Edit
                          </button>
                          <button
                            className="action-dropdown-item delete"
                            onClick={() => handleDelete(profile.id)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan={7}>No profiles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="profiles-footer">
        <div className="footer-info">
          <p>
            Showing {paginatedProfiles.length > 0 ? startIndex + 1 : 0}-
            {Math.min(endIndex, filteredCount)} of {filteredCount} profiles
          </p>
        </div>

        <div className="footer-controls">
          <div className="page-size-selector">
            <label htmlFor="page-size">Rows per page:</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className="page-size-select"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
