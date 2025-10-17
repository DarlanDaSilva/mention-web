export default function Home() {
  return (
    <div
      style={{
        fontFamily: "Arial",
        textAlign: "center",
        maxWidth: 400,
        margin: "80px auto 100px auto",
        padding: "0 10px",
      }}
    >
      {/* Logo */}
      <img
        src="https://i.ibb.co/v6K2KbWY/20251016-225434-0000.png"
        alt="Mention Logo"
        style={{ width: 100, marginBottom: 10 }}
      />
      <h1 style={{ margin: 0 }}>Mention</h1>
      <p style={{ color: "#555", margin: "10px 0 20px" }}>
        Bem-vindo ao Mention! Um app para compartilhar fotos, posts e muito mais.
      </p>
      <a
        href="https://linktr.ee/DarlanDaSilvaOfc"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          backgroundColor: "#0070f3",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        📱 Baixar Mention
      </a>
      <div
        style={{
          marginTop: 30,
          fontSize: 12,
          color: "#777",
        }}
      >
        © Mention — Todos os direitos reservados
      </div>
    </div>
  );
}
