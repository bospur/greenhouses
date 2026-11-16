import { PopularProducts } from '@/modules/catalog';
import { CtaBanner, DeliveryBlock, Features, Hero, HowItWorks, TrustBar } from '@/modules/home';
import { PageMeta } from '@/shared/ui';

export function HomeScreen() {
  return (
    <>
      <PageMeta />
      <Hero />
      <TrustBar />
      <Features />
      <PopularProducts />
      <HowItWorks />
      <DeliveryBlock />
      <CtaBanner />
    </>
  );
}
