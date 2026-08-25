const API_URL = 'http://localhost:8080/api';

export const alunoService = {
    // Chamada da listagem com filtro e paginação
    async listar(buscaNome, pagina, pageSize = 5) {
        const url = `${API_URL}/alunos?nome=${buscaNome}&page=${pagina}&pageSize=${pageSize}`;
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error('Erro ao buscar alunos');
        return await resposta.json();
    },

    // Busca uma lista sem paginação para alimentar o dropdown do mldal
    // pageSize = 100 (apenas para desenvolvimento)
    async listarTodosAtivos() {
        const url = `${API_URL}/alunos?nome=&page=1&pageSize=100`;
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error('Erro ao buscar todos os alunos');
        const dados = await resposta.json();
        // Filtro para garantir apenas os ativos
        return (dados.items || []).filter(aluno => aluno.ativo);
    },

    // Chamada do novo cadastro
    async cadastrar(aluno) {
        return await fetch(`${API_URL}/alunos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aluno)
        });
    },

    // Chamada da edição
    async atualizar(id, aluno) {
        return await fetch(`${API_URL}/alunos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
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
        return await fetch(`${API_URL}/alunos/${id}`, {
            method: 'DELETE'
        });
    }
}
