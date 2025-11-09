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
// 🎨 O COMPONENTE DA PÁGINA (DESIGN COM TAILWIND AJUSTADO AO ESBOÇO)
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white antialiased pb-20 mx-auto max-w-xl"> 
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
      <main className="p-0"> {/* Removido padding extra para que a imagem preencha as bordas */}
        
        {/* --- 1. CABEÇALHO DO PERFIL (Com sobreposição ajustada) --- */}
        <header className="relative w-full mb-10 group rounded-none md:rounded-xl overflow-hidden"> {/* Removido rounded-xl da imagem e colocado no header */}
          
          {/* Imagem do Perfil (Com ajuste de altura e centralização) */}
          <img
            src={profile.foto}
            alt="Foto do perfil"
            // Mantém a imagem responsiva, preenchendo o contêiner e centralizando o objeto
            className="w-full h-[350px] object-cover object-center" 
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x350/1F2937/FFFFFF?text=Vizbio+Perfil";
              e.currentTarget.onerror = null; 
            }}
          />

          {/* ℹ️ Bloco de Informações Sobrepostas (Ajustado para o esboço) */}
          {showInfo && (
            <div 
              // Posição ajustada: top-1/2 para começar mais para cima, com um gradiente mais longo
              // padding-x para espaço lateral e padding-top para afastar do topo
              className="absolute inset-x-0 bottom-0 p-4 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl flex flex-col justify-end min-h-[50%]"
            >
              <h1 
                className="text-3xl md:text-4xl font-bold flex items-end gap-2 leading-tight" /* Tamanho maior, alinhamento flex end */
                style={{ color: profile.corNome || '#FFFFFF' }}
              >
                {profile.nome}
                {/* Selo de Verificado (Opcional) - Ajustado o tamanho e a imagem para o esboço */}
                {profile.verify === "SIM" && (
                  <img
                    src="https://i.ibb.co/L5k61N6/icons8-verificado-50.png" /* Nova imagem mais clara */
                    alt="Verificado"
                    title="Verificado"
                    className="w-7 h-7 mb-1" /* Ajustado tamanho e alinhamento */
                  />
                )}
              </h1>
              <p 
                className="text-base md:text-lg mt-2 leading-snug" /* Tamanho maior, espaçamento */
                style={{ color: profile.corBiografia || '#FFFFFF' }}
              >
                {cleanBiografia}
              </p>
            </div>
          )}
          
        </header>

        {/* --- 2. ESPAÇO PARA BANNERS --- */}
        <section className="mt-10 md:mt-12 space-y-4 px-4"> {/* Adicionado padding aqui */}
             <p className="text-center text-gray-500">
                <span className="inline-block rotate-[15deg] origin-center text-4xl font-bold">
                    Espaço para os banners no futuro
                </span>
            </p>
        </section>

      </main>

      {/* --- 3. RODAPÉ FIXO --- */}
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
