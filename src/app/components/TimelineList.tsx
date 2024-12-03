import { Button, message } from 'antd';
import React from 'react'
import { useFormContext } from 'react-hook-form';

interface TimelineListProps {
    onEdit: (id: string) => void;
}
const TimelineList = (props: TimelineListProps) => {
    const { getValues, setValue } = useFormContext();
    const allTimeline = (getValues("properties.timeline"))
    // console.log(allTimeline)

    const handleDelete = (index: number) => {
        const updatedTimeline = allTimeline.filter((_: any, i: number) => i !== index);
        setValue("properties.timeline", updatedTimeline);
        message.success("Timeline deleted successfully!");
    }
  return (
    <div className='flex flex-col gap-2'>
        {allTimeline.map((timeline:any, index:any) => {
            return (
                <div key={index} className='flex border p-6 items-center justify-between'>
                    <span>{timeline.general.name}</span>
                    <div className='flex gap-2'>
                        <Button onClick={()=>props.onEdit(timeline.general.id)}>Edit</Button>
                        <Button danger onClick={() => handleDelete(index)}>Delete</Button>
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export default TimelineList