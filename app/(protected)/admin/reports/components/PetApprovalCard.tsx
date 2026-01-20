"use client";

import { updatePetStatus } from "../actions";
import { useState } from "react";
import UserSearch from "./UserSearch";

export default function PetApprovalCard({ pet }: { pet: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showAdoptModal, setShowAdoptModal] = useState(false);
    const [selectedOwnerId, setSelectedOwnerId] = useState("");

    const handleAction = async (status: "Stray" | "Rejected" | "Adopted", ownerId?: string) => {
        setIsLoading(true);
        try {
            await updatePetStatus(pet.id, status, ownerId);
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setIsLoading(false);
            setShowAdoptModal(false);
        }
    };

    return (
        <div className="neopop-card" style={{
            background: 'white',
            border: '3px solid black',
            boxShadow: '6px 6px 0px black',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <div style={{
                height: '200px',
                background: '#eee',
                borderBottom: '3px solid black',
                backgroundImage: pet.images && pet.images.length > 0 ? `url(${pet.images[0]})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {(!pet.images || pet.images.length === 0) && (
                    <span style={{ fontWeight: 'bold', color: '#888' }}>NO IMAGE</span>
                )}
            </div>

            <div style={{ padding: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <span style={{
                            background: '#FF9F1C',
                            color: 'black',
                            fontWeight: '900',
                            padding: '0.2rem 0.5rem',
                            border: '2px solid black',
                            fontSize: '0.8rem',
                            textTransform: 'uppercase'
                        }}>
                            PENDING APPROVAL
                        </span>
                        <h2 style={{ margin: '0.5rem 0 0 0', fontWeight: '900', fontSize: '1.5rem' }}>{pet.name}</h2>
                        <p style={{ margin: 0, color: '#666', fontWeight: 'bold' }}>{pet.breed} • {pet.type}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>📍 {pet.location}</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{pet.description}</p>
                </div>

                {/* Initial Actions */}
                {!showAdoptModal && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <button
                            onClick={() => handleAction("Stray")}
                            disabled={isLoading}
                            className="neopop-button"
                            style={{
                                background: '#feca57', // Yellow for Stray
                                color: 'black',
                                border: '2px solid black',
                                fontWeight: 'bold',
                                padding: '0.5rem',
                                boxShadow: '2px 2px 0px black'
                            }}
                        >
                            MAKE STRAY 🐕
                        </button>
                        <button
                            onClick={() => setShowAdoptModal(true)}
                            disabled={isLoading}
                            className="neopop-button"
                            style={{
                                background: '#55efc4', // Mint for Adopted
                                color: 'black',
                                border: '2px solid black',
                                fontWeight: 'bold',
                                padding: '0.5rem',
                                boxShadow: '2px 2px 0px black'
                            }}
                        >
                            MARK ADOPTED 🏠
                        </button>
                        <button
                            onClick={() => handleAction("Rejected")}
                            disabled={isLoading}
                            className="neopop-button"
                            style={{
                                gridColumn: '1 / -1',
                                background: '#ff7675',
                                color: 'black',
                                border: '2px solid black',
                                fontWeight: 'bold',
                                padding: '0.5rem',
                                boxShadow: '2px 2px 0px black',
                                marginTop: '0.5rem'
                            }}
                        >
                            REJECT ❌
                        </button>
                    </div>
                )}

                {/* Adopt Modal Overlay within Card */}
                {showAdoptModal && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: '#f1f2f6',
                        border: '2px dashed black',
                        borderRadius: '8px'
                    }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Select Adopter</h4>
                        <UserSearch onSelect={setSelectedOwnerId} />

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => handleAction("Adopted", selectedOwnerId)}
                                disabled={!selectedOwnerId || isLoading}
                                className="neopop-button"
                                style={{
                                    flex: 1,
                                    background: '#55efc4',
                                    opacity: (!selectedOwnerId || isLoading) ? 0.5 : 1,
                                    border: '2px solid black',
                                    fontWeight: 'bold',
                                    padding: '0.5rem'
                                }}
                            >
                                CONFIRM
                            </button>
                            <button
                                onClick={() => setShowAdoptModal(false)}
                                className="neopop-button"
                                style={{
                                    flex: 1,
                                    background: 'white',
                                    border: '2px solid black',
                                    fontWeight: 'bold',
                                    padding: '0.5rem'
                                }}
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
