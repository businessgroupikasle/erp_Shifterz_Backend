import type { UpdateSettingDTO } from '../validation/settings.validation.js';
export declare class SettingsRepository {
    getSettings(): Promise<{
        id: string;
        phone: string;
        email: string;
        isDeleted: boolean;
        deletedAt: string | null;
        address: string;
        companyName: string;
        gstin: string;
        gstPct: number;
        currency: string;
        agents: string[];
        categories: string[];
        securityGuards: string[];
    } | null>;
    initDefaultSettings(): Promise<{
        id: string;
        phone: string;
        email: string;
        isDeleted: boolean;
        deletedAt: string | null;
        address: string;
        companyName: string;
        gstin: string;
        gstPct: number;
        currency: string;
        agents: string[];
        categories: string[];
        securityGuards: string[];
    }>;
    updateSettings(data: UpdateSettingDTO): Promise<{
        id: string;
        phone: string;
        email: string;
        isDeleted: boolean;
        deletedAt: string | null;
        address: string;
        companyName: string;
        gstin: string;
        gstPct: number;
        currency: string;
        agents: string[];
        categories: string[];
        securityGuards: string[];
    }>;
}
//# sourceMappingURL=settings.repository.d.ts.map