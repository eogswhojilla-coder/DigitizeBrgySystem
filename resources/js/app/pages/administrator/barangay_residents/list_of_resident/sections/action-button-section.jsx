import Button from '@/app/_components/button'
import React from 'react'

export default function ActionButtonSection() {
  return (
    <div>
         {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
         <Button>Search</Button>

         <Button
         variant="danger"
         >
          
          Reset
          
          </Button>

        </div>
    </div>
  )
}
