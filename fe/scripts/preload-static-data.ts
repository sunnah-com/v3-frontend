import { businessApi } from '../src/lib/api-client';
import { Language } from '../src/proto/api';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    const [langs, collections, refs] = await Promise.all([
      businessApi.getAllLanguages(),
      businessApi.getAllCollections(Language.LANGUAGE_ENGLISH),
      businessApi.getAllReferenceTypes(),
    ]);

    const data = {
      languages: langs.languages ?? [],
      collections: { [Language.LANGUAGE_ENGLISH]: collections.collections ?? [] },
      referenceTypes: refs.referenceTypes ?? [],
    };

    const outPath = process.env.STATIC_DATA_PATH || path.join(process.cwd(), 'preloaded-static-data.json');
    await fs.writeFile(outPath, JSON.stringify(data));
    console.log('Static data written to', outPath);
  } catch (err) {
    console.error('Failed to preload static data', err);
    process.exit(1);
  }
}

main();
