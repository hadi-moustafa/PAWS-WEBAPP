'use client'

import { deleteUser } from '../actions'

export default function DeleteUserButton({ userId }: { userId: string }) {
    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Deleting this user will destroy every relation related to him from pets to appointments to chat."
        )

        if (confirmed) {
            await deleteUser(userId)
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="neopop-button"
            style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '0.9rem',
                background: '#FF6B6B', // Red
                color: 'black',
                border: '2px solid black',
                fontWeight: 'bold',
                cursor: 'pointer'
            }}
        >
            🗑️ DELETE
        </button>
    )
}
