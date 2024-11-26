import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RecoilRoot } from 'recoil';
ReactDOM.createRoot(document.getElementById('root')!).render(
    <RecoilRoot>
        <App />
    </RecoilRoot>
);
