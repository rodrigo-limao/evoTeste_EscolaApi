import { useState, useEffect } from 'react';

export default function App() {
    // O "useState" cria uma variável de estado (abaAtiva)
    // e uma função para alterá-la (setAbaAtiva)
    // Inicinando o app exibindo a tela de 'alunos'
    const [abaAtiva, setAbaAtiva] = useState('alunos');

    // Estados para listagem e busca
    const [alunos, setAlunos] = useState([]); // Guarda os alunos na página atual
    const [buscaNome, setBuscaNome] = useState(''); // Guarda o texto digitado na busca
    const [pagina, setPagina] = useState(1); // Guarda a páginal atual
    const [totalAlunos, setTotalAlunos] = useState(0); // Guarda o total de registros

    // Estados para cadastro
    const [modalCadastroAluno, setModalCadastroAluno] = useState(false); // Controla se o modal está aberto
    const [cadastroAluno, setCadastroAluno] = useState({
        nome: '',
        email: '',
        dataNascimento: '' // Campos obrigatórios no banco
    });

    // Estado auxiliar para edição do aluno
    const [idEdicao, setIdEdicao] = useState(null);

    // Função para carregar alunos da API
    const carregarAlunos = async () => {
        try {
            // Passamos os parâmetros dinacimamente para o back-end
            const url = `http://localhost:8080/api/alunos?nome=${buscaNome}&page=${pagina}&pageSize=5`;
            const resposta = await fetch(url);
            const dados = await resposta.json();

            // Atualizamos a lista de alunos e guardamos o total de registros retornados da API
            setAlunos(dados.items || []);
            setTotalAlunos(dados.totalItems || 0);
        } catch (e) {
            console.error("Erro ao conectar com a API: ", e);
        }
    };

    useEffect(() => {
        if (abaAtiva === 'alunos') {
            carregarAlunos();
        }
    }, [abaAtiva, pagina]);

    // Função auxiliar para quando o usuário clicar em 'Buscar'
    const handleBusca = (e) => {
        e.preventDefault(); // Evita recarregar a página!

        if (pagina === 1) {
            // Na primeira página o 'useEffect' não faz nada, pois não mudou de estado
            // Então fazemos a chamada manualmente para filtrar
            carregarAlunos();
        } else {
            // Em qualquer outra página mudamos o estado para 1
            // O 'useEffect' vai detectar a mudança de página e o fetch vai acontecer automaticamente
            setPagina(1);
        }
    };

    // Função para preparar os dados e abrir o modal para edição
    const handleEditaAluno = (aluno) => {
        setIdEdicao(aluno.id); // O id que estamos editando

        // Formata a data do banco
        const dataFormatada = aluno.dataNascimento ? aluno.dataNascimento.split('T') : '';

        setCadastroAluno({
            nome: aluno.nome,
            email: aluno.email,
            dataNascimento: dataFormatada
        });
        setModalCadastroAluno(true); // Abre o modal
    };

    // Função para fechar o modal e limpar o form
    const fecharModal = () => {
        setModalCadastroAluno(false);
        setIdEdicao(null);
        setCadastroAluno({ nome: '', email: '', dataNascimento: '' });
    };

    // Função para submeter o cadastro do aluno
    const handleSalvaAluno = async (e) => {
        e.preventDefault(); // Evita recarregar a página!

        if (idEdicao) {
            await atualizarAluno();
        } else {
            await cadastrarAluno();
        }
    };

    // Requsição de cadastro (POST)
    const cadastrarAluno = async () => {
        try {
            const resposta = await fetch('http://localhost:8080/api/alunos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cadastroAluno)
            });

            if (resposta.status === 201) {
                alert('Aluno cadastrado com sucesso!');
                fecharModal();
                carregarAlunos();
            } else {
                const erro = await resposta.json();
                alert(`Erro ao cadastrar: ${erro.message || 'Verifique os dados enviados.'}`);
            }
        } catch (e) {
            alert('Erro de rede ao cadastrar aluno.');
            console.error('Erro ao cadastrar: ', e);
        }
    };

    // Requisição de Atualização (PUT)
    const atualizarAluno = async () => {
        try {
            const resposta = await fetch(`http://localhost:8080/api/alunos/${idEdicao}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: idEdicao,
                    nome: cadastroAluno.nome,
                    email: cadastroAluno.email,
                    dataNascimento: cadastroAluno.dataNascimento
                })
            });

            if (resposta.status === 204) {
                alert('Aluno atualizado com sucesso!');
                fecharModal();
                carregarAlunos();
            } else {
                alert('Erro ao atualizar aluno.');
            }
        } catch (e) {
            alert('Erro de rede ao atualizar aluno.');
            console.error('Erro ao atualizar: ', e);
        }
    };

    // Função para exclusão lógica do aluno
    const handleExcluiAluno = async (id) => {
        if (confirm('Deseja realmente inativar este aluno?') == false) return;

        try {
            const resposta = await fetch(`http://localhost:8080/api/alunos/${id}`, {
                method: 'DELETE'
            });

            if (resposta.status === 204) {
                alert('Aluno excluído com sucesso!');
                carregarAlunos(); // Atualiza a tabela para não exibir o aluno
            } else {
                alert('Erro ao excluir o aluno.');
            }
        } catch (e) {
            alert('Erro de rede ao conectar com a API.');
            console.error('Erro ao excluir aluno: ', e);
        }
    };

    // Função para formatar a data na exibição
    const formatarData = (dataIso) => {
        if (!dataIso) return '-';

        // Pega a parte da data antes do 'T'
        const [data] = dataIso.split('T');

        // Separa ano, mês e dia
        const [ano, mes, dia] = data.split('-');

        // Retorna formatado
        return `${dia}/${mes}/${ano}`;
    };

    return (
        <div className='min-h-screen bg-gray-50 text-gray-900'>

        {/* Cabeçalho */}
        <header className='bg-blue-900 text-white shadow-md'>
            <div className='container mx-auto px-6 py-4 flex justify-between items-center'>
                <div>
                    <h1 className='text-2x1 font-bold traking-wide'>Escola API - Admin</h1>
                    <p className='text-blue-200 text-xs'>Módulo Visual Integrado com React ⚛️</p>
                </div>

                {/* Menu de Navegação */}
                <nav className='flex space-x-2'>
                    <button onClick={() => setAbaAtiva('alunos')}
                        className={`px-4 py-2 rounded transition text-sm font-semibold ${ 
                            abaAtiva === 'alunos' ? 'bg-blue-700 text-white' : 'hover:bg-blue-800 text-blue-100'}`}>
                        Alunos
                    </button>
                    <button onClick={() => setAbaAtiva('matriculas')}
                        className={`px-4 py-2 rounded transition text-sm font-semibold ${ 
                            abaAtiva === 'matriculas' ? 'bg-blue-700 text-white' : 'hover:bg-blue-800 text-blue-100'}`}>
                        Matrículas
                    </button>
                    <button onClick={() => setAbaAtiva('relatorios')}
                        className={`px-4 py-2 rounded transition text-sm font-semibold ${ 
                            abaAtiva === 'relatorios' ? 'bg-blue-700 text-white' : 'hover:bg-blue-800 text-blue-100'}`}>
                        Relatórios
                    </button>
                </nav>
            </div>
        </header>

        {/* Conteúdo Principal */}
        <main className='container mx-auto px-6 py-8'>
            
            {/* ABA: ALUNOS */}
            {abaAtiva === 'alunos' && (
                <div className='bg-white rounded-lg shadow p-6'>
                    <h2 className='text-xl font-bold mb-4 text-gray-800'>Gerenciamento de Alunos</h2>

                    {/* Barra de Busca */}
                    <form className='flex gap-2 mb-6' onSubmit={handleBusca}>
                        <input
                            type='text'
                            placeholder='Filtrar alunos por nome...'
                            value={buscaNome}
                            onChange={(e) => setBuscaNome(e.target.value)} // Atualiza o estado conforme digita
                            className='border rounded px-4 py-2 w-full md:w-80 shadow-sm focus:outline-blue-500'
                        />
                        <button type='submit' className='bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-900 transition shadow'>
                            Buscar
                        </button>

                        {/* Botão para Abrir o Modal */}
                        <button
                            onClick={() => setModalCadastroAluno(true)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded transition shadow">
                            + Novo Aluno
                        </button>
                    </form>
                
                    {/* Tabela de Alunos */}
                    <div className='overflow-x-auto rounded border'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-100 text-gray-700 font-semibold text-xs uppercase'>
                          <tr>
                            <th className='px-6 py-3 text-left'>ID</th>
                            <th className='px-6 py-3 text-left'>Nome</th>
                            <th className='px-6 py-3 text-left'>E-mail</th>
                            <th className='px-6 py-3 text-left'>Data Nascimento</th>
                            <th className='px-6 py-3 text-left'>Status</th>
                            <th className="px-6 py-3 text-left">Ações</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200 bg-white text-sm'>
                            {alunos.length > 0 ? (
                                alunos.map(aluno => (
                                <tr key={aluno.id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 font-mono'>{aluno.id}</td>
                                    <td className='px-6 py-4 font-semibold'>{aluno.nome}</td>
                                    <td className='px-6 py-4'>{aluno.email}</td>
                                    <td className='px-6 py-4'>{formatarData(aluno.dataNascimento)}</td>
                                    <td className='px-6 py-4'>
                                    {aluno.ativo ? (
                                        <span className='bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-bold'>
                                            Ativo
                                        </span>
                                    ) : (
                                        <span className='bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold'>
                                            Inativo
                                        </span>
                                    )}
                                    </td>
                                    {/* Coluna de Ações */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            {aluno.ativo ? (
                                                <>
                                                <button
                                                    onClick={() => handleEditaAluno(aluno)}
                                                    title='Editar Aluno'
                                                    className="text-blue-600 hover:text-blue-800 transition transform hover:scale-110 cursor-pointer">
                                                    <i className="fa-solid fa-pen text-sm"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleExcluiAluno(aluno.id)}
                                                    title='Excluir Aluno'
                                                    className="text-red-600 hover:text-red-800 transition transform hover:scale-110 cursor-pointer">
                                                    <i className="fa-solid fa-xmark text-base font-bold"></i>
                                                </button>
                                                </>
                                            ) : (
                                                <span className="text-gray-300 select-none">-</span>
                                            )}    
                                        </div>
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan='4' className='text-center py-8 text-gray-500'>
                                        Nenhum aluno carregado. 
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                    
                    {/* Controles de Paginação */}
                    <div className='flex justify-between items-center mt-6'>
                        <p className='text-xs text-gray-600'>
                            Total de registros: <span className='font-bold'>{totalAlunos}</span> alunos
                        </p>
                        <div className='flex space-x-2'>
                            <button
                                disabled={pagina === 1} // Desabilita se estiver na primeira página
                                onClick={() => setPagina(pagina - 1)}
                                className='bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 transition'>
                            Anterior
                            </button>
                            <button
                                disabled={pagina * 5 >= totalAlunos} // Desabilita se já exibiu todos os itens disponíveis
                                onClick={() => setPagina(pagina + 1)}
                                className='bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 transition'>
                            Próximo
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Renderiza apenas se a aba ativa for 'matriculas' */}
            {abaAtiva === 'matriculas' && (
                <div className='bg-white rounded-lg shadow p-6'>
                    <h2 className='text-xl font-bold mb-4 text-gray-800'>Matrículas & Ocupação de Turmas</h2>
                    <p className='text-gray-600 text-sm'>Aqui faremos os cadastros de matrículas e o monitoramento de vagas em tempo real.</p>
                </div>
            )}


            {/* Renderiza apenas se a aba ativa for 'relatorios' */}
            {abaAtiva === 'relatorios' && (
                <div className='bg-white rounded-lg shadow p-6'>
                    <h2 className='text-xl font-bold mb-4 text-gray-800'>Relatório Consolidado de Turmas</h2>
                    <p className='text-gray-600 text-sm'>Exibição de dados agregados vindos diretamente das queries de banco.</p>
                </div>
            )}
        </main>

        {/* Modal Compartilhado (Cadastro/Edição) */}
        {modalCadastroAluno && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">

                    {/* Título do modal */}
                    <h3 className="text-lg font-bold mb-4 text-gray-800">
                        {idEdicao ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
                    </h3>
                    
                    <form onSubmit={handleSalvaAluno} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Nome Completo
                            </label>
                            <input 
                                type="text" required
                                value={cadastroAluno.nome}
                                onChange={(e) => setCadastroAluno({ ...cadastroAluno, nome: e.target.value })}
                                className="border rounded w-full py-2 px-3 focus:outline-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                E-mail
                            </label>
                            <input 
                                type="email" required
                                value={cadastroAluno.email}
                                onChange={(e) => setCadastroAluno({ ...cadastroAluno, email: e.target.value })}
                                className="border rounded w-full py-2 px-3 focus:outline-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Data de Nascimento
                            </label>
                            <input 
                                type="date" required
                                value={cadastroAluno.dataNascimento}
                                onChange={(e) => setCadastroAluno({ ...cadastroAluno, dataNascimento: e.target.value })}
                                className="border rounded w-full py-2 px-3 focus:outline-blue-500" />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <button 
                                type="button" 
                                onClick={fecharModal}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold">
                                    {idEdicao ? 'Atualizar' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        </div>
    );
}
