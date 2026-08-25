import { apiClient } from "./apiClient";

export const TurmaService = {
    async listar() {
        const resposta = await apiClient(`/turmas`);
        if (!resposta.ok) throw new Error('Erro ao buscar turmas.');
        return await resposta.json();
    }
};
