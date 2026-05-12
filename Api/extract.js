// api/extract.js — Vercel Serverless Function
// Mantém a chave da Anthropic no servidor, longe do navegador.

export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { url } = req.body ?? {}
  if (!url) return res.status(400).json({ error: 'URL ausente' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key não configurada' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: `Você extrai informações de produtos de e-commerce.
Dado um link, use a busca na web e responda SOMENTE com JSON válido (sem markdown):
{"name":"nome","price":0.00,"imageUrl":"url ou null","description":"curta","category":"Casa & Decoração|Moda & Acessórios|Tecnologia|Experiências|Beleza|Livros|Alimentação|Viagem|Jóias|Outros","tags":["tag1"]}
Se não encontrar preço, use null. Se não encontrar imagem, use null.`,
        messages: [{ role: 'user', content: `Extraia as informações: ${url}` }],
      }),
    })

    const data = await response.json()
    const text = (data.content ?? [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return res.status(200).json(parsed)
  } catch (err) {
    console.error('extract error:', err)
    return res.status(500).json({ error: 'Não foi possível extrair as informações.' })
  }
}
