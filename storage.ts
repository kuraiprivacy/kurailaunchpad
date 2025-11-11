import { randomUUID } from "crypto";
import type { 
  Commitment, 
  SealedOrder, 
  AuditEvent, 
  Escrow 
} from "@shared/schema";

export interface IStorage {
  getCommitments(): Promise<Commitment[]>;
  addCommitment(commitment: Omit<Commitment, "id">): Promise<Commitment>;
  
  getSealedOrders(): Promise<SealedOrder[]>;
  addSealedOrder(order: Omit<SealedOrder, "id">): Promise<SealedOrder>;
  
  getAuditEvents(): Promise<AuditEvent[]>;
  addAuditEvent(event: Omit<AuditEvent, "id">): Promise<AuditEvent>;
  
  getEscrow(id: string): Promise<Escrow | undefined>;
}

export class MemStorage implements IStorage {
  private commitments: Map<string, Commitment> = new Map();
  private sealedOrders: Map<string, SealedOrder> = new Map();
  private auditEvents: Map<string, AuditEvent> = new Map();
  private escrows: Map<string, Escrow> = new Map();

  async getCommitments(): Promise<Commitment[]> {
    return Array.from(this.commitments.values());
  }

  async addCommitment(commitment: Omit<Commitment, "id">): Promise<Commitment> {
    const id = randomUUID();
    const newCommitment: Commitment = { ...commitment, id };
    this.commitments.set(id, newCommitment);
    return newCommitment;
  }

  async getSealedOrders(): Promise<SealedOrder[]> {
    return Array.from(this.sealedOrders.values());
  }

  async addSealedOrder(order: Omit<SealedOrder, "id">): Promise<SealedOrder> {
    const id = randomUUID();
    const newOrder: SealedOrder = { ...order, id };
    this.sealedOrders.set(id, newOrder);
    return newOrder;
  }

  async getAuditEvents(): Promise<AuditEvent[]> {
    return Array.from(this.auditEvents.values());
  }

  async addAuditEvent(event: Omit<AuditEvent, "id">): Promise<AuditEvent> {
    const id = randomUUID();
    const newEvent: AuditEvent = { ...event, id };
    this.auditEvents.set(id, newEvent);
    return newEvent;
  }

  async getEscrow(id: string): Promise<Escrow | undefined> {
    return this.escrows.get(id);
  }
}

export const storage = new MemStorage();
