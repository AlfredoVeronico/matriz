const { createClient } = require('@supabase/supabase-js');

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
    'equipas'
  ];

  try {
    const resultados = await Promise.all(
      tabelas.map((tabela) => supabase.from(tabela).select('*'))
    );

    const dados = {};
    tabelas.forEach((tabela, idx) => {
      dados[tabela] = resultados[idx].data || [];
    });

    return res.status(200).json(dados);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro ao carregar dados.' });
  }
};
