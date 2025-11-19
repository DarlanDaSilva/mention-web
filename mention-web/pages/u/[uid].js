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
// 🎨 ESTILOS (CSS MANUAL PARA GARANTIR O VISUAL)
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
    paddingBottom: '80px',
    overflowX: 'hidden'
  },
  main: {
    width: '100%',
    maxWidth: '480px',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    textAlign: 'center',
    width: '100%'
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: '15px',
    width: '110px',
    height: '110px'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #f3f4f6',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  verifiedIcon: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '24px',
    height: '24px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    padding: '2px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  name: {
    fontSize: '22px',
    fontWeight: '800',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px',
    color: '#111'
  },
  bio: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
    maxWidth: '90%',
    margin: 0,
    fontWeight: '400'
  },
  bannersContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  footer: {
    position: 'fixed',
    bottom: '20px',
    left: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 50
  },
  footerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    padding: '8px 16px',
    borderRadius: '50px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    fontSize: '11px',
    color: '#555',
    textDecoration: 'none',
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '600'
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
export default function Usuario({ profile, uid }) {
  
  // 1. Tratamento de Perfil Não Encontrado
  if (!profile) {
    return (
      <div style={{...styles.container, justifyContent: 'center'}}>
        <Head><title>Perfil Não Encontrado | Vizbio</title></Head>
        <div style={{padding: 20, textAlign: 'center'}}>
           <h1 style={{fontSize: '20px', marginBottom: '10px'}}>😕 Perfil Inexistente</h1>
           <p style={{color: '#666'}}>Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  const pageTitle = `${profile.nome} (@${profile.autor}) | Vizbio`;
  const cleanBiografia = profile.biografia ? profile.biografia.replace(`Usuário @${profile.autor}, você pode apagar.`, '').trim() : '';
  
  // 2. PROCESSAMENTO E FILTRAGEM DOS BANNERS
  const banners = profile.banners ? Object.entries(profile.banners)
    .map(([key, value]) => ({ 
        id: key, 
        imagem: value.imagemUrl, // Mapeando sua chave do Firebase
        link: value.linkUrl,     // Mapeando sua chave do Firebase
        autor: value.autor       // Necessário para o filtro
    }))
    // 🔥 AQUI ESTÁ O FILTRO QUE VOCÊ PEDIU 🔥
    .filter((banner) => banner.autor === uid) 
    : [];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={cleanBiografia || `Links de ${profile.nome}`} />
      </Head>

      {/* CSS GLOBAL PARA ANIMAÇÕES (Hover e Entrada) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        .banner-link {
          display: block;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.04);
          border: 1px solid #f3f4f6;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          background-color: #f9fafb;
          text-decoration: none;
          position: relative;
          /* Garante que a imagem não "vaze" das bordas */
          transform: translateZ(0); 
        }
        
        .banner-link:hover {
          transform: scale(1.025);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          border-color: #e5e7eb;
          z-index: 10;
        }

        .banner-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-dot {
          animation: pulse 2s infinite;
        }
      `}</style>

      <div style={styles.container}>
        <main style={styles.main} className="animate-in">
          
          {/* --- HEADER --- */}
          <header style={styles.header}>
            <div style={styles.avatarContainer}>
              <img
                src={profile.foto}
                alt={profile.nome}
                style={styles.avatar}
                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.nome}&background=f3f4f6&color=333`; }}
              />
              {profile.verify === "SIM" && (
                  <div style={styles.verifiedIcon}>
                     <img src="https://i.ibb.co/L5k61N6/icons8-verificado-50.png" alt="V" style={{width:'100%', height:'100%', display:'block'}} />
                  </div>
              )}
            </div>

            <h1 style={styles.name}>{profile.nome}</h1>
            
            {cleanBiografia && (
              <p style={styles.bio}>{cleanBiografia}</p>
            )}
          </header>

          {/* --- BANNERS --- */}
          <section style={styles.bannersContainer}>
              {banners.length > 0 ? (
                  banners.map((banner) => (
                      <a 
                          key={banner.id}
                          href={banner.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="banner-link"
                      >
                          {banner.imagem ? (
                              <img 
                                  src={banner.imagem} 
                                  alt="Link" 
                                  className="banner-img"
                                  onError={(e) => {
                                      // Se a imagem quebrar, mostra um bloco cinza
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextSibling.style.display = 'flex';
                                  }}
                              />
                          ) : null}
                          
                          {/* Fallback invisível que aparece se a imagem quebrar ou não existir */}
                          <div style={{
                              display: banner.imagem ? 'none' : 'flex',
                              height: '80px',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f3f4f6',
                              color: '#9ca3af',
                              fontWeight: '500'
                          }}>
                              Link sem imagem
                          </div>
                      </a>
                  ))
              ) : (
                  // Estado vazio elegante
                  <div style={{
                      padding: '40px 20px', 
                      border: '2px dashed #e5e7eb', 
                      borderRadius: '16px', 
                      textAlign: 'center', 
                      backgroundColor: '#f9fafb',
                      width: '100%',
                      boxSizing: 'border-box'
                  }}>
                      <p style={{color: '#9ca3af', margin: 0, fontSize: '14px'}}>
                        Nenhum conteúdo disponível no momento.
                      </p>
                  </div>
              )}
          </section>

        </main>

        {/* --- FOOTER --- */}
        <footer style={styles.footer}>
            <a
                href="https://vizbio.pro"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.footerBadge}
            >
                <span style={styles.dot} className="pulse-dot"></span>
                <span>Criado com <strong>Vizbio</strong></span>
            </a>
        </footer>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// 🚀 SERVER SIDE PROPS
// ---------------------------------------------------------------------------
export async function getServerSideProps(context) {
  const { uid } = context.query;

  if (!uid) return { props: { profile: null } };

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
        uid // Enviamos o UID para o componente poder filtrar os banners
      },
    };

  } catch (error) {
    console.error("Erro SSR:", error);
    return { props: { profile: null } };
  }
            }
      
