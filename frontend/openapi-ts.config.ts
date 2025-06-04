
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: 'openapi.json',
    output: { format: "biome", lint: "biome", path: 'src/client' },
    plugins: ['@hey-api/client-axios'],
});