'use client'

import { useTransition, useState } from 'react'
import { updatePassword } from '@/app/actions/auth'

export default function ChangePasswordForm() {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = (formData: FormData) => {
        setMessage(null)
        const currentPassword = formData.get('currentPassword') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' })
            return
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' })
            return
        }

        startTransition(async () => {
            const result = await updatePassword(password, currentPassword)
            if (result.error) {
                setMessage({ type: 'error', text: result.error })
            } else {
                setMessage({ type: 'success', text: 'Password updated successfully!' })
                // Optional: Reset form
                const form = document.getElementById('change-password-form') as HTMLFormElement
                form?.reset()
            }
        })
    }

    return (
        <div className="neopop-card" style={{
            background: 'white',
            padding: '2rem',
            maxWidth: '500px',
            border: '3px solid black',
            boxShadow: '6px 6px 0px black',
            borderRadius: '12px'
        }}>
            <h2 style={{ marginTop: 0, textTransform: 'uppercase', borderBottom: '3px solid black', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔒 Change Password
            </h2>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    border: '2px solid black',
                    background: message.type === 'success' ? '#55efc4' : '#ff7675',
                    color: 'black'
                }}>
                    {message.text}
                </div>
            )}

            <form id="change-password-form" action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        required
                        className="neopop-input"
                        style={{ width: '100%', padding: '0.8rem', border: '2px solid black', borderRadius: '8px', fontSize: '1rem' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>New Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        className="neopop-input"
                        style={{ width: '100%', padding: '0.8rem', border: '2px solid black', borderRadius: '8px', fontSize: '1rem' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        className="neopop-input"
                        style={{ width: '100%', padding: '0.8rem', border: '2px solid black', borderRadius: '8px', fontSize: '1rem' }}
                    />
                </div>

                <button
                    disabled={isPending}
                    type="submit"
                    className="neopop-button"
                    style={{
                        padding: '1rem',
                        background: '#a29bfe',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        border: '3px solid black',
                        boxShadow: '4px 4px 0px black',
                        borderRadius: '8px',
                        cursor: isPending ? 'not-allowed' : 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    {isPending ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    )
}
