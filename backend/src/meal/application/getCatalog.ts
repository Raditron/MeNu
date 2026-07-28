import { CatalogRepository } from "../domain/catalog/CatalogRepository.js";
import Catalog from "../domain/value-objects/Catalog.js";

export class GetCatalog {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(): Promise<Catalog> {
    const meatTypes = await this.catalogRepository.getMeatTypes();
    const sideTypes = await this.catalogRepository.getSideTypes();
    const cuisineStyles = await this.catalogRepository.getCuisineStyles();
    const flavorProfiles = await this.catalogRepository.getFlavorProfiles();

    return new Catalog(meatTypes, sideTypes, cuisineStyles, flavorProfiles);
  }
}
