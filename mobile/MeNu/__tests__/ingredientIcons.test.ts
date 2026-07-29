import { getIngredientIconPath, INGREDIENT_ICON_VIEW_BOX } from '../meal/utils/ingredientIcons';

/** Mirrors the curated key set in `frontend/src/meal/utils/ingredientIcons.ts` (ADR-0004). */
const CURATED_KEYS = [
  'GiAcorn',
  'GiBacon',
  'GiBeanstalk',
  'GiBellPepper',
  'GiBison',
  'GiBowlOfRice',
  'GiBread',
  'GiBreadSlice',
  'GiBroccoli',
  'GiButterToast',
  'GiCannedFish',
  'GiCarrot',
  'GiCheeseWedge',
  'GiChestnutLeaf',
  'GiChicken',
  'GiChickenLeg',
  'GiCorn',
  'GiCow',
  'GiCrab',
  'GiCrabClaw',
  'GiCube',
  'GiCurledLeaf',
  'GiDeerHead',
  'GiDuck',
  'GiDumpling',
  'GiDumplingBao',
  'GiFastNoodles',
  'GiFishBucket',
  'GiFishScales',
  'GiFishSmoking',
  'GiFlatfish',
  'GiFrenchFries',
  'GiFriedEggs',
  'GiFriedFish',
  'GiGarlic',
  'GiGoat',
  'GiGrain',
  'GiGrainBundle',
  'GiHerbsBundle',
  'GiLeafSwirl',
  'GiManualMeatGrinder',
  'GiMeat',
  'GiMeatCleaver',
  'GiMeatHook',
  'GiMussel',
  'GiNoodles',
  'GiOctopus',
  'GiPig',
  'GiPineapple',
  'GiPopcorn',
  'GiPotato',
  'GiPretzel',
  'GiRabbit',
  'GiRiceCooker',
  'GiRoastChicken',
  'GiSalmon',
  'GiSausage',
  'GiSausagesRibbon',
  'GiScallop',
  'GiSchoolOfFish',
  'GiSheep',
  'GiShrimp',
  'GiSlicedBread',
  'GiSlicedSausage',
  'GiSteak',
  'GiTomato',
  'GiTripleCorn',
  'GiTropicalFish',
  'GiVineLeaf',
  'GiWheat',
];

describe('ingredientIcons', () => {
  it('resolves path data for every curated catalog icon key', () => {
    for (const key of CURATED_KEYS) {
      const path = getIngredientIconPath(key);
      expect(path).toEqual(expect.any(String));
      expect(path!.length).toBeGreaterThan(0);
    }
  });

  it('returns undefined for a key not in the curated set', () => {
    expect(getIngredientIconPath('GiNotARealIcon')).toBeUndefined();
  });

  it('shares a single 512x512 viewBox across the curated set', () => {
    expect(INGREDIENT_ICON_VIEW_BOX).toBe('0 0 512 512');
  });
});
