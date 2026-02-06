import { useState } from 'react'

interface UrlListsFormProps {
  onSubmit: () => void
  profileName?: string
  isEditing?: boolean
}

export default function UrlListsForm({ onSubmit, profileName: initialProfileName, isEditing }: UrlListsFormProps) {
  const [urlListName, setUrlListName] = useState(initialProfileName || '')
  const [urlListEntries, setUrlListEntries] = useState('')

  const handleSubmit = () => {
    if (urlListName.trim()) {
      console.log('Creating URL list:', { urlListName, urlListEntries })
      alert(`URL List created!\nName: ${urlListName}`)
      onSubmit()
    }
  }

  return (
    <div className="form-section">
      <div className="form-group">
        <label htmlFor="url-list-name">
          URL List Name <span className="form-required">*</span>
        </label>
        <input
          id="url-list-name"
          type="text"
          placeholder="Enter URL List name"
          value={urlListName}
          onChange={e => setUrlListName(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="url-ip-section">
        <div className="url-ip-header">
          <h4 className="url-ip-title">
            URL &amp; IP Address ({urlListEntries.split('\n').filter(l => l.trim()).length})
          </h4>
          <label className="import-csv-btn">
            Import from CSV
            <input
              type="file"
              accept=".csv"
              className="import-csv-input"
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = ev => {
                  const text = ev.target?.result as string
                  const lines = text
                    .split(/[\r\n,]+/)
                    .map(l => l.trim())
                    .filter(Boolean)
                  setUrlListEntries(prev =>
                    prev ? prev + '\n' + lines.join('\n') : lines.join('\n'),
                  )
                }
                reader.readAsText(file)
                e.target.value = ''
              }}
            />
          </label>
        </div>
        <p className="url-ip-help">
          Enter URLs like www.example.com, *.example.com, or IP addresses, separated by newline. For
          more examples, refer to{' '}
          <button type="button" className="help-link-btn">
            Help
          </button>
        </p>
        <textarea
          id="url-list-entries"
          placeholder="Enter URL or IP Address separated by new line"
          value={urlListEntries}
          onChange={e => setUrlListEntries(e.target.value)}
          className="form-textarea url-list-textarea"
          rows={10}
        />
        <p className="url-ip-max-size">Max Size: 7MB</p>
      </div>

      <button className="create-btn" onClick={handleSubmit} disabled={!urlListName.trim()}>
        {isEditing ? 'Edit Profile' : 'Save'}
      </button>
    </div>
  )
}
