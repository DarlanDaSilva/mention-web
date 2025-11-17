import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// 🔧 Configuração do Firebase (Igual ao anterior)
const firebaseConfig = {
  apiKey: "AIzaSyBIMcVlRd0EOveyxu9ZWOYCeQ6CvceX3cg",
  authDomain: "mention-zstore.firebaseapp.com",
  databaseURL: "https://mention-zstore-default-rtdb.firebaseio.com",
  projectId: "mention-zstore",
  storageBucket: "mention-zstore.firebasestorage.app",
  messagingSenderId: "602263910318",
  appId: "1:602263910318:web:5326dfc1b1e05c86dafa3f",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getDatabase(app);

// 🎨 CONFIGURAÇÃO DOS TEMAS
// Aqui definimos as cores e fundos para cada chave do Firebase
const TEMAS = {
  natal: {
    titulo: "Feliz Natal!",
    fundo: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000&auto=format&fit=crop')", // Fundo de Natal
    corTexto: "#ffffff",
    corDestaque: "#ff3b3b", // Vermelho
    icone: "🎄",
    fonte: "'Mountains of Christmas', cursive", // Fonte especial
    mensagemPadrao: "Que a magia do Natal ilumine sua vida e traga muita paz e alegria para você e sua família."
  },
  anonovo: {
    titulo: "Feliz Ano Novo!",
    fundo: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=1000&auto=format&fit=crop')", // Fogos
    corTexto: "#ffffff",
    corDestaque: "#ffd700", // Dourado
    icone: "🥂",
    fonte: "'Cinzel Decorative', cursive",
    mensagemPadrao: "Que o novo ano traga 365 novas oportunidades de ser feliz. Muita prosperidade!"
  },
  aniversario: {
    titulo: "Parabéns!",
    fundo: "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.8)), url('https://images.unsplash.com/photo-1530103862676-de3c9da59af7?q=80&w=1000&auto=format&fit=crop')", // Balões
    corTexto: "#333333",
    corDestaque: "#ff0090", // Rosa choque
    icone: "🎂",
    fonte: "'Pacifico', cursive",
    mensagemPadrao: "Hoje é um dia especial! Desejo muitas felicidades, saúde e anos de vida."
  },
  padrao: {
    titulo: "Olá!",
    fundo: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    corTexto: "#333333",
    corDestaque: "#007bff", // Azul
    icone: "✨",
    fonte: "sans-serif",
    mensagemPadrao: "Uma mensagem especial para você."
  }
};

export default function PerfilVizbio({ perfil }) {
  
  if (!perfil) return <h1 style={{textAlign:'center', marginTop: 50}}>Link não encontrado</h1>;

  // 1. Identifica o tema (se não tiver no firebase, usa o 'padrao')
  // Normaliza para minúsculo para evitar erro (Natal vs natal)
  const chaveTema = perfil.tema ? perfil.tema.toLowerCase() : 'padrao';
  const tema = TEMAS[chaveTema] || TEMAS['padrao'];

  // 2. Decide qual mensagem mostrar (do Firebase ou a padrão do tema)
  const mensagemFinal = perfil.mensagem || tema.mensagemPadrao;

  return (
    <>
      <Head>
        <title>{tema.titulo} - {perfil.nome}</title>
        <meta name="description" content={`Mensagem de ${perfil.nome}`} />
        <meta property="og:title" content={`${tema.titulo} De: ${perfil.nome}`} />
        <meta property="og:description" content={mensagemFinal} />
        <meta property="og:image" content={perfil.fotoUrl || "https://i.ibb.co/v6K2KbWY/20251016-225434-0000.png"} />
        
        {/* Importando fontes bonitas do Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Mountains+of+Christmas:wght@700&family=Pacifico&display=swap" rel="stylesheet" />
      </Head>

      <main style={{ 
        minHeight: '100vh',
        background: tema.fundo,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: 'sans-serif'
      }}>

        {/* Cartão com efeito de vidro (Glassmorphism) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)', // Transparente
          backdropFilter: 'blur(10px)', // Desfoque atrás
          WebkitBackdropFilter: 'blur(10px)',
          padding: '40px 30px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          color: tema.corTexto
        }}>
          
          {/* Foto do Usuário */}
          <div style={{ marginBottom: 15 }}>
            <img 
              src={perfil.fotoUrl || "https://i.ibb.co/3c1vKJk/default-avatar.png"} 
              alt={perfil.nome}
              style={{ 
                width: 90, 
                height: 90, 
                borderRadius: '50%', 
                objectFit: 'cover', 
                border: `4px solid ${tema.corDestaque}`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            />
          </div>
          
          {/* Nome */}
          <h2 style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>
            {perfil.nome} lhe enviou:
          </h2>

          <hr style={{ border: 0, borderTop: `1px solid ${tema.corTexto}`, opacity: 0.3, margin: '20px 0' }} />

          {/* Título do Tema e Ícone */}
          <div style={{ fontSize: '3rem', marginBottom: 10 }}>
            {tema.icone}
          </div>
          <h1 style={{ 
            fontFamily: tema.fonte, 
            fontSize: '2.5rem', 
            margin: '0 0 20px 0',
            color: tema.corDestaque,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            {tema.titulo}
          </h1>

          {/* Mensagem */}
          <p style={{ 
            fontSize: '1.3rem', 
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            "{mensagemFinal}"
          </p>

          <div style={{ marginTop: 30, fontSize: '0.8rem', opacity: 0.7 }}>
            Criado com Vizbio
          </div>

        </div>

      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { mid } = context.params;
  let perfilData = null;

  try {
    const perfilRef = ref(db, `mensagens/${mid}`);
    const snapshot = await get(perfilRef);
    if (snapshot.exists()) perfilData = snapshot.val();
  } catch (error) {
    console.error("Erro Firebase:", error);
  }

  return {
    props: { perfil: perfilData },
  };
            }
