import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'gunakan slug lowercase-kebab-case');
const httpsUrl = z.url().refine((value) => value.startsWith('https://'), 'URL harus memakai HTTPS');
const tags = z.array(z.string().trim().min(1)).default([]);
const details = z.array(z.string().trim().min(1));
const sourcePages = z.array(z.number().int().min(1).max(3)).default([]);
const localizedText = z.object({
  id: z.string().trim().min(1),
  en: z.string().trim().min(1),
}).strict();
const media = z.object({
  src: z.string().trim().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  kind: z.enum(['photo', 'placeholder']),
  alt: localizedText.optional(),
}).strict();
const period = z.object({
  start: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  kind: z.enum(['range', 'ongoing', 'single']),
  end: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
}).strict().superRefine((entry, context) => {
  if (entry.kind === 'range' && !entry.end) context.addIssue({ code: 'custom', path: ['end'], message: 'end wajib untuk rentang tanggal' });
  if (entry.kind !== 'range' && entry.end) context.addIssue({ code: 'custom', path: ['end'], message: 'end hanya dipakai untuk rentang tanggal' });
});
const projectCopy = z.object({
  id: z.object({ summary: z.string().trim().min(1), paragraphs: details.min(1), imageAlt: z.string().trim().min(1) }).strict(),
  en: z.object({ summary: z.string().trim().min(1), paragraphs: details.min(1), imageAlt: z.string().trim().min(1) }).strict(),
}).strict().superRefine((copy, context) => {
  if (copy.id.paragraphs.length !== copy.en.paragraphs.length) {
    context.addIssue({ code: 'custom', path: ['en', 'paragraphs'], message: 'Jumlah paragraf ID dan EN harus sama' });
  }
});
const skillCopy = z.object({
  id: z.object({ title: z.string().trim().min(1), shortLabel: z.string().trim().min(1), summary: z.string().trim().min(1), imageAlt: z.string().trim().min(1).optional() }).strict(),
  en: z.object({ title: z.string().trim().min(1), shortLabel: z.string().trim().min(1), summary: z.string().trim().min(1), imageAlt: z.string().trim().min(1).optional() }).strict(),
}).strict();
const skillGroupCopy = z.object({
  id: z.object({ title: z.string().trim().min(1), shortLabel: z.string().trim().min(1), summary: z.string().trim().min(1) }).strict(),
  en: z.object({ title: z.string().trim().min(1), shortLabel: z.string().trim().min(1), summary: z.string().trim().min(1) }).strict(),
}).strict();
const skillGroupChip = z.object({ label: localizedText, skillIds: z.array(slug).min(1) }).strict();
const experienceCopy = z.object({
  id: z.object({ category: z.string().trim().min(1), role: z.string().trim().min(1), summary: z.string().trim().min(1), details: details.min(1), imageAlt: z.string().trim().min(1) }).strict(),
  en: z.object({ category: z.string().trim().min(1), role: z.string().trim().min(1), summary: z.string().trim().min(1), details: details.min(1), imageAlt: z.string().trim().min(1) }).strict(),
}).strict().superRefine((copy, context) => {
  if (copy.id.details.length !== copy.en.details.length) {
    context.addIssue({ code: 'custom', path: ['en', 'details'], message: 'Jumlah detail ID dan EN harus sama' });
  }
});
const educationCopy = z.object({
  id: z.object({ program: z.string().trim().min(1), summary: z.string().trim().min(1).optional() }).strict(),
  en: z.object({ program: z.string().trim().min(1), summary: z.string().trim().min(1).optional() }).strict(),
}).strict();
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    slug,
    title: z.string().trim().min(1).max(88),
    categoryIds: z.array(slug).min(1),
    copy: projectCopy,
    media,
    draft: z.boolean().default(true),
    featured: z.boolean().default(false),
    order: z.number().int().default(100),
    tags,
    repositoryUrl: httpsUrl.optional(),
    demoUrl: httpsUrl.optional(),
    sourceLinks: z.array(z.object({ labelKey: slug, url: httpsUrl }).strict()).default([]),
  }).strict(),
});

const site = defineCollection({
  loader: glob({ base: './src/content/site', pattern: '*.json' }),
  schema: z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('profile'),
      name: z.string().trim().min(1),
      location: z.string().trim().min(1).optional(),
      gpa: z.number().positive().optional(),
      languages: z.array(z.object({ id: slug, name: localizedText, level: localizedText }).strict()).default([]),
      copy: z.object({
        id: z.object({ field: z.string().trim().min(1), summary: z.string().trim().min(1), cvSummary: z.string().trim().min(1), photoAlt: z.string().trim().min(1) }).strict(),
        en: z.object({ field: z.string().trim().min(1), summary: z.string().trim().min(1), cvSummary: z.string().trim().min(1), photoAlt: z.string().trim().min(1) }).strict(),
      }).strict(),
      photo: z.string().trim().min(1).optional(),
      photoWidth: z.number().int().positive().optional(),
      photoHeight: z.number().int().positive().optional(),
      cv: z.string().trim().min(1).optional(),
      cvByLocale: z.object({ id: z.string().trim().min(1), en: z.string().trim().min(1) }).strict(),
    }).strict().superRefine((entry, context) => {
      if (entry.photo && !entry.photoWidth) context.addIssue({ code: 'custom', path: ['photoWidth'], message: 'photoWidth wajib diisi jika photo ditentukan' });
      if (entry.photo && !entry.photoHeight) context.addIssue({ code: 'custom', path: ['photoHeight'], message: 'photoHeight wajib diisi jika photo ditentukan' });
      if (!entry.photo && (entry.photoWidth || entry.photoHeight)) context.addIssue({ code: 'custom', path: ['photo'], message: 'photo harus diisi jika dimensi photo ditentukan' });
    }),
    z.object({
      kind: z.literal('contact'),
      github: httpsUrl,
      email: z.email().optional(),
      linkedin: httpsUrl.optional(),
      phone: z.string().regex(/^\+\d{10,15}$/, 'phone harus memakai format E.164').optional(),
      whatsapp: httpsUrl.optional(),
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
    categoryId: slug,
    copy: skillCopy,
    media,
    cvOrder: z.number().int().min(1).max(6).optional(),
    projectSlugs: z.array(slug).default([]),
    sourcePages,
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

const skillGroups = defineCollection({
  loader: glob({ base: './src/content/skill-groups', pattern: '**/*.json' }),
  schema: z.object({
    copy: skillGroupCopy,
    skillIds: z.array(slug).min(1),
    chips: z.array(skillGroupChip).min(1),
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.json' }),
  schema: z.object({
    categoryId: slug,
    organization: z.string().trim().min(1),
    dates: period,
    copy: experienceCopy,
    media,
    sourcePages,
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

const education = defineCollection({
  loader: glob({ base: './src/content/education', pattern: '**/*.json' }),
  schema: z.object({
    categoryId: slug,
    institution: z.string().trim().min(1),
    logo: z.object({
      src: z.string().trim().min(1),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    }).strict().optional(),
    dates: period,
    copy: educationCopy,
    sourcePages,
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

const credentials = defineCollection({
  loader: glob({ base: './src/content/credentials', pattern: '**/*.json' }),
  schema: z.object({
    name: z.string().trim().min(1),
    issuer: z.string().trim().min(1).optional(),
    issuedAt: z.string().trim().min(1).optional(),
    verifyUrl: httpsUrl.optional(),
    document: z.string().trim().min(1).optional(),
    media,
    sourcePage: z.number().int().min(1).max(3).optional(),
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

const credentialSamples = defineCollection({
  loader: glob({ base: './src/content/credential-samples', pattern: '**/*.json' }),
  schema: z.object({
    sample: z.literal(true),
    media: z.object({
      src: z.string().trim().min(1),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      kind: z.literal('placeholder'),
      alt: localizedText,
    }).strict(),
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

const competitions = defineCollection({
  loader: glob({ base: './src/content/competitions', pattern: '**/*.json' }),
  schema: z.object({
    order: z.number().int(),
    draft: z.boolean().default(true),
    isDummy: z.boolean(),
    outcome: z.enum(['winner', 'award', 'finalist', 'participant']),
    copy: z.object({
      id: z.object({ title: z.string().trim().min(1), status: z.string().trim().min(1), description: z.string().trim().min(1) }).strict(),
      en: z.object({ title: z.string().trim().min(1), status: z.string().trim().min(1), description: z.string().trim().min(1) }).strict(),
    }).strict(),
    photos: z.array(z.object({
      src: z.string().trim().min(1),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      kind: z.enum(['photo', 'placeholder']),
      alt: localizedText,
    }).strict()).min(1),
  }).strict(),
});

const software = defineCollection({
  loader: glob({ base: './src/content/software', pattern: '**/*.json' }),
  schema: z.object({
    name: z.string().trim().min(1),
    icon: z.string().trim().min(1),
    monogram: z.string().trim().min(1).max(8),
    order: z.number().int().default(100),
    draft: z.boolean().default(true),
  }).strict(),
});

export const collections = { projects, site, sections, skills, skillGroups, experience, education, credentials, credentialSamples, competitions, software };
