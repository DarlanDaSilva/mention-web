import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// 🔧 Configuração do Firebase
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

// 🎨 CONFIGURAÇÃO DOS TEMAS (COM SEUS ÍCONES NOVOS)
const TEMAS = {
  // --- DATAS COMEMORATIVAS ---
  natal: {
    titulo: "Feliz Natal!",
    fraseIntro: "Uma mensagem especial de",
    fundo: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000&auto=format&fit=crop')",
    corTexto: "#ffffff",
    corDestaque: "#ff3b3b",
    icone: "🎄",
    fonte: "'Mountains of Christmas', cursive",
    mensagemPadrao: "Que a magia do Natal ilumine sua vida e traga muita paz e alegria.",
    fotoPadrao: "https://img.icons8.com/color/96/christmas.png"
  },
  anonovo: {
    titulo: "Feliz Ano Novo!",
    fraseIntro: "Votos de felicidade de",
    fundo: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=1000&auto=format&fit=crop')",
    corTexto: "#ffffff",
    corDestaque: "#ffd700",
    icone: "🥂",
    fonte: "'Cinzel Decorative', cursive",
    mensagemPadrao: "Que o novo ano traga 365 novas oportunidades. Muita prosperidade!",
    fotoPadrao: "https://img.icons8.com/emoji/96/clincking-glasses.png"
  },
  aniversario: {
    titulo: "Parabéns!",
    fraseIntro: "Celebrando o dia de hoje com",
    fundo: "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.8)), url('https://images.unsplash.com/photo-1530103862676-de3c9da59af7?q=80&w=1000&auto=format&fit=crop')",
    corTexto: "#333333",
    corDestaque: "#ff0090",
    icone: "🎂",
    fonte: "'Pacifico', cursive",
    mensagemPadrao: "Hoje é o seu dia! Muitas felicidades, saúde e anos de vida.",
    fotoPadrao: "https://img.icons8.com/3d-fluency/94/birthday--v1.png"
  },

  // --- NOVOS TEMAS ---
  amor: {
    titulo: "Com Amor...",
    fraseIntro: "Com todo carinho, de",
    fundo: "linear-gradient(rgba(50,0,0,0.5), rgba(50,0,0,0.5)), url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop')",
    corTexto: "#ffffff",
    corDestaque: "#ff4d6d",
    icone: "❤️",
    fonte: "'Dancing Script', cursive",
    mensagemPadrao: "Você é especial para mim. Só queria lembrar o quanto você é importante.",
    fotoPadrao: "https://img.icons8.com/external-colorful-filled-outline-dmitry-mirolyubov/88/external-amor-love-and-wedding-colorful-filled-outline-dmitry-mirolyubov.png"
  },
  biblico: {
    titulo: "Benção Diária",
    fraseIntro: "Uma palavra de fé de",
    fundo: "linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.6)), url('https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=1000&auto=format&fit=crop')",
    corTexto: "#2c3e50",
    corDestaque: "#3498db",
    icone: "🙏",
    fonte: "'Merriweather', serif",
    mensagemPadrao: "Que o Senhor te abençoe e te guarde; que Ele faça resplandecer o Seu rosto sobre ti.",
    fotoPadrao: "https://img.icons8.com/color/96/ark-of-the-covenant.png"
  },
  motivacao: {
    titulo: "Você Consegue!",
    fraseIntro: "Um incentivo de",
    fundo: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?q=80&w=1000&auto=format&fit=crop')",
    corTexto: "#ffffff",
    corDestaque: "#00e676",
    icone: "🚀",
    fonte: "'Oswald', sans-serif",
    mensagemPadrao: "Acredite no seu potencial. Grandes coisas estão por vir se você não desistir.",
    fotoPadrao: "https://img.icons8.com/external-jumpicon-solid-gradient-ayub-irawan/64/external-Motivation-crisis-management-jumpicon-(solid-gradient)-jumpicon-solid-gradient-ayub-irawan.png"
  },
  neon: {
    titulo: "Vibe Boa",
    fraseIntro: "Enviado por",
    fundo: "linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)",
    corTexto: "#ffffff",
    corDestaque: "#fff",
    icone: "⚡",
    fonte: "'Righteous', cursive",
    mensagemPadrao: "Só passando para deixar uma energia positiva no seu dia!",
    fotoPadrao: "https://img.icons8.com/nolan/96/vaporwave.png"
  },
  padrao: {
    titulo: "Olá!",
    fraseIntro: "De:",
    fundo: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    corTexto: "#333333",
    corDestaque: "#007bff",
    icone: "✨",
    fonte: "sans-serif",
    mensagemPadrao: "Uma mensagem especial para você.",
    fotoPadrao: "https://img.icons8.com/nolan/96/user-default.png"
  }
};

export default function PerfilVizbio({ perfil }) {
  
  if (!perfil) return <h1 style={{textAlign:'center', marginTop: 50}}>Link não encontrado</h1>;

  const chaveTema = perfil.tema ? perfil.tema.toLowerCase() : 'padrao';
  const tema = TEMAS[chaveTema] || TEMAS['padrao'];
  const mensagemFinal = perfil.mensagem || tema.mensagemPadrao;

  return (
    <>
      <Head>
        <title>{tema.titulo} - {perfil.nome}</title>
        <meta name="description" content={`Mensagem de ${perfil.nome}`} />
        <meta property="og:title" content={`${tema.titulo} De: ${perfil.nome}`} />
        <meta property="og:description" content={mensagemFinal} />
        {/* Usa a imagem escolhida ou a padrão do tema para o compartilhamento também */}
        <meta property="og:image" content={perfil.fotoUrl || tema.fotoPadrao} />
        
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Dancing+Script:wght@700&family=Merriweather:wght@700&family=Mountains+of+Christmas:wght@700&family=Oswald:wght@700&family=Pacifico&family=Righteous&display=swap" rel="stylesheet" />
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

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '40px 30px',
          borderRadius: '24px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          color: tema.corTexto
        }}>
          
          {/* Frase de Introdução */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            marginBottom: 25 
          }}>
             <span style={{ 
               fontSize: '1rem', 
               textTransform: 'uppercase', 
               letterSpacing: '1px', 
               opacity: 0.9 
             }}>
               {tema.fraseIntro}
             </span>

             <strong style={{ 
               fontSize: '1.2rem', 
               borderBottom: `2px solid ${tema.corDestaque}`,
               paddingBottom: '2px'
             }}>
               {perfil.nome}
             </strong>
          </div>

          {/* Foto ou Ícone do Tema */}
          <div style={{ marginBottom: 10 }}>
             <img 
              src={perfil.fotoUrl || tema.fotoPadrao} 
              alt={perfil.nome}
              style={{ 
                width: 100, 
                height: 100, 
                borderRadius: '50%', 
                objectFit: 'cover', // Ajusta bem se for foto
                backgroundColor: '#fff', // Fundo branco para os ícones ficarem visíveis
                border: `4px solid ${tema.corDestaque}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                padding: perfil.fotoUrl ? '0' : '10px' // Se for ícone, dá um respiro interno
              }}
            />
          </div>

          {/* Ícone Decorativo Extra */}
          <div style={{ fontSize: '3rem', margin: '10px 0' }}>
            {tema.icone}
          </div>
          
          {/* Título */}
          <h1 style={{ 
            fontFamily: tema.fonte, 
            fontSize: '2.8rem', 
            margin: '0 0 20px 0',
            color: tema.corDestaque,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            lineHeight: '1.1'
          }}>
            {tema.titulo}
          </h1>

          {/* Mensagem */}
          <p style={{ 
            fontSize: '1.4rem', 
            lineHeight: '1.6',
            fontWeight: '500',
            fontStyle: 'italic',
            opacity: 0.95
          }}>
            "{mensagemFinal}"
          </p>

          <div style={{ marginTop: 40, fontSize: '0.7rem', opacity: 0.6, letterSpacing: '1px' }}>
            CRIADO COM VIZBIO
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
