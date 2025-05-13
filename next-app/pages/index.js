import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/auth'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import ImageUploader from '../components/image-uploader'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Optisizer - Advanced Image Resizing Tool</title>
        <meta name="description" content="Resize your images with precision for any platform while maintaining quality" />
        <meta property="og:title" content="Optisizer - Advanced Image Resizing Tool" />
        <meta property="og:description" content="Resize your images with precision for any platform while maintaining quality" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              <span className="text-primary">Opti</span><span className="text-black">sizer</span> - Advanced Image Resizing
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Resize your images with precision for any platform while maintaining quality
            </p>
          </div>
          
          <ImageUploader />
        </main>
        
        <Footer />
      </div>
    </>
  )
}