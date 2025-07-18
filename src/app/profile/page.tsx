export default function Profile() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='text-center max-w-2xl'>
        <h1 className='text-4xl md:text-5xl font-bold mb-6 text-green-600'>
          Developer Profile
        </h1>

        <div className='bg-green-100 p-6 rounded-lg mb-6'>
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold mb-4 text-green-800'>
              Developer Information:
            </h2>
            <div className='space-y-3 text-left text-gray-800'>
              <div className='flex justify-between'>
                <span className='font-semibold'>GitHub:</span>
                <a
                  href='https://github.com/senaprasena168/JadigTask2.git'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:text-blue-800 underline'
                >
                  https://github.com/senaprasena168/JadigTask2.git
                </a>
              </div>
              <div className='flex justify-between'>
                <span className='font-semibold'>Project:</span>
                <span>Jabar Istimewa Digital Academy - Task 3</span>
              </div>
            </div>
          </div>

          <div className='bg-blue-100 p-4 rounded-lg'>
            <h3 className='text-lg font-semibold mb-2 text-blue-800'>
              Project Achievements:
            </h3>
            <ul className='text-sm space-y-1 text-left text-gray-800'>
              <li>🏆 Successful routing implementation</li>
              <li>🏆 Beautiful responsive design</li>
              <li>🏆 Professional navigation system</li>
              <li>🏆 Dynamic page generation</li>
              <li>🏆 Custom 404 page with personality</li>
              <li>🏆 RESTful API endpoints implementation</li>
              <li>🏆 Full CRUD operations (Create, Read, Update, Delete)</li>
              <li>🏆 API integration with frontend</li>
              <li>🏆 Admin dashboard for product management</li>
              <li>🏆 Server-side data handling</li>
            </ul>
          </div>
        </div>

        <p className='text-sm text-gray-600'>
          Proud of this learning project and the growth achieved through
          building it!
        </p>
      </div>
    </main>
  );
}
