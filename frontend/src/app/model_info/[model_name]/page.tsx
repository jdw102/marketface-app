import React from 'react'

interface ModelData {
    name: string;
    type: string;
    stock: string;
    features: string[];
    epochs: number;
    window_size: number;
}


const Page = async ({ params }: { params: { model_name: string } }) => {

    const model_data = await fetch(`http://127.0.0.1:5000/model?model_name=${params.model_name}`, { next: { revalidate: 0 } }).then((res) => res.json());
    return (
        <div>{model_data.name}</div>
    )
}

export default Page