import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { initializeApp } from "firebase/app";
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Usuario() {
  const router = useRouter();
  const { uid } = router.query;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const userRef = ref(db, "usuarios/" + uid);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        setUserData("notfound");
      }
    });
  }, [uid]);

  if (!uid || userData === null) {
    return <p style={{ textAlign: "center", marginTop: "60px" }}>Carregando...</p>;
  }

  if (userData === "notfound") {
    return (
      <>
        <Header />
        <h2 style={{ textAlign: "center", marginTop: "80px" }}>
          Usuário não encontrado 😢
        </h2>
      </>
    );
  }

  const description = userData.biografia || `@${userData.autor}`;

  return (
    <>
      {/* 🔹 Meta tags para pré-visualização */}
      <Head>
        <title>{userData.nome} (@{userData.autor}) — Mention</title>
        <meta property="og:title" content={userData.nome} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={userData.foto} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={userData.nome} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={userData.foto} />
      </Head>

      <Header />

      <div
        style={{
          fontFamily: "Arial",
          maxWidth: 400,
          margin: "80px auto 100px auto", // espaço para o botão fixo
          textAlign: "center",
          padding: "0 10px",
        }}
      >
        {/* Foto do usuário */}
        <img
          src={userData.foto}
          alt="Foto do perfil"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 10,
            border: "3px solid #0070f3",
          }}
        />

        {/* Nome e verificação */}
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {userData.nome}
          {userData.verify === "SIM" && (
            <img
              src="https://i.ibb.co/cSVZ7gVY/icons8-crach-verificado-48.png"
              alt="Verificado"
              style={{ width: 20, height: 20 }}
            />
          )}
        </h2>

        {/* Usuário */}
        <h3 style={{ margin: "5px 0", color: "#444", fontSize: 14 }}>@{userData.autor}</h3>

        {/* Biografia */}
        {userData.biografia && <p style={{ color: "#555", margin: "10px 0 20px" }}>{userData.biografia}</p>}

        {/* Estatísticas */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            background: "#f3f3f3",
            padding: 10,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <div>
            <strong>{userData.postnumber}</strong>
            <p style={{ margin: 0 }}>Postagens</p>
          </div>
          <div>
            <strong>{userData.seguidoresnumber}</strong>
            <p style={{ margin: 0 }}>Seguidores</p>
          </div>
          <div>
            <strong>{userData.seguindonumber}</strong>
            <p style={{ margin: 0 }}>Seguindo</p>
          </div>
        </div>
      </div>

      {/* Botão fixo embaixo */}
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

// 🔵 Cabeçalho fixo
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
        padding: "0 15px",
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
