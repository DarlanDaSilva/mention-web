import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// 🔧 Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBIMcVlRd0EOveyxu9ZWOYCeQ6CvceX3cg",
  authDomain: "mention-zstore.firebaseapp.com",
  databaseURL: "https://mention-zstore-default-rtdb.firebaseio.com",
  projectId: "mention-zstore",
  storageBucket: "mention-zstore.firebasestorage.app",
  messagingSenderId: "602263910318",
  appId: "1:602263910318:web:5326dfc1b1e05c86dafa3f",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Postagem() {
  const router = useRouter();
  const { postid } = router.query;
  const [post, setPost] = useState(null);
  const [autor, setAutor] = useState(null);

  useEffect(() => {
    if (!postid) return;

    const fetchData = async () => {
      const postRef = ref(db, `publicacoes/${postid}`);
      const snapshot = await get(postRef);
      if (snapshot.exists()) {
        const postData = snapshot.val();
        setPost(postData);

        if (postData.autor) {
          const autorRef = ref(db, `usuarios/${postData.autor}`);
          const autorSnap = await get(autorRef);
          if (autorSnap.exists()) {
            setAutor(autorSnap.val());
          }
        }
      }
    };

    fetchData();
  }, [postid]);

  function formatarData(timestamp: number | string) {
    const data = new Date(timestamp);
    const agora = new Date();
    const diff = agora - data;
    const umDia = 24 * 60 * 60 * 1000;

    if (diff < umDia && data.getDate() === agora.getDate())
      return `Hoje às ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    if (diff < 2 * umDia && data.getDate() === agora.getDate() - 1)
      return `Ontem às ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

    return `${data.toLocaleDateString("pt-BR")} às ${data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return (
    <>
      <Head>
        <title>{autor ? `${autor.nome} no Mention` : "Publicação | Mention"}</title>
        <meta name="description" content={post?.mensagem || "Veja esta publicação no Mention"} />
        <meta
          property="og:title"
          content={autor ? `${autor.nome} no Mention` : "Publicação no Mention"}
        />
        <meta property="og:description" content={post?.mensagem || ""} />
        <meta
          property="og:image"
          content={post?.foto || "https://i.ibb.co/v6K2KbWY/20251016-225434-0000.png"}
        />
        <meta property="og:url" content={`https://mention-web.vercel.app/p/${postid}`} />
        <meta property="og:type" content="article" />
      </Head>

      {/* 🔷 Header */}
      <header
        style={{
          background: "#007bff",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src="https://i.ibb.co/v6K2KbWY/20251016-225434-0000.png"
            alt="Mention Logo"
            style={{ width: 28, height: 28 }}
          />
          <h1 style={{ fontSize: 18, margin: 0, fontWeight: "bold" }}>Mention</h1>
        </div>

        {/* 🔽 Botão Download */}
        <a
          href="https://mention-web.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.6)",
            transition: "all 0.2s ease",
          }}
        >
          <img
            src="https://img.icons8.com/pulsar-line/48/FFFFFF/download.png"
            alt="Download"
            style={{ width: 22, height: 22 }}
          />
        </a>
      </header>

      {/* 📸 Conteúdo */}
      <main style={{ padding: 20, textAlign: "center" }}>
        {post ? (
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* Autor */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
              }}
            >
              <img
                src={autor?.foto || "https://i.ibb.co/3c1vKJk/default-avatar.png"}
                alt={autor?.nome}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ textAlign: "left" }}>
                <strong style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {autor?.nome || "Usuário"}
                  {autor?.verify && (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_Verified_Badge.svg"
                      alt="Verificado"
                      style={{ width: 16, height: 16 }}
                    />
                  )}
                </strong>
                <span style={{ fontSize: 13, color: "#555" }}>@{post.autor}</span>
              </div>
            </div>

            {/* 📷 Carrossel de fotos */}
            {(() => {
              const fotosValidas = [];
              if (post.foto && post.foto.trim() !== "") fotosValidas.push(post.foto);
              if (post.foto2 && post.foto2.trim() !== "") fotosValidas.push(post.foto2);
              if (post.foto3 && post.foto3.trim() !== "") fotosValidas.push(post.foto3);

              if (fotosValidas.length === 0) return null;

              return (
                <div
                  style={{
                    display: "flex",
                    overflowX: fotosValidas.length > 1 ? "auto" : "hidden",
                    scrollSnapType: fotosValidas.length > 1 ? "x mandatory" : "none",
                    gap: 4,
                    borderRadius: 12,
                  }}
                >
                  {fotosValidas.map((fotoUrl, i) => (
                    <img
                      key={i}
                      src={fotoUrl}
                      alt={`Foto ${i + 1}`}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        flexShrink: 0,
                        objectFit: "cover",
                        borderRadius: 12,
                        scrollSnapAlign: "center",
                      }}
                    />
                  ))}
                </div>
              );
            })()}

            {/* Texto */}
            <p
              style={{
                padding: "10px 16px",
                textAlign: "left",
                fontSize: 15,
              }}
            >
              {post.mensagem}
            </p>

            {/* Data */}
            <div
              style={{
                padding: "0 16px 10px",
                textAlign: "left",
                fontSize: 13,
                color: "#888",
              }}
            >
              {formatarData(post.timestamp)}
            </div>

            {/* 💬 Comentários */}
            <a
              href="https://mention-web.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px 0",
                borderTop: "1px solid #eee",
                textDecoration: "none",
                color: "#007bff",
              }}
            >
              <img
                src="https://img.icons8.com/color/48/speech-bubble-with-dots.png"
                alt="Comentários"
                style={{
                  width: 20,
                  height: 20,
                  filter:
                    "invert(36%) sepia(85%) saturate(2479%) hue-rotate(201deg) brightness(93%) contrast(90%)",
                }}
              />
              <span style={{ fontSize: 15, fontWeight: 500 }}>Ver comentários</span>
            </a>
          </div>
        ) : (
          <p>Carregando publicação...</p>
        )}
      </main>

      {/* ⚪ Rodapé */}
      <footer
        style={{
          textAlign: "center",
          padding: "16px 0",
          color: "#888",
          fontSize: 14,
        }}
      >
        © Mention
      </footer>
    </>
  );
                      }
