import React from 'react'

const Page = async () => {

    const models = await fetch(`${process.env.API_URL}/all_models`, { next: { revalidate: 0 } }).then((res) => res.json());
    console.log(models)
    return (
        <div>
            <h1>Models</h1>
            <ul>
                {models.map((model) => (
                    <li key={model.id}>
                        {model.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Page