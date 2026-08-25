import { useState, useEffect } from 'react';
import { TurmaService } from '../services/TurmaService';
import { MatriculaService } from '../services/MatriculaService';
import { AlunoService } from '../services/AlunoService';

export default function AbaMatriculas() {
    const [turmas, setTurmas] = useState([]);
    const [alunosAtivos, setAlunosAtivos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Controla o modal do cadastro
    const [modalAberto, setModalAberto] = useState(false); // Controla se o modal está aberto
    const [alunoSelecionado, setAlunoSelecionado] = useState('');
    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    
    // Carrega as turmas e os alunos ativos no dropdown
    const carregarDados = async () => {
        setLoading(true);

        try {
            const listaTurmas = await TurmaService.listar();
            const listaAlunos = await AlunoService.listarTodosAtivos();
            setTurmas(listaTurmas);
            setAlunosAtivos(listaAlunos);
        } catch (e) {
            console.error("Erro ao carregar dados de matrículas: ", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    // Função para submeter a matrícula à API
    const handleRealizarMatricula = async (e) => {
        e.preventDefault(); // Não recarrega a página

        if (!alunoSelecionado || !turmaSelecionada) {
            alert("Por favor, selecione um aluno e uma turma.");
            return;
        }

        try {
            const resposta = await MatriculaService.matricular(alunoSelecionado, turmaSelecionada);

            if (resposta.status === 201) {
                alert('Matrícula realizada com sucesso!');
                setModalAberto(false);
                setAlunoSelecionado('');
                setTurmaSelecionada('');
                carregarDados();
            } else if (resposta.status === 409) {
                // HTTP 409 Conflict - regra de negócio violada
                alert("Falha na matrícula: O aluno já está matriculado nesta turma ou a turma não possui vagas.");
            } else {
                alert("Ocorreu um erro ao tentar processar a matrícula.");
            }
        } catch (e) {
            alert("Erro de rede ao conectar com a API.");
            console.error("Erro de rede ao conectar com a API: ", e);
        }
    };

    return (
        <div className="space-y-6">

            {/* Cabeçalho da Aba */}
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Ocupação de Turmas & Matrículas
                    </h2>
                    <p className="text-gray-500 text-xs">
                        Monitore vagas e faça inscrições em tempo real
                    </p>
                </div>
                <button
                    onClick={() => setModalAberto(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded shadow flex items-center gap-2 cursor-pointer">
                    <i className="fa-solid fa-graduation-cap"></i> Realizar Matrícula
                </button>
            </div>

            {/* Grid de Turmas */}
            {loading ? (
                <div className="text-center py-12 text-gray-500 font-semibold">
                    Carregando turmas...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {turmas.map(turma => {
                    const ocupadas = turma.vagasTotal - turma.vagasDisponiveis;
                    const percentualOcupacao = (ocupadas / turma.vagasTotal) * 100;
                    const estaCheia = turma.vagasDisponiveis === 0;

                    return (
                        <div key={turma.id} className="bg-white rounded-lg shadow md border overflow-hidden flex felx-col justify-between">
                            {/* Header do Card */}
                            <div className="p-5 border-b">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight">
                                        {turma.nome}
                                    </h3>
                                    <span className={`text-xs font-bold uppercase px-2 5 py-1 rounded-full ${
                                        turma.periodo === 'Manha' ? 'bg-amber-100 text-amber-800' :
                                        turma.periodo === 'Tarde' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        {turma.periodo}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-xs">Código da Turma:</p>
                            </div>
                        
                            {/* Corpo do Card */}
                            <div className="p-5 space-y-4 flex-grow">

                                {/* Status das vagas */}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 font-medium">Vagas:</span>
                                    {estaCheia ? (
                                        <span className="bg-red-400 text-red-800 font-bold text-sm px-1.5 py-1 rounded-full">
                                            {/*{turma.vagasDisponiveis} / {turma.vagasTotal}*/}
                                            ESGOTADAS
                                        </span>
                                    ) : (
                                        <span className="text-green-600 font-extrabold text-base">
                                            {turma.vagasDisponiveis} / {turma.vagasTotal}
                                        </span>
                                    )}
                                </div>

                                {/* Barra de Progresso */}
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                                    <div
                                        style={{ witdh: `${percentualOcupacao}` }}
                                        className={`h-full transition-all duration-500 ${estaCheia ? 'bg-red-600' : 'bg-blue-600'}`}>
                                    </div>
                                </div>

                                <div className="flex justify-between text-2xs text-gray 400">
                                    <span>{ocupadas} matriculados</span>
                                    <span>{percentualOcupacao.toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </div>
            )}

            {/* Modal da Matrícula (POST) */}
            {modalAberto && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-user-plus text-green-600"></i> Nova Matrícula Escolar
                        </h3>

                        <form onSubmit={handleRealizarMatricula} className="space-y-4">
                            {/* Dropdown de Alunos Ativos */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Selecione o Aluno (Somente ativos)
                                </label>
                                <select
                                    required
                                    value={alunoSelecionado}
                                    onChange={(e) => setAlunoSelecionado(e.target.value)}
                                    className="border rounded w-full py-2 px-3 focus:outline-blue-500 bg-white">
                                    <option value="">-- Escolha um Aluno --</option>
                                    {alunosAtivos.map(aluno => (
                                        <option key={aluno.id} value={aluno.id}>
                                            {aluno.nome} (E-mail: {aluno.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Dropdown de Turmas Disponíveis */}
                            <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Selecione a Turma
                            </label>
                                <select
                                    required
                                    value={turmaSelecionada}
                                    onChange={(e) => setTurmaSelecionada(e.target.value)}
                                    className="border rounded w-full py-2 px-3 focus:outline-blue-500 bg-white">
                                    <option value="">-- Escolha a Turma --</option>
                                    {turmas.map(turma => (
                                        <option key={turma.id} value={turma.id} disabled={turma.vagasDisponiveis <= 0}>
                                            {turma.nome} ({turma.periodo}) - {turma.vagasDisponiveis} vagas
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Ações */}
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer">
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-gray-400 cursor-pointer">
                                    Confirmar Matrícula
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
