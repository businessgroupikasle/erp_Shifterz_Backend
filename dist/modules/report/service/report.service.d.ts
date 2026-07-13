import { ReportRepository } from '../repository/report.repository.js';
export declare class ReportService {
    private readonly repository;
    constructor(repository?: ReportRepository);
    getReports(): Promise<{
        billingData: {
            status: string;
            amount: number;
            count: number;
        }[];
        serviceRevenue: {
            service: string;
            amount: number;
            percentage: number;
        }[];
        leadSources: {
            source: string;
            count: number;
            percentage: number;
        }[];
        jobSummary: {
            status: string;
            count: number;
            color: string;
        }[];
        inventoryValue: {
            category: string;
            value: number;
            items: number;
        }[];
        totalInvoiced: number;
        totalCollected: number;
        leadConversion: number;
        franchiseRevenue: number;
    }>;
}
//# sourceMappingURL=report.service.d.ts.map