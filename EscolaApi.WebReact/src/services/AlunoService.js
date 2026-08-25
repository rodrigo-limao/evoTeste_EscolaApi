import { apiClient } from "./apiClient";

export const AlunoService = {
    // Chamada da listagem com filtro e paginação
    async listar(buscaNome, pagina, pageSize = 5) {
        const resposta = await apiClient(`/alunos?nome=${buscaNome}&page=${pagina}&pageSize=${pageSize}`);
        if (!resposta.ok) throw new Error('Erro ao buscar alunos');
        return await resposta.json();
    },

    // Busca uma lista sem paginação para alimentar o dropdown do mldal
    // pageSize = 100 (apenas para desenvolvimento)
    async listarTodosAtivos() {
        const resposta = await apiClient(`/alunos?nome=&page=1&pageSize=100`);
        if (!resposta.ok) throw new Error('Erro ao buscar todos os alunos');
        const dados = await resposta.json();
        // Filtro para garantir apenas os ativos
        return (dados.items || []).filter(aluno => aluno.ativo);
    },

    // Chamada do novo cadastro
    async cadastrar(aluno) {
        return await apiClient(`/alunos`, {
            method: 'POST',
            body: JSON.stringify(aluno)
        });
    },

    // Chamada da edição
    async atualizar(id, aluno) {
        return await apiClient(`/alunos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                id,
                nome: aluno.nome,
                email: aluno.email,
                dataNascimento: aluno.dataNascimento
            })
        });
    },

    // Chamada da exclusão lógica
    async excluir(id) {
        return await apiClient(`/alunos/${id}`, {
            method: 'DELETE'
        });
    }
}
