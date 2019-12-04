declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_SOCKET_ENDPOINT: string;
        REACT_APP_MOCK_SOCKET_ENDPOINT: string;
        REACT_APP_USE_MOCK_SOCKET: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
    }
}