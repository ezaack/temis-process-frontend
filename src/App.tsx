import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import MyPlace from './pages/Dashboard/MyPlace';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import { ClientForm } from './features/client/component/ClientForm';
import { Clients } from './features/client/component/Clients';
import { ClientDetail } from './features/client/component/ClientDetail';
import { OfficeForm } from './features/office/component/OfficeForm';
import { OfficeDetail } from './features/office/component/OfficeDetail';
import { Login } from './features/auth/component/Login';
import PrivateRoute from './components/PrivateRoute';
import { UserProvider } from './context/UserContext';
import EmployeeForm from './pages/employee/EmployeeFrom';
import { Employees } from './pages/employee/Employees';
import { Casos } from './features/caso/component/Casos';
import { CasoForm } from './features/caso/component/CasoForm';
import { CasoView } from './features/caso/component/CasoView';
import { TarefaView } from './features/caso/component/TarefaView';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    
  <UserProvider>
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <PrivateRoute>
              <>
              <PageTitle title="Principal | Aqui você pode ver suas atividades mais importantes e alertas" />
              <MyPlace />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Clients" />
                <Clients />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/client-form"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Client Form" />
                <ClientForm />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/client-form/:id"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Client Form" />
                <ClientForm />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Calendar |  - Tailwind CSS Admin Dashboard Template" />
                <Calendar />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Profile |  - Tailwind CSS Admin Dashboard Template" />
                <Profile />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Settings |  - Tailwind CSS Admin Dashboard Template" />
                <Settings />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/chart"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Basic Chart |  - Tailwind CSS Admin Dashboard Template" />
                <Chart />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Alerts |  - Tailwind CSS Admin Dashboard Template" />
                <Alerts />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Buttons |  - Tailwind CSS Admin Dashboard Template" />
                <Buttons />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin |  - Tailwind CSS Admin Dashboard Template" />
              <Login />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup |  - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <PrivateRoute>
              <ClientDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/casos"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Casos" />
                <Casos />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/caso-form"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Novo Caso" />
                <CasoForm />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/caso-form/:id"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Editar Caso" />
                <CasoForm />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/casos/:id"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Detalhes do Caso" />
                <CasoView />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/casos/:casoId/tarefas/:tarefaId"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Detalhes da Tarefa" />
                <TarefaView />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/office-form"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Novo Unidade" />
                <OfficeForm />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/office-form/:id"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Editar Unidade" />
                <OfficeForm />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/offices"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Detalhes do Unidade" />
                <OfficeDetail />
              </>
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/offices/:id"
          element={
            <PrivateRoute>
              <OfficeDetail />
            </PrivateRoute>
          }
        />
                <Route
          path="/employee-form"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Cadastro de Colaborador" />
                <EmployeeForm />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Colaboradores" />
                <Employees />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <PrivateRoute>
              <>
                <PageTitle title="Detalhes do Colaborador" />
                <Employees />
              </>
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </DefaultLayout>
    </UserProvider>
  );
}

export default App;
