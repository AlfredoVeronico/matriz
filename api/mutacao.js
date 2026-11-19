import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const TABELAS_PERMITIDAS = [
  'colaboradores',
  'requisitos_funcao',
  'avaliacoes_colaborador'
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { tabela, acao, payload, id } = req.body || {};

  if (!TABELAS_PERMITIDAS.includes(tabela)) {
    return res.status(403).json({ error: 'Tabela não permitida.' });
  }

  try {
    let response;

    if (acao === 'insert') {
      response = await supabase.from(tabela).insert(payload);
    } else if (acao === 'update' && id) {
      response = await supabase.from(tabela).update(payload).eq('id', id);
    } else {
      return res.status(400).json({ error: 'Operação ou ID inválido.' });
    }

    if (response.error) {
      throw response.error;
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro ao guardar na base de dados.' });
  }
}
