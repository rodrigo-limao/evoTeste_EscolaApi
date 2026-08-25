const API_URL = 'http://localhost:8080/api';

export const matriculaService = {
    async matricular(alunoId, turmaId) {
        return await fetch(`${API_URL}/matriculas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                alunoId: parseInt(alunoId),
                turmaId: parseInt(turmaId)
            })
        });
    }
};
