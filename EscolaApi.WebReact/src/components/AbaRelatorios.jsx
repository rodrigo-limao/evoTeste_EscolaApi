import { useState, useEffect } from "react";
import { RelatorioService } from '../services/RelatorioService';

export default function AbaRelatorios() {
    const [relatorio, setRelatorio] = useState([]);
    const [loading, setLoading] = useState(false);

    const carregarRelatorio = async () => {
        setLoading(true);

        try {
            const dados = await RelatorioService.obterAlunosPorTurma();
            setRelatorio(dados || []);
        } catch (e) {
            console.error("Erro ao carregar relatório: ", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarRelatorio();
    }, []);

    return (
        <div className="space-y-6">
            
            {/* Cabeçalho */}
            <div className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Relatório de Ocupação de Turmas
                    </h2>
                    <p className="text-gray-500 text-xs">
                        Dados consolidados vindos diretamente de agrupamentos nativos no SQL Server.
                    </p>
                </div>
                <button
                    onClick={carregarRelatorio}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition shadow cursor-pointer text-sm flex items-center gap-2">
                    <i className="fa-solid fa-rotate-right"></i>
                    Atualizar Dados
                </button>
            </div>

            {/* Grid/Tabela de Dados */}
            {loading ? (
                <div className="text-center py-12 text-gray-500 font-semibold">
                    Carregando relatório...
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 text-gray-700 font-semibold text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Nome da Turma</th>
                                    <th className="px-6 py-3 text-center">Alunos Matriculados</th>
                                    <th className="px-6 py-3 text-center">Vagas Restantes</th>
                                    <th className="px-6 py-3 text-center">Nível de Ocupação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {relatorio.length > 0 ? (
                                    relatorio.map((item, idx) => {
                                        // Mapeamento para suportar PascalCase e camelCase
                                        const nomeTurma = item.nomeTurma || item.NomeTurma || '-';
                                        const totalMatriculados = item.totalMatriculados !== undefined
                                            ? item.totalMatriculados
                                            : (item.TotalMatriculados || 0);
                                        const vagasRestantes = item.vagasRestantes !== undefined
                                            ? item.vagasRestantes
                                            : (item.VagasRestantes || 0);
    
                                        const totalVagas = totalMatriculados + vagasRestantes;
                                        const percentual = totalVagas > 0 ? (totalMatriculados / totalVagas) * 100 : 0;
    
                                        return (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-semibold text-gray-800">{nomeTurma}</td>
                                                <td className="px-6 py-4 text-center font-mono font-bold text-blue-600">{totalMatriculados}</td>
                                                <td className="px-6 py-4 text-center font-mono font-bold text-green-600">{vagasRestantes}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <div className="w-28 bg-gray-100 rounded-full h-2.5 overflow-hidden border shadow-inner">
                                                            <div style={{ witdh: `${percentual}%` }}
                                                                className={`h-full transition-all duration-500 ${percentual === 100 ? 'bg-red-500' : 'bg-blue-500'}`}>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-500 font-extrabold w-8">
                                                            {percentual.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-500">
                                            Nenhum dado retornado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
