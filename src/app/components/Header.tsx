import React from 'react'
import { Button } from "@/components/ui/button"

const Header: React.FC = () => {
  return (
    <header className="border-b">
      <div className="flex h-14 items-center px-4 gap-4">
        <div className="flex-1">
          <span className="font-semibold">Deployment Assistant</span>
        </div>
        <Button variant="outline" size="sm">Sign in</Button>
        <Button size="sm">Sign up</Button>
      </div>
    </header>
  )
}

export default Header

