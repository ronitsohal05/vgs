

function UserListings() {
  const listings = [
    {
      title: "Textbook: Intro to Programming",
      price: "$25",
      image: "/book.jpg",
    },
    {
      title: "Laptop: Dell XPS 13",
      price: "$600",
      image: "/laptop.jpg",
    },
    {
      title: "Tutoring: Calculus I",
      price: "$20/hr",
      image: "/tutoring.jpg",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {listings.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <img
            src={item.image}
            alt={item.title}
            className="h-40 w-full object-cover rounded"
          />
          <h3 className="mt-2 font-semibold">{item.title}</h3>
          <p className="text-blue-600">{item.price}</p>
        </div>
      ))}
    </div>
  );
}

export default UserListings;
