import FingerprintRulesForm from '../forms/FingerprintRulesForm'
import MalwareDetectionForm from '../forms/MalwareDetectionForm'
import DestinationForm from '../forms/DestinationForm'
import UrlListsForm from '../forms/UrlListsForm'
import CustomCategoriesForm from '../forms/CustomCategoriesForm'
import type { Profile } from '../Profiles'

interface FormFactoryProps {
  subtype: string
  profileName: string
  selectedProfileType: string
  editingProfile?: Profile | null
  onNavigateToProfile?: (type: string) => void
}

export function ProfileFormFactory({
  subtype,
  profileName,
  editingProfile,
  onNavigateToProfile,
}: FormFactoryProps): React.ReactElement | null {
  const isEditing = !!editingProfile
  const handleSubmit = () => {
    // Form submission is handled by parent
  }

  switch (subtype) {
    case 'Fingerprint Rules':
      return (
        <FingerprintRulesForm
          onSubmit={handleSubmit}
          profileName={profileName}
          isEditing={isEditing}
        />
      )
    case 'Malware Detection':
      return (
        <MalwareDetectionForm
          onSubmit={handleSubmit}
          profileName={profileName}
          isEditing={isEditing}
        />
      )
    case 'Destination':
      return (
        <DestinationForm
          subtype={subtype}
          onSubmit={handleSubmit}
          profileName={profileName}
          isEditing={isEditing}
        />
      )
    case 'URL Lists':
      return (
        <UrlListsForm
          onSubmit={handleSubmit}
          profileName={profileName}
          isEditing={isEditing}
        />
      )
    case 'Custom Categories':
      return (
        <CustomCategoriesForm
          onNavigateToProfile={onNavigateToProfile || (() => {})}
          onSubmit={handleSubmit}
          profileName={profileName}
          isEditing={isEditing}
        />
      )
    default:
      return (
        <div style={{ padding: '20px', color: '#999' }}>
          No form available for {subtype}
        </div>
      )
  }
}

export function isFormAvailable(subtype: string): boolean {
  return ['Fingerprint Rules', 'Malware Detection', 'Destination', 'URL Lists', 'Custom Categories'].includes(
    subtype,
  )
}
