import { apiClient } from "./apiClient";

export const RelatorioService = {
    async obterAlunosPorTurma() {
        const resposta = await apiClient(`/relatorios/alunos-por-turma`);
        if (!resposta.ok) throw new Error('Erro ao carregar o relatório de alunos por turma.');
        return await resposta.json(); // Retorna array com NomeTurma, TotalMatriculados e VagasRestantes
    }
};
