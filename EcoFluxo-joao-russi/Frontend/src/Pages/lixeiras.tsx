import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ecopontoApi, lixeiraApi } from "../utils/api";

type TipoLixeira = "PLASTICO" | "PAPEL" | "VIDRO" | "METAL" | "ORGANICO";

interface Lixeira {
  id: number;
  uuid_sensor: string;
  tipo: TipoLixeira;
  volume_max: number;
  nivel_cheio: number;
  ecoponto_id: number;
  ecoponto?: { id: number; nome: string };
}

interface EcopontoOpcao {
  id: number;
  nome: string;
}

interface LixeirasProps {
  user: { perfil?: string } | null;
}

const inputClassName = "w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
const tipos: TipoLixeira[] = ["PLASTICO", "PAPEL", "VIDRO", "METAL", "ORGANICO"];

export default function Lixeiras({ user }: LixeirasProps) {
  const [lixeiras, setLixeiras] = useState<Lixeira[]>([]);
  const [ecopontos, setEcopontos] = useState<EcopontoOpcao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [formAberto, setFormAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [form, setForm] = useState({
    uuid_sensor: "",
    tipo: "PLASTICO" as TipoLixeira,
    volume_max: "",
    nivel_cheio: "",
    ecoponto_id: "",
  });
  const gestor = user?.perfil?.toUpperCase() === "GESTOR";

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const [lixeirasResponse, ecopontosResponse] = await Promise.all([
        lixeiraApi.getAll(),
        ecopontoApi.getAll(),
      ]);
      setLixeiras(lixeirasResponse.data);
      setEcopontos(ecopontosResponse.data.map((item: EcopontoOpcao) => ({ id: item.id, nome: item.nome })));
      setErro("");
    } catch (error: any) {
      setErro(error.response?.data?.message || "Não foi possível carregar as lixeiras.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  const cadastrarLixeira = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      await lixeiraApi.create({
        uuid_sensor: form.uuid_sensor,
        tipo: form.tipo,
        volume_max: Number(form.volume_max),
        nivel_cheio: Number(form.nivel_cheio),
        ecoponto_id: Number(form.ecoponto_id),
      });
      setForm({ uuid_sensor: "", tipo: "PLASTICO", volume_max: "", nivel_cheio: "", ecoponto_id: "" });
      setMensagem("Lixeira cadastrada com sucesso.");
      setFormAberto(false);
      await carregarDados();
    } catch (error: any) {
      setErro(error.response?.data?.message || "Não foi possível cadastrar a lixeira.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-semibold uppercase tracking-widest text-emerald-600">EcoFluxo</p>
          <h1 className="mt-2 text-4xl font-black text-emerald-950">Lixeiras</h1>
          <p className="mt-2 text-emerald-800">Consulte os sensores instalados nos ecopontos.</p>
        </div>
        {gestor && (
          <button
            type="button"
            onClick={() => setFormAberto(!formAberto)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors active:scale-[0.98]"
          >
            {formAberto ? "Cancelar" : "Cadastrar lixeira"}
          </button>
        )}
      </div>

      {mensagem && <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-4 font-semibold text-emerald-800">{mensagem}</p>}
      {erro && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 font-semibold text-red-700">{erro}</p>}

      {gestor && formAberto && (
        <form onSubmit={cadastrarLixeira} className="mb-8 grid gap-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm font-semibold text-emerald-950">UUID do sensor<input className={inputClassName} value={form.uuid_sensor} onChange={e => setForm({ ...form, uuid_sensor: e.target.value })} required /></label>
          <label className="text-sm font-semibold text-emerald-950">Material<select className={inputClassName} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as TipoLixeira })}>{tipos.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}</select></label>
          <label className="text-sm font-semibold text-emerald-950">Volume máximo<input className={inputClassName} type="number" min="1" step="1" value={form.volume_max} onChange={e => setForm({ ...form, volume_max: e.target.value })} required /></label>
          <label className="text-sm font-semibold text-emerald-950">Nível cheio<input className={inputClassName} type="number" min="1" step="1" value={form.nivel_cheio} onChange={e => setForm({ ...form, nivel_cheio: e.target.value })} required /></label>
          <label className="text-sm font-semibold text-emerald-950">Ecoponto<select className={inputClassName} value={form.ecoponto_id} onChange={e => setForm({ ...form, ecoponto_id: e.target.value })} required>
            <option value="">Selecione um ecoponto</option>
            {ecopontos.map(ecoponto => <option key={ecoponto.id} value={ecoponto.id}>{ecoponto.nome}</option>)}
          </select></label>
          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <button disabled={salvando || ecopontos.length === 0} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors active:scale-[0.98] disabled:opacity-60">
              {salvando ? "Salvando…" : "Salvar lixeira"}
            </button>
            {ecopontos.length === 0 && <p className="ml-4 text-sm text-amber-700">Cadastre um ecoponto antes de criar uma lixeira.</p>}
          </div>
        </form>
      )}

      {carregando ? (
        <p className="py-12 text-center font-semibold text-emerald-700">Carregando lixeiras…</p>
      ) : lixeiras.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-12 text-center text-emerald-800">Nenhuma lixeira cadastrada ainda.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lixeiras.map(lixeira => (
            <article key={lixeira.id} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-black text-emerald-950">{lixeira.tipo}</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">#{lixeira.id}</span>
              </div>
              <p className="mt-4 text-sm text-emerald-800">Sensor: <span className="font-semibold">{lixeira.uuid_sensor}</span></p>
              <p className="mt-2 text-sm text-emerald-800">Volume máximo: <span className="font-semibold">{lixeira.volume_max}</span></p>
              <p className="mt-1 text-sm text-emerald-800">Nível cheio: <span className="font-semibold">{lixeira.nivel_cheio}</span></p>
              <p className="mt-4 border-t border-emerald-50 pt-3 text-sm font-semibold text-emerald-700">{lixeira.ecoponto?.nome || `Ecoponto #${lixeira.ecoponto_id}`}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
