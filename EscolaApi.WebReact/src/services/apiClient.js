const BASE_URL = 'http://localhost:8080/api';

export const apiClient = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    // Mescla as opções enviadas com os headers JSON
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const resposta = await fetch(url, config);
    return resposta;
};
