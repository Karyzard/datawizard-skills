# Konverzní manuál: Lovable prototyp → Next.js + Supabase

Tento dokument popisuje postup převodu prototypu vytvořeného v Lovable (React + Vite + Tailwind + shadcn/ui) do produkčního Next.js stacku s Supabase backendem, autentizací a databází.

**Klíčový rozdíl oproti Astro konverzi:** Lovable je už React — komponenty se nepřepisují, jen reorganizují. Hlavní práce je přidání auth, napojení na Supabase, přechod z lokálního stavu na React Query a zavedení SSR patterns.

**Self-contained:** Všechny šablonové soubory jsou ve složce [sablona/](sablona/) — není potřeba kopírovat z jiného projektu.

---

## Přehled konverze

| Z (Lovable) | Na (Next.js + Supabase) |
|---|---|
| React 18 SPA | Next.js 15 App Router |
| Vite (build tool) | Next.js build (Turbopack) |
| React Router (client-side) | File-based routing (App Router) |
| Tailwind 3 + CSS variables (HSL) | Tailwind 4 + `@theme` tokeny |
| shadcn/ui (Radix) | shadcn/ui (ponechat, aktualizovat importy) |
| `useState` / `useEffect` pro data | TanStack Query + API routes |
| Žádná autentizace | Supabase Auth (email, OAuth) |
| Žádný backend | Next.js API routes + Drizzle ORM + Supabase PostgreSQL |
| Žádné CMS | Volitelné (Supabase jako CMS backend) |
| Google Fonts (runtime) | Self-hosted WOFF2 (next/font) |
| `alert()` formuláře | API routes + Zod validace |

---

## Fáze konverze

### Fáze 1: Příprava nového projektu

1. **Scaffold Next.js projekt:**
   ```bash
   npx create-next-app@latest nazev-projektu \
     --typescript --tailwind --eslint --app --src-dir \
     --import-alias "@/*" --turbopack
   cd nazev-projektu
   ```

2. **Nainstalovat závislosti:**
   ```bash
   # Supabase
   npm install @supabase/supabase-js @supabase/ssr

   # Databáze (Drizzle ORM)
   npm install drizzle-orm postgres
   npm install -D drizzle-kit

   # Data fetching
   npm install @tanstack/react-query

   # Validace
   npm install zod

   # UI (shadcn/ui — už je v Lovable, ale inicializovat pro Next.js)
   npx shadcn@latest init

   # Formuláře (volitelné, pro složitější formuláře)
   npm install react-hook-form @hookform/resolvers
   ```

3. **Zkopírovat soubory ze složky `sablona/`:**
   ```bash
   cp -r sablona/* .
   ```
   Pak nahradit `{{PLACEHOLDER}}` hodnoty — viz [sablona/README.md](sablona/README.md).

   **Obsah šablony:**
   - `src/lib/supabase/client.ts` — Supabase browser klient
   - `src/lib/supabase/server.ts` — Supabase server klient (cookies)
   - `src/lib/supabase/middleware.ts` — Supabase session refresh
   - `middleware.ts` — Next.js middleware (auth guard)
   - `src/lib/db/index.ts` — Drizzle klient
   - `src/lib/db/schema.ts` — Drizzle schema (prázdné, rozšířit)
   - `src/app/providers.tsx` — React Query + Theme provider
   - `src/app/(auth)/login/page.tsx` — přihlašovací stránka
   - `src/app/(auth)/register/page.tsx` — registrační stránka
   - `src/app/(auth)/layout.tsx` — auth layout (centrovaný)
   - `src/app/auth/callback/route.ts` — OAuth callback handler
   - `src/app/auth/confirm/route.ts` — email confirmation handler
   - `drizzle.config.ts` — Drizzle config
   - `.env.local.example` — šablona env proměnných

4. **Nastavit environment proměnné:**
   ```bash
   cp .env.local.example .env.local
   ```
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
   DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
   ```

5. **Adresářová struktura:**
   ```
   src/
   ├── app/
   │   ├── (auth)/          # auth stránky (login, register)
   │   ├── (dashboard)/     # chráněné stránky
   │   ├── api/             # API routes
   │   ├── auth/            # auth callbacky
   │   ├── layout.tsx       # root layout
   │   └── providers.tsx    # React Query + Theme
   ├── components/
   │   ├── ui/              # shadcn/ui (kopie z Lovable)
   │   └── ...              # aplikační komponenty
   ├── hooks/               # React Query hooks
   ├── lib/
   │   ├── db/              # Drizzle schema + klient
   │   ├── supabase/        # Supabase klienti
   │   └── validations/     # Zod schemas
   └── types/               # TypeScript typy
   ```

---

### Fáze 2: Auth setup — Supabase Auth

1. **Zkopírovat Supabase klientské soubory z šablony:**

   **Browser klient** (`src/lib/supabase/client.ts`):
   ```ts
   import { createBrowserClient } from "@supabase/ssr";

   export function createClient() {
     return createBrowserClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     );
   }
   ```

   **Server klient** (`src/lib/supabase/server.ts`):
   ```ts
   import { createServerClient } from "@supabase/ssr";
   import { cookies } from "next/headers";

   export async function createClient() {
     const cookieStore = await cookies();

     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           getAll() {
             return cookieStore.getAll();
           },
           setAll(cookiesToSet) {
             try {
               cookiesToSet.forEach(({ name, value, options }) =>
                 cookieStore.set(name, value, options)
               );
             } catch {
               // Server Component — nelze nastavit cookies
             }
           },
         },
       }
     );
   }
   ```

   **Middleware** (`middleware.ts`):
   ```ts
   import { createServerClient } from "@supabase/ssr";
   import { NextResponse, type NextRequest } from "next/server";

   export async function middleware(request: NextRequest) {
     let supabaseResponse = NextResponse.next({ request });

     const supabase = createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           getAll() {
             return request.cookies.getAll();
           },
           setAll(cookiesToSet) {
             cookiesToSet.forEach(({ name, value }) =>
               request.cookies.set(name, value)
             );
             supabaseResponse = NextResponse.next({ request });
             cookiesToSet.forEach(({ name, value, options }) =>
               supabaseResponse.cookies.set(name, value, options)
             );
           },
         },
       }
     );

     const {
       data: { user },
     } = await supabase.auth.getUser();

     // Chráněné routes — přesměrovat nepřihlášené
     if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
       const url = request.nextUrl.clone();
       url.pathname = "/login";
       return NextResponse.redirect(url);
     }

     return supabaseResponse;
   }

   export const config = {
     matcher: [
       "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
     ],
   };
   ```

2. **Zkopírovat auth stránky z šablony** (`src/app/(auth)/login/page.tsx`, `register/page.tsx`).

3. **Nastavit Supabase projekt:**
   - Authentication → URL Configuration: přidat `http://localhost:3000/auth/callback`
   - Authentication → Providers: zapnout Email, případně Google/GitHub
   - Pro produkci: přidat produkční URL do redirect URLs

---

### Fáze 3: Layout a providery

Root layout spojuje všechny providery a globální UI.

**Lovable (`App.tsx`):**
```tsx
// Lovable — typický App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
```

**Next.js (`src/app/layout.tsx`):**
```tsx
import type { Metadata } from "next";
import { Providers } from "./providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Název aplikace",
  description: "Popis aplikace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Providers** (`src/app/providers.tsx`):
```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuta
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
```

**Dashboard layout** (`src/app/(dashboard)/layout.tsx`):
```tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
```

---

### Fáze 4: Routing — React Router → App Router

Nejdůležitější strukturální změna. React Router routes se mapují na adresáře v `src/app/`.

**Mapovací tabulka:**

| React Router route | Next.js soubor | Poznámka |
|---|---|---|
| `/` | `src/app/page.tsx` | Homepage |
| `/about` | `src/app/about/page.tsx` | Statická stránka |
| `/dashboard` | `src/app/(dashboard)/page.tsx` | Chráněná, layout group |
| `/dashboard/settings` | `src/app/(dashboard)/settings/page.tsx` | Vnořená route |
| `/product/:id` | `src/app/product/[id]/page.tsx` | Dynamická route |
| `/blog/:slug` | `src/app/blog/[slug]/page.tsx` | Dynamická route |
| `*` (404) | `src/app/not-found.tsx` | Automatický 404 |

**Příklad převodu — dynamická route:**

```tsx
// Lovable (React Router)
// src/pages/ProductDetail.tsx
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // fetch product...
  }, [id]);

  return <div>{product?.name}</div>;
}
```

```tsx
// Next.js (App Router) — Server Component
// src/app/product/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return <div>{product.name}</div>;
}
```

**Navigační odkazy:**
- `<Link to="/page">` → `import Link from "next/link"` + `<Link href="/page">`
- `useNavigate()` → `import { useRouter } from "next/navigation"` + `router.push("/page")`
- `useParams()` → props `params` v Server Components, nebo `useParams()` z `next/navigation`

**Layout groups:**
- `(auth)` — sdílený layout pro login/register (centrovaný, bez sidebar)
- `(dashboard)` — sdílený layout pro chráněné stránky (sidebar + header)
- `(marketing)` — veřejné stránky (jiný header/footer)

---

### Fáze 5: Migrace komponent

**Hlavní výhoda:** Lovable je React, Next.js je React — komponenty většinou fungují beze změn.

#### Co zůstává stejné
- JSX syntax, `className`, event handlery
- shadcn/ui komponenty (Button, Input, Card, Dialog, ...)
- Tailwind utility třídy
- Lucide React ikony
- Vlastní komponenty bez data fetchingu

#### Co se mění

**A) Rozlišení Server vs Client Components:**

```tsx
// Server Component (výchozí v App Router) — NEMÁ "use client"
// Použít pro: stránky, layouty, komponenty bez interaktivity
export default async function ProductList() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products?.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
```

```tsx
// Client Component — MÁ "use client"
// Použít pro: interaktivní UI (formuláře, modaly, state, event handlery)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <Button onClick={() => { /* ... */ }} disabled={loading}>
      {loading ? "Přidávání..." : "Přidat do košíku"}
    </Button>
  );
}
```

**Pravidlo:** Začít jako Server Component. Přidat `"use client"` pouze když komponenta potřebuje `useState`, `useEffect`, `onClick`, nebo browser API.

**B) Aktualizace importů:**

| Lovable import | Next.js import |
|---|---|
| `import { Link } from "react-router-dom"` | `import Link from "next/link"` |
| `import { useNavigate } from "react-router-dom"` | `import { useRouter } from "next/navigation"` |
| `import { useParams } from "react-router-dom"` | `import { useParams } from "next/navigation"` |
| `import logo from "@/assets/logo.png"` | `import Image from "next/image"` + `<Image src="/logo.png" ... />` |
| `@/components/ui/*` | `@/components/ui/*` (stejné — shadcn funguje) |

**C) Obrázky:**

```tsx
// Lovable
<img src="/hero-bg.jpg" alt="Hero" className="w-full h-auto" />

// Next.js — optimalizované obrázky
import Image from "next/image";

<Image
  src="/hero-bg.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  className="w-full h-auto"
  priority // pro above-the-fold obrázky
/>
```

---

### Fáze 6: Data layer — lokální stav → Supabase + React Query

Toto je jádro konverze. Hardcoded data a `useState` se nahrazují databází a React Query hooks.

#### Krok 1: Drizzle schema

Definovat tabulky pro data, která jsou v Lovable hardcoded:

```ts
// src/lib/db/schema.ts
import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

Pak spustit migraci:
```bash
npx drizzle-kit generate
npx drizzle-kit push
```

#### Krok 2: API routes

```ts
// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

// GET /api/products
export async function GET() {
  const allProducts = await db.select().from(products);
  return NextResponse.json(allProducts);
}

// POST /api/products (chráněné — vyžaduje auth)
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  // Validace — viz Fáze 7

  const [newProduct] = await db.insert(products).values(body).returning();
  return NextResponse.json(newProduct, { status: 201 });
}
```

#### Krok 3: React Query hooks

```ts
// src/hooks/use-products.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
```

#### Krok 4: Převod komponenty (before/after)

```tsx
// PŘED — Lovable (hardcoded data + useState)
const ProductList = () => {
  const products = [
    { id: 1, name: "Produkt A", price: 1500 },
    { id: 2, name: "Produkt B", price: 2300 },
    { id: 3, name: "Produkt C", price: 890 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p.id} className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="text-2xl font-bold text-primary">{p.price} Kč</p>
        </div>
      ))}
    </div>
  );
};
```

```tsx
// PO — Next.js + React Query
"use client";

import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductList() {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Nepodařilo se načíst produkty.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products?.map((p) => (
        <div key={p.id} className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="text-2xl font-bold text-primary">{p.price} Kč</p>
        </div>
      ))}
    </div>
  );
}
```

**Alternativa — Server Component (bez React Query):**
```tsx
// Pokud data nepotřebují real-time aktualizace, použít Server Component
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

export default async function ProductList() {
  const allProducts = await db.select().from(products);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {allProducts.map((p) => (
        <div key={p.id} className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="text-2xl font-bold text-primary">{p.price} Kč</p>
        </div>
      ))}
    </div>
  );
}
```

---

### Fáze 7: Formuláře — alert() → API + validace

Lovable formuláře typicky končí `alert("Děkujeme")`. Nahradit plnou validací a API submittem.

#### Krok 1: Zod schema

```ts
// src/lib/validations/inquiry.ts
import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  email: z.string().email("Neplatný email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Zpráva musí mít alespoň 10 znaků"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
```

#### Krok 2: API route s validací

```ts
// src/app/api/inquiries/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { inquirySchema } from "@/lib/validations/inquiry";

export async function POST(request: Request) {
  const body = await request.json();

  // Server-side validace
  const result = inquirySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Neplatná data", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const [inquiry] = await db.insert(inquiries).values(result.data).returning();

  // Volitelně: odeslat notifikační email (Resend, etc.)

  return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
}
```

#### Krok 3: Formulářová komponenta (before/after)

```tsx
// PŘED — Lovable
const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Děkujeme za vaši zprávu!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jméno" />
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Zpráva" />
      <Button type="submit">Odeslat</Button>
    </form>
  );
};
```

```tsx
// PO — Next.js + Zod + React Hook Form
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryInput } from "@/lib/validations/inquiry";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: InquiryInput) => {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Odeslání selhalo");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Odesláno", description: "Děkujeme za vaši zprávu!" });
      reset();
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodařilo se odeslat. Zkuste to znovu.",
        variant: "destructive",
      });
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <div>
        <Input {...register("name")} placeholder="Jméno" />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Input {...register("email")} placeholder="Email" type="email" />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Input {...register("phone")} placeholder="Telefon (volitelné)" />
      </div>
      <div>
        <Textarea {...register("message")} placeholder="Vaše zpráva" rows={5} />
        {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Odesílání..." : "Odeslat zprávu"}
      </Button>
    </form>
  );
}
```

---

### Fáze 8: Tailwind migrace — 3 → 4

Pokud Lovable používá Tailwind 3 a Next.js projekt cílí na Tailwind 4:

**Změny v konfiguraci:**

```css
/* PŘED — Tailwind 3 (tailwind.config.ts + globals.css) */
/* tailwind.config.ts obsahuje theme.extend.colors */
/* globals.css: @tailwind base; @tailwind components; @tailwind utilities; */

/* PO — Tailwind 4 (globals.css) */
@import "tailwindcss";

@theme {
  --color-primary: #1a1a2e;
  --color-secondary: #16213e;
  --color-accent: #0f3460;
  --color-accent-hover: #0d2d54;
  --color-text-DEFAULT: #e4e4e7;
  --color-text-muted: #a1a1aa;
  --color-border: rgba(255, 255, 255, 0.1);
  --font-sans: 'Inter', sans-serif;
  --font-heading: 'Poppins', sans-serif;
}
```

**Postup:**
1. Otevřít `tailwind.config.ts` z Lovable projektu
2. Převést barvy z HSL CSS variables na hex hodnoty v `@theme`
3. Přesunout font definice do `@theme`
4. Smazat `tailwind.config.ts` (není potřeba v TW4)
5. Zkopírovat custom CSS třídy (animace, utility) do `globals.css`

**Mapovací tabulka barev:**

| Lovable (HSL variable) | Tailwind 4 (@theme) | Poznámka |
|---|---|---|
| `--primary: 213 96% 8%` | `--color-primary: #011227` | Převést HSL → hex |
| `--accent: 56 100% 50%` | `--color-accent: #ffee00` | |
| `--muted: 213 10% 55%` | `--color-text-muted: #808998` | |
| `--card: 213 96% 8%` | `--color-card: #011227` | |
| `--border: 213 20% 20%` | `--color-border: #293041` | |

**Poznámka:** shadcn/ui v Next.js projektu může zůstat na Tailwind 3 konfiguraci — `npx shadcn@latest init` to nastaví automaticky. Tailwind 4 migrace je volitelná.

---

### Fáze 9: Deploy

1. **Nastavit Netlify (nebo Vercel):**
   ```bash
   # Netlify
   npm install -D @netlify/plugin-nextjs
   ```

   `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Nastavit environment proměnné** v deploy platformě:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`

3. **Nastavit Supabase produkční projekt:**
   - Vytvořit nový projekt na supabase.com (nebo použít existující)
   - Authentication → URL Configuration: přidat produkční URL
   - Spustit Drizzle migrace proti produkční DB:
     ```bash
     DATABASE_URL=postgresql://... npx drizzle-kit push
     ```

4. **Nastavit RLS (Row Level Security):**
   ```sql
   -- Povolit čtení pro všechny
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Public read" ON products FOR SELECT USING (true);

   -- Povolit zápis jen pro authenticated users
   CREATE POLICY "Auth insert" ON products FOR INSERT
     WITH CHECK (auth.role() = 'authenticated');
   ```

5. **Ověřit deploy:**
   - Build proběhne bez chyb
   - Auth flow funguje (login, register, callback)
   - API routes odpovídají
   - Data se načítají ze Supabase

---

## Checklist konverze

Kompletní checklist pro sledování postupu:

### Fáze 1: Project setup
- [ ] Scaffold Next.js projekt (`create-next-app`)
- [ ] Nainstalovat závislosti (Supabase, Drizzle, TanStack Query, Zod)
- [ ] Zkopírovat šablonové soubory
- [ ] Nastavit `.env.local` s Supabase credentials
- [ ] Ověřit `npm run dev` funguje

### Fáze 2: Auth
- [ ] Zkopírovat Supabase klientské soubory (client.ts, server.ts)
- [ ] Zkopírovat middleware.ts
- [ ] Zkopírovat auth stránky (login, register)
- [ ] Zkopírovat auth callbacky (callback, confirm)
- [ ] Nastavit Supabase Auth providers
- [ ] Nastavit redirect URLs v Supabase dashboardu
- [ ] Otestovat login/register flow

### Fáze 3: Layout
- [ ] Vytvořit root layout s Providers
- [ ] Vytvořit Providers (React Query, Toaster)
- [ ] Vytvořit dashboard layout (sidebar + main)
- [ ] Vytvořit auth layout (centrovaný)

### Fáze 4: Routing
- [ ] Zmapovat všechny React Router routes
- [ ] Vytvořit odpovídající adresáře v `src/app/`
- [ ] Převést dynamické routes (`:id` → `[id]`)
- [ ] Nastavit layout groups (`(auth)`, `(dashboard)`)
- [ ] Nahradit `<Link to=...>` za `<Link href=...>`
- [ ] Nahradit `useNavigate()` za `useRouter()`

### Fáze 5: Komponenty
- [ ] Zkopírovat shadcn/ui komponenty do `src/components/ui/`
- [ ] Zkopírovat aplikační komponenty
- [ ] Rozlišit Server vs Client Components (přidat `"use client"` kde potřeba)
- [ ] Aktualizovat importy (react-router → next/navigation, next/link, next/image)
- [ ] Nahradit `<img>` za `<Image>` pro optimalizaci

### Fáze 6: Data layer
- [ ] Definovat Drizzle schema pro hardcoded data
- [ ] Spustit `drizzle-kit push` (vytvořit tabulky)
- [ ] Naplnit tabulky seed daty (z hardcoded arrays)
- [ ] Vytvořit API routes (GET, POST, PUT, DELETE)
- [ ] Přidat auth guard na chráněné API routes
- [ ] Vytvořit React Query hooks
- [ ] Nahradit hardcoded data za `useQuery` / Server Component fetch
- [ ] Přidat loading a error states

### Fáze 7: Formuláře
- [ ] Definovat Zod schemas pro všechny formuláře
- [ ] Vytvořit API routes pro form submission
- [ ] Převést formuláře na React Hook Form + Zod
- [ ] Přidat error messages pod inputy
- [ ] Přidat loading state na submit button
- [ ] Nahradit `alert()` za toast notifikace

### Fáze 8: Tailwind
- [ ] Převést barvy z HSL variables do `@theme` (pokud TW4)
- [ ] Převést fonty do `@theme` nebo next/font
- [ ] Zkopírovat custom CSS třídy
- [ ] Self-hostovat fonty (WOFF2) nebo použít next/font

### Fáze 9: Deploy
- [ ] Nastavit Netlify/Vercel
- [ ] Nastavit environment proměnné
- [ ] Vytvořit Supabase produkční projekt
- [ ] Spustit Drizzle migrace na produkci
- [ ] Nastavit RLS politiky
- [ ] Nastavit produkční redirect URLs v Supabase
- [ ] Ověřit build + deploy
- [ ] Otestovat auth flow na produkci
- [ ] Otestovat API routes na produkci

---

## Odhad náročnosti

| Fáze | Náročnost | Poznámka |
|---|---|---|
| 1. Project setup | Nízká | Scaffold + kopie ze šablony |
| 2. Auth setup | Nízká | Kopie ze šablony, config v Supabase dashboardu |
| 3. Layout + Providers | Nízká | Přestavba App.tsx na App Router layouty |
| 4. Routing | Nízká | Mechanický převod, file-based routing |
| 5. Komponenty | **Nízká** | React → React, minimální změny (importy, `"use client"`) |
| 6. Data layer | **Vyšší** | Drizzle schema, API routes, React Query hooks — hlavní práce |
| 7. Formuláře | Střední | Zod + React Hook Form + API routes |
| 8. Tailwind | Nízká | Volitelné (TW3 → TW4), mechanický převod |
| 9. Deploy | Nízká | Standardní Netlify/Vercel flow + Supabase config |

**Celkový odhad:** Výrazně jednodušší než Lovable → Astro konverze, protože komponenty zůstávají v Reactu. Hlavní práce je v Fázi 6 (data layer) — přechod z hardcoded dat na skutečnou databázi s API.
