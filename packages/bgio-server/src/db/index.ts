import { InMemory } from '@bgio/core/db/inmemory';
import { FlatFile } from './flatfile';

const DBFromEnv = () => {
  return process.env.FLATFILE_DIR
    ? new FlatFile({
        dir: process.env.FLATFILE_DIR,
      })
    : new InMemory();
};

export { InMemory, FlatFile, DBFromEnv };
