CREATE UNIQUE INDEX unique_product_variant_without_second_attr
  ON "product_variants" ("productId", "firstAttrId")
  WHERE "secondAttrId" IS NULL;