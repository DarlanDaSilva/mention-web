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

// =======================================================
// ⬇️ COMPONENTE DE NEVE (ADICIONADO) ⬇️
// =======================================================

const Snowfall = () => (
    <>
      {/* O style JSX é necessário para definir animações globais dentro do Next.js */}
      <style jsx global>{`
        /* Definição da animação de queda da neve */
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
        
        /* Definição do brilho da neve */
        @keyframes fade {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* O div.snow é a neve real. Usamos box-shadow para criar dezenas de flocos. */
        .snow-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none; /* Garante que a neve não atrapalhe a interação */
          z-index: 5; /* Garante que a neve fique sobre o fundo, mas abaixo do cartão */
        }
        
        .snow {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #ffffff;
          border-radius: 50%;
          opacity: 0.9;
          animation: 
            fall 15s linear infinite,
            fade 5s ease-in-out infinite alternate;
          
          /* Cria a ilusão de dezenas de flocos usando múltiplas sombras */
          box-shadow: 
            /* flocos pequenos e rápidos */
            100px 300px 0 0 #fff, 150px 100px 0 0 #fff, 50px 500px 0 0 #fff, 200px 200px 0 0 #fff, 300px 450px 0 0 #fff, 400px 150px 0 0 #fff, 500px 350px 0 0 #fff, 600px 50px 0 0 #fff, 700px 250px 0 0 #fff, 800px 400px 0 0 #fff,
            /* flocos maiores e mais lentos (usando blur e spread maior) */
            250px 150px 2px 2px rgba(255,255,255,0.8), 550px 450px 2px 2px rgba(255,255,255,0.8), 850px 100px 2px 2px rgba(255,255,255,0.8),
            /* flocos mais longe (opacity menor) */
            50px 50px 0 0 rgba(255,255,255,0.5), 950px 550px 0 0 rgba(255,255,255,0.5), 450px 50px 0 0 rgba(255,255,255,0.5), 750px 350px 0 0 rgba(255,255,255,0.5);
            
          /* Atraso na animação para criar a sensação de profundidade e movimento contínuo */
          animation-delay: -5s; 
          
          /* Flocus aleatórios adicionais para preencher a tela */
          &:nth-child(2) {
            left: 20%;
            animation-delay: -10s;
            box-shadow: 10px 10px 0 0 #fff, 200px 100px 0 0 #fff, 400px 300px 0 0 #fff;
          }
          &:nth-child(3) {
            left: 50%;
            animation-duration: 20s; /* Mais lento */
            animation-delay: -3s;
            box-shadow: 50px 50px 0 0 #fff, 300px 400px 0 0 #fff, 700px 200px 0 0 #fff;
          }
          &:nth-child(4) {
            left: 80%;
            animation-duration: 12s; /* Mais rápido */
            animation-delay: -7s;
            box-shadow: 150px 50px 0 0 #fff, 350px 350px 0 0 #fff, 650px 150px 0 0 #fff;
          }
        }
      `}</style>
      <div className="snow-overlay">
        {/* Renderizamos apenas alguns elementos e o box-shadow faz o resto */}
        <div className="snow"></div>
        <div className="snow"></div>
        <div className="snow"></div>
        <div className="snow"></div>
      </div>
    </>
);

// =======================================================
// ⬆️ COMPONENTE DE NEVE (ADICIONADO) ⬆️
// =======================================================

// 🎨 CONFIGURAÇÃO DOS TEMAS
const TEMAS = {
  // ... (o objeto TEMAS permanece o mesmo)
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
  
  // ❄️ Variável para verificar se deve renderizar a neve
  const isChristmasTheme = chaveTema === 'natal'; 

  return (
    <>
      <Head>
        <title>{tema.titulo} - {perfil.nome}</title>
        <meta name="description" content={`Mensagem de ${perfil.nome}`} />
        <meta property="og:title" content={`${tema.titulo} De: ${perfil.nome}`} />
        <meta property="og:description" content={mensagemFinal} />
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
        fontFamily: 'sans-serif',
        position: 'relative', // Adicionado para posicionar o Snowfall
        zIndex: 1 // Adicionado para controle de camadas
      }}>
        
        {/* ❄️ RENDERIZAÇÃO CONDICIONAL DO EFEITO DE NEVE */}
        {isChristmasTheme && <Snowfall />} 

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
          color: tema.corTexto,
          zIndex: 10 // Garante que o cartão fique acima da neve
        }}>
          
          {/* 1. FOTO */}
          <div style={{ marginBottom: 15 }}>
             <img 
              src={perfil.fotoUrl || tema.fotoPadrao} 
              alt={perfil.nome}
              style={{ 
                width: 80,
                height: 80, 
                borderRadius: '50%', 
                objectFit: 'cover',
                backgroundColor: '#fff', 
                border: `3px solid ${tema.corDestaque}`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                padding: perfil.fotoUrl ? '0' : '6px'
              }}
            />
          </div>

          {/* 2. INFO REMETENTE */}
          <div style={{ marginBottom: 20, lineHeight: '1.2' }}>
             <div style={{ 
               fontSize: '0.85rem', 
               opacity: 0.9,
               marginBottom: '2px'
             }}>
               Mensagem de
             </div>

             <strong style={{ 
               fontSize: '1.1rem', 
               color: tema.corTexto,
               textShadow: '0 1px 2px rgba(0,0,0,0.1)'
             }}>
               {perfil.nome}
             </strong>
          </div>

          <hr style={{ 
            border: 0, 
            borderTop: `1px solid ${tema.corTexto}`, 
            opacity: 0.2, 
            margin: '15px 60px' 
          }} />

          {/* 3. CONTEÚDO TEMÁTICO */}
          <div style={{ fontSize: '2.5rem', margin: '10px 0' }}>
            {tema.icone}
          </div>
          
          <h1 style={{ 
            fontFamily: tema.fonte, 
            fontSize: '2.5rem', 
            margin: '0 0 15px 0',
            color: tema.corDestaque,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            lineHeight: '1.1'
          }}>
            {tema.titulo}
          </h1>

          <p style={{ 
            fontSize: '1.3rem', 
            lineHeight: '1.5',
            fontWeight: '500',
            fontStyle: 'italic',
            opacity: 0.95
          }}>
            "{mensagemFinal}"
          </p>

          {/* 🆕 BOTÃO DISCRETO (Crie sua mensagem) */}
          <div style={{ marginTop: 30 }}>
            <a href="https://vizbio.pro/criarmensagem" style={{ 
              display: 'inline-block',
              padding: '8px 20px',
              border: `1px solid ${tema.corTexto}`,
              borderRadius: '50px',
              color: tema.corTexto,
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: '500',
              opacity: 0.7,
              transition: 'opacity 0.3s'
            }}
            // Adiciona efeito hover simples com JS inline
            onMouseOver={(e) => e.target.style.opacity = '1'}
            onMouseOut={(e) => e.target.style.opacity = '0.7'}
            >
              Crie sua mensagem agora
            </a>
          </div>

          {/* 🔗 LINK VIZBIO (Texto sem estilo de link) */}
          <div style={{ marginTop: 20, fontSize: '0.7rem', opacity: 0.6, letterSpacing: '1px' }}>
            <a href="https://vizbio.pro" style={{ color: 'inherit', textDecoration: 'none' }}>
              CRIADO COM VIZBIO
            </a>
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
