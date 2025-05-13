import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | Optisizer</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-max mx-auto text-center">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">404 error</p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <div className="mt-6">
              <Link href="/">
                <span className="text-base font-medium text-primary hover:text-primary-dark">
                  Go back home<span aria-hidden="true"> &rarr;</span>
                </span>
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}