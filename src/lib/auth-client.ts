import ky from 'ky';
import { getPublicEnvironment } from './utils';

interface InditexOAuthTokenResponse {
    access_token: string;
    id_token: string;
    scope: string;
    expires_in: number;
}

export class AuthClient {
    private static instance: AuthClient;
    private tokenCache: {
        idToken: string | null;
        accessToken: string | null;
        expiryTime: number | null;
    };

    private constructor() {
        this.tokenCache = {
            idToken: null,
            accessToken: null,
            expiryTime: null,
        };

        // Inicializar desde localStorage si estamos en el cliente
        if (typeof window !== 'undefined') {
            const storedIdToken = localStorage.getItem('inditexIdToken');
            const storedAccessToken = localStorage.getItem('inditexAccessToken');
            const tokenExpiry = localStorage.getItem('inditexTokenExpiry');

            if (storedIdToken && storedAccessToken && tokenExpiry) {
                this.tokenCache = {
                    idToken: storedIdToken,
                    accessToken: storedAccessToken,
                    expiryTime: parseInt(tokenExpiry),
                };
            }
        }
    }

    public static getInstance(): AuthClient {
        if (!AuthClient.instance) {
            AuthClient.instance = new AuthClient();
        }
        return AuthClient.instance;
    }

    /**
     * Verifica si hay un token en caché y si es válido
     */
    private isTokenValid(): boolean {
        // Margen de seguridad de 5 minutos
        const safetyMargin = 5 * 60 * 1000;
        return !!(
            this.tokenCache.idToken &&
            this.tokenCache.expiryTime &&
            this.tokenCache.expiryTime > Date.now() + safetyMargin
        );
    }

    /**
     * Obtiene un token Bearer para la API de Inditex
     * Devuelve el id_token que se usa como token de autorización
     */
    public async getBearerToken(): Promise<string> {
        // Usar token en caché si es válido
        if (this.isTokenValid()) {
            return this.tokenCache.idToken!;
        }

        // Si no hay token válido, obtener uno nuevo
        const { inditexOAuthUrl, inditexOAuthClientId, inditexOAuthClientSecret } = getPublicEnvironment();

        try {
            // Preparar los datos del formulario según el ejemplo curl
            const formData = new URLSearchParams();
            formData.append('grant_type', 'client_credentials');
            formData.append('scope', 'technology.catalog.read');

            // Crear credenciales Basic Auth a partir del client_id y client_secret
            const credentials = btoa(`${inditexOAuthClientId}:${inditexOAuthClientSecret}`);

            // Realizar la solicitud según el ejemplo curl
            const response = await ky.post(inditexOAuthUrl, {
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'OpenPlatform/1.0',
                    'Authorization': `Basic ${credentials}`,
                },
                retry: {
                    limit: 3,
                    methods: ['POST'],
                    statusCodes: [408, 429, 500, 502, 503, 504],
                }
            });

            const data: InditexOAuthTokenResponse = await response.json();


            // Actualizar la caché de tokens
            this.tokenCache = {
                idToken: data.id_token,
                accessToken: data.access_token,
                expiryTime: Date.now() + (data.expires_in * 1000),
            };

            // Almacenar tokens en localStorage si estamos en el lado del cliente
            if (typeof window !== 'undefined') {
                localStorage.setItem('inditexIdToken', data.id_token);
                localStorage.setItem('inditexAccessToken', data.access_token);
                localStorage.setItem('inditexTokenExpiry', this.tokenCache.expiryTime!.toString());
                localStorage.setItem('inditexTokenScope', data.scope);
            }

            return data.id_token;
        } catch (error) {
            console.error('Error al obtener token OAuth de Inditex:', error);
            throw error;
        }
    }

    /**
     * Invalida el token actual, forzando la obtención de uno nuevo en la próxima solicitud
     */
    public invalidateToken(): void {
        this.tokenCache = {
            idToken: null,
            accessToken: null,
            expiryTime: null,
        };

        if (typeof window !== 'undefined') {
            localStorage.removeItem('inditexIdToken');
            localStorage.removeItem('inditexAccessToken');
            localStorage.removeItem('inditexTokenExpiry');
            localStorage.removeItem('inditexTokenScope');
        }
    }
}

// Exportar una instancia para usar directamente
export const authClient = AuthClient.getInstance();