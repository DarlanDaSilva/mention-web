import { useState } from 'react';
import Head from 'next/head';

export default function GeradorPro() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!usuario || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    // Lógica de redirecionamento solicitada
    const targetUrl = `https://vizbio.pro/geradordebanners/user:${usuario}&pass${senha}`;
    window.location.href = targetUrl;
  };

  return (
    <div style={styles.pageContainer}>
      <Head>
        <title>Login - Gerador Pro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.card}>
        {/* ÁREA DA LOGO - Substitua o src pela URL da sua logo */}
        <div style={styles.header}>
          <img 
            src="https://via.placeholder.com/150x50/4c1d95/ffffff?text=SUA+LOGO" 
            alt="Logo Marca" 
            style={styles.logo} 
          />
          <h1 style={styles.title}>Gerador Vizbio Pro</h1>
          <p style={styles.subtitle}>Faça login para acessar o sistema</p>
          <div style={styles.divider}></div>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          
          {/* Campo Usuário */}
          <div style={styles.inputContainer}>
            <label style={styles.label}>
              <UserIcon /> Usuário
            </label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                style={styles.input}
                placeholder="Digite seu usuário"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div style={styles.inputContainer}>
            <label style={styles.label}>
              <LockIcon /> Senha
            </label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={styles.input}
                placeholder="Digite sua senha"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Botão Entrar */}
          <button type="submit" style={styles.button}>
            <RocketIcon /> Entrar no Sistema
          </button>

        </form>
      </div>
    </div>
  );
}

// --- ÍCONES SVG (Para não precisar instalar bibliotecas) ---
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6, marginBottom: -2}}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6, marginBottom: -2}}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a0a0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a0a0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M1 1l22 22"></path>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
  </svg>
);
const RocketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 8}}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);

// --- ESTILOS CSS (Design Roxo Moderno) ---
const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Gradiente Roxo principal (Fundo da tela)
    background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', 
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: '20px',
  },
  card: {
    backgroundColor: '#1e1b4b', // Roxo bem escuro (quase preto/azul) para o card
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '380px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)', // Borda sutil
  },
  header: {
    marginBottom: '30px',
  },
  logo: {
    maxHeight: '60px',
    marginBottom: '15px',
    // Se sua logo já for branca, remova o filter abaixo
    // filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))', 
  },
  title: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#a5b4fc', // Roxo claro/azul
    fontSize: '14px',
    margin: '0',
  },
  divider: {
    height: '2px',
    width: '50px',
    background: '#8b5cf6',
    margin: '15px auto 0',
    borderRadius: '2px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputContainer: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    paddingRight: '45px', // Espaço para o ícone do olho
    borderRadius: '12px',
    border: '1px solid #4338ca', // Borda roxa média
    backgroundColor: 'rgba(30, 27, 75, 0.5)', // Fundo escuro semi-transparente
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginTop: '10px',
    width: '100%',
    padding: '14px',
    // Gradiente do botão (Roxo para Rosa/Roxo Claro)
    background: 'linear-gradient(90deg, #7c3aed 0%, #9333ea 100%)', 
    color: 'white',
    border: 'none',
    borderRadius: '30px', // Botão bem redondo
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)', // Sombra brilhante
    transition: 'transform 0.2s',
  },
};
                  
