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
// 🎨 O COMPONENTE DA PÁGINA
// ---------------------------------------------------------------------------
export default function Usuario({ profile }) {
  
  // 1. Estado de Carregamento / Perfil não encontrado
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 text-center">
        <Head>
          <title>Perfil Não Encontrado | Vizbio</title>
        </Head>
        <h1 className="text-2xl font-bold mb-2">😕 Ops!</h1>
        <p className="text-lg opacity-80">Perfil não encontrado ou o link está incorreto.</p>
      </div>
    );
  }

  // 2. Preparação dos Dados
  const pageTitle = `${profile.nome} (@${profile.autor}) | Vizbio`;
  const description = profile.biografia || `Confira os links de ${profile.nome}`;
  const showInfo = profile.info === "SIM";
  const cleanBiografia = profile.biografia ? profile.biografia.replace(`Usuário @${profile.autor}, você pode apagar.`, '').trim() : '';
  const bgColor = profile.corFundo || 'bg-gray-900';
  
  // Transforma o objeto de banners do Firebase em Array para poder fazer o map
  // Assumindo que a estrutura no DB seja usuarios/{uid}/banners
  const banners = profile.banners ? Object.entries(profile.banners).map(([key, value]) => ({ id: key, ...value })) : [];

  return (
    <div className={`min-h-screen w-full antialiased text-white m-0 p-0 pb-[100px] ${bgColor}`}> 
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={profile.foto} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={profile.foto} />
      </Head>

      {/* Container Principal */}
      <main className="max-w-2xl mx-auto p-4 pt-12 md:pt-16 flex flex-col items-center">
        
        {/* --- 1. CARD DE PERFIL (Header) --- */}
        <header className="relative w-full max-w-[350px] aspect-square mb-8 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group mx-auto">
          
          {/* Imagem de Fundo */}
          <img
            src={profile.foto}
            alt={`Foto de ${profile.nome}`}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x400/1F2937/FFFFFF?text=${profile.nome || 'User'}`;
              e.currentTarget.onerror = null; 
            }}
          />

          {/* Overlay de Informações */}
          {showInfo && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
              <h1 
                className="text-2xl font-bold flex items-center gap-2 leading-tight drop-shadow-md"
                style={{ color: profile.corNome || '#FFFFFF' }}
              >
                {profile.nome}
                {profile.verify === "SIM" && (
                  <img
                    src="https://i.ibb.co/L5k61N6/icons8-verificado-50.png"
                    alt="Verificado"
                    className="w-5 h-5"
                  />
                )}
              </h1>
              
              {cleanBiografia && (
                <p 
                  className="text-sm mt-2 leading-relaxed font-medium drop-shadow-sm line-clamp-3"
                  style={{ color: profile.corBiografia || '#E5E7EB' }}
                >
                  {cleanBiografia}
                </p>
              )}
            </div>
          )}
        </header>

        {/* --- 2. LISTA DE BANNERS (Links) --- */}
        <section className="w-full max-w-[350px] space-y-4 animate-fade-in-up">
            {banners.length > 0 ? (
                banners.map((banner) => (
                    <a 
                        key={banner.id}
                        href={banner.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                        {/* Se o banner tiver imagem de capa/fundo */}
                        {banner.imagem && (
                            <div className="absolute inset-0 w-full h-full">
                                <img src={banner.imagem} alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="absolute inset-0 bg-black/50" />
                            </div>
                        )}
                        
                        {/* Conteúdo do Banner */}
                        <div className="relative p-4 flex items-center justify-between z-10">
                            <span className="font-semibold text-lg text-white group-hover:text-blue-200 transition-colors">
                                {banner.titulo || "Link sem título"}
                            </span>
                            {/* Ícone de seta simples */}
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                ))
            ) : (
                // Fallback caso não tenha banners
                <div className="text-center py-10 px-4 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-gray-400 text-sm">
                        Este usuário ainda não adicionou conteúdos visuais.
                    </p>
                </div>
            )}
        </section>

      </main>

      {/* --- 3. RODAPÉ FIXO (Glassmorphism) --- */}
      <footer className="fixed bottom-0 left-0 w-full bg-gray-900/80 backdrop-blur-md border-t border-white/10 py-3 text-center z-50 pb-safe">
          <div className="max-w-md mx-auto px-4">
            <a
                href="https://vizbio.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white hover:text-blue-400 transition flex items-center justify-center gap-1"
            >
                ⚡ Criado com <span className="font-bold">Vizbio.pro</span>
            </a>
            <p className="text-[10px] text-gray-500 mt-0.5"> 
                © 2025 Todos os direitos reservados.
            </p>
          </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 🚀 SERVER-SIDE RENDERING (SSR)
// ---------------------------------------------------------------------------
export async function getServerSideProps(context) {
  const { uid } = context.query;

  // Proteção contra UID vazio
  if (!uid) {
    return { props: { profile: null } };
  }

  try {
    const db = getDatabase();
    const userRef = ref(db, `usuarios/${uid}`);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      return { props: { profile: null } };
    }
    
    // Serializa os dados para garantir que o Next.js aceite (remove undefineds)
    const profile = JSON.parse(JSON.stringify(userSnapshot.val()));

    return {
      props: {
        profile,
      },
    };

  } catch (error) {
    console.error("Erro SSR:", error);
    return { props: { profile: null } };
  }
}

