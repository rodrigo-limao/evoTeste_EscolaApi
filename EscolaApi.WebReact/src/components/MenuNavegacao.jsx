export default function MenuNavegacao({ abaAtiva, setAbaAtiva }) {
    return (
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
    );
}
