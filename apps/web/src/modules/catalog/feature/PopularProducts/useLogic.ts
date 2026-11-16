import { useProductsQuery } from '@/data/repositories/catalog';
import { getApiErrorMessage } from '@/shared/utils';

const SKELETON_COUNT = 3;

export function usePopularProductsLogic() {
  const { data = [], isPending, isError, error, refetch } = useProductsQuery({ popular: true });

  return {
    products: data,
    isLoading: isPending,
    isError,
    errorMessage: getApiErrorMessage(error),
    skeletonCount: SKELETON_COUNT,
    retry: () => void refetch(),
  };
}
