import { Client } from 'typesense'

export const typesense = new Client({
  nodes: [
    {
      host: process.env['TYPESENSE_HOST'] || 'localhost',
      port: parseInt(process.env['TYPESENSE_PORT'] || '8108', 10),
      protocol: process.env['TYPESENSE_PROTOCOL'] || 'http',
    },
  ],
  apiKey: process.env['TYPESENSE_API_KEY'] || 'change-this-master-key',
  connectionTimeoutSeconds: 2,
})

export async function initTypesense() {
  const schema = {
    name: 'products',
    fields: [
      { name: 'id', type: 'string' as const },
      { name: 'tenantId', type: 'string' as const, facet: true },
      { name: 'name', type: 'string' as const },
      { name: 'description', type: 'string' as const },
      { name: 'basePrice', type: 'float' as const },
      { name: 'categoryId', type: 'string' as const, facet: true, optional: true },
      { name: 'isActive', type: 'bool' as const, facet: true },
      { name: 'createdAt', type: 'int64' as const },
    ],
    default_sorting_field: 'createdAt',
  }

  try {
    await typesense.collections('products').retrieve()
    console.log('[Typesense] Collection "products" already exists')
  } catch (err: any) {
    if (err.status === 404) {
      await typesense.collections().create(schema)
      console.log('[Typesense] Collection "products" created')
    } else {
      console.error('[Typesense] Error initializing collection:', err)
    }
  }
}
