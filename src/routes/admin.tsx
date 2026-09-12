import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { LogOut, Trash2, Upload } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { adminUnlock } from "@/lib/admin-gate.functions";
import {
  STORAGE_PREFIX,
  adminArtworksQueryOptions,
  type AdminArtwork,
  type Impresion,
} from "@/lib/artworks";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel del artista — T·A·P·S·N" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type AdminObra = AdminArtwork;

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
              Tu cuenta ({session.user.email}) está creada. Avisame por el chat y te habilito como
              administrador para subir obras.
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
  const unlock = useServerFn(adminUnlock);
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await unlock({ data: { pin } });
      if (!res.ok || !("tokenHash" in res) || !res.tokenHash) {
        setMsg("Clave incorrecta.");
      } else {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: res.tokenHash,
          type: "email",
        });
        if (error) setMsg(error.message);
      }
    } catch {
      setMsg("No se pudo entrar. Probá de nuevo.");
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-3xl font-light tracking-tight">Entrar al panel</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Escribí tu clave. La sesión queda guardada en este dispositivo.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input
          type="password"
          required
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Clave"
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-center font-mono text-lg tracking-[0.4em] outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-primary px-4 py-3 font-mono text-[11px] tracking-[0.25em] text-primary-foreground uppercase transition-opacity disabled:opacity-50"
        >
          {busy ? "…" : "Entrar"}
        </button>
        {msg && <p className="text-sm text-neon">{msg}</p>}
      </form>
    </div>
  );
}

function NewPasswordForm({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMsg(error.message);
    else onDone();
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-3xl font-light tracking-tight">Nueva contraseña</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nueva contraseña"
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-primary px-4 py-3 font-mono text-[11px] tracking-[0.25em] text-primary-foreground uppercase transition-opacity disabled:opacity-50"
        >
          {busy ? "…" : "Guardar contraseña"}
        </button>
        {msg && <p className="text-sm text-neon">{msg}</p>}
      </form>
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

/** [{escala:"A4",precio:80}, ...] -> "A4=80, A3=120" */
function serializeImpresiones(list: Impresion[]): string {
  return list.map((i) => `${i.escala}=${i.precio}`).join(", ");
}

function EditObraForm({
  obra,
  onSaved,
  onCancel,
}: {
  obra: AdminObra;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [titulo, setTitulo] = useState(obra.titulo);
  const [tecnica, setTecnica] = useState(obra.tecnica);
  const [soporte, setSoporte] = useState(obra.soporte);
  const [formato, setFormato] = useState(obra.formato);
  const [anio, setAnio] = useState(obra.anio ? String(obra.anio) : "");
  const [descripcion, setDescripcion] = useState(obra.descripcion);
  const [precioOriginal, setPrecioOriginal] = useState(
    obra.precio_original !== null ? String(obra.precio_original) : "",
  );
  const [precioMarco, setPrecioMarco] = useState(String(obra.precio_marco ?? 0));
  const [precioMagnetico, setPrecioMagnetico] = useState(String(obra.precio_marco_magnetico ?? 0));
  const [impresiones, setImpresiones] = useState(serializeImpresiones(obra.impresiones));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase
        .from("artworks")
        .update({
          titulo: titulo.trim() || obra.titulo,
          tecnica,
          soporte,
          formato,
          anio: anio ? Number(anio) : null,
          descripcion,
          precio_original: precioOriginal ? Number(precioOriginal) : null,
          precio_marco: precioMarco ? Number(precioMarco) : 0,
          precio_marco_magnetico: precioMagnetico ? Number(precioMagnetico) : 0,
          impresiones: parseImpresiones(impresiones),
        })
        .eq("id", obra.id);
      if (error) throw error;
      onSaved();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "No se pudo guardar");
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <form
      onSubmit={save}
      className="mt-3 space-y-3 rounded-xl border border-border/70 bg-card/40 p-4"
    >
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título"
        className={inputCls}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          value={tecnica}
          onChange={(e) => setTecnica(e.target.value)}
          placeholder="Técnica"
          className={inputCls}
        />
        <input
          value={soporte}
          onChange={(e) => setSoporte(e.target.value)}
          placeholder="Soporte"
          className={inputCls}
        />
        <input
          value={formato}
          onChange={(e) => setFormato(e.target.value)}
          placeholder="Formato (ej. 30 × 40 cm)"
          className={inputCls}
        />
        <input
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          placeholder="Año"
          inputMode="numeric"
          className={inputCls}
        />
      </div>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
        rows={3}
        className={inputCls}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          value={precioOriginal}
          onChange={(e) => setPrecioOriginal(e.target.value)}
          placeholder="Precio del original"
          inputMode="numeric"
          className={inputCls}
        />
        <input
          value={precioMarco}
          onChange={(e) => setPrecioMarco(e.target.value)}
          placeholder="Extra enmarcado tradicional"
          inputMode="numeric"
          className={inputCls}
        />
        <input
          value={precioMagnetico}
          onChange={(e) => setPrecioMagnetico(e.target.value)}
          placeholder="Extra marco magnético"
          inputMode="numeric"
          className={inputCls}
        />
        <input
          value={impresiones}
          onChange={(e) => setImpresiones(e.target.value)}
          placeholder="Impresiones: A4=80, A3=120"
          className={inputCls}
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-4 py-2.5 font-mono text-[11px] tracking-[0.25em] text-primary-foreground uppercase transition-opacity disabled:opacity-50"
        >
          {busy ? "Guardando…" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          Cancelar
        </button>
        {msg && <p className="text-sm text-neon">{msg}</p>}
      </div>
    </form>
  );
}

function AdminPanel({ session }: { session: Session }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: obras = [] } = useQuery(adminArtworksQueryOptions);
  const [files, setFiles] = useState<File[]>([]);
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
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setBusy(true);
    setMsg(null);
    try {
      const next = obras.length + 1;
      const num = String(next).padStart(2, "0");
      const slug = `obra-${num}`;
      const imageRefs: string[] = [];
      for (let index = 0; index < files.length; index++) {
        const currentFile = files[index];
        if (!currentFile) continue;
        const ext = (currentFile.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${slug}/toma-${String(index + 1).padStart(2, "0")}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("obras")
          .upload(path, currentFile, { contentType: currentFile.type, upsert: true });
        if (upErr) throw upErr;
        imageRefs.push(`${STORAGE_PREFIX}${path}`);
      }
      const mainImage = imageRefs[0];
      if (!mainImage) throw new Error("No se pudo cargar ninguna foto");

      const { error: insErr } = await supabase.from("artworks").insert({
        slug,
        catalogo: `TA-${num}`,
        titulo: titulo.trim() || `Obra ${num}`,
        anio: anio ? Number(anio) : null,
        tecnica,
        soporte,
        formato,
        descripcion,
        imagen_url: mainImage,
        imagenes: imageRefs,
        orden: next,
        precio_original: precioOriginal ? Number(precioOriginal) : null,
        precio_marco: precioMarco ? Number(precioMarco) : 0,
        precio_marco_magnetico: precioMagnetico ? Number(precioMagnetico) : 0,
        impresiones: parseImpresiones(impresiones),
      });
      if (insErr) throw insErr;

      setMsg(`✓ ${titulo.trim() || `Obra ${num}`} cargada como TA-${num}`);
      setFiles([]);
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
      await queryClient.invalidateQueries({ queryKey: ["artworks"] });
      router.invalidate();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error al subir la obra");
    }
    setBusy(false);
  }

  async function addPhotos(obra: AdminObra, selected: FileList | null) {
    const newFiles = Array.from(selected ?? []);
    if (newFiles.length === 0) return;
    setAddingTo(obra.id);
    setMsg(null);
    try {
      const existing = obra.imagenes.length > 0 ? obra.imagenes : [obra.imagen_url];
      const additions: string[] = [];
      for (let index = 0; index < newFiles.length; index++) {
        const currentFile = newFiles[index];
        if (!currentFile) continue;
        const ext = (currentFile.name.split(".").pop() || "jpg").toLowerCase();
        const number = existing.length + index + 1;
        const path = `${obra.slug}/toma-${String(number).padStart(2, "0")}.${ext}`;
        const { error } = await supabase.storage
          .from("obras")
          .upload(path, currentFile, { contentType: currentFile.type, upsert: false });
        if (error) throw error;
        additions.push(`${STORAGE_PREFIX}${path}`);
      }
      const imagenes = [...existing, ...additions];
      const { error } = await supabase.from("artworks").update({ imagenes }).eq("id", obra.id);
      if (error) throw error;
      setMsg(
        `✓ ${additions.length} foto${additions.length === 1 ? "" : "s"} agregada${additions.length === 1 ? "" : "s"} a ${obra.titulo}`,
      );
      await queryClient.invalidateQueries({ queryKey: ["artworks"] });
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "No se pudieron agregar las fotos");
    }
    setAddingTo(null);
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
    await queryClient.invalidateQueries({ queryKey: ["artworks"] });
    router.invalidate();
  }

  async function remove(obra: AdminObra) {
    if (!confirm(`¿Borrar «${obra.titulo}» (${obra.catalogo})?`)) return;
    await supabase.from("artworks").delete().eq("id", obra.id);
    const refs = obra.imagenes.length > 0 ? obra.imagenes : [obra.imagen_url];
    const storedPaths = refs
      .filter((ref) => ref.startsWith(STORAGE_PREFIX))
      .map((ref) => ref.slice(STORAGE_PREFIX.length));
    if (storedPaths.length > 0) await supabase.storage.from("obras").remove(storedPaths);

    // Reenumerar para que queden secuenciales TA-01, TA-02, … sin saltos.
    const { data: rest } = await supabase
      .from("artworks")
      .select("id, slug, imagen_url, imagenes")
      .order("orden", { ascending: true });
    const rows = (rest ?? []) as {
      id: string;
      slug: string;
      imagen_url: string;
      imagenes: string[];
    }[];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      const num = String(i + 1).padStart(2, "0");
      const newSlug = `obra-${num}`;
      const newCatalogo = `TA-${num}`;
      const refs = row.imagenes.length > 0 ? row.imagenes : [row.imagen_url];
      const renamedRefs: string[] = [];
      for (const ref of refs) {
        if (!ref.startsWith(STORAGE_PREFIX)) {
          renamedRefs.push(ref);
          continue;
        }
        const oldPath = ref.slice(STORAGE_PREFIX.length);
        const newPath = oldPath.replace(/^obra-\d+/, newSlug);
        if (oldPath !== newPath) await supabase.storage.from("obras").move(oldPath, newPath);
        renamedRefs.push(`${STORAGE_PREFIX}${newPath}`);
      }
      const newImagenUrl = renamedRefs[0] ?? row.imagen_url;
      await supabase
        .from("artworks")
        .update({
          slug: newSlug,
          catalogo: newCatalogo,
          orden: i + 1,
          imagen_url: newImagenUrl,
          imagenes: renamedRefs,
        })
        .eq("id", row.id);
    }

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
            {files.length > 0
              ? `${files.length} foto${files.length === 1 ? "" : "s"} seleccionada${files.length === 1 ? "" : "s"}`
              : "Elegir una o varias fotos de la obra"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
          </label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título (opcional, se numera solo)"
            className={inputCls}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              value={tecnica}
              onChange={(e) => setTecnica(e.target.value)}
              placeholder="Técnica"
              className={inputCls}
            />
            <input
              value={soporte}
              onChange={(e) => setSoporte(e.target.value)}
              placeholder="Soporte"
              className={inputCls}
            />
            <input
              value={formato}
              onChange={(e) => setFormato(e.target.value)}
              placeholder="Formato (ej. 30 × 40 cm)"
              className={inputCls}
            />
            <input
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              placeholder="Año"
              inputMode="numeric"
              className={inputCls}
            />
          </div>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={3}
            className={inputCls}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              value={precioOriginal}
              onChange={(e) => setPrecioOriginal(e.target.value)}
              placeholder="Precio del original"
              inputMode="numeric"
              className={inputCls}
            />
            <input
              value={precioMarco}
              onChange={(e) => setPrecioMarco(e.target.value)}
              placeholder="Extra enmarcado tradicional"
              inputMode="numeric"
              className={inputCls}
            />
            <input
              value={precioMagnetico}
              onChange={(e) => setPrecioMagnetico(e.target.value)}
              placeholder="Extra marco magnético"
              inputMode="numeric"
              className={inputCls}
            />
            <input
              value={impresiones}
              onChange={(e) => setImpresiones(e.target.value)}
              placeholder="Impresiones: A4=80, A3=120"
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={busy || files.length === 0}
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
            <li key={o.id} className="py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-neon/80">
                    {o.catalogo}
                  </span>
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
                    onClick={() => setEditingId(editingId === o.id ? null : o.id)}
                    className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-colors ${editingId === o.id ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    {editingId === o.id ? "Cerrar" : "Editar"}
                  </button>
                  <label className="cursor-pointer font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary">
                    {addingTo === o.id ? "Subiendo…" : `+ Fotos (${o.imagenes.length || 1})`}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={addingTo !== null}
                      className="hidden"
                      onChange={(event) => {
                        void addPhotos(o, event.target.files);
                        event.target.value = "";
                      }}
                    />
                  </label>
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
              </div>
              {editingId === o.id && (
                <EditObraForm
                  obra={o}
                  onCancel={() => setEditingId(null)}
                  onSaved={async () => {
                    setEditingId(null);
                    await queryClient.invalidateQueries({ queryKey: ["artworks"] });
                    router.invalidate();
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
