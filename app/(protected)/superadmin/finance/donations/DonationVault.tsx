'use client'

import React, { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import { createClient } from '@/lib/supabase/client'

interface Donation {
    id: number
    amount: number
    message: string | null
    currency: string
    createdAt: string
}

export default function DonationVault({ initialDonations }: { initialDonations: Donation[] }) {
    const sceneRef = useRef<HTMLDivElement>(null)
    const engineRef = useRef<Matter.Engine | null>(null)
    const renderRef = useRef<Matter.Render | null>(null)
    const runnerRef = useRef<Matter.Runner | null>(null)
    const supabase = createClient()
    const [total, setTotal] = useState(0)

    // Calculate total
    useEffect(() => {
        const t = initialDonations.reduce((acc, curr) => acc + Number(curr.amount), 0)
        setTotal(t)
    }, [initialDonations])

    // Physics Initialization with ResizeObserver
    useEffect(() => {
        const container = sceneRef.current
        if (!container) return

        let engine: Matter.Engine
        let render: Matter.Render
        let runner: Matter.Runner

        const init = () => {
            // Clean up previous instances if they exist
            if (render) {
                Matter.Render.stop(render)
                if (render.canvas) render.canvas.remove()
            }
            if (runner) {
                Matter.Runner.stop(runner)
            }
            if (engine) {
                Matter.World.clear(engine.world, false)
                Matter.Engine.clear(engine)
            }
            // Also clean ref if it was set
            if (engineRef.current) {
                Matter.World.clear(engineRef.current.world, false)
                Matter.Engine.clear(engineRef.current)
            }

            const width = container.clientWidth
            const height = container.clientHeight

            if (width === 0 || height === 0) return

            console.log('Physics Init:', { width, height })

            // 1. Setup Matter.js
            engine = Matter.Engine.create()
            engineRef.current = engine

            render = Matter.Render.create({
                element: container,
                engine: engine,
                options: {
                    width,
                    height,
                    wireframes: false,
                    background: 'transparent',
                    pixelRatio: window.devicePixelRatio
                }
            })
            renderRef.current = render

            // 2. Create Bounds
            const wallOptions = { isStatic: true, render: { fillStyle: '#2d3436' } }
            const wallThickness = 60

            const ground = Matter.Bodies.rectangle(width / 2, height + 30, width, wallThickness, wallOptions)
            const leftWall = Matter.Bodies.rectangle(0 - wallThickness / 2, height / 2, wallThickness, height * 2, wallOptions)
            const rightWall = Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, wallOptions)

            Matter.World.add(engine.world, [ground, leftWall, rightWall])

            // 3. Mouse
            const mouse = Matter.Mouse.create(render.canvas)
            const mouseConstraint = Matter.MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: { visible: false }
                }
            })
            Matter.World.add(engine.world, mouseConstraint)
            render.mouse = mouse

            // 4. Runner
            runner = Matter.Runner.create()
            runnerRef.current = runner
            Matter.Render.run(render)
            Matter.Runner.run(runner, engine)

            // 5. Add Initial Items
            if (initialDonations && initialDonations.length > 0) {
                initialDonations.forEach(d => {
                    const amount = Number(d.amount)
                    addBody(engine.world, amount, width, height)
                })
            }
        }

        // Helper to add body
        const addBody = (world: Matter.World, amount: number, w: number, h: number) => {
            const baseSize = amount < 50 ? 30 : amount < 100 ? 50 : 70
            // Spawn range: 10% to 90% of width
            const x = (w * 0.1) + Math.random() * (w * 0.8)
            // Spawn height: top half of screen relative to center
            const y = (h * 0.2) + (Math.random() * (h * 0.3))

            let body;
            if (amount < 50) { // Coin
                body = Matter.Bodies.circle(x, y, baseSize / 2, {
                    restitution: 0.5,
                    friction: 0.5,
                    render: {
                        sprite: {
                            texture: '/coin.png',
                            xScale: 0.08,
                            yScale: 0.08
                        }
                    }
                })
            } else if (amount < 100) { // Cash
                body = Matter.Bodies.rectangle(x, y, baseSize * 1.5, baseSize, {
                    restitution: 0.5,
                    friction: 0.5,
                    render: {
                        sprite: {
                            texture: '/cash.png',
                            xScale: 0.12,
                            yScale: 0.12
                        }
                    }
                })
            } else { // Large amount fallback
                body = Matter.Bodies.rectangle(x, y, baseSize * 1.5, baseSize, {
                    restitution: 0.5,
                    friction: 0.5,
                    render: {
                        sprite: {
                            texture: '/cash.png',
                            xScale: 0.4,
                            yScale: 0.4
                        }
                    }
                })
            }
            Matter.World.add(world, body)
        }

        // Observer
        const observer = new ResizeObserver(() => {
            // Debounce slightly or just run? For now, just run init if dimensions changed meaningfully
            // Simpler: Just init.
            requestAnimationFrame(() => init())
        })
        observer.observe(container)

        return () => {
            observer.disconnect()
            if (render) {
                Matter.Render.stop(render)
                if (render.canvas) render.canvas.remove()
            }
            if (runner) {
                Matter.Runner.stop(runner)
            }
            if (engine) {
                Matter.World.clear(engine.world, false)
                Matter.Engine.clear(engine)
            }
        }
    }, []) // Dependency array empty intentionally, we rely on Observer

    // Listen for new donations
    useEffect(() => {
        const channel = supabase
            .channel('vault-donations')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Donation' },
                (payload) => {
                    const newDonation = payload.new as Donation
                    setTotal(prev => prev + Number(newDonation.amount))

                    if (engineRef.current && sceneRef.current) {
                        const width = sceneRef.current.clientWidth
                        // const height = sceneRef.current.clientHeight // Unused
                        const amount = Number(newDonation.amount)

                        // Spawn params - Reduced sizes
                        const baseSize = amount < 50 ? 30 : amount < 100 ? 50 : 70
                        const x = (width * 0.1) + Math.random() * (width * 0.8)
                        const y = -100 // Spawn well above visible area

                        let body;
                        if (amount < 50) { // Coin
                            body = Matter.Bodies.circle(x, y, baseSize / 2, {
                                restitution: 0.5,
                                friction: 0.5,
                                render: {
                                    sprite: {
                                        texture: '/coin.png',
                                        xScale: 0.08, // Smaller scaling
                                        yScale: 0.08
                                    }
                                }
                            })
                        } else if (amount < 100) { // Cash
                            body = Matter.Bodies.rectangle(x, y, baseSize * 1.5, baseSize, {
                                restitution: 0.5,
                                friction: 0.5,
                                render: {
                                    sprite: {
                                        texture: '/cash.png',
                                        xScale: 0.12,
                                        yScale: 0.12
                                    }
                                }
                            })
                        } else { // Large amount fallback (Cash for now, or gold bar if we had it)
                            body = Matter.Bodies.rectangle(x, y, baseSize * 1.5, baseSize, {
                                restitution: 0.5,
                                friction: 0.5,
                                render: {
                                    sprite: {
                                        texture: '/cash.png', // Fallback to cash for now
                                        xScale: 0.15,
                                        yScale: 0.15
                                    }
                                }
                            })
                        }
                        Matter.World.add(engineRef.current.world, body)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    return (
        <div style={{ height: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="neopop-card" style={{
                margin: '2rem',
                padding: '1.5rem',
                background: '#FF9F1C',
                border: '4px solid black',
                boxShadow: '8px 8px 0px black',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: 'white', textShadow: '2px 2px 0px black' }}>
                        🏦 THE VAULT
                    </h1>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Secure Anti-Gravity Storage</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: 'white', textShadow: '2px 2px 0px black' }}>
                            ${total.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* The Vault Container */}
            <div style={{
                flex: 1,
                margin: '0 2rem 2rem 2rem',
                border: '8px solid #2d3436',
                borderRadius: '0 0 20px 20px',
                borderTop: 'none',
                background: '#dfe6e9',
                position: 'relative',
                overflow: 'hidden',
                // Removed inset shadow to fix blur
                display: 'flex',
            }}>
                {/* Canvas Container */}
                <div ref={sceneRef} style={{ flex: 1, width: '100%', background: 'rgba(0,0,0,0.02)' }} />

                {/* Overlay Instructions */}
                <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,255,255,0.8)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    pointerEvents: 'none',
                    zIndex: 5
                }}>
                    🖱️ Drag items to rearrange funds!
                </div>
            </div>
        </div>
    )
}
