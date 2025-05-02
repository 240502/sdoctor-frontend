import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SocketProvider } from './components';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 phút
            gcTime: 1000 * 60 * 10, // 10 phút (tương đương cacheTime trước đây)
        },
    },
});
ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <RecoilRoot>
            <SocketProvider>
                <App />
            </SocketProvider>
            <ReactQueryDevtools initialIsOpen={false} />{' '}
            {/* Devtools để debug */}
        </RecoilRoot>
    </QueryClientProvider>
);
