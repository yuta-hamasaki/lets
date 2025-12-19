

const dummy =[
    {
        id:1,
        name:"Circle 1",
        description:"This is circle 1"
    },
    {
        id:2,
        name:"Circle 2",
        description:"This is circle 2"
    },
    {
        id:3,
        name:"Circle 3",
        description:"This is circle 3"
    }
]
export default function page() {

    return (
    <div>
        Find Circle
        <div className='flex items-center justify-center flex-wrap gap-2 m-4'>
            {/* Card  TODO: Make it components*/}
            {dummy.map((circle)=>(
            <div key={circle.id} className="w-full p-4 border mb-4 rounded-md">
                <h2>{circle.name}</h2>
                <p>{circle.description}</p>
            </div>
            ))
            }
        </div>
    </div>
    )
}
