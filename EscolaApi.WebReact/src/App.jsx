import { useState } from 'react';
import MenuNavegacao from './components/MenuNavegacao';
import AbaAlunos from './components/AbaAlunos';
import AbaMatriculas from './components/AbaMatriculas';
import AbaRelatorios from './components/AbaRelatorios';

export default function App() {
    // O "useState" cria uma variável de estado (abaAtiva)
    // e uma função para alterá-la (setAbaAtiva)
    // Inicinando o app exibindo a tela de 'alunos'
    const [abaAtiva, setAbaAtiva] = useState('alunos');

    return (
        <div className='min-h-screen bg-gray-50 text-gray-900'>
            <MenuNavegacao abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

            <main className="container mx-auto px-6 py-8">
                {abaAtiva === 'alunos' && <AbaAlunos />}
                {abaAtiva === 'matriculas' && <AbaMatriculas />}
                {abaAtiva === 'relatorios' && <AbaRelatorios />}
            </main>
        </div>
    );
}
