import { useState, useEffect } from "react";
import Head from "next/head";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, get, runTransaction } from "firebase/database"; // 1. Importar runTransaction

// 🔧 Configuração do Firebase (SEU CÓDIGO)
// CUIDADO: O ideal é mover estas chaves para variáveis de ambiente (.env.local)
// Ex: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const firebaseConfig = {
  apiKey: "AIzaSyBIMcVlRd0EOveyxu9ZWOYCeQ6CvceX3cg",
  authDomain: "mention-zstore.firebaseapp.com",
  databaseURL: "https://mention-zstore-default-rtdb.firebaseio.com",
  projectId: "mention-zstore",
  storageBucket: "mention-zstore.firebasestorage.app",
  messagingSenderId: "602263910318",
  appId: "1:602263910318:web:5326dfc1b1e05c86dafa3f",
};

// Inicialização segura do App (SEU CÓDIGO)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
const db = getDatabase(app);

// 📦 DADOS DOS TEMAS (SEU CÓDIGO)
const TEMAS_OPCOES = [
  { id: 'natal', nome: 'Natal', icone: 'https://img.icons8.com/color/96/christmas.png', cor: '#ff3b3b' },
  { id: 'anonovo', nome: 'Ano Novo', icone: 'https://img.icons8.com/emoji/96/clincking-glasses.png', cor: '#ffd700' },
  { id: 'aniversario', nome: 'Aniversário', icone: 'https://img.icons8.com/3d-fluency/94/birthday--v1.png', cor: '#ff0090' },
  { id: 'amor', nome: 'Amor', icone: 'https://img.icons8.com/external-colorful-filled-outline-dmitry-mirolyubov/88/external-amor-love-and-wedding-colorful-filled-outline-dmitry-mirolyubov.png', cor: '#ff4d6d' },
  { id: 'biblico', nome: 'Bíblico', icone: 'https://img.icons8.com/color/96/ark-of-the-covenant.png', cor: '#3498db' },
  { id: 'motivacao', nome: 'Motivação', icone: 'https://img.icons8.com/external-jumpicon-solid-gradient-ayub-irawan/64/external-Motivation-crisis-management-jumpicon-(solid-gradient)-jumpicon-solid-gradient-ayub-irawan.png', cor: '#00e676' },
  { id: 'neon', nome: 'Neon', icone: 'https://img.icons8.com/nolan/96/vaporwave.png', cor: '#8e44ad' },
  { id: 'padrao', nome: 'Padrão', icone: 'https://img.icons8.com/nolan/96/user-default.png', cor: '#007bff' },
];

/**
 * -----------------------------------------------------
 * Componente do Modal de Resultado (Nosso Card)
 * -----------------------------------------------------
 */
function ResultadoModal({ link, onClose }) {
  const [copiado, setCopiado] = useState(false);

  const handleCopiar = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500); // Reseta o botão
    }).catch(err => {
      console.error("Falha ao copiar: ", err);
      alert("Erro ao copiar. Copie manualmente.");
    });
  };

  const handleCompartilhar = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mensagem Especial!',
        text: 'Veja o cartão que fiz para você:',
        url: link,
      })
      .catch((err) => console.error("Erro ao compartilhar:", err));
    } else {
      // Fallback para desktops ou navegadores sem suporte
      handleCopiar();
      alert("Link copiado! Cole no seu app de mensagens.");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard}>
        <h3>🎉 Link Criado!</h3>
        <p>Sua mensagem personalizada está pronta.</p>
        
        <div style={styles.inputGroup}>
          <input 
            type="text" 
            value={link} 
            readOnly 
            style={styles.modalInput}
          />
          <button onClick={handleCopiar} style={styles.modalBtnCopy}>
            {copiado ? '✅' : '📋'}
          </button>
        </div>

        <button onClick={handleCompartilhar} style={styles.modalBtnShare}>
          Compartilhar Link
        </button>

        <button onClick={onClose} style={styles.modalBtnClose}>
          Criar outro
        </button>
      </div>
    </div>
  );
}


/**
 * -----------------------------------------------------
 * Componente Principal da Página
 * -----------------------------------------------------
 */
export default function CriarMensagem() {
  // Estados do usuário (SEU CÓDIGO)
  const [nome, setNome] = useState("");
  const [temaSelecionado, setTemaSelecionado] = useState("natal");
  const [modoMensagem, setModoMensagem] = useState("lista");
  const [fraseEscolhida, setFraseEscolhida] = useState("");
  const [frasePersonalizada, setFrasePersonalizada] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkGerado, setLinkGerado] = useState(null); // Agora controla o MODAL

  // Estados do Banco de Dados (SEU CÓDIGO)
  const [todasFrases, setTodasFrases] = useState([]);
  const [frasesFiltradas, setFrasesFiltradas] = useState([]);
  const [carregandoFrases, setCarregandoFrases] = useState(true);

  // 1. BUSCAR FRASES (SEU CÓDIGO - Sem alterações)
  useEffect(() => {
    const fetchFrases = async () => {
      try {
        const frasesRef = ref(db, 'frases');
        const snapshot = await get(frasesRef);
        
        if (snapshot.exists()) {
          const dados = snapshot.val();
          const listaDeFrases = Object.values(dados);
          setTodasFrases(listaDeFrases);
        }
      } catch (error) {
        console.error("Erro ao buscar frases:", error);
      } finally {
        setCarregandoFrases(false);
      }
    };
    fetchFrases();
  }, []);

  // 2. FILTRAR FRASES (SEU CÓDIGO - Sem alterações)
  useEffect(() => {
    if (todasFrases.length > 0) {
      const filtradas = todasFrases.filter(item => item.tema === temaSelecionado);
      setFrasesFiltradas(filtradas);
      
      if (filtradas.length > 0) {
        setFraseEscolhida(filtradas[0].frase);
      } else {
        setFraseEscolhida("");
      }
    }
  }, [temaSelecionado, todasFrases]);

  // Função para mudar o tema (SEU CÓDIGO)
  const trocarTema = (novoTema) => {
    setTemaSelecionado(novoTema);
  };

  /**
   * -----------------------------------------------------
   * FUNÇÃO DE CRIAR O LINK (ATUALIZADA)
   * -----------------------------------------------------
   */
  const handleCriarLink = async () => {
    if (!nome.trim()) {
      alert("Por favor, digite seu nome!");
      return;
    }

    const mensagemFinal = modoMensagem === 'custom' ? frasePersonalizada : fraseEscolhida;
    if (!mensagemFinal || !mensagemFinal.trim()) {
      alert("Escolha ou digite uma mensagem.");
      return;
    }

    setLoading(true);

    try {
      // 1. Referência ao contador
      const contadorRef = ref(db, 'ultimo_id');
      
      // 2. Executa a Transação para pegar o ID sequencial
      const resultado = await runTransaction(contadorRef, (numeroAtual) => {
        return (numeroAtual || 0) + 1;
      });

      const novoId = resultado.snapshot.val();

      // 3. Salva a mensagem usando o novo ID
      await set(ref(db, 'mensagens/' + novoId), {
        // Removi 'Id: novoId' pois o ID já é a chave (key)
        nome: nome,
        tema: temaSelecionado,
        mensagem: mensagemFinal,
        timestamp: Date.now()
      });

      // 4. Mostra o modal de sucesso
      setLinkGerado(`https://vizbio.pro/${novoId}`);

    } catch (error) {
      console.error("Erro na transação ou ao salvar:", error);
      alert("Erro ao criar link. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Head>
        <title>Criar Mensagem | Vizbio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Importa o ícone de compartilhar (opcional, mas legal) */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      </Head>

      {/* Renderiza o Modal de Resultado por cima de tudo, se o link existir */}
      {linkGerado && (
        <ResultadoModal 
          link={linkGerado}
          onClose={() => setLinkGerado(null)} // Fecha o modal
        />
      )}

      {/* Seu HTML da página (com estilos do seu código) */}
      <main style={styles.mainContainer}>
        <div style={styles.cardPrincipal}>

          <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
            Crie seu Cartão Digital
          </h1>
          
          {/* FORMULÁRIO DE CRIAÇÃO (Sempre visível) */}
          <>
            {/* 1. NOME */}
            <div style={{ marginBottom: '25px' }}>
              <label style={styles.label}>1. Seu Nome</label>
              <input 
                type="text" 
                placeholder="Ex: Darlan"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* 2. ESCOLHA O TEMA */}
            <div style={{ marginBottom: '25px' }}>
              <label style={styles.label}>2. Escolha o Tema</label>
              <div style={styles.gridTemas}>
                {TEMAS_OPCOES.map((tema) => (
                  <div 
                    key={tema.id}
                    onClick={() => trocarTema(tema.id)}
                    style={{
                      ...styles.temaCard,
                      border: temaSelecionado === tema.id ? `3px solid ${tema.cor}` : '2px solid #eee',
                      background: temaSelecionado === tema.id ? '#fafafa' : '#fff',
                    }}
                  >
                    <img src={tema.icone} alt={tema.nome} style={{ width: '40px', height: '40px' }} />
                    <div style={{ fontSize: '12px', marginTop: '5px', fontWeight: 'bold', color: '#555' }}>{tema.nome}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. A MENSAGEM */}
            <div style={{ marginBottom: '30px' }}>
              <label style={styles.label}>3. A Mensagem</label>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '10px', fontSize: '14px' }}>
                <label style={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="modoMsg" 
                    checked={modoMensagem === 'lista'} 
                    onChange={() => setModoMensagem('lista')}
                    style={{ marginRight: '5px' }}
                  /> 
                  Frases Sugeridas
                </label>
                <label style={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="modoMsg" 
                    checked={modoMensagem === 'custom'} 
                    onChange={() => setModoMensagem('custom')}
                    style={{ marginRight: '5px' }}
                  /> 
                  Escrever a minha
                </label>
              </div>

              {modoMensagem === 'lista' ? (
                <>
                  {carregandoFrases ? (
                    <p style={{color:'#999'}}>Carregando frases...</p>
                  ) : (
                    <select 
                      value={fraseEscolhida}
                      onChange={(e) => setFraseEscolhida(e.target.value)}
                      style={{...styles.input, ...styles.select}}
                    >
                      {frasesFiltradas.length > 0 ? (
                        frasesFiltradas.map((item, index) => (
                          <option key={index} value={item.frase}>
                            {item.frase.length > 60 ? item.frase.substring(0, 60) + '...' : item.frase}
                          </option>
                        ))
                      ) : (
                        <option value="">Nenhuma frase encontrada</option>
                      )}
                    </select>
                  )}
                </>
              ) : (
                <textarea 
                  placeholder="Digite sua mensagem especial aqui..."
                  value={frasePersonalizada}
                  onChange={(e) => setFrasePersonalizada(e.target.value)}
                  rows={4}
                  style={{...styles.input, ...styles.textarea}}
                />
              )}
            </div>

            {/* BOTÃO GERAR */}
            <button 
              onClick={handleCriarLink}
              disabled={loading || carregandoFrases}
              style={{
                ...styles.btnGerar,
                background: (loading || carregandoFrases) ? '#ccc' : '#007bff',
                cursor: (loading || carregandoFrases) ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Criando...' : 'Gerar meu Cartão ✨'}
            </button>
          </>

        </div>
      </main>
    </>
  );
}


// 🎨 Central de Estilos (CSS-in-JS)
// Organizei todos os seus inline styles aqui para ficar mais limpo
const styles = {
  // Page
  mainContainer: {
    minHeight: '100vh',
    background: '#f0f2f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px'
  },
  cardPrincipal: {
    background: '#fff',
    width: '100%',
    maxWidth: '600px',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    height: 'fit-content',
    marginTop: '20px'
  },
  // Form Elements
  label: { 
    display: 'block', 
    fontWeight: 'bold', 
    marginBottom: '8px', 
    color: '#555' 
  },
  input: {
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    fontSize: '16px', 
    boxSizing: 'border-box'
  },
  select: {
    background: '#fff', 
    cursor: 'pointer'
  },
  textarea: {
    fontFamily: 'sans-serif', 
    resize: 'vertical'
  },
  radioLabel: {
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center'
  },
  // Temas
  gridTemas: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
    gap: '10px' 
  },
  temaCard: {
    borderRadius: '10px',
    padding: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s'
  },
  // Botão Principal
  btnGerar: {
    width: '100%',
    padding: '15px',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background 0.3s'
  },
  // --- Estilos do Modal ---
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  },
  modalCard: {
    background: '#fff',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    color: '#333'
  },
  inputGroup: {
    display: 'flex',
    margin: '20px 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  modalInput: {
    flex: 1,
    padding: '12px',
    border: 'none',
    background: '#f5f5f5',
    color: '#555',
    outline: 'none',
    fontSize: '1rem',
  },
  modalBtnCopy: {
    background: '#eee',
    border: 'none',
    padding: '0 15px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#555'
  },
  modalBtnShare: {
    background: '#25D366', // Verde WhatsApp
    color: 'white',
    border: 'none',
    padding: '12px',
    width: '100%',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  modalBtnClose: {
    background: 'transparent',
    border: 'none',
    color: '#777',
    textDecoration: 'underline',
    cursor: 'pointer',
    marginTop: '10px',
  }
};

                                                    
