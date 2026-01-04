// CONFIGURAÇÃO CENTRAL DO SUPABASE ZHOU CLOUD
const SB_URL = "https://jxwxvzvxaabzoajdhetw.supabase.co";
const SB_KEY = "sb_publishable_MFyO9fL-XKBzrVC0SRBOuw_bqghFOzF";

const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// Funções Globais para facilitar o uso nos outros arquivos
const DB = {
    // Busca todas as unidades cadastradas
    async buscarUnidades() {
        const { data, error } = await supabaseClient.from('unidades').select('*').order('nome');
        if (error) console.error("Erro unidades:", error);
        return data || [];
    },

    // Busca itens que o cozinheiro marcou como falta
    async buscarFaltas(unidadeId = null) {
        let query = supabaseClient.from('faltas').select('*, unidades(nome)').order('created_at', { ascending: false });
        if (unidadeId && unidadeId !== 'TODAS') {
            query = query.eq('unidade_id', unidadeId);
        }
        const { data, error } = await query;
        if (error) console.error("Erro faltas:", error);
        return data || [];
    },

    // Envia um novo item faltando (usado pelo cozinheiro)
    async enviarFalta(lojaId, item, qtd) {
        const { error } = await supabaseClient.from('faltas').insert([{
            unidade_id: lojaId,
            item_nome: item.toUpperCase(),
            quantidade: qtd,
            status: 'pendente'
        }]);
        return !error;
    },

    // Muda o status para concluído quando você faz o pedido
    async darBaixa(id) {
        const { error } = await supabaseClient.from('faltas').update({ status: 'concluido' }).eq('id', id);
        return !error;
    }
};