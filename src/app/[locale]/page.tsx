import { getTranslations } from 'next-intl/server';
import Home from '@/components/IndexPageClient';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  return {
    title: t('title'),
  };
}

export default function Index() {
  return (
    <div className="py-5 [&_p]:my-6">
      <Home />
    </div>
  );
}
