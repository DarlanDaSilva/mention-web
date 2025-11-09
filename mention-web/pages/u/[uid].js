import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// ---------------------------------------------------------------------------
// 🔧 CONFIGURAÇÃO DO FIREBASE
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
// 🎨 O COMPONENTE DA PÁGINA (DESIGN COM TAILWIND)
// ---------------------------------------------------------------------------
export default function Usuario({ profile }) {
  
  if (!profile) {
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

  // Lógica para controle de visibilidade das informações
  const showInfo = profile.info === "SIM";

  // Prepara a biografia, removendo menção a @uid
  const cleanBiografia = profile.biografia ? profile.biografia.replace(`Usuário @${profile.autor}, você pode apagar.`, '').trim() : '';

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white antialiased pb-20">
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
      <main className="max-w-xl mx-auto p-4 pt-12 md:pt-20">
        
        {/* --- 1. CABEÇALHO DO PERFIL (Com sobreposição) --- */}
        <header className="relative w-full flex flex-col items-center mb-10">
          
          {/* Imagem do Perfil */}
          <img
            src={profile.foto}
            alt="Foto do perfil"
            className="w-full h-auto object-cover rounded-xl shadow-xl aspect-video max-h-[300px]"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x300/1F2937/FFFFFF?text=Vizbio+Perfil";
              e.currentTarget.onerror = null; 
            }}
          />

          {/* ℹ️ Bloco de Informações Sobrepostas (Só aparece se info: SIM) */}
          {showInfo && (
            <div 
              className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-xl pt-10"
            >
              <h1 
                className="text-xl md:text-2xl font-bold flex items-center gap-2"
                style={{ color: profile.corNome || '#FFFFFF' }}
              >
                {profile.nome}
                {/* Selo de Verificado (Opcional) */}
                {profile.verify === "SIM" && (
                  <img
                    src="https://i.ibb.co/cSVZ7gVY/icons8-crach-verificado-48.png"
                    alt="Verificado"
                    title="Verificado"
                    className="w-5 h-5"
                  />
                )}
              </h1>
              <p 
                className="text-sm md:text-base mt-1"
                style={{ color: profile.corBiografia || '#FFFFFF' }}
              >
                {cleanBiografia}
              </p>
            </div>
          )}

          {/* UID/Autor (Visível apenas se info: NÃO, ou se você quiser mantê-lo) */}
          {!showInfo && (
            <p className="text-md text-gray-400 mt-4">@{profile.autor}</p>
          )}
        </header>

        {/* --- 2. ESPAÇO PARA BANNERS --- */}
        <section className="mt-10 md:mt-12 space-y-4">
             <p className="text-center text-gray-500">
              *Espaço para banners (removido para teste)*
            </p>
        </section>

      </main>

      {/* --- 3. RODAPÉ FIXO --- */}
      <footer className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 py-3 text-center shadow-2xl">
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
// 🚀 SERVER-SIDE RENDERING (SSR)
// ---------------------------------------------------------------------------
export async function getServerSideProps(context) {
  const { uid } = context.query;

  if (!uid) {
    return { props: { profile: null } };
  }

  try {
    const db = getDatabase();
    
    // Busca os dados do perfil (usuarios/{uid})
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
