import { Services } from '../models/services';

export const addWatchedService = (service: Services) => {
    let services = JSON.parse(localStorage.getItem('watchedServices') || '[]');
    if (services.length > 0) {
        const existDoctor = services.find(
            (item: any) => item.id === service.id
        );
        if (!existDoctor) {
            services.push(service);
        }
    } else {
        services = [service];
    }
    localStorage.setItem('watchedServices', JSON.stringify(services));
};
