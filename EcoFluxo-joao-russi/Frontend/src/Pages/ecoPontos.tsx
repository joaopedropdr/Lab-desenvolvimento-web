import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ecopontoApi } from "../utils/api";

interface Ecoponto {
  id: number;
  nome: string;
  latitude: string;
  longitude: string;
  descricao?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  nota?: number | null;
}

interface EcoPontosProps {
  user: { perfil?: string } | null;
}

const inputClassName = "w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export default function EcoPontos({ user }: EcoPontosProps) {
  const [ecopontos, setEcopontos] = useState<Ecoponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [formAberto, setFormAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [form, setForm] = useState({
    nome: "",
    latitude: "",
    longitude: "",
    descricao: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
  });
  const gestor = user?.perfil?.toUpperCase() === "GESTOR";

  const carregarEcopontos = useCallback(async () => {
    setCarregando(true);
    try {
      const response = await ecopontoApi.getAll();
      setEcopontos(response.data);
      setErro("");
    } catch (error: any) {
      setErro(error.response?.data?.message || "Não foi possível carregar os ecopontos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarEcopontos();
  }, [carregarEcopontos]);

  const cadastrarEcoponto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      await ecopontoApi.create(form);
      setForm({ nome: "", latitude: "", longitude: "", descricao: "", cep: "", logradouro: "", numero: "", bairro: "", cidade: "", uf: "" });
      setMensagem("Ecoponto cadastrado com sucesso.");
      setFormAberto(false);
      await carregarEcopontos();
    } catch (error: any) {
      setErro(error.response?.data?.message || "Não foi possível cadastrar o ecoponto.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-semibold uppercase tracking-widest text-emerald-600">EcoFluxo</p>
          <h1 className="mt-2 text-4xl font-black text-emerald-950">Ecopontos</h1>
          <p className="mt-2 text-emerald-800">Encontre os pontos de coleta disponíveis.</p>
        </div>
        {gestor && (
          <button
            type="button"
            onClick={() => setFormAberto(!formAberto)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors active:scale-[0.98]"
          >
            {formAberto ? "Cancelar" : "Cadastrar ecoponto"}
          </button>
        )}
      </div>

      {mensagem && <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-4 font-semibold text-emerald-800">{mensagem}</p>}
      {erro && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 font-semibold text-red-700">{erro}</p>}

      {gestor && formAberto && (
        <form onSubmit={cadastrarEcoponto} className="mb-8 grid gap-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm font-semibold text-emerald-950">Nome<input className={inputClassName} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required /></label>
          <label className="text-sm font-semibold text-emerald-950">Latitude<input className={inputClassName} value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} required /></label>
          <label className="text-sm font-semibold text-emerald-950">Longitude<input className={inputClassName} value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} required /></label>
          <label className="text-sm font-semibold text-emerald-950">Descrição<input className={inputClassName} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></label>
          <label className="text-sm font-semibold text-emerald-950">CEP<input className={inputClassName} value={form.cep} onChange={e => setForm({ ...form, cep: e.target.value })} /></label>
          <label className="text-sm font-semibold text-emerald-950">Logradouro<input className={inputClassName} value={form.logradouro} onChange={e => setForm({ ...form, logradouro: e.target.value })} /></label>
          <label className="text-sm font-semibold text-emerald-950">Número<input className={inputClassName} value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} /></label>
          <label className="text-sm font-semibold text-emerald-950">Bairro<input className={inputClassName} value={form.bairro} onChange={e => setForm({ ...form, bairro: e.target.value })} /></label>
          <label className="text-sm font-semibold text-emerald-950">Cidade<input className={inputClassName} value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} /></label>
          <label className="text-sm font-semibold text-emerald-950">UF<input className={inputClassName} maxLength={2} value={form.uf} onChange={e => setForm({ ...form, uf: e.target.value.toUpperCase() })} /></label>
          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <button disabled={salvando} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors active:scale-[0.98] disabled:opacity-60">
              {salvando ? "Salvando…" : "Salvar ecoponto"}
            </button>
          </div>
        </form>
      )}

      {carregando ? (
        <p className="py-12 text-center font-semibold text-emerald-700">Carregando ecopontos…</p>
      ) : ecopontos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-12 text-center text-emerald-800">Nenhum ecoponto cadastrado ainda.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ecopontos.map(ecoponto => (
            <article key={ecoponto.id} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-emerald-950">{ecoponto.nome}</h2>
              {ecoponto.descricao && <p className="mt-2 text-emerald-800">{ecoponto.descricao}</p>}
              <p className="mt-4 text-sm font-semibold text-emerald-700">
                {[ecoponto.logradouro, ecoponto.numero, ecoponto.bairro].filter(Boolean).join(", ") || "Endereço não informado"}
              </p>
              <p className="mt-1 text-sm text-emerald-800">{[ecoponto.cidade, ecoponto.uf].filter(Boolean).join(" - ")}</p>
              {ecoponto.cep && <p className="mt-1 text-sm text-emerald-800">CEP {ecoponto.cep}</p>}
              <p className="mt-4 border-t border-emerald-50 pt-3 text-xs text-emerald-600">{ecoponto.latitude}, {ecoponto.longitude}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
