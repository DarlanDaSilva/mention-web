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
// 🎨 ESTILOS MANUAIS (CSS DIRETO NO CÓDIGO)
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
    paddingBottom: '80px' // Espaço para o footer
  },
  main: {
    width: '100%',
    maxWidth: '480px', // Largura máxima estilo celular
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '40px',
    textAlign: 'center'
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
    border: '4px solid #f3f4f6', // Borda cinza claro
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
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
    fontSize: '24px',
    fontWeight: '800',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  bio: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
    maxWidth: '90%',
    margin: 0
  },
  bannersContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px' // Espaço entre os banners
  },
  footer: {
    position: 'fixed',
    bottom: '20px',
    left: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none' // Permite clicar através da área transparente
  },
  footerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    padding: '8px 16px',
    borderRadius: '50px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    fontSize: '12px',
    color: '#666',
    textDecoration: 'none',
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  dot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981', // Verde
    borderRadius: '50%'
  }
};

// ---------------------------------------------------------------------------
// 🧩 O COMPONENTE
// ---------------------------------------------------------------------------
export default function Usuario({ profile }) {
  
  if (!profile) {
    return (
      <div style={{...styles.container, justifyContent: 'center'}}>
        <Head><title>Perfil Não Encontrado</title></Head>
        <div style={{padding: 20, textAlign: 'center'}}>
           <h1>😕 Ops!</h1>
           <p>Perfil não encontrado.</p>
        </div>
      </div>
    );
  }

  const pageTitle = `${profile.nome} (@${profile.autor}) | Vizbio`;
  const cleanBiografia = profile.biografia ? profile.biografia.replace(`Usuário @${profile.autor}, você pode apagar.`, '').trim() : '';
  
  // Mapeamento robusto dos banners
  const banners = profile.banners ? Object.entries(profile.banners).map(([key, value]) => ({ 
      id: key, 
      imagem: value.imagemUrl, 
      link: value.linkUrl
  })) : [];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ESTE BLOCO CSS FAZ A MÁGICA DO HOVER E ANIMAÇÕES FUNCIONAREM SEM TAILWIND */}
      <style jsx global>{`
        /* Animação de entrada suave */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        /* Estilo do Banner com Hover */
        .banner-link {
          display: block;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background-color: #f9fafb;
          text-decoration: none;
          position: relative;
        }
        
        /* Quando passa o mouse */
        .banner-link:hover {
          transform: scale(1.02); /* Aumenta um pouquinho */
          box-shadow: 0 10px 20px rgba(0,0,0,0.1); /* Sombra maior */
          border-color: #e5e7eb;
        }

        .banner-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }
        
        /* Efeito de pulso no footer */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse-dot {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div style={styles.container}>
        <main style={styles.main} className="animate-in">
          
          {/* 1. HEADER */}
          <header style={styles.header}>
            <div style={styles.avatarContainer}>
              <img
                src={profile.foto}
                alt={profile.nome}
                style={styles.avatar}
                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.nome}&background=random`; }}
              />
              {profile.verify === "SIM" && (
                  <div style={styles.verifiedIcon}>
                     <img src="https://i.ibb.co/L5k61N6/icons8-verificado-50.png" alt="V" style={{width:'100%', height:'100%'}} />
                  </div>
              )}
            </div>

            <h1 style={styles.name}>{profile.nome}</h1>
            
            {cleanBiografia && (
              <p style={styles.bio}>{cleanBiografia}</p>
            )}
          </header>

          {/* 2. BANNERS (Usando a classe CSS .banner-link definida acima) */}
          <section style={styles.bannersContainer}>
              {banners.length > 0 ? (
                  banners.map((banner) => (
                      <a 
                          key={banner.id}
                          href={banner.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="banner-link" // A mágica acontece aqui
                      >
                          {banner.imagem ? (
                              <img 
                                  src={banner.imagem} 
                                  alt="Link" 
                                  className="banner-img"
                              />
                          ) : (
                              // Fallback se não tiver imagem
                              <div style={{padding: '30px', textAlign: 'center', color: '#999'}}>
                                 Sem Imagem
                              </div>
                          )}
                      </a>
                  ))
              ) : (
                  <div style={{
                      padding: '40px', 
                      border: '2px dashed #eee', 
                      borderRadius: '16px', 
                      textAlign: 'center', 
                      color: '#aaa',
                      width: '100%'
                  }}>
                      <p>Nenhum link visual disponível.</p>
                  </div>
              )}
          </section>

        </main>

        {/* 3. FOOTER */}
        <footer style={styles.footer}>
            <a
                href="https://vizbio.pro"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.footerBadge}
            >
                <span style={styles.dot} className="pulse-dot"></span>
                <span style={{fontWeight: '600', color: '#333'}}>Vizbio</span>
            </a>
        </footer>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { uid } = context.query;
  if (!uid) return { props: { profile: null } };

  try {
    const db = getDatabase();
    const userRef = ref(db, `usuarios/${uid}`);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) return { props: { profile: null } };
    
    const profile = JSON.parse(JSON.stringify(userSnapshot.val()));
    return { props: { profile } };
  } catch (error) {
    console.error("Erro SSR:", error);
    return { props: { profile: null } };
  }
                              }
