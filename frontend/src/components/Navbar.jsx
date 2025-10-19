function Navbar() {
  return (
    <nav className="bg-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Name */}
          <div className="flex-shrink-0">
            <span className="text-white font-bold text-2xl cursor-pointer">PictureIt</span>
          </div>

          {/* The rest of the navbar is empty as requested */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Links can be added here in the future */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;