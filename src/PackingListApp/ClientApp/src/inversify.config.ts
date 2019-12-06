import 'reflect-metadata';
import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import HttpService from './services/http-service';

// Initialize DI/IoC container
const container = new Container();
let { lazyInject } = getDecorators(container);

function initialize(app: any) {
    if (!app) {
        app = {
            config: {}
        }
    }
    if (!container.isBound(HttpService)) {
        // Initialize services if container is not configured before
        container.bind(HttpService).toSelf().inSingletonScope().onActivation((context: any, instance: any) => {
            instance.setup(app.config.serviceUrl || app.config.ServiceUrl || `${window.location.protocol}//${window.location.host}`);
            return instance;
        });
    }
}

export { lazyInject as resolve, container, initialize };