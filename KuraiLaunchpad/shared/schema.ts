import { z } from "zod";

export const launchModes = ["batch", "lbp", "dutch", "bonding"] as const;
export type LaunchMode = typeof launchModes[number];

export const launchSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Symbol is required").max(10),
  totalSupply: z.string().min(1, "Total supply is required"),
  launchMode: z.enum(launchModes),
  useCommitReveal: z.boolean().default(false),
  devAllocation: z.string().min(0).default("0"),
  vestingDays: z.string().min(0).default("0"),
  escrowMultisig: z.string().optional(),
});

export type Launch = z.infer<typeof launchSchema>;

export const commitmentSchema = z.object({
  id: z.string(),
  commitHash: z.string(),
  timestamp: z.number(),
  revealed: z.boolean().default(false),
  launchParams: z.any().optional(),
});

export type Commitment = z.infer<typeof commitmentSchema>;

export const sealedOrderSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  amount: z.string(),
  maxPrice: z.string(),
  timestamp: z.number(),
  settled: z.boolean().default(false),
});

export type SealedOrder = z.infer<typeof sealedOrderSchema>;

export const auditEventSchema = z.object({
  id: z.string(),
  type: z.enum(["commit", "reveal", "batch_settlement", "escrow_release"]),
  description: z.string(),
  timestamp: z.number(),
  txHash: z.string().optional(),
});

export type AuditEvent = z.infer<typeof auditEventSchema>;

export const escrowSchema = z.object({
  id: z.string(),
  balance: z.string(),
  vestingStart: z.number(),
  vestingEnd: z.number(),
  released: z.string().default("0"),
  multisigSigners: z.array(z.string()),
});

export type Escrow = z.infer<typeof escrowSchema>;
