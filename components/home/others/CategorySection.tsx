import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import HomeSectionHeader from '@/components/common/HomeSectionHeader';
import SectionContent from '@/components/common/SectionContent';
import { getAllCategories } from '@/services/categories';
import { Category } from '@prisma/client';
import CategoryCarousel from './CategoryCarousel';

const CategorySection = async () => {
  const categories = (await getAllCategories()).reduce<Category[][]>((res, cate) => {
    if (res.length && res[res.length - 1].length === 2) res.push([cate]);
    else if (res.length && res[res.length - 1].length < 2) res[res.length - 1].push(cate);
    else res.push([cate]);
    return res;
  }, []);

  return (
    <HomeSectionContainer>
      <HomeSectionHeader title='Explore, find exactly what you need' />
      <SectionContent className='mt-10'>
        <CategoryCarousel categories={categories} />
      </SectionContent>
    </HomeSectionContainer>
  );
};

export default CategorySection;
