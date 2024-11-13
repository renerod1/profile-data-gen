import type { CodegenConfig } from '@graphql-codegen/cli'
import dotenv from 'dotenv'
import { resolve } from 'path'

const envPath = resolve(__dirname, 'src', 'environments', '.env')
dotenv.config({ path: envPath })

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GITHUB_GQL_SCHEMA,
  documents: ['./ProfileDataGen/src/**/*.graphql'],
  generates: {
    './ProfileDataGen/schema.generated.graphql': {
      plugins: ['schema-ast'],
      config: {
        descriptions: true,
        schemaDescription: true,
      },
    },
    './ProfileDataGen/types.ts': {
      plugins: [
        'typescript',
        'typescript-document-nodes',
        'typescript-operations',
      ],
    },
  },
}

export default config
