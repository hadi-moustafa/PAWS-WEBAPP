'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface DuckProps {
    color?: string
    scale?: number
    position?: [number, number, number]
    rotation?: [number, number, number]
}

export default function Duck3D({ color = '#ffd700', scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }: DuckProps) {
    const group = useRef<Group>(null)

    // Gentle waddle animation
    useFrame(({ clock }) => {
        if (group.current) {
            group.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 10) * 0.1 * scale
            group.current.rotation.z = Math.sin(clock.getElapsedTime() * 10) * 0.05
        }
    })

    return (
        <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
            {/* Body */}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[1.2, 1, 1.4]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Head */}
            <mesh position={[0, 1.4, 0.5]}>
                <boxGeometry args={[0.8, 0.8, 0.8]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Beak */}
            <mesh position={[0, 1.4, 1]}>
                <boxGeometry args={[0.4, 0.2, 0.4]} />
                <meshStandardMaterial color="#ff7f50" />
            </mesh>

            {/* Eyes */}
            <mesh position={[0.25, 1.5, 0.85]}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[-0.25, 1.5, 0.85]}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color="black" />
            </mesh>

            {/* Wings */}
            <mesh position={[0.65, 0.6, 0]}>
                <boxGeometry args={[0.2, 0.6, 1]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.65, 0.6, 0]}>
                <boxGeometry args={[0.2, 0.6, 1]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Feet */}
            <mesh position={[0.3, 0, 0]}>
                <boxGeometry args={[0.3, 0.2, 0.3]} />
                <meshStandardMaterial color="#ff7f50" />
            </mesh>
            <mesh position={[-0.3, 0, 0]}>
                <boxGeometry args={[0.3, 0.2, 0.3]} />
                <meshStandardMaterial color="#ff7f50" />
            </mesh>
        </group>
    )
}
