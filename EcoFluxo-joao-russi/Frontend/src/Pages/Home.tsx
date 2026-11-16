import { Link } from "react-router-dom";

interface HomeProps {
  user: { id?: number } | null;
}

export default function Home({ user }: HomeProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center w-full">
      <h1 className="text-5xl font-black text-emerald-900 leading-tight">
        Bem-vindo ao <span className="text-emerald-600 italic">EcoFluxo</span>
      </h1>
      <p className="text-xl text-emerald-900 font-medium max-w-2xl mt-4">
        Gestão inteligente de resíduos e monitoramento em tempo real para cidades mais sustentáveis.
      </p>
      {user && (
        <div className="mt-10 flex w-full max-w-xl flex-col gap-4 sm:flex-row">
          <Link
            to="/ecopontos"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors active:scale-[0.98] no-underline text-center"
          >
            Ver ecopontos
          </Link>
          <Link
            to="/lixeiras"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors active:scale-[0.98] no-underline text-center"
          >
            Ver lixeiras
          </Link>
        </div>
      )}
    </div>
  );
}
