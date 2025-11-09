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
// 🎨 O COMPONENTE DA PÁGINA
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
  
  const showInfo = profile.info === "SIM";
  const cleanBiografia = profile.biografia ? profile.biografia.replace(`Usuário @${profile.autor}, você pode apagar.`, '').trim() : '';
  
  const bgColor = profile.corFundo || 'bg-gray-900'; 
  
  return (
    // CORREÇÃO: Adicionadas as classes m-0 (margin: 0) e p-0 (padding: 0)
    <div className={`min-h-screen w-full antialiased text-white m-0 p-0 pb-[70px] ${bgColor}`}> 
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
        
        {/* --- 1. CAPA QUADRADA (250x250px) --- */}
        <header 
          className="relative w-[120px] h-[120px] mx-auto mb-10 overflow-hidden group rounded-xl shadow-xl" 
        >
          
          {/* Imagem */}
          <img
            src={profile.foto}
            alt="Foto do perfil"
            className="w-full h-full object-cover object-center" 
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/250x250/1F2937/FFFFFF?text=Vizbio+Perfil";
              e.currentTarget.onerror = null; 
            }}
          />

          {/* ℹ️ Bloco de Informações Sobrepostas */}
          {showInfo && (
            <div 
              className="absolute inset-x-0 bottom-0 p-3 pt-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end min-h-[50%]"
            >
              <h1 
                className="text-xl font-bold flex items-end gap-1 leading-tight"
                style={{ color: profile.corNome || '#FFFFFF' }}
              >
                {profile.nome}
                {profile.verify === "SIM" && (
                  <img
                    src="https://i.ibb.co/L5k61N6/icons8-verificado-50.png"
                    alt="Verificado"
                    title="Verificado"
                    className="w-5 h-5 mb-0.5"
                  />
                )}
              </h1>
              <p 
                className="text-sm mt-1 leading-snug"
                style={{ color: profile.corBiografia || '#FFFFFF' }}
              >
                {cleanBiografia}
              </p>
            </div>
          )}
          
        </header>

        {/* --- 2. CONTEÚDO DA PÁGINA (BANNERS) --- */}
        <section className="py-10 md:py-12 space-y-4">
             <p className="text-center text-gray-500">
                <span className="inline-block text-xl font-bold">
                    Conteúdo abaixo do Card
                </span>
            </p>
        </section>

      </main>

      {/* --- 3. RODAPÉ FIXO --- */}
      <footer className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 py-3 text-center shadow-2xl z-20">
          {/* Linha 1: Vizbio.pro Crie sua página de banners visuais */}
          <a
            href="https://vizbio.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white hover:text-blue-400 transition"
          >
            Vizbio.pro Crie sua página de banners visuais
          </a>
          
          {/* Linha 2: © 2025 Vizbio.pro. Todos os direitos reservados. */}
          <p className="text-xs text-gray-500 mt-1"> 
            © 2025 Vizbio.pro. Todos os direitos reservados.
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
