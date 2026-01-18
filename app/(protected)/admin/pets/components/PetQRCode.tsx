'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { useState, useEffect } from 'react'

export default function PetQRCode({ petId, petName }: { petId: string, petName: string }) {
    const [url, setUrl] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Use the environment variable if defined (e.g. for production links), otherwise fallback to current origin
            const origin = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
            setUrl(`${origin}/pet/${petId}`)
        }
    }, [petId])

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=600,height=600')
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>QR Code - ${petName}</title>
                        <style>
                            body { font-family: sans-serif; text-align: center; padding: 2rem; }
                            .container { border: 5px solid black; padding: 2rem; display: inline-block; border-radius: 20px; }
                            h1 { font-size: 3rem; margin-bottom: 1rem; text-transform: uppercase; }
                            p { font-size: 1.5rem; color: #555; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>${petName}</h1>
                            <div id="qr-placeholder"></div>
                            <p>Scan to Adopt Me!</p>
                            <p style="font-size: 1rem; margin-top: 2rem;">PAWS Shelter Management</p>
                        </div>
                    </body>
                </html>
            `)

            // We need to render the canvas into the new window or generate an image data URL
            const canvas = document.getElementById(`qr-canvas-${petId}`) as HTMLCanvasElement
            if (canvas) {
                const dataUrl = canvas.toDataURL()
                const img = printWindow.document.createElement('img')
                img.src = dataUrl
                img.style.width = '300px'
                img.style.height = '300px'
                printWindow.document.getElementById('qr-placeholder')?.appendChild(img)
            }

            printWindow.document.close()
            printWindow.focus()
            setTimeout(() => {
                printWindow.print()
                printWindow.close()
            }, 500)
        }
    }

    if (!url) return null

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'white', padding: '1rem', display: 'inline-block', border: '2px solid #eee', borderRadius: '10px' }}>
                <QRCodeCanvas
                    id={`qr-canvas-${petId}`}
                    value={url}
                    size={200}
                    level={"H"}
                    includeMargin={true}
                />
            </div>
            <div style={{ marginTop: '1rem' }}>
                <button
                    onClick={handlePrint}
                    className="neopop-button"
                    style={{
                        padding: '0.5rem 1rem',
                        background: '#93C572',
                        color: 'black',
                        fontWeight: 'bold',
                        border: '2px solid black',
                        boxShadow: '3px 3px 0px black',
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                    🖨️ Print QR Code
                </button>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                Public URL: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
            </p>
        </div>
    )
}
