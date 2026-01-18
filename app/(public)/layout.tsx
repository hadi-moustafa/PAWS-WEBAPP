export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ minHeight: '100vh', background: '#FFF5E6', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
            <main>
                {children}
            </main>
        </div>
    )
}
