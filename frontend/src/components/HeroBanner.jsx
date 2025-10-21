function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white mx-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Picture It: Together, Anywhere.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-indigo-100">
            Bring any two people together in a brand new scene. Just upload their photos, pick a gesture and a setting, and let our AI create a magical new picture for you.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="inline-block bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-50 transition-colors duration-300"
            >
              Create Your Picture
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;