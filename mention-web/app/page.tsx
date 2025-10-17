export default function Home() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "80px 20px 120px 20px", // espaço embaixo para botão fixo
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      {/* Logo centralizada */}
      <img
        src="https://i.ibb.co/GQK0jNx5/20251017-003813-0000.png"
        alt="Mention Logo"
        style={{ width: 150, margin: "0 auto 20px auto", display: "block" }}
      />

      {/* Descrição */}
      <p style={{ color: "#555", fontSize: 16, lineHeight: "1.6", marginBottom: 20 }}>
        <strong>Mention</strong> — compartilhe fotos, momentos e histórias com o mundo.
      </p>
      <p style={{ color: "#555", fontSize: 14, lineHeight: "1.6" }}>
        O Mention é uma rede social feita para quem gosta de ser visto e interagir. 
        Compartilhe suas melhores fotos, receba comentários, curta momentos e mostre seu estilo. 
        Um espaço leve, divertido e cheio de conexões reais, onde cada publicação é uma nova oportunidade de chamar atenção e brilhar.
      </p>

      {/* Botão e rodapé fixos */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "#fff",
          padding: 10,
          boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
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
            width: "90%",
            textAlign: "center",
          }}
        >
          📱 Baixar Mention
        </a>
        <span style={{ fontSize: 12, color: "#777" }}>© Mention — Todos os direitos reservados</span>
      </div>
    </div>
  );
}
