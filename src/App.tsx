import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { silentRefresh } from './features/auth/store/authSlice';
import { SocketProvider } from './context/SocketProvider';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(silentRefresh());
  }, [dispatch]);

  return (
    <SocketProvider>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </SocketProvider>
  );
};

export default App;