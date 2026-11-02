import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'gunakan slug lowercase-kebab-case');
const httpsUrl = z.url().refine((value) => value.startsWith('https://'), 'URL harus memakai HTTPS');
const tags = z.array(z.string().trim().min(1)).default([]);

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    slug,
    title: z.string().trim().min(1).max(88),
    summary: z.string().trim().min(1).max(280),
    category: z.string().trim().min(1),
    draft: z.boolean().default(true),
    featured: z.boolean().default(false),
    order: z.number().int().default(100),
    tags,
    repositoryUrl: httpsUrl.optional(),
    demoUrl: httpsUrl.optional(),
    cover: z.string().trim().min(1).optional(),
    alt: z.string().trim().min(1).optional(),
    coverWidth: z.number().int().positive().optional(),
    coverHeight: z.number().int().positive().optional(),
    sourceLinks: z.array(z.object({ label: z.string().trim().min(1), url: httpsUrl }).strict()).default([]),
  }).strict().superRefine((entry, context) => {
    if (entry.cover && !entry.alt) {
      context.addIssue({ code: 'custom', path: ['alt'], message: 'alt wajib diisi jika cover ditentukan' });
    }
    if (entry.cover && !entry.coverWidth) {
      context.addIssue({ code: 'custom', path: ['coverWidth'], message: 'coverWidth wajib diisi jika cover ditentukan' });
    }
    if (entry.cover && !entry.coverHeight) {
      context.addIssue({ code: 'custom', path: ['coverHeight'], message: 'coverHeight wajib diisi jika cover ditentukan' });
    }
    if (!entry.cover && (entry.coverWidth || entry.coverHeight)) {
      context.addIssue({ code: 'custom', path: ['cover'], message: 'cover harus diisi jika dimensi cover ditentukan' });
    }
  }),
});

const site = defineCollection({
  loader: glob({ base: './src/content/site', pattern: '*.json' }),
  schema: z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('profile'),
      name: z.string().trim().min(1),
      field: z.string().trim().min(1),
      summary: z.string().trim().min(1).optional(),
      photo: z.string().trim().min(1).optional(),
      photoAlt: z.string().trim().min(1).optional(),
      cv: z.string().trim().min(1).optional(),
      cvLabel: z.string().trim().min(1).optional(),
    }).strict().superRefine((entry, context) => {
      if (entry.photo && !entry.photoAlt) context.addIssue({ code: 'custom', path: ['photoAlt'], message: 'photoAlt wajib diisi jika photo ditentukan' });
    }),
    z.object({
      kind: z.literal('contact'),
      github: httpsUrl,
      email: z.email().optional(),
      linkedin: httpsUrl.optional(),
    }).strict(),
    z.object({
      kind: z.literal('settings'),
      locale: z.string().trim().min(2),
      siteUrl: httpsUrl,
      featuredLimit: z.number().int().min(1).max(6).default(6),
    }).strict(),
  ]),
});

const sections = defineCollection({
  loader: glob({ base: './src/content/sections', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().trim().min(1),
    slug,
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

const skills = defineCollection({
  loader: glob({ base: './src/content/skills', pattern: '**/*.json' }),
  schema: z.object({
    name: z.string().trim().min(1),
    category: z.string().trim().min(1),
    context: z.string().trim().min(1).optional(),
    projectSlugs: z.array(slug).default([]),
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.json' }),
  schema: z.object({
    organization: z.string().trim().min(1),
    role: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    period: z.string().trim().min(1).optional(),
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

const education = defineCollection({
  loader: glob({ base: './src/content/education', pattern: '**/*.json' }),
  schema: z.object({
    institution: z.string().trim().min(1),
    program: z.string().trim().min(1),
    summary: z.string().trim().min(1).optional(),
    period: z.string().trim().min(1).optional(),
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

const credentials = defineCollection({
  loader: glob({ base: './src/content/credentials', pattern: '**/*.json' }),
  schema: z.object({
    name: z.string().trim().min(1),
    issuer: z.string().trim().min(1),
    issuedAt: z.string().trim().min(1).optional(),
    verifyUrl: httpsUrl.optional(),
    document: z.string().trim().min(1).optional(),
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

export const collections = { projects, site, sections, skills, experience, education, credentials };
