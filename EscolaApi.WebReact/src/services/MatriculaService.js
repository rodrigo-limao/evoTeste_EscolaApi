import { apiClient } from "./apiClient";

export const MatriculaService = {
    async matricular(alunoId, turmaId) {
        return await apiClient(`/matriculas`, {
            method: 'POST',
            body: JSON.stringify({
                alunoId: parseInt(alunoId),
                turmaId: parseInt(turmaId)
            })
        });
    }
};
