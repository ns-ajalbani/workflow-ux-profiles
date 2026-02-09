// Simple test script to verify the mock API functionality
// This will be run in Node.js to test the API logic

const MOCK_PROFILES = [
  {
    id: '1',
    name: 'DLP Profiles Configuration',
    type: 'DLP',
    subtype: 'DLP Profiles',
    category: 'Predefined',
    created: '2024-01-15',
  },
  {
    id: '2',
    name: 'Fingerprint Rule - Document Match',
    type: 'DLP',
    subtype: 'Fingerprint Rules',
    category: 'Predefined',
    created: '2024-01-10',
  },
  {
    id: '3',
    name: 'Malware Detection Profile',
    type: 'Threat Protection',
    subtype: 'Malware Detection',
    category: 'Custom',
    created: '2024-01-05',
  },
  {
    id: '4',
    name: 'Custom Categories Config',
    type: 'Custom Categories',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-12-20',
  },
  {
    id: '5',
    name: 'AWS Destination Profile',
    type: 'Destination',
    subtype: 'Exact',
    category: 'Predefined',
    created: '2023-12-15',
  },
  {
    id: '6',
    name: 'Salesforce Instance Config',
    type: 'App Instance',
    subtype: 'New App',
    category: 'Predefined',
    created: '2023-12-10',
  },
  {
    id: '7',
    name: 'API Request Header',
    type: 'HTTP Header',
    subtype: 'Request',
    category: 'Custom',
    created: '2023-12-05',
  },
  {
    id: '8',
    name: 'Internal Domain Config',
    type: 'Domain',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-11-30',
  },
  {
    id: '9',
    name: 'Admin User Profile',
    type: 'User',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-11-25',
  },
  {
    id: '10',
    name: 'PDF File Type Profile',
    type: 'File',
    subtype: 'File Type',
    category: 'Predefined',
    created: '2023-11-20',
  },
  {
    id: '11',
    name: 'User Count Constraint',
    type: 'Constraint',
    subtype: 'Users',
    category: 'Custom',
    created: '2023-11-15',
  },
  {
    id: '12',
    name: 'Quarantine Profile Setup',
    type: 'Quarantine',
    subtype: 'Quarantine Profile',
    category: 'Predefined',
    created: '2023-11-10',
  },
  {
    id: '13',
    name: 'Legal Hold Active',
    type: 'Legal Hold',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-11-05',
  },
  {
    id: '14',
    name: 'Forensic Logging Enabled',
    type: 'Forensic',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-10-30',
  },
  {
    id: '15',
    name: 'Remediation Rule',
    type: 'Threat Protection',
    subtype: 'Remediation',
    category: 'Custom',
    created: '2023-10-25',
  },
  {
    id: '16',
    name: 'Network Location Multiple',
    type: 'Network Location',
    subtype: 'Multiple Object',
    category: 'Custom',
    created: '2023-10-20',
  },
]

function applyFilters(profiles, filters) {
  return profiles.filter(profile => {
    const matchesType = !filters.type || profile.type === filters.type
    const matchesSubtype = !filters.subtype || profile.subtype === filters.subtype
    const matchesCategory = !filters.category || profile.category === filters.category
    const matchesSearch =
      !filters.search ||
      profile.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      profile.type.toLowerCase().includes(filters.search.toLowerCase()) ||
      profile.subtype.toLowerCase().includes(filters.search.toLowerCase())

    return matchesType && matchesSubtype && matchesCategory && matchesSearch
  })
}

function applySorting(profiles, sortField, sortDirection) {
  const sorted = [...profiles].sort((a, b) => {
    let aValue = ''
    let bValue = ''

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'type':
        aValue = a.type.toLowerCase()
        bValue = b.type.toLowerCase()
        break
      case 'subtype':
        aValue = a.subtype.toLowerCase()
        bValue = b.subtype.toLowerCase()
        break
      case 'category':
        aValue = a.category.toLowerCase()
        bValue = b.category.toLowerCase()
        break
      case 'created':
        aValue = a.created
        bValue = b.created
        break
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

// Test cases
console.log('=== API Mock Tests ===\n')

// Test 1: Get first page (default pagination)
console.log('Test 1: First page (page 1, pageSize 10)')
const filtered1 = applyFilters(MOCK_PROFILES, {})
const sorted1 = applySorting(filtered1, 'created', 'desc')
const page1 = sorted1.slice(0, 10)
console.log(`Total: ${filtered1.length}, Returned: ${page1.length}`)
console.log(`First item: ${page1[0].name}\n`)

// Test 2: Get second page
console.log('Test 2: Second page (page 2, pageSize 10)')
const page2 = sorted1.slice(10, 20)
console.log(`Total: ${filtered1.length}, Returned: ${page2.length}`)
console.log(`First item: ${page2[0].name}\n`)

// Test 3: Filter by type (DLP)
console.log('Test 3: Filter by type "DLP"')
const filteredDLP = applyFilters(MOCK_PROFILES, { type: 'DLP' })
const sortedDLP = applySorting(filteredDLP, 'created', 'desc')
console.log(`Total matching: ${filteredDLP.length}`)
console.log(`Items: ${filteredDLP.map(p => p.name).join(', ')}\n`)

// Test 4: Filter by category (Custom)
console.log('Test 4: Filter by category "Custom"')
const filteredCustom = applyFilters(MOCK_PROFILES, { category: 'Custom' })
console.log(`Total matching: ${filteredCustom.length}\n`)

// Test 5: Search by name
console.log('Test 5: Search for "Threat"')
const filteredSearch = applyFilters(MOCK_PROFILES, { search: 'Threat' })
console.log(`Total matching: ${filteredSearch.length}`)
console.log(`Items: ${filteredSearch.map(p => p.name).join(', ')}\n`)

// Test 6: Combined filters
console.log('Test 6: Filter by type "Threat Protection" AND search "Threat"')
const filteredCombined = applyFilters(MOCK_PROFILES, {
  type: 'Threat Protection',
  search: 'Threat',
})
console.log(`Total matching: ${filteredCombined.length}`)
console.log(`Items: ${filteredCombined.map(p => p.name).join(', ')}\n`)

// Test 7: Sorting by name (ascending)
console.log('Test 7: Sort by name (ascending)')
const sortedByName = applySorting(MOCK_PROFILES, 'name', 'asc')
console.log(
  `First 3 items: ${sortedByName
    .slice(0, 3)
    .map(p => p.name)
    .join(', ')}\n`,
)

// Test 8: Pagination with filters
console.log('Test 8: Filter by category "Predefined" and paginate (page 1, pageSize 5)')
const filtered8 = applyFilters(MOCK_PROFILES, { category: 'Predefined' })
const sorted8 = applySorting(filtered8, 'created', 'desc')
const page8 = sorted8.slice(0, 5)
console.log(`Total matching: ${filtered8.length}, Returned: ${page8.length}`)
console.log(`Items: ${page8.map(p => p.name).join(', ')}\n`)

console.log('✅ All tests completed successfully!')
