import { useState, useEffect } from 'react';
import { alunoService } from '../services/AlunoService';

export default function AbaAlunos() {
    // Estados para listagem e busca
    const [alunos, setAlunos] = useState([]); // Guarda os alunos na página atual
    const [buscaNome, setBuscaNome] = useState(''); // Guarda o texto digitado na busca
    const [pagina, setPagina] = useState(1); // Guarda a páginal atual
    const [totalAlunos, setTotalAlunos] = useState(0); // Guarda o total de registros

    // Estados para cadastro
    const [modalAberto, setModalAberto] = useState(false); // Controla se o modal está aberto
    const [cadastro, setCadastro] = useState({
        nome: '',
        email: '',
        dataNascimento: '' // Campos obrigatórios no banco
    });

    // Estado auxiliar para edição do aluno
    const [idEdicao, setIdEdicao] = useState(null);

    useEffect(() => {
        carregarAlunos();
    }, [pagina]);

    // Função para carregar alunos da API
    const carregarAlunos = async () => {
        try {
            const dados = await alunoService.listar(buscaNome, pagina);
            setAlunos(dados.items || []);
            setTotalAlunos(dados.totalItems || 0);
        } catch (e) {
            console.error("Erro ao carregar alunos: ", e);
        }
    };

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
    const handlePrepararEdicao = (aluno) => {
        setIdEdicao(aluno.id); // O id que estamos editando

        // Formata a data do banco
        const dataFormatada = aluno.dataNascimento ? aluno.dataNascimento.split('T') : '';

        setCadastro({
            nome: aluno.nome,
            email: aluno.email,
            dataNascimento: dataFormatada
        });
        setModalAberto(true); // Abre o modal
    };

    // Função para fechar o modal e limpar o form
    const fecharModal = () => {
        setModalAberto(false);
        setIdEdicao(null);
        setCadastro({ nome: '', email: '', dataNascimento: '' });
    };

    // Função para submeter o cadastro do aluno
    const handleSalvar = async (e) => {
        e.preventDefault(); // Evita recarregar a página!

        try {
            let resposta;
            if (idEdicao) {
                resposta = await alunoService.atualizar(idEdicao, cadastro);
            } else {
                resposta = await alunoService.cadastrar(cadastro);
            }

            if (resposta.status === 201 || resposta.status === 204) {
                alert(idEdicao ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!');
                fecharModal();
                carregarAlunos();
            } else {
                const erro = await resposta.json();
                alert(`Erro: ${erro.message || 'Verifique os dados.'}`)
            }
        } catch (e) {
            alert('Erro de rede ao conectar com a API.');
            console.error('Erro de rede ao conectar com a API: ', e);
        }
    };

    // Função para exclusão lógica do aluno
    const handleExcluir = async (id) => {
        if (confirm('Deseja realmente inativar este aluno?') == false) return;

        try {
            const resposta = await alunoService.excluir(id);

            if (resposta.status === 204) {
                alert('Aluno excluído com sucesso!');
                carregarAlunos(); // Atualiza a tabela para não exibir o aluno
            } else {
                alert('Erro ao excluir o aluno.');
            }
        } catch (e) {
            alert('Erro de rede ao conectar com a API.');
            console.error('Erro: ', e);
        }
    };


    // Função para formatar a data na exibição
    const formatarData = (dataIso) => {
        if (!dataIso) return '-';

        // Pega a parte da data antes do 'T'
        const [data] = dataIso.split('T');

        // Separa ano, mês e dia
        const [ano, mes, dia] = data.split('-');

        // Retorna data formatada
        return `${dia}/${mes}/${ano}`;
    };
    
    return (
        <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold mb-4 text-gray-800'>Gerenciamento de Alunos</h2>
            </div>

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
                <button
                    onClick={handleSalvar}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded transition shadow cursor-pointer">
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
                                               onClick={() => handlePrepararEdicao(aluno)}
                                               title='Editar Aluno'
                                               className="text-blue-600 hover:text-blue-800 transition transform hover:scale-110 cursor-pointer">
                                               <i className="fa-solid fa-pen text-sm"></i>
                                           </button>
                                           <button
                                               onClick={() => handleExcluir(aluno.id)}
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

            {/* Modal de Cadastro/Edição de Aluno */}
            {modalAberto && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
    
                        {/* Título do modal */}
                        <h3 className="text-lg font-bold mb-4 text-gray-800">
                            {idEdicao ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
                        </h3>
                    
                        <form onSubmit={handleSalvar} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Nome Completo
                                </label>
                                <input 
                                    type="text" required
                                    value={cadastro.nome}
                                    onChange={(e) => setCadastro({ ...cadastro, nome: e.target.value })}
                                    className="border rounded w-full py-2 px-3 focus:outline-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    E-mail
                                </label>
                                <input 
                                    type="email" required
                                    value={cadastro.email}
                                    onChange={(e) => setCadastro({ ...cadastro, email: e.target.value })}
                                    className="border rounded w-full py-2 px-3 focus:outline-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Data de Nascimento
                                </label>
                                <input 
                                    type="date" required
                                    value={cadastro.dataNascimento}
                                    onChange={(e) => setCadastro({ ...cadastro, dataNascimento: e.target.value })}
                                    className="border rounded w-full py-2 px-3 focus:outline-blue-500" />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button 
                                    type="button" 
                                    onClick={onClose}
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
