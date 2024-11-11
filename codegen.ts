import type { CodegenConfig } from '@graphql-codegen/cli'
import dotenv from 'dotenv'

dotenv.config()

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GITHUB_GQL_SCHEMA,
  documents: ['./src/**/*.graphql'],
  generates: {
    './schema.generated.graphql': {
      plugins: ['schema-ast'],
      config: {
        descriptions: true,
        schemaDescription: true,
      },
    },
    'src/types.ts': {
      plugins: [
        'typescript',
        'typescript-document-nodes',
        'typescript-operations',
      ],
    },
  },
}

export default config
