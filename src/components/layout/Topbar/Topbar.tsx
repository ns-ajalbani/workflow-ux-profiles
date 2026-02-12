import netskopeLogoUrl from '../../../assets/netskope-logo.png'

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="logo-section">
          <img
            src={netskopeLogoUrl}
            alt="Netskope"
            className="netskope-logo"
          />
        </div>
      </div>
    </header>
  )
}
