
export interface GlobalConstants {
  bulkDensitySand: number; // gamma_s (g/cc)
  weightSandInCone: number; // W_c (g)
  specificGravityParticles: number; // G_s
  maxDryDensity: number; // MDD (g/cc)
  compactionThreshold: number; // (%) Usually 95 or 98
}

export interface TestPoint {
  id: string;
  testNo: string;
  w1: number; // Initial sand + cylinder
  w2: number; // Final sand + cylinder
  w3: number; // Total wet soil excavated
  w4: number; // Wet stone / oversize weight
  moistureContent: number; // (%)
}

export interface CalculationResult {
  weightSandInHole: number;
  vTotal: number;
  vStone: number;
  weightWetSoil: number;
  vSoil: number;
  wetDensity: number;
  dryDensity: number;
  fieldCompaction: number;
  isPassed: boolean;
}
