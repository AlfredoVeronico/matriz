const { createClient } = require('@supabase/supabase-js');

async function fetchAllRows(supabase, tabela, pageSize = 1000) {
  let allRows = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from(tabela)
      .select('*')
      .range(from, from + pageSize - 1);

    if (error) {
      throw new Error(`${tabela}: ${error.message}`);
    }

    if (!data || data.length === 0) {
      break;
    }

    allRows = allRows.concat(data);

    if (data.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return allRows;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Variáveis SUPABASE_URL ou SUPABASE_KEY em falta na Vercel.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const tabelas = [
    'departamentos',
    'categorias_competencia',
    'competencias',
    'funcoes',
    'requisitos_funcao',
    'colaboradores',
    'avaliacoes_colaborador',
    'topo',
    'sede',
    'delegacoes',
    'equipas',
    'formacoes_realizadas'
  ];

  try {
    const resultados = await Promise.all(
      tabelas.map((tabela) => fetchAllRows(supabase, tabela))
    );

    const dados = {};
    tabelas.forEach((tabela, idx) => {
      dados[tabela] = resultados[idx] || [];
    });

    return res.status(200).json(dados);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro ao carregar dados.' });
  }
};
