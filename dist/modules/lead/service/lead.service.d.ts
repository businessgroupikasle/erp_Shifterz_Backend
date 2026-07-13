export declare class LeadService {
    private repository;
    constructor();
    getLeads(tenantFilter: any): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        service: string;
        vehicle: string;
        date: string;
        notes: string;
        source: string;
        assignedTo: string;
        budget: string;
    }[]>;
    createLead(data: any, franchiseId: string | null): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        service: string;
        vehicle: string;
        date: string;
        notes: string;
        source: string;
        assignedTo: string;
        budget: string;
    }>;
    updateLead(id: string, data: any): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        service: string;
        vehicle: string;
        date: string;
        notes: string;
        source: string;
        assignedTo: string;
        budget: string;
    }>;
    deleteLead(id: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        status: string;
        franchiseId: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        service: string;
        vehicle: string;
        date: string;
        notes: string;
        source: string;
        assignedTo: string;
        budget: string;
    }>;
    private handleConvertedLeadCustomer;
}
//# sourceMappingURL=lead.service.d.ts.map