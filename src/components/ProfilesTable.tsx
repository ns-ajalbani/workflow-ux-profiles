import type { Profile, SortField } from './Profiles'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

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
}: ProfilesTableProps) {
  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return ''
    return sortDirection === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <>
      <div className="profiles-table-wrapper">
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
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="loading-row">
                <td colSpan={5}>Loading...</td>
              </tr>
            ) : paginatedProfiles.length > 0 ? (
              paginatedProfiles.map(profile => (
                <tr key={profile.id}>
                  <td>{profile.name}</td>
                  <td>{profile.type}</td>
                  <td>{profile.subtype}</td>
                  <td>
                    <span className={`category-badge ${profile.category.toLowerCase()}`}>
                      {profile.category}
                    </span>
                  </td>
                  <td>{profile.created}</td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan={5}>No profiles found</td>
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
