const API_URL = 'http://localhost:8080/api';

export const turmaService = {
    async listar() {
        const url = `${API_URL}/turmas`;
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error('Erro ao buscar turmas.');
        return await resposta.json();
    }
};
