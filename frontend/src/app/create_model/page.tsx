import React from 'react';
import CreateModelForm from '@/components/createModelForm';

const Page = async () => {
    
    const settings = await fetch(`${process.env.API_URL}/model_settings`, { next: { revalidate: 0 } }).then(res => res.json());
    return (
        <CreateModelForm settings={settings}  />
    );
};

export default Page;