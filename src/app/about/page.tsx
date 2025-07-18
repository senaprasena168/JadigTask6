export default function About() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='text-center max-w-2xl'>
        <h1 className='text-4xl md:text-5xl font-bold mb-6 text-blue-600'>
          About This Project
        </h1>
        <div className='bg-blue-100 p-6 rounded-lg mb-6'>
          <p className='text-lg mb-4 text-gray-800'>
            This is an amazing Next.js learning project that demonstrates modern
            web development practices.
          </p>
          <p className='text-base text-gray-700 mb-4'>
            This website demonstrates:
          </p>
          <ul className='text-left space-y-2 text-gray-700'>
            <li>✅ Static routing capabilities</li>
            <li>✅ Dynamic page generation</li>
            <li>✅ Responsive design principles</li>
            <li>✅ Modern web development</li>
            <li>✅ Professional navigation</li>
          </ul>
        </div>
        <div className='bg-green-100 p-4 rounded-lg'>
          <p className='text-sm text-green-800'>
            Built with dedication and modern web technologies. A proud
            achievement in learning Next.js!
          </p>
        </div>
      </div>
    </main>
  );
}
