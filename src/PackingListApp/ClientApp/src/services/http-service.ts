import * as Axios from 'axios';
import { inject, injectable } from 'inversify';
import { stringify } from 'query-string';
import { addTask } from 'domain-task';
import * as ContentDisposition from 'content-disposition';
import * as FileSaver from 'file-saver';
import { isNullOrWhiteSpaces } from '../utils/extensions';

@injectable()
export default class HttpService {
    protected static timeout = 60000;
    private http!: Axios.AxiosInstance;

    static accessToken: string;

    public online(): Promise<Axios.AxiosResponse> {
        return this.get('api/v1/online');
    }

    public async get<TResponse>(url: string, data?: any): Promise<Axios.AxiosResponse<TResponse>> {
        try {
            const params = { rnd: this.makernd() } as any;
            if (data) {
                for (const prop of Object.getOwnPropertyNames(data)) {
                    const type = typeof data[prop];
                    if (type !== 'function' && type !== 'object') {
                        params[prop] = data[prop];
                    }
                }
            }
            url += (url.search(/\?/) !== -1 ? '&' : '?') + stringify(params);
            const config = await this.getConfig(data);
            const response = this.http.get(url, config);
            addTask(response);
            return await response;
        } catch (reason) {
            // alert("Network error\n" + reason);
            return Promise.reject(this.handleError(reason));
        }
    }

    public async post<TRequest, TResponse>(url: string, data: TRequest, timeout?: number): Promise<Axios.AxiosResponse<TResponse>> {
        try {
            let config = await this.getConfig();
            if (timeout != null && timeout > HttpService.timeout) {
               config = {...config, timeout};
            }
            const response = this.http.post(url, data, config);
            addTask(response);
            return await response;
        } catch (reason) {
            return Promise.reject(this.handleError(reason));
        }
    }

    public async patch<TRequest, TResponse>(url: string, data: TRequest): Promise<Axios.AxiosResponse<TResponse>> {
        try {
            const config = await this.getConfig();
            const response = this.http.patch(url, data, config);
            addTask(response);
            return await response;
        } catch (reason) {
            return Promise.reject(this.handleError(reason));
        }
    }

    public async put<TRequest, TResponse>(url: string, data: TRequest): Promise<Axios.AxiosResponse<TResponse>> {
        try {
            const config = await this.getConfig();
            const response = this.http.put(url, data, config);
            addTask(response);
            return await response;
        } catch (reason) {
            return Promise.reject(this.handleError(reason));
        }
    }

    public async delete<TRequest, TResponse>(url: string, data?: TRequest): Promise<Axios.AxiosResponse<TResponse>> {
        try {
            const config = await this.getConfig();
            const response = this.http.delete(url, data ? { ...config, data } : { ...config });
            addTask(response);
            return await response;
        } catch (reason) {
            return Promise.reject(this.handleError(reason));
        }
    }

    public async download(url: string): Promise<Axios.AxiosResponse> {
        try {
            const config = await this.getConfig();
            const response = this.http.get(url, { ...config, responseType: 'blob' });
            addTask(response);
            const blobResponse =  await response;
            if (blobResponse == null || blobResponse.data == null) {
                return Promise.reject({ message: 'Error downloading the file' });
            }
            if (blobResponse.data.size === 0 || blobResponse.status === 204) {
                return Promise.reject({ message: 'There is no data' });
            }

            let fileName = '';

            if (blobResponse.headers['content-disposition']) {
                const contentDisposition = ContentDisposition.parse(blobResponse.headers['content-disposition']);
                if (contentDisposition && contentDisposition.parameters && contentDisposition.parameters.filename) {
                    fileName = contentDisposition.parameters.filename;
                }
            }

            if (isNullOrWhiteSpaces(fileName) && blobResponse.headers['x-filename']) {
                fileName = decodeURIComponent(blobResponse.headers['x-filename']);
            }

            if (isNullOrWhiteSpaces(fileName)) {
                return Promise.reject({ message: 'No filename' });
            }

            FileSaver.saveAs(blobResponse.data, fileName);

            return blobResponse;
        } catch (reason) {
            // alert("Network error\n" + reason);
            return Promise.reject(this.handleError(reason));
        }
    }

    public setup(serviceUrl: string): Axios.AxiosInstance {
        if (this.http) {
            return this.http;
        }
        this.http = Axios.default.create({
            baseURL: serviceUrl,
            timeout: HttpService.timeout,
        });
        return this.http;
    }

    protected handleError(error: Axios.AxiosError) {
        let msg;
        if (error.response && error.response.status) {
            switch (error.response.status) {
                default:
                    msg = error.response.data.error ? error.response.data.error : error;
                    break;
            }
        } else {
            msg = error;
        }

        // alert(msg);
        return msg;
    }

    private async getConfig(data?: {}) {
        if (!HttpService.accessToken) {
            return data || { };
        }
        const config = {
            headers: {
                Authorization: `Bearer ${HttpService.accessToken}`,
            },
        };
        return data
            ? {
                ...data,
                ...config,
            }
            : config;
    }

    private makernd() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 16; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }
}

export function formatMessage(result: any): string {
    let message: string = "Unknown error";
    if (result && result.message) {
        return result.message;
    }
    if (result && result.response && result.response.data) {
        if (result.response.data.messages) {
            message = result.response.data.messages[0].body || result.response.data.messages[0].error;
        }
        if (result.response.data.error) {
            message = `${result.response.status} ${result.response.data.error}`;
        }
        message = `${result.response.status} ${result.response.message}`;
    }
    return message;
}