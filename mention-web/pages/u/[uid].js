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
// 🎨 ESTILOS PREMIUM (CSS NO JAVASCRIPT)
// ---------------------------------------------------------------------------
const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#1a1a1a',
    paddingBottom: '80px', // Espaço para o footer não cobrir o conteúdo
    overflowX: 'hidden'
  },
  main: {
    width: '100%',
    maxWidth: '480px', // Largura ideal para mobile
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  // --- HEADER PREMIUM ---
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '35px',
    textAlign: 'center',
    width: '100%',
    position: 'relative'
  },
  // Efeito de luz suave atrás da foto
  glowEffect: {
    position: 'absolute',
    top: '20px',
    width: '160px',
    height: '160px',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    zIndex: 0,
    pointerEvents: 'none'
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: '15px',
    width: '120px',
    height: '120px',
    padding: '4px', // Espaço entre a foto e a borda colorida
    // Gradiente Tech (Verde Vizbio + Azul Tech)
    background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', 
    borderRadius: '50%',
    zIndex: 1,
    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: '#fff',
    border: '3px solid #ffffff', // Borda branca interna
    display: 'block'
  },
  verifiedIcon: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '32px', // Ícone um pouco maior
    height: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    padding: '3px', // Bordinha branca em volta do selo
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  name: {
    fontSize: '26px',
    fontWeight: '800',
    margin: '0 0 2px 0', // Margem pequena embaixo
    letterSpacing: '-0.5px',
    color: '#0f172a'
  },
  username: {
    fontSize: '15px',
    color: '#64748b', // Cinza azulado
    fontWeight: '600',
    marginBottom: '12px',
    opacity: 0.9
  },
  bio: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.6',
    maxWidth: '95%',
    margin: 0,
    fontWeight: '400'
  },
  // --- BANNERS ---
  bannersContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  // --- FOOTER ---
  footer: {
    position: 'fixed',
    bottom: '20px',
    left: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none', // Permite clicar no fundo através dele
    zIndex: 50
  },
  footerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '8px 18px',
    borderRadius: '50px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    fontSize: '11px',
    color: '#334155',
    textDecoration: 'none',
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '600',
    transition: 'transform 0.2s ease'
  },
  dot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#10b981',
    borderRadius: '50%'
  }
};

// ---------------------------------------------------------------------------
// 🧩 O COMPONENTE PRINCIPAL
// ---------------------------------------------------------------------------
export default function Usuario({ profile, banners }) {
  
  // Proteção: Se não achar o perfil
  if (!profile) {
    return (
      <div style={{...styles.container, justifyContent: 'center'}}>
        <Head><title>Perfil Não Encontrado</title></Head>
        <div style={{padding: 20, textAlign: 'center'}}>
           <h1 style={{fontSize: '20px', marginBottom: '8px'}}>😕 Perfil Inexistente</h1>
           <p style={{color: '#666'}}>Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  const pageTitle = `${profile.nome} (@${profile.autor}) | Vizbio`;
  const cleanBiografia = profile.biografia ? profile.biografia.replace(`Usuário @${profile.autor}, você pode apagar.`, '').trim() : '';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        {/* Meta tags sociais */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={cleanBiografia} />
        <meta property="og:image" content={profile.foto} />
      </Head>

      {/* ANIMAÇÕES CSS (Injetadas na página) */}
      <style jsx global>{`
        /* Animação suave de entrada */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        /* Estilo dos Banners com Hover */
        .banner-link {
          display: block;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          background-color: #f8fafc;
          text-decoration: none;
          position: relative;
          transform: translateZ(0); 
        }
        
        /* Efeito quando passa o mouse/dedo */
        .banner-link:hover {
          transform: scale(1.03);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          border-color: #cbd5e1;
          z-index: 10;
        }
        
        .banner-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        /* Animação do pontinho verde no rodapé */
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-dot {
          animation: pulse 2s infinite;
        }
      `}</style>

      <div style={styles.container}>
        <main style={styles.main} className="animate-in">
          
          {/* --- HEADER PREMIUM --- */}
          <header style={styles.header}>
            
            {/* Brilho de fundo */}
            <div style={styles.glowEffect}></div>

            <div style={styles.avatarContainer}>
              <img
                src={profile.foto}
                alt={profile.nome}
                style={styles.avatar}
                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.nome}&background=f3f4f6&color=333`; }}
              />
              
              {/* Selo Verificado Oficial */}
              {profile.verify === "SIM" && (
                  <div style={styles.verifiedIcon}>
                     <img 
                        src="https://i.ibb.co/ds75cCJM/icons8-verificado-48.png" 
                        alt="Verificado" 
                        style={{width:'100%', height:'100%', display:'block'}} 
                     />
                  </div>
              )}
            </div>

            <h1 style={styles.name}>{profile.nome}</h1>
            
            {/* Usuário estilo @handle */}
            <span style={styles.username}>@{profile.autor}</span>
            
            {cleanBiografia && (
              <p style={styles.bio}>{cleanBiografia}</p>
            )}
          </header>

          {/* --- LISTA DE BANNERS --- */}
          <section style={styles.bannersContainer}>
              {banners.length > 0 ? (
                  banners.map((banner) => (
                      <a 
                          key={banner.id}
                          href={banner.linkUrl || '#'} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="banner-link"
                      >
                          {banner.imageUrl ? (
                              <img 
                                  src={banner.imageUrl} 
                                  alt="Abrir Link" 
                                  className="banner-img"
                                  onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextSibling.style.display = 'flex';
                                  }}
                              />
                          ) : null}
                          
                          {/* Fallback: Texto caso a imagem quebre */}
                          <div style={{
                              display: banner.imageUrl ? 'none' : 'flex',
                              height: '90px',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f1f5f9',
                              color: '#94a3b8',
                              fontWeight: '500'
                          }}>
                              Link sem imagem
                          </div>
                      </a>
                  ))
              ) : (
                  // Estado Vazio
                  <div style={{
                      padding: '40px 20px', 
                      border: '2px dashed #e2e8f0', 
                      borderRadius: '16px', 
                      textAlign: 'center', 
                      backgroundColor: '#f8fafc',
                      width: '100%'
                  }}>
                      <p style={{color: '#94a3b8', margin: 0, fontSize: '14px'}}>
                        Nenhum conteúdo disponível.
                      </p>
                  </div>
              )}
          </section>

        </main>

        {/* --- RODAPÉ --- */}
        <footer style={styles.footer}>
            <a href="https://vizbio.pro" target="_blank" style={styles.footerBadge}>
                <span style={styles.dot} className="pulse-dot"></span>
                <span>Criado com <strong>Vizbio</strong></span>
            </a>
        </footer>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// 🚀 BACKEND (FILTRAGEM DE DADOS)
// ---------------------------------------------------------------------------
export async function getServerSideProps(context) {
  const { uid } = context.query; // Obtém o ID da URL

  if (!uid) return { props: { profile: null, banners: [] } };

  try {
    const db = getDatabase();

    // 1. BUSCAR DADOS DO USUÁRIO
    const userRef = ref(db, `usuarios/${uid}`);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      return { props: { profile: null, banners: [] } };
    }
    const profile = JSON.parse(JSON.stringify(userSnapshot.val()));

    // 2. BUSCAR TODOS OS BANNERS
    // O sistema busca todos os banners na raiz "banners"
    const bannersRef = ref(db, `banners`);
    const bannersSnapshot = await get(bannersRef);
    
    let filteredBanners = [];

    if (bannersSnapshot.exists()) {
       const allBanners = bannersSnapshot.val();
       
       // 3. FILTRAR: Apenas banners onde autor == UID da página
       filteredBanners = Object.entries(allBanners)
         .map(([key, value]) => ({ id: key, ...value }))
         .filter(banner => banner.autor === uid);
    }

    // Serializa para JSON (Regra do Next.js)
    const bannersSafe = JSON.parse(JSON.stringify(filteredBanners));

    return {
      props: {
        profile,
        banners: bannersSafe
      },
    };

  } catch (error) {
    console.error("Erro SSR:", error);
    return { props: { profile: null, banners: [] } };
  }
            }
                            
