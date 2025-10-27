import forge from "node-forge";
import { FetchError } from "ofetch";

// Types based on OpenAPI specification
export interface MyCertType {
    cert_id: string;
    serial_number: string;
    cert_pem: string;
    issued: string;
    expires: string;
    revoked: boolean;
    revoked_date: string;
}

export interface PkiValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface HTTPValidationError {
    detail: PkiValidationError[];
}

export interface CertificateSigningOptions {
    csr: string; // PEM formatted Certificate Signing Request
    organisationId: string;
    clientName: string;
    id: string; // generic id for node or service
}

export interface SignedCertificateResult {
    certificate: string; // PEM format
}

export interface CertificateInfo {
    organisationId: string;
    clientName: string;
    id: string; // generic id for node or service
}

const config = useRuntimeConfig();

class PKI {
    private pkiConfig: {
        url: string;
        user: string;
        password: string;
    } = {
        url: "",
        user: "",
        password: "",
    };

    async init() {
        this.pkiConfig = {
            url: config.PKI.URL,
            user: config.PKI.USER,
            password: config.PKI.PASSWORD,
        };

        if (
            !this.pkiConfig.url ||
            !this.pkiConfig.user ||
            !this.pkiConfig.password
        ) {
            console.error(
                "PKI configuration is incomplete. Please check NUXT_PKI_* environment variables."
            );
            throw new ApplicationError(
                "PKI service configuration is missing",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

        console.info("🔐 PKI service initialized");
    }

    /**
     * Generate a unique certificate ID based on organization and node information
     */
    private generateCertId(options: CertificateSigningOptions): string {
        return `${options.organisationId}-${options.id}`;
    }

    /**
     * Generate certificate ID from certificate info
     */
    private generateCertIdFromInfo(info: CertificateInfo): string {
        return `${info.organisationId}-${info.id}`;
    }

    public async signCertificateRequest(
        options: CertificateSigningOptions
    ): Promise<SignedCertificateResult> {
        // Use the id directly as certificate ID since it now matches x500UniqueIdentifier
        const certId = options.id;

        const cert = await pkiApiWrapper(async () => {
            const endpoint = config.PKI.URL;
            const auth = Buffer.from(
                `${this.pkiConfig.user}:${this.pkiConfig.password}`
            ).toString("base64");

            return await $fetch<MyCertType>(
                `${endpoint}/pki/certificates/${certId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Basic ${auth}`,
                        "Content-Type": "application/x-pem-file",
                    },
                    body: options.csr,
                }
            );
        });

        return {
            certificate: cert.cert_pem,
        };
    }

    public async verifyCertificate(certificatePem: string): Promise<boolean> {
        try {
            // Extract certificate info to get the cert_id for verification
            const certInfo = this.extractCertificateInfo(certificatePem);
            if (!certInfo) {
                return false;
            }

            const certId = this.generateCertIdFromInfo(certInfo);

            // Get certificate from PKI service
            const cert = await pkiApiWrapper(async () => {
                const endpoint = config.PKI.URL;
                const auth = Buffer.from(
                    `${this.pkiConfig.user}:${this.pkiConfig.password}`
                ).toString("base64");

                return await $fetch<MyCertType>(
                    `${endpoint}/pki/certificates/${certId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Basic ${auth}`,
                        },
                    }
                );
            });

            // Check if certificate is not revoked and is still valid
            if (cert.revoked) {
                return false;
            }

            // Check if certificate has expired
            const now = new Date();
            const expires = new Date(cert.expires);
            if (now > expires) {
                return false;
            }

            // Verify the certificate PEM matches what we have
            return cert.cert_pem.trim() === certificatePem.trim();
        } catch (error) {
            console.error("Certificate verification failed:", error);
            return false;
        }
    }

    public extractCertificateInfo(
        certificatePem: string
    ): CertificateInfo | null {
        try {
            const cert = forge.pki.certificateFromPem(certificatePem);

            let organisationId = "";
            let clientName = "";
            let id = "";

            // Extract information from subject
            cert.subject.attributes.forEach((attr) => {
                switch (attr.name || attr.shortName || attr.type) {
                    case "commonName":
                        clientName =
                            typeof attr.value === "string" ? attr.value : "";
                        break;
                    case "organizationName":
                        // Use organization name directly as organisation ID
                        organisationId =
                            typeof attr.value === "string" ? attr.value : "";
                        break;
                    case "2.5.4.45": // x500UniqueIdentifier OID
                        id = typeof attr.value === "string" ? attr.value : "";
                        break;
                }
            });

            return { organisationId, clientName, id };
        } catch (error) {
            console.error("Failed to extract certificate info:", error);
            return null;
        }
    }

    /**
     * Get all certificates from PKI service
     */
    public async getAllCertificates(): Promise<MyCertType[]> {
        return await pkiApiWrapper(async () => {
            const endpoint = config.PKI.URL;
            const auth = Buffer.from(
                `${this.pkiConfig.user}:${this.pkiConfig.password}`
            ).toString("base64");

            return await $fetch<MyCertType[]>(`${endpoint}/pki/certificates`, {
                method: "GET",
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            });
        });
    }

    /**
     * Revoke a certificate
     */
    public async revokeCertificate(certId: string): Promise<MyCertType> {
        return await pkiApiWrapper(async () => {
            const endpoint = config.PKI.URL;
            const auth = Buffer.from(
                `${this.pkiConfig.user}:${this.pkiConfig.password}`
            ).toString("base64");

            return await $fetch<MyCertType>(
                `${endpoint}/pki/certificates/${certId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Basic ${auth}`,
                    },
                }
            );
        });
    }

    /**
     * Renew a certificate
     */
    public async renewCertificate(certId: string): Promise<MyCertType> {
        return await pkiApiWrapper(async () => {
            const endpoint = config.PKI.URL;
            const auth = Buffer.from(
                `${this.pkiConfig.user}:${this.pkiConfig.password}`
            ).toString("base64");

            return await $fetch<MyCertType>(
                `${endpoint}/pki/certificates/renew/${certId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Basic ${auth}`,
                    },
                }
            );
        });
    }

    /**
     * Get certificate revocation list
     */
    public async getRevocationList(): Promise<string> {
        return await pkiApiWrapper(async () => {
            const endpoint = config.PKI.URL;
            const auth = Buffer.from(
                `${this.pkiConfig.user}:${this.pkiConfig.password}`
            ).toString("base64");

            return await $fetch<string>(
                `${endpoint}/pki/certificates/revocation-list`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Basic ${auth}`,
                    },
                }
            );
        });
    }
}

// Wrapper function to handle PKI API requests and errors
async function pkiApiWrapper<T>(pkiRequest: () => Promise<T>) {
    try {
        return await pkiRequest();
    } catch (error) {
        if (error instanceof FetchError) {
            console.error("Original PKI error", error);

            // Try to parse validation errors from the response
            let errorMessage = error.message;
            if (
                error.response?._data?.detail &&
                Array.isArray(error.response._data.detail)
            ) {
                const validationErrors = error.response._data
                    .detail as PkiValidationError[];
                errorMessage = validationErrors
                    .map((err) => `${err.loc.join(".")}: ${err.msg}`)
                    .join(", ");
            } else if (error.response?._data) {
                errorMessage = JSON.stringify(error.response._data);
            }

            throw new PKIError(
                errorMessage,
                error.response?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
                error.response?._data
            );
        }
        throw error;
    }
}

export const pki = new PKI();
