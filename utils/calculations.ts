
import { GlobalConstants, TestPoint, CalculationResult } from '../types';

export const calculateTestResult = (
  test: TestPoint,
  constants: GlobalConstants
): CalculationResult => {
  const { bulkDensitySand, weightSandInCone, specificGravityParticles, maxDryDensity, compactionThreshold } = constants;
  const { w1, w2, w3, w4, moistureContent } = test;

  // 1. Weight of sand in hole: (W1 - W2) - W_c
  const weightSandInHole = Math.max(0, (w1 - w2) - weightSandInCone);

  // 2. Volume of test hole (V_total): Wt. sand in hole / Bulk Density of Sand
  const vTotal = bulkDensitySand > 0 ? weightSandInHole / bulkDensitySand : 0;

  // 3. Volume of stones (V_stone): Wt. wet stone / G_s
  const vStone = specificGravityParticles > 0 ? w4 / specificGravityParticles : 0;

  // 4. Weight of wet soil: w3 - w4
  const weightWetSoil = w3 - w4;

  // 5. Volume of soil (V_soil): V_total - V_stone
  const vSoil = vTotal - vStone;

  // 6. Wet Density: Wt. wet soil / V_soil
  const wetDensity = vSoil > 0 ? weightWetSoil / vSoil : 0;

  // 7. Dry Density: Wet Density / (1 + (Moisture Content / 100))
  const dryDensity = wetDensity / (1 + moistureContent / 100);

  // 8. Field Compaction (%): (Dry Density / MDD) * 100
  const fieldCompaction = maxDryDensity > 0 ? (dryDensity / maxDryDensity) * 100 : 0;

  const isPassed = fieldCompaction >= compactionThreshold;

  return {
    weightSandInHole,
    vTotal,
    vStone,
    weightWetSoil,
    vSoil,
    wetDensity,
    dryDensity,
    fieldCompaction,
    isPassed
  };
};
