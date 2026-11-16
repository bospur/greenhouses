import { useParams } from 'react-router';
import { ProductDetails } from '@/modules/catalog';
import { Container } from '@/shared/ui';

export function ProductScreen() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <Container>
      <ProductDetails key={slug} slug={slug} />
    </Container>
  );
}
