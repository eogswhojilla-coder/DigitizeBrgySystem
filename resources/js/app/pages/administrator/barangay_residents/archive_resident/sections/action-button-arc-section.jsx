import Button from '@/app/_components/button'
import React from 'react'

export default function ActionButtonArcSection() {
  return (
    <div>
      <div className="flex gap-3 justify-end">
        <Button>
          Search
        </Button>
        <Button
        variant="danger"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
