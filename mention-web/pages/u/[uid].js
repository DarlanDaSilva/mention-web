import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
// Importações limpas: removemos 'query', 'orderByChild', 'equalTo'
import { getDatabase, ref, get } from "firebase/database"; 

// ---------------------------------------------------------------------------
// 🔧 CONFIGURAÇÃO DO FIREBASE (USE A SUA)
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

// Evita inicialização duplicada em ambiente de desenvolvimento
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// ---------------------------------------------------------------------------
// 🎨 O COMPONENTE DA PÁGINA (DESIGN COM TAILWIND)
// ---------------------------------------------------------------------------
// Apenas recebe 'profile'
export default function Usuario({ profile }) {
  
  // 1. Se o usuário não for encontrado
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

  // 2. Se o usuário for encontrado, monte a página
  const pageTitle = `${profile.nome} (@${profile.autor}) | Vizbio`;
  const description = profile.biografia || `Confira os links de ${profile.nome}`;

  return (
    // Fundo gradiente igual ao da Landing Page
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white antialiased">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        {/* Open Graph Tags (para previews no WhatsApp, etc.) */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={profile.foto} />
        <meta property="og:type" content="profile" />
        {/* Twitter Tags (para previews no Twitter/X) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={profile.foto} />
      </Head>

      {/* Container Principal */}
      <main className="max-w-xl mx-auto p-4 pt-12 md:pt-20">
        
        {/* --- 1. CABEÇALHO DO PERFIL --- */}
        <header className="flex flex-col items-center text-center">
          <img
            src={profile.foto}
            alt="Foto do perfil"
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-gray-700 shadow-lg"
            // Fallback para uma imagem placeholder se a foto falhar
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/150x150/1F2937/FFFFFF?text=${profile.nome.charAt(0)}`;
              e.currentTarget.onerror = null; 
            }}
          />
          <h1 className="text-2xl md:text-3xl font-bold mt-4 flex items-center gap-2">
            {profile.nome}
            {/* Selo de Verificado (Opcional) */}
            {profile.verify === "SIM" && (
              <img
                src="https://i.ibb.co/cSVZ7gVY/icons8-crach-verificado-48.png"
                alt="Verificado"
                title="Verificado"
                className="w-6 h-6"
              />
            )}
          </h1>
          <p className="text-md text-gray-400 mt-1">@{profile.autor}</p>
          {profile.biografia && (
            <p className="text-sm md:text-base text-gray-300 mt-3 max-w-md">
              {profile.biografia}
            </p>
          )}
        </header>

        {/* --- 2. LISTA DE BANNERS (REMOVIDA PARA TESTE) --- */}
        <section className="mt-10 md:mt-12 space-y-4">
            <p className="text-center text-gray-500">
              *Teste de perfil sem banners*
            </p>
        </section>

        {/* --- 3. RODAPÉ --- */}
        <footer className="text-center mt-16 pb-10">
          <a
            href="https://vizbio.pro" // Link para sua landing page
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-white opacity-90 hover:opacity-100"
          >
            Vizbio.pro
          </a>
          <p className="text-sm text-gray-500 mt-1">
            Crie sua página de banners visuais.
          </p>
        </footer>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 🚀 SERVER-SIDE RENDERING (SSR) - SOMENTE PERFIL
// ---------------------------------------------------------------------------
export async function getServerSideProps(context) {
  const { uid } = context.query;

  // Se não houver UID, não há perfil para buscar
  if (!uid) {
    return { props: { profile: null } };
  }

  try {
    const db = getDatabase();
    
    // --- 1. Buscar os dados do perfil (usuarios/{uid}) ---
    // Usamos a sintaxe antiga que comprovadamente funciona para isolar o problema
    const userSnapshot = await get(ref(db, "usuarios/" + uid));

    if (!userSnapshot.exists()) {
      console.error("ERRO SSR: Perfil não encontrado ou acesso negado. UID:", uid);
      return { props: { profile: null } };
    }
    
    const profile = userSnapshot.val();

    // --- 2. Enviar os dados para a página ---
    return {
      props: {
        profile: profile,
        // Banners foram removidos daqui
      },
    };

  } catch (error) {
    console.error("Erro ao buscar dados no Firebase (SSR):", error);
    return { props: { profile: null } };
  }
}
