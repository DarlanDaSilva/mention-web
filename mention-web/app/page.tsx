"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// 🔧 Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBIMcVlRd0EOveyxu9ZWOYCeQ6CvceX3cg",
  authDomain: "mention-zstore.firebaseapp.com",
  databaseURL: "https://mention-zstore-default-rtdb.firebaseio.com", // ✅ sem barra no final
  projectId: "mention-zstore",
  storageBucket: "mention-zstore.firebasestorage.app",
  messagingSenderId: "602263910318",
  appId: "1:602263910318:web:5326dfc1b1e05c86dafa3f",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🕒 Função para formatar tempo
function formatarTempo(timestamp: number | string) {
  if (!timestamp) return "";
  const agora = new Date();
  const data = new Date(timestamp);
  const diff = agora.getTime() - data.getTime();

  const segundos = Math.floor(diff / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (segundos < 60) return `${segundos}s`;
  if (minutos < 60) return `${minutos}m`;
  if (horas < 24) return `${horas}h`;

  if (dias === 1)
    return `Ontem às ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

  if (dias < 7) return `${dias}d`;

  return `${data.toLocaleDateString("pt-BR")} às ${data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [usuarios, setUsuarios] = useState({});

  useEffect(() => {
    const carregarPosts = async () => {
      const refPosts = ref(db, "publicacoes");
      const snapPosts = await get(refPosts);

      if (snapPosts.exists()) {
        const postsData = snapPosts.val();
        const lista = Object.entries(postsData).map(([id, dados]) => ({
          id,
          ...dados,
        }));
        setPosts(lista.reverse()); // Exibir mais recentes primeiro

        // Buscar dados dos autores
        const usuariosTemp = {};
        for (const p of lista) {
          if (p.autor && !usuariosTemp[p.autor]) {
            const refAutor = ref(db, `usuarios/${p.autor}`);
            const snapAutor = await get(refAutor);
            if (snapAutor.exists()) usuariosTemp[p.autor] = snapAutor.val();
          }
        }
        setUsuarios(usuariosTemp);
      }
    };

    carregarPosts();
  }, []);

  return (
    <>
      <Head>
        <title>Mention - Feed</title>
        <meta name="description" content="Veja as postagens recentes do Mention" />
      </Head>

      {/* 🔷 Header */}
      <header
        style={{
          background: "#007bff",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          justifyContent: "space-between",
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

        <a
          href="https://mention-web.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <img
            src="https://img.icons8.com/pulsar-line/48/FFFFFF/download.png"
            alt="Download"
            style={{ width: 28, height: 28 }}
          />
        </a>
      </header>

      {/* 📰 Lista de Postagens */}
      <main style={{ padding: 20, background: "#f7f7f7", minHeight: "100vh" }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>Carregando publicações...</p>
        ) : (
          posts.map((post) => {
            const autor = usuarios[post.autor];
            const imagens = [post.foto, post.foto2, post.foto3].filter(Boolean);

            return (
              <div
                key={post.id}
                style={{
                  maxWidth: 600,
                  margin: "0 auto 20px",
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                {/* Autor */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
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

                {/* Imagens (rolagem lateral) */}
                {imagens.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      overflowX: "auto",
                      scrollSnapType: "x mandatory",
                    }}
                  >
                    {imagens.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Imagem ${i + 1}`}
                        style={{
                          width: "100%",
                          height: 400,
                          objectFit: "cover",
                          flexShrink: 0,
                          scrollSnapAlign: "center",
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Texto */}
                <p style={{ padding: "10px 16px", textAlign: "left", fontSize: 15 }}>
                  {post.mensagem}
                </p>

                {/* Tempo */}
                <div
                  style={{
                    padding: "0 16px 10px",
                    textAlign: "left",
                    fontSize: 13,
                    color: "#888",
                  }}
                >
                  {formatarTempo(post.timestamp)}
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
                    src="https://img.icons8.com/ios/50/FFFFFF/chat-message--v1.png"
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
            );
          })
        )}
      </main>

      {/* ⚪ Rodapé */}
      <footer style={{ textAlign: "center", padding: "16px 0", color: "#888", fontSize: 14 }}>
        © Mention
      </footer>
    </>
  );
}
