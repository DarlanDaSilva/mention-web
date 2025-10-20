import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// 🔧 Firebase Config
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

// 🔹 Formatar data
function formatarData(timestamp) {
  if (!timestamp) return "";
  const data = new Date(timestamp);
  const agora = new Date();
  const ontem = new Date();
  ontem.setDate(agora.getDate() - 1);

  const hora = data.getHours().toString().padStart(2, "0");
  const min = data.getMinutes().toString().padStart(2, "0");

  const mesmaData = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (mesmaData(data, agora)) return `Hoje às ${hora}:${min}`;
  if (mesmaData(data, ontem)) return `Ontem às ${hora}:${min}`;
  return `${data.getDate().toString().padStart(2, "0")}/${(
    data.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${data.getFullYear()} às ${hora}:${min}`;
}

export default function Post({ post, autor }) {
  if (!post) {
    return (
      <p style={{ textAlign: "center", marginTop: "60px" }}>
        Publicação não encontrada 😢
      </p>
    );
  }

  const dataFormatada = formatarData(post.timestamp);

  return (
    <>
      <Head>
        <title>
          {autor?.nome ? `${autor.nome} — Mention` : "Publicação — Mention"}
        </title>
        <meta property="og:title" content={`${autor?.nome || "Mention"}`} />
        <meta property="og:description" content={post.mensagem || ""} />
        <meta property="og:image" content={post.foto} />
        <meta property="og:type" content="article" />
      </Head>

      <Header />

      <div
        style={{
          fontFamily: "Arial",
          maxWidth: 500,
          margin: "80px auto 120px",
          backgroundColor: "#fff",
          padding: "0 15px",
        }}
      >
        {/* 🔹 Cabeçalho da postagem */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <img
            src={autor?.foto}
            alt="Foto do autor"
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: 10,
              border: "2px solid #0070f3",
            }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <strong style={{ fontSize: 15 }}>{autor?.nome}</strong>
              {autor?.verify === "SIM" && (
                <img
                  src="https://i.ibb.co/cSVZ7gVY/icons8-crach-verificado-48.png"
                  alt="Verificado"
                  style={{ width: 16, height: 16 }}
                />
              )}
            </div>
            <span style={{ color: "#555", fontSize: 13 }}>{dataFormatada}</span>
          </div>
        </div>

        {/* 🔹 Mensagem */}
        {post.mensagem && (
          <p
            style={{
              color: "#333",
              fontSize: 15,
              marginBottom: 10,
              whiteSpace: "pre-line",
            }}
          >
            {post.mensagem}
          </p>
        )}

        {/* 🔹 Imagem */}
        {post.foto && (
          <img
            src={post.foto}
            alt="Publicação"
            style={{
              width: "100%",
              borderRadius: 12,
              objectFit: "cover",
              marginBottom: 10,
            }}
          />
        )}

        {/* 🔹 Botão de comentários */}
        <div
          style={{
            borderTop: "1px solid #ddd",
            paddingTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            color: "#0070f3",
            fontWeight: "bold",
          }}
        >
          <img
            src="https://i.ibb.co/8dDyb4V/icons8-comments-48.png"
            alt="Comentários"
            style={{ width: 20, height: 20 }}
          />
          Ver comentários
        </div>
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

// 🔹 Server-side data fetch
export async function getServerSideProps(context) {
  const { postid } = context.query;

  try {
    const db = getDatabase();
    const postSnap = await get(ref(db, "publicacoes/" + postid));

    if (!postSnap.exists()) return { props: { post: null } };

    const post = postSnap.val();
    let autorData = null;

    if (post.autor) {
      const autorSnap = await get(ref(db, "usuarios/" + post.autor));
      if (autorSnap.exists()) autorData = autorSnap.val();
    }

    return { props: { post, autor: autorData } };
  } catch (e) {
    console.error(e);
    return { props: { post: null } };
  }
}

// 🔹 Cabeçalho igual ao de usuários
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
      <span style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
        Mention
      </span>
    </div>
  );
}
