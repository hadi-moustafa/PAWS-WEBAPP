import styles from './Landing.module.css'

export default function AboutSection() {
    return (
        <section className={styles.sectionContainer}>
            <div className={styles.aboutContent}>
                <h2>About PAWS</h2>
                <p>
                    We are more than just a shelter; we are a safe haven.
                    Founded in 2024, PAWS has rescued over 500 animals and found loving homes for 350+ furry friends.
                    Our mission is to create a world where every stray finds a warm bed and a full bowl.
                </p>
            </div>
        </section>
    )
}
