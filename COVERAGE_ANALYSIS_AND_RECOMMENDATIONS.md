# Test Coverage Analysis & Improvement Recommendations

## Executive Summary

The current test coverage shows significant gaps in critical areas. Four files have **<30% statement coverage**, while several others remain between 26-50%. This analysis provides specific, actionable recommendations to improve coverage with prioritized quick-win opportunities.

**Current Coverage Metrics:**
- **mockApi.ts**: 23.68% (9/38 statements)
- **MatchLogic.tsx**: 27.47% (25/91 statements)
- **DestinationForm.tsx**: 26.79% (15/56 statements)
- **UrlListsForm.tsx**: 26.09% (6/23 statements)
- **CustomCategoriesForm.tsx**: 45.45% (5/11 statements)
- **FingerprintRulesForm.tsx**: 50% (5/10 statements)
- **MalwareDetectionForm.tsx**: 37.93% (11/29 statements)

---

## 1. mockApi.ts (23.68% Statement Coverage) - HIGHEST PRIORITY

### Current State
- Only 9 of 38 statements covered
- Only 1 of 3 functions tested (33.33% function coverage)
- Only 4 of 14 branches covered (28.57%)

### What's Not Tested
```typescript
// Line 27-44: fetchProfile() function - COMPLETELY UNTESTED
export async function fetchProfile(id: string): Promise<Profile> {
  // All error handling paths untested
  // Success path untested
}

// Line 46-63: deleteProfile() function - COMPLETELY UNTESTED
export async function deleteProfile(id: string): Promise<void> {
  // All error handling paths untested
  // Success path untested
}

// Line 65-99: fetchProfiles() - Partially tested (likely only success path)
// Error scenarios and filter combinations not tested
```

### Missing Test Cases

#### Quick Win: Basic Happy Path Tests (Est. 30-40% coverage improvement)
```typescript
// Test 1: Successful fetchProfile call
// - Mock fetch to return valid Profile object
// - Verify correct URL is called
// - Verify returned data matches expected Profile interface

// Test 2: Successful deleteProfile call
// - Mock fetch DELETE request
// - Verify onSubmit callback called
// - Verify correct profile ID used in URL

// Test 3: Successful fetchProfiles with various filters
// - All filters: type, subtype, category, search
// - Pagination parameters
// - Sort directions (asc/desc)
```

#### Branch Coverage Gaps: Error Handling (Est. 40% improvement)
```typescript
// Test 4: fetchProfile with network error
// - Mock fetch to throw network error
// - Verify error is logged and re-thrown
// - Verify console.error called with correct message

// Test 5: fetchProfile with 404 response
// - Mock fetch with 404 status
// - Verify error message includes status code
// - Verify error is thrown properly

// Test 6: fetchProfile with 500 response
// - Mock fetch with 500 status
// - Verify error handling

// Test 7: deleteProfile with network error
// - Mock fetch DELETE to fail
// - Verify error handling

// Test 8: deleteProfile with non-ok response (403, 500, etc)
// - Multiple error status codes
```

#### Edge Cases & Parameter Combinations
```typescript
// Test 9: fetchProfiles with NO filters
// - Only pagination params

// Test 10: fetchProfiles with ALL filters active
// - Verify URLSearchParams built correctly
// - Check filter order doesn't matter

// Test 11: fetchProfiles with special characters in search
// - URL encoding validation

// Test 12: fetchProfile with empty/null id
// - Verify it still attempts call (or adds validation)

// Test 13: fetchProfiles with invalid pagination
// - Negative page numbers
// - Zero pageSize
```

### Test Setup Template
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as mockApi from './mockApi'

describe('mockApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  describe('fetchProfile', () => {
    it('successfully fetches a profile', async () => {
      const mockProfile = { id: '1', name: 'Test Profile' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProfile
      })

      const result = await mockApi.fetchProfile('1')

      expect(result).toEqual(mockProfile)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/profiles/1'
      )
    })

    it('throws error on failed response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(mockApi.fetchProfile('1')).rejects.toThrow(
        'API error: 404 Not Found'
      )
    })

    it('throws error on network failure', async () => {
      const error = new Error('Network error')
      global.fetch = vi.fn().mockRejectedValue(error)

      await expect(mockApi.fetchProfile('1')).rejects.toThrow('Network error')
    })
  })

  describe('deleteProfile', () => {
    it('successfully deletes a profile', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true
      })

      await expect(mockApi.deleteProfile('1')).resolves.toBeUndefined()
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/profiles/1',
        { method: 'DELETE' }
      )
    })

    it('throws error on delete failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      })

      await expect(mockApi.deleteProfile('1')).rejects.toThrow(
        'API error: 403 Forbidden'
      )
    })
  })

  describe('fetchProfiles', () => {
    const defaultPagination = {
      page: 1,
      pageSize: 10,
      sortField: 'created',
      sortDirection: 'desc' as const
    }

    it('builds correct query parameters', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, pageSize: 10 })
      })

      await mockApi.fetchProfiles(defaultPagination, {})

      const callUrl = global.fetch.mock.calls[0][0]
      expect(callUrl).toContain('page=1')
      expect(callUrl).toContain('pageSize=10')
      expect(callUrl).toContain('sortField=created')
      expect(callUrl).toContain('sortDirection=desc')
    })

    it('includes active filters in query', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, pageSize: 10 })
      })

      await mockApi.fetchProfiles(defaultPagination, {
        type: 'Destination',
        subtype: 'CIDR',
        search: 'test'
      })

      const callUrl = global.fetch.mock.calls[0][0]
      expect(callUrl).toContain('type=Destination')
      expect(callUrl).toContain('subtype=CIDR')
      expect(callUrl).toContain('search=test')
    })

    it('omits undefined filters', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, pageSize: 10 })
      })

      await mockApi.fetchProfiles(defaultPagination, {
        type: 'Destination',
        search: undefined
      })

      const callUrl = global.fetch.mock.calls[0][0]
      expect(callUrl).toContain('type=Destination')
      expect(callUrl).not.toContain('search')
    })
  })
})
```

### Priority: **CRITICAL** (Highest ROI)
- **Effort**: Medium (write ~12-15 test cases)
- **Coverage Impact**: 60-70% increase possible (from 24% → 80%+)
- **Risk**: High - API layer is critical, uncaught bugs here affect entire app
- **Suggested Approach**: Start with happy path tests, then add error scenarios

---

## 2. MatchLogic.tsx (27.47% Statement Coverage) - CRITICAL

### Current State
- Only 25 of 91 statements covered
- Only 6 of 35 functions tested (17.14%)
- Only 8 of 50 branches covered (16%)
- **Lowest function coverage in priority list**

### What's Not Tested
The component has 7 handler functions and 3 group/display functions:

```typescript
// Line 75-81: handleRuleChange() - UNTESTED
const handleRuleChange = (id: string, field: 'operator' | 'field', newValue: string) => {
  // Branch: rule.id === id ? YES / NO
  // Side effect: setRules called
  // Callback: onRulesChange? called
}

// Line 83-98: handleValueToggle() - UNTESTED
const handleValueToggle = (ruleId: string, value: string) => {
  // Branch: rule.id === ruleId ? YES / NO
  // Branch: rule.selectedValues.includes(value) ? YES / NO
}

// Line 100-122: handleSelectAll() - UNTESTED
const handleSelectAll = (ruleId: string) => {
  // Branch: !rule ? return (guard clause untested)
  // Branch: rule.field === 'Category' ? YES / NO
  // Branch: selectedValues.length === allOptions.length ? YES / NO (toggle on/off)
}

// Line 124-135: handleAddRule() - UNTESTED
const handleAddRule = () => {
  // Calculates new ID correctly?
}

// Line 137-143: handleRemoveRule() - UNTESTED (PARTIALLY TESTED)
const handleRemoveRule = (id: string) => {
  // Branch: rules.length > 1 ? YES / NO (guard clause)
}

// Line 152-160: toggleGroup() - UNTESTED
const toggleGroup = (groupName: string) => {
  // Branch: newExpanded.has(groupName) ? YES / NO
}

// Line 162-178: getGroupedOptions() & getOptions() - UNTESTED
const getGroupedOptions = (field: string) => {
  // Branch: field === 'Category' ? YES / NO
}
```

### Missing Test Cases

#### Critical Branch Coverage Gaps
```typescript
describe('MatchLogic - User Interactions', () => {
  // Test 1: handleRuleChange - Operator changes
  // - Click operator dropdown for rule 2 or 3
  // - Select "OR" when already "OR"
  // - Select "AND NOT"
  // - Verify rule updated
  // - Verify selectedValues cleared when operator changes
  // - Verify onRulesChange callback called

  // Test 2: handleRuleChange - Field changes
  // - Change field from "Category" to "URL/Destination Profile"
  // - Change from "URL/Destination Profile" back to "Category"
  // - Verify selectedValues reset to []
  // - Verify correct options displayed after change

  // Test 3: handleValueToggle - Select single value
  // - Click checkbox for unselected category
  // - Verify value added to selectedValues
  // - Verify selected count updated

  // Test 4: handleValueToggle - Deselect value
  // - With value already selected, click its checkbox
  // - Verify value removed from selectedValues

  // Test 5: handleValueToggle - Multiple selections
  // - Select 3 categories
  // - Verify all appear in selectedValues
  // - Verify "Select All" checkbox becomes partially checked

  // Test 6: handleSelectAll - Toggle SELECT ALL on
  // - All options not selected
  // - Click "Select All" checkbox
  // - Verify ALL options selected
  // - Verify checkbox stays checked

  // Test 7: handleSelectAll - Toggle SELECT ALL off
  // - All options selected
  // - Click "Select All" checkbox
  // - Verify ALL options deselected
  // - Verify checkbox unchecked

  // Test 8: handleSelectAll for Category field
  // - Verify correct category options loaded
  // - Verify URL_PROFILE_OPTIONS excluded

  // Test 9: handleSelectAll for URL/Destination field
  // - Verify all destination + URL list options included
  // - Verify proper grouping maintained

  // Test 10: handleAddRule
  // - Initial rules length: 3
  // - Click "+ Add Rule" button
  // - Verify new rule created with auto-incremented ID
  // - Verify new rule has default values: OR operator, Category field
  // - Verify onRulesChange called with 4 rules

  // Test 11: handleRemoveRule - Can't remove last rule
  // - Start with 1 rule only
  // - Click remove button
  // - Verify remove button is disabled
  // - Verify rule still present

  // Test 12: handleRemoveRule - Can remove when multiple rules
  // - Start with 3 rules
  // - Click remove on rule 2
  // - Verify rule 2 removed
  // - Verify rules length = 2
  // - Verify onRulesChange called

  // Test 13: toggleGroup - Expand group
  // - Group collapsed initially (Categories in dropdown)
  // - Click group expand button
  // - Verify group expands
  // - Verify items visible

  // Test 14: toggleGroup - Collapse group
  // - Group already expanded
  // - Click to collapse
  // - Verify group collapses
  // - Verify items hidden

  // Test 15: getGroupedOptions for Category field
  // - Returns single group: "Categories"
  // - All CATEGORY_OPTIONS included

  // Test 16: getGroupedOptions for URL/Destination field
  // - Returns 2 groups: "Destination Profiles", "URL Lists (to be deprecated)"
  // - Correct items in each group
})
```

#### Edge Cases
```typescript
// Test 17: Operator select - First rule immutable
// - First rule shows badge "OR" not dropdown
// - Can't change first rule operator

// Test 18: Navigation callback on group settings button
// - Click ⚙️ button on "Destination Profiles" group
// - Verify onNavigateToProfile called with 'Destination'

// Test 19: Navigation callback on group settings button for URL Lists
// - Click ⚙️ button on "URL Lists (to be deprecated)"
// - Verify onNavigateToProfile called with 'URL Lists'

// Test 20: Search input doesn't filter (currently just placeholder)
// - Verify search input renders
// - Verify typing doesn't cause errors
// - (Consider implementing search in future)

// Test 21: Keyboard navigation on group header
// - Press Enter on group expand span
// - Press Space on group expand span
// - Verify group toggles
```

#### Integration Tests
```typescript
// Test 22: Multiple rules with different configurations
// - Rule 1: Category field, 3 categories selected
// - Rule 2: URL/Destination, 2 destinations selected
// - Rule 3: URL/Destination with AND NOT, 1 URL list selected
// - Verify all rules maintain independent state
// - Verify each field has correct options

// Test 23: Add rule after modifications
// - Modify rules 1-3 (change selections, operators)
// - Add new rule
// - Verify new rule doesn't affect existing rules
// - Verify new rule has fresh state
```

### Test Setup Template
```typescript
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MatchLogic, { MatchRule } from './MatchLogic'

describe('MatchLogic - Extended Coverage', () => {
  const mockOnRulesChange = vi.fn()
  const mockOnNavigateToProfile = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleRuleChange', () => {
    it('updates operator for non-first rules', async () => {
      const { container } = render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      // Click dropdown on second rule (first clickable operator)
      const operatorSelects = screen.getAllByDisplayValue('OR')
      await userEvent.selectOptions(operatorSelects[1], 'AND NOT')

      // Verify callback includes updated rule
      expect(mockOnRulesChange).toHaveBeenCalled()
      const lastCall = mockOnRulesChange.mock.calls[-1][0]
      expect(lastCall[1].operator).toBe('AND NOT')
      expect(lastCall[1].selectedValues).toEqual([]) // Reset on change
    })

    it('changes field and clears selected values', async () => {
      render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      // Expand first rule to select some values
      const ruleButtons = screen.getAllByRole('button', { name: /Select|selected/ })
      await userEvent.click(ruleButtons[0])

      // Select a category
      const categoryCheckboxes = screen.getAllByRole('checkbox', { name: /Abortion|Adult/ })
      await userEvent.click(categoryCheckboxes[0])

      // Should show "1 selected"
      expect(screen.getByText('1 selected')).toBeInTheDocument()

      // Collapse and verify state
      expect(mockOnRulesChange).toHaveBeenCalled()
    })
  })

  describe('handleValueToggle', () => {
    it('adds value when unchecked', async () => {
      render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      // Expand first rule (Category)
      const expandButtons = screen.getAllByRole('button', { name: /Select|selected/ })
      await userEvent.click(expandButtons[0])

      // Click first available category checkbox
      const categoryCheckbox = screen.getAllByRole('checkbox')[2] // Skip Select All
      await userEvent.click(categoryCheckbox)

      expect(mockOnRulesChange).toHaveBeenCalled()
      const lastCall = mockOnRulesChange.mock.calls[-1][0]
      expect(lastCall[0].selectedValues.length).toBe(1)
    })

    it('removes value when already checked', async () => {
      render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      const expandButtons = screen.getAllByRole('button', { name: /Select|selected/ })
      await userEvent.click(expandButtons[0])

      const categoryCheckbox = screen.getAllByRole('checkbox')[2]

      // Click to add
      await userEvent.click(categoryCheckbox)

      // Click to remove
      await userEvent.click(categoryCheckbox)

      const lastCall = mockOnRulesChange.mock.calls[-1][0]
      expect(lastCall[0].selectedValues.length).toBe(0)
    })
  })

  describe('handleSelectAll', () => {
    it('selects all options when none selected', async () => {
      render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      const expandButtons = screen.getAllByRole('button', { name: /Select|selected/ })
      await userEvent.click(expandButtons[0]) // Expand first rule

      // Click Select All checkbox
      const selectAllCheckbox = screen.getAllByRole('checkbox')[1]
      await userEvent.click(selectAllCheckbox)

      const lastCall = mockOnRulesChange.mock.calls[-1][0]
      // Should select all categories
      expect(lastCall[0].selectedValues.length).toBeGreaterThan(0)
    })

    it('deselects all options when all selected', async () => {
      // Similar to above but verify deselect behavior
    })
  })

  describe('handleAddRule', () => {
    it('adds new rule with auto-incremented ID', async () => {
      render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      const addButton = screen.getByText('+ Add Rule')
      await userEvent.click(addButton)

      expect(mockOnRulesChange).toHaveBeenCalled()
      const lastCall = mockOnRulesChange.mock.calls[-1][0]
      expect(lastCall).toHaveLength(4) // Started with 3, now 4
      expect(lastCall[3].operator).toBe('OR')
      expect(lastCall[3].field).toBe('Category')
    })
  })

  describe('handleRemoveRule', () => {
    it('does not remove last rule', async () => {
      const { container } = render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      // Need to test with only 1 rule - may need to remove 2 rules first
      // Then attempt to remove the last one
      const removeButtons = screen.getAllByRole('button', { name: '✕' })

      // Click remove on first removable rule multiple times
      // Last remove button should be disabled
    })

    it('removes rule when multiple exist', async () => {
      render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      const removeButtons = screen.getAllByRole('button', { name: '✕' })
      const initialRemovedCount = mockOnRulesChange.mock.calls.length

      await userEvent.click(removeButtons[0])

      expect(mockOnRulesChange).toHaveBeenCalledTimes(initialRemovedCount + 1)
      const lastCall = mockOnRulesChange.mock.calls[-1][0]
      expect(lastCall).toHaveLength(2) // Started with 3, removed 1
    })
  })

  describe('toggleGroup', () => {
    it('expands and collapses groups', async () => {
      render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      // Expand second rule to see URL groups
      const expandButtons = screen.getAllByRole('button', { name: /Select|selected/ })
      await userEvent.click(expandButtons[1])

      // Group should be visible with items
      expect(screen.getByText('Destination Profiles')).toBeInTheDocument()

      // Find and click group toggle
      const groupToggles = screen.getAllByRole('button', { name: '▶' })

      // Toggle first group
      await userEvent.click(groupToggles[0])

      // Items should still be visible initially (expanded by default)
      // Toggle again to collapse
      await userEvent.click(groupToggles[0])

      // Verify collapse state by looking for items
    })
  })

  describe('navigation callbacks', () => {
    it('calls onNavigateToProfile when settings button clicked', async () => {
      render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      // Expand second rule to see URL groups
      const expandButtons = screen.getAllByRole('button', { name: /Select|selected/ })
      await userEvent.click(expandButtons[1])

      // Find and click settings button for Destination Profiles group
      const settingsButtons = screen.getAllByRole('button', { name: /View/ })
      await userEvent.click(settingsButtons[0])

      expect(mockOnNavigateToProfile).toHaveBeenCalledWith('Destination')
    })

    it('calls onNavigateToProfile with URL Lists for deprecated group', async () => {
      render(
        <MatchLogic
          onRulesChange={mockOnRulesChange}
          onNavigateToProfile={mockOnNavigateToProfile}
        />
      )

      const expandButtons = screen.getAllByRole('button', { name: /Select|selected/ })
      await userEvent.click(expandButtons[1])

      const settingsButtons = screen.getAllByRole('button', { name: /View/ })
      await userEvent.click(settingsButtons[1])

      expect(mockOnNavigateToProfile).toHaveBeenCalledWith('URL Lists')
    })
  })
})
```

### Priority: **CRITICAL** (2nd Highest Priority)
- **Effort**: High (write ~20-25 test cases)
- **Coverage Impact**: 50-60% increase possible (from 27% → 80%+)
- **Risk**: Medium - Complex component with many interaction paths
- **Suggested Approach**: Organize tests by handler function, then integration tests

---

## 3. DestinationForm.tsx (26.79% Statement Coverage)

### Current State
- 15 of 56 statements covered (26.79%)
- Only 3 of 16 functions tested (18.75%)
- Only 6 of 18 branches covered (33.33%)

### What's Not Tested

#### Untested Functions
```typescript
// Line 39-49: handleFileChange() - COMPLETELY UNTESTED
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // File reading logic with FileReader API
  // Append to existing definition or replace
}

// Line 51-61: handleDownloadSample() - COMPLETELY UNTESTED
const handleDownloadSample = () => {
  // Blob creation
  // URL object creation
  // Download trigger
}

// Line 63-73: handleDownloadAsFile() - COMPLETELY UNTESTED
const handleDownloadAsFile = () => {
  // Branch: !definition.trim() ? return (guard)
  // File download logic
}

// Line 20-32: handleSubmit() - PARTIALLY TESTED
const handleSubmit = () => {
  // Branch: profileName.trim() ? YES / NO (guard)
  // Only tested with empty name
}
```

#### Missing Test Cases

```typescript
describe('DestinationForm - Missing Coverage', () => {
  // Test 1: Successful form submission
  // - Enter profile name
  // - Enter description
  // - Click Save button
  // - Verify console.log called with correct data
  // - Verify alert shown
  // - Verify onSubmit callback called

  // Test 2: handleSubmit with whitespace-only name
  // - Enter "   " as name
  // - Click Save
  // - Verify no submission occurs

  // Test 3: handleSubmit with console.log verification
  // - Set all fields (name, description, definition, etc)
  // - Click Save
  // - Verify console.log includes all values

  // Test 4: Case Insensitive checkbox appears for Exact subtype
  // - Already covered but verify state change

  // Test 5: Case Insensitive checkbox unchecked/checked state
  // - Initially checked (default true)
  // - Click to uncheck
  // - Verify caseInsensitive state = false
  // - Verify value submitted includes this

  // Test 6: Description textarea change
  // - Type description
  // - Verify state updated
  // - Verify length affects submission

  // Test 7: Definition textarea updates
  // - Type definition lines
  // - Verify rowCount calculated correctly

  // Test 8: Row count display
  // - Add 0 lines: "0 Rows Added"
  // - Add 1 line: "1 Rows Added"
  // - Add 10 lines: "10 Rows Added"
  // - Add 100 lines: "100 Rows Added"

  // Test 9: Clear button
  // - Enter definition text
  // - Click Clear button
  // - Verify definition becomes empty
  // - Verify row count resets to 0

  // Test 10: TXT dropdown menu toggle
  // - Click TXT button
  // - Verify menu appears
  // - Click TXT button again
  // - Verify menu closes

  // Test 11: Upload file handler
  // - Click TXT button to open menu
  // - Click "Upload file"
  // - Verify file input click triggered
  // - Verify menu closes

  // Test 12: File selection and read
  // - Select .txt file with content
  // - Verify content appended to definition
  // - Verify rowCount updated
  // - Verify file input cleared (for re-upload)

  // Test 13: File selection appends to existing definition
  // - Add initial definition "line1"
  // - Upload file with "line2\nline3"
  // - Verify result is "line1\nline2\nline3"

  // Test 14: File selection with .csv extension
  // - Select .csv file (allowed by accept attr)
  // - Verify it reads and appends correctly

  // Test 15: handleDownloadSample
  // - Click TXT button
  // - Click "Download sample file"
  // - Verify URL.createObjectURL called
  // - Verify blob contains expected sample content
  // - Verify download triggered with correct filename
  // - Verify menu closes
  // - Verify URL.revokeObjectURL called (cleanup)

  // Test 16: handleDownloadAsFile with content
  // - Enter definition content
  // - Click TXT button
  // - Click "Download as file"
  // - Verify blob created with definition content
  // - Verify download triggered with profile name as filename
  // - Verify cleanup (revokeObjectURL)

  // Test 17: handleDownloadAsFile without content
  // - Empty definition
  // - Click TXT button
  // - Click "Download as file"
  // - Verify nothing downloaded (guard clause prevents it)

  // Test 18: Download filename uses profileName
  // - Profile name: "MyDestination"
  // - Download file
  // - Verify filename = "MyDestination.txt"

  // Test 19: Download filename fallback to 'destination'
  // - Empty profile name
  // - Download file with content
  // - Verify filename = "destination.txt"

  // Test 20: Edit mode button text
  // - Render with isEditing={true}
  // - Verify button shows "Edit Profile" not "Save"

  // Test 21: Find button (currently stubbed alert)
  // - Click Find button
  // - Verify alert triggered (currently)

  // Test 22: Form fieldset structure
  // - Verify Definition fieldset visible
  // - Verify toolbar buttons present
  // - Verify info banner present

  // Test 23: Controlled inputs
  // - Verify all inputs are controlled components
  // - Verify state synced with input values
})
```

### Priority: **HIGH** (3rd Priority)
- **Effort**: Medium-High (write ~15-20 test cases)
- **Coverage Impact**: 40-50% increase possible (27% → 75%+)
- **Risk**: Medium - File upload and download logic is error-prone
- **Suggested Approach**: Group by feature (file handling, form submission, display)

---

## 4. UrlListsForm.tsx (26.09% Statement Coverage)

### Current State
- 6 of 23 statements covered
- Only 3 of 9 functions tested (33.33%)
- Only 3 of 10 branches covered (30%)

### What's Not Tested
```typescript
// Need to examine the file to provide specifics
// Likely similar to DestinationForm with file handling untested
```

### Recommended Test Cases
- File upload/download handlers (similar pattern to DestinationForm)
- Form validation and submission
- State management for URL list items
- Add/remove URL items from list
- Validation of URL format

### Priority: **MEDIUM** (4th Priority)
- **Effort**: Medium (similar to DestinationForm)
- **Coverage Impact**: 40-50% increase
- **Risk**: Medium

---

## 5. CustomCategoriesForm.tsx (45.45% Statement Coverage)

### Current State
- Already at 45% coverage, better than others
- 5 of 11 statements covered
- Only 1 of 4 functions tested (25%)
- 3 of 6 branches covered (50%)

### What's Likely Missing
```typescript
// handleSubmit function - verify form submission with validation
// Description textarea state changes
// MatchLogic integration and rule changes callback
// Test the full workflow with match rule selections
```

### Priority: **MEDIUM** (5th Priority)
- **Effort**: Low (5-8 test cases)
- **Coverage Impact**: 30-40% increase (45% → 75%+)

---

## 6. FingerprintRulesForm.tsx (50.00% Statement Coverage)

### Current State
- Already at 50% coverage
- 5 of 10 statements covered
- 2 of 4 functions tested (50%)
- 3 of 6 branches covered (50%)

### What's Likely Missing
```typescript
// Threshold slider value changes (line 39-48)
// Range slider DOM behavior
// Threshold value display update
// handleSubmit with different threshold values
```

### Priority: **LOW** (6th Priority)
- **Effort**: Low (4-6 test cases)
- **Coverage Impact**: 25-35% increase (50% → 80%+)

---

## 7. MalwareDetectionForm.tsx (37.93% Statement Coverage)

### Current State
- 11 of 29 statements covered
- Only 2 of 13 functions tested (15.38%)
- 7 of 28 branches covered (25%)

### Priority: **MEDIUM-HIGH** (Between 3-4)
- **Effort**: Medium (10-15 test cases)
- **Coverage Impact**: 35-45% increase
- **Risk**: Medium

---

## Summary Table: Coverage Improvement Strategy

| File | Current | Target | Effort | Complexity | Priority | Est. ROI |
|------|---------|--------|--------|-----------|----------|---------|
| mockApi.ts | 24% | 85% | Medium | Low | 🔴 CRITICAL | HIGH |
| MatchLogic.tsx | 27% | 80% | High | High | 🔴 CRITICAL | HIGH |
| DestinationForm.tsx | 27% | 80% | High | High | 🟠 HIGH | MEDIUM |
| MalwareDetectionForm.tsx | 38% | 80% | Medium | Medium | 🟠 HIGH | MEDIUM |
| UrlListsForm.tsx | 26% | 80% | Medium | High | 🟡 MEDIUM | MEDIUM |
| CustomCategoriesForm.tsx | 45% | 80% | Low | Low | 🟡 MEDIUM | HIGH |
| FingerprintRulesForm.tsx | 50% | 80% | Low | Low | 🟢 LOW | MEDIUM |

---

## Quick Win Opportunities (High ROI, Low Effort)

### 1. mockApi.ts - Test Success Paths First (Est. 2-3 hours)
Start with basic happy path tests for all three functions. This will immediately jump coverage to 40-50%.

**Template:**
```typescript
describe('mockApi - Happy Paths', () => {
  // 3 tests: one for each function's success case
  // Mock fetch with successful response
  // Verify correct arguments and return value
  // Est. 30 minutes per test
})
```

### 2. CustomCategoriesForm.tsx - Low-hanging fruit (Est. 1 hour)
Form submission and description textarea changes are typically straightforward.

### 3. FingerprintRulesForm.tsx - Slider interaction (Est. 1 hour)
Testing the threshold slider is simpler than file handling.

---

## Recommended Implementation Order

1. **Week 1: Quick Wins**
   - mockApi.ts happy paths (3-4 hours)
   - CustomCategoriesForm completion (1 hour)
   - FingerprintRulesForm completion (1 hour)
   - **Expected Coverage**: mockApi 40%+, Forms 75%+

2. **Week 2: mockApi Error Handling**
   - All error scenarios for fetchProfile (2 hours)
   - All error scenarios for deleteProfile (1 hour)
   - Filter combinations for fetchProfiles (1 hour)
   - **Expected Coverage**: mockApi 80%+

3. **Week 3: DestinationForm**
   - File upload/download handlers (3-4 hours)
   - Form submission and validation (2 hours)
   - **Expected Coverage**: DestinationForm 80%+

4. **Week 4: MatchLogic**
   - Handler functions (handleRuleChange, etc) (4 hours)
   - User interaction flows (3 hours)
   - Integration tests (2 hours)
   - **Expected Coverage**: MatchLogic 80%+

---

## Testing Best Practices to Apply

### 1. Use Setup/Teardown
```typescript
beforeEach(() => {
  vi.clearAllMocks()
  // Clear any browser APIs (fetch, localStorage, etc)
})

afterEach(() => {
  // Cleanup timers, subscriptions
})
```

### 2. Mock External Dependencies
```typescript
// For API calls
global.fetch = vi.fn().mockResolvedValue(...)

// For file operations
global.URL.createObjectURL = vi.fn().mockReturnValue(...)
```

### 3. Test User Interactions, Not Implementation
```typescript
// Good ✓
await userEvent.type(screen.getByLabelText('Name'), 'Test')

// Avoid ✗
act(() => {
  component.setState({ name: 'Test' })
})
```

### 4. Verify Callbacks and Side Effects
```typescript
// Verify callbacks invoked
expect(mockOnSubmit).toHaveBeenCalledWith(expectedData)

// Verify console logs
const spy = vi.spyOn(console, 'log')
// ... trigger action ...
expect(spy).toHaveBeenCalledWith(expectedMessage)
```

### 5. Test Branch Coverage Explicitly
```typescript
// Test both branches of conditionals
it('does something when condition is true', () => { ... })
it('does something else when condition is false', () => { ... })
```

---

## Estimated Total Effort

| Phase | Hours | Coverage Impact |
|-------|-------|-----------------|
| Quick Wins | 4-5 | 15-20% (app overall) |
| mockApi Errors | 4-5 | 25-30% |
| DestinationForm | 5-6 | 10-15% |
| MatchLogic | 8-10 | 20-25% |
| UrlListsForm | 4-5 | 5% |
| MalwareDetectionForm | 4-5 | 5% |
| **Total** | **30-36 hours** | **80-90% overall** |

---

## Tools & Resources

### Vitest/Testing Library Docs
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest](https://vitest.dev/)
- [userEvent API](https://testing-library.com/docs/user-event/intro)

### Common Testing Patterns
- Mock fetch API: Use `vi.fn().mockResolvedValue()` / `mockRejectedValue()`
- User interactions: `userEvent.click()`, `userEvent.type()`, `userEvent.selectOptions()`
- DOM queries: `screen.getByLabelText()`, `screen.getByRole()`, `screen.getByText()`
- Assertions: `expect().toBeInTheDocument()`, `expect().toHaveBeenCalled()`, etc.

### Key Points for Form Testing
- Test controlled inputs (value synced with state)
- Test button disabled/enabled states
- Test form submission callbacks
- Test conditional rendering based on props (like `isEditing`)
- Test file input interactions
- Test text input changes

---

## Conclusion

The most impactful improvements come from:
1. **mockApi.ts** - Simple function testing with high payoff
2. **MatchLogic.tsx** - Complex but critical component
3. **DestinationForm.tsx** - File handling is error-prone

Focus on these three files first to achieve 70%+ overall coverage with ~15-20 hours of work.
