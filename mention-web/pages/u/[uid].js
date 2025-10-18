import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// 🔧 Configuração do Firebase (mantive suas credenciais)
const firebaseConfig = {
  apiKey: "AIzaSyBIMcVlRd0EOveyxu9ZWOYCeQ6CvceX3cg",
  authDomain: "mention-zstore.firebaseapp.com",
  databaseURL: "https://mention-zstore-default-rtdb.firebaseio.com/",
  projectId: "mention-zstore",
  storageBucket: "mention-zstore.firebasestorage.app",
  messagingSenderId: "602263910318",
  appId: "1:602263910318:web:5326dfc1b1e05c86dafa3f",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export default function Usuario({ userData }) {
  if (!userData) {
    return (
      <p style={{ textAlign: "center", marginTop: "60px" }}>
        Usuário não encontrado 😢
      </p>
    );
  }

  const description = userData.biografia || `@${userData.autor}`;

  return (
    <>
      {/* Meta tags para pré-visualização */}
      <Head>
        <title>{userData.nome} (@{userData.autor}) — Mention</title>
        <meta property="og:title" content={`${userData.nome} (@${userData.autor})`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={userData.foto} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${userData.nome} (@${userData.autor})`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={userData.foto} />
      </Head>

      <Header />

      <main
        style={{
          fontFamily: "Arial, sans-serif",
          maxWidth: 600,
          margin: "80px auto 120px auto",
          padding: "0 20px",
        }}
      >
        {/* Linha superior: foto à esquerda + nome/verify/usuario à direita */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 8 }}>
          <img
            src={userData.foto}
            alt="Foto do perfil"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #0070f3",
              flexShrink: 0,
            }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 22, lineHeight: 1 }}>{userData.nome}</h2>
              {userData.verify === "SIM" && (
                <img
                  src="https://i.ibb.co/cSVZ7gVY/icons8-crach-verificado-48.png"
                  alt="Verificado"
                  style={{ width: 22, height: 22 }}
                />
              )}
            </div>

            <p style={{ margin: "6px 0 8px 0", color: "#444", fontSize: 13 }}>@{userData.autor}</p>

            {/* Estatísticas abaixo do usuário (posts / seguidores / seguindo) */}
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>📸</span>
                <div>
                  <strong style={{ display: "block" }}>{userData.postnumber || 0}</strong>
                  <small style={{ color: "#555" }}>posts</small>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>👥</span>
                <div>
                  <strong style={{ display: "block" }}>{userData.seguidoresnumber || 0}</strong>
                  <small style={{ color: "#555" }}>seguidores</small>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>➡️</span>
                <div>
                  <strong style={{ display: "block" }}>{userData.seguindonumber || 0}</strong>
                  <small style={{ color: "#555" }}>seguindo</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biografia, ocupa toda largura abaixo */}
        {userData.biografia && (
          <p
            style={{
              color: "#222",
              fontSize: 15,
              lineHeight: 1.6,
              marginTop: 16,
              whiteSpace: "pre-line",
            }}
          >
            {userData.biografia}
          </p>
        )}
      </main>

      {/* Botão fixo embaixo (MENOR) + rodapé */}
      <div
        style={{
          position: "fixed",
          bottom: 10,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none", // permite clicar apenas no botão que tem pointerEvents auto
        }}
      >
        <div
          style={{
            width: "94%",
            maxWidth: 420,
            background: "#fff",
            padding: "8px 12px",
            boxShadow: "0 -4px 18px rgba(0,0,0,0.08)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            pointerEvents: "auto",
          }}
        >
          <a
            href="https://linktr.ee/DarlanDaSilvaOfc"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#0070f3",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: "600",
              fontSize: 14,
            }}
          >
            📱 Baixar Mention
          </a>

          <span style={{ fontSize: 12, color: "#666" }}>© Mention — Todos os direitos reservados</span>
        </div>
      </div>
    </>
  );
}

// 🔵 SSR — busca os dados direto no servidor (para meta tags funcionarem)
export async function getServerSideProps(context) {
  const { uid } = context.query;

  try {
    const db = getDatabase();
    const snapshot = await get(ref(db, "usuarios/" + uid));

    if (!snapshot.exists()) {
      return { props: { userData: null } };
    }

    return { props: { userData: snapshot.val() } };
  } catch (e) {
    console.error("Erro ao buscar usuário:", e);
    return { props: { userData: null } };
  }
}

// Cabeçalho simples (logo corrigida menor e alinhada à esquerda)
function Header() {
  return (
    <div
      style={{
        width: "100%",
        height: 60,
        background: "#0070f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 16px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 200,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <img
        src="https://i.ibb.co/GQK0jNx5/20251017-003813-0000.png"
        alt="Mention Logo"
        style={{ height: 28, width: "auto" }}
      />
    </div>
  );
}
