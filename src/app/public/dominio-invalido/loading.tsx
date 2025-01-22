import { Card } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8">
        <div className="text-center animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
        </div>
      </Card>
    </div>
  )
}
