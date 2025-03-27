import React from 'react';
import { AppThemeProvider } from './contexts/AppThemeContext/AppThemeContext';
import { Route, Routes } from 'react-router';
import { Navbar } from "@src/components/NavBar";
import { TaskView } from './pages/TaskViewPage/TaskViewPage';
import { AppAuthContextProvider } from './contexts/AppAuthContext/AppAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage/HomePage';
import { TasksPage } from './pages/TasksPage';
import { AppLocation } from './hooks';

const queryClient = new QueryClient();

function App(): React.ReactNode {

  return (
    <>
      <AppThemeProvider>
        <AppAuthContextProvider>
          <Navbar />
          <div className='h-screen flex flex-col'>
            <QueryClientProvider client={queryClient}>

              <div className="grow">
                <Routes>
                  <Route path={AppLocation.HomePage} element={<HomePage />} />
                  <Route path={AppLocation.TaskViewPage} element={<TaskView />} />
                  <Route path={AppLocation.TasksPage} element={<TasksPage />} />
                </Routes>
              </div>

            </QueryClientProvider>


          </div >
        </AppAuthContextProvider>
      </AppThemeProvider>
    </>
  )
}

export default App
