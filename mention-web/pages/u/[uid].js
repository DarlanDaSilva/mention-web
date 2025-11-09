import Head from "next/head";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get, query, orderByChild, equalTo } from "firebase/database";

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
export default function Usuario({ profile, banners }) {
  
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

        {/* --- 2. LISTA DE BANNERS --- */}
        <section className="mt-10 md:mt-12 space-y-4">
          {banners.length > 0 ? (
            banners.map((banner) => (
              <a
                key={banner.id}
                href={banner.linkUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block w-full rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-out hover:scale-[1.03] focus:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <img
                  src={banner.imageUrl}
                  alt="Banner"
                  className="w-full h-auto object-cover"
                  // Fallback para um banner placeholder
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x200/374151/FFFFFF?text=Banner+Inv%C3%A1lido";
                    e.currentTarget.onerror = null;
                  }}
                />
              </a>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Nenhum banner encontrado.
            </p>
          )}
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
// 🚀 SERVER-SIDE RENDERING (SSR) - ONDE A BUSCA DE DADOS OCORRE
// ---------------------------------------------------------------------------
export async function getServerSideProps(context) {
  // O 'uid' é capturado da URL (por exemplo, em /u/[uid].js)
  const { uid } = context.query;

  if (!uid) {
    // Se não há UID na URL (ex: /u/), retorna vazio
    return { props: { profile: null, banners: [] } };
  }

  try {
    const db = getDatabase();
    
    // --- 1. Buscar os dados do perfil (usuários/{uid}) ---
    const userRef = ref(db, `usuarios/${uid}`);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      // Se o perfil não existe (motivo do erro "Perfil não encontrado")
      console.error("ERRO SSR: Perfil de usuário não encontrado para o UID:", uid);
      return { props: { profile: null, banners: [] } };
    }
    
    const profile = userSnapshot.val();

    // --- 2. Buscar os Banners associados a este autor (uid) ---
    // Faz uma busca em toda a coleção 'banners' onde 'autor' é igual ao 'uid'
    const bannersRef = ref(db, "banners");
    const bannersQuery = query(bannersRef, orderByChild("autor"), equalTo(uid));
    const bannersSnapshot = await get(bannersQuery);

    let bannersList = [];
    if (bannersSnapshot.exists()) {
      // Converte o objeto de banners filtrados em um array
      bannersSnapshot.forEach((childSnapshot) => {
        bannersList.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      // Inverte a lista para mostrar os banners mais recentes primeiro
      bannersList.reverse(); 
    }

    // --- 3. Enviar os dados para o componente de página ---
    return {
      props: {
        profile: profile,
        banners: bannersList,
      },
    };

  } catch (error) {
    // Loga qualquer erro de Firebase (rede, regras, etc.)
    console.error("Erro fatal ao buscar dados no Firebase (SSR):", error);
    return { props: { profile: null, banners: [] } };
  }
            }
  
