import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { LogOut, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_PREFIX } from "@/lib/artworks";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel del artista — T·A·P·S·N" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

interface AdminObra {
  id: string;
  slug: string;
  catalogo: string;
  titulo: string;
  imagen_url: string;
  orden: number;
  original_vendido: boolean;
}

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .rpc("has_role", { _user_id: session.user.id, _role: "admin" })
      .then(({ data, error }) => {
        setIsAdmin(error ? false : Boolean(data));
        setLoading(false);
      });
  }, [session]);


  return (
    <div className="grain-overlay min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link
            to="/"
            className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase transition-colors hover:text-neon"
          >
            ← Muro
          </Link>
          <span className="font-mono text-[11px] tracking-[0.3em] text-neon uppercase">
            Panel del artista
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14">
        {loading ? (
          <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
            Cargando…
          </p>
        ) : !session ? (
          <AuthForm />
        ) : recovery ? (
          <NewPasswordForm onDone={() => setRecovery(false)} />
        ) : isAdmin ? (
          <AdminPanel session={session} />

        ) : (
          <div className="rounded-2xl border border-border/70 bg-card p-8 text-center">
            <p className="font-display text-2xl font-light">Cuenta sin permisos de carga</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Tu cuenta ({session.user.email}) está creada. Avisame por el chat y te
              habilito como administrador para subir obras.
            </p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-6 font-mono text-[11px] tracking-[0.25em] text-primary uppercase"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setMsg(error ? error.message : "Revisá tu correo para confirmar la cuenta.");
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-3xl font-light tracking-tight">
        {mode === "login" ? "Entrar al panel" : "Crear cuenta"}
      </h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-primary px-4 py-3 font-mono text-[11px] tracking-[0.25em] text-primary-foreground uppercase transition-opacity disabled:opacity-50"
        >
          {busy ? "…" : mode === "login" ? "Entrar" : "Registrarme"}
        </button>
        {msg && <p className="text-sm text-neon">{msg}</p>}
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-6 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary"
      >
        {mode === "login" ? "¿Primera vez? Crear cuenta" : "Ya tengo cuenta"}
      </button>
    </div>
  );
}

/** "A4=80, A3=120" -> [{escala:"A4",precio:80}, ...] */
function parseImpresiones(txt: string) {
  return txt
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const [escala, precio] = p.split("=");
      return { escala: (escala ?? "").trim(), precio: Number((precio ?? "0").trim()) };
    })
    .filter((i) => i.escala !== "" && Number.isFinite(i.precio));
}

function AdminPanel({ session }: { session: Session }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [obras, setObras] = useState<AdminObra[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [tecnica, setTecnica] = useState("");
  const [soporte, setSoporte] = useState("");
  const [formato, setFormato] = useState("");
  const [anio, setAnio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioOriginal, setPrecioOriginal] = useState("");
  const [precioMarco, setPrecioMarco] = useState("");
  const [precioMagnetico, setPrecioMagnetico] = useState("");
  const [impresiones, setImpresiones] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("artworks")
      .select("id, slug, catalogo, titulo, imagen_url, orden, original_vendido")
      .order("orden", { ascending: true });
    setObras((data ?? []) as AdminObra[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const next = obras.length + 1;
      const num = String(next).padStart(2, "0");
      const slug = `obra-${num}`;
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${slug}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("obras")
        .upload(path, file, { contentType: file.type, upsert: true });
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from("artworks").insert({
        slug,
        catalogo: `TA-${num}`,
        titulo: titulo.trim() || `Obra ${num}`,
        anio: anio ? Number(anio) : null,
        tecnica,
        soporte,
        formato,
        descripcion,
        imagen_url: `${STORAGE_PREFIX}${path}`,
        orden: next,
        precio_original: precioOriginal ? Number(precioOriginal) : null,
        precio_marco: precioMarco ? Number(precioMarco) : 0,
        precio_marco_magnetico: precioMagnetico ? Number(precioMagnetico) : 0,
        impresiones: parseImpresiones(impresiones),
      });
      if (insErr) throw insErr;

      setMsg(`✓ ${titulo.trim() || `Obra ${num}`} cargada como TA-${num}`);
      setFile(null);
      setTitulo("");
      setTecnica("");
      setSoporte("");
      setFormato("");
      setAnio("");
      setDescripcion("");
      setPrecioOriginal("");
      setPrecioMarco("");
      setPrecioMagnetico("");
      setImpresiones("");
      await load();
      await queryClient.invalidateQueries({ queryKey: ["artworks"] });
      router.invalidate();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error al subir la obra");
    }
    setBusy(false);
  }

  async function toggleVendida(obra: AdminObra) {
    const nuevo = !obra.original_vendido;
    if (
      nuevo &&
      !confirm(
        `Marcar «${obra.titulo}» como vendida cierra su edición para siempre: no se podrán vender impresiones. ¿Confirmás?`,
      )
    )
      return;
    await supabase.from("artworks").update({ original_vendido: nuevo }).eq("id", obra.id);
    await load();
    await queryClient.invalidateQueries({ queryKey: ["artworks"] });
    router.invalidate();
  }

  async function remove(obra: AdminObra) {
    if (!confirm(`¿Borrar «${obra.titulo}» (${obra.catalogo})?`)) return;
    await supabase.from("artworks").delete().eq("id", obra.id);
    if (obra.imagen_url.startsWith(STORAGE_PREFIX)) {
      await supabase.storage
        .from("obras")
        .remove([obra.imagen_url.slice(STORAGE_PREFIX.length)]);
    }
    await load();
    await queryClient.invalidateQueries({ queryKey: ["artworks"] });
  }

  const inputCls =
    "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
          {session.user.email} · {obras.length} obras
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-neon"
        >
          <LogOut className="h-3.5 w-3.5" /> Salir
        </button>
      </div>

      {/* Formulario de carga */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6">
        <h1 className="font-display text-2xl font-light tracking-tight">Cargar nueva obra</h1>
        <form onSubmit={upload} className="mt-6 space-y-4">
          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
            <Upload className="h-4 w-4" />
            {file ? file.name : "Elegir foto de la pintura"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título (opcional, se numera solo)"
            className={inputCls}
          />
          <div className="grid grid-cols-2 gap-4">
            <input value={tecnica} onChange={(e) => setTecnica(e.target.value)} placeholder="Técnica" className={inputCls} />
            <input value={soporte} onChange={(e) => setSoporte(e.target.value)} placeholder="Soporte" className={inputCls} />
            <input value={formato} onChange={(e) => setFormato(e.target.value)} placeholder="Formato (ej. 30 × 40 cm)" className={inputCls} />
            <input value={anio} onChange={(e) => setAnio(e.target.value)} placeholder="Año" inputMode="numeric" className={inputCls} />
          </div>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={3}
            className={inputCls}
          />
          <div className="grid grid-cols-2 gap-4">
            <input value={precioOriginal} onChange={(e) => setPrecioOriginal(e.target.value)} placeholder="Precio del original" inputMode="numeric" className={inputCls} />
            <input value={precioMarco} onChange={(e) => setPrecioMarco(e.target.value)} placeholder="Extra enmarcado tradicional" inputMode="numeric" className={inputCls} />
            <input value={precioMagnetico} onChange={(e) => setPrecioMagnetico(e.target.value)} placeholder="Extra marco magnético" inputMode="numeric" className={inputCls} />
            <input value={impresiones} onChange={(e) => setImpresiones(e.target.value)} placeholder="Impresiones: A4=80, A3=120" className={inputCls} />
          </div>
          <button
            type="submit"
            disabled={busy || !file}
            className="w-full rounded-lg bg-primary px-4 py-3 font-mono text-[11px] tracking-[0.25em] text-primary-foreground uppercase transition-opacity disabled:opacity-50"
          >
            {busy ? "Subiendo…" : "Subir al muro"}
          </button>
          {msg && <p className="text-sm text-neon">{msg}</p>}
        </form>
      </section>

      {/* Listado */}
      <section>
        <h2 className="font-display text-2xl font-light tracking-tight">Obras cargadas</h2>
        <ul className="mt-6 divide-y divide-border/60">
          {obras.map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] tracking-[0.18em] text-neon/80">{o.catalogo}</span>
                <Link
                  to="/obras/$slug"
                  params={{ slug: o.slug }}
                  className="text-sm transition-colors hover:text-primary"
                >
                  {o.titulo}
                </Link>
              </div>
              <div className="flex items-center gap-4">
              <button
                onClick={() => toggleVendida(o)}
                className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-colors ${o.original_vendido ? "text-neon" : "text-muted-foreground hover:text-primary"}`}
              >
                {o.original_vendido ? "Vendida" : "Disponible"}
              </button>
              <button
                onClick={() => remove(o)}
                aria-label={`Borrar ${o.titulo}`}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
