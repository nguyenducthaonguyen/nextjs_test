import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
  };
}

export default function Index() {
  const t = useTranslations('Index');

  return (
    <div className="py-5 [&_p]:my-6">
      <h1 className="text-3xl font-bold">{t('coming_soon')}</h1>
    </div>
  );
}
