import { createServerFn } from "@tanstack/react-start";
import { createHash, timingSafeEqual } from "node:crypto";

function matches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

/**
 * Verifica una clave corta y, si es correcta, devuelve un token de un solo uso
 * para abrir la sesión del administrador en el navegador.
 */
export const adminUnlock = createServerFn({ method: "POST" })
  .inputValidator((data: { pin: string }) => data)
  .handler(async ({ data }) => {
    const pin = process.env["ADMIN_PIN"];
    const email = process.env["ADMIN_EMAIL"];
    if (!pin || !email) throw new Error("Falta configurar ADMIN_PIN o ADMIN_EMAIL");

    if (!data.pin || !matches(data.pin, pin)) {
      return { ok: false as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: link, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (error || !link?.properties?.hashed_token) {
      return { ok: false as const, error: error?.message ?? "No se pudo iniciar sesión" };
    }

    return { ok: true as const, tokenHash: link.properties.hashed_token };
  });
