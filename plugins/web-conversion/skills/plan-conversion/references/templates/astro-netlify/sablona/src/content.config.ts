import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Kolekce aktualit / blogu — přizpůsobit pole dle CMS config.yml
const aktuality = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/aktuality' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Přidat další kolekce dle potřeby:
// const produkty = defineCollection({ ... });

export const collections = { aktuality };
