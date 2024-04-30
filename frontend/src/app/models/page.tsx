import React from 'react'
import ModelTable from '@/components/modelTable';
import ModelSelection from '@/components/modelSelection';


const Page = async () => {

    const data = await fetch(`${process.env.API_URL}/all_models`, { next: { revalidate: 0 } }).then((res) => res.json());
    return (
        <ModelSelection models={data.models} saved_models={data.saved_ids}/>
    )
}

export default Page