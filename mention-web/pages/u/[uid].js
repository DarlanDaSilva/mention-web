import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// 🔧 Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBIMcVlRd0EOveyxu9ZWOYCeQ6CvceX3cg",
  authDomain: "mention-zstore.firebaseapp.com",
  databaseURL: "https://mention-zstore-default-rtdb.firebaseio.com/",
  projectId: "mention-zstore",
  storageBucket: "mention-zstore.firebasestorage.app",
  messagingSenderId: "602263910318",
  appId: "1:602263910318:web:5326dfc1b1e05c86dafa3f",
};

// Evita inicialização duplicada
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
          maxWidth: 420,
          margin: "80px auto 100px auto",
          padding: "0 15px",
        }}
      >
        {/* 🔹 Layout: foto + dados lado a lado */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            marginBottom: 20,
          }}
        >
          <img
            src={userData.foto}
            alt="Foto do perfil"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #0070f3",
            }}
          />

          <div style={{ flex: 1 }}>
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                margin: 0,
                fontSize: 18,
              }}
            >
              {userData.nome}
              {userData.verify === "SIM" && (
                <img
                  src="https://i.ibb.co/cSVZ7gVY/icons8-crach-verificado-48.png"
                  alt="Verificado"
                  style={{ width: 18, height: 18 }}
                />
              )}
            </h2>

            <p
              style={{
                color: "#555",
                fontSize: 14,
                margin: "4px 0 10px 0",
              }}
            >
              @{userData.autor}
            </p>

            {/* 🔹 Estatísticas (sem “seguindo”) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "90%",
                background: "#f5f5f5",
                padding: "6px 10px",
                borderRadius: 8,
              }}
            >
              <div style={{ textAlign: "center", flex: 1 }}>
                <strong>{userData.postnumber}</strong>
                <p style={{ margin: 0, fontSize: 12 }}>Postagens</p>
              </div>
              <div style={{ textAlign: "center", flex: 1 }}>
                <strong>{userData.seguidoresnumber}</strong>
                <p style={{ margin: 0, fontSize: 12 }}>Seguidores</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Biografia */}
        {userData.biografia && (
          <p
            style={{
              color: "#444",
              fontSize: 14,
              lineHeight: 1.5,
              marginTop: 10,
            }}
          >
            {userData.biografia}
          </p>
        )}
      </div>

      {/* 🔹 Rodapé fixo */}
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
          gap: 6,
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
            padding: "8px 18px",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 14,
            width: "70%",
            textAlign: "center",
          }}
        >
          📱 Baixar Mention
        </a>
        <span style={{ fontSize: 11, color: "#777" }}>
          © Mention — Todos os direitos reservados
        </span>
      </div>
    </>
  );
}

// 🔵 SSR — busca dados direto do servidor (para preview em redes sociais)
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

// 🔹 Cabeçalho (logo + texto Mention)
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
        gap: 10,
        padding: "0 20px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src="https://i.ibb.co/v6K2KbWY/20251016-225434-0000.png"
        alt="Mention Logo"
        style={{ height: 34 }}
      />
      <span style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Mention</span>
    </div>
  );
}
