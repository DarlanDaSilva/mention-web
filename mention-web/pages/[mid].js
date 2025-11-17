import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// 🔧 Suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBIMcVlRd0EOveyxu9ZWOYCeQ6CvceX3cg",
  authDomain: "mention-zstore.firebaseapp.com",
  databaseURL: "https://mention-zstore-default-rtdb.firebaseio.com",
  projectId: "mention-zstore",
  storageBucket: "mention-zstore.firebasestorage.app",
  messagingSenderId: "602263910318",
  appId: "1:602263910318:web:5326dfc1b1e05c86dafa3f",
};

// 💡 Inicializa o Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getDatabase(app);

// -----------------------------------------------------------------
// 1. A PÁGINA (O que o usuário vê)
// -----------------------------------------------------------------
export default function PerfilVizbio({ perfil }) {
  
  // Mensagem padrão definida por você
  const mensagemNatal = "Que este Natal brilhe com alegria e que o ano-novo traga prosperidade para todos os seus dias. Boas festas!";

  if (!perfil) {
    return (
      <>
        <Head><title>Link não encontrado | Vizbio</title></Head>
        <main style={{ padding: 20, textAlign: 'center' }}>
          <h1>Link não encontrado</h1>
        </main>
      </>
    );
  }

  const pageTitle = `Mensagem de ${perfil.nome}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {/* Configuração para o WhatsApp mostrar a mensagem */}
        <meta name="description" content={mensagemNatal} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={mensagemNatal} />
        {/* Se tiver foto no firebase, usa ela, senão usa uma imagem de natal padrão */}
        <meta property="og:image" content={perfil.fotoUrl || "https://i.ibb.co/v6K2KbWY/20251016-225434-0000.png"} />
      </Head>

      <main style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        textAlign: 'center'
      }}>
        
        <div style={{
          background: 'white',
          padding: '40px 20px',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          
          {/* Foto (opcional) */}
          <img 
            src={perfil.fotoUrl || "https://i.ibb.co/3c1vKJk/default-avatar.png"} 
            alt={`Foto de ${perfil.nome}`}
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 15 }}
          />
          
          {/* Nome da pessoa */}
          <h1 style={{ 
            margin: '0 0 10px 0', 
            color: '#333',
            fontSize: '1.8rem'
          }}>
            {perfil.nome}
          </h1>
          
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: 0 }}>
            Deseja a você:
          </p>

          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

          {/* A MENSAGEM BONITA AQUI */}
          <p style={{ 
            fontSize: '1.4rem', 
            lineHeight: '1.6', 
            color: '#2c3e50',
            fontFamily: 'Georgia, serif', // Fonte mais elegante para mensagem
            fontStyle: 'italic'
          }}>
            "{mensagemNatal}"
          </p>

          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
          
          <small style={{ color: '#aaa' }}>Vizbio - Crie seu cartão digital</small>
        </div>

      </main>
    </>
  );
}

// -----------------------------------------------------------------
// 2. BUSCA DE DADOS (Server Side)
// -----------------------------------------------------------------
export async function getServerSideProps(context) {
  const { mid } = context.params;
  let perfilData = null;

  try {
    const perfilRef = ref(db, `mensagens/${mid}`);
    const snapshot = await get(perfilRef);

    if (snapshot.exists()) {
      perfilData = snapshot.val();
    }
  } catch (error) {
    console.error("Erro ao buscar no Firebase:", error);
  }

  return {
    props: {
      perfil: perfilData,
    },
  };
                                           }
