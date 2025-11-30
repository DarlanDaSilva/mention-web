import { useState } from 'react';
import Head from 'next/head';

export default function GeradorPro() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Verifica se os campos estão preenchidos
    if (!usuario || !senha) {
      alert('Por favor, preencha usuário e senha.');
      return;
    }

    // Monta a URL de destino com o formato solicitado
    // Formato: https://vizbio.pro/geradordebanners/user:[usuario]&pass[senha]
    const targetUrl = `https://vizbio.pro/geradordebanners/user:${usuario}&pass${senha}`;

    // Redireciona o navegador
    window.location.href = targetUrl;
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Login - Gerador Pro</title>
      </Head>

      <div style={styles.card}>
        <h1 style={styles.title}>Acesso ao Gerador</h1>
        <p style={styles.subtitle}>Insira seus dados para acessar o painel</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              style={styles.input}
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Entrar e Acessar
          </button>
        </form>
      </div>
    </div>
  );
}

// Estilos básicos (CSS-in-JS) para a página ficar bonita sem precisar de arquivo CSS externo
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: 'sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '0.25rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    boxSizing: 'border-box', // Garante que o padding não estoure a largura
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.75rem',
    borderRadius: '4px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s',
  },
};
