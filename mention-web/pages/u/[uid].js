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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-4 text-center">
        <Head>
          <title>Perfil Não Encontrado | Vizbio</title>
        </Head>
        <div className="p-8 rounded-2xl border border-gray-100 shadow-xl bg-white">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">😕 Ops!</h1>
            <p className="text-lg text-gray-500">Perfil não encontrado.</p>
        </div>
      </div>
    );
  }

  // 2. Preparação dos Dados
  const pageTitle = `${profile.nome} (@${profile.autor}) | Vizbio`;
  const description = profile.biografia || `Confira os links de ${profile.nome}`;
  const cleanBiografia = profile.biografia ? profile.biografia.replace(`Usuário @${profile.autor}, você pode apagar.`, '').trim() : '';
  
  // --- CORREÇÃO AQUI: Mapeando os campos corretos do seu JSON (imagemUrl e linkUrl) ---
  const banners = profile.banners ? Object.entries(profile.banners).map(([key, value]) => ({ 
      id: key, 
      // Garante que usamos os nomes que estão no seu banco
      imagem: value.imagemUrl, 
      link: value.linkUrl,
      titulo: value.titulo // Caso tenha título no futuro, mantemos a referência
  })) : [];

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900"> 
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        {/* Meta Tags Sociais */}
        <meta property="og:image" content={profile.foto} />
        <meta property="og:title" content={pageTitle} />
      </Head>

      {/* Container Principal - Centralizado */}
      <main className="max-w-md mx-auto p-4 pt-12 pb-24 flex flex-col items-center animate-fade-in">
        
        {/* --- 1. HEADER DO PERFIL (Clean) --- */}
        <header className="flex flex-col items-center text-center mb-10 w-full">
          
          {/* Avatar com Borda Suave */}
          <div className="relative group mb-4">
            <div className="absolute -inset-1 bg-gradient-to-tr from-gray-200 to-gray-100 rounded-full blur opacity-50 group-hover:opacity-75 transition"></div>
            <img
              src={profile.foto}
              alt={`Foto de ${profile.nome}`}
              className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl" 
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.nome}&background=f3f4f6&color=374151`;
              }}
            />
            {/* Selo de Verificado */}
            {profile.verify === "SIM" && (
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                  <img
                    src="https://i.ibb.co/L5k61N6/icons8-verificado-50.png"
                    alt="Verificado"
                    className="w-5 h-5"
                  />
                </div>
            )}
          </div>

          {/* Nome e Bio */}
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-2">
            {profile.nome}
          </h1>
          
          {cleanBiografia && (
            <p className="text-sm text-gray-500 leading-relaxed max-w-[90%] font-medium">
              {cleanBiografia}
            </p>
          )}
        </header>

        {/* --- 2. LISTA DE BANNERS (Estilo Imagem Full) --- */}
        <section className="w-full space-y-5">
            {banners.length > 0 ? (
                banners.map((banner) => (
                    <a 
                        key={banner.id}
                        href={banner.link || '#'} // Usa o linkUrl mapeado acima
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-2xl bg-gray-100"
                    >
                        {/* Imagem do Banner */}
                        {banner.imagem ? (
                            <img 
                                src={banner.imagem} // Usa a imagemUrl mapeada acima
                                alt="Banner Link" 
                                className="w-full h-auto object-cover block"
                                style={{ minHeight: '100px' }} // Garante altura mínima
                            />
                        ) : (
                            // Fallback se a imagem quebrar ou não existir
                            <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-gray-400 font-medium">
                                Sem Imagem
                            </div>
                        )}

                        {/* Efeito de Brilho ao passar o mouse (Opcional) */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" />
                    </a>
                ))
            ) : (
                <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                    <p className="text-gray-400 text-sm font-medium">
                        Nenhum link disponível.
                    </p>
                </div>
            )}
        </section>

      </main>

      {/* --- 3. RODAPÉ (Branco Translúcido) --- */}
      <footer className="fixed bottom-4 left-0 w-full flex justify-center z-50 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm px-4 py-2 rounded-full pointer-events-auto flex items-center gap-2">
            <a
                href="https://vizbio.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-gray-600 hover:text-black transition flex items-center gap-1"
            >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Vizbio
            </a>
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
