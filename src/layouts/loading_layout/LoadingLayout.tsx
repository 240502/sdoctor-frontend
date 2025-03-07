import { ReactElement } from 'react';
import LoadingComp from '../../components/LoadingComp';
type Props = {
    loading?: boolean;
    children?: ReactElement;
};

const LoadingLayout = ({ loading, children }: Props) => {
    return loading ? <LoadingComp></LoadingComp> : children;
};

export default LoadingLayout;
