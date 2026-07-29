import { useEffect, useState } from 'react';

import type { Catalog } from '@menu/domain/types/catalog';
import { getCatalog } from '../api';

const emptyCatalog: Catalog = { meatTypes: [], sideTypes: [], cuisineStyles: [], flavorProfiles: [] };

export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog>(emptyCatalog);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCatalog().then((result) => {
      setCatalog(result);
      setLoading(false);
    });
  }, []);

  return { catalog, loading };
}
