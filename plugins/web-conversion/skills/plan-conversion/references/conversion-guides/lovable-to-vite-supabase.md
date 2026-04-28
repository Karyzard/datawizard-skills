# Konverzni manual: Lovable prototyp → React + Vite + Supabase SPA

Tento dokument popisuje postup prevodu prototypu vytvorenoho v Lovable (React + Vite + Tailwind + shadcn/ui) do produkcniho React SPA s Supabase backendem, autentizaci a databazi.

**Klicovy rozdil oproti ostatnim konverzim:** Toto je **nejjednodussi** konverze ze vsech. Lovable uz pouziva React + Vite + Tailwind + shadcn/ui — framework se **nemeni**. Vetina React komponent nepotrebuje **zadne zmeny**. Hlavni prace je pridani Supabase (auth, databaze, RPC funkce), prechod z lokalniho stavu na TanStack Query a zavedeni spravneho routingu.

**Self-contained:** Vsechny sablonove soubory jsou ve slozce [sablona/](sablona/) — neni potreba kopirovat z jineho projektu.

---

## Prehled konverze

| Z (Lovable) | Na (Vite + Supabase) |
|---|---|
| React 18 + Vite | React 18 + Vite (**STEJNE!**) |
| Tailwind 3 + CSS variables (HSL) | Tailwind 4 + `@theme` tokeny |
| shadcn/ui (Radix) | shadcn/ui (**ponechat beze zmen!**) |
| React Router (pokud existuje) | React Router v7 (upgrade) |
| `useState` / `useEffect` pro data | TanStack Query + Supabase RPC |
| Zadna autentizace | Supabase Auth (email, OAuth) |
| Zadny backend | Supabase (PostgreSQL + RPC funkce) |
| Zadne DB schema | Supabase Declarative Schemas |
| `alert()` formulare | Supabase RPC + Zod validace |
| Google Fonts (runtime) | Google Fonts (runtime — ponechat) |

**Co zustava uplne stejne:**
- Vite jako build tool
- React 18 s JSX/TSX
- shadcn/ui komponenty (Button, Input, Card, Dialog, ...)
- Lucide React ikony
- Tailwind utility tridy
- Vsechny staticke komponenty (bez data fetchingu)

---

## Faze konverze

### Faze 1: Priprava projektu

**DULEZITE:** Netvori novy projekt! Pracujeme primo v existujicim Lovable repu.

1. **Nainstalovat nove zavislosti:**
   ```bash
   # Supabase
   npm install @supabase/supabase-js

   # Data fetching
   npm install @tanstack/react-query

   # Validace
   npm install zod

   # React Router v7 (pokud neni nebo je starsi)
   npm install react-router-dom@7

   # Volitelne: formulare
   npm install react-hook-form @hookform/resolvers
   ```

2. **Upgrade Tailwind 3 → 4 (pokud je potreba):**

   Lovable typicky pouziva Tailwind 3 s `tailwind.config.ts`. Pro Tailwind 4:

   ```bash
   npm install tailwindcss@latest @tailwindcss/vite
   ```

   Upravit `vite.config.ts`:
   ```ts
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react-swc";
   import tailwindcss from "@tailwindcss/vite";
   import path from "path";

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
   });
   ```

   Upravit `src/index.css`:
   ```css
   /* PRED — Tailwind 3 */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   /* PO — Tailwind 4 */
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
   }
   ```

   Smazat `tailwind.config.ts` a `postcss.config.js` (Tailwind 4 je nepotrebuje).

3. **Nastavit environment promenne:**

   Vytvorit `.env`:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbG...
   ```

   Pridat do `.gitignore`:
   ```
   .env
   .env.local
   ```

4. **Zkopirovat sablonove soubory:**
   ```bash
   cp -r sablona/* .
   ```

   **Obsah sablony:**
   - `src/lib/supabase.ts` — Supabase klient
   - `src/lib/query-client.ts` — TanStack Query klient
   - `src/hooks/use-auth.ts` — autentizacni hook
   - `src/components/protected-route.tsx` — ochrana rout
   - `src/pages/login.tsx` — prihlasovaci stranka
   - `src/pages/register.tsx` — registracni stranka
   - `supabase/schemas/` — deklarativni schemata
   - `netlify.toml` — deploy config s SPA redirect
   - `.env.example` — sablona env promennych

5. **Adresarova struktura (cilovy stav):**
   ```
   src/
   ├── components/
   │   ├── ui/              # shadcn/ui (beze zmen z Lovable!)
   │   ├── layout/          # DashboardLayout, Sidebar, Header
   │   └── ...              # aplikacni komponenty (beze zmen!)
   ├── hooks/               # TanStack Query hooks + useAuth
   ├── lib/
   │   ├── supabase.ts      # Supabase klient
   │   ├── query-client.ts  # React Query klient
   │   └── validations/     # Zod schemas
   ├── pages/               # route pages
   ├── types/               # TypeScript typy (generovane ze Supabase)
   └── App.tsx              # routing
   supabase/
   └── schemas/             # deklarativni SQL schemata
   ```

---

### Faze 2: Supabase setup

1. **Vytvorit Supabase projekt:**
   - Jit na [supabase.com](https://supabase.com) → New Project
   - Zaznamenat URL a anon key do `.env`

2. **Nastavit adresarovou strukturu pro deklarativni schemata:**
   ```
   supabase/
   └── schemas/
       ├── public.sql        # hlavni tabulky
       ├── auth-hooks.sql    # triggery pro auth
       └── rpc.sql           # RPC funkce
   ```

3. **Definovat tabulky v `supabase/schemas/public.sql`:**
   ```sql
   -- Profily uzivatelu (propojene s auth.users)
   CREATE TABLE IF NOT EXISTS public.profiles (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     full_name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can view own profile"
     ON public.profiles FOR SELECT
     USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile"
     ON public.profiles FOR UPDATE
     USING (auth.uid() = id);

   -- Priklad: produkty (z hardcoded dat v Lovable)
   CREATE TABLE IF NOT EXISTS public.products (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     description TEXT,
     price INTEGER NOT NULL,
     category TEXT NOT NULL,
     image_url TEXT,
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Public read products"
     ON public.products FOR SELECT
     USING (true);
   ```

4. **Vytvorit RPC funkce v `supabase/schemas/rpc.sql`:**
   ```sql
   -- Priklad: ziskani produktu podle kategorie
   CREATE OR REPLACE FUNCTION public.get_products_by_category(
     p_category TEXT
   )
   RETURNS SETOF public.products
   LANGUAGE sql
   STABLE
   SECURITY DEFINER
   AS $$
     SELECT * FROM public.products
     WHERE category = p_category AND is_active = true
     ORDER BY created_at DESC;
   $$;

   -- Priklad: odeslani poptavky
   CREATE OR REPLACE FUNCTION public.submit_inquiry(
     p_name TEXT,
     p_email TEXT,
     p_phone TEXT DEFAULT NULL,
     p_message TEXT DEFAULT ''
   )
   RETURNS UUID
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   DECLARE
     v_id UUID;
   BEGIN
     INSERT INTO public.inquiries (name, email, phone, message)
     VALUES (p_name, p_email, p_phone, p_message)
     RETURNING id INTO v_id;

     RETURN v_id;
   END;
   $$;
   ```

5. **Vytvorit auth trigger v `supabase/schemas/auth-hooks.sql`:**
   ```sql
   -- Automaticky vytvorit profil pri registraci
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER
   LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = ''
   AS $$
   BEGIN
     INSERT INTO public.profiles (id, full_name)
     VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
     RETURN NEW;
   END;
   $$;

   CREATE OR REPLACE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW
     EXECUTE FUNCTION public.handle_new_user();
   ```

6. **Aplikovat schemata:**
   ```bash
   # Lokalne (s Supabase CLI)
   supabase db diff --schema public --file migrations/initial

   # Nebo primo v Supabase SQL Editoru — zkopirovat SQL soubory
   ```

7. **Generovat TypeScript typy:**
   ```bash
   npx supabase gen types typescript --project-id xxxxx > src/types/database.ts
   ```

---

### Faze 3: Autentizace

1. **Vytvorit Supabase klient (`src/lib/supabase.ts`):**
   ```ts
   import { createClient } from "@supabase/supabase-js";
   import type { Database } from "@/types/database";

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
   ```

2. **Vytvorit useAuth hook (`src/hooks/use-auth.ts`):**
   ```ts
   import { useEffect, useState } from "react";
   import { supabase } from "@/lib/supabase";
   import type { User, Session } from "@supabase/supabase-js";

   export function useAuth() {
     const [user, setUser] = useState<User | null>(null);
     const [session, setSession] = useState<Session | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       // Ziskat aktualni session
       supabase.auth.getSession().then(({ data: { session } }) => {
         setSession(session);
         setUser(session?.user ?? null);
         setLoading(false);
       });

       // Naslouchat zmenam
       const {
         data: { subscription },
       } = supabase.auth.onAuthStateChange((_event, session) => {
         setSession(session);
         setUser(session?.user ?? null);
         setLoading(false);
       });

       return () => subscription.unsubscribe();
     }, []);

     const signIn = async (email: string, password: string) => {
       const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
       if (error) throw error;
     };

     const signUp = async (
       email: string,
       password: string,
       fullName: string
     ) => {
       const { error } = await supabase.auth.signUp({
         email,
         password,
         options: { data: { full_name: fullName } },
       });
       if (error) throw error;
     };

     const signOut = async () => {
       const { error } = await supabase.auth.signOut();
       if (error) throw error;
     };

     return { user, session, loading, signIn, signUp, signOut };
   }
   ```

3. **Vytvorit ProtectedRoute komponent (`src/components/protected-route.tsx`):**
   ```tsx
   import { Navigate, Outlet } from "react-router-dom";
   import { useAuth } from "@/hooks/use-auth";

   export function ProtectedRoute() {
     const { user, loading } = useAuth();

     if (loading) {
       return (
         <div className="flex h-screen items-center justify-center">
           <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
         </div>
       );
     }

     if (!user) {
       return <Navigate to="/login" replace />;
     }

     return <Outlet />;
   }
   ```

4. **Vytvorit login stranku (`src/pages/login.tsx`):**
   ```tsx
   import { useState } from "react";
   import { useNavigate, Link } from "react-router-dom";
   import { useAuth } from "@/hooks/use-auth";
   import { Button } from "@/components/ui/button";
   import { Input } from "@/components/ui/input";
   import { useToast } from "@/hooks/use-toast";

   export default function LoginPage() {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [loading, setLoading] = useState(false);
     const { signIn } = useAuth();
     const navigate = useNavigate();
     const { toast } = useToast();

     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       setLoading(true);

       try {
         await signIn(email, password);
         navigate("/dashboard");
       } catch (error) {
         toast({
           title: "Chyba prihlaseni",
           description: "Nespravny email nebo heslo.",
           variant: "destructive",
         });
       } finally {
         setLoading(false);
       }
     };

     return (
       <div className="flex min-h-screen items-center justify-center">
         <div className="w-full max-w-md space-y-6 p-8">
           <h1 className="text-2xl font-bold text-center">Prihlaseni</h1>
           <form onSubmit={handleSubmit} className="space-y-4">
             <Input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
             />
             <Input
               type="password"
               placeholder="Heslo"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />
             <Button type="submit" className="w-full" disabled={loading}>
               {loading ? "Prihlasovani..." : "Prihlasit se"}
             </Button>
           </form>
           <p className="text-center text-sm text-muted-foreground">
             Nemate ucet?{" "}
             <Link to="/register" className="text-primary underline">
               Registrovat se
             </Link>
           </p>
         </div>
       </div>
     );
   }
   ```

5. **Nastavit Supabase dashboard:**
   - Authentication → URL Configuration: pridat `http://localhost:5173` (Vite dev server)
   - Authentication → Providers: zapnout Email, pripadne Google/GitHub
   - Pro produkci: pridat produkcni URL do redirect URLs

---

### Faze 4: Routing — React Router v7

Lovable casto pouziva React Router, ale ad-hoc. Reorganizujeme do cistejsi struktury.

1. **Upravit `App.tsx`:**

   ```tsx
   // PRED — typicky Lovable App.tsx
   import { BrowserRouter, Routes, Route } from "react-router-dom";
   import { Toaster } from "@/components/ui/toaster";
   import HomePage from "@/pages/home";
   import AboutPage from "@/pages/about";

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

   ```tsx
   // PO — s auth, protected routes, layout
   import { BrowserRouter, Routes, Route } from "react-router-dom";
   import { QueryClientProvider } from "@tanstack/react-query";
   import { queryClient } from "@/lib/query-client";
   import { Toaster } from "@/components/ui/toaster";
   import { ProtectedRoute } from "@/components/protected-route";
   import { DashboardLayout } from "@/components/layout/dashboard-layout";

   // Verejne stranky
   import HomePage from "@/pages/home";
   import AboutPage from "@/pages/about";
   import LoginPage from "@/pages/login";
   import RegisterPage from "@/pages/register";

   // Chranene stranky
   import DashboardPage from "@/pages/dashboard";
   import SettingsPage from "@/pages/settings";
   import ProductsPage from "@/pages/products";

   function App() {
     return (
       <QueryClientProvider client={queryClient}>
         <BrowserRouter>
           <Routes>
             {/* Verejne routes */}
             <Route path="/" element={<HomePage />} />
             <Route path="/about" element={<AboutPage />} />
             <Route path="/login" element={<LoginPage />} />
             <Route path="/register" element={<RegisterPage />} />

             {/* Chranene routes */}
             <Route element={<ProtectedRoute />}>
               <Route element={<DashboardLayout />}>
                 <Route path="/dashboard" element={<DashboardPage />} />
                 <Route path="/products" element={<ProductsPage />} />
                 <Route path="/settings" element={<SettingsPage />} />
               </Route>
             </Route>
           </Routes>
           <Toaster />
         </BrowserRouter>
       </QueryClientProvider>
     );
   }

   export default App;
   ```

2. **Vytvorit QueryClient (`src/lib/query-client.ts`):**
   ```ts
   import { QueryClient } from "@tanstack/react-query";

   export const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 60 * 1000, // 1 minuta
         retry: 1,
       },
     },
   });
   ```

3. **Vytvorit DashboardLayout (`src/components/layout/dashboard-layout.tsx`):**
   ```tsx
   import { Outlet } from "react-router-dom";
   import { Sidebar } from "@/components/layout/sidebar";

   export function DashboardLayout() {
     return (
       <div className="flex h-screen">
         <Sidebar />
         <main className="flex-1 overflow-y-auto p-6">
           <Outlet />
         </main>
       </div>
     );
   }
   ```

**Navigacni odkazy — co se meni:**

| Lovable | Vite + Supabase | Poznamka |
|---|---|---|
| `<Link to="/page">` | `<Link to="/page">` | **STEJNE** (React Router zustava!) |
| `useNavigate()` | `useNavigate()` | **STEJNE** |
| `useParams()` | `useParams()` | **STEJNE** |
| Ad-hoc `window.location` | `useNavigate()` | Prevest na React Router |

---

### Faze 5: Data layer — lokalni stav → Supabase + TanStack Query

Toto je jadro konverze. Hardcoded data a `useState` se nahrazuji Supabase RPC funkcemi a React Query hooks.

#### Krok 1: Identifikovat vsechna hardcoded data

Typicke vzory v Lovable prototypu:
```tsx
// Vzor 1: Hardcoded pole v komponente
const products = [
  { id: 1, name: "Produkt A", price: 1500 },
  { id: 2, name: "Produkt B", price: 2300 },
];

// Vzor 2: useState s mock daty
const [items, setItems] = useState([
  { id: "1", title: "Polozka 1" },
  { id: "2", title: "Polozka 2" },
]);

// Vzor 3: useEffect s fake fetchem
useEffect(() => {
  // TODO: fetch from API
  setData(mockData);
}, []);
```

#### Krok 2: Vytvorit Supabase RPC funkce

Pro kazdou datovou entitu vytvorit RPC funkci v `supabase/schemas/rpc.sql` (viz Faze 2).

#### Krok 3: Vytvorit TanStack Query hooks

```ts
// src/hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];

// Ziskani vsech produktu
export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Ziskani produktu podle kategorie (pres RPC)
export function useProductsByCategory(category: string) {
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_products_by_category", {
        p_category: category,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });
}

// Vytvoreni produktu
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Aktualizace produktu
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
```

#### Krok 4: Prevod komponenty (before/after)

```tsx
// PRED — Lovable (hardcoded data)
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
          <p className="text-2xl font-bold text-primary">{p.price} Kc</p>
        </div>
      ))}
    </div>
  );
};
```

```tsx
// PO — Vite + Supabase + TanStack Query
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
    return <p className="text-red-500">Nepodarilo se nacist produkty.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products?.map((p) => (
        <div key={p.id} className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="text-2xl font-bold text-primary">{p.price} Kc</p>
        </div>
      ))}
    </div>
  );
}
```

**Zmeny:**
- Smazano hardcoded pole → nahrazeno `useProducts()` hook
- Pridany loading a error stavy
- JSX zustava **uplne stejny** — zadne zmeny v HTML/CSS!

---

### Faze 6: Formulare — alert() → Supabase RPC + Zod validace

#### Krok 1: Zod schema

```ts
// src/lib/validations/inquiry.ts
import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Jmeno musi mit alespon 2 znaky"),
  email: z.string().email("Neplatny email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Zprava musi mit alespon 10 znaku"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
```

#### Krok 2: Mutation hook

```ts
// src/hooks/use-inquiry.ts
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { InquiryInput } from "@/lib/validations/inquiry";

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: async (data: InquiryInput) => {
      const { data: id, error } = await supabase.rpc("submit_inquiry", {
        p_name: data.name,
        p_email: data.email,
        p_phone: data.phone ?? null,
        p_message: data.message,
      });

      if (error) throw error;
      return id;
    },
  });
}
```

#### Krok 3: Formularova komponenta (before/after)

```tsx
// PRED — Lovable
const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Dekujeme za vasi zpravu!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jmeno" />
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Zprava" />
      <Button type="submit">Odeslat</Button>
    </form>
  );
};
```

```tsx
// PO — Vite + Supabase + Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryInput } from "@/lib/validations/inquiry";
import { useSubmitInquiry } from "@/hooks/use-inquiry";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
  const { toast } = useToast();
  const mutation = useSubmitInquiry();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = (data: InquiryInput) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast({ title: "Odeslano", description: "Dekujeme za vasi zpravu!" });
        reset();
      },
      onError: () => {
        toast({
          title: "Chyba",
          description: "Nepodarilo se odeslat. Zkuste to znovu.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register("name")} placeholder="Jmeno" />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Input {...register("email")} placeholder="Email" type="email" />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Input {...register("phone")} placeholder="Telefon (volitelne)" />
      </div>
      <div>
        <Textarea {...register("message")} placeholder="Vase zprava" rows={5} />
        {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Odesilani..." : "Odeslat zpravu"}
      </Button>
    </form>
  );
}
```

**Zmeny:**
- `alert()` → Supabase RPC + toast notifikace
- Zadna validace → Zod schema + React Hook Form
- useState pro kazde pole → `register()` z React Hook Form
- Chybove hlasky pod inputy
- Loading stav na submit buttonu

---

### Faze 7: Deploy

1. **Vytvorit `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   # SPA redirect — vsechny cesty smerujou na index.html
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Nastavit Supabase produkci:**
   - Overit RLS politiky na vsech tabulkach
   - Nastavit Authentication → URL Configuration: pridat produkcni URL
   - Nastavit Authentication → Providers: produkcni OAuth credentials

3. **Nastavit RLS politiky (pokud jeste nejsou):**
   ```sql
   -- Priklad: poptavky — kdokoliv muze vytvorit, jen admin cte
   ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Anyone can submit inquiry"
     ON public.inquiries FOR INSERT
     WITH CHECK (true);

   CREATE POLICY "Only authenticated users can read inquiries"
     ON public.inquiries FOR SELECT
     USING (auth.role() = 'authenticated');
   ```

4. **Nastavit environment promenne v Netlify Dashboard:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

5. **Deploy:**
   ```bash
   # Overit build lokalne
   npm run build
   npm run preview

   # Push na GitHub → Netlify automaticky deployuje
   git push origin main
   ```

---

## Checklist konverze

Kompletni checklist pro sledovani postupu:

### Faze 1: Priprava projektu
- [ ] Nainstalovat zavislosti (@supabase/supabase-js, @tanstack/react-query, zod)
- [ ] Upgrade React Router na v7 (pokud potreba)
- [ ] Upgrade Tailwind 3 → 4 (volitelne)
- [ ] Nastavit `.env` s Supabase credentials
- [ ] Zkopirovat sablonove soubory
- [ ] Overit `npm run dev` funguje

### Faze 2: Supabase setup
- [ ] Vytvorit Supabase projekt
- [ ] Vytvorit `supabase/schemas/` adresarovou strukturu
- [ ] Definovat tabulky v `public.sql`
- [ ] Definovat RPC funkce v `rpc.sql`
- [ ] Definovat auth triggery v `auth-hooks.sql`
- [ ] Aplikovat schemata (migrace nebo SQL Editor)
- [ ] Generovat TypeScript typy (`supabase gen types`)
- [ ] Naplnit tabulky seed daty (z hardcoded poli v Lovable)

### Faze 3: Auth
- [ ] Vytvorit Supabase klient (`src/lib/supabase.ts`)
- [ ] Vytvorit useAuth hook
- [ ] Vytvorit ProtectedRoute komponentu
- [ ] Vytvorit login stranku
- [ ] Vytvorit register stranku
- [ ] Nastavit Supabase Auth providers
- [ ] Nastavit redirect URLs v Supabase dashboardu
- [ ] Otestovat login/register flow

### Faze 4: Routing
- [ ] Reorganizovat App.tsx s React Router v7
- [ ] Pridat QueryClientProvider
- [ ] Zabalit chranene routes do ProtectedRoute
- [ ] Vytvorit DashboardLayout s Outlet
- [ ] Prevest pripadne ad-hoc navigace na React Router
- [ ] Otestovat vsechny routes

### Faze 5: Data layer
- [ ] Identifikovat vsechna hardcoded data v komponentech
- [ ] Vytvorit Supabase tabulky pro kazdy typ dat
- [ ] Vytvorit RPC funkce pro dotazy
- [ ] Vytvorit TanStack Query hooks (useQuery, useMutation)
- [ ] Nahradit hardcoded pole za useQuery hooks
- [ ] Nahradit useState + setData za useMutation hooks
- [ ] Pridat loading states (Skeleton)
- [ ] Pridat error states

### Faze 6: Formulare
- [ ] Definovat Zod schemas pro vsechny formulare
- [ ] Vytvorit RPC funkce pro form submission
- [ ] Vytvorit mutation hooks
- [ ] Prevest formulare na React Hook Form + Zod
- [ ] Pridat chybove hlasky pod inputy
- [ ] Pridat loading stav na submit tlacitka
- [ ] Nahradit `alert()` za toast notifikace

### Faze 7: Deploy
- [ ] Vytvorit `netlify.toml` s SPA redirect
- [ ] Overit RLS politiky na vsech tabulkach
- [ ] Nastavit produkcni Supabase URL
- [ ] Nastavit environment promenne v Netlify
- [ ] Otestovat build lokalne (`npm run build && npm run preview`)
- [ ] Deploy na Netlify
- [ ] Otestovat auth flow na produkci
- [ ] Otestovat data fetching na produkci

---

## Odhad narocnosti

| Faze | Narocnost | Poznamka |
|---|---|---|
| 1. Priprava projektu | **Nizka** | Jen `npm install` + env — zadny scaffold! |
| 2. Supabase setup | Stredni | SQL schemata, RPC funkce, typy |
| 3. Auth | **Nizka** | Kopie ze sablony, config v Supabase dashboardu |
| 4. Routing | **Nizka** | React Router zustava, jen reorganizace |
| 5. Data layer | **Stredni** | Hlavni prace — hooks pro kazdy typ dat |
| 6. Formulare | Stredni | Zod + React Hook Form + RPC |
| 7. Deploy | **Nizka** | `netlify.toml` + env promenne |

**Celkovy odhad:** Toto je **nejjednodussi konverze** ze vsech tri (Astro, Next.js, Vite+Supabase). Framework se nemeni — React zustava React, Vite zustava Vite, shadcn/ui zustava shadcn/ui. Vetina komponent potrebuje **nula zmen**. Hlavni prace je v Fazich 2 a 5 — nastaveni Supabase a prevod z hardcoded dat na skutecnou databazi.

**Srovnani narocnosti s ostatnimi konverzemi:**

| Konverze | Celkova narocnost | Proc |
|---|---|---|
| Lovable → **Vite + Supabase** | **Nejnizsi** | Stejny framework, jen pridani backendu |
| Lovable → Next.js + Supabase | Stredni | Novy framework (App Router, SSR, middleware) |
| Lovable → Astro | Vyssi | Kompletni prepis (React → Astro komponenty, hooks → vanilla JS) |
