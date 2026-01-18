'use client'

import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, Sky } from '@react-three/drei'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import Duck3D from './Duck3D'

function DuckFamily() {
    const { viewport, mouse } = useThree()

    // Mother Duck Position State
    const momRef = useRef<THREE.Group>(null)
    const [momPos, setMomPos] = useState(new THREE.Vector3(0, 0, 0))
    const [momRot, setMomRot] = useState(0)

    // Ducklings - They trail behind positions
    // We'll store a history of mom's positions
    const historyRef = useRef<THREE.Vector3[]>([])

    useFrame((state, delta) => {
        if (!momRef.current) return

        // 1. Calculate Target (Mouse projected to ground plane)
        // Convert mouse screen coords (-1 to 1) to world units
        const x = (state.mouse.x * viewport.width) / 2
        // We'll map Y mouse to Z depth for top-down-ish feeling
        // Or actually, let's just use X and Z on the ground

        // This projection is tricky in 3D. Let's use a simpler "Look at plane" approach
        // Or just map direct viewport for simplicity since camera is fixed
        const targetX = (state.mouse.x * viewport.width) / 2
        const targetZ = -(state.mouse.y * viewport.height) / 2 // Invert Y for Z depth

        const target = new THREE.Vector3(targetX, 0, targetZ)

        // 2. Mom lerps to target
        const currentPos = momRef.current.position.clone()
        const direction = target.clone().sub(currentPos)

        // Move mom
        if (direction.length() > 0.1) {
            const speed = 4 * delta
            const newPos = currentPos.add(direction.normalize().multiplyScalar(speed))
            momRef.current.position.set(newPos.x, 0, newPos.z)

            // Rotate mom to face movement
            const angle = Math.atan2(direction.x, direction.z)
            momRef.current.rotation.y = angle

            // Save position for ducklings
            setMomPos(newPos)
            setMomRot(angle)

            historyRef.current.unshift(newPos.clone())
            if (historyRef.current.length > 50) historyRef.current.pop() // Limit history
        }
    })

    return (
        <>
            {/* Mother Duck */}
            <group ref={momRef}>
                <Duck3D scale={0.5} color="#f1c40f" />
            </group>

            {/* Ducklings - Trailing at fixed history intervals */}
            {/* Duckling 1 (Delay 10 frames) */}
            <Duckling targetPos={historyRef.current[8]} />

            {/* Duckling 2 (Delay 20 frames) */}
            <Duckling targetPos={historyRef.current[16]} />

            {/* Duckling 3 (Delay 30 frames) */}
            <Duckling targetPos={historyRef.current[24]} />
        </>
    )
}

function Duckling({ targetPos }: { targetPos: THREE.Vector3 | undefined }) {
    const ref = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        if (!ref.current || !targetPos) return

        const current = ref.current.position.clone()
        const diff = targetPos.clone().sub(current)

        if (diff.length() > 0.1) {
            const speed = 4 * delta // Match mom's speed usually, or slight catchup
            const move = diff.normalize().multiplyScalar(speed)
            ref.current.position.add(move)

            const angle = Math.atan2(diff.x, diff.z)
            ref.current.rotation.y = angle
        }
    })

    return (
        <group ref={ref}>
            <Duck3D scale={0.25} color="#f9ca24" />
        </group>
    )
}


export default function Scene3D() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
            <Canvas shadows camera={{ position: [0, 8, 8], fov: 45 }}>
                <Sky sunPosition={[100, 20, 100]} />
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />

                <DuckFamily />

                {/* Grass Plane with Custom Texture */}
                <GrassPlane />
            </Canvas>
        </div>
    )
}

function GrassPlane() {
    // Load texture
    const texture = useLoader(THREE.TextureLoader, '/grass_bg.jpg')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(20, 20) // Repeat for large field

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}
