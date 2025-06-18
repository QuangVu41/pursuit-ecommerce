import Hero from '@/components/home/hero/Hero';
import Newsletter from '@/components/home/other/Newsletter';
import ProdPreviewSection from '@/components/home/products/ProdPreviewSection';
import ProdSaleSection from '@/components/home/products/ProdSaleSection';
import { getNewProducts, getRatedProducts } from '@/services/products';

const Home = async () => {
  const ratedProduct = await getRatedProducts();
  const newProducts = await getNewProducts();

  return (
    <>
      <Hero />
      <ProdSaleSection products={ratedProduct} />
      <ProdPreviewSection
        title='Our popular products'
        description='Browse our most popular products and make your day more beautiful and glorious.'
        buttonLink='/products'
        products={ratedProduct}
      />
      <ProdPreviewSection
        title='Our new products'
        description='Browse our most popular products and make your day more beautiful and glorious.'
        buttonLink='/products'
        products={newProducts}
      />
      <ProdPreviewSection
        title='Meet our best sellers'
        description='Browse our most popular products and make your day more beautiful and glorious.'
        buttonLink='/products'
        products={newProducts}
      />
      <Newsletter />
    </>
  );
};

export default Home;
