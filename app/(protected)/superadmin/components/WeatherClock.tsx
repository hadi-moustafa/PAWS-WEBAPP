'use client'

import { useState, useEffect } from 'react'
import styles from './widget.module.css'

export default function WeatherClock() {
    const [time, setTime] = useState<Date | null>(null)
    const [weather, setWeather] = useState<{ temp: number, description: string } | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true)
        setTime(new Date())

        // Clock Timer
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)

        // Weather Fetch - Beirut, Lebanon (33.8938, 35.5018)
        fetch('https://api.open-meteo.com/v1/forecast?latitude=33.8938&longitude=35.5018&current_weather=true')
            .then(res => res.json())
            .then(data => {
                if (data.current_weather) {
                    setWeather({
                        temp: data.current_weather.temperature,
                        description: getWeatherDesc(data.current_weather.weathercode)
                    })
                }
            })
            .catch(err => console.error("Weather fetch failed", err))

        return () => clearInterval(timer)
    }, [])

    if (!mounted) return null

    return (
        <div className={`${styles.widget} neopop-card`}>
            <div className={styles.clockSection}>
                <h2 className={styles.time}>
                    {time?.toLocaleTimeString('en-US', { timeZone: 'Asia/Beirut', hour: '2-digit', minute: '2-digit' })}
                </h2>
                <p className={styles.date}>
                    {time?.toLocaleDateString('en-US', { timeZone: 'Asia/Beirut', weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <small style={{ color: '#888', fontSize: '0.8rem' }}>Beirut, LB</small>
            </div>



            <div className={styles.weatherSection}>
                {weather ? (
                    <>
                        <span className={styles.temp}>{weather.temp}°C</span>
                        <span className={styles.desc}>{weather.description}</span>
                    </>
                ) : (
                    <span>Loading Weather...</span>
                )}
            </div>
        </div>
    )
}

function getWeatherDesc(code: number) {
    // Simple WMO code map
    if (code === 0) return 'Ckear Sky ☀️'
    if (code > 0 && code < 4) return 'Partly Cloudy ⛅'
    if (code >= 45 && code < 50) return 'Foggy 🌫️'
    if (code >= 50 && code < 66) return 'Rainy 🌧️'
    if (code >= 70 && code < 80) return 'Snowy ❄️'
    return 'Cloudy ☁️'
}
