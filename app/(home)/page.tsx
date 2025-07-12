import Hero from '@/components/home/hero/Hero';
import CategorySection from '@/components/home/others/CategorySection';
import Newsletter from '@/components/home/others/Newsletter';
import ProdPreviewSection from '@/components/home/products/ProdPreviewSection';
import ProdSaleSection from '@/components/home/products/ProdSaleSection';
import { getBestSellingProducts, getNewProducts, getRatedProducts } from '@/services/products';

const Home = async () => {
  const ratedProduct = await getRatedProducts();
  const newProducts = await getNewProducts();
  const bestSellingProducts = await getBestSellingProducts();

  return (
    <>
      <Hero />
      <CategorySection />
      <ProdSaleSection products={newProducts} />
      <ProdPreviewSection
        title='Our popular products'
        description='Browse our most popular products and make your day more beautiful and glorious.'
        buttonLink='/products?sortBy=rated'
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
        buttonLink='/products?sortBy=best-selling'
        products={bestSellingProducts}
      />
      <Newsletter />
    </>
  );
};

export default Home;
