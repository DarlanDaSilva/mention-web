import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// ---------------------------------------------------------------------------
// 🔧 CONFIGURAÇÃO DO FIREBASE (MANTIDA)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// 🎨 O COMPONENTE DA PÁGINA (TELA CHEIA E COR DE FUNDO)
// ---------------------------------------------------------------------------
export default function Usuario({ profile }) {
  
  if (!profile) {
    // Fundo padrão para erro
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Perfil Não Encontrado</title>
        </Head>
        <p className="text-lg opacity-80">😢 Perfil não encontrado.</p>
      </div>
    );
  }

  const pageTitle = `${profile.nome} (@${profile.autor}) | Vizbio`;
  const description = profile.biografia || `Confira os links de ${profile.nome}`;
  
  const showInfo = profile.info === "SIM";
  const cleanBiografia = profile.biografia ? profile.biografia.replace(`Usuário @${profile.autor}, você pode apagar.`, '').trim() : '';
  
  // Define a cor de fundo (se corFundo existir, usa ela, senão usa o gradiente padrão)
  const backgroundStyle = profile.corFundo 
    ? { backgroundColor: profile.corFundo, minHeight: '100vh' }
    : {}; // Se não tiver, o Tailwind usará o fundo definido abaixo

  return (
    // Aplica a cor de fundo dinâmica. Se não houver, usa o gradiente do Tailwind.
    <div 
      className={`w-full antialiased pb-20 mx-auto max-w-xl ${!profile.corFundo ? 'bg-gradient-to-b from-gray-900 to-gray-800' : ''}`}
      style={backgroundStyle}
    > 
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={profile.foto} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={profile.foto} />
      </Head>

      {/* Container Principal */}
      <main className="p-0">
        
        {/* --- 1. CABEÇALHO DO PERFIL (IMAGEM 100% TELA) --- */}
        <header className="relative w-full group overflow-hidden">
          
          {/* Imagem do Perfil: h-screen (100vh) e w-screen (100vw) */}
          <img
            src={profile.foto}
            alt="Foto do perfil"
            // CLASSES CRUCIAIS: Define a altura total da viewport (h-[100vh])
            className="w-full h-screen object-cover object-center" 
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x1000/1F2937/FFFFFF?text=Vizbio+Perfil";
              e.currentTarget.onerror = null; 
            }}
          />

          {/* ℹ️ Bloco de Informações Sobrepostas */}
          {showInfo && (
            <div 
              // Garante que o gradiente cubra toda a largura da viewport
              className="absolute inset-x-0 bottom-0 p-4 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end min-h-[50vh]"
            >
              <h1 
                className="text-3xl md:text-4xl font-bold flex items-end gap-2 leading-tight"
                style={{ color: profile.corNome || '#FFFFFF' }}
              >
                {profile.nome}
                {profile.verify === "SIM" && (
                  <img
                    src="https://i.ibb.co/L5k61N6/icons8-verificado-50.png"
                    alt="Verificado"
                    title="Verificado"
                    className="w-7 h-7 mb-1"
                  />
                )}
              </h1>
              <p 
                className="text-base md:text-lg mt-2 leading-snug"
                style={{ color: profile.corBiografia || '#FFFFFF' }}
              >
                {cleanBiografia}
              </p>
            </div>
          )}
          
        </header>

        {/* --- 2. ESPAÇO PARA BANNERS --- */}
        {/* Este é o conteúdo que aparecerá abaixo da tela de capa. */}
        <section className="py-10 md:py-12 space-y-4 px-4">
             <p className="text-center text-gray-500">
                <span className="inline-block rotate-[15deg] origin-center text-4xl font-bold">
                    Espaço para os banners no futuro
                </span>
            </p>
        </section>

      </main>

      {/* --- 3. RODAPÉ FIXO --- */}
      {/* O rodapé agora flutua sobre a imagem quando o usuário chega ao final. */}
      <footer className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 py-3 text-center shadow-2xl z-10">
          <a
            href="https://vizbio.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white hover:text-blue-400 transition"
          >
            Vizbio.pro
          </a>
          <p className="text-xs text-gray-500 mt-0.5">
            Crie sua página de banners visuais
          </p>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 🚀 SERVER-SIDE RENDERING (SSR) (MANTIDO)
// ---------------------------------------------------------------------------
export async function getServerSideProps(context) {
  const { uid } = context.query;

  if (!uid) {
    return { props: { profile: null } };
  }

  try {
    const db = getDatabase();
    const userSnapshot = await get(ref(db, "usuarios/" + uid));

    if (!userSnapshot.exists()) {
      console.error("ERRO SSR: Perfil não encontrado ou acesso negado. UID:", uid);
      return { props: { profile: null } };
    }
    
    const profile = userSnapshot.val();

    return {
      props: {
        profile: profile,
      },
    };

  } catch (error) {
    console.error("Erro ao buscar dados no Firebase (SSR):", error);
    return { props: { profile: null } };
  }
        }
