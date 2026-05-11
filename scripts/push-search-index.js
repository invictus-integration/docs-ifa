#!/usr/bin/env node
/**
 * push-search-index.js
 *
 * Creates (or updates) the Azure AI Search index and uploads all documents
 * from v6-knowledge.json.
 *
 * Usage:
 *   node scripts/push-search-index.js
 *
 * Required environment variables (copy from .env or set in shell):
 *   AZURE_SEARCH_ENDPOINT    e.g. https://my-service.search.windows.net
 *   AZURE_SEARCH_INDEX       e.g. v6-docs
 *   AZURE_SEARCH_ADMIN_KEY   Admin key (not query key)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));

const ENDPOINT  = process.env.AZURE_SEARCH_ENDPOINT?.replace(/\/$/, '');
const INDEX     = process.env.AZURE_SEARCH_INDEX;
const ADMIN_KEY = process.env.AZURE_SEARCH_ADMIN_KEY;
const API_VER   = '2024-05-01-preview';

// How many documents to upload per batch (Azure limit: 1 000 docs or 16 MB)
const BATCH_SIZE = 500;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
if (!ENDPOINT || !INDEX || !ADMIN_KEY) {
  console.error(
    'Missing required env vars.\n' +
    'Set AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_INDEX, AZURE_SEARCH_ADMIN_KEY'
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Index schema — must match the fields in v6-knowledge.json
// ---------------------------------------------------------------------------
const INDEX_SCHEMA = {
  name: INDEX,
  fields: [
    { name: 'id',            type: 'Edm.String', key: true,  searchable: false, filterable: true  },
    { name: 'title',         type: 'Edm.String', key: false, searchable: true,  filterable: false, analyzer: 'en.microsoft' },
    { name: 'content',       type: 'Edm.String', key: false, searchable: true,  filterable: false, analyzer: 'en.microsoft' },
    { name: 'filepath',      type: 'Edm.String', key: false, searchable: false, filterable: true,  retrievable: true },
    { name: 'category',      type: 'Edm.String', key: false, searchable: false, filterable: true,  facetable: true  },
    { name: 'sidebar_label', type: 'Edm.String', key: false, searchable: true,  filterable: false },
    { name: 'version',       type: 'Edm.String', key: false, searchable: false, filterable: true,  facetable: true  },
  ],
  semantic: {
    configurations: [
      {
        name: 'default',
        prioritizedFields: {
          titleField:         { fieldName: 'title' },
          contentFields:      [{ fieldName: 'content' }],
          keywordsFields:     [{ fieldName: 'category' }],
        },
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function azureRequest(path, method, body) {
  const res = await fetch(`${ENDPOINT}${path}?api-version=${API_VER}`, {
    method,
    headers: {
      'api-key': ADMIN_KEY,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Azure Search ${method} ${path} → ${res.status}\n${text}`);
  }

  return text ? JSON.parse(text) : null;
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// Step 1: Create or update the index
// ---------------------------------------------------------------------------
async function ensureIndex() {
  console.log(`\n🔍 Checking index "${INDEX}"…`);

  let exists = false;
  try {
    await azureRequest(`/indexes/${INDEX}`, 'GET');
    exists = true;
  } catch {
    // 404 = does not exist yet
  }

  if (exists) {
    console.log(`   Index exists — updating schema…`);
    await azureRequest(`/indexes/${INDEX}`, 'PUT', INDEX_SCHEMA);
    console.log(`   ✅ Schema updated.`);
  } else {
    console.log(`   Index not found — creating…`);
    await azureRequest(`/indexes`, 'POST', INDEX_SCHEMA);
    console.log(`   ✅ Index created.`);
  }
}

// ---------------------------------------------------------------------------
// Step 2: Upload documents in batches
// ---------------------------------------------------------------------------
async function uploadDocuments(docs) {
  const batches = chunk(docs, BATCH_SIZE);
  console.log(`\n📤 Uploading ${docs.length} documents in ${batches.length} batch(es)…`);

  let uploaded = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const payload = {
      value: batch.map(doc => ({
        '@search.action': 'mergeOrUpload',
        ...doc,
      })),
    };

    const result = await azureRequest(`/indexes/${INDEX}/docs/index`, 'POST', payload);

    const succeeded = result.value?.filter(r => r.status).length ?? 0;
    const failed    = result.value?.filter(r => !r.status) ?? [];

    uploaded += succeeded;
    process.stdout.write(`   Batch ${i + 1}/${batches.length}: ${succeeded}/${batch.length} ok`);

    if (failed.length > 0) {
      console.log(` — ⚠️  ${failed.length} failed:`);
      failed.slice(0, 5).forEach(f => console.log(`      • ${f.key}: ${f.errorMessage}`));
    } else {
      console.log('');
    }
  }

  console.log(`\n✅ Uploaded ${uploaded}/${docs.length} documents.`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`Azure AI Search index push`);
  console.log(`  Endpoint : ${ENDPOINT}`);
  console.log(`  Index    : ${INDEX}`);

  const knowledgeFile = resolve(__dirname, '..', 'v6-knowledge.json');
  console.log(`  Source   : ${knowledgeFile}`);

  let knowledge;
  try {
    knowledge = JSON.parse(readFileSync(knowledgeFile, 'utf8'));
  } catch (e) {
    console.error(`\n❌ Could not read v6-knowledge.json: ${e.message}`);
    process.exit(1);
  }

  const docs = knowledge.value ?? knowledge;
  if (!Array.isArray(docs) || docs.length === 0) {
    console.error('\n❌ v6-knowledge.json contains no documents.');
    process.exit(1);
  }

  console.log(`  Documents: ${docs.length}`);

  await ensureIndex();
  await uploadDocuments(docs);

  console.log('\n🎉 Done. Your Azure AI Search index is up to date.');
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
