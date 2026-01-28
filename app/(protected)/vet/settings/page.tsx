import ChangePasswordForm from './components/ChangePasswordForm'

export default function VetSettingsPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textShadow: '3px 3px 0px white',
                color: 'black'
            }}>
                ⚙️ Vet Settings
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <ChangePasswordForm />
            </div>
        </div>
    )
}
