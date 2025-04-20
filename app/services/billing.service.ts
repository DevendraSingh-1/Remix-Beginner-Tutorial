// app/services/billing.service.ts
export interface Billing {
    billingId: string;
    userId: string;
    bankAccountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    upiId?: string;
    isDefault: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  let billings: Billing[] = [];
  
  export const billingService = {
    async createBilling(billingData: {
      userId: string;
      bankAccountNumber?: string;
      ifscCode?: string;
      bankName?: string;
      upiId?: string;
    }) {
      const newBilling: Billing = {
        billingId: crypto.randomUUID(),
        ...billingData,
        isDefault: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      // Set as default if first billing method
      if (!billings.some(b => b.userId === billingData.userId)) {
        newBilling.isDefault = true;
      }
  
      billings.push(newBilling);
      return newBilling;
    },
  
    async verifyBilling(billingId: string) {
      const billing = billings.find(b => b.billingId === billingId);
      if (!billing) throw new Error("Billing not found");
      
      billing.isVerified = true;
      billing.updatedAt = new Date();
      return billing;
    },
  };
  