import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// 🔧 Configuração do seu Firebase
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

  return (
    <>
      <Header />
      <div
        style={{
          fontFamily: "Arial",
          maxWidth: 400,
          margin: "80px auto 30px auto",
          textAlign: "center",
          padding: "0 10px",
        }}
      >
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

        <h3 style={{ margin: "5px 0", color: "#444" }}>@{userData.autor}</h3>

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
            <span style={{ color: "#0070f3", fontSize: 20 }}>✔️</span>
          )}
        </h2>

        <p style={{ color: "#555", margin: "10px 0 20px" }}>{userData.biografia}</p>

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
      </div>
    </>
  );
}

// 🔵 Cabeçalho fixo Mention
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
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src="https://i.ibb.co/93HK9JWG/20251015-223753-0000.png"
        alt="Mention Logo"
        style={{ height: 34, marginRight: 10 }}
      />
      <span style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Mention</span>
    </div>
  );
}


