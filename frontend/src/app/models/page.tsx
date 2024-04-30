import React from 'react'
import ModelTable from '@/components/modelTable';


const Page = async () => {

    const models = await fetch(`${process.env.API_URL}/all_models`, { next: { revalidate: 0 } }).then((res) => res.json());
    return (
        <ModelTable models={models} />
    )
}

export default Page