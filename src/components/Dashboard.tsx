
import { FaUserFriends } from 'react-icons/fa'
import MainLayout from './MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import ChartOverview from './ChartOverview'
import Sales from './Adm/Sales/Sales'

function Dashboard() {
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
                    <p className='text-base sm:text-lg font-bold'> 40</p>
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
                    <p className='text-base sm:text-lg font-bold'> 40</p>
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
                    <p className='text-base sm:text-lg font-bold'> 40</p>
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
                    <p className='text-base sm:text-lg font-bold'> 40</p>
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