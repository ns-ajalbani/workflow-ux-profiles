import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

// Enable CORS for requests from Vite dev server
app.use(cors())
app.use(express.json())

// Mock data
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

// GET /api/profiles - Server-side pagination and filtering
app.get('/api/profiles', (req, res) => {
  const {
    page = '1',
    pageSize = '10',
    sortField = 'created',
    sortDirection = 'desc',
    type,
    subtype,
    category,
    search,
  } = req.query

  console.log(`\n📡 Received API Request`)
  console.log(
    `   URL: GET /api/profiles?page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}${type ? `&type=${type}` : ''}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`
  )

  // Apply filters
  let filtered = MOCK_PROFILES.filter(profile => {
    const matchesType = !type || profile.type === type
    const matchesSubtype = !subtype || profile.subtype === subtype
    const matchesCategory = !category || profile.category === category
    const matchesSearch =
      !search ||
      profile.name.toLowerCase().includes(search.toLowerCase()) ||
      profile.type.toLowerCase().includes(search.toLowerCase()) ||
      profile.subtype.toLowerCase().includes(search.toLowerCase())

    return matchesType && matchesSubtype && matchesCategory && matchesSearch
  })

  const total = filtered.length
  console.log(`   Filters: type=${type || 'none'}, category=${category || 'none'}, search=${search || 'none'}`)
  console.log(`   Results after filtering: ${total} items`)

  // Apply sorting
  filtered.sort((a, b) => {
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
      default:
        aValue = a.created
        bValue = b.created
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Apply pagination
  const pageNum = Math.max(1, parseInt(page))
  const pageSizeNum = Math.max(1, Math.min(100, parseInt(pageSize)))
  const startIndex = (pageNum - 1) * pageSizeNum
  const endIndex = startIndex + pageSizeNum
  const paginatedData = filtered.slice(startIndex, endIndex)

  console.log(`   Pagination: page=${pageNum}, pageSize=${pageSizeNum}, returning ${paginatedData.length} items`)
  console.log(`✅ API Response sent\n`)

  res.json({
    data: paginatedData,
    total,
    page: pageNum,
    pageSize: pageSizeNum,
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`)
  console.log(`║   Mock API Server Running              ║`)
  console.log(`║   URL: http://localhost:${PORT}         ║`)
  console.log(`║   Endpoint: GET /api/profiles          ║`)
  console.log(`╚════════════════════════════════════════╝\n`)
  console.log(`Watch this console for API requests!\n`)
})
