function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {currentYear} PictureIt. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer