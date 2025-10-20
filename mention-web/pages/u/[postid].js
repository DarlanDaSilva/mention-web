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

// 🔹 Função para formatar timestamp
function formatarData(timestamp) {
  if (!timestamp) return "";
  const data = new Date(timestamp);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);

  const ehHoje =
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear();

  const ehOntem =
    data.getDate() === ontem.getDate() &&
    data.getMonth() === ontem.getMonth() &&
    data.getFullYear() === ontem.getFullYear();

  const horas = data.getHours().toString().padStart(2, "0");
  const minutos = data.getMinutes().toString().padStart(2, "0");

  if (ehHoje) return `hoje às ${horas}:${minutos}`;
  if (ehOntem) return `ontem às ${horas}:${minutos}`;
  return `${data.getDate().toString().padStart(2, "0")}/${(
    data.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${data.getFullYear()} às ${horas}:${minutos}`;
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
  const description = post.mensagem || "Veja esta publicação no Mention.";

  return (
    <>
      <Head>
        <title>
          {autor?.nome ? `${autor.nome} no Mention` : "Publicação — Mention"}
        </title>
        <meta property="og:title" content={`${autor?.nome || "Mention"}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={post.foto} />
        <meta property="og:type" content="article" />
      </Head>

      <Header />

      <div
        style={{
          fontFamily: "Arial",
          maxWidth: 500,
          margin: "80px auto 100px",
          padding: "0 15px",
        }}
      >
        {/* 🔹 Autor */}
        {autor && (
          <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
            <img
              src={autor.foto}
              alt="Foto do autor"
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: 10,
                border: "2px solid #0070f3",
              }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <strong>{autor.nome}</strong>
                {autor.verify === "SIM" && (
                  <img
                    src="https://i.ibb.co/cSVZ7gVY/icons8-crach-verificado-48.png"
                    alt="Verificado"
                    style={{ width: 18, height: 18 }}
                  />
                )}
              </div>
              <span style={{ color: "#555", fontSize: 13 }}>@{autor.autor}</span>
            </div>
          </div>
        )}

        {/* 🔹 Mensagem */}
        {post.mensagem && (
          <p style={{ color: "#333", marginBottom: 15 }}>{post.mensagem}</p>
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

        <p style={{ fontSize: 13, color: "#666" }}>{dataFormatada}</p>
      </div>

      {/* 🔹 Rodapé */}
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

// 🔹 Busca dados do servidor (SSR)
export async function getServerSideProps(context) {
  const { postid } = context.query;
  try {
    const db = getDatabase();
    const postSnap = await get(ref(db, "publicacoes/" + postid));

    if (!postSnap.exists()) return { props: { post: null } };

    const post = postSnap.val();

    // Buscar dados do autor
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

// 🔹 Cabeçalho (igual ao de usuários)
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
