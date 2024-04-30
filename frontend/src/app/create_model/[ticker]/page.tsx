import React from 'react';
import CreateModelForm from '@/components/createModelForm';

const Page = async ({ params }: { params: { ticker: string } }) => {
    
    const settings = await fetch(`${process.env.API_URL}/model_settings`, { next: { revalidate: 0 } }).then(res => res.json());
    return (
        <CreateModelForm settings={settings} ticker={params.ticker}/>
    );
};

export default Page;