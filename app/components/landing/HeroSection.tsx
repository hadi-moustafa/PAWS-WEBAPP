import Image from "next/image";
import Link from "next/link";
import styles from "./Landing.module.css";

export default function HeroSection() {
    return (
        <section className={styles.neoSection} style={{ padding: '4rem 2rem', background: '#f7f1e3' }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '4rem',
                alignItems: 'center'
            }}>
                {/* Text Side */}
                <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="neopop-tag" style={{
                            background: '#FF9F1C',
                            color: 'black',
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            fontWeight: 'bold',
                            border: '3px solid black',
                            boxShadow: '4px 4px 0px black'
                        }}>
                            #1 Shelter
                        </div>

                        <Link href="/login" style={{
                            textDecoration: 'underline',
                            fontWeight: '900',
                            color: '#2d3436',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem',
                            border: '2px solid black',
                            padding: '0.5rem',
                            background: 'white'
                        }}>
                            🔒 Staff Portal
                        </Link>
                    </div>

                    <h1 style={{
                        fontSize: '5rem',
                        lineHeight: '1',
                        fontWeight: '900',
                        marginBottom: '1.5rem',
                        textTransform: 'uppercase',
                        color: '#2d3436',
                        textShadow: '6px 6px 0px #93C572'
                    }}>
                        Adopt.<br />Don't Shop.
                    </h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                        Ready to find your new best friend? Download our app or browse online.
                        <br /><span style={{ fontSize: '1rem', opacity: 0.8 }}>(Admins & Vets: Log in above to manage queues)</span>
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="#app-download" className="neopop-button" style={{
                            fontSize: '1.5rem',
                            padding: '1rem 2.5rem',
                            background: '#2d3436',
                            color: 'white',
                            borderColor: 'black'
                        }}>
                            Get the App
                        </Link>
                        <Link href="/vet/patients" className="neopop-button secondary" style={{
                            fontSize: '1.5rem',
                            padding: '1rem 2.5rem',
                            background: 'white',
                            color: 'black',
                            borderColor: 'black'
                        }}>
                            Browse Pets
                        </Link>
                    </div>
                </div>

                {/* Image Side */}
                <div className={styles.floating} style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        background: '#ff7675',
                        padding: '1rem',
                        border: '3px solid black',
                        borderRadius: '50%',
                        fontWeight: 'bold',
                        transform: 'rotate(15deg)',
                        zIndex: 2,
                        boxShadow: '4px 4px 0px black'
                    }}>
                        100%<br />CUTE
                    </div>
                    <Image
                        src="/Paws_logo.jpeg"
                        alt="Mascot"
                        width={500}
                        height={500}
                        style={{
                            borderRadius: '20px',
                            border: '6px solid black',
                            boxShadow: '16px 16px 0px #FF9F1C',
                            backgroundColor: 'white'
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
