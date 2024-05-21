import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current file URL and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typesArray = loadFilesSync(path.join(__dirname, './schemas'), { extensions: ['graphql'] });
const typeDefs = mergeTypeDefs(typesArray);

export default typeDefs;
