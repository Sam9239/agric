import { useParams } from 'react-router';
import { categorySlugToKey } from '@contracts/seo-content';
import ProductCategory from './ProductCategory';
import ProductDetail from './ProductDetail';

export default function ProductRoute() {
  const { id } = useParams<{ id: string }>();

  if (id && categorySlugToKey[id]) {
    return <ProductCategory categoryKey={categorySlugToKey[id]} />;
  }

  return <ProductDetail />;
}

