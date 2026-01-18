"use client";

import { updatePetStatus } from "@/app/actions/reports";
import { useState } from "react";

export default function PetApprovalCard({ pet }: { pet: any }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (status: "Stray" | "Rejected") => {
        setIsLoading(true);
        try {
            await updatePetStatus(pet.id, status);
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="neopop-card" style={{
            background: 'white',
            border: '3px solid black',
            boxShadow: '6px 6px 0px black',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button
                        onClick={() => handleAction("Rejected")}
                        disabled={isLoading}
                        className="neopop-button"
                        style={{
                            background: '#FF6B6B',
                            color: 'white',
                            border: '3px solid black',
                            fontWeight: 'bold',
                            padding: '0.8rem',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            boxShadow: '2px 2px 0px black'
                        }}
                    >
                        REJECT ❌
                    </button>
                    <button
                        onClick={() => handleAction("Stray")}
                        disabled={isLoading}
                        className="neopop-button"
                        style={{
                            background: '#93C572',
                            color: 'black',
                            border: '3px solid black',
                            fontWeight: 'bold',
                            padding: '0.8rem',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            boxShadow: '2px 2px 0px black'
                        }}
                    >
                        APPROVE ✅
                    </button>
                </div>
            </div>
        </div>
    );
}
