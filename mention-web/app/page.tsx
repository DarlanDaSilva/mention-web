/*
 * Esta é a sua página inicial (Landing Page) para vizbio.pro
 * Caminho: /page.tsx (ou /app/page.tsx)
 * * Objetivo: Apresentar o Vizbio e fazer o usuário baixar o app Android.
 * * Este é um "Server Component" (sem "use client"), para performance máxima.
 */

import type { Metadata } from 'next';

// Metadados para SEO (Google) e compartilhamento (WhatsApp)
export const metadata: Metadata = {
  title: 'Vizbio.pro - Sua Bio, Mais Visual',
  description: 'Crie um link-na-bio com banners clicáveis em vez de botões. Baixe o app e crie seu perfil visual em minutos.',
  // Você pode adicionar uma imagem de compartilhamento aqui
  openGraph: {
    title: 'Vizbio.pro',
    description: 'Sua bio, mais visual.',
    images: ['/og-image.png'], // Coloque esta imagem na pasta /public
  },
};

// --- Ícones SVG para uso na página ---

// Ícone de Download
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// Ícone para "Crie no App"
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z" /></svg>
);

// Ícone para "100% Visual"
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);

// Ícone para "Compartilhe Fácil"
const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
);

// --- Componente da Página ---
export default function Page() {
  return (
    // Usamos Tailwind para um design 'dark mode' moderno
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans antialiased">

      {/* 1. Header (Cabeçalho) */}
      <header className="container mx-auto max-w-5xl px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Sua Marca */}
          <span className="text-2xl font-bold text-white">Vizbio.pro</span>
          {/* Botão de Download no Header */}
          <a
            href="https://wa.me/5548920009313" // <-- LINK ATUALIZADO
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gray-900 font-medium py-2 px-5 rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            Baixar App
          </a>
        </nav>
      </header>

      {/* 2. Seção Hero (Principal) */}
      <main className="flex-grow">
        <section className="container mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
          {/* Título Principal */}
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Sua bio, mais visual.
          </h1>
          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Troque botões de links por banners clicáveis que seus seguidores
            vão adorar. Crie seu perfil visual em minutos.
          </p>
          {/* Botão de Ação (CTA) */}
          <a
            href="https://wa.me/5548920009313" // <-- LINK ATUALIZADO
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <DownloadIcon className="mr-2 -ml-1" />
            Baixar App (Android)
          </a>
        </section>

        {/* 3. Imagem do Produto (Mockup) */}
        <section className="container mx-auto max-w-3xl px-6">
          <div className="bg-gray-800 rounded-3xl p-4 border border-gray-700 shadow-xl">
            {/* * IMPORTANTE: Troque este placeholder pela imagem do seu app.
              * A imagem de exemplo que você mandou (1000091479.jpg) seria perfeita aqui!
              * Suba ela para a pasta /public e mude o 'src' para '/1000091479.jpg' 
            */}
            <img
              src="https://placehold.co/1000x750/111827/7C3AED?text=Exemplo+de+Perfil+Vizbio&font=inter"
              alt="Exemplo de um perfil Vizbio com banners visuais"
              className="rounded-xl w-full"
              // A função 'onError' foi removida para corrigir o erro de build do Server Component
            />
          </div>
        </section>

        {/* 4. Seção de Features ("Sobre a plataforma") */}
        <section className="py-24 bg-gray-900">
          <div className="container mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Uma ferramenta completa no seu bolso
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              
              {/* Feature 1 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                <EditIcon className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Crie no App</h3>
                <p className="text-gray-400">
                  Baixe o app, crie sua conta e gerencie seus links e banners
                  facilmente pelo celular.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                <EyeIcon className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">100% Visual</h3>
                <p className="text-gray-400">
                  Destaque produtos, vídeos e redes sociais com
                  imagens que chamam a atenção.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                <ShareIcon className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Compartilhe Fácil</h3>
                <p className="text-gray-400">
                  Use seu link vizbio.pro no Instagram, TikTok,
                  ou em qualquer lugar.
                </p>
                {/* A TAG <pre> QUE ESTAVA AQUI FOI REMOVIDA. AGORA ESTÁ CORRETO. */}
              </div>

            </div>
          </div>
        </section>

        {/* 5. Seção de Download (CTA Final) */}
        <section id="download" className="py-20 bg-gray-800 text-center">
          <div className="container mx-auto max-w-3xl px-6">
            <h2 className="text-3xl font-bold mb-4">Comece agora, é grátis.</h2>
            <p className="text-lg text-gray-300 mb-8">
              Baixe o aplicativo Vizbio para Android e configure seu
              perfil visual hoje mesmo.
            </p>
            <a
              href="https://wa.me/5548920009313" // <-- LINK ATUALIZADO
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <DownloadIcon className="mr-2 -ml-1" />
              Baixar App (WhatsApp)
            </a>
          </div>
        </section>
      </main>

      {/* 6. Footer (Rodapé) */}
      <footer className="py-8 border-t border-gray-800">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vizbio.pro. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}
