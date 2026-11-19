import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

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
      if (resultados[idx].error) {
        console.warn(`Aviso na tabela ${tabela}:`, resultados[idx].error.message);
      }
      dados[tabela] = resultados[idx].data || [];
    });

    return res.status(200).json(dados);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro ao carregar dados.' });
  }
}
