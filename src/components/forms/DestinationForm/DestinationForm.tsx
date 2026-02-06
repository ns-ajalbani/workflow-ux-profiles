import { useState, useRef } from 'react'

interface DestinationFormProps {
  subtype: string
  onSubmit: () => void
  profileName?: string
  isEditing?: boolean
}

export default function DestinationForm({ subtype, onSubmit, profileName: initialProfileName, isEditing }: DestinationFormProps) {
  const [profileName, setProfileName] = useState(initialProfileName || '')
  const [description, setDescription] = useState('')
  const [caseInsensitive, setCaseInsensitive] = useState(true)
  const [definition, setDefinition] = useState('')
  const [showTxtMenu, setShowTxtMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const rowCount = definition.split('\n').filter(l => l.trim()).length

  const handleSubmit = () => {
    if (profileName.trim()) {
      console.log('Creating destination profile:', {
        profileName,
        description,
        subtype,
        caseInsensitive,
        definition,
      })
      alert(`Destination Profile created!\nName: ${profileName}`)
      onSubmit()
    }
  }

  const handleUpload = () => {
    setShowTxtMenu(false)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      setDefinition(prev => (prev ? prev + '\n' + text : text))
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleDownloadSample = () => {
    setShowTxtMenu(false)
    const sample = 'www.example.com/mypath\n*.example.com\nRANGE:1.1.1.1-1.1.1.10\nCIDR:1.1.1.0/24'
    const blob = new Blob([sample], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'destination-sample.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadAsFile = () => {
    setShowTxtMenu(false)
    if (!definition.trim()) return
    const blob = new Blob([definition], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profileName || 'destination'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="form-section">
      <div className="form-group">
        <label htmlFor="dest-profile-name">Destination Profile Name</label>
        <input
          id="dest-profile-name"
          type="text"
          placeholder="Enter Destination profile name"
          value={profileName}
          onChange={e => setProfileName(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="dest-description">Description (Optional)</label>
        <textarea
          id="dest-description"
          placeholder="Enter description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="form-textarea"
          rows={3}
        />
      </div>

      {subtype === 'Exact' && (
        <div className="form-group">
          <label className="dropdown-checkbox-option">
            <input
              type="checkbox"
              checked={caseInsensitive}
              onChange={e => setCaseInsensitive(e.target.checked)}
            />
            <span>Case Insensitive</span>
          </label>
        </div>
      )}

      <div className="dest-info-banner">
        A record with a path is only applicable for native HTTP and decrypted HTTPS traffic (not
        applicable to firewall, SSL/TLS, steering and non-decrypted HTTPS)
      </div>

      <fieldset className="form-fieldset">
        <legend className="form-fieldset-legend">Definition</legend>
        <div className="dest-definition-help">
          <p>Enter IP addresses, domains, URLs, IP Ranges or CIDR separated by newlines:</p>
          <code>www.example.com/mypath</code>
          <code>*.example.com</code>
          <code>RANGE:1.1.1.1-1.1.1.10</code>
          <code>CIDR:1.1.1.0/24</code>
          <p>Use a number sign (#) or a semicolon (;) for comments.</p>
        </div>

        <div className="dest-toolbar">
          <div className="dest-txt-dropdown">
            <button
              type="button"
              className="dest-toolbar-btn"
              onClick={() => setShowTxtMenu(!showTxtMenu)}
            >
              TXT <span className="dropdown-checkbox-arrow">&#9660;</span>
            </button>
            {showTxtMenu && (
              <div className="dest-txt-menu">
                <button type="button" onClick={handleUpload}>
                  Upload file
                </button>
                <button type="button" onClick={handleDownloadSample}>
                  Download sample file
                </button>
                <button type="button" onClick={handleDownloadAsFile}>
                  Download as file
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              className="import-csv-input"
              onChange={handleFileChange}
            />
          </div>
          <button type="button" className="dest-toolbar-btn" onClick={() => alert('Find')}>
            Find
          </button>
          <button type="button" className="dest-toolbar-btn" onClick={() => setDefinition('')}>
            Clear
          </button>
        </div>

        <textarea
          id="dest-definition"
          placeholder="Enter IP addresses, domains, or URLs, separated by newline"
          value={definition}
          onChange={e => setDefinition(e.target.value)}
          className="form-textarea dest-definition-textarea"
          rows={12}
        />

        <div className="dest-definition-footer">
          <span>{rowCount} Rows Added</span>
          <span className="dest-perf-warning">
            Performance could be impacted when there are more than 10K entries.
          </span>
        </div>
      </fieldset>

      <button className="create-btn" onClick={handleSubmit} disabled={!profileName.trim()}>
        {isEditing ? 'Edit Profile' : 'Save'}
      </button>
    </div>
  )
}
