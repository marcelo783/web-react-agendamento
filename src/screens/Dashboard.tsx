
import { FaUserFriends } from 'react-icons/fa'
import MainLayout from '../components/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import ChartOverview from '../components/ChartOverview'
import Sales from '../components/Adm/Sales/Sales'
import { useEffect, useState } from 'react'

function Dashboard() {

// Estados para armazenar os valores do contador geral
const [contadorGeral, setContadorGeral] = useState({
    concluido: 0,
    cancelado: 0,
    ausente: 0,
    expirado: 0,
  });

  // Função para buscar os dados do contador geral do back-end
  const fetchContadorGeral = async () => {
    try {
      const response = await fetch('http://localhost:5000/agendamentos/contador-geral');
      const data = await response.json();
      setContadorGeral(data); // Atualiza o estado com os valores retornados do back-end
    } catch (error) {
      console.error('Erro ao buscar contador geral:', error);
    }
  };

  // useEffect para buscar os dados quando o componente for montado
  useEffect(() => {
    fetchContadorGeral();
  }, []);

  return (
   <MainLayout >
    <section className='grid grid-cols-2 lg:grid-cols-4 pt-9 gap-4'>

        
        <Card>
            <CardHeader>
                <div className='flex items-center justify-center'>
                    <CardTitle className='text-lg sm:text-xl text-gray-800 select-none'>
                    Concluídos
                    </CardTitle>
                    <FaUserFriends className='ml-auto w-5 h-5'/>
                </div>

                <CardContent>
                    <p className='text-base sm:text-lg font-bold'> {contadorGeral.concluido}</p>
                   
                </CardContent>

                <CardDescription>
                    Total de pc em 90 dias
                </CardDescription>
               
            </CardHeader>

        </Card>


        <Card>
            <CardHeader>
                <div className='flex items-center justify-center'>
                    <CardTitle className='text-lg sm:text-xl text-gray-800 select-none'>
                    Cancelados
                    </CardTitle>
                    <FaUserFriends className='ml-auto w-5 h-5'/>
                </div>

                <CardContent>
                    <p className='text-base sm:text-lg font-bold'> {contadorGeral.cancelado}</p>
                </CardContent>

                <CardDescription>
                    Total de pc em 90 dias
                </CardDescription>
               
            </CardHeader>

        </Card>

        <Card>
            <CardHeader>
                <div className='flex items-center justify-center'>
                    <CardTitle className='text-lg sm:text-xl text-gray-800 select-none'>
                    Ausentes
                    </CardTitle>
                    <FaUserFriends className='ml-auto w-5 h-5'/>
                </div>

                <CardContent>
                    <p className='text-base sm:text-lg font-bold'> {contadorGeral.ausente}</p>
                </CardContent>

                <CardDescription>
                    Total de pc em 90 dias
                </CardDescription>
               
            </CardHeader>

        </Card>

        <Card>
            <CardHeader>
                <div className='flex items-center justify-center'>
                    <CardTitle className='text-lg sm:text-xl text-gray-800 select-none'>
                    Expirados
                    </CardTitle>
                    <FaUserFriends className='ml-auto w-5 h-5'/>
                </div>

                <CardContent>
                    <p className='text-base sm:text-lg font-bold'> {contadorGeral.expirado}</p>
                </CardContent>

                <CardDescription>
                    Total de pc em 90 dias
                </CardDescription>
               
            </CardHeader>

        </Card>

    </section>


    <section className='mt-4 flex flex-col md:flex-row gap-4'>
        <ChartOverview/>
        <Sales/>
    </section>

   </MainLayout>
  )
}

export default Dashboard