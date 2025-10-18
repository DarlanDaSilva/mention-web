import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// 🔧 Configuração do Firebase
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
      {/* 🔹 Meta tags para pré-visualização */}
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

      <div
        style={{
          fontFamily: "Arial",
          maxWidth: 500,
          margin: "80px auto 100px auto",
          padding: "0 20px",
        }}
      >
        {/* 📸 Foto + Nome + @usuario */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            marginBottom: 15,
          }}
        >
          <img
            src={userData.foto}
            alt="Foto do perfil"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #0070f3",
            }}
          />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20 }}>{userData.nome}</h2>
              {userData.verify === "SIM" && (
                <img
                  src="https://i.ibb.co/cSVZ7gVY/icons8-crach-verificado-48.png"
                  alt="Verificado"
                  style={{ width: 20, height: 20 }}
                />
              )}
            </div>
            <p style={{ color: "#666", margin: "3px 0", fontSize: 14 }}>
              @{userData.autor}
            </p>
          </div>
        </div>

        {/* 📊 Estatísticas */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 25,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>📸</span>
            <strong>{userData.postnumber || 0}</strong>
            <span style={{ color: "#555" }}>posts</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>👥</span>
            <strong>{userData.seguidoresnumber || 0}</strong>
            <span style={{ color: "#555" }}>seguidores</span>
          </div>
        </div>

        {/* 📝 Biografia */}
        {userData.biografia && (
          <p
            style={{
              color: "#222",
              lineHeight: 1.5,
              fontSize: 15,
              whiteSpace: "pre-line",
            }}
          >
            {userData.biografia}
          </p>
        )}
      </div>

      {/* ⚙️ Rodapé fixo */}
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
        <span style={{ fontSize: 12, color: "#777" }}>
          © Mention — Todos os direitos reservados
        </span>
      </div>
    </>
  );
}

// 🔵 SSR — Busca os dados direto do servidor
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
    console.error(e);
    return { props: { userData: null } };
  }
}

// 🔹 Cabeçalho
function Header() {
  return (
    <div
      style={{
        width: "100%",
        height: 60,
        background: "#0070f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 15px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src="https://i.ibb.co/GQK0jNx5/20251017-003813-0000.png"
        alt="Mention Logo"
        style={{ height: 34 }}
      />
    </div>
  );
              }
