import { PopularProducts } from '@/modules/catalog';
import { CtaBanner, DeliveryBlock, Features, Hero, HowItWorks, TrustBar } from '@/modules/home';

export function HomeScreen() {
  return (
    <>
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
